import express from "express";
import { registerAdmin, loginAdmin, getAdminProfile } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const adminRoute = express.Router();

adminRoute.post("/register", registerAdmin);
adminRoute.post("/login", loginAdmin);
adminRoute.get("/profile", protect, admin, getAdminProfile);

export default adminRoute;
