const mongoose = require("mongoose");

const logActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    action_type: { type: String },
    module: { type: String },
    subModule: { type: String },
    resource: { type: mongoose.Schema.Types.ObjectId },
    details: { type: Object },
    status: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LogActivity", logActivitySchema);
