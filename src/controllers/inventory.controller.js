"user strict";

const InventorySevice = require("../services/inventory.service");
const { SuccessRespone } = require("../core/success.response");
class InventoryController {
  addStockToInventory = async (req, res, next) => {
    new SuccessRespone({
      message: "Add Stock succsess",
      metadata: await InventorySevice.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
