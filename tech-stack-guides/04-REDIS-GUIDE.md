# Redis Guide for Archinza 2.0

## Table of Contents
1. [Overview](#overview)
2. [Version & Setup](#version--setup)
3. [Connection](#connection)
4. [Data Types & Operations](#data-types--operations)
5. [Session Management](#session-management)
6. [Caching Strategies](#caching-strategies)
7. [Common Use Cases](#common-use-cases)
8. [Best Practices](#best-practices)
9. [Patterns in Archinza](#patterns-in-archinza)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Redis (Remote Dictionary Server) is an in-memory data structure store used as a database, cache, and message broker in Archinza 2.0.

### Key Features
- **In-memory storage** - Ultra-fast read/write operations
- **Data persistence** - Optional disk snapshots
- **Multiple data types** - Strings, hashes, lists, sets, sorted sets
- **Pub/Sub messaging** - Real-time communication
- **TTL support** - Automatic expiration

### Archinza Use Cases
1. **Session storage** - User sessions via Express Session
2. **Caching** - API responses, database query results
3. **Rate limiting** - Request throttling
4. **Queue management** - With BullMQ

---

## Version & Setup

### Versions

```json
{
  "redis": "^5.8.0",
  "ioredis": "^5.6.1",
  "connect-redis": "^7.1.1"
}
```

### Installation

```bash
npm install redis ioredis connect-redis
```

### Redis Server

```bash
# Install Redis (Ubuntu/Debian)
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis

# Check status
sudo systemctl status redis

# Connect via CLI
redis-cli
```

---

## Connection

### Basic Redis Connection

```javascript
const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_ACCESS_TOKEN
});

client.on('connect', () => {
  console.log('Redis connected');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

// Connect
await client.connect();

module.exports = client;
```

### IORedis Connection (Archinza uses this)

```javascript
// helpers/redis.js
const Redis = require('ioredis');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_ACCESS_TOKEN,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redisClient;
```

### Environment Variables

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_ACCESS_TOKEN=your_redis_password
```

---

## Data Types & Operations

### 1. Strings

```javascript
// Set
await client.set('key', 'value');
await client.set('user:1000', 'John Doe');

// Get
const value = await client.get('key');

// Set with expiration (seconds)
await client.setex('session:abc123', 3600, 'sessionData');
await client.set('key', 'value', 'EX', 3600);

// Set if not exists
await client.setnx('key', 'value');

// Increment
await client.incr('counter');
await client.incrby('counter', 5);

// Decrement
await client.decr('counter');
await client.decrby('counter', 3);

// Delete
await client.del('key');

// Multiple operations
await client.mset('key1', 'value1', 'key2', 'value2');
const values = await client.mget('key1', 'key2');
```

### 2. Hashes (Objects)

```javascript
// Set hash field
await client.hset('user:1000', 'name', 'John Doe');
await client.hset('user:1000', 'email', 'john@example.com');

// Set multiple fields
await client.hmset('user:1000', {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

// Get hash field
const name = await client.hget('user:1000', 'name');

// Get all fields
const user = await client.hgetall('user:1000');
// Returns: { name: 'John Doe', email: 'john@example.com', age: '30' }

// Check if field exists
const exists = await client.hexists('user:1000', 'name');

// Delete field
await client.hdel('user:1000', 'age');

// Get all keys
const keys = await client.hkeys('user:1000');

// Get all values
const values = await client.hvals('user:1000');

// Increment hash field
await client.hincrby('user:1000', 'loginCount', 1);
```

### 3. Lists

```javascript
// Push to list (left/right)
await client.lpush('queue', 'item1');
await client.rpush('queue', 'item2');

// Pop from list
const item = await client.lpop('queue');
const item = await client.rpop('queue');

// Get list range
const items = await client.lrange('queue', 0, -1); // All items
const items = await client.lrange('queue', 0, 9);  // First 10

// List length
const length = await client.llen('queue');

// Remove items
await client.lrem('queue', 0, 'item1'); // Remove all occurrences

// Trim list
await client.ltrim('queue', 0, 99); // Keep first 100 items
```

### 4. Sets

```javascript
// Add to set
await client.sadd('tags', 'javascript', 'nodejs', 'redis');

// Check membership
const isMember = await client.sismember('tags', 'nodejs');

// Get all members
const members = await client.smembers('tags');

// Remove from set
await client.srem('tags', 'redis');

// Set size
const size = await client.scard('tags');

// Set operations
await client.sunion('set1', 'set2'); // Union
await client.sinter('set1', 'set2'); // Intersection
await client.sdiff('set1', 'set2');  // Difference
```

### 5. Sorted Sets (with scores)

```javascript
// Add with score
await client.zadd('leaderboard', 100, 'player1');
await client.zadd('leaderboard', 200, 'player2');

// Get by rank (ascending)
const top = await client.zrange('leaderboard', 0, 9);

// Get by rank (descending)
const top = await client.zrevrange('leaderboard', 0, 9);

// Get with scores
const top = await client.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// Get score
const score = await client.zscore('leaderboard', 'player1');

// Increment score
await client.zincrby('leaderboard', 10, 'player1');

// Get rank
const rank = await client.zrank('leaderboard', 'player1');
const rank = await client.zrevrank('leaderboard', 'player1');

// Remove
await client.zrem('leaderboard', 'player1');

// Get by score range
const players = await client.zrangebyscore('leaderboard', 100, 200);
```

---

## Session Management

### Express Session with Redis

```javascript
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redisClient = require('./helpers/redis');

app.use(session({
  store: new RedisStore({
    client: redisClient,
    prefix: 'sess:' // Key prefix in Redis
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // 1 day in milliseconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));
```

### Session Storage Format

```
Redis key: sess:abc123def456
Value: {
  "cookie": {
    "maxAge": 86400000,
    "httpOnly": true
  },
  "userId": "507f1f77bcf86cd799439011",
  "isAuthenticated": true
}
```

### Manual Session Operations

```javascript
// Store session data
await redisClient.setex(
  `sess:${sessionId}`,
  86400, // 1 day
  JSON.stringify({
    userId: user._id,
    isAuthenticated: true
  })
);

// Get session data
const sessionData = await redisClient.get(`sess:${sessionId}`);
const session = JSON.parse(sessionData);

// Delete session
await redisClient.del(`sess:${sessionId}`);
```

---

## Caching Strategies

### 1. Cache-Aside (Lazy Loading)

```javascript
const getUser = async (userId) => {
  const cacheKey = `user:${userId}`;

  // Try cache first
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log('Cache hit');
    return JSON.parse(cached);
  }

  // Cache miss - fetch from database
  console.log('Cache miss');
  const user = await User.findById(userId);

  if (user) {
    // Store in cache for 1 hour
    await redisClient.setex(cacheKey, 3600, JSON.stringify(user));
  }

  return user;
};
```

### 2. Write-Through Cache

```javascript
const updateUser = async (userId, updates) => {
  // Update database
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });

  // Update cache
  const cacheKey = `user:${userId}`;
  await redisClient.setex(cacheKey, 3600, JSON.stringify(user));

  return user;
};
```

### 3. Cache Invalidation

```javascript
const deleteUser = async (userId) => {
  // Delete from database
  await User.findByIdAndDelete(userId);

  // Invalidate cache
  await redisClient.del(`user:${userId}`);

  // Invalidate related caches
  await redisClient.del(`user:${userId}:posts`);
  await redisClient.del(`user:${userId}:profile`);
};
```

### 4. TTL (Time-To-Live)

```javascript
// Set with TTL
await redisClient.setex('temp:data', 300, 'value'); // 5 minutes

// Get TTL
const ttl = await redisClient.ttl('temp:data'); // Returns seconds

// Set TTL on existing key
await redisClient.expire('key', 3600); // 1 hour
```

---

## Common Use Cases

### 1. API Response Caching

```javascript
const getCachedData = async (req, res) => {
  const cacheKey = `api:${req.originalUrl}`;

  // Check cache
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Fetch fresh data
  const data = await fetchDataFromDB();

  // Cache for 5 minutes
  await redisClient.setex(cacheKey, 300, JSON.stringify(data));

  res.json(data);
};
```

### 2. Rate Limiting

```javascript
const rateLimit = async (req, res, next) => {
  const ip = req.ip;
  const key = `rate:${ip}`;

  const current = await redisClient.incr(key);

  if (current === 1) {
    // First request, set expiration
    await redisClient.expire(key, 60); // 1 minute window
  }

  if (current > 100) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  next();
};
```

### 3. Distributed Locking

```javascript
const acquireLock = async (lockKey, timeout = 10) => {
  const lockValue = Date.now() + timeout * 1000;

  const acquired = await redisClient.setnx(lockKey, lockValue);

  if (acquired) {
    await redisClient.expire(lockKey, timeout);
    return true;
  }

  return false;
};

const releaseLock = async (lockKey) => {
  await redisClient.del(lockKey);
};

// Usage
const processOrder = async (orderId) => {
  const lockKey = `lock:order:${orderId}`;

  if (await acquireLock(lockKey, 30)) {
    try {
      // Process order
      await performOrderOperation(orderId);
    } finally {
      await releaseLock(lockKey);
    }
  } else {
    throw new Error('Order is being processed');
  }
};
```

### 4. Real-time Leaderboard

```javascript
// Add score
const addScore = async (userId, score) => {
  await redisClient.zadd('leaderboard', score, userId);
};

// Get top 10
const getTopPlayers = async () => {
  const players = await redisClient.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

  const results = [];
  for (let i = 0; i < players.length; i += 2) {
    results.push({
      userId: players[i],
      score: parseInt(players[i + 1])
    });
  }

  return results;
};

// Get user rank
const getUserRank = async (userId) => {
  const rank = await redisClient.zrevrank('leaderboard', userId);
  return rank + 1; // Rank is 0-indexed
};
```

### 5. Job Queue (with BullMQ)

```javascript
const { Queue } = require('bullmq');

const emailQueue = new Queue('emails', {
  connection: redisClient
});

// Add job
await emailQueue.add('sendWelcome', {
  email: 'user@example.com',
  name: 'John Doe'
});

// Add with delay
await emailQueue.add('reminder', { userId }, {
  delay: 86400000 // 1 day
});
```

---

## Best Practices

### 1. Key Naming Convention

```javascript
// ✅ Good: Hierarchical structure
'user:1000:profile'
'session:abc123'
'cache:api:users:page:1'
'rate:192.168.1.1'

// ❌ Bad: Unclear naming
'u1000'
's123'
'data'
```

### 2. Set Expiration

```javascript
// ✅ Good: Always set TTL for cache
await redisClient.setex('cache:data', 3600, data);

// ❌ Bad: No expiration (memory leak risk)
await redisClient.set('cache:data', data);
```

### 3. Use Pipelines for Bulk Operations

```javascript
// ✅ Good: Pipeline (single round-trip)
const pipeline = redisClient.pipeline();
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.set('key3', 'value3');
await pipeline.exec();

// ❌ Bad: Multiple round-trips
await redisClient.set('key1', 'value1');
await redisClient.set('key2', 'value2');
await redisClient.set('key3', 'value3');
```

### 4. Handle Errors Gracefully

```javascript
const getCachedData = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis error:', error);
    // Fall back to database
    return await fetchFromDB();
  }
};
```

### 5. Monitor Memory Usage

```javascript
// Get memory info
const info = await redisClient.info('memory');

// Set max memory policy (in redis.conf)
// maxmemory 256mb
// maxmemory-policy allkeys-lru
```

---

## Patterns in Archinza

### 1. Pincode Caching

```javascript
// helpers/pincodeCache.js
const redisClient = require('./redis');

const getPincodeData = async (pincode) => {
  const cacheKey = `pincode:${pincode}`;

  // Check cache
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch from database
  const data = await Pincode.findOne({ pincode });

  if (data) {
    // Cache for 24 hours (pincodes don't change often)
    await redisClient.setex(cacheKey, 86400, JSON.stringify(data));
  }

  return data;
};
```

### 2. Session Storage

```javascript
// Session stored in Redis with connect-redis
// Key: sess:xyz123
// Value: { userId, isAuthenticated, ... }
// TTL: 86400 seconds (1 day)

// Automatic cleanup when user logs out
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    // Redis key automatically deleted
    res.json({ message: 'Logged out' });
  });
});
```

### 3. API Response Caching

```javascript
const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    const cached = await redisClient.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Modify res.json to cache response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      redisClient.setex(key, duration, JSON.stringify(data));
      return originalJson(data);
    };

    next();
  };
};

// Usage
app.get('/api/stats', cacheMiddleware(300), getStats);
```

---

## Troubleshooting

### Common Issues

1. **Connection Refused**
   ```bash
   # Check if Redis is running
   sudo systemctl status redis

   # Start Redis
   sudo systemctl start redis
   ```

2. **Authentication Failed**
   ```javascript
   // Check password in .env
   REDIS_ACCESS_TOKEN=correct_password
   ```

3. **Memory Issues**
   ```bash
   # Check memory usage
   redis-cli info memory

   # Set max memory in redis.conf
   maxmemory 256mb
   maxmemory-policy allkeys-lru
   ```

4. **Keys Not Expiring**
   ```javascript
   // Always set TTL
   await redisClient.setex('key', ttl, value);

   // Check TTL
   const ttl = await redisClient.ttl('key');
   ```

5. **Connection Timeouts**
   ```javascript
   // Increase retry strategy
   const client = new Redis({
     retryStrategy: (times) => {
       return Math.min(times * 100, 3000);
     }
   });
   ```

---

## Redis CLI Commands

```bash
# Connect
redis-cli

# Test connection
PING
# Returns: PONG

# Set/Get
SET key "value"
GET key

# List all keys
KEYS *

# Get key type
TYPE key

# Delete key
DEL key

# Check if key exists
EXISTS key

# Get TTL
TTL key

# Clear all data (use with caution!)
FLUSHALL

# Monitor commands
MONITOR

# Get info
INFO
INFO memory
INFO stats
```

---

## Additional Resources

- [Redis Official Docs](https://redis.io/docs/)
- [IORedis Documentation](https://github.com/luin/ioredis)
- [Redis Command Reference](https://redis.io/commands/)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)

---

## Summary

Redis in Archinza provides:
- **Ultra-fast caching** - In-memory data access
- **Session storage** - Persistent user sessions
- **Rate limiting** - Request throttling
- **Queue management** - Background job processing
- **High availability** - With proper configuration
- **Scalability** - Horizontal scaling support
