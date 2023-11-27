"user strict";

const CheckoutService = require("../services/checkout.service");
const { SuccessRespone } = require("../core/success.response");
class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessRespone({
      message: "Checkout success",
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
