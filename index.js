import "dotenv/config";
import express from "express";
const app = express();

const PORT = process.env.PORT || 5050;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});