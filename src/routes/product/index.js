"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);

router.get("", asyncHandler(productController.findAllProducts));

router.get("/:product_id", asyncHandler(productController.findProduct));

//authentication
router.use(authentication);

//create product
router.post("", asyncHandler(productController.createProduct));

//update product
router.patch("/:productId", asyncHandler(productController.updateProduct));

router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);

router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop)
);

//Query

router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishedForShop)
);

module.exports = router;
