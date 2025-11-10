const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  id: Number,
  name: String,
  country_id: Number,
  country_code: String,
  country_name: String,
});

module.exports = mongoose.model("State", stateSchema);
