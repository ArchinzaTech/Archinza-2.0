const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    name: { type: String },
    url: { type: String },
    mimetype: { type: String },
    size: { type: String },
    height: { type: String },
    width: { type: String },
    visibility: { type: Boolean, default: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessAccount",
      required: true,
    },
    category: { type: String },
    softDelete: { type: Boolean, default: false },
    deletedAt: { type: Date },
    pinned: { type: Boolean, default: false },
    isUnused: { type: Boolean, default: false },
    fileHash: { type: String },
    thumbnail: { type: String },
    masonryPosition: {
      type: Number,
    },
    replacedAt: { type: Date },
    originalPosition: { type: Number },
  },
  { timestamps: true }
);

// mediaSchema.index(
//   { deletedAt: 1 },
//   {
//     expireAfterSeconds: 86400,
//     partialFilterExpression: { softDelete: true },
//   }
// );

module.exports = mongoose.model("Media", mediaSchema);
