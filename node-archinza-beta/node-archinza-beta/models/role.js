const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
  // Add extensibility for future metadata if needed
  metadata: {
    type: Object,
  },
});

module.exports = mongoose.model("Role", roleSchema);
