import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js";
import { validateInventorySearch, validateInventory } from "../middleware/validateInventory.js";

const router = express.Router();

router
  .route("/api/inventories")
  .get(validateInventorySearch, inventoryController.getInventories)
  .post(validateInventory, inventoryController.addInventory);

router
  .get("/api/inventories/:id", inventoryController.getInventoryItem)
  .delete("/api/inventories/:id", inventoryController.deleteInventory)
  .put(
    "/api/inventories/:id",
    validateInventory,
    inventoryController.editInventory
  );

export default router;
