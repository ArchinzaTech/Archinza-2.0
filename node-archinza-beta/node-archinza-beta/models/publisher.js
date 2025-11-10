const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    
    image: String,
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Publisher", schema);
