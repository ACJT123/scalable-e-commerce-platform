import axios from "axios";
import { Urls } from "../types/Urls";
import Stripe from "stripe";

type Cart = {
  productId: string;
  quantity: number;
  name: string;
  price: number;
};

const createOrder = async (paymentId: string, userId: string, cart: Cart) => {
  await axios.post(Urls.ORDER_SERVICE + "/create", {
    userId,
    cart,
    paymentId,
  });
};

export { createOrder };
