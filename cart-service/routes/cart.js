const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getCart, addToCart, clearCart } = require("../services/cart");

const userIdMiddleware = async (req, res, next) => {
  const response = await axios.get("http://localhost:80/api/auth/verify", {
    headers: {
      Authorization: req.headers.authorization,
    },
  });

  req.userId = response.data.userId;
  next();
};

router.use(userIdMiddleware);

router.get("/get", async (req, res) => {
  const userId = req.userId;

  try {
    const cart = await getCart(userId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

router.post("/update", async (req, res) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;
  const { clear } = req.query;

  if (!productId || quantity === undefined || quantity === null) {
    return res.status(400).send("ProductId and Quantity are required");
  }

  try {
    if (clear) {
      await clearCart(userId);
      return res.status(200).json({ message: "Cart cleared" });
    }

    const cart = await addToCart(userId, productId, quantity);

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

module.exports = router;
