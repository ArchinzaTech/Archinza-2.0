const mongoose = require("mongoose");

const requestsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessAccount" },
    status: {
      type: String,
      default: "pending",
    },
    role_user: { type: mongoose.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("BusinessEditRequest", requestsSchema);
