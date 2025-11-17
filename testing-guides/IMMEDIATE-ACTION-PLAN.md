# IMMEDIATE ACTION PLAN - Security & Functional Testing Audit
## Archinza 2.0 - CRITICAL SECURITY ISSUES

**Date:** 2025-11-17
**Status:** 🔴 CRITICAL - IMMEDIATE ACTION REQUIRED

---

## 🚨 CRITICAL VULNERABILITIES (Fix This Week)

### 1. PLAINTEXT PASSWORDS - P0 CRITICAL ⚠️

**Impact:** Complete compromise of all user accounts if database is breached

**Files to Fix:**
- `/node-archinza-beta/node-archinza-beta/routes/auth.js` (Lines 22-25)
- `/node-archinza-beta/node-archinza-beta/routes/personal.js` (Lines 319, 638, 648)
- `/node-archinza-beta/node-archinza-beta/routes/admin/auth.js` (Lines 17-19)
- `/node-archinza-beta/node-archinza-beta/routes/business.js` (Password handling)

**Action Steps:**
```bash
# 1. Install bcrypt
npm install bcrypt

# 2. Create password migration script
cat > scripts/migrate-passwords.js << 'EOF'
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/personalAccount');
const BusinessAccount = require('./models/businessAccount');
const Admin = require('./models/admin');

async function hashExistingPasswords() {
  // Hash all user passwords
  const users = await User.find();
  for (const user of users) {
    if (user.password && !user.password.startsWith('$2')) {
      const hashed = await bcrypt.hash(user.password, 12);
      await User.updateOne({ _id: user._id }, { password: hashed });
      console.log(`Updated user: ${user.email}`);
    }
  }

  // Repeat for BusinessAccount and Admin
  console.log('Password migration complete');
}

hashExistingPasswords();
EOF

# 3. Update authentication routes
# - Replace plaintext comparison with bcrypt.compare()
# - Hash passwords before saving
```

**Implementation Example:**
```javascript
// Login route - BEFORE (INSECURE)
const data = await User.findOne({
  email: req.body.email,
  password: req.body.password,  // ❌ Plaintext comparison
});

// Login route - AFTER (SECURE)
const user = await User.findOne({ email: req.body.email });
if (!user) {
  return res.send(sendError("Invalid email/password", 400));
}

const isValidPassword = await bcrypt.compare(req.body.password, user.password);
if (!isValidPassword) {
  return res.send(sendError("Invalid email/password", 400));
}
```

---

### 2. RAZORPAY SIGNATURE DISABLED - P0 CRITICAL 💰

**Impact:** Anyone can forge payment webhooks, activate free subscriptions

**File:** `/node-archinza-beta/node-archinza-beta/routes/razorpay/webhook.js`

**Action Steps:**
```javascript
// Line 26-29: UNCOMMENT THIS CODE IMMEDIATELY
if (signature !== expectedSignature) {
  console.error("Invalid Razorpay signature");
  return res.status(200).json({ error: "Invalid signature" });
}

// Add logging
const logger = require('../logger');
logger.error('Razorpay webhook signature verification failed', {
  signature,
  expectedSignature,
  ip: req.ip,
  timestamp: new Date()
});
```

**Testing:**
```bash
# Test with invalid signature
curl -X POST http://localhost:3020/razorpay/webhook \
  -H "x-razorpay-signature: invalid_signature" \
  -H "Content-Type: application/json" \
  -d '{"event":"subscription.activated"}'

# Should return 400 error
```

---

### 3. BUSINESS OTP BYPASS - P0 CRITICAL 🔐

**Impact:** Anyone can create business accounts without OTP verification

**File:** `/node-archinza-beta/node-archinza-beta/routes/business.js`
**Lines:** 148-178

**Action Steps:**
```javascript
// BEFORE (BROKEN) - Lines 148-178
router.post("/signup/otp-verify", asyncHandler(async (req, res) => {
  session = req.session;
  console.log(session.otp);
  const defaultPlan = await BusinessPlan.findOne({ isDefault: true });
  req.session.destroy();
  req.body["onboarding_source"] = "web";
  const data = await BusinessAccount.create(_.omit(req.body, ["otp"]));
  const user = await BusinessAccount.findById(data._id).select("-password").lean();
  // ... more code ...
  const token = generateToken(user, "business");
  return res.send(sendResponse({ token }, "Register Successfull")); // ← RETURNS HERE!
  if (session.otp == req.body.otp) {  // ← NEVER EXECUTED!
  } else {
    return res.send(sendError("Invalid OTP", 400));
  }
}));

// AFTER (FIXED)
router.post("/signup/otp-verify", asyncHandler(async (req, res) => {
  session = req.session;

  // VERIFY OTP FIRST
  if (!session.otp || session.otp != req.body.otp) {
    return res.send(sendError("Invalid OTP", 400));
  }

  // THEN create user
  req.session.destroy();
  req.body["onboarding_source"] = "web";
  const data = await BusinessAccount.create(_.omit(req.body, ["otp"]));
  const user = await BusinessAccount.findById(data._id).select("-password").lean();

  const defaultPlan = await BusinessPlan.findOne({ isDefault: true });
  if (defaultPlan) {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + Number(defaultPlan.durationInMonths));
    await BusinessUserPlan.create({
      businessAccount: user._id,
      plan: defaultPlan._id,
      startDate: new Date(),
      endDate,
    });
  }

  const token = generateToken(user, "business");
  return res.send(sendResponse({ token }, "Register Successfull"));
}));
```

---

### 4. NO JWT EXPIRATION - P0 CRITICAL ⏰

**Impact:** Stolen tokens remain valid forever

**File:** `/node-archinza-beta/node-archinza-beta/helpers/api.js`
**Lines:** 37-43

**Action Steps:**
```javascript
// BEFORE (INSECURE)
function generateToken(payload, auth_type = "personal", remember_me = false) {
  if (remember_me) {
    return jwt.sign({ ...payload, auth_type }, config.secretkey);
  } else {
    return jwt.sign({ ...payload, auth_type }, config.secretkey);
  }
}

// AFTER (SECURE)
function generateToken(payload, auth_type = "personal", remember_me = false) {
  const expiresIn = remember_me ? '30d' : '1h';
  return jwt.sign(
    { ...payload, auth_type },
    config.secretkey,
    { expiresIn }
  );
}

// Update JWT verification middleware
// File: middlewares/auth.js
module.exports = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    return res.send(sendError("Unauthorized", 401));
  }
  token = token.split(" ");

  try {
    const decoded = jwt.verify(token[1], config.secretkey);
    req.auth = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.send(sendError("Token expired, please login again", 401));
    }
    res.send(sendError("Invalid Token", 400));
  }
};
```

---

### 5. NO SECURITY HEADERS - P0 CRITICAL 🛡️

**Impact:** Vulnerable to clickjacking, XSS, MIME sniffing

**File:** `/node-archinza-beta/node-archinza-beta/index.js`

**Action Steps:**
```bash
# Install helmet
npm install helmet
```

```javascript
// Add to index.js after line 36
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.razorpay.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
}));
```

---

### 6. NO INPUT VALIDATION - P0 HIGH 🧹

**Impact:** XSS attacks, injection vulnerabilities

**Action Steps:**
```bash
# Install validation libraries
npm install express-validator
npm install xss
```

```javascript
// Add validation middleware
const { body, validationResult } = require('express-validator');
const xss = require('xss');

// Example: User registration
router.post('/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/),
    body('name').trim().escape().customSanitizer(xss),
    body('phone').isMobilePhone(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... rest of logic
  })
);
```

---

## 📋 DEPLOYMENT CHECKLIST

Before deploying fixes to production:

### Pre-Deployment
- [ ] Create database backup
- [ ] Test password migration script on staging
- [ ] Test all authentication flows with new bcrypt implementation
- [ ] Verify Razorpay webhook signature verification works
- [ ] Test business signup OTP flow
- [ ] Verify JWT tokens expire correctly
- [ ] Test security headers with online tools

### Deployment
- [ ] Deploy to staging environment
- [ ] Run full test suite
- [ ] Test payment flow end-to-end
- [ ] Monitor error logs for 24 hours
- [ ] If successful, deploy to production
- [ ] Force password reset for all existing users
- [ ] Send security notification email to all users

### Post-Deployment
- [ ] Monitor authentication success/failure rates
- [ ] Monitor payment webhook processing
- [ ] Check error logs for new issues
- [ ] Run security scan (npm audit, OWASP ZAP)
- [ ] Update security documentation

---

## 🧪 TESTING COMMANDS

```bash
# 1. Run npm audit
cd node-archinza-beta/node-archinza-beta
npm audit

# 2. Test authentication endpoints
npm test -- --grep "authentication"

# 3. Test payment webhooks
npm test -- --grep "razorpay"

# 4. Check security headers
curl -I https://your-domain.com | grep -E "X-|Strict|Content-Security"

# 5. Run integration tests
npm run test:integration
```

---

## 📊 SUCCESS METRICS

After implementing fixes, verify:

- [ ] OWASP compliance score > 80%
- [ ] All passwords stored with bcrypt (no plaintext)
- [ ] JWT tokens expire after 1 hour
- [ ] Razorpay signature verification enabled and working
- [ ] Business OTP verification working correctly
- [ ] Security headers present on all responses
- [ ] Input validation on all user inputs
- [ ] Failed login attempts logged
- [ ] No critical npm audit vulnerabilities

---

## 📞 SUPPORT

If you encounter issues during implementation:

1. Review full audit report: `SECURITY-FUNCTIONAL-TESTING-AUDIT-REPORT.md`
2. Check testing guides: `testing-guides/12-SECURITY-TESTING-GUIDE.md`
3. Run tests: `npm test`

---

## ⚡ TIMELINE

**Day 1 (Today):**
- Fix Razorpay signature verification
- Fix hardcoded OTP
- Install helmet for security headers

**Day 2:**
- Implement bcrypt password hashing
- Create password migration script
- Test on staging

**Day 3:**
- Fix business OTP bypass
- Add JWT expiration
- Add input validation

**Day 4:**
- Test all fixes on staging
- Run security scans
- Prepare deployment

**Day 5:**
- Deploy to production
- Monitor for 24 hours
- Send user notifications

---

**Remember:** These are CRITICAL security vulnerabilities. Prioritize fixes immediately.

**Status:** 🔴 CRITICAL - DO NOT DELAY
