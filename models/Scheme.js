const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    benefits: {
      type: String,
      required: true,
    },
    eligibility: {
      type: String,
      required: true,
    },
    documentsRequired: {
      type: [String],
      default: [],
    },
    applyLink: {
      type: String,
      default: "",
    },
    schemeLevel: {
      type: String,
      enum: ["central", "state"],
      default: "central",
      lowercase: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    deadline: {
      type: Date,
      default: null,
    },
    benefitAmount: {
      type: Number,
      default: 0,
    },
    rules: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scheme", schemeSchema);
