const Cart = require("../models/cart");
const CustomError = require("../libs/Error");

const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId });

  return cart;
};

const addToCart = async (userId, productId, quantity) => {
  let cart =
    (await Cart.findOne({ userId })) || new Cart({ userId, products: [] });

  if (quantity === 0) {
    cart.products = cart.products.filter(
      (product) => product.productId !== productId
    );
  } else {
    const existingProduct = cart.products.find(
      (product) => product.productId === productId
    );

    if (existingProduct) {
      existingProduct.quantity = quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
  }

  await cart.save();
  return cart;
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });

  cart.products = [];

  await cart.save();
};

module.exports = {
  getCart,
  addToCart,
  clearCart,
};
