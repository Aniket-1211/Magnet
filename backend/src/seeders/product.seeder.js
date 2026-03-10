import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { Product } from "../models/product.model.js";

const sampleProducts = [
  {
    imageURL: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    name: "Classic Cotton T-Shirt",
    category: "fashion",
    price: 799
  },
  {
    imageURL: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    name: "Running Sneakers",
    category: "fashion",
    price: 2499
  },
  {
    imageURL: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
    name: "Minimal Backpack",
    category: "fashion",
    price: 1899
  },
  {
    imageURL: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    name: "Smart Watch",
    category: "electronics",
    price: 4999
  },
  {
    imageURL: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2",
    name: "Wireless Headphones",
    category: "electronics",
    price: 3299
  },
  {
    imageURL: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
    name: "Ultrabook Laptop",
    category: "electronics",
    price: 62999
  },
  {
    imageURL: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    name: "Android Smartphone",
    category: "electronics",
    price: 18999
  },
  {
    imageURL: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
    name: "Gaming Mouse",
    category: "electronics",
    price: 1499
  },
  {
    imageURL: "https://images.unsplash.com/photo-1580894908361-967195033215",
    name: "Mechanical Keyboard",
    category: "electronics",
    price: 3499
  },
  {
    imageURL: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    name: "Office Chair",
    category: "home",
    price: 6999
  },
  {
    imageURL: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    name: "Fabric Sofa",
    category: "home",
    price: 24999
  },
  {
    imageURL: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    name: "Wooden Bed Frame",
    category: "home",
    price: 17999
  },
  {
    imageURL: "https://images.unsplash.com/photo-1616627452091-6fdef64d5c64",
    name: "Ceramic Dinner Set",
    category: "home",
    price: 2199
  },
  {
    imageURL: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    name: "Trail Running Shoes",
    category: "sports",
    price: 2899
  },
  {
    imageURL: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    name: "Cricket Bat",
    category: "sports",
    price: 1599
  },
  {
    imageURL: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
    name: "Yoga Mat",
    category: "sports",
    price: 899
  },
  {
    imageURL: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
    name: "Stainless Water Bottle",
    category: "sports",
    price: 499
  },
  {
    imageURL: "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
    name: "Leather Wallet",
    category: "accessories",
    price: 999
  },
  {
    imageURL: "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0",
    name: "Polarized Sunglasses",
    category: "accessories",
    price: 1299
  },
  {
    imageURL: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    name: "Denim Jacket",
    category: "fashion",
    price: 2799
  }
];

async function seedProducts() {
  try {
    await connectDatabase();

    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);

    console.log(`Seeded ${sampleProducts.length} products successfully.`);
  } catch (error) {
    console.error("Product seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedProducts();
