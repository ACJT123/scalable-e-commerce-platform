const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config();
app.use(express.json());
app.use(helmet());

// routes
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

app.listen(3007, () => {
  console.log(`Listening on http://localhost:${3007}`);
});
