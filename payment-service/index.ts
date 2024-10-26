import express, { Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import paymentRouter from "./routes/payment";

const app = express();
const port = process.env.PORT || 3005;

dotenv.config();
app.use(helmet());
app.use(express.json());

app.use("/", paymentRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
