import Inventory from "../models/inventory.js";
import Product from "../models/product.js";
import CustomError from "../lib/Error.js";

/**
 * Adds a new product to the inventory with a default quantity of 0.
 * @param {string} productId 
 * @throws {CustomError} If the product is not found.
 */
const addNewProductToInventory = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  const inventory = new Inventory({
    product: productId,
    quantity: 0,
  });

  await inventory.save();
};

/**
 * Updates the inventory for a specific product.
 * @param {string} productId 
 * @param {number} quantity 
 * @throws {CustomError} If the product is not found in the inventory.
 */
const updateInventory = async (productId, quantity) => {
  await _ensureProductExistsInInventory(productId);

  await Inventory.findOneAndUpdate(
    { product: productId },
    { quantity },
    { new: true, runValidators: true }
  );
};

/**
 * Removes a product from the inventory.
 * @param {string} productId 
 * @returns {Object} The removed product document.
 * @throws {CustomError} If the product is not found in the inventory.
 */
const removeProductFromInventory = async (productId) => {
  const productInInventory = await Inventory.findOneAndDelete({ product: productId });

  if (!productInInventory) {
    throw new CustomError("Product not found in inventory", 404);
  }

  return productInInventory;
};

/**
 * Retrieves all products along with their inventory quantity.
 * @returns {Array} Array of products with inventory details.
 */
const getProductInventory = async () => {
  const productWithInventory = await Product.aggregate([
    {
      $lookup: {
        from: "inventories",
        localField: "_id",
        foreignField: "product",
        as: "inventory",
      },
    },
    {
      $unwind: { path: "$inventory", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        name: 1,
        price: 1,
        category: 1,
        quantity: { $ifNull: ["$inventory.quantity", 0] }, // Default to 0 if inventory is missing
      },
    },
  ]);

  return productWithInventory;
};

/**
 * Ensures that a product exists in the inventory before performing operations.
 * @param {string} productId 
 * @throws {CustomError} If the product is not found in the inventory.
 */
const _ensureProductExistsInInventory = async (productId) => {
  const inventory = await Inventory.findOne({ product: productId });

  if (!inventory) {
    throw new CustomError("Product not found in inventory", 404);
  }
};

export {
  addNewProductToInventory,
  updateInventory,
  removeProductFromInventory,
  getProductInventory,
};
