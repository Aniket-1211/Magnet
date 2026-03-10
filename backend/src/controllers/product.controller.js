import { Product } from "../models/product.model.js";

export async function getAllProducts(_req, res) {
  const products = await Product.find().sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
}
