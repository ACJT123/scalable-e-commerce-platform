import express from "express";
import { createOrder, getOrders } from "../services/order";

const router = express.Router();

router.post("/create", async (req, res) => {
  const { userId, paymentId, cart } = req.body;

  if (!userId || !paymentId || !cart) {
    res.status(400).json({ message: "Invalid request" });
  }

  try {
    await createOrder(userId, paymentId, cart);
  } catch (error) {
    console.error(error);
  }
});

router.get("/get", async (req, res) => {
  const { userId } = req.body;

  try {
    const orders = await getOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
  }
});

router.get("/get/:id", async (req, res) => {});

router.put("/update/:id", async (req, res) => {});

router.delete("/delete/:id", async (req, res) => {});

export default router;
