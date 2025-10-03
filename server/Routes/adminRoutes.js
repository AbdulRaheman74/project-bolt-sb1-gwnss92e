import express from "express";
import { 
  registerAdmin, 
  loginAdmin, 
  getAdminProfile, 
  getAllUsers, 
  getAllOrders, 
  getDashboardStats 
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const adminRoute = express.Router();

adminRoute.post("/register", registerAdmin);
adminRoute.post("/login", loginAdmin);
adminRoute.get("/profile", protect, admin, getAdminProfile);
adminRoute.get("/users", protect, admin, getAllUsers);
adminRoute.get("/orders", protect, admin, getAllOrders);
adminRoute.get("/dashboard-stats", protect, admin, getDashboardStats);

export default adminRoute;
