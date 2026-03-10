import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signin, signup, verifyAuth } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/signup", asyncHandler(signup));
authRouter.post("/signin", asyncHandler(signin));
authRouter.get("/verify", authMiddleware, asyncHandler(verifyAuth));
