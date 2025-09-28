import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const orderRoute = express.Router();

// User
orderRoute.post("/", protect, createOrder);
orderRoute.get("/my", protect, getMyOrders);
orderRoute.get("/:id", protect, getOrderById);

// Admin
orderRoute.put("/:id/status", protect, admin, updateOrderStatus);

export default orderRoute;
