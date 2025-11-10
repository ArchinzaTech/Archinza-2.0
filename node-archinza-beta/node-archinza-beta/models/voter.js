const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    email: String,
    category:String,
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Finalist",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voter", schema);
