import CustomError from "../lib/Error.js";
import Product from "../models/product.js";

const createProduct = async (name, price, category) => {
  const product = await Product.findOne({ name });

  if (product) {
    throw new CustomError("Product already exists", 400);
  }

  const newProduct = new Product({ name, price, category });

  await newProduct.save();

  return newProduct._id;
};

const getProduct = async (productId) => {
  const product = await _product(productId);

  return product;
};

const getProducts = async () => {
  const products = await Product.find();

  return products;
};

const updateProduct = async (productId, name, price, category) => {
  const product = await _product(productId);

  product.name = name;
  product.price = price;
  product.category = category;

  await product.save();
};

const deleteProduct = async (productId) => {
  const product = await _product(productId);
  await product.remove();
};

const _product = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }
};

export { createProduct, getProduct, getProducts, updateProduct, deleteProduct };
