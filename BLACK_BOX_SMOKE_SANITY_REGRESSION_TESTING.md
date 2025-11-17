# COMPREHENSIVE BLACK BOX, SMOKE, SANITY & REGRESSION TESTING ANALYSIS
## Archinza 2.0 Project

**Analysis Date:** November 17, 2025
**Analyzed By:** Claude Code Testing Audit
**Project Type:** SaaS Platform - Business & Personal Account Management
**Technology Stack:** Node.js + Express + MongoDB + React + Razorpay

---

## EXECUTIVE SUMMARY

### Test Environment Overview
- **Total API Endpoints:** 80+ endpoints across 14 route files
- **Database Models:** 51 MongoDB collections
- **External Integrations:** Razorpay, AWS S3, Email/SMS services, Google APIs
- **User Roles:** Personal Users, Business Users, Admin Users

### Testing Status
| Test Type | Coverage | Status | Priority |
|-----------|----------|--------|----------|
| **Black Box Testing** | 0% | ❌ Not Implemented | 🔴 CRITICAL |
| **Smoke Testing** | 0% | ❌ Not Implemented | 🔴 CRITICAL |
| **Sanity Testing** | 0% | ❌ Not Implemented | 🟡 HIGH |
| **Regression Testing** | 0% | ❌ Not Implemented | 🔴 CRITICAL |
| **Test Automation** | 0% | ❌ Not Available | 🟡 HIGH |

---

## 1. BLACK BOX TESTING

Testing the application from an external user's perspective without knowledge of internal implementation.

### 1.1 INPUT DOMAIN TESTING

#### TC-BB-INPUT-001: Valid Input Acceptance

| Test ID | Feature | Input Type | Valid Test Data | Expected Result | Test Priority |
|---------|---------|------------|-----------------|-----------------|---------------|
| BB-IN-001 | Personal Signup | Email | test@example.com | OTP sent, account pending | P0 |
| BB-IN-002 | Personal Signup | Phone | +91-9876543210 | OTP sent to phone | P0 |
| BB-IN-003 | Business Signup | Business Name | "ABC Architects Ltd." | Account creation initiated | P0 |
| BB-IN-004 | Business Username | Username | "abc_architects_2024" | Username available | P0 |
| BB-IN-005 | Profile Update | Bio | "Award-winning design firm..." | Bio updated successfully | P1 |
| BB-IN-006 | Media Upload | Image File | JPEG, PNG, WEBP (5MB) | File uploaded to gallery | P0 |
| BB-IN-007 | Payment | Amount | ₹999, ₹1999, ₹4999 | Payment processed | P0 |
| BB-IN-008 | Location | Pincode | 110001, 400001, 560001 | Location validated | P1 |
| BB-IN-009 | OTP Verification | 6-digit OTP | 123456 | OTP verified, session created | P0 |
| BB-IN-010 | Password | Strong Password | MyP@ssw0rd!2024 | Password accepted | P0 |

**Test Execution:**
```bash
# Test valid email format
curl -X POST http://localhost:3000/personal/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phone":"9876543210","country_code":"91","name":"Test User"}'

# Expected: {"status":200,"message":"Sign up OTP sent successfully","data":[]}
```

---

#### TC-BB-INPUT-002: Invalid Input Rejection

| Test ID | Input Type | Invalid Test Data | Expected Rejection | Actual Behavior | Gap |
|---------|------------|-------------------|-------------------|-----------------|-----|
| BB-IN-101 | Email | "notanemail" | Error: Invalid email format | ⚠️ May accept | ❌ No validation |
| BB-IN-102 | Email | "test@" | Error: Invalid email | ⚠️ May accept | ❌ No validation |
| BB-IN-103 | Email | "" (empty) | Error: Email required | ⚠️ May accept | ❌ No validation |
| BB-IN-104 | Phone | "abc123xyz" | Error: Invalid phone | ⚠️ May accept | ❌ No validation |
| BB-IN-105 | Phone | "99999" (too short) | Error: Invalid phone length | ⚠️ May accept | ❌ No validation |
| BB-IN-106 | Username | "abc" (too short) | Error: Min 5 characters | ⚠️ May accept | ❌ No validation |
| BB-IN-107 | Username | "user name" (space) | Error: No spaces allowed | ⚠️ May accept | ❌ No validation |
| BB-IN-108 | Username | "user@admin" (special chars) | Error: Alphanumeric only | ⚠️ May accept | ❌ No validation |
| BB-IN-109 | File Upload | executable.exe | Error: File type not allowed | ✅ Likely rejected | ✅ Extension check exists |
| BB-IN-110 | File Upload | 50MB image | Error: File too large | ⚠️ Unknown | ❓ Need to verify |
| BB-IN-111 | OTP | "abcdef" (letters) | Error: Numeric only | ⚠️ May accept | ❌ No validation |
| BB-IN-112 | Amount | -500 (negative) | Error: Invalid amount | ⚠️ Unknown | ❓ Need to verify |

**Test Execution:**
```bash
# Test invalid email
curl -X POST http://localhost:3000/personal/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"notanemail","phone":"9876543210","country_code":"91"}'

# Expected: Error response, but implementation may not validate
```

**CRITICAL FINDING:** Input validation appears to be missing for most fields. The application relies on client-side validation which can be bypassed.

---

#### TC-BB-INPUT-003: Boundary Value Analysis

| Test ID | Field | Minimum | Maximum | Below Min | Above Max | At Boundary |
|---------|-------|---------|---------|-----------|-----------|-------------|
| BB-BV-001 | Username | 5 chars | 30 chars | "abc" → ❌ | 31 chars → ❌ | "abcde" → ✅ |
| BB-BV-002 | Phone | 10 digits | 15 digits | "999999999" → ❌ | 16 digits → ❌ | "9999999999" → ✅ |
| BB-BV-003 | Password | 8 chars | 128 chars | "Pass123" → ❌ | 129 chars → ❌ | "Pass1234" → ✅ |
| BB-BV-004 | Bio | 0 chars | 500 chars | Empty → ✅ | 501 chars → ❌ | 500 chars → ✅ |
| BB-BV-005 | OTP | 6 digits | 6 digits | "12345" → ❌ | "1234567" → ❌ | "123456" → ✅ |
| BB-BV-006 | File Size | 0 KB | 10 MB | 0 KB → ❌ | 11 MB → ❌ | 10 MB → ✅ |
| BB-BV-007 | Pincode | 6 digits | 6 digits | "11000" → ❌ | "1100011" → ❌ | "110001" → ✅ |
| BB-BV-008 | Amount | ₹1 | ₹999,999 | ₹0 → ❌ | ₹1,000,000 → ❌ | ₹999,999 → ✅ |
| BB-BV-009 | Business Name | 2 chars | 100 chars | "A" → ❌ | 101 chars → ❌ | 100 chars → ✅ |
| BB-BV-010 | Gallery Images | 0 images | 50 images | -1 → ❌ | 51 images → ❌ | 50 images → ✅ |

**Test Execution:**
```bash
# Test username boundary (minimum)
curl -X POST http://localhost:3000/business/check-username \
  -H "Content-Type: application/json" \
  -d '{"username":"abc"}'

# Test username boundary (maximum)
curl -X POST http://localhost:3000/business/check-username \
  -H "Content-Type: application/json" \
  -d '{"username":"'$(printf 'a%.0s' {1..31})'"}'

# Expected: Appropriate validation errors
```

---

#### TC-BB-INPUT-004: Equivalence Partitioning

##### Email Format Testing
| Partition | Valid Class | Test Values | Expected Result |
|-----------|-------------|-------------|-----------------|
| **Valid Emails** | Standard format | user@example.com | ✅ Accepted |
| | With dots | first.last@example.com | ✅ Accepted |
| | With plus | user+tag@example.com | ✅ Accepted |
| | Subdomain | user@mail.example.com | ✅ Accepted |
| **Invalid Emails** | Missing @ | userexample.com | ❌ Rejected |
| | Missing domain | user@ | ❌ Rejected |
| | Multiple @ | user@@example.com | ❌ Rejected |
| | Special chars | user#$@example.com | ❌ Rejected |
| | Spaces | "user name"@example.com | ❌ Rejected |

##### Phone Number Testing
| Partition | Valid Class | Test Values | Expected Result |
|-----------|-------------|-------------|-----------------|
| **Valid Phone** | 10 digits (India) | 9876543210 | ✅ Accepted |
| | With country code | +919876543210 | ✅ Accepted |
| | Different lengths | 1234567890123 (international) | ✅ Accepted |
| **Invalid Phone** | Letters | 98765ABC10 | ❌ Rejected |
| | Special chars | 9876-543-210 | ❌ Rejected |
| | Too short | 98765 | ❌ Rejected |

##### Password Strength Testing
| Partition | Valid Class | Test Values | Expected Result |
|-----------|-------------|-------------|-----------------|
| **Strong** | All criteria | MyP@ssw0rd!2024 | ✅ Accepted |
| | Long password | ThisIsAVeryLongPasswordWith1Number! | ✅ Accepted |
| **Weak** | Only lowercase | password | ❌ Rejected |
| | Only numbers | 12345678 | ❌ Rejected |
| | No special char | Password123 | ⚠️ May accept |
| | Too short | Pass1! | ❌ Rejected |
| | Common password | Password123! | ⚠️ May accept |

**CRITICAL FINDING:** Based on code analysis, password validation appears minimal. Plaintext storage is a critical security issue.

---

### 1.2 SQL INJECTION & XSS TESTING

#### TC-BB-SEC-001: SQL Injection Attempts

| Test ID | Injection Point | Payload | Expected Result | Risk Level |
|---------|----------------|---------|-----------------|------------|
| BB-SQL-001 | Login Email | admin'-- | Login rejected | ✅ SAFE (NoSQL) |
| BB-SQL-002 | Login Email | ' OR '1'='1 | Login rejected | ✅ SAFE (NoSQL) |
| BB-SQL-003 | Search Query | '; DROP TABLE users;-- | Query rejected | ✅ SAFE (NoSQL) |
| BB-SQL-004 | Username | admin'; DELETE FROM users-- | Rejected | ✅ SAFE (NoSQL) |

**Note:** Application uses MongoDB (NoSQL), so traditional SQL injection is not applicable. However, **NoSQL injection** testing is required.

#### TC-BB-SEC-002: NoSQL Injection Testing

| Test ID | Injection Point | Payload | Expected Result | Actual Behavior | Gap |
|---------|----------------|---------|-----------------|-----------------|-----|
| BB-NOSQL-001 | Login | {"email":{"$ne":null},"password":{"$ne":null}} | Login rejected | ⚠️ May bypass | ❌ Need sanitization |
| BB-NOSQL-002 | Username Check | {"username":{"$regex":".*"}} | All usernames revealed | ⚠️ Possible | ❌ No sanitization |
| BB-NOSQL-003 | Search | {"$where":"this.email.length > 0"} | Arbitrary query execution | ⚠️ Possible | 🔴 CRITICAL |
| BB-NOSQL-004 | ID Parameter | {"$gt":""} | Access all records | ⚠️ Possible | ❌ No validation |

**Test Execution:**
```bash
# Test NoSQL injection in login
curl -X POST http://localhost:3000/personal/login \
  -H "Content-Type: application/json" \
  -d '{"phone":{"$ne":null},"country_code":"91"}'

# Expected: Rejected or sanitized
```

**CRITICAL FINDING:** No evidence of NoSQL injection protection found in the codebase. This is a **high-risk vulnerability**.

---

#### TC-BB-SEC-003: XSS Payload Testing

| Test ID | Injection Point | Payload | Expected Result | Test Priority |
|---------|----------------|---------|-----------------|---------------|
| BB-XSS-001 | Business Name | `<script>alert('XSS')</script>` | HTML escaped | P0 |
| BB-XSS-002 | Bio Field | `<img src=x onerror=alert('XSS')>` | HTML escaped | P0 |
| BB-XSS-003 | Username | `<svg/onload=alert('XSS')>` | Rejected/escaped | P0 |
| BB-XSS-004 | Address | `"><script>alert(document.cookie)</script>` | HTML escaped | P1 |
| BB-XSS-005 | Review Comment | `javascript:alert('XSS')` | Sanitized | P1 |
| BB-XSS-006 | File Name | `malicious<script>.jpg` | Sanitized | P1 |
| BB-XSS-007 | URL Fields | `javascript:void(0)` | Rejected | P1 |
| BB-XSS-008 | Email | `test@example.com<script>alert(1)</script>` | Rejected | P1 |

**Test Execution:**
```bash
# Test XSS in business name
curl -X POST http://localhost:3000/business/business-details/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"business_name":"<script>alert(\"XSS\")</script>"}'

# Expected: Input sanitized or escaped before storage
```

**FINDING:** XSS protection needs to be verified. No explicit sanitization found in backend code. React's default escaping provides some protection, but server-side validation is recommended.

---

### 1.3 FUNCTIONAL REQUIREMENTS TESTING

#### TC-BB-FUNC-001: User Registration Flow

| Test ID | User Story | Test Steps | Expected Result | Acceptance Criteria |
|---------|-----------|------------|-----------------|---------------------|
| BB-FUNC-001 | Personal User Signup | 1. Enter email/phone<br>2. Submit signup<br>3. Receive OTP<br>4. Enter OTP<br>5. Complete registration | User account created, logged in with JWT | - OTP sent to email & SMS<br>- OTP expires in 60 min<br>- Account created only after OTP verification |
| BB-FUNC-002 | Business User Signup | 1. Enter business details<br>2. Choose username<br>3. Receive OTP<br>4. Verify OTP<br>5. Account created | Business account with default plan | - Username uniqueness checked<br>- Default plan assigned<br>- Profile 10% complete |
| BB-FUNC-003 | Duplicate Email | 1. Register with existing email | Error: "User already exist" | - Duplicate detection works<br>- Clear error message |
| BB-FUNC-004 | Invalid OTP | 1. Complete signup<br>2. Enter wrong OTP | Error: "Invalid OTP" | - OTP verification fails<br>- User cannot login |
| BB-FUNC-005 | OTP Resend | 1. Request OTP<br>2. Wait 30 seconds<br>3. Resend OTP | New OTP sent, old OTP invalidated | - Resend button available<br>- Previous OTP no longer valid |

**CRITICAL BUG IDENTIFIED:**
```javascript
// /routes/business.js:174-177
// Business signup accepts ANY OTP because validation is unreachable!
return res.send(sendResponse({ token }, "Register Successfull")); // Line 173
if (session.otp == req.body.otp) {  // UNREACHABLE! Line 174
```
**Impact:** Business users can signup without OTP verification.

---

#### TC-BB-FUNC-002: Login Flow Testing

| Test ID | Scenario | Precondition | Test Steps | Expected Result | Status |
|---------|----------|--------------|------------|-----------------|--------|
| BB-FUNC-010 | Personal Login | User registered | 1. Enter phone<br>2. Receive OTP<br>3. Enter OTP<br>4. Login | JWT token received, user logged in | ✅ To Test |
| BB-FUNC-011 | Business Login | Business account exists | 1. Enter username<br>2. Enter password<br>3. Login | JWT token received | ⚠️ **Plaintext password!** |
| BB-FUNC-012 | Invalid Credentials | User exists | 1. Enter wrong phone/password | Error: "Invalid credentials" | ✅ To Test |
| BB-FUNC-013 | Deleted Account | Account soft-deleted | 1. Attempt login | Error: "Account no longer active" | ✅ To Test |
| BB-FUNC-014 | New Device Detection | Login from new device | 1. Login from new browser/IP | Email sent: "New device login" | ✅ To Test |
| BB-FUNC-015 | Account Lockout | 5 failed attempts | 1. Try 5 wrong OTPs | Account locked for 15 minutes | ❌ **NOT Implemented** |

**SECURITY ISSUE:** Business login uses plaintext password comparison:
```javascript
// /routes/business.js:500
if (data.password !== req.body.password) {
  return res.send(sendError("Invalid Credentials", 400));
}
```

---

#### TC-BB-FUNC-003: Profile Management

| Test ID | Feature | User Action | Expected Result | Database Change | UI Update |
|---------|---------|-------------|-----------------|-----------------|-----------|
| BB-FUNC-020 | View Profile | Navigate to /profile | Profile data displayed | None | Profile rendered |
| BB-FUNC-021 | Edit Bio | Update bio field | Bio saved | BusinessAccount.bio updated | New bio shown |
| BB-FUNC-022 | Upload Logo | Upload image file | Logo uploaded, displayed | brand_logo field updated | Logo visible |
| BB-FUNC-023 | Change Email | Request email change, verify OTP | Email updated | PersonalAccount.email updated | New email shown |
| BB-FUNC-024 | Change Phone | Request phone change, verify OTP | Phone updated | phone + country_code updated | New phone shown |
| BB-FUNC-025 | Change Password | Enter current + new password | Password changed | password field updated | Success message |
| BB-FUNC-026 | Update Business Hours | Set opening hours | Hours saved | business_hours array updated | Hours displayed |
| BB-FUNC-027 | Set Privacy | Toggle field visibility | Privacy updated | isPrivate flags updated | Fields hidden |

**Authorization Gap:** No verification that req.params.id matches authenticated user ID!
```javascript
// /routes/personal.js:417-428
router.put("/edit-profile/:id", asyncHandler(async (req, res) => {
  // MISSING: Check if req.auth._id === req.params.id
  await data.updateOne(req.body);
}));
```
**Impact:** Any authenticated user can edit any other user's profile by changing the :id parameter.

---

#### TC-BB-FUNC-004: Media Gallery Management

| Test ID | Feature | Test Steps | Expected Result | Edge Cases |
|---------|---------|------------|-----------------|------------|
| BB-FUNC-030 | Upload Images | Select 5 JPEG files → Upload | All 5 uploaded to S3, records created | Max file size, duplicate detection |
| BB-FUNC-031 | Upload Documents | Select PDF file → Upload | PDF uploaded, thumbnail generated | Page limit enforcement |
| BB-FUNC-032 | Soft Delete | Select images → Delete | Images moved to "Recently Deleted" | softDelete=true, deletedAt set |
| BB-FUNC-033 | Restore Images | From Recently Deleted → Restore | Images restored to gallery | softDelete=false, AWS restore |
| BB-FUNC-034 | Permanent Delete | From Recently Deleted → Delete Forever | Images deleted from DB & S3 | Cannot be recovered |
| BB-FUNC-035 | Pin Images | Select image → Pin | Image appears first in gallery | pinned flag updated |
| BB-FUNC-036 | Hide Images | Select image → Hide | Image not visible publicly | visibility=false |
| BB-FUNC-037 | Move Images | Select images → Move to different section | Images moved | category updated |
| BB-FUNC-038 | Reorder Images | Drag & drop to reorder | Order saved | masonryPosition updated |
| BB-FUNC-039 | File Type Validation | Upload .exe file | Error: File type not allowed | Extension whitelist enforced |
| BB-FUNC-040 | Duplicate Detection | Upload same file twice | Warning: Duplicate detected | File hash comparison |

**Test Execution:**
```bash
# Test image upload
curl -X POST http://localhost:3000/business/business-details/USER_ID/upload/project_renders_media \
  -H "Authorization: Bearer TOKEN" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"

# Expected: Files uploaded, media records returned
```

---

#### TC-BB-FUNC-005: Subscription & Payment Flow

| Test ID | Scenario | Test Steps | Expected Result | Razorpay Integration | Status |
|---------|----------|------------|-----------------|---------------------|--------|
| BB-FUNC-050 | View Plans | Navigate to /pricing | All subscription plans displayed | GET /business-plans/ | ✅ To Test |
| BB-FUNC-051 | Subscribe to Plan | Select plan → Initiate payment | Razorpay checkout opened | POST /business-plans/subscribe | ✅ To Test |
| BB-FUNC-052 | Successful Payment | Complete payment on Razorpay | Subscription activated | Webhook: subscription.charged | ✅ To Test |
| BB-FUNC-053 | Failed Payment | Payment fails on Razorpay | Error message, subscription not active | Webhook: payment.failed | ✅ To Test |
| BB-FUNC-054 | View Payment History | Navigate to /payments | All past payments listed | GET /business-plans/:id/payments | ✅ To Test |
| BB-FUNC-055 | Download Invoice | Click invoice for payment | PDF invoice downloaded | GET /business-plans/invoice/:paymentId | ✅ To Test |
| BB-FUNC-056 | Change Payment Method | Update card/UPI | New method saved | POST /business-plans/verify-update-method | ✅ To Test |
| BB-FUNC-057 | Cancel Subscription | Cancel active subscription | Subscription cancelled at period end | Webhook: subscription.cancelled | ✅ To Test |
| BB-FUNC-058 | Renew Subscription | Automatic renewal | Subscription renewed, payment charged | Webhook: subscription.charged | ✅ To Test |

**CRITICAL SECURITY ISSUE:** Webhook signature verification is commented out!
```javascript
// /routes/razorpay/webhook.js:26-29
// if (signature !== expectedSignature) {
//   console.error("Invalid Razorpay signature");
//   return res.status(200).json({ error: "Invalid signature" });
// }
```
**Impact:** Anyone can forge webhook requests to activate/cancel subscriptions or create fake payment records.

---

### 1.4 STATE TRANSITION TESTING

#### TC-BB-STATE-001: Subscription State Machine

```mermaid
graph LR
    A[Not Subscribed] --> B[Created]
    B --> C[Active]
    B --> D[Failed]
    C --> E[Charged]
    C --> F[Cancelled]
    C --> G[Expired]
    E --> C
    F --> A
    G --> A
```

| Test ID | Initial State | Action | Expected Next State | Verification |
|---------|--------------|--------|---------------------|--------------|
| BB-STATE-001 | Not Subscribed | Click "Subscribe" | Created | razorpaySubscriptionId generated |
| BB-STATE-002 | Created | Complete payment | Active | isActive=true, startDate set |
| BB-STATE-003 | Created | Payment fails | Failed | isActive=false, error logged |
| BB-STATE-004 | Active | Monthly charge | Charged, then Active | PaymentLog created, endDate extended |
| BB-STATE-005 | Active | User cancels | Cancelled | isActive stays true until endDate |
| BB-STATE-006 | Active | Subscription expires | Expired | isActive=false |
| BB-STATE-007 | Cancelled | Renew before expiry | Active | New subscription created |

**Test Execution:**
```bash
# Test state transition: Not Subscribed → Created
curl -X POST http://localhost:3000/business-plans/subscribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"data":{"id":"USER_ID","business_name":"Test","email":"test@example.com","phone":"9876543210"},"plan":{"_id":"PLAN_ID","razorpayPlanId":"plan_xxx","durationInMonths":12}}'

# Expected: Subscription created with status="created"
```

---

#### TC-BB-STATE-002: Business Verification State Machine

```mermaid
graph LR
    A[Unverified] --> B[Verification Requested]
    B --> C[Under Review]
    C --> D[Verified]
    C --> E[Rejected]
    E --> B
```

| Test ID | Initial State | Action | Expected Next State | Database Update |
|---------|--------------|--------|---------------------|-----------------|
| BB-STATE-010 | Unverified | Submit verification request | Verification Requested | BusinessVerifications created |
| BB-STATE-011 | Verification Requested | Admin reviews | Under Review | status updated |
| BB-STATE-012 | Under Review | Approved | Verified | isVerified=true, badge shown |
| BB-STATE-013 | Under Review | Rejected | Rejected | Rejection reason provided |
| BB-STATE-014 | Rejected | Resubmit with corrections | Verification Requested | New request created |

---

#### TC-BB-STATE-003: User Account States

| Test ID | State | Allowed Actions | Restricted Actions |
|---------|-------|-----------------|-------------------|
| BB-STATE-020 | Active | Login, Edit Profile, Upload Media | None |
| BB-STATE-021 | Suspended | View Profile (read-only) | Login, Edit, Upload |
| BB-STATE-022 | Deleted (Soft) | None | All actions (returns "Account no longer active") |
| BB-STATE-023 | Deleted (Hard) | None | All actions (returns "User not found") |

---

### 1.5 DECISION TABLE TESTING

#### TC-BB-DT-001: Login Decision Table

| Test ID | Valid Username/Email? | Valid Password/OTP? | Account Active? | Expected Result |
|---------|----------------------|---------------------|-----------------|-----------------|
| BB-DT-001 | ✅ Yes | ✅ Yes | ✅ Yes | Login Success → JWT Token |
| BB-DT-002 | ✅ Yes | ❌ No | ✅ Yes | Error: "Invalid Credentials" |
| BB-DT-003 | ❌ No | - | - | Error: "Invalid Credentials" |
| BB-DT-004 | ✅ Yes | ✅ Yes | ❌ Deleted | Error: "Account no longer active" |
| BB-DT-005 | ✅ Yes | ⚠️ Expired OTP | ✅ Yes | Error: "OTP Expired" (NOT IMPLEMENTED) |

---

#### TC-BB-DT-002: Profile Visibility Decision Table

| Test ID | Field Private? | User Verified? | Viewer Type | Field Visible? |
|---------|---------------|----------------|-------------|----------------|
| BB-DT-010 | ❌ Public | - | Anyone | ✅ Yes |
| BB-DT-011 | ✅ Private | ✅ Verified | Anyone | ✅ Yes (Verified users show all) |
| BB-DT-012 | ✅ Private | ❌ Unverified | Public | ❌ No |
| BB-DT-013 | ✅ Private | ❌ Unverified | Self | ✅ Yes (Owner sees own data) |

---

#### TC-BB-DT-003: Feature Access Decision Table

| Test ID | User Type | Subscription Active? | Verified? | Feature | Access Granted? |
|---------|-----------|---------------------|-----------|---------|-----------------|
| BB-DT-020 | Personal | - | - | Basic Profile | ✅ Yes |
| BB-DT-021 | Personal | ✅ Pro | - | Advanced Search | ✅ Yes |
| BB-DT-022 | Personal | ❌ Free | - | Advanced Search | ❌ No |
| BB-DT-023 | Business | ✅ Paid | - | Upload Media | ✅ Yes |
| BB-DT-024 | Business | ❌ Free | - | Upload Media (limit) | ⚠️ Yes (limited to 10) |
| BB-DT-025 | Business | ✅ Paid | ✅ Verified | Verification Badge | ✅ Yes |
| BB-DT-026 | Business | ✅ Paid | ❌ Unverified | Verification Badge | ❌ No |

---

#### TC-BB-DT-004: File Upload Decision Table

| Test ID | File Type | File Size | User Quota | Expected Result |
|---------|-----------|-----------|------------|-----------------|
| BB-DT-030 | JPEG | 2 MB | 5/10 used | ✅ Upload Success |
| BB-DT-031 | PDF | 5 MB | 5/10 used | ✅ Upload Success (with thumbnail) |
| BB-DT-032 | EXE | 1 MB | 5/10 used | ❌ Error: File type not allowed |
| BB-DT-033 | JPEG | 15 MB | 5/10 used | ❌ Error: File too large |
| BB-DT-034 | JPEG | 2 MB | 10/10 used | ❌ Error: Quota exceeded |

---

## 2. SMOKE TESTING

Smoke testing verifies that the most critical functionality works before proceeding with deeper testing. These are the "build verification tests" (BVT).

### 2.1 CRITICAL PATH VERIFICATION

#### TC-SMOKE-001: Application Launch & Health Checks

| Test ID | Component | Check | Command | Expected Result | Priority |
|---------|-----------|-------|---------|-----------------|----------|
| SMOKE-001 | Backend Server | Server starts | `npm start` in /node-archinza-beta | Server running on port 3000 | P0 |
| SMOKE-002 | Database | MongoDB connection | Check logs for "Connected to MongoDB" | Connection successful | P0 |
| SMOKE-003 | Frontend | React app builds | `npm run build` in /archinza-front-beta | Build completes without errors | P0 |
| SMOKE-004 | Admin Panel | Admin app builds | `npm run build` in /admin-archinza-beta | Build completes without errors | P0 |
| SMOKE-005 | API Health | Health endpoint | `GET /health` or `GET /` | Returns 200 OK | P0 |
| SMOKE-006 | CORS | Cross-origin requests | Frontend → Backend API call | No CORS errors | P0 |

**Test Execution:**
```bash
# Smoke Test 1: Start backend
cd /node-archinza-beta/node-archinza-beta
npm start
# Expected: "Server listening on port 3000" or similar

# Smoke Test 2: Test API health
curl http://localhost:3000/
# Expected: 200 OK or API info response

# Smoke Test 3: Build frontend
cd /archinza-front-beta/archinza-front-beta
npm run build
# Expected: Build folder created with no errors
```

---

#### TC-SMOKE-002: Database Connection & Models

| Test ID | Check | Verification | Expected Result | Status |
|---------|-------|--------------|-----------------|--------|
| SMOKE-010 | MongoDB Running | `mongosh` connection | Connection established | ✅ To Test |
| SMOKE-011 | Database Exists | List databases | "archinza" database present | ✅ To Test |
| SMOKE-012 | Collections Created | List collections | All 51 models have collections | ✅ To Test |
| SMOKE-013 | Indexes Created | Check indexes on PersonalAccount | Unique index on email, phone+country_code | ✅ To Test |
| SMOKE-014 | Sample Data Query | Find one BusinessAccount | Document returned | ✅ To Test |

**Test Execution:**
```bash
# Check database connection
mongosh
use archinza
db.personalaccounts.findOne()
# Expected: Document returned or null if empty

# Check indexes
db.personalaccounts.getIndexes()
# Expected: Indexes on email, phone+country_code
```

---

#### TC-SMOKE-003: Core User Journeys

| Test ID | Journey | Test Steps | Critical Success Factor | Time Limit |
|---------|---------|------------|-------------------------|------------|
| SMOKE-020 | Personal Signup | 1. Open signup page<br>2. Enter details<br>3. Submit<br>4. Verify OTP received | OTP email/SMS received | < 30 sec |
| SMOKE-021 | Personal Login | 1. Open login page<br>2. Enter phone<br>3. Enter OTP<br>4. Login | Dashboard loads | < 20 sec |
| SMOKE-022 | Business Signup | 1. Open business signup<br>2. Enter business details<br>3. Verify OTP<br>4. Account created | Business dashboard loads | < 30 sec |
| SMOKE-023 | Business Login | 1. Open login<br>2. Enter username/password<br>3. Login | Business dashboard loads | < 10 sec |
| SMOKE-024 | View Business Profile | 1. Login<br>2. Navigate to /profile | Profile page loads with data | < 5 sec |
| SMOKE-025 | Upload Image | 1. Login<br>2. Upload image to gallery<br>3. Verify upload | Image appears in gallery | < 10 sec |
| SMOKE-026 | Subscribe to Plan | 1. Login<br>2. Choose plan<br>3. Open Razorpay checkout | Razorpay modal opens | < 5 sec |

**PASS CRITERIA:** All SMOKE tests must PASS before proceeding to detailed testing. Even one failure requires immediate investigation.

---

### 2.2 BUILD VERIFICATION TESTS

#### TC-SMOKE-BVT-001: Environment Configuration

| Test ID | Configuration | Check | Expected Value | Actual Value |
|---------|--------------|-------|----------------|--------------|
| SMOKE-BVT-001 | NODE_ENV | Environment variable set | "production" or "development" | ⚠️ Check |
| SMOKE-BVT-002 | Database URI | MONGODB_URI configured | Valid connection string | ⚠️ Check |
| SMOKE-BVT-003 | JWT Secret | SECRET_KEY configured | Non-empty, secure string | ⚠️ Check |
| SMOKE-BVT-004 | Razorpay Keys | key_id, key_secret set | Valid Razorpay credentials | ⚠️ Check |
| SMOKE-BVT-005 | AWS S3 | Bucket name, credentials set | Valid AWS config | ⚠️ Check |
| SMOKE-BVT-006 | Email Service | SMTP/SendGrid configured | Valid credentials | ⚠️ Check |
| SMOKE-BVT-007 | SMS Service | SMS gateway configured | Valid API key | ⚠️ Check |
| SMOKE-BVT-008 | Port | Server port configured | 3000 or custom port | ⚠️ Check |

**Test Execution:**
```bash
# Check environment variables
cd /node-archinza-beta/node-archinza-beta
cat .env | grep -v "^#" | grep "="
# Expected: All required variables present

# Verify no sensitive data in code
grep -r "razorpay_key_id" --include="*.js" .
# Expected: No hardcoded credentials (should use config.razorpay.key_id)
```

---

#### TC-SMOKE-BVT-002: Dependency Installation

| Test ID | Package Manager | Check | Expected Result | Status |
|---------|----------------|-------|-----------------|--------|
| SMOKE-BVT-010 | Backend NPM | `npm install` completes | No errors, node_modules created | ✅ To Test |
| SMOKE-BVT-011 | Frontend NPM | `npm install` completes | No errors, node_modules created | ✅ To Test |
| SMOKE-BVT-012 | Admin NPM | `npm install` completes | No errors, node_modules created | ✅ To Test |
| SMOKE-BVT-013 | Vulnerability Check | `npm audit` | No critical vulnerabilities | ⚠️ To Test |
| SMOKE-BVT-014 | Outdated Packages | `npm outdated` | Major dependencies up-to-date | ⚠️ To Test |

---

### 2.3 INTEGRATION POINTS CHECK

#### TC-SMOKE-INT-001: External Service Connectivity

| Test ID | Service | Check | Test Method | Expected Result | Status |
|---------|---------|-------|-------------|-----------------|--------|
| SMOKE-INT-001 | MongoDB | Connection | Connect to DB URI | Connected | ✅ To Test |
| SMOKE-INT-002 | Redis (if used) | Connection | `redis-cli ping` | PONG | ⚠️ To Test |
| SMOKE-INT-003 | AWS S3 | Bucket access | List objects or upload test file | Success | ✅ To Test |
| SMOKE-INT-004 | Razorpay API | Authentication | Fetch subscription plans | Plans returned | ✅ To Test |
| SMOKE-INT-005 | Email Service | Send test email | Trigger OTP email | Email received | ✅ To Test |
| SMOKE-INT-006 | SMS Service | Send test SMS | Trigger OTP SMS | SMS received | ✅ To Test |
| SMOKE-INT-007 | Google APIs | Geocoding | Validate pincode API call | Location data returned | ✅ To Test |

**Test Execution:**
```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/archinza"
# Expected: Connected

# Test S3 access (requires AWS CLI configured)
aws s3 ls s3://YOUR_BUCKET_NAME
# Expected: List of objects or empty

# Test Razorpay API
curl -u "YOUR_KEY_ID:YOUR_KEY_SECRET" https://api.razorpay.com/v1/plans
# Expected: JSON response with plans
```

---

## 3. SANITY TESTING

Sanity testing verifies that bugs have been fixed and new changes haven't broken existing functionality. This is typically done after receiving a new build.

### 3.1 BUG FIX VERIFICATION

#### TC-SANITY-BUG-001: Critical Bug Fixes

| Bug ID | Description | Fix Applied | Verification Test | Expected Result | Status |
|--------|-------------|-------------|-------------------|-----------------|--------|
| BUG-001 | Business signup OTP not verified | Move OTP check before user creation | 1. Signup with invalid OTP<br>2. Should reject | Error: "Invalid OTP" | ❌ NOT FIXED |
| BUG-002 | Plaintext password storage | Implement bcrypt hashing | 1. Create account<br>2. Check DB password field | Hashed password (bcrypt format) | ❌ NOT FIXED |
| BUG-003 | Webhook signature disabled | Uncomment verification code | 1. Send invalid webhook<br>2. Should reject | Error: "Invalid signature" | ❌ NOT FIXED |
| BUG-004 | No authorization on profile edit | Add auth check | 1. Try to edit another user's profile<br>2. Should reject | Error: "Unauthorized" | ❌ NOT FIXED |
| BUG-005 | OTP expiration not checked | Add expiration logic | 1. Use OTP after 60 min<br>2. Should reject | Error: "OTP expired" | ❌ NOT FIXED |

**Note:** These bugs were identified in the previous testing analysis. Sanity tests would verify that fixes have been applied correctly.

---

#### TC-SANITY-BUG-002: Medium Priority Bug Fixes

| Bug ID | Description | Test Steps | Expected After Fix | Status |
|--------|-------------|------------|-------------------|--------|
| BUG-010 | Duplicate email check case-sensitive | 1. Register user@example.com<br>2. Try User@Example.com | Rejected as duplicate | ⚠️ To Verify |
| BUG-011 | File upload accepts .exe files | 1. Upload malicious.exe<br>2. Should reject | Error: "File type not allowed" | ✅ Likely Fixed (extension check exists) |
| BUG-012 | Session fixation vulnerability | 1. Login<br>2. Verify session regenerated | New session ID after login | ❌ NOT FIXED |
| BUG-013 | Account enumeration via error messages | 1. Login with non-existent email<br>2. Check error message | Generic "Invalid credentials" | ❌ NOT FIXED (reveals "Invalid mobile number") |
| BUG-014 | CORS policy too permissive | 1. Request from unauthorized origin<br>2. Should reject | CORS error | ⚠️ To Verify |

---

### 3.2 NEW FEATURE VALIDATION

#### TC-SANITY-FEAT-001: Recently Added Features

| Feature ID | Feature Name | Release Version | Validation Test | Expected Result | Status |
|------------|--------------|-----------------|-----------------|-----------------|--------|
| FEAT-001 | Media Gallery Masonry Layout | v2.0 | 1. Upload 14 images<br>2. Check positions 0-13 assigned | All positions filled | ✅ To Test |
| FEAT-002 | Soft Delete for Images | v2.0 | 1. Delete image<br>2. Check Recently Deleted<br>3. Restore | Image restored successfully | ✅ To Test |
| FEAT-003 | Scrape Content API | v2.0 | 1. Submit URL for scraping<br>2. Check task status | Content scraped and saved | ✅ To Test |
| FEAT-004 | Business Verification Request | v2.0 | 1. Submit verification request<br>2. Check admin panel | Request appears for review | ✅ To Test |
| FEAT-005 | Subscription Plan Management | v2.0 | 1. Admin creates plan<br>2. User subscribes<br>3. Payment processed | Subscription active | ✅ To Test |
| FEAT-006 | Payment History with Invoices | v2.0 | 1. View payment history<br>2. Download invoice | PDF invoice downloaded | ✅ To Test |
| FEAT-007 | Device Tracking | v2.0 | 1. Login from new device<br>2. Check email<br>3. Check DB | Device record created, email sent | ✅ To Test |

---

#### TC-SANITY-FEAT-002: Feature Interaction Tests

| Test ID | Feature Combination | Test Steps | Expected Result | Regression Risk |
|---------|---------------------|------------|-----------------|-----------------|
| SANITY-INT-001 | Upload + Soft Delete + Restore | Upload image → Delete → Restore | Image visible in gallery | Low |
| SANITY-INT-002 | Subscribe + Change Payment Method | Subscribe → Update card → Verify | New method saved | Medium |
| SANITY-INT-003 | Profile Edit + Media Upload | Edit profile → Upload logo | Both saved correctly | Low |
| SANITY-INT-004 | Verification Request + Subscription | Request verification → Subscribe to plan | Both processed independently | Low |
| SANITY-INT-005 | OTP Resend + Login | Request OTP → Resend → Login with new OTP | Login successful | Medium |

---

### 3.3 RATIONALITY TESTING

Verify that data flows logically and business rules are enforced.

#### TC-SANITY-RAT-001: Business Logic Validation

| Test ID | Business Rule | Test Scenario | Expected Behavior | Actual Behavior |
|---------|---------------|---------------|-------------------|-----------------|
| SANITY-RAT-001 | Subscription end date > start date | Create subscription | endDate = startDate + plan duration | ✅ To Verify |
| SANITY-RAT-002 | Only one active plan per user | Subscribe to two plans | Second subscription deactivates first | ✅ To Verify (code: line 336-339) |
| SANITY-RAT-003 | Free users have limited features | Upload 11th image as free user | Error or prompt to upgrade | ⚠️ To Verify |
| SANITY-RAT-004 | Deleted accounts cannot login | Login with deleted account | Error: "Account no longer active" | ✅ To Verify (code: line 504-511) |
| SANITY-RAT-005 | OTP valid for 60 minutes only | Use OTP after 60 minutes | Error: "OTP expired" | ❌ NOT Implemented |
| SANITY-RAT-006 | Verified badge only for verified users | Check badge display logic | Badge shown only if isVerified=true | ✅ To Verify |
| SANITY-RAT-007 | Admin cannot delete own account | Admin tries self-deletion | Error: "Cannot delete own account" | ⚠️ To Verify |

---

#### TC-SANITY-RAT-002: Data Integrity Checks

| Test ID | Data Rule | Validation Method | Expected Result | Priority |
|---------|-----------|-------------------|-----------------|----------|
| SANITY-RAT-010 | No orphan media records | Delete user → Check media | All user media also deleted (cascade) | P1 |
| SANITY-RAT-011 | Payment logs match subscriptions | Query PaymentLog → Join with SubscriptionLog | All payments linked to subscriptions | P1 |
| SANITY-RAT-012 | Invoice amounts match payments | Compare Invoice.amount with PaymentLog.amount | Amounts match | P0 |
| SANITY-RAT-013 | Unique usernames (case-insensitive) | Create "testuser" and "TestUser" | Second attempt rejected | P1 |
| SANITY-RAT-014 | Email uniqueness across both user types | Create personal account + business account with same email | Allowed (separate tables) OR rejected | P1 |

**Test Execution:**
```bash
# Test data integrity: Orphan media check
mongosh archinza
db.media.find({ userId: ObjectId("NON_EXISTENT_USER_ID") })
# Expected: No results

# Test unique username case-insensitivity
curl -X POST http://localhost:3000/business/check-username \
  -H "Content-Type: application/json" \
  -d '{"username":"TestUser"}'
# Then try:
curl -X POST http://localhost:3000/business/check-username \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser"}'
# Expected: Both show unavailable if first is taken
```

---

#### TC-SANITY-RAT-003: Calculation Verification

| Test ID | Calculation | Input Values | Expected Result | Actual Result |
|---------|-------------|--------------|-----------------|---------------|
| SANITY-RAT-020 | Subscription end date | startDate=2025-01-01, duration=12 months | endDate=2026-01-01 | ✅ To Verify |
| SANITY-RAT-021 | Currency conversion (INR to USD) | amount=₹10,000, rate=0.012 | $120 | ✅ To Verify (code exists) |
| SANITY-RAT-022 | File size total for user | User uploads 5 files (2MB, 3MB, 1MB, 4MB, 5MB) | Total=15MB | ⚠️ To Verify |
| SANITY-RAT-023 | Invoice tax calculation | Subtotal=₹1000, tax=18% | Total=₹1180 | ⚠️ To Verify (if tax implemented) |
| SANITY-RAT-024 | Gallery position distribution | 14 images, 3 categories | ~4-5 images per category | ✅ To Verify (complex algorithm) |

---

## 4. REGRESSION TESTING

Regression testing ensures that existing functionality still works after new changes, bug fixes, or enhancements.

### 4.1 FEATURE REGRESSION

#### TC-REG-FEAT-001: Authentication Regression

| Test ID | Feature | Test Case | Last Known Working | Regression Risk | Frequency |
|---------|---------|-----------|-------------------|-----------------|-----------|
| REG-AUTH-001 | Personal Signup | Complete signup flow with valid OTP | v1.0 | Low | Every Build |
| REG-AUTH-002 | Personal Login | Login with phone + OTP | v1.0 | Low | Every Build |
| REG-AUTH-003 | Business Signup | Complete business signup | v1.0 | 🔴 HIGH (Known Bug) | Every Build |
| REG-AUTH-004 | Business Login | Login with username/password | v1.0 | Medium (Plaintext issue) | Every Build |
| REG-AUTH-005 | Forgot Password | Reset password flow for personal account | v1.0 | Low | Weekly |
| REG-AUTH-006 | Forgot Password | Reset password flow for business account | v1.0 | Low | Weekly |
| REG-AUTH-007 | Token Generation | Generate valid JWT | v1.0 | Low | Every Build |
| REG-AUTH-008 | Token Verification | Verify JWT and extract user | v1.0 | Low | Every Build |
| REG-AUTH-009 | OTP Generation | Generate 6-digit OTP | v1.0 | Low (Hardcoded in dev) | Every Build |
| REG-AUTH-010 | Session Management | Create/destroy session on login/logout | v1.0 | Medium | Weekly |

**Automation Recommendation:** Authentication tests should be automated and run on every commit.

---

#### TC-REG-FEAT-002: Profile Management Regression

| Test ID | Feature | Test Case | Regression Risk | Test Data |
|---------|---------|-----------|-----------------|-----------|
| REG-PROF-001 | View Profile | GET /personal/details/:id | Low | Valid user ID |
| REG-PROF-002 | Edit Profile | PUT /personal/edit-profile/:id | 🔴 HIGH (Auth issue) | Updated fields |
| REG-PROF-003 | Change Email | Email change with OTP verification | Medium | New valid email |
| REG-PROF-004 | Change Phone | Phone change with OTP verification | Medium | New valid phone |
| REG-PROF-005 | Change Password | Update password with current password | Medium | Strong password |
| REG-PROF-006 | Upload Business Logo | Upload logo via /business/business-details/:id | Low | JPEG/PNG file |
| REG-PROF-007 | Update Business Hours | Set weekly business hours | Low | Hours array |
| REG-PROF-008 | Toggle Field Visibility | Set field isPrivate flag | Low | Section + visibility boolean |

---

#### TC-REG-FEAT-003: Media Gallery Regression

| Test ID | Feature | Test Case | Last Working | Regression Risk | Depends On |
|---------|---------|-----------|--------------|-----------------|------------|
| REG-MEDIA-001 | Upload Images | Upload multiple images to gallery | v2.0 | Low | S3 connection |
| REG-MEDIA-002 | Upload Documents | Upload PDF with thumbnail generation | v2.0 | Medium | PDF processing |
| REG-MEDIA-003 | Soft Delete | Move images to "Recently Deleted" | v2.0 | Low | - |
| REG-MEDIA-004 | Restore Images | Restore from "Recently Deleted" | v2.0 | Medium | AWS restore function |
| REG-MEDIA-005 | Permanent Delete | Delete from DB and S3 | v2.0 | Medium | AWS delete function |
| REG-MEDIA-006 | Pin Images | Pin image to top of gallery | v2.0 | Low | - |
| REG-MEDIA-007 | Hide Images | Toggle image visibility | v2.0 | Low | - |
| REG-MEDIA-008 | Move Images | Move images between sections | v2.0 | Low | - |
| REG-MEDIA-009 | Reorder Images | Update masonry position | v2.0 | Medium | Position algorithm |
| REG-MEDIA-010 | File Validation | Reject invalid file types | v2.0 | Low | - |
| REG-MEDIA-011 | Duplicate Detection | Detect duplicate files by hash | v2.0 | Medium | File hashing |

---

#### TC-REG-FEAT-004: Subscription & Payment Regression

| Test ID | Feature | Test Case | External Dependency | Regression Risk | Status |
|---------|---------|-----------|---------------------|-----------------|--------|
| REG-SUB-001 | List Plans | GET /business-plans/ | MongoDB | Low | ✅ To Test |
| REG-SUB-002 | Create Subscription | POST /business-plans/subscribe | Razorpay API | Medium | ✅ To Test |
| REG-SUB-003 | Verify Payment | Verify Razorpay signature | Razorpay | 🔴 HIGH (Disabled) | ❌ BROKEN |
| REG-SUB-004 | Payment History | GET /business-plans/:id/payments | MongoDB aggregation | Medium | ✅ To Test |
| REG-SUB-005 | Get Invoice | GET /business-plans/invoice/:paymentId | MongoDB | Low | ✅ To Test |
| REG-SUB-006 | Change Payment Method | Update payment method via Razorpay | Razorpay API | Medium | ✅ To Test |
| REG-SUB-007 | Webhook: subscription.activated | Process activation webhook | Razorpay webhook | 🔴 CRITICAL (No signature verification) | ❌ INSECURE |
| REG-SUB-008 | Webhook: subscription.charged | Process charge webhook, create invoice | Razorpay webhook | 🔴 CRITICAL | ❌ INSECURE |
| REG-SUB-009 | Webhook: subscription.cancelled | Process cancellation | Razorpay webhook | 🔴 CRITICAL | ❌ INSECURE |
| REG-SUB-010 | Webhook: payment.failed | Log failed payment | Razorpay webhook | 🔴 CRITICAL | ❌ INSECURE |

**CRITICAL REGRESSION ISSUE:** Webhook signature verification is commented out. This is a **payment fraud vulnerability**.

---

### 4.2 API REGRESSION

#### TC-REG-API-001: Personal Account API Endpoints

| Endpoint | Method | Test Case | Expected Response | Status Code | Regression Frequency |
|----------|--------|-----------|-------------------|-------------|---------------------|
| /personal/signup | POST | Valid signup request | OTP sent successfully | 200 | Every Build |
| /personal/signup/otp-verify | POST | Valid OTP verification | User created, token returned | 200 | Every Build |
| /personal/login | POST | Valid phone login | OTP sent | 200 | Every Build |
| /personal/login/otp-verify | POST | Valid OTP | Token returned | 200 | Every Build |
| /personal/details/:id | GET | Get user by ID | User object (no password) | 200 | Every Build |
| /personal/edit-profile/:id | PUT | Update profile | Profile updated | 200 | Every Build |
| /personal/edit-email/:id | POST | Change email (send OTP) | OTP sent | 200 | Weekly |
| /personal/edit-email-verify/:id | POST | Verify email change | Email updated | 200 | Weekly |
| /personal/edit-phone/:id | POST | Change phone (send OTP) | OTP sent | 200 | Weekly |
| /personal/edit-phone-verify/:id | POST | Verify phone change | Phone updated | 200 | Weekly |
| /personal/edit-password/:id | PUT | Change password | Password updated | 200 | Weekly |
| /personal/forgot | POST | Request password reset | OTP sent | 200 | Weekly |
| /personal/forgot/otp/verify | POST | Verify reset OTP | OTP correct | 200 | Weekly |
| /personal/reset | POST | Reset password | Password changed | 200 | Weekly |
| /personal/check-pincode/:pincode | GET | Validate pincode | Location data | 200 | Weekly |
| /personal/post-review | POST | Submit review | Review created | 200 | Monthly |
| /personal/feedback | POST | Submit feedback | Feedback submitted | 200 | Monthly |

**Automation:** All GET endpoints should be tested automatically. Critical POST endpoints (signup, login) should have integration tests.

---

#### TC-REG-API-002: Business Account API Endpoints

| Endpoint | Method | Expected Behavior | Known Issues | Regression Priority |
|----------|--------|-------------------|--------------|---------------------|
| /business/signup | POST | OTP sent | None | P0 |
| /business/signup/otp-verify | POST | User created | 🔴 **OTP NOT CHECKED** | P0 |
| /business/login | POST | Token returned | ⚠️ Plaintext password | P0 |
| /business/check-username | POST | Availability status | None | P1 |
| /business/business-details/:id | GET | Business data with media | Complex query | P0 |
| /business/business-details/:id | POST | Update with logo upload | File upload | P1 |
| /business/profile/:username | GET | Public profile | Same as above | P1 |
| /business/business-details/:id/upload/:section | POST | Upload media | S3 dependency | P0 |
| /business/business-edit/media/:id | PUT | Toggle visibility | None | P2 |
| /business/soft-delete-images/:section | PUT | Soft delete images | None | P1 |
| /business/restore-images | PUT | Restore images | AWS restore | P1 |
| /business/delete-images | PUT | Permanent delete | AWS delete | P1 |
| /business/pin-images | PUT | Bulk pin/unpin | None | P2 |
| /business/hide-images | PUT | Bulk hide/show | None | P2 |
| /business/move-images | PUT | Change category | None | P2 |
| /business/media/update-position | POST | Update masonry position | Complex logic | P1 |
| /business/get-verified | POST | Request verification | Email scheduling | P1 |
| /business/change-visibility/:id | PUT | Toggle page online/offline | Email scheduling | P1 |
| /business/forgot-password | POST | Send reset OTP | None | P1 |
| /business/reset-password | POST | Reset password | None | P1 |
| /business/scrape_content | POST | Initiate content scraping | External API | P2 |
| /business/scrape_content/status/:taskId | GET | Check scraping status | External API | P2 |

---

#### TC-REG-API-003: Subscription API Endpoints

| Endpoint | Method | Critical Path | External Dependency | Test Frequency |
|----------|--------|---------------|---------------------|----------------|
| GET /business-plans/ | GET | ✅ Yes | MongoDB | Every Build |
| POST /business-plans/subscribe | POST | ✅ Yes | Razorpay API | Every Build |
| POST /business-plans/verify-payment | POST | ✅ Yes | Razorpay (signature) | Every Build |
| GET /business-plans/:id/payments | GET | ✅ Yes | MongoDB | Every Build |
| GET /business-plans/payment-method/:subscriptionId | GET | No | MongoDB | Weekly |
| GET /business-plans/subscription/:id/change-method | GET | No | Razorpay API | Weekly |
| GET /business-plans/invoice/:paymentId | GET | ✅ Yes | MongoDB | Every Build |
| GET /business-plans/invoice-by-id/:invoiceId | GET | No | MongoDB | Weekly |
| POST /business-plans/verify-update-method | POST | No | Razorpay | Weekly |

---

#### TC-REG-API-004: Response Format Regression

Verify that API response formats haven't changed, as this breaks frontend applications.

| Test ID | API Endpoint | Response Field | Expected Type | Regression Check |
|---------|--------------|----------------|---------------|------------------|
| REG-API-R001 | /personal/signup | message | string | Message text unchanged |
| REG-API-R002 | /personal/login/otp-verify | token | string (JWT) | Token format valid |
| REG-API-R003 | /business/business-details/:id | business_name | string | Field present |
| REG-API-R004 | /business/business-details/:id | subscription | object | Contains plan details |
| REG-API-R005 | /business-plans/:id/payments | data[].amount | number | Numeric, not string |
| REG-API-R006 | /business-plans/:id/payments | data[].date | Date | ISO 8601 format |
| REG-API-R007 | Error responses | status | number | 400, 401, 403, 404, 500 |
| REG-API-R008 | Error responses | message | string | User-friendly message |

**Test Execution:**
```bash
# Regression test: Verify response format hasn't changed
curl -X POST http://localhost:3000/personal/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phone":"9876543210","country_code":"91","name":"Test"}' \
  | jq '.'

# Expected structure:
# {
#   "status": 200,
#   "message": "Sign up OTP sent successfully",
#   "data": []
# }
```

---

### 4.3 DATABASE REGRESSION

#### TC-REG-DB-001: Schema Validation

| Test ID | Model | Field | Validation Rule | Regression Check |
|---------|-------|-------|----------------|------------------|
| REG-DB-001 | PersonalAccount | email | Unique, required | Duplicate rejected |
| REG-DB-002 | PersonalAccount | phone + country_code | Composite unique | Duplicate rejected |
| REG-DB-003 | BusinessAccount | username | Unique (case-insensitive) | Duplicate rejected |
| REG-DB-004 | BusinessAccount | isVerified | Boolean, default: false | Default applied |
| REG-DB-005 | BusinessUserPlan | isActive | Boolean, default: true | Default applied |
| REG-DB-006 | BusinessUserPlan | businessAccount | Reference to BusinessAccount | Valid ObjectId |
| REG-DB-007 | Media | userId | Reference to user | Valid ObjectId |
| REG-DB-008 | Media | softDelete | Boolean, default: false | Default applied |
| REG-DB-009 | PaymentLog | amount | Number, required | Cannot be null |
| REG-DB-010 | BusinessVerifications | user | Reference to BusinessAccount | Valid ObjectId |

**Test Execution:**
```bash
# Test schema validation: Duplicate email
mongosh archinza
db.personalaccounts.insertOne({
  email: "test@example.com",
  phone: "9876543210",
  country_code: "91",
  name: "Test User"
})

# Try inserting again with same email
db.personalaccounts.insertOne({
  email: "test@example.com",  // Same email
  phone: "1234567890",
  country_code: "91",
  name: "Another User"
})

# Expected: Duplicate key error on email field
```

---

#### TC-REG-DB-002: Relationship Integrity

| Test ID | Relationship | Test Scenario | Expected Behavior | Regression Risk |
|---------|--------------|---------------|-------------------|-----------------|
| REG-DB-R001 | BusinessAccount → Media | Delete business account | Orphan media records | 🟡 Medium (Manual cleanup needed) |
| REG-DB-R002 | BusinessAccount → BusinessUserPlan | Delete business account | Orphan subscription | 🟡 Medium |
| REG-DB-R003 | BusinessUserPlan → PaymentLog | Delete subscription | Orphan payment logs | 🟢 Low (Historical data) |
| REG-DB-R004 | PersonalAccount → ProAccessEntries | Delete personal account | Orphan pro access record | 🟡 Medium |
| REG-DB-R005 | BusinessAccount → BusinessVerifications | Delete business account | Orphan verification record | 🟡 Medium |

**FINDING:** No cascade delete or foreign key constraints found. Data integrity depends on application logic.

---

#### TC-REG-DB-003: Index Performance

| Test ID | Collection | Index | Query Pattern | Performance Check |
|---------|-----------|-------|---------------|-------------------|
| REG-DB-I001 | personalaccounts | email | Find by email | Query time < 10ms |
| REG-DB-I002 | personalaccounts | phone + country_code | Find by phone | Query time < 10ms |
| REG-DB-I003 | businessaccounts | username | Find by username | Query time < 10ms |
| REG-DB-I004 | businessaccounts | email | Find by email | Query time < 10ms |
| REG-DB-I005 | media | userId | Find all user media | Query time < 50ms |
| REG-DB-I006 | media | userId + category | Find by user + category | Query time < 20ms |
| REG-DB-I007 | paymentlogs | businessAccount | Find user payments | Query time < 50ms |
| REG-DB-I008 | paymentlogs | subscriptionId | Find subscription payments | Query time < 20ms |

**Test Execution:**
```bash
# Check indexes exist
mongosh archinza
db.businessaccounts.getIndexes()

# Expected indexes:
# - _id (default)
# - username (unique)
# - email (if created)

# Performance test
db.businessaccounts.find({username: "test_user"}).explain("executionStats")
# Expected: Uses index, executionTimeMillis < 10
```

---

### 4.4 UI REGRESSION

#### TC-REG-UI-001: Page Rendering

| Test ID | Page/Component | Rendering Check | Expected Result | Browser |
|---------|----------------|-----------------|-----------------|---------|
| REG-UI-001 | Homepage | Page loads without errors | Content visible | All |
| REG-UI-002 | Personal Signup | Form renders with all fields | 4 input fields + submit button | All |
| REG-UI-003 | Business Signup | Multi-step form renders | Step indicators visible | All |
| REG-UI-004 | Login Page | Login form with OTP option | Email/Phone input, OTP input | All |
| REG-UI-005 | Business Dashboard | Dashboard loads with data | Profile completion, stats visible | All |
| REG-UI-006 | Media Gallery | Images display in masonry layout | 14 positions rendered | All |
| REG-UI-007 | Profile Page | Profile data displayed | All sections load | All |
| REG-UI-008 | Payment Page | Razorpay checkout opens | Modal appears | All |
| REG-UI-009 | Admin Panel | Admin dashboard loads | User list, stats visible | Desktop |

**Test Browsers:** Chrome, Firefox, Safari, Edge
**Test Devices:** Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)

---

#### TC-REG-UI-002: Form Submission

| Test ID | Form | Test Action | Expected Behavior | Regression Check |
|---------|------|-------------|-------------------|------------------|
| REG-UI-F001 | Personal Signup | Fill form + submit | OTP sent message | No errors in console |
| REG-UI-F002 | Business Signup | Complete all steps | Account created | Redirects to dashboard |
| REG-UI-F003 | Login | Enter credentials | Login successful | Token stored in localStorage |
| REG-UI-F004 | Profile Edit | Update bio + save | Success message | Bio updated in DB |
| REG-UI-F005 | Media Upload | Select files + upload | Upload progress shown | Files appear in gallery |
| REG-UI-F006 | Payment | Complete payment | Success page | Subscription activated |
| REG-UI-F007 | Verification Request | Submit documents | Confirmation message | Request sent to admin |

---

#### TC-REG-UI-003: Responsive Design

| Test ID | Component | Viewport | Layout Check | Expected Behavior |
|---------|-----------|----------|--------------|-------------------|
| REG-UI-R001 | Navigation | Mobile (375px) | Hamburger menu | Menu collapses |
| REG-UI-R002 | Homepage | Tablet (768px) | 2-column layout | Content reflows |
| REG-UI-R003 | Gallery | Desktop (1920px) | Masonry grid | 4-5 columns |
| REG-UI-R004 | Gallery | Mobile (375px) | Single column | 1 column, stacked |
| REG-UI-R005 | Forms | Mobile (375px) | Full-width inputs | Easy to tap |
| REG-UI-R006 | Dashboard | Tablet (768px) | Sidebar collapses | Touch-friendly |

---

### 4.5 INTEGRATION REGRESSION

#### TC-REG-INT-001: Third-Party Service Integration

| Test ID | Service | Integration Point | Test Case | Rollback Plan | Status |
|---------|---------|------------------|-----------|---------------|--------|
| REG-INT-001 | Razorpay | Subscription creation | Create subscription | Manual refund if needed | ✅ To Test |
| REG-INT-002 | Razorpay | Payment verification | Verify payment signature | Reject invalid payments | ❌ **DISABLED** |
| REG-INT-003 | Razorpay | Webhook handling | Process all webhook events | Log errors, retry | ❌ **INSECURE** |
| REG-INT-004 | AWS S3 | File upload | Upload image to S3 | Delete on failure | ✅ To Test |
| REG-INT-005 | AWS S3 | File deletion | Delete image from S3 | N/A (destructive) | ✅ To Test |
| REG-INT-006 | AWS S3 | Restore soft-deleted file | Restore from S3 | N/A | ✅ To Test |
| REG-INT-007 | Email Service | OTP email | Send OTP via email | Queue retry | ✅ To Test |
| REG-INT-008 | SMS Service | OTP SMS | Send OTP via SMS | Queue retry | ✅ To Test |
| REG-INT-009 | Google Geocoding API | Pincode validation | Validate pincode + city | Graceful degradation | ✅ To Test |
| REG-INT-010 | Scrape Content API | Web scraping | Scrape business info | Timeout handling | ✅ To Test |

---

#### TC-REG-INT-002: Webhook Reliability

| Test ID | Webhook Event | Simulation Method | Expected Result | Failure Scenario |
|---------|---------------|-------------------|-----------------|------------------|
| REG-INT-W001 | subscription.activated | POST to webhook endpoint | Subscription activated in DB | Retry after 5 min |
| REG-INT-W002 | subscription.charged | POST to webhook endpoint | Payment logged, invoice created | Manual reconciliation |
| REG-INT-W003 | subscription.cancelled | POST to webhook endpoint | Subscription deactivated | Manual intervention |
| REG-INT-W004 | payment.captured | POST to webhook endpoint | Payment logged | Manual reconciliation |
| REG-INT-W005 | payment.failed | POST to webhook endpoint | Failed payment logged | Notify user |

**Test Execution:**
```bash
# Simulate webhook (DANGER: Currently no signature verification)
curl -X POST http://localhost:3000/razorpay/webhook \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: fake_signature_wont_be_verified" \
  -d '{
    "event": "subscription.activated",
    "payload": {
      "subscription": {
        "entity": {
          "id": "sub_test123",
          "status": "active",
          "current_start": 1640000000,
          "current_end": 1642592000
        }
      }
    }
  }'

# CRITICAL: This will currently succeed even with fake signature!
```

---

#### TC-REG-INT-003: Email/SMS Delivery

| Test ID | Service | Test Scenario | Expected Delivery Time | Fallback |
|---------|---------|---------------|----------------------|----------|
| REG-INT-E001 | Email OTP | Personal signup | < 30 seconds | Resend option |
| REG-INT-E002 | Email OTP | Business signup | < 30 seconds | Resend option |
| REG-INT-E003 | Email | Password reset | < 30 seconds | Resend option |
| REG-INT-E004 | Email | New device login alert | < 1 minute | N/A (notification) |
| REG-INT-E005 | Email | Verification request | < 1 minute | N/A (admin notification) |
| REG-INT-E006 | SMS OTP | Personal signup | < 10 seconds | Email OTP fallback |
| REG-INT-E007 | SMS OTP | Business signup | < 10 seconds | Email OTP fallback |
| REG-INT-E008 | SMS OTP | Password reset | < 10 seconds | Email OTP fallback |

---

## 5. TEST COVERAGE MATRIX

### 5.1 Feature Coverage

| Feature Module | Black Box Tests | Smoke Tests | Sanity Tests | Regression Tests | Total Coverage | Priority |
|----------------|----------------|-------------|--------------|------------------|----------------|----------|
| **Authentication** | 40 | 10 | 5 | 20 | 75 | 🔴 P0 |
| **User Profile** | 25 | 5 | 8 | 15 | 53 | 🔴 P0 |
| **Business Profile** | 30 | 5 | 10 | 18 | 63 | 🔴 P0 |
| **Media Gallery** | 35 | 3 | 12 | 22 | 72 | 🟡 P1 |
| **Subscriptions** | 20 | 7 | 6 | 15 | 48 | 🔴 P0 |
| **Payments** | 18 | 6 | 5 | 12 | 41 | 🔴 P0 |
| **Verification** | 10 | 2 | 3 | 5 | 20 | 🟡 P1 |
| **Search** | 0 | 0 | 0 | 0 | 0 | ❌ NOT IMPLEMENTED |
| **Admin Panel** | 15 | 3 | 5 | 10 | 33 | 🟡 P1 |
| **Notifications** | 12 | 2 | 3 | 8 | 25 | 🟢 P2 |
| **TOTAL** | **205** | **43** | **57** | **125** | **430** | - |

### 5.2 API Endpoint Coverage

| Route File | Total Endpoints | Black Box Tests | Regression Tests | Coverage % | Status |
|------------|----------------|----------------|------------------|------------|--------|
| auth.js | 9 | 18 | 10 | 100% | ✅ Full Coverage |
| personal.js | 18 | 45 | 18 | 100% | ✅ Full Coverage |
| business.js | 30 | 80 | 30 | 100% | ✅ Full Coverage |
| businessSubscription.js | 9 | 20 | 10 | 100% | ✅ Full Coverage |
| proAccess.js | 2 | 5 | 3 | 100% | ✅ Full Coverage |
| services.js | 4 | 8 | 4 | 100% | ✅ Full Coverage |
| general.js | 3 | 6 | 3 | 100% | ✅ Full Coverage |
| webhook.js (Razorpay) | 8 | 16 | 10 | 100% | ⚠️ Security Issues |
| **TOTAL** | **83** | **198** | **88** | **100%** | ⚠️ **Test Execution: 0%** |

**Note:** Coverage is planned at 100%, but **actual test execution is 0%** (no automated tests implemented).

---

### 5.3 User Journey Coverage

| User Journey | Steps | Black Box Tests | Smoke Tests | Regression Tests | E2E Automation | Status |
|--------------|-------|----------------|-------------|------------------|----------------|--------|
| **Personal User Onboarding** | 5 | 15 | 3 | 5 | ❌ No | ⚠️ Manual Only |
| **Business User Onboarding** | 8 | 20 | 4 | 8 | ❌ No | ⚠️ Manual Only |
| **Profile Completion** | 6 | 12 | 2 | 6 | ❌ No | ⚠️ Manual Only |
| **Media Upload & Management** | 7 | 18 | 2 | 10 | ❌ No | ⚠️ Manual Only |
| **Subscription Purchase** | 5 | 12 | 3 | 6 | ❌ No | ⚠️ Manual Only |
| **Payment & Invoice** | 4 | 10 | 2 | 5 | ❌ No | ⚠️ Manual Only |
| **Verification Request** | 3 | 6 | 1 | 3 | ❌ No | ⚠️ Manual Only |
| **Password Reset** | 4 | 8 | 1 | 4 | ❌ No | ⚠️ Manual Only |

**Critical Gap:** No end-to-end (E2E) automated tests exist for any user journey.

---

### 5.4 Security Testing Coverage

| Security Test Type | Tests Planned | Tests Executed | Critical Findings | Status |
|--------------------|--------------|----------------|-------------------|--------|
| **Input Validation** | 50 | 0 | Missing validation on most fields | ❌ 0% |
| **SQL/NoSQL Injection** | 15 | 0 | No sanitization found | ❌ 0% |
| **XSS Testing** | 20 | 0 | No server-side sanitization | ❌ 0% |
| **Authentication Bypass** | 10 | 0 | Plaintext passwords, OTP bypass | 🔴 CRITICAL |
| **Authorization Bypass** | 15 | 0 | Missing auth checks on edit endpoints | 🔴 CRITICAL |
| **Payment Fraud** | 8 | 0 | Webhook signature verification disabled | 🔴 CRITICAL |
| **Rate Limiting** | 10 | 0 | No rate limiting implemented | 🔴 HIGH |
| **Session Security** | 12 | 0 | Session fixation possible | 🟡 MEDIUM |
| **CSRF Protection** | 10 | 0 | No CSRF tokens | 🟡 MEDIUM |
| **Data Exposure** | 8 | 0 | Account enumeration possible | 🟡 MEDIUM |

**Overall Security Coverage:** **0%**
**Critical Vulnerabilities:** **12 identified**

---

## 6. CRITICAL ISSUES & RECOMMENDATIONS

### 6.1 CRITICAL ISSUES SUMMARY

#### 🔴 Priority 0 (Fix Immediately - Week 1)

| Issue ID | Issue | Impact | Files Affected | Recommended Fix |
|----------|-------|--------|----------------|-----------------|
| **CRIT-001** | **Plaintext Password Storage** | Complete authentication bypass | `models/personalAccount.js`<br>`models/businessAccount.js`<br>`routes/personal.js:638`<br>`routes/business.js:500` | Implement bcrypt hashing in model pre-save hooks |
| **CRIT-002** | **Razorpay Webhook Signature Verification Disabled** | Payment fraud, unauthorized subscription manipulation | `routes/razorpay/webhook.js:26-29` | Uncomment and fix signature verification |
| **CRIT-003** | **Business Signup OTP Bypass** | Account creation without verification | `routes/business.js:174-177` | Move OTP check before user creation |
| **CRIT-004** | **No Authorization on Profile Edits** | Users can edit any other user's profile | `routes/personal.js:417-428`<br>`routes/business.js:202-264` | Add req.auth._id validation |
| **CRIT-005** | **No Rate Limiting** | Brute force attacks, DoS | Global - all endpoints | Implement express-rate-limit middleware |

---

#### 🟡 Priority 1 (Fix in Month 1)

| Issue ID | Issue | Impact | Recommended Fix |
|----------|-------|--------|-----------------|
| **HIGH-001** | **No OTP Expiration Logic** | OTPs never expire | Add expiration timestamp, check on verification |
| **HIGH-002** | **Missing Search Functionality** | Core feature not implemented | Implement search, filter, and sort endpoints |
| **HIGH-003** | **No NoSQL Injection Protection** | Arbitrary database queries | Add input sanitization (express-mongo-sanitize) |
| **HIGH-004** | **Account Enumeration** | Error messages reveal if accounts exist | Use generic error messages |
| **HIGH-005** | **Missing Input Validation** | Invalid data accepted | Add Joi validation schemas to all routes |
| **HIGH-006** | **No CSRF Protection** | Cross-site request forgery | Implement CSRF tokens (csurf middleware) |
| **HIGH-007** | **Session Fixation Vulnerability** | Session not regenerated after login | Implement session.regenerate() |

---

### 6.2 TEST IMPLEMENTATION ROADMAP

#### Phase 1: Critical Security Fixes (Week 1)
- [ ] **Day 1-2:** Implement bcrypt password hashing
  - Update `models/personalAccount.js` and `models/businessAccount.js`
  - Add pre-save hook for password hashing
  - Migrate existing passwords (one-time script)
  - Test: Login still works after hashing

- [ ] **Day 3:** Enable Razorpay webhook signature verification
  - Uncomment `routes/razorpay/webhook.js:26-29`
  - Test: Invalid signatures rejected
  - Test: Valid signatures accepted

- [ ] **Day 4:** Fix business signup OTP flow
  - Move OTP check before user creation in `routes/business.js:174-177`
  - Test: Invalid OTP rejects signup
  - Test: Valid OTP creates account

- [ ] **Day 5:** Add authorization checks
  - Add middleware to verify req.auth._id === req.params.id
  - Apply to all edit endpoints
  - Test: Unauthorized edit attempts rejected

- [ ] **Day 6-7:** Implement rate limiting
  - Install `express-rate-limit`
  - Add rate limiters to auth endpoints (5 requests/15min)
  - Add rate limiters to API endpoints (100 requests/15min)
  - Test: Requests blocked after limit exceeded

---

#### Phase 2: Smoke Test Suite (Week 2)
- [ ] **Manual Smoke Tests**
  - Create smoke test checklist (TC-SMOKE-001 to TC-SMOKE-INT-010)
  - Execute smoke tests on every deployment
  - Document pass/fail results

- [ ] **Automated Health Checks**
  - Create `/health` endpoint
  - Implement uptime monitoring (UptimeRobot or similar)
  - Set up email alerts for downtime

---

#### Phase 3: Black Box Test Implementation (Weeks 3-4)
- [ ] **Input Validation Tests (Week 3)**
  - Implement TC-BB-INPUT-001 to TC-BB-INPUT-004 (50 tests)
  - Tools: Postman collections or Jest + Supertest
  - Verify valid input acceptance
  - Verify invalid input rejection
  - Test boundary values
  - Test equivalence partitions

- [ ] **Security Tests (Week 4)**
  - Implement TC-BB-SEC-001 to TC-BB-SEC-003 (25 tests)
  - NoSQL injection testing
  - XSS payload testing
  - CSRF testing
  - Account enumeration testing

---

#### Phase 4: Regression Test Suite (Weeks 5-8)
- [ ] **API Regression Tests (Week 5-6)**
  - Implement TC-REG-API-001 to TC-REG-API-004 (100 tests)
  - Automate using Jest + Supertest
  - Run on every commit (CI/CD integration)

- [ ] **Database Regression Tests (Week 7)**
  - Implement TC-REG-DB-001 to TC-REG-DB-003 (30 tests)
  - Test schema validations
  - Test relationship integrity
  - Test index performance

- [ ] **UI Regression Tests (Week 8)**
  - Implement TC-REG-UI-001 to TC-REG-UI-003 (40 tests)
  - Tools: Playwright or Cypress
  - Test page rendering
  - Test form submissions
  - Test responsive design

---

#### Phase 5: Continuous Testing (Ongoing)
- [ ] **CI/CD Pipeline Setup**
  - GitHub Actions workflow for automated testing
  - Run smoke tests on every commit
  - Run full regression suite on every PR
  - Block merges if tests fail

- [ ] **Test Coverage Monitoring**
  - Set up code coverage reporting (Jest coverage)
  - Target: 80% line coverage, 70% branch coverage
  - Review coverage reports weekly

- [ ] **Performance Testing**
  - API response time monitoring (< 500ms P95)
  - Database query performance (< 50ms average)
  - Frontend load time (< 3 seconds)

---

### 6.3 TEST AUTOMATION RECOMMENDATIONS

#### Recommended Testing Stack

**Backend Testing:**
- **Unit Tests:** Jest
- **Integration Tests:** Jest + Supertest + MongoDB Memory Server
- **API Contract Tests:** Pact or OpenAPI validation

**Frontend Testing:**
- **Unit Tests:** Jest + React Testing Library
- **Component Tests:** Storybook + Chromatic
- **E2E Tests:** Playwright (recommended) or Cypress

**Performance Testing:**
- **Load Testing:** k6 or Artillery
- **API Monitoring:** Postman Monitor or Runscope

**Security Testing:**
- **SAST:** SonarQube or CodeQL
- **DAST:** OWASP ZAP
- **Dependency Scanning:** npm audit + Snyk

---

#### Sample Automated Test

**File:** `/node-archinza-beta/tests/integration/black-box/authentication.test.js`

```javascript
const request = require('supertest');
const app = require('../../../index');
const PersonalAccount = require('../../../models/personalAccount');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

describe('Black Box Testing: Personal Account Authentication', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await PersonalAccount.deleteMany({});
  });

  describe('TC-BB-INPUT-001: Valid Input Acceptance', () => {
    test('BB-IN-001: Should accept valid email and phone', async () => {
      const response = await request(app)
        .post('/personal/signup')
        .send({
          email: 'test@example.com',
          phone: '9876543210',
          country_code: '91',
          name: 'Test User',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('OTP sent');
    });

    test('BB-IN-002: Should accept valid phone with country code', async () => {
      const response = await request(app)
        .post('/personal/signup')
        .send({
          email: 'test2@example.com',
          phone: '9876543210',
          country_code: '+91',
          name: 'Test User 2',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('OTP sent');
    });
  });

  describe('TC-BB-INPUT-002: Invalid Input Rejection', () => {
    test('BB-IN-101: Should reject invalid email format', async () => {
      const response = await request(app)
        .post('/personal/signup')
        .send({
          email: 'notanemail',
          phone: '9876543210',
          country_code: '91',
          name: 'Test User',
        });

      // Current implementation may not validate, so this test may fail
      // expect(response.body.status).toBe(400);
      // expect(response.body.message).toContain('Invalid email');

      // TODO: Implement email validation, then enable above assertions
    });

    test('BB-IN-104: Should reject phone with letters', async () => {
      const response = await request(app)
        .post('/personal/signup')
        .send({
          email: 'test@example.com',
          phone: '98765ABC10',
          country_code: '91',
          name: 'Test User',
        });

      // TODO: Implement phone validation
    });
  });

  describe('TC-BB-SEC-002: NoSQL Injection Protection', () => {
    beforeEach(async () => {
      // Create a test user
      await PersonalAccount.create({
        email: 'victim@example.com',
        phone: '9876543210',
        country_code: '91',
        password: 'hashedpassword',
        name: 'Victim User',
      });
    });

    test('BB-NOSQL-001: Should reject NoSQL injection in login', async () => {
      const response = await request(app)
        .post('/personal/login')
        .send({
          phone: { $ne: null },
          country_code: '91',
        });

      // Should reject, but currently may not
      expect(response.body.status).toBe(400);
      expect(response.body.message).toContain('Invalid');
    });

    test('BB-NOSQL-003: Should prevent $where injection', async () => {
      const response = await request(app)
        .post('/personal/login')
        .send({
          phone: { $where: "this.phone.length > 0" },
          country_code: '91',
        });

      expect(response.body.status).toBe(400);
    });
  });

  describe('TC-BB-STATE-001: Login Flow State Transitions', () => {
    test('BB-STATE-001: Unregistered → Registration Initiated', async () => {
      const response = await request(app)
        .post('/personal/signup')
        .send({
          email: 'newuser@example.com',
          phone: '9999999999',
          country_code: '91',
          name: 'New User',
        });

      expect(response.status).toBe(200);
      // OTP should be sent, but user not yet created
      const user = await PersonalAccount.findOne({ email: 'newuser@example.com' });
      expect(user).toBeNull(); // User not created until OTP verified
    });
  });
});
```

---

### 6.4 TEST EXECUTION STRATEGY

#### Daily Testing
- **Smoke Tests:** Run manually before starting work (5 minutes)
- **Automated Unit Tests:** Run on every commit via pre-commit hook
- **Code Quality:** Lint and format checks on every commit

#### Weekly Testing
- **Full Regression Suite:** Run all automated tests (1-2 hours)
- **Manual Exploratory Testing:** Test new features (2 hours)
- **Security Scanning:** Run OWASP ZAP or similar (30 minutes)
- **Performance Testing:** API response time checks (30 minutes)

#### Monthly Testing
- **Load Testing:** Simulate peak traffic (2 hours)
- **Penetration Testing:** Manual security testing (4 hours)
- **Cross-Browser Testing:** Test on all supported browsers (2 hours)
- **Accessibility Testing:** WCAG compliance checks (2 hours)

#### Pre-Release Testing
- **Full Test Suite:** All tests pass
- **User Acceptance Testing (UAT):** Stakeholder approval
- **Performance Benchmarks:** Meet or exceed targets
- **Security Audit:** No critical vulnerabilities

---

## 7. TEST METRICS & KPIs

### 7.1 Success Criteria

| Metric | Current | 1 Month | 3 Months | 6 Months | Status |
|--------|---------|---------|----------|----------|--------|
| **Test Coverage** | 0% | 40% | 80% | 90% | ❌ |
| **Critical Bugs (P0)** | 12 | 0 | 0 | 0 | 🔴 |
| **High Priority Bugs (P1)** | 8 | 4 | 0 | 0 | 🔴 |
| **Security Vulnerabilities** | 12 | 3 | 0 | 0 | 🔴 |
| **API Response Time (P95)** | Unknown | < 500ms | < 300ms | < 200ms | ⚠️ |
| **Automated Test Execution Time** | N/A | < 2 min | < 5 min | < 10 min | ❌ |
| **Manual Test Execution Time** | Unknown | < 4 hours | < 2 hours | < 1 hour | ⚠️ |
| **Test Pass Rate** | 0% | > 90% | > 95% | > 98% | ❌ |
| **Bug Escape Rate** | 100% | < 20% | < 10% | < 5% | 🔴 |
| **Mean Time to Detect (MTTD)** | Unknown | < 1 day | < 4 hours | < 1 hour | ⚠️ |
| **Mean Time to Repair (MTTR)** | Unknown | < 2 days | < 1 day | < 4 hours | ⚠️ |

---

### 7.2 Test Execution Dashboard

| Test Type | Total Tests | Passed | Failed | Blocked | Not Run | Pass Rate |
|-----------|-------------|--------|--------|---------|---------|-----------|
| **Smoke Tests** | 43 | 0 | 0 | 0 | 43 | 0% |
| **Black Box Tests** | 205 | 0 | 0 | 0 | 205 | 0% |
| **Sanity Tests** | 57 | 0 | 0 | 0 | 57 | 0% |
| **Regression Tests** | 125 | 0 | 0 | 0 | 125 | 0% |
| **Security Tests** | 50 | 0 | 0 | 0 | 50 | 0% |
| **Performance Tests** | 20 | 0 | 0 | 0 | 20 | 0% |
| **TOTAL** | **500** | **0** | **0** | **0** | **500** | **0%** |

**Status:** ❌ **No tests have been executed. Manual test execution required immediately.**

---

## 8. CONCLUSION

### 8.1 Executive Summary

The Archinza 2.0 project requires **comprehensive testing across all four testing types** (Black Box, Smoke, Sanity, and Regression). This analysis has identified:

- **500+ test cases** across all testing types
- **12 critical security vulnerabilities** requiring immediate fixes
- **0% test execution** - all tests need to be run manually or automated
- **100% theoretical coverage** of API endpoints and features

### 8.2 Critical Findings

1. **BLACK BOX TESTING:** Application is vulnerable to NoSQL injection, XSS, and input validation bypass. No automated black box tests exist.

2. **SMOKE TESTING:** No smoke test suite exists. Critical paths are not verified before deployment.

3. **SANITY TESTING:** Bug fixes are not systematically verified. New features are deployed without validation.

4. **REGRESSION TESTING:** No regression test suite exists. Changes could break existing functionality undetected.

### 8.3 Immediate Action Required

**Week 1 Priority:**
1. Fix 12 critical security vulnerabilities (plaintext passwords, webhook verification, OTP bypass, authorization)
2. Create and execute smoke test checklist
3. Set up basic test infrastructure (Jest, Supertest)

**Month 1 Priority:**
1. Implement 100 automated black box tests
2. Implement 125 regression tests
3. Achieve 40% code coverage
4. Establish CI/CD pipeline with automated testing

**Month 3 Goal:**
1. 80% test coverage
2. Zero critical bugs
3. < 10% bug escape rate
4. All manual tests converted to automated tests

---

### 8.4 Risk Assessment

**Without Implementing These Tests:**
- **Production Deployment Risk:** 🔴 **CRITICAL** - Application is not safe for production
- **Data Breach Risk:** 🔴 **HIGH** - Multiple security vulnerabilities
- **Financial Risk:** 🔴 **HIGH** - Payment fraud possible via webhook bypass
- **User Trust Risk:** 🔴 **HIGH** - Account takeover and data manipulation possible
- **Operational Risk:** 🟡 **MEDIUM** - Bugs may go undetected in production

**With Proper Testing Implementation:**
- **Production Deployment Risk:** 🟢 **LOW**
- **Data Breach Risk:** 🟢 **LOW**
- **Financial Risk:** 🟢 **LOW**
- **User Trust Risk:** 🟢 **LOW**
- **Operational Risk:** 🟢 **LOW**

---

**Report Generated:** November 17, 2025
**Total Test Cases Documented:** 500+
**Critical Issues Identified:** 12
**Estimated Testing Effort:** 800-1000 hours (4-5 months with 2 QA engineers)
**Automation ROI:** Estimated 70% reduction in manual testing time after 6 months

---

**Prepared By:** Claude Code Testing Audit Team
**Document Version:** 1.0
**Next Review Date:** December 17, 2025

