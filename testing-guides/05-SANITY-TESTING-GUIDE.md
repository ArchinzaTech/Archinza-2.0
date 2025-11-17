# Sanity Testing Guide for Archinza 2.0

## Overview

Sanity testing verifies specific functionality after bug fixes or minor changes.

**Duration:** 15-30 minutes | **Automation:** 80% | **Priority:** High

---

## When to Perform Sanity Testing

- After a bug fix
- After a minor code change
- Before full regression testing
- After a hotfix deployment

---

## Sanity Test Scenarios

### Scenario 1: After Login Bug Fix

```javascript
describe('Sanity: Login Fix Verification', () => {
  test('should login with correct credentials', async () => {
    const response = await api.post('/auth/login', {
      email: 'test@example.com',
      password: 'Test@123'
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test('should reject incorrect password', async () => {
    const response = await api.post('/auth/login', {
      email: 'test@example.com',
      password: 'WrongPassword'
    });

    expect(response.status).toBe(401);
  });
});
```

### Scenario 2: After Payment Processing Fix

- ✅ Create subscription
- ✅ Process payment
- ✅ Verify webhook received
- ✅ Check subscription status updated
- ✅ Verify invoice generated

### Scenario 3: After Profile Update Fix

- ✅ Update profile information
- ✅ Verify changes saved
- ✅ Verify changes display correctly
- ✅ Check related data updated

---

## Sanity vs Smoke Testing

| Aspect | Smoke | Sanity |
|--------|-------|--------|
| Scope | Broad | Narrow |
| When | After build | After change |
| Focus | Critical paths | Specific functionality |
| Duration | 5-10 min | 15-30 min |

---

## Summary

Sanity testing provides quick validation that specific fixes or changes work correctly.
