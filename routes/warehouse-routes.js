import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

router.route("/").get(warehouseController.getAll);

router.route("/:id")
.get(warehouseController.findOne)
.delete(warehouseController.deleteWarehouse);

export default router;
