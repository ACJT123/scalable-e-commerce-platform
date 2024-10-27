import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    products: {
      type: [ProductSchema],
      required: true,
    },
    orderStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", "cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
