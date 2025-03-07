import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";
import {validateWarehouse, validateSearchWarehouse} from "../middleware/validateWarehouse.js";

const router = express.Router();

router.route("/api/warehouses").
  get(validateSearchWarehouse, warehouseController.getAll);

router
  .route("/api/warehouses")
  .post(validateWarehouse, warehouseController.addWarehouse);

router
  .route("/api/warehouses/:id")
  .get(warehouseController.findOneWarehouse)
  .delete(warehouseController.deleteWarehouse)
  .put(warehouseController.editWarehouse)

router
  .route("/api/warehouses/:id/inventories")
  .get(warehouseController.getWareHouseInventory);

export default router;
