"use strict";

const { model, Schema } = require("mongoose");
const COLLECTION_NAME = "Order";
const DOCUMENT_NAME = "Orders";

var orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: "#18062000" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "canceled", "delivered"],
      default: "pending",
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = {
  order: model(DOCUMENT_NAME, cartSchema),
};
