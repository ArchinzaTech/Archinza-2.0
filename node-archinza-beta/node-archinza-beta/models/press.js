const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: String,
    author: String,
    image: String,
    website: String,
    date: Date,
 
    status: {
      type: Number,
      default: 1,
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
    },
    sort_order: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Press", schema);
