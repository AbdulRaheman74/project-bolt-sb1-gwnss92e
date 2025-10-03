import Product from "../models/productModel.js";

// Create Product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !description || !stock || !category || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({
      name,
      price,
      description,
      stock,
      category,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get All Products (Public)
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 24, search = "", category = "" } = req.query;
    const filters = {};
    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }
    if (category) {
      filters.category = category;
    }

    const numericLimit = Number(limit) || 24;
    const numericPage = Number(page) || 1;

    const products = await Product.find(filters)
      .sort({ createdAt: -1 })
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Single Product (Public)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, price, stock, description, category, image } = req.body;
    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (description) product.description = description;
    if (category) product.category = category;
    if (image) product.image = image;

    const updatedProduct = await product.save();
    res.json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
