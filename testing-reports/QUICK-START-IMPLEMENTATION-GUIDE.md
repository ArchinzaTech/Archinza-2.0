# Quick Start: Implementing Smoke, Sanity & Regression Tests

**Get testing infrastructure running in 1 hour**

---

## Step 1: Fix Critical Issue (5 minutes)

### Create Missing smtp.js File

```bash
cd /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/helpers
cat > smtp.js << 'EOF'
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
EOF
```

---

## Step 2: Create Health Check Endpoint (10 minutes)

### Create health.js Route

```bash
cd /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/routes
cat > health.js << 'EOF'
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const redisClient = require("../helpers/redis");

router.get("/", async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: "OK",
    services: {
      database: "unknown",
      redis: "unknown"
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
EOF
```

### Update index.js

```bash
cd /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta

# Add health route after line 114 (after /general)
sed -i '114 a app.use("/health", require("./routes/health"));' index.js

# Verify it was added
grep -n "health" index.js
```

### Test Health Endpoint

```bash
# Start the server (in one terminal)
npm start

# Test endpoint (in another terminal)
curl http://localhost:3020/health
```

Expected response:
```json
{
  "uptime": 123.456,
  "timestamp": 1700000000000,
  "status": "OK",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

---

## Step 3: Install Test Dependencies (5 minutes)

```bash
cd /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta

# Install test dependencies
npm install --save-dev jest supertest @types/jest

# Verify installation
npm list jest supertest
```

---

## Step 4: Create Test Directory Structure (5 minutes)

```bash
cd /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta

# Create test directories
mkdir -p tests/{smoke,sanity,regression,integration,fixtures,setup}

# Create scripts directory
mkdir -p ../../scripts

# Verify structure
tree tests -L 1
```

---

## Step 5: Create Jest Configuration (5 minutes)

```bash
cd /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta

cat > jest.config.js << 'EOF'
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
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  clearMocks: true
};
EOF
```

---

## Step 6: Create Jest Setup File (5 minutes)

```bash
cd /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/tests/setup

cat > jest.setup.js << 'EOF'
const mongoose = require('mongoose');
const redisClient = require('../../helpers/redis');

beforeAll(async () => {
  const testDbUrl = process.env.TEST_DB_URL || 'mongodb://localhost:27017/archinza-test';
  await mongoose.connect(testDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Test database connected');
});

afterAll(async () => {
  await mongoose.connection.close();
  if (redisClient && redisClient.quit) {
    await redisClient.quit();
  }
  console.log('Test cleanup complete');
});

process.env.NODE_ENV = 'test';
process.env.JWT_EXPIRE_TIME = '1h';
EOF
```

---

## Step 7: Create First Smoke Test (10 minutes)

```bash
cd /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/tests/smoke

cat > smoke.test.js << 'EOF'
const request = require("supertest");
const mongoose = require("mongoose");
const redisClient = require("../../helpers/redis");

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

  describe("4. Critical API Endpoints", () => {
    test("should return countries list", async () => {
      const response = await request(API_URL).get("/general/countries");
      expect([200, 304]).toContain(response.status);
    });

    test("should return business plans", async () => {
      const response = await request(API_URL).get("/business-plans");
      expect([200, 304]).toContain(response.status);
    });
  });
});
EOF
```

---

## Step 8: Update package.json Scripts (5 minutes)

```bash
cd /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta

# Backup current package.json
cp package.json package.json.backup

# Update test scripts (manually edit package.json)
# Change line 9 from:
#   "test": "echo \"Error: no test specified\" && exit 1"
# To:
#   "test": "jest",
#   "test:smoke": "jest --testPathPattern=tests/smoke --maxWorkers=1",
#   "test:sanity": "jest --testPathPattern=tests/sanity --maxWorkers=1",
#   "test:regression": "jest --testPathPattern=tests/regression",
#   "test:watch": "jest --watch"
```

Use this sed command to update automatically:
```bash
sed -i '9s/.*/    "test": "jest",\n    "test:smoke": "jest --testPathPattern=tests\/smoke --maxWorkers=1",\n    "test:sanity": "jest --testPathPattern=tests\/sanity --maxWorkers=1",\n    "test:regression": "jest --testPathPattern=tests\/regression",\n    "test:watch": "jest --watch"/' package.json
```

---

## Step 9: Run Your First Smoke Test (5 minutes)

```bash
cd /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta

# Make sure server is running
# In another terminal: npm start

# Run smoke tests
npm run test:smoke
```

Expected output:
```
PASS  tests/smoke/smoke.test.js
  Smoke Tests - Critical Systems
    1. Application Accessibility
      ✓ API health endpoint should return 200
    2. Database Connectivity
      ✓ should be connected to MongoDB
      ✓ should query database successfully
    3. Redis Connectivity
      ✓ should connect to Redis
      ✓ should set and get values
    4. Critical API Endpoints
      ✓ should return countries list
      ✓ should return business plans

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

---

## Step 10: Create Bash Smoke Test Script (10 minutes)

```bash
cd /home/user/Archinza-2.0/scripts

cat > smoke-test.sh << 'EOF'
#!/bin/bash
set -e

echo "🔥 SMOKE TESTS - Archinza 2.0"
echo "======================================"

FRONTEND_URL="${FRONTEND_URL:-https://www.archinza.com}"
ADMIN_URL="${ADMIN_URL:-https://admin.archinza.com}"
API_URL="${API_URL:-http://localhost:3020}"

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

test_endpoint() {
  local name=$1
  local url=$2
  echo -n "Testing $name... "
  if curl -sf --max-time 10 "$url" > /dev/null; then
    echo -e "${GREEN}✓ PASS${NC}"
    return 0
  else
    echo -e "${RED}✗ FAIL${NC}"
    return 1
  fi
}

echo ""
echo "1. APPLICATION ACCESSIBILITY"
test_endpoint "Frontend" "$FRONTEND_URL"
test_endpoint "Admin Panel" "$ADMIN_URL"
test_endpoint "API Health" "$API_URL/health"

echo ""
echo "2. CRITICAL API ENDPOINTS"
test_endpoint "Countries API" "$API_URL/general/countries"
test_endpoint "Business Plans" "$API_URL/business-plans"

echo ""
echo -e "${GREEN}✅ ALL SMOKE TESTS PASSED${NC}"
EOF

chmod +x smoke-test.sh
```

### Test the script:

```bash
cd /home/user/Archinza-2.0/scripts
./smoke-test.sh
```

---

## Verification Checklist

After completing all steps, verify:

- [ ] smtp.js file exists in helpers/
- [ ] Health endpoint returns 200: `curl http://localhost:3020/health`
- [ ] Jest installed: `npm list jest`
- [ ] Test directories created: `ls tests/`
- [ ] Jest config exists: `ls jest.config.js`
- [ ] Smoke test exists: `ls tests/smoke/smoke.test.js`
- [ ] Tests pass: `npm run test:smoke`
- [ ] Bash script works: `./scripts/smoke-test.sh`

---

## Next Steps

### Immediate:
1. Review full audit report at:
   `/home/user/Archinza-2.0/testing-reports/SMOKE-SANITY-REGRESSION-TESTING-AUDIT.md`

2. Review quick summary at:
   `/home/user/Archinza-2.0/testing-reports/SMOKE-SANITY-REGRESSION-QUICK-SUMMARY.md`

### This Week:
3. Create sanity test scenarios (see full report Section 2.2)
4. Create test data management (see full report Section 2.4)
5. Set up CI/CD integration (see full report Section 4)

### This Month:
6. Build regression test suite (see full report Section 3)
7. Add coverage reporting
8. Automate all tests in CI/CD

---

## Troubleshooting

### Tests fail to connect to database:
```bash
# Make sure MongoDB is running
sudo systemctl status mongodb
# Or use test database URL
TEST_DB_URL=mongodb://localhost:27017/archinza-test npm run test:smoke
```

### Tests fail to connect to Redis:
```bash
# Make sure Redis is running
sudo systemctl status redis
# Or specify Redis host
REDIS_HOST=localhost REDIS_PORT=6379 npm run test:smoke
```

### Health endpoint returns 503:
Check that both MongoDB and Redis are running and configured correctly.

---

## Success Criteria

You've successfully implemented smoke testing when:
- ✅ Health endpoint returns 200
- ✅ All smoke tests pass
- ✅ Bash smoke script runs without errors
- ✅ Tests can run in CI/CD

**Time to Complete: ~1 hour**
**Next Phase: Sanity Tests (Week 2)**

---

**Need Help?**
- Review testing guides: `/home/user/Archinza-2.0/testing-guides/`
- Check full audit report for detailed implementation
- Follow implementation roadmap in Section 5
