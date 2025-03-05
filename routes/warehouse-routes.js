import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

router.route("/api/warehouses").get(warehouseController.getAll);
router
  .route("/api/warehouses/:id")
  .get(warehouseController.findOne)
  .delete(warehouseController.deleteWarehouse);

export default router;
