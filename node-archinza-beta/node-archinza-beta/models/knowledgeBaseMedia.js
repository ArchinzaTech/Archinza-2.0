const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    name: { type: String },
    url: { type: String },
    mimetype: { type: String },
    size: { type: String },
    visibility: { type: Boolean, default: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessAccount",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KnowledgebaseMedia", mediaSchema);
