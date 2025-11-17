# Integration Testing Guide for Archinza 2.0

## Overview

Integration testing validates that different modules, services, and components work together correctly.

**Goal:** 20% of total test suite | **Automation:** 90% | **Priority:** Critical

---

## Tools & Setup

```bash
npm install --save-dev supertest chai chai-http
npm install --save-dev mongodb-memory-server ioredis-mock
```

---

## API Integration Testing

### 1. Testing Authentication Flow

```javascript
// routes/auth.test.js
const request = require('supertest');
const app = require('../index');
const User = require('../models/PersonalAccount');

describe('POST /auth/register', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should register new user and return token', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '9876543210',
      password: 'Test@123'
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('john@example.com');

    // Verify user was created in database
    const user = await User.findOne({ email: 'john@example.com' });
    expect(user).toBeDefined();
  });

  test('should not register duplicate email', async () => {
    const userData = {
      firstName: 'John',
      email: 'john@example.com',
      phone: '9876543210',
      password: 'Test@123'
    };

    // First registration
    await request(app).post('/auth/register').send(userData);

    // Second registration with same email
    const response = await request(app)
      .post('/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toMatch(/already exists/i);
  });
});

describe('POST /auth/login', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      firstName: 'John',
      email: 'john@example.com',
      phone: '9876543210',
      password: await bcrypt.hash('Test@123', 10)
    });
  });

  test('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: 'Test@123'
      })
      .expect(200);

    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('john@example.com');
  });

  test('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: 'WrongPassword'
      })
      .expect(401);

    expect(response.body.error).toMatch(/invalid credentials/i);
  });
});
```

### 2. Testing Protected Routes

```javascript
describe('GET /personal/profile', () => {
  let token;
  let user;

  beforeEach(async () => {
    user = await User.create({
      firstName: 'John',
      email: 'john@example.com',
      phone: '9876543210',
      password: 'hashedPassword'
    });

    token = jwt.sign(
      { userId: user._id, userType: 'personal' },
      process.env.JWT_SECRET
    );
  });

  test('should get user profile with valid token', async () => {
    const response = await request(app)
      .get('/personal/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.user.email).toBe('john@example.com');
  });

  test('should return 401 without token', async () => {
    await request(app)
      .get('/personal/profile')
      .expect(401);
  });
});
```

### 3. Testing Database + API Integration

```javascript
describe('Business Account Management', () => {
  let adminToken;

  beforeEach(async () => {
    const admin = await Admin.create({
      email: 'admin@archinza.com',
      password: 'hashedPassword',
      role: 'admin'
    });

    adminToken = jwt.sign(
      { userId: admin._id, userType: 'admin' },
      process.env.JWT_SECRET
    );
  });

  test('should create business account with all relationships', async () => {
    const businessData = {
      name: 'Test Business',
      email: 'business@example.com',
      phone: '9876543210',
      businessType: 'Retail',
      address: {
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    };

    const response = await request(app)
      .post('/business/register')
      .send(businessData)
      .expect(201);

    const businessId = response.body.business._id;

    // Verify business was created
    const business = await Business.findById(businessId)
      .populate('businessType');

    expect(business).toBeDefined();
    expect(business.name).toBe('Test Business');
    expect(business.businessType).toBeDefined();
  });
});
```

---

## Service Integration Testing

### 1. Email Service Integration

```javascript
describe('Email Service Integration', () => {
  test('should send welcome email after registration', async () => {
    const emailSpy = jest.spyOn(mailer, 'sendEmail');

    await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        email: 'john@example.com',
        phone: '9876543210',
        password: 'Test@123'
      });

    // Wait for async email job
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(emailSpy).toHaveBeenCalledWith(
      'john@example.com',
      expect.stringContaining('Welcome'),
      expect.any(String)
    );
  });
});
```

### 2. Payment Gateway Integration (Razorpay)

```javascript
describe('Razorpay Integration', () => {
  test('should create subscription with Razorpay', async () => {
    const mockRazorpay = {
      subscriptions: {
        create: jest.fn().mockResolvedValue({
          id: 'sub_test123',
          status: 'created'
        })
      }
    };

    jest.mock('razorpay', () => jest.fn(() => mockRazorpay));

    const response = await request(app)
      .post('/business-plans/subscribe')
      .set('Authorization', `Bearer ${businessToken}`)
      .send({ planId: 'plan_basic' })
      .expect(200);

    expect(response.body.subscriptionId).toBe('sub_test123');

    // Verify subscription stored in database
    const subscription = await BusinessUserPlan.findOne({
      subscriptionId: 'sub_test123'
    });

    expect(subscription).toBeDefined();
  });
});
```

### 3. File Upload Integration (S3)

```javascript
describe('S3 Upload Integration', () => {
  test('should upload file to S3 and save metadata', async () => {
    const mockS3Upload = jest.fn().mockResolvedValue({
      Location: 'https://s3.amazonaws.com/bucket/file.jpg'
    });

    const response = await request(app)
      .post('/upload')
      .set('Authorization', `Bearer ${userToken}`)
      .attach('file', './tests/fixtures/test-image.jpg')
      .expect(200);

    expect(response.body.url).toMatch(/s3\.amazonaws\.com/);

    // Verify Media record created
    const media = await Media.findOne({ url: response.body.url });
    expect(media).toBeDefined();
  });
});
```

---

## Redis + Session Integration

```javascript
describe('Session Management', () => {
  test('should store session in Redis', async () => {
    const redis = require('ioredis-mock');
    const redisClient = new redis();

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: 'Test@123'
      });

    const sessionId = response.headers['set-cookie'][0]
      .split('=')[1]
      .split(';')[0];

    const session = await redisClient.get(`sess:${sessionId}`);
    expect(session).toBeDefined();
  });
});
```

---

## Database Transaction Testing

```javascript
describe('Multi-document Transactions', () => {
  test('should rollback on error', async () => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create user
      await User.create([{ email: 'test@example.com' }], { session });

      // Simulate error
      throw new Error('Simulated error');

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }

    // User should not exist
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeNull();
  });
});
```

---

## External API Integration

```javascript
describe('Google Places API Integration', () => {
  test('should fetch place details', async () => {
    const response = await request(app)
      .get('/google-api/place-details')
      .query({ placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4' })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.name).toBeDefined();
    expect(response.body.address).toBeDefined();
  });
});
```

---

## Test Execution

```bash
# Run integration tests
npm run test:integration

# Run specific integration test
npm test -- routes/auth.test.js

# Run with coverage
npm run test:integration -- --coverage
```

---

## Best Practices

1. **Use Test Database** - Never test against production
2. **Clean Up After Tests** - Reset database state
3. **Mock External Services** - Use test/sandbox modes
4. **Test Happy & Sad Paths** - Success and failure scenarios
5. **Test Data Consistency** - Verify database state changes

---

## Summary

Integration testing ensures Archinza's components work together:
- API routes + Database
- Services + External APIs
- Authentication + Authorization
- File uploads + Cloud storage
- Payment processing + Webhooks
