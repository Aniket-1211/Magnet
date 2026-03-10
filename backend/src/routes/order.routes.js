import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getMyOrderById, getMyOrders, placeOrder } from "../controllers/order.controller.js";

export const orderRouter = Router();

orderRouter.post("/", asyncHandler(placeOrder));
orderRouter.get("/", asyncHandler(getMyOrders));
orderRouter.get("/:orderId", asyncHandler(getMyOrderById));
