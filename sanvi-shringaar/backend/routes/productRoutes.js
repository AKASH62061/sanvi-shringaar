const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");

// @route   GET /api/products
// @desc    Get all products. Supports ?category=<id> and ?search=<text>
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/products/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice, brand, description, inStock } = req.body;

    if (!name || !category || minPrice === undefined || maxPrice === undefined) {
      return res.status(400).json({
        message: "name, category, minPrice and maxPrice are required",
      });
    }

    if (Number(minPrice) > Number(maxPrice)) {
      return res.status(400).json({ message: "minPrice cannot be greater than maxPrice" });
    }

    const product = new Product({
      name,
      category,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      brand: brand || "",
      description: description || "",
      inStock: inStock === undefined ? true : inStock === "true" || inStock === true,
      image: req.file
        ? { url: req.file.path, publicId: req.file.filename }
        : { url: "", publicId: "" },
    });

    await product.save();
    const populated = await product.populate("category", "name slug");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, category, minPrice, maxPrice, brand, description, inStock } = req.body;

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (minPrice !== undefined) product.minPrice = Number(minPrice);
    if (maxPrice !== undefined) product.maxPrice = Number(maxPrice);
    if (brand !== undefined) product.brand = brand;
    if (description !== undefined) product.description = description;
    if (inStock !== undefined) product.inStock = inStock === "true" || inStock === true;

    if (product.minPrice > product.maxPrice) {
      return res.status(400).json({ message: "minPrice cannot be greater than maxPrice" });
    }

    if (req.file) {
      if (product.image?.publicId) {
        await cloudinary.uploader.destroy(product.image.publicId).catch(() => {});
      }
      product.image = { url: req.file.path, publicId: req.file.filename };
    }

    await product.save();
    const populated = await product.populate("category", "name slug");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/products/:id
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image?.publicId) {
      await cloudinary.uploader.destroy(product.image.publicId).catch(() => {});
    }
    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
