// models/order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // if you have a user model
    required: false, // optional for guest checkouts
  },
  shippingAddress: {
    firstName: { type: String, required: true },
    companyName: { type: String },
    streetAddress: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    saveInfo: { type: Boolean, default: false },
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      image: { type: String },
      quantity: { type: Number, required: true },
      selectedColor: { type: String },
      selectedSize: { type: String },
      price: { type: Number, required: true },
    },
  ],
  paymentMethod: {
    type: String,
    enum: ["COD", "Bank"],
    default: "COD",
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  shippingFee: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered"],
    default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
