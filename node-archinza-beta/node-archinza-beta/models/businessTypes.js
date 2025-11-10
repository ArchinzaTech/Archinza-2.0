const mongoose = require("mongoose");

const businessTypes = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  prefix: { type: String },
  icon: { type: String },
});

module.exports = mongoose.model("BusinessType", businessTypes);
