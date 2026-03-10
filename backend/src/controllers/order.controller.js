import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";

function createOrderItemsFromCart(cartItems) {
  return cartItems.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    imageURL: item.product.imageURL,
    price: item.product.price,
    quantity: item.quantity
  }));
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export async function placeOrder(req, res) {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  const hasInvalidProduct = cart.items.some((item) => !item.product);
  if (hasInvalidProduct) {
    return res.status(400).json({
      success: false,
      message: "Cart has unavailable products. Please update your cart."
    });
  }

  const orderItems = createOrderItemsFromCart(cart.items);
  const totalAmount = calculateTotal(orderItems);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount
  });

  cart.items = [];
  await cart.save();

  return res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order
  });
}

export async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
}

export async function getMyOrderById(req, res) {
  const { orderId } = req.params;
  const order = await Order.findOne({ _id: orderId, user: req.user._id });

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  return res.status(200).json({
    success: true,
    data: order
  });
}
