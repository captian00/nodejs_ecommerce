"use strict";

const _ = require("lodash");
const mongoose = require("mongoose");

const convertToObjectIdMongodb = (id) => new mongoose.Types.ObjectId(id);

const getInforData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefineObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });
  return obj;
};

const updateNestedObjParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "Object" && !Array.isArray(obj[k])) {
      const response = updateNestedObj(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = res[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};

module.exports = {
  getInforData,
  getSelectData,
  unGetSelectData,
  removeUndefineObject,
  updateNestedObjParser,
  convertToObjectIdMongodb,
};
