# End-to-End Testing Guide for Archinza 2.0

## Overview

E2E testing validates complete user workflows from frontend to backend, simulating real user interactions.

**Goal:** 10% of total test suite | **Automation:** 70% | **Priority:** High

---

## Tools & Setup

### Cypress (Recommended)

```bash
npm install --save-dev cypress @testing-library/cypress
npx cypress open
```

### Configuration

```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    apiUrl: 'http://localhost:3020',
    testUser: {
      email: 'test@archinza.test',
      password: 'Test@123'
    }
  }
});
```

---

## Critical User Journeys

### 1. User Registration Flow

```javascript
// cypress/e2e/registration.cy.js
describe('User Registration', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should complete full registration flow', () => {
    // Step 1: Fill registration form
    cy.get('[name="firstName"]').type('John');
    cy.get('[name="lastName"]').type('Doe');
    cy.get('[name="email"]').type('john.doe@example.com');
    cy.get('[name="phone"]').type('9876543210');
    cy.get('[name="password"]').type('Test@123');
    cy.get('[name="confirmPassword"]').type('Test@123');

    // Step 2: Submit form
    cy.get('button[type="submit"]').click();

    // Step 3: Verify OTP page
    cy.url().should('include', '/verify-otp');
    cy.contains('Enter OTP sent to your email').should('be.visible');

    // Step 4: Enter OTP (use test OTP in test env)
    cy.get('[data-testid="otp-input"]').type('123456');
    cy.get('button').contains('Verify').click();

    // Step 5: Verify redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, John').should('be.visible');

    // Step 6: Verify API call created user
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/personal/profile`,
      headers: {
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.user.email).to.eq('john.doe@example.com');
    });
  });

  it('should show validation errors', () => {
    cy.get('button[type="submit"]').click();

    cy.contains('First name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    cy.contains('Phone is required').should('be.visible');
  });

  it('should prevent duplicate email registration', () => {
    // First registration
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/auth/register`,
      body: {
        firstName: 'Jane',
        email: 'duplicate@example.com',
        phone: '9876543211',
        password: 'Test@123'
      }
    });

    // Attempt duplicate registration via UI
    cy.get('[name="email"]').type('duplicate@example.com');
    cy.get('[name="firstName"]').type('Jane');
    cy.get('[name="phone"]').type('9876543211');
    cy.get('[name="password"]').type('Test@123');
    cy.get('[name="confirmPassword"]').type('Test@123');
    cy.get('button[type="submit"]').click();

    cy.contains('Email already exists').should('be.visible');
  });
});
```

### 2. Login Flow

```javascript
// cypress/e2e/login.cy.js
describe('User Login', () => {
  beforeEach(() => {
    // Create test user
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/auth/register`,
      body: {
        firstName: 'Test',
        email: 'testuser@example.com',
        phone: '9876543210',
        password: 'Test@123'
      },
      failOnStatusCode: false
    });

    cy.visit('/login');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('[name="email"]').type('testuser@example.com');
    cy.get('[name="password"]').type('Test@123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');

    // Verify token stored
    cy.window().then((window) => {
      expect(window.localStorage.getItem('token')).to.exist;
    });
  });

  it('should show error for invalid credentials', () => {
    cy.get('[name="email"]').type('testuser@example.com');
    cy.get('[name="password"]').type('WrongPassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Invalid credentials').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should persist login after page refresh', () => {
    // Login
    cy.get('[name="email"]').type('testuser@example.com');
    cy.get('[name="password"]').type('Test@123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');

    // Refresh page
    cy.reload();

    // Should still be logged in
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');
  });
});
```

### 3. Business Subscription Flow

```javascript
// cypress/e2e/subscription.cy.js
describe('Business Subscription', () => {
  beforeEach(() => {
    // Login as business user
    cy.loginAsBusinessUser(); // Custom command
  });

  it('should complete subscription purchase', () => {
    // Navigate to plans
    cy.visit('/business/plans');

    // Select a plan
    cy.get('[data-testid="plan-basic"]').click();
    cy.get('button').contains('Subscribe').click();

    // Verify Razorpay modal opens
    cy.get('.razorpay-container').should('be.visible');

    // In test environment, Razorpay provides test credentials
    cy.get('button').contains('Pay with Test Card').click();

    // Wait for payment confirmation
    cy.url().should('include', '/subscription-success');
    cy.contains('Subscription activated').should('be.visible');

    // Verify subscription in database
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/business/subscription`,
      headers: {
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`
      }
    }).then((response) => {
      expect(response.body.status).to.eq('active');
      expect(response.body.planName).to.eq('Basic Plan');
    });
  });
});
```

### 4. File Upload Flow

```javascript
// cypress/e2e/file-upload.cy.js
describe('Profile Picture Upload', () => {
  beforeEach(() => {
    cy.loginAsUser(); // Custom command
    cy.visit('/profile/edit');
  });

  it('should upload profile picture', () => {
    // Select file
    cy.get('input[type="file"]').attachFile('test-image.jpg');

    // Verify preview
    cy.get('[data-testid="image-preview"]')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', 'blob:');

    // Save
    cy.get('button').contains('Save').click();

    // Verify upload success
    cy.contains('Profile updated successfully').should('be.visible');

    // Verify image displayed
    cy.get('[data-testid="profile-picture"]')
      .should('have.attr', 'src')
      .and('include', 's3.amazonaws.com');
  });

  it('should reject invalid file types', () => {
    cy.get('input[type="file"]').attachFile('document.pdf');

    cy.contains('Only images are allowed').should('be.visible');
  });
});
```

### 5. Admin Dashboard Flow

```javascript
// cypress/e2e/admin-dashboard.cy.js
describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.loginAsAdmin(); // Custom command
    cy.visit('/admin/dashboard');
  });

  it('should view and manage users', () => {
    // Navigate to users
    cy.get('a').contains('Users').click();
    cy.url().should('include', '/admin/users');

    // Search for user
    cy.get('input[placeholder="Search users"]').type('john@example.com');
    cy.get('button').contains('Search').click();

    // Verify results
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.contains('john@example.com').should('be.visible');

    // View user details
    cy.get('table tbody tr').first().click();
    cy.get('[data-testid="user-details-modal"]').should('be.visible');

    // Edit user
    cy.get('button').contains('Edit').click();
    cy.get('[name="firstName"]').clear().type('Updated Name');
    cy.get('button').contains('Save').click();

    cy.contains('User updated successfully').should('be.visible');
  });
});
```

---

## Custom Cypress Commands

```javascript
// cypress/support/commands.js
Cypress.Commands.add('loginAsUser', () => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: {
      email: Cypress.env('testUser').email,
      password: Cypress.env('testUser').password
    }
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

Cypress.Commands.add('loginAsBusinessUser', () => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/business/login`,
    body: {
      email: 'business@archinza.test',
      password: 'Test@123'
    }
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/admin/auth/login`,
    body: {
      email: 'admin@archinza.test',
      password: 'Admin@123'
    }
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});
```

---

## Running E2E Tests

```bash
# Open Cypress GUI
npx cypress open

# Run headless
npx cypress run

# Run specific test
npx cypress run --spec "cypress/e2e/login.cy.js"

# Run on specific browser
npx cypress run --browser chrome

# Generate video
npx cypress run --video
```

---

## CI/CD Integration

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Start backend
        run: |
          cd node-archinza-beta/node-archinza-beta
          npm install
          npm start &

      - name: Start frontend
        run: |
          cd archinza-front-beta/archinza-front-beta
          npm install
          npm start &

      - name: Wait for servers
        run: |
          npx wait-on http://localhost:3000
          npx wait-on http://localhost:3020

      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          browser: chrome

      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-screenshots
          path: cypress/screenshots

      - name: Upload videos
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-videos
          path: cypress/videos
```

---

## Best Practices

1. **Test User Journeys, Not Just Features**
2. **Use Data Attributes** - `[data-testid="element"]` instead of class names
3. **Wait for Elements** - Use Cypress's built-in retry logic
4. **Clean Up Test Data** - Reset database before each test
5. **Mock External Services** - Use Razorpay test mode, etc.
6. **Run in Multiple Browsers** - Chrome, Firefox, Edge

---

## Summary

E2E testing ensures Archinza works end-to-end:
- Complete user registration and login flows
- Business subscription purchases
- File uploads and management
- Admin operations
- Cross-browser compatibility
