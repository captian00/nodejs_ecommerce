"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("../services/keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInforData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const ROLE_SHOP = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  /* 
    1 check email
    2 match password
    3 create AT, RT + save
    4 generate Tk
    5 get data login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    //1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registed !!");
    //2
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication errors");

    //3
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    console.log("key gen:::: login", { privateKey, publicKey }); // save collection Key Store
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      refreshToken: tokens.refeshToken,
      publicKey,
      privateKey,
    });

    return {
      shop: getInforData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const hodelShop = await shopModel.findOne({ email }).lean();
    if (hodelShop) {
      // return {
      //   code: "xxxx",
      //   message: "email exist",
      // };
      throw new BadRequestError("Error: Shop already register");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password,
      roles: [ROLE_SHOP.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      console.log("key gen:::: signup", { privateKey, publicKey }); // save collection Key Store
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log("tokens: ", tokens);
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey, //update
        refreshToken: tokens.refeshToken, //update
      });
      if (!keyStore) {
        throw new BadRequestError("Error: Shop already register");
      }

      return {
        code: 201,
        metadata: {
          shop: getInforData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };

  static logout = async (keyStore) => {
    const delKey = KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static handleRefreshToken = async (refeshToken) => {
    /* 
      check token used
    */

    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refeshToken
    );
    if (foundToken) {
      //decode ==> user la ai

      const { userId, email } = await verifyJWT(
        refeshToken,
        foundToken.privateKey
      );
      //xoa

      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Some things wrong...");
    }

    // chua co
    const holderToken = await KeyTokenService.findByRefreshToken(refeshToken);
    if (!holderToken) throw new AuthFailureError("Shop not registed");

    //verify token
    const { userId, email } = await verifyJWT(
      refeshToken,
      holderToken.privateKey
    );

    //check userID

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registed");

    //create new tokens
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    //update token

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refeshToken,
      },
      $addToSet: {
        refreshTokensUsed: refeshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };
}

module.exports = AccessService;
