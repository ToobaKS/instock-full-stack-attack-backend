import "dotenv/config";
import express from "express";
import cors from "cors";
import warehouseRoutes from "./routes/warehouse-routes.js";
import inventoryRoutes from "./routes/inventory-routes.js";

const app = express();
import warehouseRoutes from "./routes/warehouseRoutes.js";

const PORT = process.env.PORT || 5050;

app.use(cors());

app.use(express.json());

app.use("/", warehouseRoutes);
app.use("/", inventoryRoutes);


app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
