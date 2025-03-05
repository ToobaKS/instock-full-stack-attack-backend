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

  export { getAll, findOne };