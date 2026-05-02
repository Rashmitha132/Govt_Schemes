// File: controllers/categoryController.js
const mongoose = require("mongoose");

const Category = require("../models/Category");

const fallbackCategories = [
  {
    id: "farmer",
    name: "Farmer",
    localName: "किसान",
    localNameKn: "ರೈತ",
    icon: "👨‍🌾",
    schemeCount: 12,
    color: "#1a7a4a",
  },
  {
    id: "woman",
    name: "Woman",
    localName: "महिला",
    localNameKn: "ಮಹಿಳೆ",
    icon: "👩",
    schemeCount: 9,
    color: "#e64b3c",
  },
  {
    id: "senior",
    name: "Senior",
    localName: "बुजुर्ग",
    localNameKn: "ಹಿರಿಯರು",
    icon: "👴",
    schemeCount: 7,
    color: "#f2a51a",
  },
  {
    id: "family",
    name: "Family",
    localName: "परिवार",
    localNameKn: "ಕುಟುಂಬ",
    icon: "🏠",
    schemeCount: 11,
    color: "#2484b8",
  },
];

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const getCategories = async (req, res) => {
  try {
    if (!isDatabaseReady()) {
      return res.json({ success: true, categories: fallbackCategories });
    }

    const categories = await Category.find({}, "id name localName localNameKn icon schemeCount color -_id")
      .sort({ createdAt: 1 })
      .lean();

    return res.json({
      success: true,
      categories: categories.length ? categories : fallbackCategories,
    });
  } catch (error) {
    return res.json({ success: true, categories: fallbackCategories });
  }
};

const selectCategory = async (req, res) => {
  const { categoryId, language } = req.body;
  const categories = fallbackCategories.map((category) => category.id);

  if (!categoryId || !categories.includes(categoryId)) {
    return res.status(400).json({ success: false, message: "Valid category is required" });
  }

  return res.json({
    success: true,
    message: "Category selected successfully",
    selectedCategory: categoryId,
    language: language || "hi",
  });
};

module.exports = {
  getCategories,
  selectCategory,
};
