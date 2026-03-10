import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addToCart,
  clearCart,
  getMyCart,
  removeFromCart,
  updateCartItemQuantity
} from "../controllers/cart.controller.js";

export const cartRouter = Router();

cartRouter.get("/", asyncHandler(getMyCart));
cartRouter.post("/items", asyncHandler(addToCart));
cartRouter.patch("/items/:productId", asyncHandler(updateCartItemQuantity));
cartRouter.delete("/items/:productId", asyncHandler(removeFromCart));
cartRouter.delete("/clear", asyncHandler(clearCart));
