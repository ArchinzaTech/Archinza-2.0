const mongoose = require("mongoose");

const footerEntriesSchema = new mongoose.Schema(
  {
    email: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("FooterEntries", footerEntriesSchema);
