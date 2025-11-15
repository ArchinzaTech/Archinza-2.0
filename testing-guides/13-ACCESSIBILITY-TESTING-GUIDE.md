# Accessibility Testing Guide for Archinza 2.0

## Overview

Accessibility testing ensures Archinza is usable by people with disabilities.

**Standard:** WCAG 2.1 Level AA | **Priority:** High

---

## Tools Setup

```bash
# Axe DevTools (Browser Extension)
# Install from Chrome/Firefox store

# axe-core for automated testing
npm install --save-dev @axe-core/react axe-core

# Pa11y for CLI testing
npm install --save-dev pa11y

# Lighthouse (built into Chrome DevTools)
```

---

## Automated Accessibility Testing

### 1. Axe-Core Integration

```javascript
// tests/a11y/accessibility.test.js
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  test('Login page should have no violations', async () => {
    const { container } = render(<LoginPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Dashboard should have no violations', async () => {
    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 2. Cypress + Axe

```javascript
// cypress/e2e/accessibility.cy.js
describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('Home page should be accessible', () => {
    cy.checkA11y();
  });

  it('Login form should be accessible', () => {
    cy.visit('/login');
    cy.checkA11y('form', {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
  });
});
```

---

## WCAG 2.1 Compliance Checklist

### Perceivable

**1.1 Text Alternatives**
- [ ] All images have alt text
- [ ] Decorative images use alt=""
- [ ] Icons have aria-labels

```jsx
// ✅ Good
<img src="logo.png" alt="Archinza Logo" />
<img src="decoration.png" alt="" role="presentation" />
<button aria-label="Close"><CloseIcon /></button>

// ❌ Bad
<img src="logo.png" />
<button><CloseIcon /></button>
```

**1.3 Adaptable**
- [ ] Semantic HTML used
- [ ] Proper heading hierarchy (h1→h2→h3)
- [ ] Lists use ul/ol/li tags
- [ ] Forms use label elements

```jsx
// ✅ Good
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

**1.4 Distinguishable**
- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text
- [ ] Text resizable up to 200%
- [ ] No information conveyed by color alone

```css
/* ✅ Good contrast */
color: #000; /* black */
background: #fff; /* white */
/* Ratio: 21:1 */

/* ❌ Poor contrast */
color: #777; /* light gray */
background: #fff; /* white */
/* Ratio: 2.6:1 - FAILS */
```

### Operable

**2.1 Keyboard Accessible**
- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Focus order is logical
- [ ] Focus visible on all interactive elements

```javascript
// Test keyboard navigation
test('should navigate form with keyboard', () => {
  render(<LoginForm />);
  
  // Tab through elements
  userEvent.tab();
  expect(screen.getByLabelText('Email')).toHaveFocus();
  
  userEvent.tab();
  expect(screen.getByLabelText('Password')).toHaveFocus();
  
  userEvent.tab();
  expect(screen.getByRole('button', { name: 'Login' })).toHaveFocus();
});
```

**2.4 Navigable**
- [ ] Skip navigation link provided
- [ ] Page titles are descriptive
- [ ] Headings describe content
- [ ] Link text is meaningful

```jsx
// ✅ Good
<a href="/profile">View your profile</a>

// ❌ Bad
<a href="/profile">Click here</a>
```

**2.5 Input Modalities**
- [ ] Touch targets ≥ 44x44 pixels
- [ ] Pointer gestures have keyboard alternative

### Understandable

**3.1 Readable**
- [ ] Language of page specified
- [ ] Language of parts specified

```html
<html lang="en">
  <body>
    <p>Welcome to Archinza</p>
    <p lang="hi">स्वागत है</p>
  </body>
</html>
```

**3.2 Predictable**
- [ ] Navigation consistent across pages
- [ ] Form submission doesn't auto-submit
- [ ] Changes on focus are predictable

**3.3 Input Assistance**
- [ ] Error messages are clear
- [ ] Labels and instructions provided
- [ ] Error prevention for critical actions

```jsx
// ✅ Good error message
<span role="alert">
  Email is required and must be valid
</span>

// ✅ Confirmation for critical action
<button onClick={confirmDelete}>
  Delete Account
</button>
```

### Robust

**4.1 Compatible**
- [ ] Valid HTML
- [ ] ARIA used correctly
- [ ] Status messages announced

```jsx
// ✅ Good ARIA usage
<div role="alert" aria-live="polite">
  Profile updated successfully
</div>

<button aria-expanded={isOpen} aria-controls="menu">
  Menu
</button>
```

---

## Screen Reader Testing

### Manual Testing with Screen Readers

**macOS:** VoiceOver (Cmd + F5)
**Windows:** NVDA (free) or JAWS
**Linux:** Orca

**Test Scenarios:**
1. Navigate entire page with screen reader
2. Fill out and submit forms
3. Interact with modals and dialogs
4. Navigate data tables
5. Use autocomplete fields

---

## Color Contrast Testing

```bash
# Pa11y with color contrast check
pa11y --standard WCAG2AA --threshold 0 https://www.archinza.com
```

**Tools:**
- Chrome DevTools Accessibility Panel
- WebAIM Contrast Checker
- Axe DevTools

---

## Running Accessibility Tests

```bash
# Run automated a11y tests
npm run test:a11y

# Pa11y testing
pa11y https://www.archinza.com
pa11y https://www.archinza.com/login
pa11y https://www.archinza.com/register

# Lighthouse accessibility audit
lighthouse https://www.archinza.com --only-categories=accessibility
```

---

## Common Issues & Fixes

### Missing Alt Text
```jsx
// ❌ Before
<img src="profile.jpg" />

// ✅ After
<img src="profile.jpg" alt="User profile picture" />
```

### Missing Form Labels
```jsx
// ❌ Before
<input type="email" placeholder="Email" />

// ✅ After
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Poor Color Contrast
```css
/* ❌ Before */
color: #999; background: #fff; /* Ratio: 2.8:1 */

/* ✅ After */
color: #595959; background: #fff; /* Ratio: 7:1 */
```

### Non-Semantic HTML
```jsx
// ❌ Before
<div onClick={handleClick}>Click me</div>

// ✅ After
<button onClick={handleClick}>Click me</button>
```

---

## Summary

Accessibility testing ensures Archinza is inclusive and usable by everyone, regardless of ability.
