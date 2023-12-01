"use strict";

const redis = require("redis");
const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

const redisClient = redis.createClient();
const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTimes = 3000;

  for (let i = 0; i < retryTimes; i++) {
    // create key
    const result = await setnxAsync(key, expireTimes);
    console.log("result:: ", result);
    if (result === 1) {
      //thao tac vs iventory
      const isReversation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReversation.modifiedCount) {
        await pexpire(key, expireTimes);

        return key;
      }

      return key;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);

  return await delAsyncKey;
};

module.exports = {
  releaseLock,
  acquireLock,
};
