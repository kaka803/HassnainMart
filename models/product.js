import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  category: String,
  brand: String,

  originalPrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    required: true,
  },
  sku: {
    type: String,
    unique: true,
    required: true,
  },

  tags: [String],
  color: [String],
  size: [String],

  dimensions: {
    width: String,
    height: String,
    weight: String,
  },

  estimatedDelivery: String,

  onSale: {
    type: Boolean,
    default: false,
  },
  saleEndDate: Date,

  image: {
      url: String,
      public_id: String,
    }, // URLs for uploaded images

}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
