import express from "express";
import Stripe from "stripe";
import { createOrder } from "../services/webhook";

const router = express.Router();

router.use(express.raw({ type: "application/json" }));

router.post("/", async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const paymentId = session.payment_intent?.toString();
        const cart = JSON.parse(session.metadata?.cart!);

        if (userId && paymentId && cart) {
          await createOrder(paymentId, userId, cart);
        }

        // TODO send sms and email using notification service

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(400).send(`Webhook Error: ${err}`);
  }
});

export default router;
