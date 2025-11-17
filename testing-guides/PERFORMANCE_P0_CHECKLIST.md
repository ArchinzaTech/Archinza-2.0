# Performance Testing - P0 Implementation Checklist

**Priority:** CRITICAL
**Timeline:** 3 days (24 hours)
**Expected Impact:** 10-15x performance improvement

---

## Day 1: Database Indexes (4 hours)

### Task 1.1: Create Index Script (30 min)
- [ ] Create `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/scripts/` directory
- [ ] Copy `create-indexes.js` script from Appendix B of main audit report
- [ ] Verify MongoDB connection string in config

### Task 1.2: Add Indexes to Models (1 hour)
- [ ] **Media Model** (`models/media.js`)
  - [ ] Add compound index: `{ userId: 1, category: 1, softDelete: 1 }`
  - [ ] Add masonry index: `{ userId: 1, masonryPosition: 1 }`
  - [ ] Add fileHash index: `{ fileHash: 1 }` (sparse)
  - [ ] Uncomment TTL index for auto-cleanup (lines 33-39)

- [ ] **BusinessAccount Model** (`models/businessAccount.js`)
  - [ ] Add username index with collation: `{ username: 1 }` (unique, case-insensitive)
  - [ ] Add email index: `{ email: 1 }`
  - [ ] Add filter index: `{ pageStatus: 1, isVerified: 1 }`
  - [ ] Add list index: `{ isDeleted: 1, createdAt: -1 }`

- [ ] **PersonalAccount Model** (`models/personalAccount.js`)
  - [ ] Add email index: `{ email: 1 }`
  - [ ] Add filter index: `{ isDeleted: 1 }`

- [ ] **BusinessUserPlan Model** (`models/businessUserPlan.js`)
  - [ ] Add lookup index: `{ businessAccount: 1, isActive: 1 }`
  - [ ] Add expiry index: `{ endDate: 1 }`

- [ ] **UserDevice Model** (`models/userDevice.js`)
  - [ ] Add device index: `{ user: 1, deviceId: 1 }`

### Task 1.3: Run Index Creation (30 min)
```bash
cd /home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta
node scripts/create-indexes.js
```

- [ ] Verify all indexes created successfully
- [ ] Check MongoDB index stats:
  ```bash
  mongo
  > use archinza
  > db.media.getIndexes()
  > db.businessaccounts.getIndexes()
  ```

### Task 1.4: Test Index Performance (1 hour)
- [ ] Run test queries to verify performance:
  ```javascript
  // In MongoDB shell
  db.media.find({ userId: ObjectId("..."), category: "workspace_media" }).explain("executionStats")
  ```
- [ ] Verify `executionStats.totalDocsExamined` matches `nReturned` (using index)
- [ ] Document before/after query times

### Task 1.5: Deploy & Verify (1 hour)
- [ ] Create migration script for production
- [ ] Test on staging environment
- [ ] Monitor query performance
- [ ] Document index sizes

**Expected Results:**
- ✅ All indexes created
- ✅ Query time: 150ms → 5ms (30x faster)
- ✅ No performance regression
- ✅ Index usage confirmed via explain()

---

## Day 2: Fix N+1 Query Problem (6 hours)

### Task 2.1: Refactor Admin User List (4 hours)

**File:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/routes/admin/content/business-users.js`

**Current Code (Lines 45-67):**
```javascript
const users = await BusinessAccount.find(query)
  .select("-password")
  .populate(["business_types"])
  .sort({ createdAt: -1 });

const usersWithMedia = await Promise.all(
  users.map(async (user) => {
    const media = await Media.find({ userId: user._id }); // N+1 PROBLEM
    // ...
  })
);
```

**Refactor Steps:**
- [ ] Replace with aggregation pipeline (see REC-P0-002 in main report)
- [ ] Add pagination support: `{ limit: 100, skip: 0 }`
- [ ] Use `$lookup` to join media in one query
- [ ] Project only required fields
- [ ] Test with 1,000 test users

**New Code:**
```javascript
const usersWithMedia = await BusinessAccount.aggregate([
  { $match: query },
  { $sort: { createdAt: -1 } },
  { $limit: parseInt(req.query.limit) || 100 },
  { $skip: parseInt(req.query.skip) || 0 },
  {
    $lookup: {
      from: 'media',
      localField: '_id',
      foreignField: 'userId',
      as: 'allMedia'
    }
  },
  // ... (see full code in REC-P0-002)
]);
```

### Task 2.2: Test Refactored Endpoint (1 hour)
- [ ] Create 1,000 test business users:
  ```javascript
  // scripts/generate-test-users.js
  for (let i = 0; i < 1000; i++) {
    await BusinessAccount.create({
      business_name: `Test Business ${i}`,
      email: `test${i}@test.com`,
      username: `testbiz${i}`,
      password: 'test123'
    });
  }
  ```
- [ ] Measure response time with 1,000 users
- [ ] Verify memory usage stays under 500MB
- [ ] Check query count (should be 1-2, not 1001)

### Task 2.3: Code Review & Testing (1 hour)
- [ ] Review aggregation pipeline logic
- [ ] Test edge cases:
  - [ ] Users with no media
  - [ ] Users with 1,000+ media files
  - [ ] Filtering by business_types
  - [ ] Filtering by status
- [ ] Verify response format matches original
- [ ] Update API documentation

**Expected Results:**
- ✅ Response time: 15s → 1.5s (10x faster)
- ✅ Query count: 1001 → 2
- ✅ Memory usage: <500MB
- ✅ No breaking changes

---

## Day 3: Implement Pagination (6 hours)

### Task 3.1: Add Pagination to Business Details Media (2 hours)

**File:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/routes/business.js`

**Lines to modify:** 268-329 (GET `/business/business-details/:id`)

**Changes:**
- [ ] Add query params: `mediaPage`, `mediaLimit`
- [ ] Convert sequential queries to parallel (use `Promise.all()`)
- [ ] Add pagination to Media.find()
- [ ] Return pagination metadata in response
- [ ] Use `.lean()` for plain objects (faster)

**Code snippet (see REC-P0-003 for full code):**
```javascript
const { mediaPage = 1, mediaLimit = 100 } = req.query;

const [data, subscriptionPlan, verificationData, mediaCount] = await Promise.all([
  BusinessAccount.findOne({ _id: req.params.id }).lean(),
  BusinessUserPlan.findOne({ businessAccount: req.params.id }).lean(),
  BusinessVerifications.findOne({ user: req.params.id }).lean(),
  Media.countDocuments({ userId: req.params.id })
]);

const allMedia = await Media.find({ userId: req.params.id })
  .limit(parseInt(mediaLimit))
  .skip((parseInt(mediaPage) - 1) * parseInt(mediaLimit))
  .lean();
```

### Task 3.2: Add Pagination to Profile Endpoint (1 hour)

**File:** `/home/user/Archinza-2.0/node-archinza-beta/node-archinza-beta/routes/business.js`

**Lines to modify:** 333-382 (GET `/business/profile/:username`)

**Changes:**
- [ ] Apply same pagination pattern as business details
- [ ] Add media count query
- [ ] Return pagination metadata
- [ ] Test with users having 1,000+ media files

### Task 3.3: Update Frontend to Handle Pagination (2 hours)

**Files to modify:**
- Frontend code that calls `/business/business-details/:id`
- Frontend code that calls `/business/profile/:username`

**Changes:**
- [ ] Add pagination state: `const [mediaPage, setMediaPage] = useState(1)`
- [ ] Implement "Load More" or pagination UI
- [ ] Update API calls to include `?mediaPage=X&mediaLimit=100`
- [ ] Handle loading states
- [ ] Test infinite scroll (if applicable)

### Task 3.4: Test Pagination (1 hour)
- [ ] Test with user having 0 media
- [ ] Test with user having 50 media (single page)
- [ ] Test with user having 500 media (5 pages)
- [ ] Test with user having 10,000 media (100 pages)
- [ ] Verify memory usage stays constant
- [ ] Test page navigation (next/prev)

**Expected Results:**
- ✅ Memory usage: 100MB → 1-5MB (95% reduction)
- ✅ Initial page load: 3-5s → 200ms
- ✅ Pagination working smoothly
- ✅ No performance degradation with large datasets

---

## Day 4: k6 Test Setup (4 hours)

### Task 4.1: Install k6 (15 min)
```bash
curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz -L | tar xvz
sudo mv k6-v0.47.0-linux-amd64/k6 /usr/local/bin/
k6 version
```

- [ ] Verify k6 installed
- [ ] Check version (should be 0.47.0+)

### Task 4.2: Create Test Directory Structure (15 min)
```bash
mkdir -p /home/user/Archinza-2.0/k6-tests/test-data
cd /home/user/Archinza-2.0/k6-tests
```

- [ ] Create directory structure
- [ ] Copy test scripts from audit report:
  - [ ] `01-api-performance.js`
  - [ ] `02-load-test.js`
  - [ ] `03-stress-test.js`
  - [ ] `04-database-query-perf.js`
  - [ ] `05-frontend-perf.js`

### Task 4.3: Generate Test Data (30 min)
- [ ] Create `test-data/generate-users.js` (from audit report)
- [ ] Run script to generate 1,000 test users:
  ```bash
  cd test-data
  node generate-users.js
  ```
- [ ] Verify `users.json` created with 1,000 entries
- [ ] Add sample test image: `test-data/sample-image.jpg`

### Task 4.4: Run Baseline Tests (2 hours)

**API Performance Test:**
```bash
cd /home/user/Archinza-2.0/k6-tests
k6 run --out json=baseline-api-perf.json 01-api-performance.js
```
- [ ] Run test
- [ ] Review results
- [ ] Document metrics:
  - [ ] p95 response time: ______ ms
  - [ ] Requests/sec: ______
  - [ ] Error rate: ______%

**Load Test:**
```bash
k6 run --out json=baseline-load.json 02-load-test.js
```
- [ ] Run test
- [ ] Monitor CPU/memory during test
- [ ] Document breaking point: ______ users

**Database Query Performance:**
```bash
k6 run --out json=baseline-db.json 04-database-query-perf.js
```
- [ ] Run test
- [ ] Identify slow queries
- [ ] Document query times

### Task 4.5: Document Baseline Metrics (1 hour)
- [ ] Create baseline report:
  ```markdown
  # Baseline Performance Metrics (Before Optimizations)

  ## API Performance
  - p95 Response Time: _____ ms
  - p99 Response Time: _____ ms
  - Requests/sec: _____
  - Error Rate: _____%

  ## Load Test
  - Max Concurrent Users: _____
  - Breaking Point: _____ users
  - CPU at Peak: _____%
  - Memory at Peak: _____ MB

  ## Database Queries
  - Simple Query (indexed): _____ ms
  - Complex Query (joins): _____ ms
  - Aggregation Query: _____ ms
  ```

---

## Day 5: Post-Optimization Testing (4 hours)

### Task 5.1: Run Post-Optimization Tests (2 hours)

**After all P0 fixes are deployed:**

```bash
cd /home/user/Archinza-2.0/k6-tests

# API Performance
k6 run --out json=post-p0-api-perf.json 01-api-performance.js

# Load Test
k6 run --out json=post-p0-load.json 02-load-test.js

# Database Performance
k6 run --out json=post-p0-db.json 04-database-query-perf.js

# Stress Test (find new breaking point)
k6 run --out json=post-p0-stress.json 03-stress-test.js
```

### Task 5.2: Compare Results (1 hour)
- [ ] Create comparison table:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| API p95 Response Time | ____ ms | ____ ms | ____x |
| Admin User List | ____ s | ____ s | ____x |
| Max Concurrent Users | ____ | ____ | ____x |
| Error Rate | ____% | ____% | ____% |
| Memory Usage | ____ MB | ____ MB | ____% |

### Task 5.3: Document & Share Results (1 hour)
- [ ] Create summary presentation
- [ ] Share with team
- [ ] Update project documentation
- [ ] Plan P1 optimizations

---

## Verification Checklist

### Database Indexes
- [ ] All indexes created in MongoDB
- [ ] Index usage confirmed via explain()
- [ ] Query time improved by 30-40x
- [ ] No performance regression

### N+1 Fixes
- [ ] Admin user list uses aggregation
- [ ] Query count: 1001 → 2
- [ ] Response time: 15s → 1.5s
- [ ] Memory usage stable

### Pagination
- [ ] Media queries paginated
- [ ] User lists paginated
- [ ] Frontend handles pagination
- [ ] Memory usage reduced by 95%

### Testing
- [ ] k6 installed and configured
- [ ] Baseline tests completed
- [ ] Post-optimization tests completed
- [ ] Results documented

### Performance Targets Met
- [ ] API p95 < 200ms ✅
- [ ] Error rate < 0.1% ✅
- [ ] Supports 1,000+ concurrent users ✅
- [ ] Admin queries < 2s ✅

---

## Rollback Plan

If any issues occur:

1. **Database Indexes:**
   - Safe to rollback, just drop indexes
   ```javascript
   db.media.dropIndex("userId_1_category_1_softDelete_1")
   ```

2. **N+1 Query Fix:**
   - Revert to previous version via git
   ```bash
   git revert <commit-hash>
   ```

3. **Pagination:**
   - Make `mediaLimit` optional, default to high number
   - Allows gradual rollout

---

## Success Criteria

### Must Have (P0)
- ✅ All database indexes created
- ✅ N+1 query eliminated
- ✅ Pagination implemented
- ✅ k6 tests running
- ✅ 10x performance improvement

### Nice to Have
- API response time < 150ms (target: 200ms)
- Support 2,000 concurrent users (target: 1,000)
- Zero downtime deployment

### Definition of Done
- All tests passing
- Performance targets met
- Code reviewed and approved
- Deployed to staging
- Monitoring in place
- Documentation updated

---

## Timeline Summary

| Day | Tasks | Hours | Status |
|-----|-------|-------|--------|
| Day 1 | Database Indexes | 4h | [ ] |
| Day 2 | Fix N+1 Queries | 6h | [ ] |
| Day 3 | Implement Pagination | 6h | [ ] |
| Day 4 | k6 Test Setup | 4h | [ ] |
| Day 5 | Validation & Testing | 4h | [ ] |
| **Total** | | **24h** | |

---

## Next Steps After P0

### Week 2-4 (P1 Priorities)
- [ ] Implement Redis caching
- [ ] Add connection pooling
- [ ] Frontend code splitting
- [ ] Async file processing with BullMQ
- [ ] Image optimization (WebP)

### Month 2 (P2 Priorities)
- [ ] CDN setup
- [ ] Response compression
- [ ] Database monitoring
- [ ] Remove duplicate dependencies
- [ ] APM setup (New Relic/Datadog)

---

**Status:** 🔴 Ready to Start
**Owner:** _____________
**Start Date:** _____________
**Target Completion:** _____________ (Day 5)
