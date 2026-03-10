import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

export async function getMyCart(req, res) {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate("items.product");

  return res.status(200).json({
    success: true,
    data: cart
  });
}

export async function addToCart(req, res) {
  const { productId, quantity } = req.body;
  const normalizedQty = Number(quantity || 1);

  if (!productId) {
    return res.status(400).json({ success: false, message: "productId is required" });
  }

  if (!Number.isInteger(normalizedQty) || normalizedQty < 1) {
    return res.status(400).json({ success: false, message: "quantity must be a positive integer" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += normalizedQty;
  } else {
    cart.items.push({ product: product._id, quantity: normalizedQty });
  }

  await cart.save();
  await cart.populate("items.product");

  return res.status(200).json({
    success: true,
    message: "Item added to cart",
    data: cart
  });
}

export async function updateCartItemQuantity(req, res) {
  const { productId } = req.params;
  const { quantity } = req.body;
  const normalizedQty = Number(quantity);

  if (!Number.isInteger(normalizedQty) || normalizedQty < 1) {
    return res.status(400).json({ success: false, message: "quantity must be a positive integer" });
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (!existingItem) {
    return res.status(404).json({ success: false, message: "Item not found in cart" });
  }

  existingItem.quantity = normalizedQty;
  await cart.save();
  await cart.populate("items.product");

  return res.status(200).json({
    success: true,
    message: "Cart item updated",
    data: cart
  });
}

export async function removeFromCart(req, res) {
  const { productId } = req.params;

  const cart = await getOrCreateCart(req.user._id);
  const previousLength = cart.items.length;
  cart.items = cart.items.filter((item) => item.product.toString() !== productId);

  if (cart.items.length === previousLength) {
    return res.status(404).json({ success: false, message: "Item not found in cart" });
  }

  await cart.save();
  await cart.populate("items.product");

  return res.status(200).json({
    success: true,
    message: "Item removed from cart",
    data: cart
  });
}

export async function clearCart(req, res) {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Cart cleared",
    data: cart
  });
}
