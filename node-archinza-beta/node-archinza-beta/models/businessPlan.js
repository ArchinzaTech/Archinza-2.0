const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    // currency: {
    //   type: String,
    //   default: "INR",
    // },
    description: String,
    durationInMonths: {
      type: Number,
    },
    features: {
      fileUploadLimit: { type: Number, default: 5 },
      filePageLimit: { type: Number, default: 100 },
      fileSizeLimitMB: { type: Number, default: 100 },
      imagesLimit: { type: Number, default: 200 },
      externalLinksLimit: { type: Number, default: 0 },
      privateContentToggle: { type: Boolean, default: false },
      communityAccess: { type: Boolean, default: false },
      recentlyDeletedLimit: { type: Number, default: 0 },
      unusedImagesLimit: { type: Number, default: 0 },
    },
    razorpayPlanId: { type: String },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("BusinessPlan", planSchema);
module.exports = Plan;
