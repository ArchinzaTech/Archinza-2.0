const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema(
  {
    rating: { type: Number },
    review: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalAccount",
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessAccount",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewsSchema);
