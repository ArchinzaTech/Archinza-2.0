const mongoose = require("mongoose");

const pincodeSchema = new mongoose.Schema({
  id: Number,
  name: String,
  pincode: String,
  circle: String,
  district: String,
  division: String,
  region: String,
  state: String,
country: String,
});

module.exports = mongoose.model("Pincode", pincodeSchema);
