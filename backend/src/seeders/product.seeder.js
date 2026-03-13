import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { Product } from "../models/product.model.js";

const CATALOG_SIZE = Number(process.env.SEED_COUNT || 120);

const categoryConfig = {
  fashion: {
    names: [
      "Cotton T-Shirt",
      "Slim Fit Jeans",
      "Denim Jacket",
      "Linen Shirt",
      "Hooded Sweatshirt",
      "Chino Pants",
      "Summer Dress",
      "Pleated Skirt",
      "Athletic Shorts",
      "Graphic Tee",
      "Polo Shirt",
      "Wool Sweater"
    ],
    priceMin: 499,
    priceMax: 3999,
    imageURL: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
  },
  electronics: {
    names: [
      "Smartphone",
      "Wireless Earbuds",
      "Bluetooth Speaker",
      "Smart Watch",
      "Gaming Mouse",
      "Mechanical Keyboard",
      "Ultrabook Laptop",
      "Tablet",
      "4K Monitor",
      "Portable SSD",
      "Action Camera",
      "Wireless Charger"
    ],
    priceMin: 1499,
    priceMax: 69999,
    imageURL: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8"
  },
  home: {
    names: [
      "Office Chair",
      "Fabric Sofa",
      "Wooden Bed Frame",
      "Dining Table",
      "Ceramic Dinner Set",
      "Floor Lamp",
      "Bookshelf",
      "Area Rug",
      "Wall Clock",
      "Storage Cabinet",
      "Coffee Table",
      "Kitchen Mixer"
    ],
    priceMin: 799,
    priceMax: 39999,
    imageURL: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
  },
  sports: {
    names: [
      "Running Shoes",
      "Yoga Mat",
      "Cricket Bat",
      "Fitness Tracker",
      "Trail Backpack",
      "Dumbbell Set",
      "Resistance Bands",
      "Cycling Helmet",
      "Sports Bottle",
      "Jump Rope",
      "Football",
      "Training Gloves"
    ],
    priceMin: 399,
    priceMax: 5999,
    imageURL: "https://images.unsplash.com/photo-1491553895911-0055eca6402d"
  },
  accessories: {
    names: [
      "Leather Wallet",
      "Polarized Sunglasses",
      "Analog Watch",
      "Travel Backpack",
      "Minimal Belt",
      "Canvas Tote",
      "Phone Case",
      "Key Organizer",
      "Bracelet Set",
      "Beanie Cap",
      "Neck Pillow",
      "Card Holder"
    ],
    priceMin: 299,
    priceMax: 4999,
    imageURL: "https://images.unsplash.com/photo-1472851294608-062f824d29cc"
  }
};

const adjectives = [
  "Classic",
  "Modern",
  "Minimal",
  "Premium",
  "Everyday",
  "Urban",
  "Sport",
  "Essential",
  "Compact",
  "Pro",
  "Lite",
  "Elite"
];

function priceBetween(min, max, offset) {
  const step = 50;
  const range = Math.floor((max - min) / step);
  const price = min + step * ((offset * 7 + 11) % (range + 1));
  return price;
}

function buildCatalog(size) {
  const categories = Object.keys(categoryConfig);
  const items = [];

  for (let i = 0; i < size; i += 1) {
    const category = categories[i % categories.length];
    const config = categoryConfig[category];
    const name = config.names[i % config.names.length];
    const adjective = adjectives[i % adjectives.length];
    const price = priceBetween(config.priceMin, config.priceMax, i);
    const sku = String(i + 1).padStart(3, "0");

    items.push({
      imageURL: config.imageURL,
      name: `${adjective} ${name} ${sku}`,
      category,
      price
    });
  }

  return items;
}

const sampleProducts = buildCatalog(CATALOG_SIZE);

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
