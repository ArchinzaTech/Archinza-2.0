const mongoose = require("mongoose");

const statSchema = new mongoose.Schema(
  {
    consultants_registered: { type: Number },
    architects_trusting: { type: Number },
    people_onboarding: { type: Number },
    businesses_registered: { type: Number },
    people_signed_up: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stat", statSchema);
