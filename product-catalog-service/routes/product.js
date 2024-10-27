import express from "express";
const router = express.Router();
import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../services/product.js";
import { adminAuth } from "../middlewares/auth.js";

router.get("/", async (req, res) => {
  try {
    const products = await getProducts();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:productId", async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).send("Please provide all the required");
  }

  try {
    const product = await getProduct(productId);

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// only admin can update and delete products
router.use(adminAuth);

router.post("/", async (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).send("Please provide all the required");
  }

  try {
    await createProduct(name, price, category);

    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

router.put("/:productId", async (req, res) => {
  const { productId } = req.params;
  const { name, price, category } = req.body;

  if (!productId || !name || !price || !category) {
    return res.status(400).send("Please provide all the required");
  }

  try {
    await updateProduct(productId, name, price, category);

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).send("Please provide all the required");
  }

  try {
    await deleteProduct(productId);

    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

export default router;
