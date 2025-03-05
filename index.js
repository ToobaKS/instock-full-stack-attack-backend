import "dotenv/config";
import express from "express";
import warehouseRoutes from "./routes/warehouse-routes.js";

const app = express();

const PORT = process.env.PORT || 5050;

app.use(express.json());

app.use("/", warehouseRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});