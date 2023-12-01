"use strict";

const { BadRequestError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventorySevice {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "London England",
  }) {
    const product = await getProductById(productId);
    if (!product) {
      throw new BadRequestError("The Product does not exist");
    }
    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = { upsert: true, new: true };

    return inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventorySevice;
