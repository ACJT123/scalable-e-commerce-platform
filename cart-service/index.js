const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");

dotenv.config();
app.use(express.json());
app.use(helmet());

const cartRoutes = require("./routes/cart");
app.use("/", cartRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });

app.listen(3002, () => {
  console.log(`Listening on http://localhost:${3002}`);
});
