const mongoose = require("mongoose");

const subscriptionLogSchema = new mongoose.Schema({
  businessAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessAccount",
  },
  customer_id: String,
  razorpaySubscriptionId: String,
  razorpayPlanId: String,
  rawResponse: Object,
  status: String,
  latest_payment_method: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SubscriptionLog", subscriptionLogSchema);
