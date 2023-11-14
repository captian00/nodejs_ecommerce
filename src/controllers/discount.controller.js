"use strict";
const DiscountService = require("../services/discount.service");

const { SuccessRespone } = require("../core/success.response");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessRespone({
      message: "Successful Code genarations",
      metadata: await DiscountService.createDiscount({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessRespone({
      message: "Successful get all discount codes",
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessRespone({
      message: "Successful get discount amount",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
        // shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodeByProduct = async (req, res, next) => {
    new SuccessRespone({
      message: "Successful get all discount codes by product",
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query,
        // shopId: req.user.userId,
      }),
    }).send(res);
  };

  //   getAllDiscountCodes = async (req, res, next) => {
  //     new SuccessRespone({
  //       message: "Successful get all discount codes",
  //       metadata: await DiscountService.getAllDiscountCodeByShop({
  //         ...req.query,
  //         shopId: req.user.userId,
  //       }),
  //     });
  //   };
}

module.exports = new DiscountController();
