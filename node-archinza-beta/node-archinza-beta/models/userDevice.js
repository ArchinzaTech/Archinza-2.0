const mongoose = require("mongoose");

const userDeviceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },
    userModel: {
      type: String,
      required: true,
      enum: ["PersonalAccount", "BusinessAccount"], 
    },
    deviceId: {
      type: String,
    },
    browser: {
      type: String,
    },
    os: {
      type: String,
    },
    ip: {
      type: String,
    },
    location: {
      country: { type: String },
      city: { type: String },
      region: { type: String },
    },
    deviceType: {
      type: String,
      default: "desktop",
    },
    isCurrent: {
      type: Boolean,
      default: true,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDevice", userDeviceSchema);
