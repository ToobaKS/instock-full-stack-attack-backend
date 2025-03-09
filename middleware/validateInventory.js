const validateInventory = (req, res, next) => {
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

  if (isNaN(quantity)) {
    return res.status(400).json({ message: "Quantity must be a number." });
    }
    
  next();
};

const validateInventorySearch = (req, res, next) => {
  if (req.query.s && req.query.s.length > 100) {
    return res.status(400).json({ 
      error: "Search term exceeds maximum length (100 characters)"
    });
  }
  next();
};


export {
  validateInventory,
  validateInventorySearch
};
