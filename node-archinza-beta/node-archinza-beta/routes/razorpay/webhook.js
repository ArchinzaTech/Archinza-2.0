const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const config = require("../../config/config");
const PaymentLog = require("../../models/paymentLogs");
const BusinessUserPlan = require("../../models/businessUserPlan");
const SubscriptionLog = require("../../models/subscriptionLogs");
const Invoice = require("../../models/businessInvoice");
const { v4: uuidv4 } = require("uuid");
// const { razorpayLogger } = require("../../middlewares/razorpayLogger"); // Assuming logger middleware

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const secret = config.razorpay.key_secret;
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body; // raw buffer

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    // if (signature !== expectedSignature) {
    //   console.error("Invalid Razorpay signature");
    //   return res.status(200).json({ error: "Invalid signature" });
    // }

    const event = JSON.parse(body.toString("utf8"));
    console.log("✅ Webhook Event:", event.event);

    try {
      switch (event.event) {
        // case "subscription.authenticated": {
        //   const sub = event.payload.subscription.entity;
        //   await BusinessUserPlan.updateOne(
        //     { razorpaySubscriptionId: sub.id },
        //     { $set: { paymentStatus: "authenticated" } }
        //   );
        //   break;
        // }

        case "subscription.activated": {
          const sub = event.payload.subscription.entity;
          const businessAccountId = sub.notes?.businessAccountId;
          await BusinessUserPlan.updateOne(
            {
              businessAccount: businessAccountId,
              razorpaySubscriptionId: sub.id,
              isActive: true,
            },
            {
              $set: {
                paymentStatus: "activated",
                startDate: new Date(sub.start_at * 1000),
                endDate: new Date(sub.current_end * 1000),
                nextBillingDate: new Date(sub.current_end * 1000),
              },
            }
          );
          await SubscriptionLog.updateOne(
            { razorpaySubscriptionId: sub.id },
            {
              $set: {
                status: sub.status,
                rawResponse: sub,
              },
            }
          );

          break;
        }

        case "subscription.charged": {
          const sub = event.payload.subscription.entity;
          const payment = event.payload.payment.entity;

          await PaymentLog.updateOne(
            {
              razorpayPaymentId: payment.id,
            },
            {
              businessAccount: sub.notes?.businessAccountId,
              subscriptionId: sub.id,
              event: event.event,
              rawPayload: event,
              cycleStart: new Date(sub.current_start * 1000),
              cycleEnd: new Date(sub.current_end * 1000),
            }
          );
          await SubscriptionLog.updateOne(
            { razorpaySubscriptionId: sub.id },
            {
              $set: {
                status: sub.status,
                rawResponse: sub,
              },
            }
          );

          await Invoice.updateOne(
            { paymentId: payment.id },
            {
              $set: {
                businessId: sub.notes?.businessAccountId,
                subscriptionId: sub.id,
                plan: sub.notes.plan,
                invoiceDate: new Date(),
                nextBillingDate: new Date(sub.current_end * 1000),
              },
            }
          );
          break;
        }

        case "subscription.cancelled": {
          const sub = event.payload.subscription.entity;
          await BusinessUserPlan.updateOne(
            { razorpaySubscriptionId: sub.id },
            { $set: { status: "cancelled", isActive: false } }
          );
          await SubscriptionLog.updateOne(
            { razorpaySubscriptionId: sub.id },
            {
              $set: {
                status: sub.status,
                rawResponse: sub,
              },
            }
          );
          break;
        }

        case "subscription.completed": {
          const sub = event.payload.subscription.entity;
          await BusinessUserPlan.updateOne(
            { razorpaySubscriptionId: sub.id },
            { $set: { paymentStatus: "completed", isActive: false } }
          );
          await SubscriptionLog.updateOne(
            { razorpaySubscriptionId: sub.id },
            {
              $set: {
                status: sub.status,
                rawResponse: sub,
              },
            }
          );
          break;
        }

        case "subscription.updated": {
          const sub = event.payload.subscription.entity;
          await BusinessUserPlan.updateOne(
            { razorpaySubscriptionId: sub.id },
            {
              $set: {
                plan: sub.plan_id,
                nextBillingDate: new Date(sub.current_end * 1000),
                status: sub.status,
                paymentMethod: sub.payment_method,
              },
            }
          );
          await SubscriptionLog.updateOne(
            { razorpaySubscriptionId: sub.id },
            {
              $set: {
                status: sub.status,
                rawResponse: sub,
              },
            }
          );
          break;
        }

        case "payment.captured": {
          const payment = event.payload.payment.entity;
          await PaymentLog.create({
            // businessAccount: payment.notes?.businessAccountId,
            razorpayPaymentId: payment.id,
            amount: payment.amount / 100,
            currency: payment.currency,
            status: payment.status,
            event: event.event,
            rawPayload: event,
            desc: "Payment captured for Subscription",
          });
          const existing = await Invoice.findOne({ paymentId: payment.id });
          if (existing) break;

          await Invoice.create({
            invoiceId: `INV-${uuidv4()}`,
            // businessId: payment.notes.businessAccountId,
            // subscriptionId: payment.notes.subscriptionId,
            paymentId: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            paymentMethod: {
              type: payment.method,
              info:
                payment.method === "card"
                  ? `**** **** **** ${payment.card?.last4}`
                  : payment.method === "upi"
                  ? payment.vpa
                  : payment.method === "netbanking"
                  ? payment.bank
                  : payment.wallet,
              network: payment.card?.network || null,
            },
            // customer: {
            //   name: payment.notes.customer_name,
            //   email: payment.customer_email,
            //   contact: payment.customer_contact,
            // },
            // plan: {
            //   name: payment.notes.plan || "N/A",
            //   price: payment.amount / 100,
            //   durationInMonths: payment.notes.plan_duration || null,
            // },
            rawPayload: payment,
          });
          break;
        }

        case "payment.failed": {
          const payment = event.payload.payment.entity;
          await PaymentLog.create({
            businessAccount: payment.notes?.businessAccountId,
            razorpayPaymentId: payment.id,
            amount: payment.amount / 100,
            currency: payment.currency,
            status: payment.status,
            event: event.event,
            rawPayload: event,
            desc: "Payment failed for Subscription",
          });
          break;
        }
      }
    } catch (err) {
      console.error("❌ Error processing webhook:", err);
    }

    res.status(200).json({ status: "ok" });
  })
);

module.exports = router;
