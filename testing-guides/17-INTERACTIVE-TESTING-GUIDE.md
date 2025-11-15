# Interactive Testing Guide for Archinza 2.0

## Overview

Interactive testing validates user interactions and UI responsiveness.

**Focus:** User interface interactions | **Automation:** 40% | **Priority:** Medium

---

## Interactive Elements to Test

### 1. Forms
- Input fields respond to typing
- Validation messages appear on blur
- Submit button enables/disables correctly
- Enter key submits form
- Tab navigation works properly

### 2. Buttons
- Hover effects work
- Click handlers execute
- Loading states display
- Disabled states prevent clicks

### 3. Modals/Dialogs
- Open on trigger
- Close on X button, Esc key, overlay click
- Focus trapped within modal
- Scroll locked on body
- Return focus to trigger on close

### 4. Dropdowns/Selects
- Opens on click
- Closes on selection
- Keyboard navigation works
- Search/filter functionality

### 5. File Upload
- Browse button opens file picker
- Drag-and-drop works
- Preview displays
- Progress indicator shows
- Cancel upload works

---

## Automated Interactive Tests

### Form Interaction Test

```javascript
// tests/interactive/form.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Interactive: Login Form', () => {
  test('email input accepts typing', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  test('validation message appears on invalid input', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);
    
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  test('submit button disabled with invalid inputs', () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    expect(submitButton).toBeDisabled();
  });

  test('Enter key submits form', async () => {
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'test@example.com{enter}');
    
    // Form should attempt submission
  });
});
```

### Modal Interaction Test

```javascript
describe('Interactive: Modal', () => {
  test('modal opens on button click', async () => {
    render(<ProfilePage />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('modal closes on Escape key', async () => {
    render(<ProfilePage />);
    
    // Open modal
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    // Press Escape
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('clicking overlay closes modal', async () => {
    render(<ProfilePage />);
    
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    const overlay = screen.getByTestId('modal-overlay');
    await userEvent.click(overlay);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

### File Upload Interaction

```javascript
describe('Interactive: File Upload', () => {
  test('file input accepts file selection', async () => {
    render(<ProfilePictureUpload />);
    
    const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload/i);
    
    await userEvent.upload(input, file);
    
    expect(input.files[0]).toBe(file);
    expect(input.files).toHaveLength(1);
  });

  test('preview displays after file selection', async () => {
    render(<ProfilePictureUpload />);
    
    const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload/i);
    
    await userEvent.upload(input, file);
    
    const preview = screen.getByTestId('image-preview');
    expect(preview).toBeInTheDocument();
  });
});
```

---

## Manual Interactive Testing

### Checklist

**Forms:**
- [ ] All inputs accept keyboard input
- [ ] Placeholder text displays correctly
- [ ] Labels are associated with inputs
- [ ] Autofocus works on page load
- [ ] Clear/reset button works

**Buttons:**
- [ ] Hover state changes appearance
- [ ] Active state shows on click
- [ ] Disabled state prevents interaction
- [ ] Loading spinner displays during async operations

**Navigation:**
- [ ] Menu opens/closes correctly
- [ ] Active page is highlighted
- [ ] Mobile menu works on small screens
- [ ] Breadcrumbs update on navigation

**Modals:**
- [ ] Modal centers on screen
- [ ] Background dims/blurs
- [ ] Body scroll disabled when modal open
- [ ] Focus moves to modal
- [ ] Focus returns to trigger on close

---

## Summary

Interactive testing ensures Archinza's UI elements respond correctly to user actions.
