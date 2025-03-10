import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const getAll = async (req, res) => {
  try {
    let query = knex("warehouses").select("*");

    if (req.query.s) {
      const searchTerm = `%${req.query.s.toLowerCase()}%`;
      query.where(function () {
        this.whereRaw("LOWER(warehouse_name) LIKE ?", [searchTerm])
          .orWhereRaw("LOWER(address) LIKE ?", [searchTerm])
          .orWhereRaw("LOWER(city) LIKE ?", [searchTerm])
          .orWhereRaw("LOWER(country) LIKE ?", [searchTerm])
          .orWhereRaw("LOWER(contact_name) LIKE ?", [searchTerm])
          .orWhereRaw("LOWER(contact_position) LIKE ?", [searchTerm])
          .orWhereRaw("LOWER(contact_phone) LIKE ?", [searchTerm])
          .orWhereRaw("LOWER(contact_email) LIKE ?", [searchTerm]);
      });
    }

    if (req.query.sort_by) {
      const validColumns = [
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email",
      ];

      const column = req.query.sort_by;

      if (!validColumns.includes(column)) {
        return res.status(400).json({ message: "Invalid sort_by column" });
      }

      const order = req.query.order_by === "desc" ? "desc" : "asc";
      query = query.orderBy(column, order);
    }

    const results = await query;
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};

const findOneWarehouse = async (req, res) => {
  try {
    const warehouseFound = await knex("warehouses").where({
      id: req.params.id,
    });

    if (warehouseFound.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }

    const warehouseData = warehouseFound[0];
    res.json(warehouseData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve warehouse data for warehouse with ID ${req.params.id}`,
    });
  }
};

const deleteWarehouse = async (req, res) => {
  const warehouseId = req.params.id;
  try {
    const warehouseFound = await knex("warehouses").where({ id: warehouseId });
    if (warehouseFound.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${warehouseId} not found`,
      });
    }
    await knex("inventories").where({ warehouse_id: warehouseId }).del();
    await knex("warehouses").where({ id: warehouseId }).del();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete warehouse with ID ${warehouseId}: ${error}`,
    });
  }
};

const getWarehouseInventory = async (req, res) => {
  try {
    const warehouseId = req.params.id;
    let query = knex("inventories")
      .select("*")
      .where("warehouse_id", warehouseId);

    if (req.query.sort_by) {
      const validColumns = ["item_name", "category", "status", "quantity"];
      const column = req.query.sort_by;
      
      if (validColumns.includes(column)) {
        const order = req.query.order_by === "desc" ? "desc" : "asc";
        query = query.orderBy(column, order);
      }
    }

    const results = await query;
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory", error });
  }
};

const addWarehouse = async (req, res) => {
  try {
    const result = await knex("warehouses").insert(req.body);
    const newWarehouseId = result[0];
    const newWarehouse = await knex("warehouses").where({ id: newWarehouseId });

    res.status(201).json(newWarehouse);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to create new warehouse: ${error}` });
  }
};

const editWarehouse = async (req, res) => {
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
};

export {
  getAll,
  findOneWarehouse,
  deleteWarehouse,
  getWarehouseInventory,
  addWarehouse,
  editWarehouse,
};
