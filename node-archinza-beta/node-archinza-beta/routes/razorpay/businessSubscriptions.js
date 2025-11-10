const express = require("express");
const router = express.Router();
const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const BusinessAccount = require("../../models/businessAccount");
const Media = require("../../models/media");
const SubscriptionLog = require("../../models/subscriptionLogs");
const { default: mongoose } = require("mongoose");
const { sendError, sendResponse } = require("../../helpers/api");
const Razorpay = require("razorpay");
const config = require("../../config/config");
var instance = new Razorpay({
  key_id: config.razorpay.key_id,
  key_secret: config.razorpay.key_secret,
});
//webhook API for media scrapping
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { id, plan } = req.body;
    const subscription = await instance.subscriptions.create({
      plan_id: plan.razorpayPlanId,
      customer_notify: 1,
      total_count: 12,
    });
    console.log(subscription);
    // await SubscriptionLog.create({
    //   businessAccount: id,
    //   razorpaySubscriptionId,
    //   razorpayPlanId: plan.razorpayPlanId,
    //   status: "created",
    // });
    return res.send(sendResponse({}, "Data processed successfully"));
  })
);

module.exports = router;
