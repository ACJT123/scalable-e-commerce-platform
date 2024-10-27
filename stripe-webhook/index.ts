import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import webhookRouter from "./routes/webhook";

const app = express();

dotenv.config();

app.use(helmet());

app.use("/", webhookRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
