"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessRespone } = require("../core/success.response");
class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Regiserted ok!!!",
      metadata: await AccessService.signUp(req.body),
      option: { limit: 10 },
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessRespone({
      message: "Login ok",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessRespone({
      message: "Logout ok",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  handleRefreshToken = async (req, res, next) => {
    new SuccessRespone({
      message: "get Token success",
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };
}

module.exports = new AccessController();
