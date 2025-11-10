const mongoose = require("mongoose");

const userPlanSchema = new mongoose.Schema(
  {
    businessAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessAccount",
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessPlan",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    paymentStatus: {
      type: String,
      default: "",
    },
    razorpaySubscriptionId: { type: String },
    razorpayPaymentId: { type: String },
    razorpayOrderId: { type: String },
    nextBillingDate: { type: Date },
  },
  { timestamps: true }
);

const UserPlan = mongoose.model("BusinessUserPlan", userPlanSchema);
module.exports = UserPlan;
