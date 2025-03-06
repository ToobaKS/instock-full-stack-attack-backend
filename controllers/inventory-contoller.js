import knex from "../knexfile.js";

const addInventory = async (req, res) => {
  try {
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

export { addInventory };
