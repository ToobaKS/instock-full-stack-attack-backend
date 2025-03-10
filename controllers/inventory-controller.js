import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const addInventory = async (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  try {
    const warehouseExists = await knex("warehouses")
      .where({ id: warehouse_id })
      .first();
    if (!warehouseExists) {
      return res.status(400).json({ message: "Invalid warehouse_id." });
    }

    const result = await knex("inventories").insert(req.body);
    const newInventoryId = result[0];

    const newInventory = await knex("inventories").where({
      id: newInventoryId,
    });

    res.status(201).json(newInventory);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to create new inventory item: ${error}` });
  }
};

const getInventories = async (req, res) => {
  try {
    let query = knex("inventories")
      .select("inventories.*", "warehouses.warehouse_name")
      .leftJoin("warehouses", "inventories.warehouse_id", "warehouses.id");

    if (req.query.s) {
      const searchTerm = `%${req.query.s.toLowerCase()}%`;
      query = query.where(function() {
        this.whereRaw("LOWER(inventories.item_name) LIKE ?", [searchTerm])
          .orWhereRaw("LOWER(inventories.description) LIKE ?", [searchTerm])
          .orWhereRaw("LOWER(inventories.category) LIKE ?", [searchTerm])
          .orWhereRaw("LOWER(warehouses.warehouse_name) LIKE ?", [searchTerm]);
      });
    }

    if (req.query.sort_by) {
      const validColumns = [
        "item_name", 
        "category", 
        "status", 
        "quantity",
        "warehouse_name"
      ];
      
      const column = req.query.sort_by;
      if (validColumns.includes(column)) {
        const order = req.query.order_by === "desc" ? "desc" : "asc";
        query = query.orderBy(column, order);
      }
    }

    const results = await query;
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};

const getInventoryItem = async (req, res) => {
  const inventoryId = req.params.id;

  try {
    const inventoryItem = await knex("inventories")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where("inventories.id", inventoryId)
      .first();

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ message: `Inventory item with ID ${inventoryId} not found.` });
    }
    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve inventory item with ID ${inventoryId}: ${error}`,
    });
  }
};

const deleteInventory = async (req, res) => {
  const inventoryId = req.params.id;

  try {
    const inventoryItem = await knex("inventories")
      .where({ id: inventoryId })
      .first();

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ message: `Inventory item with ID ${inventoryId} not found.` });
    }
    await knex("inventories").where({ id: inventoryId }).del();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete inventory item with ID ${inventoryId}: ${error}`,
    });
  }
};

const editInventory = async (req, res) => {
  const { id } = req.params;
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  try {
    // Check if the inventory item exists
    const inventoryItem = await knex("inventories").where({ id }).first();
    if (!inventoryItem) {
      return res.status(404).json({
        message: `Inventory item with ID ${id} not found.`,
      });
    }

    // Check if the warehouse exists
    const warehouseExists = await knex("warehouses")
      .where({ id: warehouse_id })
      .first();
    if (!warehouseExists) {
      return res.status(400).json({ message: "Invalid warehouse_id." });
    }

    // Update inventory item
    await knex("inventories").where({ id }).update({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
      updated_at: knex.fn.now(),
    });

    // Fetch and return the updated inventory item
    const updatedInventory = await knex("inventories").where({ id }).first();
    res.status(200).json(updatedInventory);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update inventory item with ID ${id}: ${error}`,
    });
  }
};

export {
  addInventory,
  getInventories,
  getInventoryItem,
  deleteInventory,
  editInventory,
};
