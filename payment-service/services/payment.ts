import { CartResponse } from "./../types/Response";
import { Urls } from "./../types/Urls";
import axios from "axios";
import Stripe from "stripe";

const _getCart = async (token: string) => {
  const response = await axios.get<CartResponse>(`${Urls.CART_SERVICE}/get`, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

/**
 * get checkout session
 * @param token
 */
const getSession = async (token: string) => {
  const cart = await _getCart(token);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.create({
    line_items: cart.products.map((product) => {
      const { name, quantity, price } = product;

      return {
        price_data: {
          currency: "myr",
          product_data: {
            name,
          },
          unit_amount: price * 100, // stripe uses cents
        },
        quantity,
      };
    }),
    mode: "payment",
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL,
    metadata: {
      userId: cart.userId,
    },
  });

  return session;
};

export { getSession };
