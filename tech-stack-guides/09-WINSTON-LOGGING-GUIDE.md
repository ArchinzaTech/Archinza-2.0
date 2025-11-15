# Winston Logging Guide for Archinza 2.0

## Overview

Winston is the primary logging framework for Archinza, providing structured logging with multiple transports including file storage and AWS CloudWatch integration.

**Versions:**
- winston: ^3.8.2
- winston-daily-rotate-file: ^5.0.0
- @aws-sdk/client-cloudwatch-logs: ^3.863.0

---

## Basic Setup

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

module.exports = logger;
```

---

## Log Levels

```javascript
logger.error('Critical error occurred');   // 0
logger.warn('Warning message');             // 1
logger.info('Information message');         // 2
logger.http('HTTP request');                // 3
logger.verbose('Verbose message');          // 4
logger.debug('Debug information');          // 5
logger.silly('Silly information');          // 6
```

---

## Daily Rotate File Transport

```javascript
const winston = require('winston');
require('winston-daily-rotate-file');

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

const logger = winston.createLogger({
  transports: [fileRotateTransport]
});
```

---

## CloudWatch Transport (Archinza)

```javascript
// logger/cloudwatch-transport.js
const { CloudWatchLogsClient, CreateLogStreamCommand, PutLogEventsCommand } = require('@aws-sdk/client-cloudwatch-logs');
const Transport = require('winston-transport');

class CloudWatchTransport extends Transport {
  constructor(opts) {
    super(opts);

    this.client = new CloudWatchLogsClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    this.logGroupName = opts.logGroupName;
    this.logStreamName = opts.logStreamName;
  }

  async log(info, callback) {
    const params = {
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
      logEvents: [{
        message: JSON.stringify(info),
        timestamp: Date.now()
      }]
    };

    try {
      await this.client.send(new PutLogEventsCommand(params));
      callback();
    } catch (error) {
      console.error('CloudWatch logging error:', error);
      callback(error);
    }
  }
}

module.exports = CloudWatchTransport;
```

---

## Production Logger Setup

```javascript
// logger/cloudwatch_prod_logger.js
const winston = require('winston');
const CloudWatchTransport = require('./cloudwatch-transport');

const prodLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new CloudWatchTransport({
      logGroupName: process.env.CLOUDWATCH_LOG_GROUP_NAME_PROD,
      logStreamName: process.env.CLOUDWATCH_LOG_STREAM_NAME
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    })
  ]
});

module.exports = prodLogger;
```

---

## Development Logger

```javascript
// logger/index.js
const winston = require('winston');

const devLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = devLogger;
```

---

## Specialized Loggers in Archinza

### 1. API Logger

```javascript
// logger/apiLogger.js
const winston = require('winston');

const apiLogger = winston.createLogger({
  level: 'http',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/api.log' })
  ]
});

// Middleware
const logRequest = (req, res, next) => {
  apiLogger.http({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  next();
};

module.exports = { apiLogger, logRequest };
```

### 2. Razorpay Logger

```javascript
// logger/razorpayLogger.js
const winston = require('winston');

const razorpayLogger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'logs/razorpay.log' })
  ]
});

// Usage
razorpayLogger.info({
  event: 'subscription.activated',
  subscriptionId: 'sub_xyz123',
  timestamp: new Date()
});
```

### 3. AI Service Logger

```javascript
// logger/aiApiLogger.js
const winston = require('winston');

const aiLogger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'logs/ai-api.log' })
  ]
});

module.exports = aiLogger;
```

---

## Usage Patterns

### 1. Error Logging

```javascript
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', {
    error: error.message,
    stack: error.stack,
    userId: req.userId
  });

  res.status(500).json({ error: 'Internal server error' });
}
```

### 2. Info Logging

```javascript
logger.info('User registered', {
  userId: user._id,
  email: user.email,
  timestamp: new Date()
});
```

### 3. HTTP Request Logging

```javascript
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.http({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });

  next();
});
```

---

## Best Practices

### 1. Structure Your Logs

```javascript
// ✅ Good: Structured data
logger.info('Payment processed', {
  paymentId: 'pay_123',
  amount: 999,
  userId: 'user_456',
  timestamp: new Date()
});

// ❌ Bad: Unstructured string
logger.info('Payment pay_123 processed for user user_456');
```

### 2. Use Appropriate Levels

```javascript
logger.error('Database connection failed');    // Critical
logger.warn('Deprecated API endpoint used');   // Warning
logger.info('User logged in');                 // Info
logger.debug('Query executed: SELECT * FROM'); // Debug
```

### 3. Don't Log Sensitive Data

```javascript
// ✅ Good
logger.info('User login attempt', { email: user.email });

// ❌ Bad: Logs password
logger.info('User login', { email, password });
```

### 4. Include Context

```javascript
logger.error('Payment failed', {
  error: error.message,
  userId: req.userId,
  paymentId: payment.id,
  amount: payment.amount,
  timestamp: new Date()
});
```

---

## Environment-Based Logging

```javascript
// config/logger.js
const prodLogger = require('./logger/cloudwatch_prod_logger');
const devLogger = require('./logger/index');

const logger = process.env.NODE_ENV === 'production'
  ? prodLogger
  : devLogger;

module.exports = logger;

// Usage
const logger = require('./config/logger');
logger.info('Application started');
```

---

## Summary

Winston logging in Archinza provides:
- **Structured logging** - JSON format for easy parsing
- **Multiple transports** - Files, console, CloudWatch
- **Daily rotation** - Automatic log file rotation
- **Specialized loggers** - API, Razorpay, AI service logs
- **Production monitoring** - CloudWatch integration for AWS
- **Development debugging** - Colorized console output
