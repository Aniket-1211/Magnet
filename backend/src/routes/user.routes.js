import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getMyProfile, updateMyProfile } from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.get("/me", asyncHandler(getMyProfile));
userRouter.patch("/me", asyncHandler(updateMyProfile));
