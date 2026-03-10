import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAllProducts } from "../controllers/product.controller.js";

export const productRouter = Router();

productRouter.get("/getAllProducts", asyncHandler(getAllProducts));
