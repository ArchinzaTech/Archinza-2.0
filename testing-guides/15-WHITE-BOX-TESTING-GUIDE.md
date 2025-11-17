# White Box Testing Guide for Archinza 2.0

## Overview

White box testing tests internal code structure, logic, and paths.

**Perspective:** Developer | **Automation:** 70% | **Priority:** High

---

## White Box Techniques

### 1. Statement Coverage

**Goal:** Execute every line of code at least once

```javascript
function validateAge(age) {
  if (age < 18) {
    return 'Too young';
  }
  return 'Valid';
}

// Tests to achieve 100% statement coverage
test('age below 18', () => {
  expect(validateAge(17)).toBe('Too young'); // Covers if block
});

test('age 18 or above', () => {
  expect(validateAge(18)).toBe('Valid'); // Covers return statement
});
```

### 2. Branch Coverage

**Goal:** Test every decision path (true and false)

```javascript
function processPayment(amount, hasDiscount) {
  let finalAmount = amount;
  
  if (hasDiscount) { // Branch 1
    finalAmount = amount * 0.9;
  }
  
  if (finalAmount > 1000) { // Branch 2
    return 'High value';
  } else {
    return 'Normal';
  }
}

// Test all branches
test('with discount, high value', () => {
  expect(processPayment(1200, true)).toBe('High value');
});

test('with discount, normal value', () => {
  expect(processPayment(500, true)).toBe('Normal');
});

test('no discount, high value', () => {
  expect(processPayment(1200, false)).toBe('High value');
});

test('no discount, normal value', () => {
  expect(processPayment(500, false)).toBe('Normal');
});
```

### 3. Path Coverage

**Goal:** Test every possible path through the code

```javascript
function calculateDiscount(user, amount) {
  let discount = 0;
  
  if (user.isPro) {
    discount += 10;
  }
  
  if (amount > 1000) {
    discount += 5;
  }
  
  return discount;
}

// Paths:
// 1. Not pro, amount <= 1000 → 0
// 2. Not pro, amount > 1000 → 5
// 3. Is pro, amount <= 1000 → 10
// 4. Is pro, amount > 1000 → 15

test('path 1', () => {
  expect(calculateDiscount({ isPro: false }, 500)).toBe(0);
});

test('path 2', () => {
  expect(calculateDiscount({ isPro: false }, 1500)).toBe(5);
});

test('path 3', () => {
  expect(calculateDiscount({ isPro: true }, 500)).toBe(10);
});

test('path 4', () => {
  expect(calculateDiscount({ isPro: true }, 1500)).toBe(15);
});
```

### 4. Condition Coverage

**Goal:** Test each boolean sub-expression

```javascript
function canAccessFeature(user, subscription) {
  if ((user.isVerified && subscription.isActive) || user.isAdmin) {
    return true;
  }
  return false;
}

// Test all condition combinations
test('verified + active subscription', () => {
  expect(canAccessFeature(
    { isVerified: true, isAdmin: false },
    { isActive: true }
  )).toBe(true);
});

test('verified but inactive subscription', () => {
  expect(canAccessFeature(
    { isVerified: true, isAdmin: false },
    { isActive: false }
  )).toBe(false);
});

test('admin user bypasses verification', () => {
  expect(canAccessFeature(
    { isVerified: false, isAdmin: true },
    { isActive: false }
  )).toBe(true);
});
```

---

## Code Coverage Metrics

### Viewing Coverage

```bash
# Run tests with coverage
npm test -- --coverage

# Open coverage report
open coverage/lcov-report/index.html
```

### Coverage Thresholds

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80
  }
}
```

---

## Testing Complex Logic

### Example: Subscription Pricing Logic

```javascript
// helpers/pricing.js
function calculateSubscriptionPrice(plan, duration, coupon) {
  let basePrice = plan.monthlyPrice * duration;
  
  // Annual discount
  if (duration === 12) {
    basePrice *= 0.85; // 15% off
  }
  
  // Coupon discount
  if (coupon) {
    if (coupon.type === 'percentage') {
      basePrice *= (1 - coupon.value / 100);
    } else if (coupon.type === 'fixed') {
      basePrice -= coupon.value;
    }
  }
  
  // Minimum price
  if (basePrice < 100) {
    basePrice = 100;
  }
  
  return Math.round(basePrice);
}

// White box tests covering all paths
describe('Subscription Pricing - White Box', () => {
  const plan = { monthlyPrice: 100 };

  test('1 month, no coupon', () => {
    expect(calculateSubscriptionPrice(plan, 1, null)).toBe(100);
  });

  test('12 months, annual discount', () => {
    expect(calculateSubscriptionPrice(plan, 12, null)).toBe(1020);
  });

  test('percentage coupon', () => {
    expect(calculateSubscriptionPrice(plan, 1, { type: 'percentage', value: 10 })).toBe(90);
  });

  test('fixed coupon', () => {
    expect(calculateSubscriptionPrice(plan, 1, { type: 'fixed', value: 20 })).toBe(80);
  });

  test('minimum price enforced', () => {
    expect(calculateSubscriptionPrice(plan, 1, { type: 'fixed', value: 150 })).toBe(100);
  });
});
```

---

## Summary

White box testing ensures Archinza's internal logic is correct by testing all code paths and conditions.
