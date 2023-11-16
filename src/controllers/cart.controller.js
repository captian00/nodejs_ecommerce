"user strict";

const CartService = require("../services/cart.service");
const { SuccessRespone } = require("../core/success.response");
class CartController {
  //new
  addToCart = async (req, res, next) => {
    new SuccessRespone({
      message: "Create new cart success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  //update
  update = async (req, res, next) => {
    new SuccessRespone({
      message: "Update new cart success",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  //delete
  delete = async (req, res, next) => {
    new SuccessRespone({
      message: "Delete new cart success",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  //list
  listToCart = async (req, res, next) => {
    new SuccessRespone({
      message: "Get list cart success",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
