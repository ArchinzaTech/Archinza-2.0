# Load Testing Guide for Archinza 2.0

## Overview

Load testing validates system performance under expected user load.

**Goal:** Verify performance under normal load | **Automation:** 100% | **Priority:** Critical

---

## Tools Setup

```bash
# Install k6 (recommended)
brew install k6  # macOS
# or
curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz -L | tar xvz

# Install Artillery (alternative)
npm install -g artillery
```

---

## Load Test Scenarios

### 1. API Load Test (k6)

```javascript
// loadtests/api-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],  // 95% of requests < 200ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function () {
  // Test login endpoint
  const loginRes = http.post('https://api.archinza.com/auth/login', JSON.stringify({
    email: 'loadtest@archinza.test',
    password: 'Test@123'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'login has token': (r) => r.json('token') !== undefined,
  });

  const token = loginRes.json('token');

  // Test protected endpoint
  const profileRes = http.get('https://api.archinza.com/personal/profile', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(profileRes, {
    'profile status 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

### 2. Frontend Load Test

```javascript
// loadtests/frontend-load.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 500 },   // 500 concurrent users
    { duration: '10m', target: 1000 }, // 1000 concurrent users
    { duration: '5m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],  // Page load < 3s
  },
};

export default function () {
  const responses = http.batch([
    ['GET', 'https://www.archinza.com/', null, { tags: { name: 'HomePage' } }],
    ['GET', 'https://www.archinza.com/login', null, { tags: { name: 'LoginPage' } }],
    ['GET', 'https://www.archinza.com/register', null, { tags: { name: 'RegisterPage' } }],
  ]);

  check(responses[0], {
    'homepage loads': (r) => r.status === 200,
  });
}
```

### 3. Database Load Test

```javascript
// loadtests/database-load.js
export default function () {
  const params = {
    headers: { 'Authorization': `Bearer ${__ENV.TEST_TOKEN}` },
  };

  // Heavy query - list all users
  const res1 = http.get('https://api.archinza.com/admin/users?limit=100', params);
  check(res1, { 'query successful': (r) => r.status === 200 });

  // Write operation - create business
  const res2 = http.post('https://api.archinza.com/business/register', JSON.stringify({
    name: `Test Business ${__VU}`,
    email: `business${__VU}@test.com`,
    phone: `987654${__VU}`,
  }), { headers: { 'Content-Type': 'application/json', ...params.headers } });

  check(res2, { 'create successful': (r) => r.status === 201 });
}
```

---

## Running Load Tests

```bash
# Run k6 test
k6 run loadtests/api-load.js

# Run with custom options
k6 run --vus 100 --duration 30s loadtests/api-load.js

# Output results to file
k6 run --out json=results.json loadtests/api-load.js

# Run with environment variables
k6 run -e TEST_TOKEN=xyz loadtests/database-load.js
```

---

## Performance Targets

### API Response Times
```
p50 (median): < 100ms
p95: < 200ms
p99: < 500ms
```

### Frontend Page Load
```
First Contentful Paint (FCP): < 1.5s
Largest Contentful Paint (LCP): < 2.5s
Time to Interactive (TTI): < 3.5s
```

### Concurrent Users
```
Target: 1,000 concurrent users
Peak: 2,000 concurrent users
```

### Throughput
```
Minimum: 100 requests/second
Target: 500 requests/second
```

### Error Rate
```
Maximum acceptable: 0.1% (1 in 1000 requests)
```

---

## Monitoring During Load Test

```bash
# Monitor server resources
htop

# Monitor database
mongo --eval "db.currentOp()"

# Monitor Redis
redis-cli INFO stats

# Monitor API logs
tail -f logs/api.log

# Monitor error rate
tail -f logs/error.log | wc -l
```

---

## Analyzing Results

```bash
# k6 generates summary automatically
# Key metrics to check:
# - http_req_duration (avg, p95, p99)
# - http_req_failed (error rate)
# - iterations (completed requests)
# - data_received / data_sent

# Example output:
#   http_req_duration..............: avg=150ms p(95)=200ms p(99)=450ms
#   http_req_failed................: 0.05% (50 of 100000)
#   iterations.....................: 100000
```

---

## Best Practices

1. **Start Small** - Gradually increase load
2. **Test in Staging** - Never load test production
3. **Monitor Everything** - CPU, memory, database, network
4. **Test Realistic Scenarios** - Mimic actual user behavior
5. **Test at Peak Times** - Consider time zones

---

## Summary

Load testing ensures Archinza can handle expected traffic volumes while maintaining acceptable performance levels.
