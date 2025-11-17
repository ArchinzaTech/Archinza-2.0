# Security Testing Guide for Archinza 2.0

## Overview

Security testing identifies vulnerabilities and ensures protection against threats.

**Priority:** Critical | **Continuous** | **Automation:** 70%

---

## OWASP Top 10 Testing

### 1. Injection Attacks

**SQL Injection (MongoDB)**
```javascript
// Test case: Attempt NoSQL injection
test('should prevent NoSQL injection', async () => {
  const maliciousInput = { $gt: '' };
  
  const response = await api.post('/auth/login', {
    email: maliciousInput,
    password: 'anything'
  });

  expect(response.status).toBe(400); // Should reject
});
```

**Solution:** Use Mongoose schema validation, never use raw queries with user input

### 2. Broken Authentication

```javascript
// Test weak passwords
test('should enforce strong passwords', async () => {
  const response = await api.post('/auth/register', {
    email: 'test@example.com',
    password: '123' // Weak password
  });

  expect(response.status).toBe(400);
  expect(response.body.error).toMatch(/password/i);
});

// Test JWT expiration
test('should reject expired tokens', async () => {
  const expiredToken = jwt.sign(
    { userId: '123' },
    process.env.JWT_SECRET,
    { expiresIn: '-1h' } // Expired 1 hour ago
  );

  const response = await api.get('/personal/profile', {
    headers: { Authorization: `Bearer ${expiredToken}` }
  });

  expect(response.status).toBe(401);
});
```

### 3. Sensitive Data Exposure

```javascript
// Test password not returned
test('should not expose password in response', async () => {
  const response = await api.get('/personal/profile', {
    headers: { Authorization: `Bearer ${validToken}` }
  });

  expect(response.body.user.password).toBeUndefined();
});

// Test HTTPS enforcement
test('should redirect HTTP to HTTPS in production', async () => {
  const response = await http.get('http://www.archinza.com');
  expect(response.status).toBe(301);
  expect(response.headers.location).toMatch(/^https/);
});
```

### 4. XML External Entities (XXE)

Not applicable (Archinza uses JSON, not XML)

### 5. Broken Access Control

```javascript
// Test unauthorized access
test('should prevent access to other users data', async () => {
  const user1Token = generateToken('user1');
  
  const response = await api.get('/personal/profile?userId=user2', {
    headers: { Authorization: `Bearer ${user1Token}` }
  });

  expect(response.status).toBe(403);
});

// Test admin-only endpoints
test('should prevent non-admin access to admin routes', async () => {
  const userToken = generateToken('regularUser');
  
  const response = await api.get('/admin/users', {
    headers: { Authorization: `Bearer ${userToken}` }
  });

  expect(response.status).toBe(403);
});
```

### 6. Security Misconfiguration

```bash
# Check security headers
curl -I https://www.archinza.com

# Should include:
# Strict-Transport-Security: max-age=31536000
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Content-Security-Policy: ...
```

### 7. Cross-Site Scripting (XSS)

```javascript
// Test XSS prevention
test('should sanitize HTML in user input', async () => {
  const maliciousName = '<script>alert("XSS")</script>';
  
  await User.create({
    name: maliciousName,
    email: 'test@example.com'
  });

  const user = await User.findOne({ email: 'test@example.com' });
  
  // Should escape or remove script tags
  expect(user.name).not.toContain('<script>');
});
```

### 8. Insecure Deserialization

Mitigated by using JSON (built-in safe parsing)

### 9. Using Components with Known Vulnerabilities

```bash
# Run npm audit
npm audit

# Fix vulnerabilities
npm audit fix

# For high/critical issues
npm audit fix --force
```

### 10. Insufficient Logging & Monitoring

```javascript
// Ensure security events are logged
test('should log failed login attempts', async () => {
  await api.post('/auth/login', {
    email: 'test@example.com',
    password: 'wrongpassword'
  });

  // Check logs contain failed attempt
  const logs = await readLogs();
  expect(logs).toContain('Failed login attempt');
});
```

---

## Automated Security Scanning

### 1. Dependency Scanning

```bash
# npm audit
npm audit --audit-level=moderate

# Snyk
npx snyk test
npx snyk monitor

# OWASP Dependency-Check
dependency-check --project archinza --scan ./node_modules
```

### 2. Static Code Analysis

```bash
# ESLint security plugin
npm install --save-dev eslint-plugin-security

# SonarQube
sonar-scanner \
  -Dsonar.projectKey=archinza \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000
```

### 3. Dynamic Application Security Testing (DAST)

```bash
# OWASP ZAP
zap-cli quick-scan --self-contained https://www.archinza.com

# Nikto
nikto -h https://www.archinza.com
```

---

## Penetration Testing Checklist

### Authentication & Authorization
- [ ] Test password strength requirements
- [ ] Test account lockout after failed attempts
- [ ] Test session timeout
- [ ] Test JWT token security
- [ ] Test role-based access control
- [ ] Test unauthorized access attempts

### Input Validation
- [ ] Test SQL/NoSQL injection
- [ ] Test XSS attacks
- [ ] Test command injection
- [ ] Test path traversal
- [ ] Test file upload restrictions

### API Security
- [ ] Test rate limiting
- [ ] Test CORS configuration
- [ ] Test API authentication
- [ ] Test API authorization
- [ ] Test input sanitization

### Data Protection
- [ ] Test encryption in transit (HTTPS)
- [ ] Test encryption at rest
- [ ] Test sensitive data exposure
- [ ] Test secure cookie flags
- [ ] Test password hashing

### Business Logic
- [ ] Test payment manipulation
- [ ] Test subscription bypass
- [ ] Test privilege escalation
- [ ] Test business rule violations

---

## Security Testing Tools

| Tool | Purpose | Usage |
|------|---------|-------|
| npm audit | Dependency vulnerabilities | `npm audit` |
| Snyk | Vulnerability scanning | `npx snyk test` |
| OWASP ZAP | Web app security scanner | GUI/CLI |
| Burp Suite | Manual penetration testing | GUI |
| SonarQube | Code quality & security | Self-hosted |
| ESLint Security | Static analysis | `npm run lint` |

---

## Summary

Security testing is continuous and critical for protecting Archinza users and data from threats.
