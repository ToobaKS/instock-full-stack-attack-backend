import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const getAll = async (_req, res) => {
    try {
      const data = await knex("warehouses");
      res.status(200).json(data);
    } catch (err) {
      res.status(400).send(`Error retrieving warehouses: ${err}`);
    }
  };

const findOne = async (req, res) => {
  try {
    const warehouseFound = await knex("warehouses").where({ id: req.params.id });

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

const deleteWarehouse = async(req, res) => {
  const warehouseId = req.params.id;
  try {
    const warehouseFound = await knex("warehouses").where({ id: warehouseId });
    if (warehouseFound.length === 0) {
      return res.status(404).json({
        message:`Warehouse with ID ${warehouseId} not found`,
      });
    }
    await knex("inventories").where({ warehouse_id: warehouseId }).del();
    await knex("warehouses").where({ id:warehouseId }).del();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete warehouse with ID ${warehouseId}: ${error}`,
    });
  }
}


export { getAll, findOne, deleteWarehouse };