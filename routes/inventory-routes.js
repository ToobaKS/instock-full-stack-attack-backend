import express from 'express';
import * from "../controllers/inventory-contoller";

const router = express.Router();

router
    .route("/api/inventories")
    .get()