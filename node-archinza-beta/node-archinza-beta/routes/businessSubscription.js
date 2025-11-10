const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
var _ = require("lodash");
const auth = require("../middlewares/auth");
const { sendResponse, sendError } = require("../helpers/api");
const agenda = require("../jobs/agenda");
const BusinessPlans = require("../models/businessPlan");
const BusinessUserPlan = require("../models/businessUserPlan");
const SubscriptionLog = require("../models/subscriptionLogs");
const PaymentLog = require("../models/paymentLogs");
const Invoice = require("../models/businessInvoice");
const Razorpay = require("razorpay");
const config = require("../config/config");
const { default: mongoose } = require("mongoose");
const { default: axios } = require("axios");
var instance = new Razorpay({
  key_id: config.razorpay.key_id,
  key_secret: config.razorpay.key_secret,
});

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const plans = await BusinessPlans.find();

    return res.send(sendResponse(plans));
  })
);

// router.get(
//   "/:id/payments",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     const payments = await PaymentLog.find({
//       businessAccount: id,
//       event: "subscription.charged",
//       status: "captured",
//     })
//       .populate("businessAccount", "name email") // optional, if you need business info
//       .sort({ createdAt: -1 });

//     return res.send(
//       sendResponse(payments, "Payment history fetched successfully")
//     );
//   })
// );

// GET /business-plans/:businessAccountId/payments
router.get(
  "/:id/payments",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const payments = await PaymentLog.aggregate([
      {
        $match: {
          businessAccount: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "subscriptionlogs", // collection name
          localField: "subscriptionId",
          foreignField: "razorpaySubscriptionId",
          as: "subscription",
        },
      },
      {
        $unwind: { path: "$subscription", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          date: "$createdAt",
          amount: 1,
          currency: 1,
          status: 1,
          event: 1,
          razorpayPaymentId: 1,
          subscriptionId: 1,

          // Membership description
          // description: {
          //   $cond: [
          //     { $ifNull: ["$cycleStart", false] },
          //     {
          //       $concat: [
          //         "Membership for ",
          //         {
          //           $dateToString: {
          //             format: "%d %m %Y",
          //             date: {
          //               $toDate: {
          //                 $multiply: [
          //                   "$subscription.rawResponse.current_start",
          //                   1000,
          //                 ],
          //               },
          //             },
          //           },
          //         },
          //         " – ",
          //         {
          //           $dateToString: {
          //             format: "%d %m %Y",
          //             date: {
          //               $toDate: {
          //                 $multiply: [
          //                   "$subscription.rawResponse.current_end",
          //                   1000,
          //                 ],
          //               },
          //             },
          //           },
          //         },
          //       ],
          //     },
          //     "Membership",
          //   ],
          // },
          description: {
            $cond: [
              { $ifNull: ["$cycleStart", false] },
              {
                $concat: [
                  "Membership for ",
                  {
                    $dateToString: {
                      format: "%d %m %Y",
                      date: "$cycleStart",
                    },
                  },
                  " – ",
                  {
                    $dateToString: {
                      format: "%d %m %Y",
                      date: "$cycleEnd",
                    },
                  },
                ],
              },
              "Membership",
            ],
          },

          // Payment method from rawPayload
          paymentMethod: "$rawPayload.payload.payment.entity.method",
          card: "$rawPayload.payload.payment.entity.card",
          vpa: "$rawPayload.payload.payment.entity.vpa",
          wallet: "$rawPayload.payload.payment.entity.wallet",
          bank: "$rawPayload.payload.payment.entity.bank",
        },
      },
      { $sort: { date: -1 } },
    ]);

    return res.send(
      sendResponse(payments, "Payment history fetched successfully")
    );
  })
);

//fetch current business plan details
router.get("/latest/:id", async (req, res) => {
  const { id } = req.params;

  const userPlan = await BusinessUserPlan.findOne({
    razorpaySubscriptionId: id,
    isActive: true,
  });

  return res.send(sendResponse(userPlan));
});

// GET /api/payment-method/:subscriptionId
router.get("/payment-method/:subscriptionId", async (req, res) => {
  const { subscriptionId } = req.params;

  const payment = await PaymentLog.findOne({
    subscriptionId,
    status: { $in: ["captured", "authorized", "refunded"] },
  }).sort({ createdAt: -1 });

  if (!payment) {
    return res.send(sendResponse("No payment found"));
  }

  // Extract method details
  let methodDetails = {};
  const raw = payment.rawPayload?.payload?.payment?.entity;
  if (raw) {
    switch (raw.method) {
      case "card":
        methodDetails = {
          type: "Card",
          info: `**** **** **** ${raw.card?.last4 || ""}`,
          network: raw.card?.network,
        };
        break;
      case "upi":
        methodDetails = {
          type: "UPI",
          info: raw.vpa,
        };
        break;
      case "vpa":
        methodDetails = {
          type: "UPI",
          info: raw.vpa,
        };
        break;
      case "netbanking":
        methodDetails = {
          type: "NetBanking",
          info: raw.bank,
        };
        break;
      case "wallet":
        methodDetails = {
          type: "Wallet",
          info: raw.wallet,
        };
        break;
      default:
        methodDetails = { type: raw.method, info: "" };
    }
  }

  res.send(sendResponse(methodDetails));
});

// GET /api/subscription/:id/change-method
router.get("/subscription/:id/change-method", async (req, res) => {
  const { id } = req.params;
  try {
    const subscription = await instance.subscriptions.fetch(id);

    if (!subscription) {
      return res.send(sendResponse("Subscription not found"));
    }

    res.send(sendResponse({ shortUrl: subscription.short_url }));
  } catch (err) {
    console.error(err);
    res.send(sendError("Failed to fetch subscription short_url", 500));
  }
});

//GET invoices by paymentId
router.get("/invoice/:paymentId", async (req, res) => {
  const invoice = await Invoice.findOne({
    paymentId: req.params.paymentId,
  })
    .populate("businessId", "business_name email country_code phone") // business fields
    .populate("plan", "name price");
  if (!invoice) {
    return res.send(sendResponse({ status: false }));
  }
  return res.send(sendResponse({ status: true, invoice }));
});

//GET invoice by invoice ID
router.get("/invoice-by-id/:invoiceId", async (req, res) => {
  const invoice = await Invoice.findOne({
    invoiceId: req.params.invoiceId,
  })
    .populate("businessId", "business_name email country_code phone") // business fields
    .populate("plan", "name price");
  if (!invoice) {
    return res.send(sendResponse({ status: false }));
  }
  return res.send(sendResponse({ status: true, invoice }));
});

//create sub on rzp
router.post(
  "/subscribe",
  asyncHandler(async (req, res) => {
    const { data, plan } = req.body;
    const customer = await instance.customers.create({
      name: data.business_name || "Customer",
      email: data.email || "",
      contact: data.phone || "",
    });
    const subscription = await instance.subscriptions.create({
      plan_id: plan.razorpayPlanId,
      // customer_id: "cust_RMHGJlEeDjJBNP",
      customer_id: customer.id,
      customer_notify: 1,
      total_count: plan.durationInMonths,
      notes: {
        businessAccountId: data.id,
        plan: plan._id,
      },
    });
    await SubscriptionLog.create({
      businessAccount: data.id,
      // customer_id: "cust_RMHGJlEeDjJBNP",
      customer_id: customer.id,
      razorpaySubscriptionId: subscription.id,
      razorpayPlanId: plan.razorpayPlanId,
      status: "created",
    });
    return res.send(
      sendResponse(
        { subscriptionId: subscription.id },
        "Data processed successfully"
      )
    );
  })
);

//verify sub payment
router.post(
  "/verify-payment",
  asyncHandler(async (req, res) => {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      user_id,
      plan_id,
    } = req.body;
    // Verify the signature
    const crypto = require("crypto");
    const body = razorpay_payment_id + "|" + razorpay_subscription_id;
    const expectedSignature = crypto
      .createHmac("sha256", config.razorpay.key_secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is verified - update user subscription in your database
      await BusinessUserPlan.updateMany(
        { businessAccount: user_id, isActive: true },
        { $set: { isActive: false } }
      );
      await BusinessUserPlan.create({
        businessAccount: user_id,
        plan: plan_id,
        razorpaySubscriptionId: razorpay_subscription_id,
        paymentStatus: "pending_activation",
        isActive: true,
        startDate: new Date(),
      });
      res.send(
        sendResponse({
          success: true,
          message: "Payment verified successfully",
        })
      );
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  })
);

//verify change payment method
router.post(
  "/verify-update-method",
  asyncHandler(async (req, res) => {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body; // Verify the signature
    const subscriptionId = razorpay_subscription_id;
    const crypto = require("crypto");
    const body = razorpay_payment_id + "|" + razorpay_subscription_id;
    const expectedSignature = crypto
      .createHmac("sha256", config.razorpay.key_secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const subscription = await SubscriptionLog.findOne({
        razorpaySubscriptionId: subscriptionId,
      });
      const payment = await instance.payments.fetch(razorpay_payment_id);
      const subscriptionDetails = await instance.subscriptions.fetch(
        razorpay_subscription_id
      );

      // console.log(tokenId);
      // console.log(customerId);
      // if (tokenId) {
      //   console.log("Inside token ID");
      //   try {
      //     const newMethod = await axios.post(
      //       `https://api.razorpay.com/v1/subscriptions/${subscriptionId}/change_payment_method`,
      //       {
      //         customer_id: subscription.customer_id,
      //         token: tokenId,
      //       }
      //     );
      //     console.log(newMethod.data);
      //   } catch (err) {
      //     console.log("Subscription Update Error:", err);
      //     return res
      //       .status(500)
      //       .json({ success: false, message: "Failed to update subscription" });
      //   }
      // }
      const log = await PaymentLog.create({
        subscriptionId: razorpay_subscription_id,
        paymentId: payment.id,
        status: payment.status, // 'authorized' or 'captured'
        desc: "Payment for subscription change method",
        rawPayload: {
          payload: {
            payment: {
              entity: payment,
            },
          },
        },
      });
      // Payment is verified - update user subscription in your database
      await SubscriptionLog.updateOne(
        { razorpaySubscriptionId: subscriptionId },
        { $set: { latest_payment_method: payment.method } }
      );
      // await PaymentLog.create({})
      res.send(
        sendResponse({
          success: true,
          message: "Payment verified successfully",
        })
      );
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  })
);

router.put("/create-update-order/:subscriptionId", async (req, res) => {
  const subscriptionLog = await SubscriptionLog.findOne({
    razorpaySubscriptionId: req.params.subscriptionId,
  });
  const order = await instance.orders.create({
    amount: 100, // ₹1 in paise
    currency: "INR",
    receipt: `receipt_${req.params.subscriptionId}`,
    customer_id: subscriptionLog.customer_id,
    notes: { update_method: true },
  });
  return res.send(sendResponse(order));
});

router.put("/subscription/:id", async (req, res) => {
  const data = await BusinessUserPlan.updateOne(
    { razorpaySubscriptionId: req.params.id },
    { $set: { isPaymentMethodUpdating: req.body.isPaymentMethodUpdating } }
  );
  return res.send(sendResponse("Data updated successfully"));
});

module.exports = router;
