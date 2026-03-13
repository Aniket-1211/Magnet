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
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b",
      "https://images.unsplash.com/photo-1523191752775-2d7c6f5c3d13",
      "https://images.unsplash.com/photo-1475180098004-ca77a66827be",
      "https://images.unsplash.com/photo-1463100099107-aa0980c362e6",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1511385348-a52b4a160dc2",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      "https://images.unsplash.com/photo-1510552776732-03e61cf4b144",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1505691723518-36a1f35a8f9c",
      "https://images.unsplash.com/photo-1616627452091-6fdef64d5c64",
      "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
      "https://images.unsplash.com/photo-1503602642458-232111445657",
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a",
      "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf",
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
      "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e",
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a",
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8",
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
      "https://images.unsplash.com/photo-1514996937319-344454492b37",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908",
      "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb",
      "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908"
    ]
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
    const nameIndex = i % config.names.length;
    const name = config.names[nameIndex];
    const adjective = adjectives[i % adjectives.length];
    const price = priceBetween(config.priceMin, config.priceMax, i);
    const sku = String(i + 1).padStart(3, "0");

    items.push({
      imageURL: config.images[nameIndex],
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

    // console.log(`Seeded ${sampleProducts.length} products successfully.`);
  } catch (error) {
    // console.error("Product seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedProducts();
