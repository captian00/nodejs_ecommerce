"use strict";
const mongoose = require("mongoose");

const {
  db: { host, name, port },
} = require("../configs/config.mongodb");
const connectString = `mongodb://${"127.0.0.1"}:${port}/${name}`;
console.log("connect: ", connectString);
class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongodb") {
    if (true) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString)
      .then((_) => {
        console.log("Connect MongoDB success");
      })
      .catch((err) => {
        console.log("Connect DB Error", err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
