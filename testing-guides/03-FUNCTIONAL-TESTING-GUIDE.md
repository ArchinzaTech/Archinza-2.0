# Functional Testing Guide for Archinza 2.0

## Overview

Functional testing validates that each feature works according to business requirements and specifications.

**Goal:** Feature validation | **Automation:** 80% | **Priority:** High

---

## Test Scenarios for Archinza

### 1. User Authentication
- ✅ User can register with valid details
- ✅ User receives OTP via email/SMS
- ✅ User can verify OTP
- ✅ User can login with email/password
- ✅ User can reset forgotten password
- ✅ Invalid login attempts are rejected
- ✅ User session persists across page refreshes
- ✅ User can logout successfully

### 2. Profile Management
- ✅ User can view their profile
- ✅ User can update profile information
- ✅ User can upload profile picture
- ✅ User can update preferences/options
- ✅ Changes are saved to database
- ✅ Validation errors are shown for invalid inputs

### 3. Business Account Management
- ✅ Business can register
- ✅ Business can add/edit business details
- ✅ Business can upload logo and gallery images
- ✅ Business can select business type
- ✅ Business can add location details
- ✅ Business verification request can be submitted
- ✅ Admin can approve/reject business verification

### 4. Subscription Management
- ✅ User can view available plans
- ✅ Business can subscribe to a plan
- ✅ Payment is processed through Razorpay
- ✅ Subscription status is updated after payment
- ✅ Invoice is generated
- ✅ User receives confirmation email
- ✅ Subscription can be cancelled
- ✅ Subscription auto-renews on due date

### 5. File Upload
- ✅ User can upload images (JPG, PNG)
- ✅ User can upload documents (PDF)
- ✅ File size limits are enforced (10MB)
- ✅ Invalid file types are rejected
- ✅ Files are uploaded to S3
- ✅ File metadata is stored in database
- ✅ User can delete uploaded files

### 6. Admin Functions
- ✅ Admin can login
- ✅ Admin can view all users
- ✅ Admin can search/filter users
- ✅ Admin can edit user details
- ✅ Admin can activate/deactivate users
- ✅ Admin can manage roles and permissions
- ✅ Admin can view activity logs
- ✅ Admin can manage content/options

---

## Test Case Template

```
Test Case ID: TC_001
Title: User Registration with Valid Data
Priority: High
Preconditions: User is not already registered

Steps:
1. Navigate to /register
2. Enter first name: "John"
3. Enter last name: "Doe"
4. Enter email: "john.doe@example.com"
5. Enter phone: "9876543210"
6. Enter password: "Test@123"
7. Enter confirm password: "Test@123"
8. Click "Register" button

Expected Result:
- User is redirected to OTP verification page
- OTP is sent to email
- Success message is displayed
- User record is created in database

Actual Result: [To be filled during testing]
Status: [Pass/Fail]
```

---

## Automation Example

```javascript
// tests/functional/user-registration.test.js
describe('Functional: User Registration', () => {
  test('should register user with all required fields', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '9876543210',
      password: 'Test@123'
    };

    const response = await api.post('/auth/register', userData);

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('john@example.com');
    
    // Verify email sent
    expect(emailService.sendOTP).toHaveBeenCalled();
  });
});
```

---

## Best Practices

1. **Test Real Business Scenarios** - Use actual user workflows
2. **Cover Happy and Sad Paths** - Test both success and failure cases
3. **Validate All Outputs** - Check UI, database, emails, etc.
4. **Test Data Persistence** - Ensure data saves correctly
5. **Test Cross-feature Integration** - How features work together

---

## Summary

Functional testing ensures Archinza features work as specified in requirements, providing value to end users.
