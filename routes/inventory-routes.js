import express from "express";
import * as inventoryController from "../controllers/inventory-contoller.js";
import validateInventory from "../middleware/validateInventory.js";

const router = express.Router();

router.post(
  "/api/inventories",
  validateInventory,
  inventoryController.addInventory
);

export default router;
