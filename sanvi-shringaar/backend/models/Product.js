const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    minPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    maxPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", brand: "text" });

module.exports = mongoose.model("Product", productSchema);
