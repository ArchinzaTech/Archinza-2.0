const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "image",
    },

    url: {
      type: String,
      default: null,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      default: 1,
    },

    sort_order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slider", sliderSchema);
