const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(helmet());

const userRoutes = require("./routes/user");
app.use("/", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

app.listen(3001, () => {
  console.log(`Listening on http://localhost:${3001}`);
});
