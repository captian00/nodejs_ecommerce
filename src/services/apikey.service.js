"use strict";

const apikeyModel = require("../models/apikey.model");
const crypto = require("crypto");

const finById = async (key) => {
  // const newKey = await apikeyModel.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   permission: ["0000"],
  // });
  // console.log("newKey: ", newKey);
  const objKey = await apikeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  finById,
};
