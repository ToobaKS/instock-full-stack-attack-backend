import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js";
import validateInventory from "../middleware/validateInventory.js";

const router = express.Router();

router
  .route("/api/inventories")
  .get(inventoryController.getInventories)
  .post(validateInventory, inventoryController.addInventory);

router.delete("/api/inventories/:id", inventoryController.deleteInventory);

export default router;
