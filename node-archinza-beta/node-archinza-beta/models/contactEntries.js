const mongoose = require("mongoose");

const contactEntriesSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    category: String,
    detail: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactEntries", contactEntriesSchema);
