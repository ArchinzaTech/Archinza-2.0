const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  id: Number,
  name: String,
});

module.exports = mongoose.model("Country", countrySchema);
