import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import orderRouter from "./routes/order";
const app = express();

dotenv.config();

app.use(helmet());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error(error);
  });

app.use("/", orderRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
