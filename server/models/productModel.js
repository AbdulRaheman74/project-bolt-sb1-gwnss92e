import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    image: {
      type: String, // URL of image
      required: [true, "Product image is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Clothing", "Shoes", "Accessories", "Electronics"], // Allowed categories
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who created product
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

const Product = mongoose.model("Product", productSchema);
export default Product;
