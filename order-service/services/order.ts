import Order from "../models/order";

type Cart = {
  productId: string;
  quantity: number;
  name: string;
  price: number;
};

const createOrder = async (userId: string, paymentId: string, cart: Cart) => {
  const order = new Order({
    userId,
    paymentId,
    products: cart,
  });

  await order.save();
};

const getOrders = async (userId?: string) => {
  if (userId) {
    return Order.find({ userId });
  }

  return Order.find();
};

export { createOrder, getOrders };
