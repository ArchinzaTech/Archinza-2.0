# Single User Performance Testing Guide for Archinza 2.0

## Overview

Single user performance testing measures response time and efficiency for individual user actions.

**Focus:** Individual user experience | **Automation:** 80% | **Priority:** Medium

---

## Performance Metrics

### Target Response Times

| Action | Target | Good | Acceptable | Poor |
|--------|--------|------|------------|------|
| Page Load | < 2s | < 1s | 2-3s | > 3s |
| API Call | < 200ms | < 100ms | 200-500ms | > 500ms |
| Form Submit | < 1s | < 500ms | 1-2s | > 2s |
| File Upload (1MB) | < 3s | < 2s | 3-5s | > 5s |
| Search Query | < 500ms | < 200ms | 500ms-1s | > 1s |

---

## Test Scenarios

### 1. Page Load Performance

```javascript
// Using Lighthouse
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function testPageLoad(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const result = await lighthouse(url, {
    port: chrome.port,
    onlyCategories: ['performance']
  });

  await chrome.kill();

  const { lcp, fcp, tti, tbt } = result.lhr.audits;
  
  console.log('LCP:', lcp.numericValue); // < 2500ms
  console.log('FCP:', fcp.numericValue); // < 1800ms
  console.log('TTI:', tti.numericValue); // < 3800ms
  console.log('TBT:', tbt.numericValue); // < 300ms
}

testPageLoad('https://www.archinza.com');
```

### 2. API Response Time

```javascript
// Using k6 for single user
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1, // Single virtual user
  iterations: 10 // Run 10 times
};

export default function () {
  const start = Date.now();
  
  const res = http.get('https://api.archinza.com/personal/profile', {
    headers: { 'Authorization': 'Bearer token' }
  });
  
  const duration = Date.now() - start;
  
  check(res, {
    'status 200': (r) => r.status === 200,
    'response < 200ms': (r) => r.timings.duration < 200,
  });
  
  console.log(`Request took ${duration}ms`);
}
```

### 3. Form Submission Performance

```javascript
describe('Performance: Form Submission', () => {
  test('login should complete in < 1 second', async () => {
    const start = Date.now();
    
    const response = await api.post('/auth/login', {
      email: 'test@example.com',
      password: 'Test@123'
    });
    
    const duration = Date.now() - start;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(1000); // < 1 second
  });
});
```

### 4. Database Query Performance

```javascript
describe('Performance: Database Queries', () => {
  test('user profile query should be < 100ms', async () => {
    const userId = 'test-user-id';
    
    const start = Date.now();
    const user = await User.findById(userId);
    const duration = Date.now() - start;
    
    expect(user).toBeDefined();
    expect(duration).toBeLessThan(100);
  });

  test('complex business query should be < 200ms', async () => {
    const start = Date.now();
    
    const businesses = await Business.find({ isVerified: true })
      .populate('businessType')
      .limit(20);
    
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(200);
  });
});
```

### 5. File Upload Performance

```javascript
test('1MB file upload should complete in < 3 seconds', async () => {
  const file = createMockFile(1024 * 1024); // 1MB
  
  const start = Date.now();
  
  const response = await request(app)
    .post('/upload')
    .attach('file', file.buffer, file.originalname)
    .set('Authorization', `Bearer ${token}`);
  
  const duration = Date.now() - start;
  
  expect(response.status).toBe(200);
  expect(duration).toBeLessThan(3000);
});
```

---

## Frontend Performance Testing

### React Component Render Time

```javascript
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
  
  // Expect render time < 16ms (60fps)
  expect(actualDuration).toBeLessThan(16);
}

function App() {
  return (
    <Profiler id="Dashboard" onRender={onRenderCallback}>
      <Dashboard />
    </Profiler>
  );
}
```

---

## Monitoring Tools

### Browser DevTools
- Network panel - API response times
- Performance panel - Page load timeline
- Lighthouse - Overall performance score

### Backend Monitoring
```javascript
// Add timing to API routes
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
    
    if (duration > 500) {
      console.warn('Slow request detected!');
    }
  });
  
  next();
});
```

---

## Performance Testing Checklist

- [ ] Home page loads in < 2s
- [ ] Login completes in < 1s
- [ ] Dashboard loads in < 2s
- [ ] API calls respond in < 200ms
- [ ] Database queries complete in < 100ms
- [ ] File uploads complete in < 3s (per MB)
- [ ] Search results appear in < 500ms
- [ ] Form validation is instant (< 50ms)

---

## Summary

Single user performance testing ensures each Archinza user has a fast, responsive experience.
