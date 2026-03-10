import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { productRouter } from "./product.routes.js";
import { cartRouter } from "./cart.routes.js";
import { orderRouter } from "./order.routes.js";
import { userRouter } from "./user.routes.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const router = Router();

router.use("/auth", authRouter);
router.use(authMiddleware);
router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);
router.use("/users", userRouter);
