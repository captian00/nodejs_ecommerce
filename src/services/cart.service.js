"use strict";

const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");
class CartService {
  //start  repo cart
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const option = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, option);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        cart_state: "active",
        "cart_products.productId": productId,
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      option = { upsert: true, new: true };

    //start them
    const userCart = await cart.findOne({ cart_userId: userId });
    const listProductInCart = userCart.cart_products;
    console.log({ listProductInCart });
    const findProductInCart = listProductInCart.find(
      (product) => product.productId.toString() === productId.toString()
    );

    if (!findProductInCart) {
      const newListProduct = [...listProductInCart, product];
      return await cart.findOneAndUpdate(
        { cart_userId: userId, cart_state: "active" },
        {
          cart_products: newListProduct,
        }
      );
    }
    //end them
    return await cart.findOneAndUpdate(query, updateSet, option);
  }

  //end repo cart

  static async addToCart({ userId, product = {} }) {
    // check cart exist
    const userCart = await cart.findOne({ cart_userId: userId });

    if (!userCart) {
      // create cart
      return await CartService.createUserCart({ userId, product });
    }

    // if cart exist but empty product
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // if cart exist but not empty product ==> update quantity product

    return await CartService.updateUserCartQuantity({ userId, product });
  }

  //update cart
  static async addToCartV2({ userId, shop_order_ids = [] }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    const foundProduct = await getProductById({ productId });

    if (!foundProduct) throw new NotFoundError("Product not exist");

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError("Product not belong to Shop");

    if (quantity === 0) {
      //delete product
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  //delete cart
  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };
    const deleteCart = await cart.updateOne(query, updateSet);

    return deleteCart;
  }

  //get list
  static async getListUserCart({ userId }) {
    return await cart.findOne({ cart_userId: +userId }).lean();
  }
}

module.exports = CartService;
