const mongoose = require("mongoose");

const paymentLogSchema = new mongoose.Schema({
  businessAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessAccount",
  },
  subscriptionId: String,
  razorpayPaymentId: String,
  amount: Number,
  currency: String,
  status: { type: String },
  event: String,
  rawPayload: Object,
  desc: String,
  cycleStart: Date,
  cycleEnd: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PaymentLog", paymentLogSchema);
