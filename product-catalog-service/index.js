import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import productRoutes from "./routes/product.js";
import inventoryRoutes from "./routes/inventory.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use("/product", productRoutes);
app.use("/inventory", inventoryRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });

app.listen(process.env.PORT, () => {
  console.log(`Product Catelog Service is running on port ${process.env.PORT}`);
});
