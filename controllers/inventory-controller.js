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
    const data = await knex("inventories");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).send(`Error retrieving inventories: ${error}`);
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

export { addInventory, getInventories, deleteInventory };
