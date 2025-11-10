const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      unique: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessAccount",
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessPlan",
    },
    subscriptionId: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      default: "captured",
    },

    paymentMethod: {
      type: {
        type: String,
      },
      info: String,
      network: String,
    },
    customer: {
      name: String,
      email: String,
      contact: String,
      address: String,
    },

    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    nextBillingDate: {
      type: Date,
    },

    rawPayload: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
