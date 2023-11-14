"use strict";
const { model, Schema } = require("mongoose"); // Erase if already required

const COLLECTION_NAME = "Inventory";
const DOCUMENT_NAME = "Inventories";
// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
    inven_location: { type: String, default: "unKnow" },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inven_reservatiopn: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = { inventory: model(DOCUMENT_NAME, inventorySchema) };
