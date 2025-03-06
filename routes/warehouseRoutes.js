import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import express from "express";

const router = express.Router();

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    } = req.body;

    if (
      !warehouse_name ||
      !address ||
      !city ||
      !country ||
      !contact_name ||
      !contact_position ||
      !contact_phone ||
      !contact_email
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updatedWarehouse = await knex("warehouses").where({ id }).update({
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
      updated_at: knex.fn.now(),
    });

    if (!updatedWarehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    const warehouse = await knex("warehouses").where({ id }).first();

    res.status(200).json(warehouse);
  } catch (error) {
    console.error("Error updating warehouse:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
