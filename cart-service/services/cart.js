const Cart = require("../models/cart");
const axios = require("axios");

const getCart = async (userId) => {
  let cart = await Cart.findOne({ userId });

  const details = await Promise.all(
    cart.products.map(async (product) => {
      const details = await _getDetails(product.productId);
      
      return details;
    })
  );

  // convert the cart object to non mongoose object
  cart = cart.toObject();

  cart.products = cart.products.map((product, index) => ({
    ...product,
    name: details[index].name,
    price: details[index].price,
  }));

  return cart;
};

const _getDetails = async (productId) => {
  const response = await axios.get(
    `http://nginx/api/product-catalog/product/${productId}/`
  );

  return response.data;
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
