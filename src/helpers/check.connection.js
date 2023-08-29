"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;
//count connection
const countConnect = () => {
  const countConnection = mongoose.connections.length;
  console.log(`Connection: ${countConnection}`);
};

//check overload

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const MAX_CONNECTION = 5;
    // console.log(`Memory: ${memoryUsage / 1024 / 1024} MB`);
    // console.log(`numCores: ${numCores}`);
    if (numConnection > MAX_CONNECTION) {
      console.log("OverLoad");
    }
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverload,
};
