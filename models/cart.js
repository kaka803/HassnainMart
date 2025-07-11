import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userEmail: {
    type: String,
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  selectedSize: {
    type: String,
    required: true
  },
  selectedColor: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
