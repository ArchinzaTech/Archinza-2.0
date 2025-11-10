const mongoose = require("mongoose");

const businessWorkFlowQuestion = new mongoose.Schema({
  question: { type: String },
  business_types: [
    { type: mongoose.Schema.Types.ObjectId, ref: "BusinessType" },
  ],
});

module.exports = mongoose.model(
  "BusinessWorkFlowQuestion",
  businessWorkFlowQuestion
);
