const mongoose = require("mongoose");

const partnerEntriesSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    category: String,
    detail: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PartnerEntries", partnerEntriesSchema);
