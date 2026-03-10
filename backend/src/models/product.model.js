import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    imageURL: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 180 },
    category: { type: String, required: true, trim: true, lowercase: true },
    price: { type: Number, required: true, min: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Product = mongoose.model("Product", productSchema);
