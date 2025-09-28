import express from "express";
import { getUserProfile, loginUser, registerUser} from "../Controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRoute = express.Router();

// Register API
userRoute.post("/register", registerUser);
userRoute.post('/login', loginUser);
userRoute.get('/profile',protect,getUserProfile)
// userRoute.put('/profile',protect,updateUserProfile)

export default userRoute;
