const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");

const makeSlug = (name) =>
  name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// @route   GET /api/categories
// @desc    Get all categories (with product count)
// @access  Private (must be logged in to view the catalog)
router.get("/", protect, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    const counts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach((c) => (countMap[c._id.toString()] = c.count));

    const result = categories.map((cat) => ({
      ...cat,
      productCount: countMap[cat._id.toString()] || 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/categories/:idOrSlug
// @desc    Get single category by id or slug
// @access  Private (must be logged in to view the catalog)
router.get("/:idOrSlug", protect, async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const category = await Category.findOne({
      $or: [{ _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }, { slug: idOrSlug }],
    });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/categories
// @desc    Create a category
// @access  Private
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const slug = makeSlug(name);
    const exists = await Category.findOne({ $or: [{ name }, { slug }] });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const category = new Category({
      name,
      slug,
      description: description || "",
      image: req.file
        ? { url: req.file.path, publicId: req.file.filename }
        : { url: "", publicId: "" },
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const { name, description } = req.body;

    if (name && name !== category.name) {
      category.name = name;
      category.slug = makeSlug(name);
    }
    if (description !== undefined) category.description = description;

    if (req.file) {
      if (category.image?.publicId) {
        await cloudinary.uploader.destroy(category.image.publicId).catch(() => {});
      }
      category.image = { url: req.file.path, publicId: req.file.filename };
    }

    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category (and its products)
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const products = await Product.find({ category: category._id });
    for (const p of products) {
      if (p.image?.publicId) {
        await cloudinary.uploader.destroy(p.image.publicId).catch(() => {});
      }
    }
    await Product.deleteMany({ category: category._id });

    if (category.image?.publicId) {
      await cloudinary.uploader.destroy(category.image.publicId).catch(() => {});
    }
    await category.deleteOne();

    res.json({ message: "Category and its products deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
