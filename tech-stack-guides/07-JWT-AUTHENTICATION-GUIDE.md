# JWT Authentication Guide for Archinza 2.0

## Overview

JSON Web Tokens (JWT) provide stateless authentication for Archinza's REST API, allowing secure user identification across requests without maintaining server-side sessions.

**Version:** jsonwebtoken ^8.5.1

---

## Setup

```bash
npm install jsonwebtoken
```

```env
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE_TIME=86400 # 24 hours in seconds
```

---

## Token Generation

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId, userType = 'personal') => {
  const payload = {
    userId,
    userType, // 'personal', 'business', 'admin', 'ai', 'bot'
    iat: Math.floor(Date.now() / 1000)
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE_TIME || '24h' }
  );

  return token;
};

// Usage in login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user._id, 'personal');

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});
```

---

## Token Verification Middleware

```javascript
// middlewares/auth.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const auth = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.userId = decoded.userId;
    req.userType = decoded.userType;

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

module.exports = auth;
```

---

## Token Decoding (Client-side)

```javascript
// Frontend: Decode token without verification
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem('token');
const decoded = jwtDecode(token);

console.log('User ID:', decoded.userId);
console.log('Expires at:', new Date(decoded.exp * 1000));

// Check if token expired
const isExpired = decoded.exp * 1000 < Date.now();
```

---

## Protected Routes

```javascript
const auth = require('./middlewares/auth');

// Protected route - requires authentication
router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ user });
});

// Admin-only route
router.get('/admin/users', auth, roleAuth('admin'), async (req, res) => {
  const users = await User.find();
  res.json({ users });
});
```

---

## Refresh Tokens (Optional)

```javascript
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newToken = generateToken(decoded.userId);

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
```

---

## Best Practices

### 1. Never Store Secrets in Code

```javascript
// ✅ Good
const secret = process.env.JWT_SECRET;

// ❌ Bad
const secret = 'hardcoded_secret';
```

### 2. Set Appropriate Expiration

```javascript
// Short-lived tokens (1 hour)
{ expiresIn: '1h' }

// Medium-lived (24 hours) - Archinza uses this
{ expiresIn: '24h' }

// Long-lived (7 days)
{ expiresIn: '7d' }
```

### 3. Include Minimal Data in Payload

```javascript
// ✅ Good: Only essential data
{ userId, userType }

// ❌ Bad: Sensitive data
{ userId, password, creditCard }
```

### 4. Always Verify on Server

```javascript
// ✅ Good: Verify signature
jwt.verify(token, secret);

// ❌ Bad: Just decode
jwt.decode(token); // No verification!
```

---

## Archinza Patterns

### 1. Multiple User Types

```javascript
// Personal user login
const personalToken = generateToken(user._id, 'personal');

// Business user login
const businessToken = generateToken(business._id, 'business');

// Admin login
const adminToken = generateToken(admin._id, 'admin');

// AI service auth
const aiToken = generateToken(aiUser._id, 'ai');

// Bot auth
const botToken = generateToken(botUser._id, 'bot');
```

### 2. Type-specific Middleware

```javascript
// middlewares/aiAuth.js
const aiAuth = asyncHandler(async (req, res, next) => {
  // ... verify token ...

  if (decoded.userType !== 'ai') {
    res.status(403);
    throw new Error('Access denied');
  }

  next();
});

// Route
router.get('/ai/content', aiAuth, getContent);
```

---

## Summary

JWT in Archinza provides:
- **Stateless authentication** - No server-side session storage
- **Scalability** - Easy horizontal scaling
- **Multiple user types** - Personal, business, admin, AI, bot
- **Secure** - Signature verification
- **24-hour expiration** - Configurable token lifetime
