"use strict";

const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");

const { getDiscountAmount } = require("../services/discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const { order } = require("../models/order.model");

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    //check cartId
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart not exist!!!");
    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    //tinh tong tien

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      //check product avaiable

      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0]) {
        throw new BadRequestError("Order wrong");
      }
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // tong tien trc khi xu ly
      checkout_order.totalPrice += checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      //check discount

      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });
        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return { shop_order_ids, shop_order_ids_new, checkout_order };
  }

  // order
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    //check xem spham vuot ton kho ko?
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log("productsss::: ", products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireLock.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    //check lai neu co spham het hang
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Mot so spham da duoc cap nhat. Vui long ktra lai"
      );
    }

    const newOrder = order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });
    // neu insert thanh cong ==> remove product in cart
    if (newOrder) {
    }

    return newOrder;
  }

  // Query order by user
  static async getOrdersByUser() {}

  // Query order by user use ID
  static async getOneOrderByUser() {}

  // Update order status ( admin | shop)
  static async updateOrderByStatusByShop() {}

  // Cancel order
  static async cancelOrderByUser() {}
}

module.exports = CheckoutService;
