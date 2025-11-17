# Unit Testing Guide for Archinza 2.0

## Overview

Unit testing validates individual functions, components, and modules in isolation to ensure they work correctly.

**Goal:** 70% of total test suite | **Automation:** 100% | **Priority:** Critical

---

## Tools & Setup

### Testing Framework
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev supertest mongodb-memory-server
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
```

---

## Backend Unit Testing

### 1. Testing Utility Functions

```javascript
// helpers/validation.js
function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

module.exports = { isValidEmail, isValidPhone };
```

```javascript
// helpers/validation.test.js
const { isValidEmail, isValidPhone } = require('./validation');

describe('Validation Helpers', () => {
  describe('isValidEmail', () => {
    test('should return true for valid email', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
    });

    test('should return false for invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    test('should return true for valid 10-digit phone', () => {
      expect(isValidPhone('9876543210')).toBe(true);
    });

    test('should return false for invalid phone', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abcdefghij')).toBe(false);
    });
  });
});
```

### 2. Testing Mongoose Models

```javascript
// models/PersonalAccount.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const PersonalAccount = require('./PersonalAccount');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await PersonalAccount.deleteMany({});
});

describe('PersonalAccount Model', () => {
  test('should create a valid user', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '9876543210',
      password: 'hashedPassword123'
    };

    const user = await PersonalAccount.create(userData);

    expect(user._id).toBeDefined();
    expect(user.email).toBe('john@example.com');
    expect(user.firstName).toBe('John');
  });

  test('should fail without required fields', async () => {
    const user = new PersonalAccount({});

    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.firstName).toBeDefined();
  });

  test('should enforce unique email', async () => {
    const userData = {
      firstName: 'John',
      email: 'john@example.com',
      phone: '9876543210',
      password: 'password123'
    };

    await PersonalAccount.create(userData);

    let err;
    try {
      await PersonalAccount.create(userData);
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error
  });

  test('should lowercase email', async () => {
    const user = await PersonalAccount.create({
      firstName: 'John',
      email: 'John@EXAMPLE.COM',
      phone: '9876543210',
      password: 'password123'
    });

    expect(user.email).toBe('john@example.com');
  });
});
```

### 3. Testing Middleware

```javascript
// middlewares/auth.test.js
const jwt = require('jsonwebtoken');
const auth = require('./auth');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('should call next() with valid token', () => {
    const token = jwt.sign(
      { userId: '123', userType: 'personal' },
      process.env.JWT_SECRET || 'test-secret'
    );

    req.headers.authorization = `Bearer ${token}`;

    auth(req, res, next);

    expect(req.userId).toBe('123');
    expect(req.userType).toBe('personal');
    expect(next).toHaveBeenCalled();
  });

  test('should return 401 without token', () => {
    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 with invalid token', () => {
    req.headers.authorization = 'Bearer invalid-token';

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
```

### 4. Testing Helper Functions (JWT, Mailer, etc.)

```javascript
// helpers/token.test.js
const { generateToken, verifyToken } = require('./token');
const jwt = require('jsonwebtoken');

describe('Token Helpers', () => {
  const userId = 'user123';
  const userType = 'personal';

  test('should generate valid JWT token', () => {
    const token = generateToken(userId, userType);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
    expect(decoded.userId).toBe(userId);
    expect(decoded.userType).toBe(userType);
  });

  test('should verify valid token', () => {
    const token = generateToken(userId, userType);
    const decoded = verifyToken(token);

    expect(decoded.userId).toBe(userId);
    expect(decoded.userType).toBe(userType);
  });

  test('should throw error for invalid token', () => {
    expect(() => {
      verifyToken('invalid-token');
    }).toThrow();
  });
});
```

---

## Frontend Unit Testing

### 1. Testing React Components

```javascript
// components/UserCard.jsx
import React from 'react';

function UserCard({ user }) {
  if (!user) {
    return <div>No user data</div>;
  }

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <span>{user.isActive ? 'Active' : 'Inactive'}</span>
    </div>
  );
}

export default UserCard;
```

```javascript
// components/UserCard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';

describe('UserCard Component', () => {
  test('should render user information', () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true
    };

    render(<UserCard user={user} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  test('should show inactive status', () => {
    const user = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      isActive: false
    };

    render(<UserCard user={user} />);

    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  test('should handle missing user data', () => {
    render(<UserCard user={null} />);

    expect(screen.getByText('No user data')).toBeInTheDocument();
  });
});
```

### 2. Testing Custom Hooks

```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    }
  }, []);

  return { user, isAuthenticated };
}
```

```javascript
// hooks/useAuth.test.js
import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should return unauthenticated state without token', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  test('should return authenticated state with valid token', () => {
    const token = 'valid.jwt.token'; // Use actual JWT in real test
    localStorage.setItem('token', token);

    const { result } = renderHook(() => useAuth());

    // Add assertions based on decoded token
  });
});
```

### 3. Testing Form Components

```javascript
// components/LoginForm.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm Component', () => {
  test('should render login form', () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('should call onSubmit with form data', async () => {
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  test('should show validation error for invalid email', async () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

---

## Test Organization

### Directory Structure

```
node-archinza-beta/
├── models/
│   ├── PersonalAccount.js
│   └── PersonalAccount.test.js
├── routes/
│   ├── auth.js
│   └── auth.test.js
├── middlewares/
│   ├── auth.js
│   └── auth.test.js
├── helpers/
│   ├── validation.js
│   └── validation.test.js
└── __tests__/
    └── setup.js

archinza-front-beta/
├── src/
│   ├── components/
│   │   ├── UserCard.jsx
│   │   └── UserCard.test.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useAuth.test.js
│   └── helpers/
│       ├── utils.js
│       └── utils.test.js
```

---

## Running Tests

```bash
# Run all unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- auth.test.js

# Run in watch mode
npm test -- --watch

# Run tests matching pattern
npm test -- --testNamePattern="should create user"
```

---

## Coverage Requirements

### Minimum Coverage Targets

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  './helpers/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  },
  './routes/auth.js': {
    branches: 95,
    functions: 95,
    lines: 95,
    statements: 95
  }
}
```

---

## Best Practices

### 1. Test One Thing at a Time
```javascript
// ✅ Good
test('should validate email format', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
});

// ❌ Bad
test('should validate all inputs', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
  expect(isValidPhone('9876543210')).toBe(true);
  expect(isValidPassword('password123')).toBe(true);
});
```

### 2. Use Descriptive Test Names
```javascript
// ✅ Good
test('should return 401 when token is missing', () => {});

// ❌ Bad
test('auth test', () => {});
```

### 3. Arrange-Act-Assert Pattern
```javascript
test('should create user with valid data', async () => {
  // Arrange
  const userData = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  // Act
  const user = await User.create(userData);

  // Assert
  expect(user._id).toBeDefined();
  expect(user.email).toBe('john@example.com');
});
```

### 4. Mock External Dependencies
```javascript
// Mock AWS S3
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(),
  PutObjectCommand: jest.fn()
}));

// Mock email service
jest.mock('../helpers/mailer', () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}));
```

---

## Common Test Scenarios for Archinza

### Authentication Tests
- ✅ Valid login credentials
- ✅ Invalid credentials
- ✅ Missing fields
- ✅ Token generation
- ✅ Token verification
- ✅ Token expiration

### User Registration Tests
- ✅ Valid registration
- ✅ Duplicate email
- ✅ Password hashing
- ✅ Email validation
- ✅ Phone validation

### Payment Processing Tests
- ✅ Subscription creation
- ✅ Payment verification
- ✅ Signature validation
- ✅ Webhook handling

### File Upload Tests
- ✅ Valid file types
- ✅ File size limits
- ✅ S3 upload success
- ✅ Error handling

---

## Summary

Unit testing is the foundation of quality assurance for Archinza 2.0. Focus on:
- Testing individual functions in isolation
- Achieving 80%+ code coverage
- Writing clear, maintainable tests
- Mocking external dependencies
- Running tests automatically on every commit
