# Express.js Guide for Archinza 2.0

## Table of Contents
1. [Overview](#overview)
2. [Version & Setup](#version--setup)
3. [Project Structure](#project-structure)
4. [Core Concepts](#core-concepts)
5. [Routing](#routing)
6. [Middleware](#middleware)
7. [Request & Response Handling](#request--response-handling)
8. [Error Handling](#error-handling)
9. [Security](#security)
10. [Session Management](#session-management)
11. [File Uploads](#file-uploads)
12. [API Documentation](#api-documentation)
13. [Best Practices](#best-practices)
14. [Common Patterns in Archinza](#common-patterns-in-archinza)
15. [Troubleshooting](#troubleshooting)

---

## Overview

Express.js is the backend web framework powering the Archinza 2.0 REST API. It provides a robust set of features for web and mobile applications, handling HTTP requests, middleware, routing, and more.

### Where Express is Used

**Backend API Server** (`node-archinza-beta/`)
- Version: Express 4.17.1
- Purpose: RESTful API for all frontend applications
- Port: 3020 (configurable)
- Main File: `index.js` (207 lines)

---

## Version & Setup

### Installation

```json
{
  "express": "^4.17.1",
  "express-session": "^1.17.3",
  "express-async-handler": "^1.2.0"
}
```

### Basic Setup

```bash
cd node-archinza-beta/node-archinza-beta
npm install
npm start
```

### Main Server File (`index.js`)

```javascript
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./helpers/db');

const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://www.archinza.com',
    'https://admin.archinza.com'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/personal', require('./routes/personal'));
app.use('/business', require('./routes/business'));
app.use('/admin', require('./routes/admin'));

// Error handling middleware
app.use(require('./middlewares/errorHandler'));

// Start server
const PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Project Structure

```
node-archinza-beta/
├── index.js                 # Main server file (207 lines)
├── routes/                  # Route handlers (145 JS files)
│   ├── auth.js             # Authentication routes
│   ├── personal.js         # Personal account routes
│   ├── business.js         # Business account routes (44KB)
│   ├── admin/              # Admin routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── roles.js
│   │   ├── feedbacks.js
│   │   ├── content/
│   │   ├── mailchimp/
│   │   └── logs.js
│   ├── ai/                 # AI service routes
│   ├── bot/                # Bot API routes
│   ├── razorpay/           # Payment webhooks
│   ├── googleApi.js        # Google services integration
│   ├── forms.js            # Form management
│   ├── services.js         # Service management
│   ├── stats.js            # Statistics
│   └── business-plans.js   # Subscription plans
├── middlewares/            # Express middleware
│   ├── auth.js            # JWT authentication
│   ├── roleAuth.js        # Role-based authorization
│   ├── botAuth.js         # Bot API authentication
│   ├── aiAuth.js          # AI service authentication
│   ├── upload.js          # File upload handling
│   ├── errorHandler.js    # Global error handler
│   └── apiLogger.js       # Request logging
├── models/                # Mongoose models (50+ files)
├── helpers/               # Utility functions
│   ├── api.js            # API helpers
│   ├── db.js             # Database connection
│   ├── mailer.js         # Email sending
│   └── redis.js          # Redis client
├── jobs/                 # Background jobs
├── logger/               # Winston loggers
├── email-templates/      # Email templates
└── config/
    └── config.js         # Environment configuration
```

---

## Core Concepts

### 1. Application Instance

```javascript
const express = require('express');
const app = express();

// app is the main Express application instance
```

### 2. Middleware Stack

Middleware functions are executed in sequence:

```javascript
app.use(middleware1);  // Executed first
app.use(middleware2);  // Executed second
app.use(middleware3);  // Executed third
```

### 3. Request-Response Cycle

```javascript
app.get('/api/users', (req, res) => {
  // req = incoming request object
  // res = outgoing response object
  res.json({ users: [] });
});
```

### 4. HTTP Methods

```javascript
app.get('/resource', handler);      // GET - Retrieve
app.post('/resource', handler);     // POST - Create
app.put('/resource/:id', handler);  // PUT - Update (full)
app.patch('/resource/:id', handler);// PATCH - Update (partial)
app.delete('/resource/:id', handler); // DELETE - Remove
```

---

## Routing

### 1. Basic Routes

```javascript
// Simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route with parameter
app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ userId });
});

// Route with query parameters
app.get('/search', (req, res) => {
  const { query, page, limit } = req.query;
  res.json({ query, page, limit });
});
```

### 2. Router Modules

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// Middleware specific to this router
router.use(authMiddleware);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

// index.js
app.use('/api/users', require('./routes/users'));
```

### 3. Route Organization in Archinza

```javascript
// Main routes
app.use('/general', require('./routes/general'));
app.use('/auth', require('./routes/auth'));
app.use('/personal', require('./routes/personal'));
app.use('/business', require('./routes/business'));
app.use('/services', require('./routes/services'));
app.use('/options', require('./routes/options'));

// Admin routes
app.use('/admin/auth', require('./routes/admin/auth'));
app.use('/admin/users', require('./routes/admin/users'));
app.use('/admin/roles', require('./routes/admin/roles'));
app.use('/admin/feedbacks', require('./routes/admin/feedbacks'));

// API routes
app.use('/ai', require('./routes/ai'));
app.use('/bot', require('./routes/bot'));
app.use('/google-api', require('./routes/googleApi'));
app.use('/razorpay', require('./routes/razorpay'));
```

### 4. Route Parameters

```javascript
// Single parameter
app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
});

// Optional parameter (using ?)
app.get('/users/:userId/posts/:postId?', (req, res) => {
  const { userId, postId } = req.params;
  // postId may be undefined
});

// Pattern matching
app.get('/files/:filename(*)', (req, res) => {
  // Matches any path after /files/
});
```

---

## Middleware

### 1. Built-in Middleware

```javascript
// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));
```

### 2. Third-Party Middleware

```javascript
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://www.archinza.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// HTTP request logger
app.use(morgan('combined'));

// Cookie parser
app.use(cookieParser());
```

### 3. Custom Middleware

```javascript
// Logger middleware
const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next(); // Pass control to next middleware
};

app.use(requestLogger);

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Use on specific routes
app.get('/protected', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

### 4. Middleware in Archinza

#### Authentication Middleware (`middlewares/auth.js`)

```javascript
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const auth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.userId = decoded.userId;
      req.userType = decoded.userType;

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = auth;
```

#### Role-based Authorization (`middlewares/roleAuth.js`)

```javascript
const roleAuth = (requiredPermission) => {
  return asyncHandler(async (req, res, next) => {
    const user = await Admin.findById(req.userId).populate('role');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const hasPermission = user.role.permissions.includes(requiredPermission);

    if (!hasPermission) {
      res.status(403);
      throw new Error('Forbidden: Insufficient permissions');
    }

    next();
  });
};

module.exports = roleAuth;
```

#### File Upload Middleware (`middlewares/upload.js`)

```javascript
const multer = require('multer');

// Memory storage for direct upload to S3
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

module.exports = upload;
```

#### API Logger (`middlewares/apiLogger.js`)

```javascript
const apiLogger = require('../logger/apiLogger');

const logRequest = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    apiLogger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });

  next();
};

module.exports = logRequest;
```

---

## Request & Response Handling

### 1. Request Object (`req`)

```javascript
app.post('/api/users', (req, res) => {
  // Request body (parsed by express.json())
  const { name, email } = req.body;

  // URL parameters
  const { userId } = req.params;

  // Query string parameters
  const { page, limit } = req.query;

  // Headers
  const token = req.headers.authorization;
  const contentType = req.get('Content-Type');

  // Cookies
  const sessionId = req.cookies.sessionId;

  // IP address
  const ip = req.ip;

  // HTTP method
  const method = req.method;

  // Full URL
  const url = req.originalUrl;
});
```

### 2. Response Object (`res`)

```javascript
app.get('/api/users', (req, res) => {
  // Send JSON
  res.json({ users: [] });

  // Send text
  res.send('Hello World');

  // Send status code with JSON
  res.status(201).json({ message: 'Created' });

  // Redirect
  res.redirect('/login');

  // Set headers
  res.set('Content-Type', 'application/json');
  res.setHeader('X-Custom-Header', 'value');

  // Send file
  res.sendFile('/path/to/file.pdf');

  // Download file
  res.download('/path/to/file.pdf', 'filename.pdf');

  // Set cookie
  res.cookie('token', 'abc123', {
    httpOnly: true,
    maxAge: 86400000
  });

  // Clear cookie
  res.clearCookie('token');
});
```

### 3. Common Response Patterns in Archinza

```javascript
// Success response
res.status(200).json({
  success: true,
  data: result,
  message: 'Operation successful'
});

// Created response
res.status(201).json({
  success: true,
  data: newUser,
  message: 'User created successfully'
});

// Error response
res.status(400).json({
  success: false,
  error: 'Validation failed',
  details: validationErrors
});

// Unauthorized
res.status(401).json({
  success: false,
  error: 'Authentication required'
});

// Forbidden
res.status(403).json({
  success: false,
  error: 'Insufficient permissions'
});

// Not found
res.status(404).json({
  success: false,
  error: 'Resource not found'
});

// Server error
res.status(500).json({
  success: false,
  error: 'Internal server error'
});
```

---

## Error Handling

### 1. Try-Catch with Async/Await

```javascript
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
```

### 2. Express Async Handler

```javascript
const asyncHandler = require('express-async-handler');

// Automatically catches errors and passes to error handler
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

app.get('/api/users/:id', getUser);
```

### 3. Global Error Handler

```javascript
// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;

// index.js (must be last middleware)
app.use(errorHandler);
```

### 4. Custom Error Classes

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

// Usage
if (!user) {
  throw new NotFoundError('User not found');
}

// Error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message,
    type: err.name
  });
};
```

---

## Security

### 1. CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://www.archinza.com',
      'https://admin.archinza.com',
      'https://beta.archinza.com'
    ];

    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. Helmet (Security Headers)

```javascript
const helmet = require('helmet');

app.use(helmet());
// Adds various HTTP headers for security
```

### 3. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts'
});

app.use('/auth/login', authLimiter);
```

### 4. Input Sanitization

```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());
```

### 5. Environment Variables

```javascript
require('dotenv').config();

// Never expose secrets
const jwtSecret = process.env.JWT_SECRET;
const dbPassword = process.env.DB_PASS;
```

---

## Session Management

### 1. Express Session with Redis

```javascript
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

// Create Redis client
const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_ACCESS_TOKEN
});

redisClient.connect();

// Configure session
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));
```

### 2. Session Usage

```javascript
// Set session data
app.post('/login', (req, res) => {
  req.session.userId = user._id;
  req.session.isAuthenticated = true;
  res.json({ message: 'Logged in' });
});

// Access session data
app.get('/profile', (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({ userId: req.session.userId });
});

// Destroy session
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});
```

---

## File Uploads

### 1. Single File Upload

```javascript
const upload = require('./middlewares/upload');

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // File details
  console.log('Filename:', file.originalname);
  console.log('Size:', file.size);
  console.log('Mimetype:', file.mimetype);
  console.log('Buffer:', file.buffer);

  // Upload to S3
  const s3Url = await uploadToS3(file);

  res.json({ url: s3Url });
});
```

### 2. Multiple Files Upload

```javascript
app.post('/upload-multiple', upload.array('files', 5), async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const urls = await Promise.all(
    files.map(file => uploadToS3(file))
  );

  res.json({ urls });
});
```

### 3. Upload with Form Data

```javascript
app.post('/profile', upload.single('avatar'), async (req, res) => {
  const { name, email } = req.body;
  const avatar = req.file;

  let avatarUrl = null;
  if (avatar) {
    avatarUrl = await uploadToS3(avatar);
  }

  const user = await User.create({
    name,
    email,
    avatar: avatarUrl
  });

  res.status(201).json(user);
});
```

---

## API Documentation

### Example Route Documentation

```javascript
/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only)
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10)
 * @returns {Array} Array of user objects
 */
router.get('/', auth, roleAuth('read_users'), asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .select('-password');

  const total = await User.countDocuments();

  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));
```

---

## Best Practices

### 1. Use Router Modules

```javascript
// ✅ Good: Separate route files
// routes/users.js
const router = express.Router();
router.get('/', getAllUsers);
module.exports = router;

// ❌ Bad: All routes in one file
app.get('/users', ...);
app.get('/posts', ...);
app.get('/comments', ...);
```

### 2. Use Async Handlers

```javascript
// ✅ Good: Express async handler
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// ❌ Bad: Unhandled promise rejection
app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});
```

### 3. Validate Input

```javascript
const Joi = require('joi');

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    age: Joi.number().min(18).required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

app.post('/users', validateUser, createUser);
```

### 4. Use Environment Variables

```javascript
// ✅ Good
const port = process.env.PORT || 3020;
const dbUrl = process.env.DB_URL;

// ❌ Bad: Hardcoded values
const port = 3020;
const dbUrl = 'mongodb://localhost/mydb';
```

### 5. Proper Error Handling

```javascript
// ✅ Good: Specific error handling
if (!user) {
  return res.status(404).json({ error: 'User not found' });
}

// ❌ Bad: Generic errors
if (!user) {
  res.send('Error');
}
```

---

## Common Patterns in Archinza

### 1. Protected Route Pattern

```javascript
const auth = require('./middlewares/auth');
const roleAuth = require('./middlewares/roleAuth');

// Admin-only route
router.get('/admin/users',
  auth,
  roleAuth('read_users'),
  getAllUsers
);

// User-specific route
router.get('/personal/profile',
  auth,
  getUserProfile
);
```

### 2. Pagination Pattern

```javascript
const getPaginatedResults = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const results = await Model.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Model.countDocuments();

  res.json({
    success: true,
    data: results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});
```

### 3. File Upload with S3 Pattern

```javascript
const upload = require('./middlewares/upload');
const { uploadToS3 } = require('./helpers/s3');

router.post('/upload',
  auth,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    const file = req.file;

    const s3Result = await uploadToS3({
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname
    });

    const media = await Media.create({
      url: s3Result.Location,
      type: file.mimetype,
      size: file.size,
      uploadedBy: req.userId
    });

    res.status(201).json({
      success: true,
      data: media
    });
  })
);
```

---

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure origin is in allowed list
   - Check credentials: true is set
   - Verify preflight OPTIONS requests

2. **Session Not Persisting**
   - Check Redis connection
   - Verify session secret is set
   - Ensure cookies are enabled

3. **File Upload Fails**
   - Check file size limits
   - Verify mime type filtering
   - Check S3 credentials

4. **Routes Not Working**
   - Check route order (more specific first)
   - Verify middleware execution
   - Check for errors in previous middleware

5. **Memory Leaks**
   - Close database connections
   - Clean up event listeners
   - Monitor with `process.memoryUsage()`

---

## Additional Resources

- [Express.js Official Docs](https://expressjs.com)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## Summary

Express.js provides the foundation for Archinza's REST API, offering:
- **Robust routing** for organizing endpoints
- **Flexible middleware** for request processing
- **Built-in features** for common web tasks
- **Performance** and scalability
- **Large ecosystem** of compatible packages

The combination of Express with MongoDB, Redis, and various cloud services creates a powerful, production-ready backend architecture.
