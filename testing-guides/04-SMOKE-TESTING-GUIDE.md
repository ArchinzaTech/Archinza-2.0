# Smoke Testing Guide for Archinza 2.0

## Overview

Smoke testing is a quick validation performed after deployment to ensure critical functionality works.

**Goal:** Build validation | **Automation:** 100% | **Priority:** Critical | **Duration:** 5-10 minutes

---

## Critical Smoke Tests

### 1. Application Accessibility
```bash
# Test frontend is accessible
curl -I https://www.archinza.com
# Expected: 200 OK

# Test admin panel is accessible
curl -I https://admin.archinza.com
# Expected: 200 OK

# Test API is accessible
curl -I https://api.archinza.com/health
# Expected: 200 OK
```

### 2. Database Connectivity
```javascript
// Automated smoke test
describe('Smoke: Database', () => {
  test('should connect to MongoDB', async () => {
    const isConnected = mongoose.connection.readyState === 1;
    expect(isConnected).toBe(true);
  });

  test('should query database', async () => {
    const count = await User.countDocuments();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
```

### 3. Redis Connectivity
```javascript
test('should connect to Redis', async () => {
  await redisClient.set('smoke-test', 'ok');
  const value = await redisClient.get('smoke-test');
  expect(value).toBe('ok');
  await redisClient.del('smoke-test');
});
```

### 4. Critical User Flows
```javascript
// Login smoke test
test('should login with valid credentials', async () => {
  const response = await api.post('/auth/login', {
    email: 'smoketest@archinza.test',
    password: 'Test@123'
  });

  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
});
```

### 5. External Services
```javascript
// AWS S3
test('should access S3 bucket', async () => {
  const command = new ListObjectsCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    MaxKeys: 1
  });

  await expect(s3Client.send(command)).resolves.toBeDefined();
});

// Razorpay
test('should connect to Razorpay', async () => {
  const plans = await razorpay.plans.all();
  expect(plans).toBeDefined();
});

// Email service
test('should connect to email service', async () => {
  const info = await transporter.verify();
  expect(info).toBe(true);
});
```

---

## Smoke Test Checklist

**After Every Deployment:**
- [ ] Frontend loads without errors
- [ ] Admin panel loads without errors
- [ ] API health endpoint returns 200
- [ ] Database is accessible
- [ ] Redis is accessible
- [ ] User can login
- [ ] Critical API endpoints respond
- [ ] S3 bucket is accessible
- [ ] No console errors in browser
- [ ] No server errors in logs

---

## Automated Smoke Test Script

```bash
#!/bin/bash
# smoke-test.sh

echo "Starting smoke tests..."

# Test frontend
echo "Testing frontend..."
curl -f https://www.archinza.com || exit 1

# Test API
echo "Testing API..."
curl -f https://api.archinza.com/health || exit 1

# Run automated tests
echo "Running automated smoke tests..."
npm run test:smoke || exit 1

echo "✅ All smoke tests passed"
```

---

## CI/CD Integration

```yaml
# .github/workflows/deploy.yml
- name: Run Smoke Tests
  run: |
    npm run test:smoke
  timeout-minutes: 5
```

---

## Summary

Smoke testing provides quick confidence that deployment was successful and critical systems are operational.
