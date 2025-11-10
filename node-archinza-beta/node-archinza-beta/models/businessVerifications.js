const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessAccount" },
    status: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusinessVerification", verificationSchema);
