"use strict";

const express = require("express");
const InventoryController = require("../../controllers/inventory.controller");
const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication, authenticationV2 } = require("../../auth/authUtils");

router.use(authenticationV2);
router.post("", asyncHandler(InventoryController.addStockToInventory));

module.exports = router;
