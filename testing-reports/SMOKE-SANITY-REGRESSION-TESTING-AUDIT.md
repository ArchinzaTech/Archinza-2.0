# Smoke, Sanity & Regression Testing Audit Report
## Archinza 2.0 - Comprehensive Analysis

**Audit Date:** 2025-11-17
**Auditor:** Claude Code Testing Analysis
**Scope:** Smoke Testing (04), Sanity Testing (05), Regression Testing (06)

---

## Executive Summary

### Critical Findings

🔴 **CRITICAL GAPS IDENTIFIED:**
- **0%** smoke test coverage (Goal: 100%)
- **0%** sanity test coverage (Goal: 80%)
- **0%** regression test coverage (Goal: 90%)
- **NO** health check endpoints implemented
- **NO** automated test suite for backend
- **NO** CI/CD smoke test integration
- **MISSING** smtp.js file (referenced but not found)

### Test Infrastructure Status

| Component | Current State | Target State | Gap |
|-----------|--------------|--------------|-----|
| Backend Tests | ❌ None | ✅ Full Suite | 100% |
| Frontend Tests | ⚠️ Placeholder | ✅ Full Suite | 95% |
| Admin Tests | ⚠️ Placeholder | ✅ Full Suite | 95% |
| Smoke Tests | ❌ None | ✅ 100% Auto | 100% |
| Sanity Tests | ❌ None | ✅ 80% Auto | 100% |
| Regression Tests | ❌ None | ✅ 90% Auto | 100% |
| CI/CD Integration | ❌ None | ✅ Full | 100% |

---

## 1. SMOKE TESTING AUDIT (Guide 04)

### 1.1 Current State Analysis

#### ✅ What Exists
```
Backend Infrastructure:
├── MongoDB Connection: ✅ Configured (helpers/db.js)
├── Redis Connection: ✅ Configured (helpers/redis.js)
├── AWS S3 Client: ✅ Configured (middlewares/upload.js)
├── Razorpay Client: ✅ Configured (routes/businessSubscription.js)
└── Email Service: ⚠️ Missing smtp.js file
```

#### ❌ What's Missing

**1. NO Health Check Endpoints**
- File: `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/routes/general.js`
- Issue: No `/health` endpoint for API monitoring
- Impact: Cannot verify API availability post-deployment

**2. NO Smoke Test Suite**
- Backend package.json: `"test": "echo \"Error: no test specified\" && exit 1"`
- No smoke test files found
- No automated smoke test script

**3. NO CI/CD Smoke Test Integration**
- Frontend CI/CD: Only deploys to S3, no tests run
- Backend: No CI/CD workflows found
- Location checked: `/home/user/Archinza-2.0/.github/workflows/` (doesn't exist at root)

**4. MISSING smtp.js File**
```javascript
// Referenced in:
- index.js:24: const smtp = require("./helpers/smtp");
- helpers/mailer.js:8: const transporter = require("./smtp");

// File location: /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/helpers/smtp.js
// Status: ❌ NOT FOUND
```

### 1.2 Smoke Test Checklist - Current State

| Check Item | Required | Current Status | Implementation Path |
|------------|----------|----------------|---------------------|
| **1. Application Accessibility** ||||
| Frontend (www.archinza.com) | ✅ Critical | ❌ Not tested | Add curl test in CI/CD |
| Admin (admin.archinza.com) | ✅ Critical | ❌ Not tested | Add curl test in CI/CD |
| API Health Endpoint | ✅ Critical | ❌ Missing | Create `/health` route |
| **2. Database Connectivity** ||||
| MongoDB Connection | ✅ Critical | ⚠️ No test | Create smoke test |
| MongoDB Query Test | ✅ Critical | ❌ Missing | Test `User.countDocuments()` |
| **3. Redis Connectivity** ||||
| Redis Connection | ✅ Critical | ⚠️ No test | Create smoke test |
| Redis Set/Get Test | ✅ Critical | ❌ Missing | Test `set()` and `get()` |
| **4. Critical User Flows** ||||
| Login Test | ✅ Critical | ❌ Missing | Test `/personal/login` |
| Test User Credentials | ✅ Critical | ❌ Missing | Create test account |
| **5. External Services** ||||
| S3 Bucket Access | ✅ Critical | ❌ Missing | Test `ListObjectsCommand` |
| Razorpay Connection | ✅ Critical | ❌ Missing | Test `plans.all()` |
| Email Service | ✅ Critical | ❌ BROKEN | Fix missing smtp.js |

### 1.3 Missing Smoke Test Coverage

#### Critical Gaps by Priority

**Priority 1 - Deploy Blockers (Must have before ANY deployment):**
1. **Health Check Endpoint** - API availability verification
2. **Database Connectivity Test** - MongoDB connection validation
3. **Redis Connectivity Test** - Session store validation
4. **SMTP Configuration** - Email service availability

**Priority 2 - Core Functionality (Must have for production):**
5. **Authentication Smoke Test** - Login with test credentials
6. **S3 Access Test** - File storage availability
7. **Razorpay Connection Test** - Payment gateway availability

**Priority 3 - Monitoring (Should have):**
8. **Frontend Accessibility Test** - Website loads
9. **Admin Panel Accessibility Test** - Admin interface loads
10. **API Response Time** - Performance baseline

### 1.4 Critical Paths Requiring Smoke Tests

```javascript
// File: /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/routes/

Critical Endpoints:
├── /personal/login - Personal account login (routes/personal.js:58)
├── /business/signup - Business account signup (routes/business.js:122)
├── /auth/login - Authentication (routes/auth.js:20)
├── /business-plans - Subscription plans (routes/businessSubscription.js:22)
└── /razorpay/webhook - Payment webhooks (routes/razorpay/webhook.js:14)
```

### 1.5 Recommended Implementation

#### Step 1: Create Health Check Endpoint

**File:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/routes/health.js`

```javascript
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const redisClient = require("../helpers/redis");
const config = require("../config/config");

router.get("/", async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: "OK",
    services: {
      database: "unknown",
      redis: "unknown",
      s3: "unknown"
    }
  };

  try {
    // MongoDB health
    health.services.database = mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    // Redis health
    try {
      await redisClient.ping();
      health.services.redis = "connected";
    } catch (e) {
      health.services.redis = "disconnected";
    }

    // S3 health (optional - can be slow)
    health.services.s3 = "not_tested";

    const allHealthy = health.services.database === "connected" &&
                       health.services.redis === "connected";

    res.status(allHealthy ? 200 : 503).json(health);
  } catch (error) {
    health.status = "ERROR";
    health.error = error.message;
    res.status(503).json(health);
  }
});

module.exports = router;
```

**Update index.js:**
```javascript
// Add after line 114
app.use("/health", require("./routes/health"));
```

#### Step 2: Create Smoke Test Suite

**File:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/tests/smoke/smoke.test.js`

```javascript
const request = require("supertest");
const mongoose = require("mongoose");
const redisClient = require("../../helpers/redis");
const { S3Client, ListObjectsCommand } = require("@aws-sdk/client-s3");
const Razorpay = require("razorpay");
const config = require("../../config/config");

const API_URL = process.env.API_URL || "http://localhost:3020";

describe("Smoke Tests - Critical Systems", () => {

  describe("1. Application Accessibility", () => {
    test("API health endpoint should return 200", async () => {
      const response = await request(API_URL).get("/health");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("OK");
    });
  });

  describe("2. Database Connectivity", () => {
    test("should be connected to MongoDB", () => {
      const isConnected = mongoose.connection.readyState === 1;
      expect(isConnected).toBe(true);
    });

    test("should query database successfully", async () => {
      const User = require("../../models/personalAccount");
      const count = await User.countDocuments();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe("3. Redis Connectivity", () => {
    test("should connect to Redis", async () => {
      const pong = await redisClient.ping();
      expect(pong).toBe("PONG");
    });

    test("should set and get values", async () => {
      await redisClient.set("smoke-test", "ok");
      const value = await redisClient.get("smoke-test");
      expect(value).toBe("ok");
      await redisClient.del("smoke-test");
    });
  });

  describe("4. Critical User Flows", () => {
    test("should handle login request", async () => {
      const response = await request(API_URL)
        .post("/personal/login")
        .send({
          phone: "9999999999",
          country_code: "+91"
        });

      // Accept both success and user-not-found as valid responses
      expect([200, 400]).toContain(response.status);
    });
  });

  describe("5. External Services", () => {
    test("should access S3 bucket", async () => {
      const s3Client = new S3Client({
        region: config.aws_region,
        credentials: {
          accessKeyId: config.aws_access_key_id,
          secretAccessKey: config.aws_secret_access_key
        }
      });

      const command = new ListObjectsCommand({
        Bucket: config.aws_bucket_name,
        MaxKeys: 1
      });

      await expect(s3Client.send(command)).resolves.toBeDefined();
    });

    test("should connect to Razorpay", async () => {
      const razorpay = new Razorpay({
        key_id: config.razorpay.key_id,
        key_secret: config.razorpay.key_secret
      });

      const plans = await razorpay.plans.all({ count: 1 });
      expect(plans).toBeDefined();
    });
  });
});
```

#### Step 3: Create Bash Smoke Test Script

**File:** `/home/user/Archinza-2.0/scripts/smoke-test.sh`

```bash
#!/bin/bash
# Smoke Test Script for Archinza 2.0
# Priority: Critical | Duration: 5-10 minutes | Automation: 100%

set -e  # Exit on error

echo "======================================="
echo "🔥 SMOKE TESTS - Archinza 2.0"
echo "======================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_URL="${FRONTEND_URL:-https://www.archinza.com}"
ADMIN_URL="${ADMIN_URL:-https://admin.archinza.com}"
API_URL="${API_URL:-https://api.archinza.com}"
TIMEOUT=10

echo "Configuration:"
echo "  Frontend: $FRONTEND_URL"
echo "  Admin: $ADMIN_URL"
echo "  API: $API_URL"
echo ""

# Test counter
PASSED=0
FAILED=0

# Helper function
test_endpoint() {
  local name=$1
  local url=$2
  local expected_code=${3:-200}

  echo -n "Testing $name... "

  if http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url"); then
    if [ "$http_code" = "$expected_code" ]; then
      echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
      ((PASSED++))
      return 0
    else
      echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $http_code)"
      ((FAILED++))
      return 1
    fi
  else
    echo -e "${RED}✗ FAIL${NC} (Connection failed)"
    ((FAILED++))
    return 1
  fi
}

echo "======================================="
echo "1. APPLICATION ACCESSIBILITY"
echo "======================================="

test_endpoint "Frontend" "$FRONTEND_URL"
test_endpoint "Admin Panel" "$ADMIN_URL"
test_endpoint "API Health" "$API_URL/health"

echo ""
echo "======================================="
echo "2. CRITICAL API ENDPOINTS"
echo "======================================="

# Test critical endpoints (expect 200 or appropriate response)
test_endpoint "General Countries" "$API_URL/general/countries"
test_endpoint "Business Plans" "$API_URL/business-plans"

echo ""
echo "======================================="
echo "3. AUTOMATED TESTS"
echo "======================================="

# Run Jest smoke tests if available
if [ -f "package.json" ] && grep -q "test:smoke" package.json; then
  echo "Running automated smoke tests..."
  if npm run test:smoke; then
    echo -e "${GREEN}✓ Automated tests PASSED${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ Automated tests FAILED${NC}"
    ((FAILED++))
  fi
else
  echo -e "${YELLOW}⚠ No automated smoke tests configured${NC}"
fi

echo ""
echo "======================================="
echo "SMOKE TEST SUMMARY"
echo "======================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo "======================================="

if [ $FAILED -gt 0 ]; then
  echo -e "${RED}❌ SMOKE TESTS FAILED${NC}"
  echo "Deployment should be rolled back!"
  exit 1
else
  echo -e "${GREEN}✅ ALL SMOKE TESTS PASSED${NC}"
  echo "Safe to proceed with deployment."
  exit 0
fi
```

#### Step 4: Update package.json

**File:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/package.json`

```json
{
  "scripts": {
    "start": "nodemon index.js",
    "restart": "pm2 restart node-archinza",
    "test": "jest",
    "test:smoke": "jest --testPathPattern=tests/smoke --maxWorkers=1",
    "test:sanity": "jest --testPathPattern=tests/sanity --maxWorkers=1",
    "test:regression": "jest --testPathPattern=tests/regression"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "@types/jest": "^29.5.11"
  }
}
```

#### Step 5: CI/CD Integration

**File:** `/home/user/Archinza-2.0/.github/workflows/backend-deploy.yml`

```yaml
name: Backend Deploy with Smoke Tests

on:
  push:
    branches:
      - main
    paths:
      - 'node-archinza-beta/**'

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        working-directory: ./node-archinza-beta/node-archinza-beta
        run: npm ci

      - name: Run Smoke Tests (Pre-Deploy)
        working-directory: ./node-archinza-beta/node-archinza-beta
        run: npm run test:smoke
        timeout-minutes: 5
        env:
          DB_HOST: ${{ secrets.DB_HOST }}
          DB_PORT: ${{ secrets.DB_PORT }}
          DB_NAME: ${{ secrets.DB_NAME }}
          DB_USER: ${{ secrets.DB_USER }}
          DB_PASS: ${{ secrets.DB_PASS }}
          REDIS_HOST: ${{ secrets.REDIS_HOST }}
          REDIS_PORT: ${{ secrets.REDIS_PORT }}
          REDIS_ACCESS_TOKEN: ${{ secrets.REDIS_ACCESS_TOKEN }}

      # Add deployment steps here

      - name: Run Smoke Tests (Post-Deploy)
        run: |
          chmod +x ./scripts/smoke-test.sh
          ./scripts/smoke-test.sh
        timeout-minutes: 5
        env:
          API_URL: https://api.archinza.com
          FRONTEND_URL: https://www.archinza.com
          ADMIN_URL: https://admin.archinza.com

      - name: Notify on Failure
        if: failure()
        run: echo "Smoke tests failed! Rolling back deployment..."
```

---

## 2. SANITY TESTING AUDIT (Guide 05)

### 2.1 Current State Analysis

**Status:** ❌ No sanity testing infrastructure exists

Sanity testing is performed after bug fixes or minor changes to verify specific functionality. Currently:
- No sanity test suite
- No test scenarios defined
- No automation framework
- No test data management

### 2.2 Sanity Test Scenarios by Feature Area

Based on the codebase analysis, here are the critical sanity test scenarios:

#### Scenario 1: After Login Bug Fix

**File Path:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/routes/personal.js:58`

```javascript
// Test File: tests/sanity/auth-login.sanity.test.js

describe("Sanity: Login Fix Verification", () => {
  describe("Personal Account Login", () => {
    test("should send OTP with correct phone number", async () => {
      const response = await request(API_URL)
        .post("/personal/login")
        .send({
          phone: "9876543210",
          country_code: "+91"
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test("should reject invalid phone number", async () => {
      const response = await request(API_URL)
        .post("/personal/login")
        .send({
          phone: "invalid",
          country_code: "+91"
        });

      expect(response.status).toBe(400);
    });

    test("should verify OTP correctly", async () => {
      // Login first
      const loginRes = await request(API_URL)
        .post("/personal/login")
        .send({
          phone: "9876543210",
          country_code: "+91"
        });

      // Verify OTP (use test OTP in test environment)
      const verifyRes = await request(API_URL)
        .post("/personal/login/otp-verify")
        .send({
          otp: "123456" // Test OTP
        });

      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.data.token).toBeDefined();
    });
  });

  describe("Business Account Login", () => {
    test("should send OTP with correct credentials", async () => {
      const response = await request(API_URL)
        .post("/business/login")
        .send({
          phone: "9876543210",
          country_code: "+91"
        });

      expect(response.status).toBe(200);
    });
  });
});
```

#### Scenario 2: After Payment Processing Fix

**File Path:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/routes/razorpay/webhook.js:14`

```javascript
// Test File: tests/sanity/payment-processing.sanity.test.js

describe("Sanity: Payment Processing Fix", () => {

  test("should create subscription", async () => {
    const response = await request(API_URL)
      .post("/business-plans/subscribe")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        planId: "test-plan-id",
        businessAccountId: "test-business-id"
      });

    expect(response.status).toBe(200);
    expect(response.body.data.subscriptionId).toBeDefined();
  });

  test("should process webhook for subscription.activated", async () => {
    const webhookPayload = {
      event: "subscription.activated",
      payload: {
        subscription: {
          entity: {
            id: "test-sub-id",
            status: "active",
            start_at: Math.floor(Date.now() / 1000),
            current_end: Math.floor(Date.now() / 1000) + 2592000,
            notes: {
              businessAccountId: "test-business-id"
            }
          }
        }
      }
    };

    const response = await request(API_URL)
      .post("/razorpay/webhook")
      .send(webhookPayload);

    expect(response.status).toBe(200);
  });

  test("should update subscription status", async () => {
    const BusinessUserPlan = require("../../models/businessUserPlan");

    const subscription = await BusinessUserPlan.findOne({
      razorpaySubscriptionId: "test-sub-id"
    });

    expect(subscription.paymentStatus).toBe("activated");
  });

  test("should generate invoice", async () => {
    const Invoice = require("../../models/businessInvoice");

    const invoice = await Invoice.findOne({
      subscriptionId: "test-sub-id"
    });

    expect(invoice).toBeDefined();
  });
});
```

#### Scenario 3: After Profile Update Fix

**File Path:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/routes/personal.js:46`

```javascript
// Test File: tests/sanity/profile-update.sanity.test.js

describe("Sanity: Profile Update Fix", () => {

  test("should update profile information", async () => {
    const response = await request(API_URL)
      .put("/personal/edit-profile/test-user-id")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        name: "Updated Name",
        email: "updated@example.com"
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("should save changes to database", async () => {
    const User = require("../../models/personalAccount");

    const user = await User.findById("test-user-id");
    expect(user.name).toBe("Updated Name");
    expect(user.email).toBe("updated@example.com");
  });

  test("should display updated data", async () => {
    const response = await request(API_URL)
      .get("/personal/details/test-user-id")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.body.data.name).toBe("Updated Name");
  });

  test("should update related data", async () => {
    // Verify related collections updated if applicable
    // Example: business accounts linked to this user
  });
});
```

#### Scenario 4: After File Upload Fix

**File Path:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/middlewares/upload.js:24`

```javascript
// Test File: tests/sanity/file-upload.sanity.test.js

describe("Sanity: File Upload Fix", () => {

  test("should upload image to S3", async () => {
    const response = await request(API_URL)
      .post("/business/media/upload")
      .set("Authorization", `Bearer ${testToken}`)
      .attach("file", "./tests/fixtures/test-image.jpg");

    expect(response.status).toBe(200);
    expect(response.body.data.url).toMatch(/amazonaws.com/);
  });

  test("should save media record to database", async () => {
    const Media = require("../../models/media");

    const media = await Media.findOne({
      businessAccount: "test-business-id"
    }).sort({ createdAt: -1 });

    expect(media).toBeDefined();
    expect(media.url).toBeDefined();
  });

  test("should handle HEIC conversion", async () => {
    const response = await request(API_URL)
      .post("/business/media/upload")
      .set("Authorization", `Bearer ${testToken}`)
      .attach("file", "./tests/fixtures/test-image.heic");

    expect(response.status).toBe(200);
    expect(response.body.data.url).toMatch(/\.jpg$/);
  });
});
```

### 2.3 Sanity vs Smoke Testing - Implementation Matrix

| Aspect | Smoke Testing | Sanity Testing | Current Status |
|--------|---------------|----------------|----------------|
| **Scope** | Broad (all critical systems) | Narrow (specific feature) | Both: ❌ Missing |
| **When** | After every deployment | After bug fix/change | Both: ❌ Not implemented |
| **Focus** | System availability | Feature correctness | Both: ❌ No tests |
| **Duration** | 5-10 minutes | 15-30 minutes | N/A |
| **Automation** | 100% | 80% | 0% |
| **Test Data** | Minimal | Feature-specific | ❌ Not managed |

### 2.4 Recommended Implementation

#### Create Test Data Management

**File:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/tests/fixtures/test-data.js`

```javascript
const mongoose = require("mongoose");
const User = require("../../models/personalAccount");
const BusinessAccount = require("../../models/businessAccount");

class TestDataManager {
  static async createTestUser() {
    return await User.create({
      name: "Sanity Test User",
      email: "sanity-test@archinza.test",
      phone: "9999999999",
      country_code: "+91",
      role: "personal"
    });
  }

  static async createTestBusinessAccount() {
    return await BusinessAccount.create({
      name: "Sanity Test Business",
      email: "sanity-business@archinza.test",
      phone: "8888888888",
      country_code: "+91",
      businessType: "Architecture Firm"
    });
  }

  static async cleanupTestData() {
    await User.deleteMany({ email: /sanity-test@/ });
    await BusinessAccount.deleteMany({ email: /sanity-business@/ });
  }
}

module.exports = TestDataManager;
```

#### Update package.json

```json
{
  "scripts": {
    "test:sanity": "jest --testPathPattern=tests/sanity --maxWorkers=1",
    "test:sanity:watch": "jest --testPathPattern=tests/sanity --watch"
  }
}
```

---

## 3. REGRESSION TESTING AUDIT (Guide 06)

### 3.1 Current State Analysis

**Status:** ❌ No regression testing infrastructure exists

Regression testing ensures new changes don't break existing functionality. Currently:
- No regression test suite
- No test coverage tracking
- No automated regression runs
- No test organization structure

### 3.2 Regression Test Suite Requirements

Based on the codebase, here are the critical areas requiring regression tests:

#### 3.2.1 Core Functionality Tests

```javascript
// File: tests/regression/user-management.regression.test.js

describe("Regression: User Management", () => {

  describe("Personal Account", () => {
    test("registration still works", async () => {
      const response = await request(API_URL)
        .post("/personal/signup")
        .send({
          name: "Test User",
          email: "test@example.com",
          phone: "9876543210",
          country_code: "+91"
        });

      expect(response.status).toBe(200);
    });

    test("login still works", async () => {
      const response = await request(API_URL)
        .post("/personal/login")
        .send({
          phone: "9876543210",
          country_code: "+91"
        });

      expect(response.status).toBe(200);
    });

    test("profile update still works", async () => {
      const response = await request(API_URL)
        .put("/personal/edit-profile/test-id")
        .set("Authorization", `Bearer ${testToken}`)
        .send({ name: "Updated Name" });

      expect(response.status).toBe(200);
    });
  });

  describe("Business Account", () => {
    test("registration still works", async () => {
      const response = await request(API_URL)
        .post("/business/signup")
        .send({
          email: "business@example.com",
          phone: "9876543210",
          country_code: "+91",
          businessType: "Architecture Firm"
        });

      expect(response.status).toBe(200);
    });

    test("media upload still works", async () => {
      const response = await request(API_URL)
        .post("/business/media/upload")
        .set("Authorization", `Bearer ${testToken}`)
        .attach("file", "./tests/fixtures/test-image.jpg");

      expect(response.status).toBe(200);
    });
  });
});
```

#### 3.2.2 Critical User Journeys

```javascript
// File: tests/regression/critical-journeys.regression.test.js

describe("Regression: Critical User Journeys", () => {

  describe("Complete Registration Flow", () => {
    test("personal account full journey", async () => {
      // 1. Request OTP
      const otpRes = await request(API_URL)
        .post("/personal/login")
        .send({
          phone: "9876543210",
          country_code: "+91"
        });
      expect(otpRes.status).toBe(200);

      // 2. Verify OTP
      const verifyRes = await request(API_URL)
        .post("/personal/login/otp-verify")
        .send({ otp: "123456" });
      expect(verifyRes.status).toBe(200);

      // 3. Get profile
      const token = verifyRes.body.data.token;
      const profileRes = await request(API_URL)
        .get("/personal/details/test-id")
        .set("Authorization", `Bearer ${token}`);
      expect(profileRes.status).toBe(200);
    });
  });

  describe("Complete Subscription Purchase", () => {
    test("business subscription full journey", async () => {
      // 1. Get plans
      const plansRes = await request(API_URL).get("/business-plans");
      expect(plansRes.status).toBe(200);
      const planId = plansRes.body.data[0]._id;

      // 2. Create subscription
      const subRes = await request(API_URL)
        .post("/business-plans/subscribe")
        .set("Authorization", `Bearer ${testToken}`)
        .send({ planId });
      expect(subRes.status).toBe(200);

      // 3. Simulate webhook
      const webhookRes = await request(API_URL)
        .post("/razorpay/webhook")
        .send({
          event: "subscription.activated",
          payload: { /* ... */ }
        });
      expect(webhookRes.status).toBe(200);

      // 4. Verify subscription active
      const statusRes = await request(API_URL)
        .get("/business/subscription-status")
        .set("Authorization", `Bearer ${testToken}`);
      expect(statusRes.body.data.status).toBe("active");
    });
  });

  describe("Complete Profile Update", () => {
    test("personal profile update journey", async () => {
      // 1. Get current profile
      const getRes = await request(API_URL)
        .get("/personal/details/test-id")
        .set("Authorization", `Bearer ${testToken}`);
      expect(getRes.status).toBe(200);
      const originalName = getRes.body.data.name;

      // 2. Update profile
      const updateRes = await request(API_URL)
        .put("/personal/edit-profile/test-id")
        .set("Authorization", `Bearer ${testToken}`)
        .send({ name: "New Name" });
      expect(updateRes.status).toBe(200);

      // 3. Verify update
      const verifyRes = await request(API_URL)
        .get("/personal/details/test-id")
        .set("Authorization", `Bearer ${testToken}`);
      expect(verifyRes.body.data.name).toBe("New Name");
    });
  });

  describe("Complete File Upload", () => {
    test("business media upload journey", async () => {
      // 1. Upload file
      const uploadRes = await request(API_URL)
        .post("/business/media/upload")
        .set("Authorization", `Bearer ${testToken}`)
        .attach("file", "./tests/fixtures/test-image.jpg");
      expect(uploadRes.status).toBe(200);
      const mediaId = uploadRes.body.data._id;

      // 2. Verify in gallery
      const galleryRes = await request(API_URL)
        .get("/business/media")
        .set("Authorization", `Bearer ${testToken}`);
      expect(galleryRes.body.data).toContainEqual(
        expect.objectContaining({ _id: mediaId })
      );

      // 3. Delete file
      const deleteRes = await request(API_URL)
        .delete(`/business/media/${mediaId}`)
        .set("Authorization", `Bearer ${testToken}`);
      expect(deleteRes.status).toBe(200);
    });
  });
});
```

#### 3.2.3 API Regression Tests

```javascript
// File: tests/regression/api-endpoints.regression.test.js

describe("Regression: API Endpoints", () => {

  const endpoints = [
    // Personal routes
    { method: "GET", path: "/personal/details/:id", auth: true },
    { method: "POST", path: "/personal/login", auth: false },

    // Business routes
    { method: "POST", path: "/business/signup", auth: false },
    { method: "GET", path: "/business-plans", auth: false },

    // General routes
    { method: "GET", path: "/general/countries", auth: false },
    { method: "GET", path: "/general/states/:country_id", auth: false },

    // Admin routes
    { method: "POST", path: "/admin/auth/login", auth: false },
  ];

  endpoints.forEach(endpoint => {
    test(`${endpoint.method} ${endpoint.path} should still work`, async () => {
      const req = request(API_URL)[endpoint.method.toLowerCase()](
        endpoint.path.replace(/:id/, "test-id").replace(/:country_id/, "101")
      );

      if (endpoint.auth) {
        req.set("Authorization", `Bearer ${testToken}`);
      }

      const response = await req;

      // Accept 200, 400 (validation), 401 (auth), 404 (not found)
      expect([200, 400, 401, 404]).toContain(response.status);

      // Should not return 500 (server error)
      expect(response.status).not.toBe(500);
    });
  });
});
```

### 3.3 Critical Paths Requiring Automated Regression Tests

Based on file analysis, here are the critical paths:

| Priority | Feature Area | File Path | Endpoints | Risk Level |
|----------|--------------|-----------|-----------|------------|
| **P1** | Authentication | `routes/auth.js` | `/auth/login`, `/auth/signup` | 🔴 Critical |
| **P1** | Personal Login | `routes/personal.js:58` | `/personal/login` | 🔴 Critical |
| **P1** | Business Signup | `routes/business.js:122` | `/business/signup` | 🔴 Critical |
| **P1** | Razorpay Webhooks | `routes/razorpay/webhook.js:14` | `/razorpay/webhook` | 🔴 Critical |
| **P1** | Subscriptions | `routes/businessSubscription.js:22` | `/business-plans/*` | 🔴 Critical |
| **P2** | Profile Updates | `routes/personal.js:46` | `/personal/edit-profile/:id` | 🟡 High |
| **P2** | File Uploads | `middlewares/upload.js:24` | `/business/media/upload` | 🟡 High |
| **P2** | General API | `routes/general.js` | `/general/*` | 🟢 Medium |
| **P3** | Admin Routes | `routes/admin/*` | `/admin/*` | 🟢 Medium |

### 3.4 Regression Test Organization Structure

```
/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/tests/
├── smoke/
│   ├── smoke.test.js                          # Quick deployment validation
│   └── health-check.test.js                   # Health endpoint tests
├── sanity/
│   ├── auth-login.sanity.test.js             # After login fix
│   ├── payment-processing.sanity.test.js      # After payment fix
│   ├── profile-update.sanity.test.js          # After profile fix
│   └── file-upload.sanity.test.js            # After upload fix
├── regression/
│   ├── user-management.regression.test.js     # Core user features
│   ├── business-management.regression.test.js # Core business features
│   ├── subscription.regression.test.js        # Subscription features
│   ├── payment.regression.test.js             # Payment features
│   ├── critical-journeys.regression.test.js   # End-to-end flows
│   └── api-endpoints.regression.test.js       # All API endpoints
├── integration/
│   ├── database.integration.test.js           # DB operations
│   ├── redis.integration.test.js              # Redis operations
│   ├── s3.integration.test.js                 # S3 operations
│   └── razorpay.integration.test.js           # Razorpay operations
├── fixtures/
│   ├── test-data.js                           # Test data factory
│   ├── test-image.jpg                         # Test image file
│   └── test-document.pdf                      # Test PDF file
└── setup/
    ├── jest.setup.js                          # Jest configuration
    ├── test-db.js                             # Test database setup
    └── test-helpers.js                        # Helper functions
```

### 3.5 Test Data Management for Regression

**File:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/tests/setup/test-db.js`

```javascript
const mongoose = require("mongoose");

class TestDatabase {
  static async connect() {
    const url = process.env.TEST_DB_URL || "mongodb://localhost:27017/archinza-test";
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  static async disconnect() {
    await mongoose.connection.close();
  }

  static async cleanup() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }

  static async seed() {
    // Seed test data
    const User = require("../../models/personalAccount");
    const BusinessAccount = require("../../models/businessAccount");

    await User.create({
      _id: "test-user-id",
      name: "Test User",
      email: "test@archinza.test",
      phone: "9999999999",
      country_code: "+91"
    });

    await BusinessAccount.create({
      _id: "test-business-id",
      name: "Test Business",
      email: "test-business@archinza.test",
      phone: "8888888888",
      country_code: "+91"
    });
  }
}

module.exports = TestDatabase;
```

### 3.6 CI/CD Regression Test Integration

**File:** `/home/user/Archinza-2.0/.github/workflows/regression-tests.yml`

```yaml
name: Regression Tests

on:
  pull_request:
    branches:
      - main
  schedule:
    # Run regression tests nightly
    - cron: '0 2 * * *'

jobs:
  regression:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017

      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        working-directory: ./node-archinza-beta/node-archinza-beta
        run: npm ci

      - name: Run Regression Tests
        working-directory: ./node-archinza-beta/node-archinza-beta
        run: npm run test:regression
        timeout-minutes: 30
        env:
          NODE_ENV: test
          TEST_DB_URL: mongodb://localhost:27017/archinza-test
          REDIS_HOST: localhost
          REDIS_PORT: 6379

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: regression-test-results
          path: ./node-archinza-beta/node-archinza-beta/coverage

      - name: Comment PR with Results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'Regression tests completed. Check artifacts for details.'
            })
```

---

## 4. CI/CD SMOKE TEST INTEGRATION

### 4.1 Current CI/CD State

**Frontend CI/CD:**
- Location: `/home/user/Archinza-2.0/archinza-front-beta/archinza-front-beta/.github/workflows/`
- Files: `deploy_s3_prod.yml`, `deploy_s3_dev.yml`
- Current: Only deploys to S3, **NO TESTS RUN**

**Backend CI/CD:**
- Status: ❌ **NO CI/CD WORKFLOWS EXIST**

### 4.2 Recommended CI/CD Integration

#### Update Frontend Deployment Workflow

**File:** `/home/user/Archinza-2.0/archinza-front-beta/archinza-front-beta/.github/workflows/deploy_s3_prod.yml`

```yaml
name: Deploy Frontend to S3 with Smoke Tests

on:
  push:
    branches:
      - main

jobs:
  test-build-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run Unit Tests
        run: npm test -- --coverage
        env:
          CI: true

      - name: Build
        run: npm run build

      - name: Install AWS CLI
        run: |
          sudo apt-get update -y
          sudo apt-get install -y python3-pip
          pip3 install awscli

      - name: Configure AWS credentials
        run: |
          aws configure set aws_access_key_id ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws configure set aws_secret_access_key ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Deploy to S3
        run: |
          aws s3 sync build/ s3://www.archinza.com/ --acl public-read --delete

      - name: Run Smoke Tests (Post-Deploy)
        run: |
          # Wait for deployment to propagate
          sleep 30

          # Test frontend accessibility
          curl -f https://www.archinza.com || exit 1

          echo "✅ Frontend smoke test passed"
        timeout-minutes: 5

      - name: Notify on Failure
        if: failure()
        run: |
          echo "Deployment or smoke tests failed!"
          # Add notification logic (Slack, email, etc.)
```

#### Create Backend CI/CD Workflow

**File:** `/home/user/Archinza-2.0/.github/workflows/backend-ci.yml`

```yaml
name: Backend CI with Smoke Tests

on:
  push:
    branches:
      - main
      - develop
    paths:
      - 'node-archinza-beta/**'
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
        options: >-
          --health-cmd "mongosh --eval 'db.runCommand({ ping: 1 })'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: node-archinza-beta/node-archinza-beta/package-lock.json

      - name: Install dependencies
        working-directory: ./node-archinza-beta/node-archinza-beta
        run: npm ci

      - name: Run Smoke Tests
        working-directory: ./node-archinza-beta/node-archinza-beta
        run: npm run test:smoke
        timeout-minutes: 5
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 27017
          DB_NAME: archinza-test
          REDIS_HOST: localhost
          REDIS_PORT: 6379
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_BUCKET_NAME: ${{ secrets.AWS_BUCKET_NAME }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
          RAZORPAY_KEY_ID: ${{ secrets.RAZORPAY_KEY_ID }}
          RAZORPAY_SECRET_KEY: ${{ secrets.RAZORPAY_SECRET_KEY }}

      - name: Run Sanity Tests
        if: github.event_name == 'pull_request'
        working-directory: ./node-archinza-beta/node-archinza-beta
        run: npm run test:sanity
        timeout-minutes: 10

      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./node-archinza-beta/node-archinza-beta/coverage/lcov.info
          flags: backend

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      # Add deployment steps here

      - name: Post-Deploy Smoke Test
        run: |
          chmod +x ./scripts/smoke-test.sh
          ./scripts/smoke-test.sh
        timeout-minutes: 5
        env:
          API_URL: https://api.archinza.com
          FRONTEND_URL: https://www.archinza.com
          ADMIN_URL: https://admin.archinza.com
```

---

## 5. IMPLEMENTATION ROADMAP

### Phase 1: Critical Setup (Week 1) - MUST HAVE

#### Priority 1.1: Fix Missing Files
- [ ] Create `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/helpers/smtp.js`
- [ ] Verify SMTP configuration works

#### Priority 1.2: Health Check Endpoint
- [ ] Create `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/routes/health.js`
- [ ] Add route to index.js
- [ ] Test endpoint manually

#### Priority 1.3: Basic Test Infrastructure
- [ ] Install Jest and Supertest: `npm install --save-dev jest supertest @types/jest`
- [ ] Create `jest.config.js`
- [ ] Update package.json scripts
- [ ] Create test directory structure

### Phase 2: Smoke Tests (Week 2) - CRITICAL

#### Priority 2.1: Automated Smoke Tests
- [ ] Create `/tests/smoke/smoke.test.js`
- [ ] Test database connectivity
- [ ] Test Redis connectivity
- [ ] Test external services (S3, Razorpay)
- [ ] Run locally and verify all pass

#### Priority 2.2: Bash Smoke Test Script
- [ ] Create `/scripts/smoke-test.sh`
- [ ] Make executable: `chmod +x /scripts/smoke-test.sh`
- [ ] Test script locally
- [ ] Document usage

#### Priority 2.3: CI/CD Integration
- [ ] Create `.github/workflows/backend-ci.yml`
- [ ] Configure GitHub secrets
- [ ] Test workflow on feature branch
- [ ] Monitor first automated run

### Phase 3: Sanity Tests (Week 3) - HIGH PRIORITY

#### Priority 3.1: Test Data Management
- [ ] Create `/tests/fixtures/test-data.js`
- [ ] Create test user accounts
- [ ] Create test business accounts
- [ ] Document test data creation

#### Priority 3.2: Feature-Specific Sanity Tests
- [ ] Create auth sanity tests
- [ ] Create payment sanity tests
- [ ] Create profile update sanity tests
- [ ] Create file upload sanity tests

#### Priority 3.3: Sanity Test Automation
- [ ] Add `test:sanity` script to package.json
- [ ] Integrate with PR workflow
- [ ] Document when to run sanity tests

### Phase 4: Regression Tests (Week 4-5) - CRITICAL

#### Priority 4.1: Core Functionality Tests
- [ ] Create user management regression tests
- [ ] Create business management regression tests
- [ ] Create subscription regression tests
- [ ] Create payment regression tests

#### Priority 4.2: Critical Journey Tests
- [ ] Test complete registration flow
- [ ] Test complete login flow
- [ ] Test complete subscription flow
- [ ] Test complete file upload flow

#### Priority 4.3: API Regression Tests
- [ ] List all API endpoints
- [ ] Create endpoint regression test template
- [ ] Test all critical endpoints
- [ ] Set up nightly regression runs

### Phase 5: Monitoring & Maintenance (Ongoing)

#### Priority 5.1: Test Coverage
- [ ] Set up coverage reporting
- [ ] Track coverage over time
- [ ] Set minimum coverage thresholds
- [ ] Review coverage in PRs

#### Priority 5.2: Test Maintenance
- [ ] Update tests when features change
- [ ] Remove tests for deprecated features
- [ ] Keep test data fresh
- [ ] Review and refactor tests quarterly

---

## 6. CRITICAL ISSUES & BLOCKERS

### 6.1 MISSING Files

**🔴 CRITICAL: smtp.js Missing**
```
File: /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/helpers/smtp.js
Status: ❌ NOT FOUND
Impact: Email service will fail in production
Required By:
  - index.js:24
  - helpers/mailer.js:8
```

**Recommended smtp.js Implementation:**
```javascript
const nodemailer = require("nodemailer");
const config = require("../config/config");

let transporter;

if (config.mail.sendgrid_api_key) {
  // SendGrid configuration
  transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: "apikey",
      pass: config.mail.sendgrid_api_key
    }
  });
} else {
  // Standard SMTP configuration
  transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.ssl === "true",
    auth: {
      user: config.mail.username,
      pass: config.mail.password
    }
  });
}

module.exports = transporter;
```

### 6.2 NO Test Environment

**Issue:** No test database or test environment configuration
**Impact:** Cannot run automated tests safely
**Required:**
```env
# .env.test
NODE_ENV=test
DB_HOST=localhost
DB_PORT=27017
DB_NAME=archinza-test
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 6.3 NO Test Data

**Issue:** No test users or test data in database
**Impact:** Cannot test login, profiles, etc.
**Required:**
- Test personal account
- Test business account
- Test subscription plan
- Test payment data

---

## 7. BASH SMOKE TEST SCRIPT

**File:** `/home/user/Archinza-2.0/scripts/smoke-test.sh`

```bash
#!/bin/bash
# ============================================
# Archinza 2.0 - Smoke Test Script
# Priority: Critical | Duration: 5-10 minutes
# Automation: 100%
# ============================================

set -e  # Exit on error
set -o pipefail

# ============================================
# Configuration
# ============================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Environment variables with defaults
FRONTEND_URL="${FRONTEND_URL:-https://www.archinza.com}"
ADMIN_URL="${ADMIN_URL:-https://admin.archinza.com}"
API_URL="${API_URL:-http://localhost:3020}"
TIMEOUT=10
VERBOSE=${VERBOSE:-false}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# ============================================
# Helper Functions
# ============================================

log() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
  echo -e "${GREEN}[PASS]${NC} $1"
  ((PASSED_TESTS++))
  ((TOTAL_TESTS++))
}

error() {
  echo -e "${RED}[FAIL]${NC} $1"
  ((FAILED_TESTS++))
  ((TOTAL_TESTS++))
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

skip() {
  echo -e "${YELLOW}[SKIP]${NC} $1"
  ((SKIPPED_TESTS++))
  ((TOTAL_TESTS++))
}

# Test HTTP endpoint
test_http() {
  local name=$1
  local url=$2
  local expected_code=${3:-200}
  local description=${4:-""}

  if [ "$VERBOSE" = true ]; then
    log "Testing: $name"
    log "URL: $url"
    log "Expected: HTTP $expected_code"
  fi

  # Make request with timeout
  if http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url" 2>&1); then
    if [ "$http_code" = "$expected_code" ]; then
      success "$name (HTTP $http_code)"
      return 0
    else
      error "$name - Expected HTTP $expected_code, got $http_code"
      [ -n "$description" ] && echo "  Description: $description"
      return 1
    fi
  else
    error "$name - Connection failed or timeout"
    return 1
  fi
}

# Test JSON API endpoint
test_json_api() {
  local name=$1
  local url=$2
  local expected_field=$3

  if response=$(curl -s --max-time $TIMEOUT "$url" 2>&1); then
    if echo "$response" | jq -e ".$expected_field" > /dev/null 2>&1; then
      success "$name - JSON response valid"
      return 0
    else
      error "$name - Missing field: $expected_field"
      [ "$VERBOSE" = true ] && echo "Response: $response"
      return 1
    fi
  else
    error "$name - API request failed"
    return 1
  fi
}

# ============================================
# Main Script
# ============================================

echo ""
echo "======================================="
echo "🔥 SMOKE TESTS - Archinza 2.0"
echo "======================================="
echo ""
echo "Configuration:"
echo "  Frontend: $FRONTEND_URL"
echo "  Admin:    $ADMIN_URL"
echo "  API:      $API_URL"
echo "  Timeout:  ${TIMEOUT}s"
echo ""

# ============================================
# 1. Application Accessibility
# ============================================
echo "======================================="
echo "1. APPLICATION ACCESSIBILITY"
echo "======================================="

test_http "Frontend Homepage" "$FRONTEND_URL" 200 "Main website should load"
test_http "Admin Panel" "$ADMIN_URL" 200 "Admin interface should load"
test_http "API Health Check" "$API_URL/health" 200 "API health endpoint"

echo ""

# ============================================
# 2. Database Connectivity
# ============================================
echo "======================================="
echo "2. DATABASE CONNECTIVITY"
echo "======================================="

# Check if health endpoint reports database status
if [ "$API_URL" != "" ]; then
  test_json_api "MongoDB Connection" "$API_URL/health" "services.database"
else
  skip "Database connectivity check - API URL not set"
fi

echo ""

# ============================================
# 3. Redis Connectivity
# ============================================
echo "======================================="
echo "3. REDIS CONNECTIVITY"
echo "======================================="

if [ "$API_URL" != "" ]; then
  test_json_api "Redis Connection" "$API_URL/health" "services.redis"
else
  skip "Redis connectivity check - API URL not set"
fi

echo ""

# ============================================
# 4. Critical API Endpoints
# ============================================
echo "======================================="
echo "4. CRITICAL API ENDPOINTS"
echo "======================================="

test_http "Countries API" "$API_URL/general/countries" 200 "Should return countries list"
test_http "Business Plans" "$API_URL/business-plans" 200 "Should return subscription plans"
test_http "Business Types" "$API_URL/general/business-types" 200 "Should return business types"

echo ""

# ============================================
# 5. External Services (Optional)
# ============================================
echo "======================================="
echo "5. EXTERNAL SERVICES"
echo "======================================="

# These tests require backend to expose service status
# Skipping if not available
skip "S3 connectivity check - Implement in /health endpoint"
skip "Razorpay connectivity check - Implement in /health endpoint"
skip "Email service check - Implement in /health endpoint"

echo ""

# ============================================
# 6. Automated Test Suite (if available)
# ============================================
echo "======================================="
echo "6. AUTOMATED TEST SUITE"
echo "======================================="

# Check if automated tests exist
if [ -f "$PROJECT_ROOT/node-archinza-beta/node-archinza-beta/package.json" ]; then
  cd "$PROJECT_ROOT/node-archinza-beta/node-archinza-beta"

  # Check if test:smoke script exists
  if npm run | grep -q "test:smoke"; then
    log "Running automated smoke tests..."
    if npm run test:smoke --silent; then
      success "Automated smoke test suite"
    else
      error "Automated smoke test suite failed"
    fi
  else
    skip "Automated tests - test:smoke script not configured"
  fi
else
  skip "Automated tests - package.json not found"
fi

echo ""

# ============================================
# Summary
# ============================================
echo "======================================="
echo "SMOKE TEST SUMMARY"
echo "======================================="
echo -e "Total:   $TOTAL_TESTS"
echo -e "Passed:  ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed:  ${RED}$FAILED_TESTS${NC}"
echo -e "Skipped: ${YELLOW}$SKIPPED_TESTS${NC}"
echo "======================================="
echo ""

# Calculate success rate
if [ $TOTAL_TESTS -gt 0 ]; then
  SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
  echo "Success Rate: $SUCCESS_RATE%"
else
  echo "No tests were run"
fi

echo ""

# Exit with appropriate code
if [ $FAILED_TESTS -gt 0 ]; then
  echo -e "${RED}❌ SMOKE TESTS FAILED${NC}"
  echo "🚨 Deployment should be rolled back!"
  echo ""
  exit 1
elif [ $PASSED_TESTS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  NO SMOKE TESTS RAN${NC}"
  echo "Please configure smoke tests before deployment."
  echo ""
  exit 1
else
  echo -e "${GREEN}✅ ALL SMOKE TESTS PASSED${NC}"
  echo "✨ Safe to proceed with deployment."
  echo ""
  exit 0
fi
```

**Usage:**
```bash
# Make executable
chmod +x /home/user/Archinza-2.0/scripts/smoke-test.sh

# Run locally
./scripts/smoke-test.sh

# Run with custom URLs
FRONTEND_URL=https://beta.archinza.com \
API_URL=http://localhost:3020 \
./scripts/smoke-test.sh

# Run in verbose mode
VERBOSE=true ./scripts/smoke-test.sh

# Run in CI/CD
./scripts/smoke-test.sh || exit 1
```

---

## 8. JEST CONFIGURATION

**File:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/jest.config.js`

```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'routes/**/*.js',
    'helpers/**/*.js',
    'middlewares/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/public/'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
```

**File:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/tests/setup/jest.setup.js`

```javascript
const mongoose = require('mongoose');
const redisClient = require('../../helpers/redis');

// Setup before all tests
beforeAll(async () => {
  // Connect to test database
  const testDbUrl = process.env.TEST_DB_URL || 'mongodb://localhost:27017/archinza-test';
  await mongoose.connect(testDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log('Test database connected');
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();

  // Close Redis connection
  if (redisClient && redisClient.quit) {
    await redisClient.quit();
  }

  console.log('Test cleanup complete');
});

// Clear data between test files
afterEach(async () => {
  // Optional: Clear test data after each test
  // Uncomment if needed
  // const collections = mongoose.connection.collections;
  // for (const key in collections) {
  //   await collections[key].deleteMany({});
  // }
});

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_EXPIRE_TIME = '1h';

// Mock console in tests to reduce noise
if (process.env.SILENT_TESTS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}
```

---

## 9. RECOMMENDATIONS & NEXT STEPS

### 9.1 Immediate Actions (Within 1 Week)

1. **🔴 CRITICAL: Fix Missing smtp.js**
   - Create the file immediately
   - Test email functionality
   - Verify production email sending

2. **🔴 CRITICAL: Create Health Check Endpoint**
   - Implement `/health` route
   - Test manually
   - Deploy to production

3. **🔴 CRITICAL: Install Test Dependencies**
   ```bash
   cd /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta
   npm install --save-dev jest supertest @types/jest
   ```

4. **🔴 CRITICAL: Create Basic Smoke Test**
   - Start with database and Redis tests
   - Test locally
   - Document how to run

### 9.2 Short-term Goals (Within 1 Month)

1. **Implement Full Smoke Test Suite**
   - All 5 smoke test categories
   - Automated in CI/CD
   - Running on every deployment

2. **Create Sanity Test Framework**
   - Test data management
   - 4 key sanity test scenarios
   - Documented workflow

3. **Build Regression Test Foundation**
   - Core user management tests
   - Critical journey tests
   - API endpoint tests

4. **CI/CD Integration**
   - GitHub Actions workflows
   - Automated test runs
   - Test result reporting

### 9.3 Long-term Goals (Within 3 Months)

1. **Achieve 90% Regression Test Coverage**
   - All critical paths covered
   - All API endpoints tested
   - All user journeys validated

2. **Implement Test-Driven Development**
   - Write tests before code changes
   - Require tests for all PRs
   - Track coverage trends

3. **Advanced Testing Infrastructure**
   - E2E tests with Playwright
   - Performance regression tests
   - Security testing automation

4. **Monitoring & Alerting**
   - Real-time health monitoring
   - Automated alerts on failures
   - Dashboard for test results

---

## 10. CONCLUSION

### Current State Summary
- **Smoke Testing:** 0% complete (Target: 100%)
- **Sanity Testing:** 0% complete (Target: 80%)
- **Regression Testing:** 0% complete (Target: 90%)
- **Overall Test Infrastructure:** ❌ **NOT IMPLEMENTED**

### Critical Gaps
1. No health check endpoints
2. No automated test suite
3. No CI/CD test integration
4. Missing smtp.js file
5. No test data management
6. No regression test coverage

### Impact
- **High Risk:** Deployments have no automated validation
- **No Safety Net:** Changes could break production
- **Manual Testing Required:** Slow and error-prone
- **Production Issues:** Cannot catch bugs before deployment

### Path Forward
Following the implementation roadmap in Section 5, Archinza 2.0 can achieve:
- ✅ 100% automated smoke testing
- ✅ 80% automated sanity testing
- ✅ 90% automated regression testing
- ✅ Safe, reliable deployments
- ✅ Reduced production incidents
- ✅ Faster development cycles

**Priority:** This testing infrastructure is **CRITICAL** and should be implemented before any major releases.

---

**Report Generated:** 2025-11-17
**Next Review:** After Phase 1 implementation (1 week)
**Document Version:** 1.0
