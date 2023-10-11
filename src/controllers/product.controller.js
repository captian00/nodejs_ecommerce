"use strict";

const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.stategy.service");

const { SuccessRespone } = require("../core/success.response");
class ProductController {
  // createProduct = async (req, res, next) => {
  //   new SuccessRespone({
  //     message: "Create product success",
  //     metadata: await ProductService.createProduct(req.body.product_type, {
  //       ...req.body,
  //       product_shop: req.user.userId,
  //     }),
  //   }).send(res);
  // };

  //stategy
  createProduct = async (req, res, next) => {
    new SuccessRespone({
      // stategy
      message: "Create product success",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessRespone({
      // stategy
      message: "publishProductByShop success",
      metadata: await ProductServiceV2.publicProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };
  unPublishProductByShop = async (req, res, next) => {
    new SuccessRespone({
      // stategy
      message: "unPublishProductByShop success",
      metadata: await ProductServiceV2.unPublicProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  //query
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessRespone({
      message: "getAllDraftsForShop success",
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishedForShop = async (req, res, next) => {
    new SuccessRespone({
      message: "getAllPublishedForShop success",
      metadata: await ProductServiceV2.findAllPublishedForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
