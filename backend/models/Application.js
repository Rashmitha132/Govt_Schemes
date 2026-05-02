const mongoose = require("mongoose");

const uploadedDocumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      trim: true,
      default: "",
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      required: true,
      index: true,
    },
    schemeName: {
      type: String,
      required: true,
      trim: true,
    },
    preferredLanguage: {
      type: String,
      trim: true,
      default: "hi",
    },
    uploadedDocuments: {
      type: [uploadedDocumentSchema],
      default: [],
    },
    missingDocuments: {
      type: [String],
      default: [],
    },
    applicationStatus: {
      type: String,
      enum: ["Incomplete", "Draft", "Ready", "Submitted", "Redirected"],
      default: "Incomplete",
      index: true,
    },
    isUserConfirmed: {
      type: Boolean,
      default: false,
      index: true,
    },
    officialApiAvailable: {
      type: Boolean,
      default: false,
    },
    officialApplyUrl: {
      type: String,
      trim: true,
      default: "",
    },
    draftSummary: {
      type: String,
      trim: true,
      default: "",
    },
    aiInsights: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
