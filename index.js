import "dotenv/config";
import express from "express";
const app = express();
import warehouseRoutes from "./routes/warehouseRoutes.js";

const PORT = process.env.PORT || 5050;

app.use(express.json());

app.use("/api/warehouses", warehouseRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
