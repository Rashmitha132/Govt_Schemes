// File: models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    localName: {
      type: String,
      required: true,
      trim: true,
    },
    localNameKn: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
    schemeCount: {
      type: Number,
      required: true,
      min: 0,
    },
    color: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
