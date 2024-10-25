import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre("remove", async function (next) {
  await this.model("Inventory").deleteMany({ product: this._id }, next);

  next();
});

export default mongoose.model("Product", ProductSchema);
