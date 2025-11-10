const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    value: String,
    status: {
      type: String,
      default: "pending",
    },
  },
  { _id: false }
);

const businessCustomOptionSchema = new mongoose.Schema(
  {
    question: String,
    question_slug: String,
    options: [optionSchema],
    user: mongoose.Types.ObjectId,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "BusinessCustomOption",
  businessCustomOptionSchema
);
