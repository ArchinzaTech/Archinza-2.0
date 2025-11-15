# Razorpay Payment Integration Guide for Archinza 2.0

## Table of Contents
1. [Overview](#overview)
2. [Version & Setup](#version--setup)
3. [Authentication](#authentication)
4. [Subscriptions](#subscriptions)
5. [Payment Processing](#payment-processing)
6. [Webhooks](#webhooks)
7. [Invoice Generation](#invoice-generation)
8. [Best Practices](#best-practices)
9. [Patterns in Archinza](#patterns-in-archinza)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Razorpay is the payment gateway used in Archinza 2.0 for processing payments, managing subscriptions, and handling billing for business accounts.

### Key Features
- **Multiple payment methods** - Cards, UPI, Netbanking, Wallets
- **Subscriptions** - Recurring billing management
- **Webhooks** - Real-time payment notifications
- **Invoices** - Automated invoice generation
- **Refunds** - Easy refund processing

### Archinza Use Cases
1. **Business subscriptions** - Monthly/annual plans
2. **Payment tracking** - Transaction logs
3. **Invoice generation** - Automated billing
4. **Webhook handling** - Payment status updates

---

## Version & Setup

### Razorpay SDK Version

```json
{
  "razorpay": "^2.9.6"
}
```

### Installation

```bash
npm install razorpay
```

### Environment Variables

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxx
```

---

## Authentication

### Initialize Razorpay Instance

```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

module.exports = razorpay;
```

### Verify Webhook Signature

```javascript
const crypto = require('crypto');

const verifyWebhookSignature = (body, signature, secret) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');

  return expectedSignature === signature;
};

module.exports = { verifyWebhookSignature };
```

---

## Subscriptions

### 1. Create Subscription Plan

```javascript
const createPlan = async (planData) => {
  const plan = await razorpay.plans.create({
    period: 'monthly', // or 'yearly', 'weekly', 'daily'
    interval: 1,
    item: {
      name: planData.name,
      description: planData.description,
      amount: planData.amount * 100, // Amount in paise
      currency: 'INR'
    }
  });

  return plan;
};

// Example
const basicPlan = await createPlan({
  name: 'Basic Plan',
  description: 'Basic business subscription',
  amount: 999 // ₹999
});
```

### 2. Create Subscription

```javascript
const createSubscription = async (planId, customerData) => {
  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: 12, // Total billing cycles
    quantity: 1,
    notes: {
      userId: customerData.userId,
      email: customerData.email
    }
  });

  return subscription;
};

// Usage
const subscription = await createSubscription(plan.id, {
  userId: '507f1f77bcf86cd799439011',
  email: 'user@example.com'
});
```

### 3. Fetch Subscription Details

```javascript
const getSubscription = async (subscriptionId) => {
  const subscription = await razorpay.subscriptions.fetch(subscriptionId);
  return subscription;
};
```

### 4. Cancel Subscription

```javascript
const cancelSubscription = async (subscriptionId) => {
  const subscription = await razorpay.subscriptions.cancel(subscriptionId);
  return subscription;
};
```

### 5. Update Subscription

```javascript
const updateSubscription = async (subscriptionId, updates) => {
  const subscription = await razorpay.subscriptions.update(subscriptionId, {
    quantity: updates.quantity,
    schedule_change_at: 'cycle_end' // or 'now'
  });

  return subscription;
};
```

---

## Payment Processing

### 1. Create Order

```javascript
const createOrder = async (amount, currency = 'INR', receipt) => {
  const order = await razorpay.orders.create({
    amount: amount * 100, // Amount in paise
    currency,
    receipt, // Unique receipt ID
    notes: {
      description: 'Payment for business subscription'
    }
  });

  return order;
};

// Route
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const receipt = `rcpt_${Date.now()}`;

    const order = await createOrder(amount, 'INR', receipt);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Verify Payment Signature

```javascript
const crypto = require('crypto');

const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const text = `${orderId}|${paymentId}`;
  const generated = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
    .update(text)
    .digest('hex');

  return generated === signature;
};

// Route to verify payment
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const isValid = verifyPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Payment verified - update database
    await PaymentLog.create({
      orderId,
      paymentId,
      userId: req.userId,
      status: 'success'
    });

    res.json({ success: true, message: 'Payment verified' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Fetch Payment Details

```javascript
const getPayment = async (paymentId) => {
  const payment = await razorpay.payments.fetch(paymentId);
  return payment;
};
```

### 4. Capture Payment

```javascript
const capturePayment = async (paymentId, amount) => {
  const payment = await razorpay.payments.capture(
    paymentId,
    amount * 100, // Amount in paise
    'INR'
  );

  return payment;
};
```

### 5. Refund Payment

```javascript
const refundPayment = async (paymentId, amount = null) => {
  const options = { payment_id: paymentId };

  if (amount) {
    options.amount = amount * 100; // Partial refund
  }

  const refund = await razorpay.payments.refund(paymentId, options);
  return refund;
};

// Full refund
await refundPayment('pay_xxxxx');

// Partial refund
await refundPayment('pay_xxxxx', 500); // ₹500
```

---

## Webhooks

### 1. Webhook Route Setup

```javascript
const express = require('express');
const router = express.Router();

// Important: Use raw body for signature verification
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const signature = req.headers['x-razorpay-signature'];

      // Verify signature
      const isValid = verifyWebhookSignature(
        req.body,
        signature,
        process.env.RAZORPAY_SECRET_KEY
      );

      if (!isValid) {
        return res.status(400).json({ error: 'Invalid signature' });
      }

      // Parse body
      const event = JSON.parse(req.body.toString());

      // Handle different events
      await handleWebhookEvent(event);

      res.json({ status: 'ok' });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
```

### 2. Handle Webhook Events

```javascript
const handleWebhookEvent = async (event) => {
  const { event: eventType, payload } = event;

  switch (eventType) {
    case 'payment.captured':
      await handlePaymentCaptured(payload.payment.entity);
      break;

    case 'payment.failed':
      await handlePaymentFailed(payload.payment.entity);
      break;

    case 'subscription.activated':
      await handleSubscriptionActivated(payload.subscription.entity);
      break;

    case 'subscription.charged':
      await handleSubscriptionCharged(payload.subscription.entity, payload.payment.entity);
      break;

    case 'subscription.cancelled':
      await handleSubscriptionCancelled(payload.subscription.entity);
      break;

    case 'subscription.completed':
      await handleSubscriptionCompleted(payload.subscription.entity);
      break;

    default:
      console.log('Unhandled event:', eventType);
  }
};
```

### 3. Event Handlers

```javascript
const handlePaymentCaptured = async (payment) => {
  await PaymentLog.create({
    paymentId: payment.id,
    orderId: payment.order_id,
    amount: payment.amount / 100,
    status: 'captured',
    method: payment.method
  });

  console.log('Payment captured:', payment.id);
};

const handleSubscriptionActivated = async (subscription) => {
  await BusinessUserPlan.findOneAndUpdate(
    { subscriptionId: subscription.id },
    {
      status: 'active',
      activatedAt: new Date()
    }
  );

  console.log('Subscription activated:', subscription.id);
};

const handleSubscriptionCharged = async (subscription, payment) => {
  await SubscriptionLog.create({
    subscriptionId: subscription.id,
    paymentId: payment.id,
    amount: payment.amount / 100,
    status: 'charged'
  });

  console.log('Subscription charged:', subscription.id);
};

const handleSubscriptionCancelled = async (subscription) => {
  await BusinessUserPlan.findOneAndUpdate(
    { subscriptionId: subscription.id },
    {
      status: 'cancelled',
      cancelledAt: new Date()
    }
  );

  console.log('Subscription cancelled:', subscription.id);
};
```

---

## Invoice Generation

### 1. Create Invoice

```javascript
const createInvoice = async (invoiceData) => {
  const invoice = await razorpay.invoices.create({
    type: 'invoice',
    description: invoiceData.description,
    customer: {
      name: invoiceData.customerName,
      email: invoiceData.customerEmail,
      contact: invoiceData.customerPhone
    },
    line_items: invoiceData.items.map(item => ({
      name: item.name,
      description: item.description,
      amount: item.amount * 100,
      currency: 'INR',
      quantity: item.quantity
    })),
    currency: 'INR',
    sms_notify: 1,
    email_notify: 1
  });

  return invoice;
};

// Usage
const invoice = await createInvoice({
  description: 'Monthly subscription fee',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '9876543210',
  items: [{
    name: 'Basic Plan',
    description: 'Monthly subscription',
    amount: 999,
    quantity: 1
  }]
});
```

### 2. Fetch Invoice

```javascript
const getInvoice = async (invoiceId) => {
  const invoice = await razorpay.invoices.fetch(invoiceId);
  return invoice;
};
```

### 3. Cancel Invoice

```javascript
const cancelInvoice = async (invoiceId) => {
  const invoice = await razorpay.invoices.cancel(invoiceId);
  return invoice;
};
```

---

## Best Practices

### 1. Always Verify Signatures

```javascript
// ✅ Good: Verify all webhook signatures
const isValid = verifyWebhookSignature(body, signature, secret);
if (!isValid) {
  return res.status(400).json({ error: 'Invalid signature' });
}

// ❌ Bad: Trust webhook without verification
await handleWebhookEvent(req.body);
```

### 2. Use Idempotency

```javascript
// Check if payment already processed
const existingPayment = await PaymentLog.findOne({ paymentId });
if (existingPayment) {
  return res.json({ message: 'Already processed' });
}

// Process payment
await PaymentLog.create({ paymentId, ... });
```

### 3. Log All Transactions

```javascript
const razorpayLogger = require('../logger/razorpayLogger');

razorpayLogger.info({
  event: 'payment.captured',
  paymentId: payment.id,
  amount: payment.amount,
  timestamp: new Date()
});
```

### 4. Handle Errors Gracefully

```javascript
try {
  await razorpay.subscriptions.create(params);
} catch (error) {
  if (error.statusCode === 400) {
    // Bad request - validation error
    console.error('Validation error:', error.error);
  } else if (error.statusCode === 401) {
    // Authentication error
    console.error('Invalid credentials');
  } else {
    // Other errors
    console.error('Razorpay error:', error);
  }

  throw error;
}
```

### 5. Test in Test Mode

```env
# Use test credentials for development
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxx

# Use live credentials for production
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxx
```

---

## Patterns in Archinza

### 1. Business Subscription Flow

```javascript
// Step 1: Create subscription plan (done once)
const plan = await BusinessPlan.findOne({ name: 'Basic' });

// Step 2: Create Razorpay subscription
const rzpSubscription = await razorpay.subscriptions.create({
  plan_id: plan.razorpayPlanId,
  customer_notify: 1,
  total_count: 12,
  notes: {
    businessId: business._id.toString()
  }
});

// Step 3: Save subscription to database
await BusinessUserPlan.create({
  businessId: business._id,
  planId: plan._id,
  subscriptionId: rzpSubscription.id,
  status: 'created',
  amount: plan.price,
  billingCycle: 'monthly'
});

// Step 4: Return subscription details to frontend
res.json({
  subscriptionId: rzpSubscription.id,
  planName: plan.name,
  amount: plan.price
});
```

### 2. Payment Verification

```javascript
router.post('/verify-subscription-payment', auth, async (req, res) => {
  const { subscriptionId, paymentId, signature } = req.body;

  // Verify signature
  const text = `${paymentId}|${subscriptionId}`;
  const generated = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
    .update(text)
    .digest('hex');

  if (generated !== signature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Update subscription status
  await BusinessUserPlan.findOneAndUpdate(
    { subscriptionId },
    {
      status: 'active',
      lastPaymentId: paymentId,
      activatedAt: new Date()
    }
  );

  // Log payment
  await PaymentLog.create({
    subscriptionId,
    paymentId,
    amount: subscription.amount,
    status: 'success'
  });

  res.json({ success: true });
});
```

### 3. Webhook Logging

```javascript
const handleWebhookEvent = async (event) => {
  // Log to Razorpay-specific logger
  razorpayLogger.info({
    event: event.event,
    subscriptionId: event.payload.subscription?.entity?.id,
    paymentId: event.payload.payment?.entity?.id,
    timestamp: new Date()
  });

  // Process event
  await processEvent(event);
};
```

---

## Troubleshooting

### Common Issues

1. **Invalid Signature Error**
   ```
   Error: Invalid signature

   Fix:
   - Verify webhook secret matches
   - Use raw body for signature verification
   - Check signature header name
   ```

2. **Subscription Not Activating**
   ```
   Issue: Subscription stays in 'created' state

   Fix:
   - Customer must complete payment
   - Check webhook is configured
   - Verify payment was successful
   ```

3. **Amount Mismatch**
   ```javascript
   // Remember: Razorpay uses paise (smallest currency unit)
   const amountInPaise = amount * 100;
   const amountInRupees = razorpayAmount / 100;
   ```

4. **Webhook Not Received**
   ```
   Fix:
   - Check webhook URL is publicly accessible
   - Verify webhook is configured in Razorpay dashboard
   - Check server logs for errors
   ```

---

## Additional Resources

- [Razorpay Official Docs](https://razorpay.com/docs/)
- [Razorpay Node SDK](https://github.com/razorpay/razorpay-node)
- [Webhook Documentation](https://razorpay.com/docs/webhooks/)
- [Subscription API](https://razorpay.com/docs/api/subscriptions/)

---

## Summary

Razorpay in Archinza provides:
- **Subscription management** - Recurring billing for business plans
- **Payment processing** - Multiple payment methods
- **Webhook integration** - Real-time payment notifications
- **Invoice generation** - Automated billing
- **Transaction tracking** - Complete payment logs
- **Security** - Signature verification for all webhooks

For detailed integration guide, see `/docs/RAZORPAY_INTEGRATION.md` (21KB comprehensive documentation).
