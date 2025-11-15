# Razorpay Integration Documentation

## Table of Contents
1. [Overview](#overview)
2. [Configuration](#configuration)
3. [Database Models](#database-models)
4. [Backend API](#backend-api)
5. [Frontend Integration](#frontend-integration)
6. [Webhook Handling](#webhook-handling)
7. [Payment Flow](#payment-flow)
8. [Admin Panel](#admin-panel)
9. [Security](#security)
10. [Supported Payment Methods](#supported-payment-methods)

---

## Overview

Archinza uses Razorpay for subscription-based payment processing. The integration supports:
- Recurring subscriptions with customizable billing cycles
- Multiple payment methods (Cards, UPI, Net Banking, Wallets)
- Webhook-based payment status updates
- Invoice generation and management
- Payment history tracking
- Payment method updates

---

## Configuration

### Backend Configuration

**File:** `node-archinza-beta/node-archinza-beta/config/config.js`

```javascript
razorpay: {
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
}
```

**Required Environment Variables:**
- `RAZORPAY_KEY_ID` - Public API key (shared with frontend)
- `RAZORPAY_SECRET_KEY` - Secret key (backend only, never exposed)

### Frontend Configuration

**File:** `archinza-front-beta/archinza-front-beta/src/config/config.js`

```javascript
razorpay_key_id: process.env.REACT_APP_RZP_KEY
```

**Required Environment Variables:**
- `REACT_APP_RZP_KEY` - Public Razorpay key for checkout

---

## Database Models

### 1. BusinessPlan

**File:** `node-archinza-beta/node-archinza-beta/models/businessPlan.js`

Defines subscription plans available to users.

```javascript
{
  name: String,                    // Plan name (e.g., "Starter Plan", "Supporter Plan")
  price: Number,                   // Price in INR
  description: String,             // Plan description
  durationInMonths: Number,        // Billing cycle duration
  features: {
    fileUploadLimit: Number,       // Default: 5
    filePageLimit: Number,         // Default: 100
    fileSizeLimitMB: Number,       // Default: 100
    imagesLimit: Number,           // Default: 200
    externalLinksLimit: Number,    // Default: 0
    privateContentToggle: Boolean, // Default: false
    communityAccess: Boolean,      // Default: false
    recentlyDeletedLimit: Number,  // Default: 0
    unusedImagesLimit: Number,     // Default: 0
  },
  razorpayPlanId: String,          // Razorpay plan ID for recurring billing
  isActive: Boolean,               // Default: true
  isDefault: Boolean,              // Default: false
}
```

### 2. BusinessUserPlan

**File:** `node-archinza-beta/node-archinza-beta/models/businessUserPlan.js`

Tracks user subscriptions and their status.

```javascript
{
  businessAccount: ObjectId,           // Reference to BusinessAccount
  plan: ObjectId,                      // Reference to BusinessPlan
  startDate: Date,                     // Subscription start date
  endDate: Date,                       // Subscription end date
  isActive: Boolean,                   // Default: true
  paymentStatus: String,               // "pending_activation", "activated", "completed"
  razorpaySubscriptionId: String,      // Subscription ID from Razorpay
  razorpayPaymentId: String,           // Payment ID from Razorpay
  razorpayOrderId: String,             // Order ID from Razorpay
  nextBillingDate: Date,               // Next billing date
}
```

### 3. PaymentLog

**File:** `node-archinza-beta/node-archinza-beta/models/paymentLogs.js`

Logs all payment transactions.

```javascript
{
  businessAccount: ObjectId,       // Reference to business
  subscriptionId: String,          // Razorpay subscription ID
  razorpayPaymentId: String,       // Razorpay payment ID
  amount: Number,                  // Amount in rupees (already divided by 100)
  currency: String,                // Currency code (e.g., "INR")
  status: String,                  // "captured", "authorized", "failed"
  event: String,                   // Webhook event type
  rawPayload: Object,              // Full webhook payload
  desc: String,                    // Description
  cycleStart: Date,                // Billing cycle start
  cycleEnd: Date,                  // Billing cycle end
  createdAt: Date,                 // Automatically managed
}
```

### 4. SubscriptionLog

**File:** `node-archinza-beta/node-archinza-beta/models/subscriptionLogs.js`

Logs subscription lifecycle events.

```javascript
{
  businessAccount: ObjectId,       // Reference to business
  customer_id: String,             // Razorpay customer ID
  razorpaySubscriptionId: String,  // Razorpay subscription ID
  razorpayPlanId: String,          // Razorpay plan ID
  rawResponse: Object,             // Full Razorpay response
  status: String,                  // "created", "activated", "charged", "cancelled"
  latest_payment_method: String,   // Latest payment method used
  createdAt: Date,                 // Automatically managed
}
```

### 5. BusinessInvoice

**File:** `node-archinza-beta/node-archinza-beta/models/businessInvoice.js`

Stores invoice details for payments.

```javascript
{
  invoiceId: String,               // Unique invoice ID (INV-UUID format)
  businessId: ObjectId,            // Reference to business
  plan: ObjectId,                  // Reference to plan
  subscriptionId: String,          // Razorpay subscription ID
  paymentId: String,               // Razorpay payment ID
  amount: Number,                  // Amount in paise
  currency: String,                // Currency (default: "INR")
  status: String,                  // Default: "captured"
  paymentMethod: {
    type: String,                  // "card", "upi", "netbanking", "wallet"
    info: String,                  // Last 4 digits or VPA/bank name
    network: String,               // Card network (e.g., "Visa", "Mastercard")
  },
  customer: {
    name: String,
    email: String,
    contact: String,
    address: String,
  },
  invoiceDate: Date,               // Default: now
  nextBillingDate: Date,           // For recurring billing
  rawPayload: Object,              // Full payment details from Razorpay
  timestamps: true,                // createdAt, updatedAt
}
```

---

## Backend API

### Subscription Routes

**File:** `node-archinza-beta/node-archinza-beta/routes/businessSubscription.js`

#### Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Fetch all business plans | No |
| GET | `/:id/payments` | Get payment history for a business | Yes |
| GET | `/latest/:id` | Get current active subscription | Yes |
| GET | `/payment-method/:subscriptionId` | Fetch payment method details | Yes |
| GET | `/subscription/:id/change-method` | Get short URL for payment method update | Yes |
| GET | `/invoice/:paymentId` | Fetch invoice by payment ID | Yes |
| GET | `/invoice-by-id/:invoiceId` | Fetch invoice by invoice ID | Yes |
| POST | `/subscribe` | Create new subscription | Yes |
| POST | `/verify-payment` | Verify payment signature | Yes |
| POST | `/verify-update-method` | Verify payment for method update | Yes |
| PUT | `/create-update-order/:subscriptionId` | Create order for updating payment method | Yes |
| PUT | `/subscription/:id` | Update subscription status | Yes |

### Key Endpoint Details

#### POST /subscribe

Creates a new Razorpay subscription.

**Request Body:**
```javascript
{
  data: {
    business_name: String,
    email: String,
    phone: String,
    country_code: String,
    _id: ObjectId
  },
  plan: {
    _id: ObjectId,
    name: String,
    razorpayPlanId: String,
    durationInMonths: Number
  }
}
```

**Response:**
```javascript
{
  subscriptionId: String,  // Razorpay subscription ID
  customerId: String       // Razorpay customer ID
}
```

**Process:**
1. Creates or fetches Razorpay customer
2. Creates Razorpay subscription with plan details
3. Logs subscription in SubscriptionLog
4. Returns subscription ID for frontend checkout

#### POST /verify-payment

Verifies payment signature after successful payment.

**Request Body:**
```javascript
{
  razorpay_payment_id: String,
  razorpay_subscription_id: String,
  razorpay_signature: String
}
```

**Process:**
1. Generates HMAC SHA256 signature using secret key
2. Compares with received signature
3. Creates BusinessUserPlan with status "pending_activation"
4. Deactivates previous plans
5. Returns success/failure response

**Signature Verification:**
```javascript
const generated_signature = crypto
  .createHmac("sha256", config.razorpay.key_secret)
  .update(razorpay_payment_id + "|" + razorpay_subscription_id)
  .digest("hex");
```

#### GET /:id/payments

Retrieves payment history for a business with aggregated data.

**Response:**
```javascript
[
  {
    _id: ObjectId,
    razorpayPaymentId: String,
    amount: Number,
    currency: String,
    status: String,
    createdAt: Date,
    paymentMethod: {
      type: String,
      info: String,
      network: String
    },
    subscriptionInfo: {
      customer_id: String,
      razorpaySubscriptionId: String
    },
    paymentPeriod: String
  }
]
```

#### PUT /create-update-order/:subscriptionId

Creates a ₹1 order for payment method verification.

**Response:**
```javascript
{
  order_id: String,
  amount: Number,
  currency: String,
  receipt: String
}
```

---

## Frontend Integration

### Checkout Component

**File:** `archinza-front-beta/archinza-front-beta/src/pages/Checkout/Checkout.jsx`

#### Props
```javascript
{
  plan: Object,              // Plan details
  user: Object,              // User/business details
  subscription: Object,      // Contains subscriptionId
  onPaymentSuccess: Function,
  onPaymentFailure: Function,
  onClose: Function
}
```

#### Razorpay Checkout Options
```javascript
{
  key: config.razorpay_key_id,
  subscription_id: subscriptionId,
  payment_methods: {
    card: 1,
    upi: 1,
    netbanking: 1
  },
  name: "Archinza",
  description: `Subscription for ${plan.name}`,
  prefill: {
    name: user.business_name || user.name,
    email: user.email,
    contact: `${user?.country_code}${user.phone}`
  },
  notes: {
    businessAccountId: user?._id,
    plan: plan?._id
  },
  theme: {
    color: "#F37254"
  },
  handler: function(response) {
    // Verify payment on backend
    verifyPayment(response);
  },
  modal: {
    ondismiss: onClose
  }
}
```

### Subscription Plans Component

**File:** `archinza-front-beta/archinza-front-beta/src/pages/BusinessProfile/BusinessProfileComponents/Plan/SubscriptionPlans.jsx`

#### Key Functions

**createSubscription(planIndex)**
- Creates subscription on backend
- Receives subscriptionId
- Calls initiatePayment()

**initiatePayment(plan, subscriptionId)**
- Loads Razorpay script dynamically
- Opens Razorpay checkout modal
- Handles payment success/failure callbacks

### Payment Success Page

**File:** `archinza-front-beta/archinza-front-beta/src/pages/PaymentSuccessfull/PaymentSuccessfull.jsx`

- Displays congratulations message
- Shows confetti animation
- Auto-redirects to dashboard after 5 seconds
- Allows copying profile link

### Invoice Components

**User Invoice View:** `archinza-front-beta/archinza-front-beta/src/pages/BusinessProfile/BusinessProfileComponents/Plan/Invoice.jsx`

**Invoice Print View:** `archinza-front-beta/archinza-front-beta/src/pages/BusinessProfile/BusinessProfileComponents/Plan/InvoicePrint.jsx`

---

## Webhook Handling

### Webhook Endpoint

**File:** `node-archinza-beta/node-archinza-beta/routes/razorpay/webhook.js`

**Route:** `POST /razorpay/webhook`

### Webhook Setup in Main App

**File:** `node-archinza-beta/node-archinza-beta/index.js` (Lines 66-71)

```javascript
app.use(
  "/razorpay/webhook",
  express.raw({ type: "application/json" }),
  razorpayLogger,
  require("./routes/razorpay/webhook")
);
```

### Signature Verification

All webhooks verify authenticity using HMAC SHA256:

```javascript
const expectedSignature = crypto
  .createHmac("sha256", config.razorpay.key_secret)
  .update(rawBody)
  .digest("hex");

if (expectedSignature === receivedSignature) {
  // Process webhook
}
```

### Supported Webhook Events

#### 1. subscription.activated
- Updates BusinessUserPlan paymentStatus to "activated"
- Sets subscription start and end dates
- Updates isActive status

#### 2. subscription.charged
- Creates PaymentLog entry
- Extracts payment method from raw payload
- Creates or updates BusinessInvoice
- Logs billing cycle details

#### 3. subscription.cancelled
- Sets BusinessUserPlan isActive to false
- Updates SubscriptionLog status to "cancelled"

#### 4. subscription.completed
- Updates BusinessUserPlan paymentStatus to "completed"
- Marks subscription as inactive

#### 5. subscription.updated
- Updates BusinessUserPlan details
- Updates next billing date

#### 6. payment.captured
- Creates PaymentLog entry
- Generates invoice with unique invoice ID
- Extracts payment method details
- Stores raw payment payload

#### 7. payment.failed
- Logs failed payment attempt
- Stores error details for debugging

### Webhook Logging

**Logger File:** `node-archinza-beta/node-archinza-beta/logger/razorpay_logger.js`

**Middleware:** `node-archinza-beta/node-archinza-beta/middlewares/razorpayLogger.js`

All webhook events are logged to CloudWatch with stream name "razorpay-api" for audit and debugging.

---

## Payment Flow

### Complete Subscription Flow

```
1. User selects plan on frontend
   ↓
2. Frontend calls POST /business-plans/subscribe
   ↓
3. Backend creates/fetches Razorpay customer
   ↓
4. Backend creates Razorpay subscription
   - plan_id: razorpayPlanId
   - customer_notify: 1
   - total_count: plan.durationInMonths
   - notes: { businessAccountId, plan }
   ↓
5. SubscriptionLog entry created in DB
   ↓
6. Backend returns subscriptionId to frontend
   ↓
7. Frontend opens Razorpay checkout modal
   ↓
8. User completes payment
   ↓
9. Razorpay sends response to frontend handler
   ↓
10. Frontend calls POST /business-plans/verify-payment
    ↓
11. Backend verifies HMAC signature
    ↓
12. Creates BusinessUserPlan with status "pending_activation"
    ↓
13. Deactivates previous plans
    ↓
14. Razorpay webhook sends subscription.activated event
    ↓
15. Webhook updates paymentStatus to "activated"
    ↓
16. User redirected to success page
```

### Payment Method Update Flow

```
1. User requests payment method change
   ↓
2. Frontend calls PUT /create-update-order/:subscriptionId
   ↓
3. Backend creates ₹1 order with Razorpay
   ↓
4. Frontend opens checkout with order_id
   ↓
5. User completes ₹1 payment with new method
   ↓
6. Frontend calls POST /verify-update-method
   ↓
7. Backend verifies signature
   ↓
8. Fetches payment details from Razorpay
   ↓
9. Updates SubscriptionLog with new payment method
   ↓
10. Creates PaymentLog entry
    ↓
11. Returns success response
```

### Recurring Payment Flow

```
1. Razorpay automatically charges on billing date
   ↓
2. Webhook sends subscription.charged event
   ↓
3. Creates PaymentLog entry
   ↓
4. Generates BusinessInvoice
   ↓
5. Updates next billing date
   ↓
6. Customer receives email notification
```

---

## Admin Panel

### Payment History Table

**File:** `admin-archinza-beta/admin-archinza-beta/src/pages/BusinessAccountUsers/PaymentHistory.jsx`

Displays payment logs with columns:
- Customer ID
- Payment ID (Razorpay)
- Amount
- Status
- Payment Method
- Method Details (Card last 4, UPI ID, Bank name, Wallet name)
- Invoice view button

### Subscription Logs

**File:** `admin-archinza-beta/admin-archinza-beta/src/pages/BusinessAccountUsers/SubscriptionLogs.jsx`

Displays subscription lifecycle:
- Subscription ID
- Status
- Customer ID
- Plan ID
- Latest payment method
- Raw Razorpay responses for debugging

### Admin Invoice View

**File:** `admin-archinza-beta/admin-archinza-beta/src/pages/BusinessAccountUsers/BusinessInvoice/Invoice.jsx`

Full invoice details including:
- Invoice ID
- Payment details
- Customer information
- Plan details
- Payment method
- Billing cycle

---

## Security

### 1. Signature Verification

All webhooks and payments verify HMAC SHA256 signatures using the secret key.

```javascript
const signature = crypto
  .createHmac("sha256", RAZORPAY_SECRET_KEY)
  .update(data)
  .digest("hex");
```

### 2. Key Separation

- **Backend:** Has access to `RAZORPAY_SECRET_KEY` (never exposed)
- **Frontend:** Only has `RAZORPAY_KEY_ID` (public key for checkout)

### 3. Payment Verification

- Frontend payment responses always verified on backend
- Direct database updates only from webhook with signature verification
- No client-side trust for payment status

### 4. Audit Trail

All payment operations logged in:
- `PaymentLog` - Transaction details
- `SubscriptionLog` - Subscription events
- CloudWatch - Webhook events
- Raw payloads stored for debugging

### 5. Database Security

- Raw webhook payloads preserved for audit
- Status changes tracked with timestamps
- Previous plans deactivated on new subscription

---

## Supported Payment Methods

### Card Payments
- Visa
- Mastercard
- American Express
- RuPay
- Stored card details for recurring payments

### UPI
- All UPI providers
- QR code and VPA-based payments

### Net Banking
- All participating Indian banks

### Wallets
- Paytm
- PhonePe
- Amazon Pay
- Other supported digital wallets

---

## Current Plans Configuration

### Plan 1: Starter Plan
- **Price:** ₹0 (Free)
- **Duration:** 3 months (post-launch)
- **Features:**
  - File uploads: 5
  - File pages: 100
  - File size: 100MB
  - Images: 200
  - No private content
  - No community access

### Plan 2: Supporter Plan
- **Price:** ₹999/year
- **Duration:** 12 months
- **Features:**
  - All Starter features
  - Private content toggle
  - Community access
  - Enhanced limits

---

## File Structure Reference

### Backend Files
```
node-archinza-beta/node-archinza-beta/
├── config/
│   └── config.js                           # Razorpay configuration
├── index.js                                # Webhook middleware setup
├── routes/
│   ├── businessSubscription.js             # Main subscription API
│   └── razorpay/
│       ├── webhook.js                      # Webhook handler
│       └── businessSubscriptions.js        # Alternative subscription route
├── models/
│   ├── businessPlan.js                     # Plan model
│   ├── businessUserPlan.js                 # User subscription model
│   ├── paymentLogs.js                      # Payment logging model
│   ├── subscriptionLogs.js                 # Subscription logging model
│   └── businessInvoice.js                  # Invoice model
├── logger/
│   └── razorpay_logger.js                  # CloudWatch logger
└── middlewares/
    └── razorpayLogger.js                   # Webhook logger middleware
```

### Frontend Files
```
archinza-front-beta/archinza-front-beta/src/
├── config/
│   └── config.js                           # Frontend configuration
└── pages/
    ├── Checkout/
    │   └── Checkout.jsx                    # Checkout component
    ├── PaymentSuccessfull/
    │   └── PaymentSuccessfull.jsx          # Success page
    └── BusinessProfile/BusinessProfileComponents/Plan/
        ├── SubscriptionPlans.jsx           # Plans selection
        ├── Invoice.jsx                     # User invoice view
        └── InvoicePrint.jsx                # Invoice print view
```

### Admin Panel Files
```
admin-archinza-beta/admin-archinza-beta/src/pages/
└── BusinessAccountUsers/
    ├── PaymentHistory.jsx                  # Payment history table
    ├── SubscriptionLogs.jsx                # Subscription logs
    └── BusinessInvoice/
        └── Invoice.jsx                     # Admin invoice view
```

---

## Troubleshooting

### Common Issues

#### 1. Signature Verification Failed
- Verify `RAZORPAY_SECRET_KEY` is correct in environment
- Check webhook payload is not modified
- Ensure raw body parsing is enabled for webhook endpoint

#### 2. Payment Not Reflecting
- Check CloudWatch logs for webhook delivery
- Verify webhook URL is configured in Razorpay dashboard
- Check SubscriptionLog and PaymentLog for entries

#### 3. Subscription Not Activating
- Verify `subscription.activated` webhook is received
- Check BusinessUserPlan status in database
- Review Razorpay dashboard for subscription status

#### 4. Invoice Not Generated
- Verify `payment.captured` webhook is received
- Check BusinessInvoice collection for entry
- Review payment method extraction logic

---

## Testing

### Test Mode

Use Razorpay test credentials for development:
- Test Key ID: `rzp_test_...`
- Test Secret Key: `...`

### Test Cards

**Success:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: 4111 1111 1111 1112
- Triggers payment failure scenario

### Webhook Testing

Use Razorpay dashboard to:
1. Send test webhooks
2. Verify signature verification
3. Check database updates
4. Review CloudWatch logs

---

## Future Enhancements

Potential improvements:
1. Proration support for plan upgrades/downgrades
2. Coupon/discount code integration
3. Multi-currency support
4. Payment retry logic for failed payments
5. Automated dunning management
6. Usage-based billing
7. Trial period support

---

## Support & Resources

- **Razorpay Documentation:** https://razorpay.com/docs/
- **Razorpay API Reference:** https://razorpay.com/docs/api/
- **Webhook Documentation:** https://razorpay.com/docs/webhooks/
- **CloudWatch Logs:** Check "razorpay-api" stream for webhook events

---

**Last Updated:** 2025-11-15
**Version:** 1.0
