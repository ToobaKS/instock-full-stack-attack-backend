import knex from "../knexfile.js";

const validateInventory = async (req, res, next) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  if (
    !warehouse_id ||
    !item_name ||
    !description ||
    !category ||
    !status ||
    !quantity
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const warehouseExists = await knex("warehouses").where({ id: warehouse_id });
  if (!warehouseExists) {
    return res
      .status(400)
      .json({ message: "Invalid warehouse_id. Warehouse does not exist." });
  }

  if (isNaN(quantity)) {
    return res.status(400).json({ message: "Quantity must be a number." });
    }
    
  next();
};

export default validateInventory;
