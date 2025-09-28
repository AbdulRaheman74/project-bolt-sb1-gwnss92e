import express from "express";
import multer from "multer";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const productRoute = express.Router();


const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
     return cb(null, `${Date.now()}-${file.originalname}`);
    }

})
const upload=multer({storage:storage});

// Public
productRoute.get("/", getAllProducts);
productRoute.get("/:id", getProductById);

// Admin
productRoute.post("/create",upload.single("image"), protect, admin, createProduct);
productRoute.put("/:id", protect, admin, updateProduct);
productRoute.delete("/:id", protect, admin, deleteProduct);

export default productRoute;
