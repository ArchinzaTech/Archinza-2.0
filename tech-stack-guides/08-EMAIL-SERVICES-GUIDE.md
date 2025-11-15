# Email Services Guide for Archinza 2.0

## Overview

Archinza uses **NodeMailer** with **SendGrid** integration and **Mailchimp** for email delivery and marketing campaigns.

**Versions:**
- nodemailer: ^6.7.7
- nodemailer-sendgrid: ^1.0.3
- @mailchimp/mailchimp_marketing: ^3.0.80

---

## NodeMailer with SendGrid

### Setup

```javascript
// helpers/mailer.js
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid');

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

module.exports = transporter;
```

### Send Email

```javascript
const transporter = require('./helpers/mailer');

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `${process.env.SMTP_SENDER_NAME} <${process.env.SMTP_SENDER}>`,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

// Usage
await sendEmail(
  'user@example.com',
  'Welcome to Archinza',
  '<h1>Welcome!</h1><p>Thanks for signing up.</p>'
);
```

---

## Email Templates

### 1. Render Template with EJS

```javascript
const ejs = require('ejs');
const path = require('path');
const fs = require('fs').promises;

const renderEmailTemplate = async (templateName, data) => {
  const templatePath = path.join(
    __dirname,
    '../email-templates',
    templateName,
    'index.ejs'
  );

  const template = await fs.readFile(templatePath, 'utf-8');
  const html = ejs.render(template, data);

  return html;
};

// Usage
const html = await renderEmailTemplate('welcome', {
  name: 'John Doe',
  verificationLink: 'https://archinza.com/verify/abc123'
});

await sendEmail(user.email, 'Welcome to Archinza', html);
```

### 2. Template Categories in Archinza

```
email-templates/
├── 2024/                    # Current templates
├── welcome/                 # Welcome emails
├── businessVerification/    # Business verification
├── businessReminderMails/   # Business reminders
├── proUsers/                # Pro user emails
├── nonProUsers/             # Non-pro user emails
└── businessOfflineMails/    # Offline reminders
```

---

## Common Email Types

### 1. Welcome Email

```javascript
const sendWelcomeEmail = async (user) => {
  const html = await renderEmailTemplate('welcome', {
    name: user.name,
    email: user.email
  });

  await sendEmail(
    user.email,
    'Welcome to Archinza!',
    html
  );
};
```

### 2. OTP Email

```javascript
const sendOTPEmail = async (email, otp) => {
  const html = `
    <h2>Your OTP Code</h2>
    <p>Your one-time password is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
  `;

  await sendEmail(email, 'Your OTP Code', html);
};
```

### 3. Password Reset

```javascript
const sendPasswordResetEmail = async (user, resetLink) => {
  const html = await renderEmailTemplate('password-reset', {
    name: user.name,
    resetLink
  });

  await sendEmail(
    user.email,
    'Reset Your Password',
    html
  );
};
```

### 4. Subscription Confirmation

```javascript
const sendSubscriptionEmail = async (business, plan) => {
  const html = await renderEmailTemplate('subscription', {
    businessName: business.name,
    planName: plan.name,
    amount: plan.price,
    billingDate: plan.nextBillingDate
  });

  await sendEmail(
    business.email,
    'Subscription Activated',
    html
  );
};
```

---

## Mailchimp Integration

### Setup

```javascript
const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER // e.g., 'us1'
});

module.exports = mailchimp;
```

### Add Subscriber

```javascript
const addToMailchimp = async (email, firstName, lastName, tags = []) => {
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  try {
    const response = await mailchimp.lists.addListMember(audienceId, {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      },
      tags: tags
    });

    return response;
  } catch (error) {
    console.error('Mailchimp error:', error);
    throw error;
  }
};

// Usage
await addToMailchimp(
  'user@example.com',
  'John',
  'Doe',
  ['business-user', 'premium']
);
```

### Update Subscriber

```javascript
const updateMailchimpMember = async (email, updates) => {
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const subscriberHash = md5(email.toLowerCase());

  const response = await mailchimp.lists.updateListMember(
    audienceId,
    subscriberHash,
    updates
  );

  return response;
};
```

### Unsubscribe

```javascript
const unsubscribeFromMailchimp = async (email) => {
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const subscriberHash = md5(email.toLowerCase());

  await mailchimp.lists.updateListMember(audienceId, subscriberHash, {
    status: 'unsubscribed'
  });
};
```

---

## Background Email Jobs

### Using Agenda

```javascript
// jobs/emailJobs.js
const agenda = require('./agenda');
const { sendEmail } = require('../helpers/mailer');

agenda.define('send-welcome-email', async (job) => {
  const { email, name } = job.attrs.data;

  await sendWelcomeEmail({ email, name });
});

agenda.define('send-otp-email', async (job) => {
  const { email, otp } = job.attrs.data;

  await sendOTPEmail(email, otp);
});

// Schedule email
await agenda.schedule('in 5 minutes', 'send-welcome-email', {
  email: 'user@example.com',
  name: 'John Doe'
});
```

---

## Best Practices

### 1. Use HTML + Plain Text

```javascript
const mailOptions = {
  from: sender,
  to,
  subject,
  html: htmlContent,
  text: plainTextContent // Fallback for email clients
};
```

### 2. Handle Errors Gracefully

```javascript
try {
  await sendEmail(to, subject, html);
} catch (error) {
  // Log error but don't block user flow
  console.error('Email failed:', error);
  // Maybe queue for retry
  await queueEmailRetry({ to, subject, html });
}
```

### 3. Inline CSS for Templates

```javascript
const juice = require('juice');

const inlineCSS = (html) => {
  return juice(html);
};

const html = await renderEmailTemplate('welcome', data);
const inlinedHtml = inlineCSS(html);

await sendEmail(to, subject, inlinedHtml);
```

### 4. Rate Limiting

```javascript
// Avoid sending too many emails at once
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

for (const user of users) {
  await sendEmail(user.email, subject, html);
  await delay(100); // 100ms delay between emails
}
```

---

## Archinza Patterns

### 1. Welcome Email on Registration

```javascript
router.post('/register', async (req, res) => {
  const user = await User.create(req.body);

  // Send welcome email (don't await to avoid blocking)
  sendWelcomeEmail(user).catch(err => console.error(err));

  res.status(201).json({ user });
});
```

### 2. Business Verification Email

```javascript
const sendBusinessVerificationEmail = async (business) => {
  const html = await renderEmailTemplate('businessVerification', {
    businessName: business.name,
    verificationLink: `${process.env.BASE_URL}/verify-business/${business._id}`
  });

  await sendEmail(
    business.email,
    'Verify Your Business',
    html
  );
};
```

### 3. Reminder Emails (Scheduled)

```javascript
// Schedule reminder 24 hours after signup
await agenda.schedule('in 24 hours', 'send-reminder-email', {
  userId: user._id,
  type: 'complete-profile'
});
```

---

## SMS Integration (Bonus)

### TextLocal API

```javascript
const axios = require('axios');

const sendSMS = async (phone, message) => {
  const params = new URLSearchParams({
    apikey: process.env.TEXTLOCAL_API_KEY,
    numbers: phone,
    sender: process.env.TEXTLOCAL_SENDER,
    message
  });

  const response = await axios.post(
    'https://api.textlocal.in/send/',
    params.toString()
  );

  return response.data;
};

// Send OTP via SMS
await sendSMS('9876543210', `Your OTP is: ${otp}`);
```

---

## Summary

Email services in Archinza provide:
- **Transactional emails** - Via NodeMailer + SendGrid
- **Email templates** - EJS-based, organized by category
- **Marketing emails** - Via Mailchimp
- **Background jobs** - Scheduled/delayed emails with Agenda
- **SMS backup** - TextLocal/MSG91 integration
- **11+ template categories** - For different user journeys
