import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Create Order (User only)
export const createOrder = async (req, res) => {
  try {
    const { items, shippingInfo, paymentMethod } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items in order" });

    // Calculate total price
    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });
      totalPrice += product.price * item.qty;
    }

    const order = await Order.create({
      user: req.user._id,
      items: items.map(i => ({ product: i.productId, qty: i.qty })),
      shippingInfo,
      paymentMethod,
      totalPrice,
    });

    res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get My Orders (User only)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product", "name price image");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Single Order (User/Admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name price image");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // User can only see their orders
    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Order Status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    if (status === "shipped") order.paidAt = new Date(); // optional: mark paid
    if (status === "delivered") order.deliveredAt = new Date();

    const updatedOrder = await order.save();
    res.json({ message: "Order updated", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
