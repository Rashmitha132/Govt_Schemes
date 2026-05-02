const mongoose = require("mongoose");

const userResponseSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    recommendedSchemes: {
      type: [
        {
          schemeId: String,
          name: String,
          matchScore: Number,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserResponse", userResponseSchema);
