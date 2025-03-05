import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const getAll = async (_req, res) => {
    try {
      const data = await knex("warehouses");
      res.status(200).json(data);
    } catch (err) {
      res.status(400).send(`Error retrieving Users: ${err}`);
    }
  };

  export { getAll };