# Black Box Testing Guide for Archinza 2.0

## Overview

Black box testing tests functionality without knowledge of internal code structure.

**Perspective:** External user | **Automation:** 50% | **Priority:** Medium

---

## Principles

Test based on:
- Requirements and specifications
- User perspective
- Expected inputs and outputs
- **NOT** internal code logic

---

## Black Box Techniques

### 1. Equivalence Partitioning

**Example: Email Validation**

Valid partitions:
- `user@domain.com` (standard email)
- `user.name@domain.co.uk` (with dot and multi-level domain)

Invalid partitions:
- `userdomain.com` (no @)
- `@domain.com` (no local part)
- `user@` (no domain)

```javascript
describe('Email Validation - Black Box', () => {
  // Test one value from each partition
  test('valid standard email', () => {
    expect(isValidEmail('user@domain.com')).toBe(true);
  });

  test('invalid email without @', () => {
    expect(isValidEmail('userdomain.com')).toBe(false);
  });
});
```

### 2. Boundary Value Analysis

**Example: Phone Number (must be 10 digits)**

Test boundaries:
- 9 digits (just below min) - Invalid
- 10 digits (minimum valid) - Valid
- 11 digits (just above max) - Invalid

```javascript
test('phone with 9 digits - invalid', () => {
  expect(isValidPhone('987654321')).toBe(false);
});

test('phone with 10 digits - valid', () => {
  expect(isValidPhone('9876543210')).toBe(true);
});

test('phone with 11 digits - invalid', () => {
  expect(isValidPhone('98765432101')).toBe(false);
});
```

### 3. Decision Table Testing

**Example: User Access Permissions**

| User Type | Subscription | Can Upload | Can Subscribe | Admin Access |
|-----------|--------------|------------|---------------|--------------|
| Personal | None | No | Yes | No |
| Personal | Pro | Yes | Yes | No |
| Business | Basic | Yes | Yes | No |
| Admin | N/A | Yes | N/A | Yes |

### 4. State Transition Testing

**Example: Subscription States**

```
Created → Payment Pending → Active → Cancelled
                          ↓
                       Expired
```

Test all transitions:
- Created → Payment Pending ✅
- Payment Pending → Active ✅
- Active → Cancelled ✅
- Active → Expired ✅

---

## Black Box Test Cases

### User Registration
```
Input: firstName="John", email="john@test.com", phone="9876543210", password="Test@123"
Expected Output: User created, OTP sent, redirect to verification page

Input: firstName="", email="invalid", phone="123", password="weak"
Expected Output: Validation errors displayed, user not created
```

### Payment Processing
```
Input: planId="basic", paymentMethod="card"
Expected Output: Razorpay modal opens, payment processed, subscription activated

Input: planId="invalid", paymentMethod="card"
Expected Output: Error message "Plan not found"
```

---

## Black Box vs White Box

| Aspect | Black Box | White Box |
|--------|-----------|-----------|
| Knowledge | No code knowledge | Full code knowledge |
| Focus | Functionality | Code structure |
| Tester | QA, End users | Developers |
| Coverage | Requirements | Code paths |

---

## Summary

Black box testing validates Archinza from a user's perspective, ensuring functionality meets requirements.
