"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");

//sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));

//login
router.post("/shop/login", asyncHandler(accessController.login));

//authentication
router.use(authentication);

//logout
router.post("/shop/logout", asyncHandler(accessController.logout));

// handle refresh token
router.post(
  "/shop/handleRefreshToken",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
