import express from "express";
import { adminAuth } from "../middlewares/auth.js";
import {
  addNewProductToInventory,
  updateInventory,
  removeProductFromInventory,
  getProductInventory
} from "../services/inventory.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await getProductInventory();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
} );

router.use(adminAuth);

router.post("/", async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).send("Please provide all the required");
  }

  try {
    await addNewProductToInventory(productId);

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

router.put("/", async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).send("Please provide all the required");
  }

  try {
    await updateInventory(productId, quantity);

    res.status(200).json({ message: "Inventory updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

router.delete("/", async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).send("Please provide all the required");
  }

  try {
    await removeProductFromInventory(productId);

    res.status(200).json({ message: "Product removed from inventory" });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

export default router;
