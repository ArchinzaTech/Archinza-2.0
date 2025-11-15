# Agenda Job Scheduling Guide for Archinza 2.0

## Overview

Agenda is a MongoDB-based job scheduling library used in Archinza for background tasks, scheduled jobs, and delayed operations.

**Versions:**
- agenda: ^5.0.0
- agendash: ^4.0.0 (Dashboard UI)

---

## Setup

```javascript
// jobs/agenda.js
const Agenda = require('agenda');

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: 'jobs'
  },
  processEvery: '30 seconds',
  maxConcurrency: 20
});

// Event listeners
agenda.on('ready', () => console.log('Agenda started'));
agenda.on('error', (err) => console.error('Agenda error:', err));

// Start agenda
(async function() {
  await agenda.start();
})();

module.exports = agenda;
```

---

## Define Jobs

```javascript
const agenda = require('./agenda');

// Simple job
agenda.define('send-email', async (job) => {
  const { to, subject, body } = job.attrs.data;
  await sendEmail(to, subject, body);
  console.log('Email sent to:', to);
});

// Job with error handling
agenda.define('process-payment', { priority: 'high' }, async (job) => {
  try {
    const { paymentId } = job.attrs.data;
    await processPayment(paymentId);
    console.log('Payment processed:', paymentId);
  } catch (error) {
    console.error('Payment processing failed:', error);
    throw error; // Retry
  }
});

// Job with concurrency limit
agenda.define('generate-report', {
  concurrency: 2 // Max 2 concurrent reports
}, async (job) => {
  const { userId } = job.attrs.data;
  await generateReport(userId);
});
```

---

## Schedule Jobs

### 1. Run Immediately

```javascript
await agenda.now('send-email', {
  to: 'user@example.com',
  subject: 'Welcome',
  body: 'Thanks for signing up'
});
```

### 2. Run at Specific Time

```javascript
await agenda.schedule('in 5 minutes', 'send-reminder', {
  userId: '123'
});

await agenda.schedule('tomorrow at noon', 'send-report', {
  reportType: 'daily'
});

await agenda.schedule(new Date('2024-12-31'), 'send-new-year-email', {
  recipients: ['user1@example.com', 'user2@example.com']
});
```

### 3. Recurring Jobs

```javascript
// Every day at 9 AM
await agenda.every('0 9 * * *', 'daily-summary');

// Every hour
await agenda.every('1 hour', 'check-subscriptions');

// Every Monday at 8 AM
await agenda.every('0 8 * * 1', 'weekly-report');

// With data
await agenda.every('1 day', 'cleanup-old-files', {
  olderThan: 30 // days
});
```

---

## Job Management

### Cancel Jobs

```javascript
// Cancel all 'send-email' jobs for a user
await agenda.cancel({ name: 'send-email', 'data.userId': '123' });

// Cancel specific job
await job.remove();
```

### List Jobs

```javascript
const jobs = await agenda.jobs({ name: 'send-email' });

jobs.forEach(job => {
  console.log('Job:', job.attrs.name);
  console.log('Next run:', job.attrs.nextRunAt);
  console.log('Data:', job.attrs.data);
});
```

### Job Priority

```javascript
await agenda.schedule('in 5 minutes', 'urgent-task', { data }, {
  priority: 'high' // or 'normal', 'low', number (20 highest, -20 lowest)
});
```

---

## Agendash Dashboard

```javascript
const Agendash = require('agendash');
const express = require('express');
const app = express();

// Mount dashboard at /agenda-dash
app.use('/agenda-dash', Agendash(agenda, {
  title: 'Archinza Job Dashboard'
}));

// Access at: http://localhost:3020/agenda-dash
```

Features:
- View all jobs
- Filter by status (running, completed, failed)
- Manually run jobs
- Delete jobs
- See job details and data

---

## Common Job Types in Archinza

### 1. Email Notifications

```javascript
// jobs/notificationsAgenda.js
const agenda = require('./agenda');

agenda.define('send-otp-email', async (job) => {
  const { email, otp } = job.attrs.data;
  await sendOTPEmail(email, otp);
});

agenda.define('send-otp-mobile', async (job) => {
  const { phone, otp } = job.attrs.data;
  await sendOTPSMS(phone, otp);
});

// Usage
await agenda.now('send-otp-email', {
  email: 'user@example.com',
  otp: '123456'
});
```

### 2. Welcome Emails

```javascript
// jobs/proUsers/welcomeProUserEmail.js
agenda.define('welcome-pro-user', async (job) => {
  const { userId } = job.attrs.data;

  const user = await User.findById(userId);
  await sendWelcomeEmail(user);
});

// Schedule after signup
await agenda.schedule('in 1 hour', 'welcome-pro-user', {
  userId: user._id
});
```

### 3. Reminder Emails

```javascript
// jobs/businessUsers/businessReminderMail.js
agenda.define('business-reminder', async (job) => {
  const { businessId } = job.attrs.data;

  const business = await Business.findById(businessId);

  if (!business.isVerified) {
    await sendVerificationReminder(business);
  }
});

// Schedule 24 hours after signup
await agenda.schedule('in 24 hours', 'business-reminder', {
  businessId: business._id
});
```

### 4. Subscription Checks

```javascript
agenda.define('check-expired-subscriptions', async (job) => {
  const expiredSubs = await BusinessUserPlan.find({
    status: 'active',
    expiresAt: { $lt: new Date() }
  });

  for (const sub of expiredSubs) {
    await handleExpiredSubscription(sub);
  }
});

// Run daily at 2 AM
await agenda.every('0 2 * * *', 'check-expired-subscriptions');
```

### 5. Data Cleanup

```javascript
agenda.define('cleanup-old-logs', async (job) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await LogActivity.deleteMany({
    createdAt: { $lt: thirtyDaysAgo }
  });

  console.log('Old logs cleaned up');
});

// Run weekly on Sunday at 3 AM
await agenda.every('0 3 * * 0', 'cleanup-old-logs');
```

---

## Best Practices

### 1. Define All Jobs on Startup

```javascript
// index.js
require('./jobs/notificationsAgenda');
require('./jobs/businessNotificationsAgenda');
require('./jobs/proUsers/welcomeProUserEmail');
// ... other job files

agenda.start();
```

### 2. Handle Errors Properly

```javascript
agenda.define('risky-job', async (job) => {
  try {
    await performRiskyOperation();
  } catch (error) {
    console.error('Job failed:', error);
    job.fail(error.message);
    await job.save();
    throw error; // Agenda will retry based on settings
  }
});
```

### 3. Avoid Duplicate Jobs

```javascript
// Check if job already exists
const existingJobs = await agenda.jobs({
  name: 'send-reminder',
  'data.userId': userId
});

if (existingJobs.length === 0) {
  await agenda.schedule('tomorrow', 'send-reminder', { userId });
}
```

### 4. Set Concurrency Limits

```javascript
// Limit resource-intensive jobs
agenda.define('generate-large-report', {
  concurrency: 1, // Only 1 at a time
  lockLifetime: 10000 // 10 seconds
}, async (job) => {
  await generateReport();
});
```

### 5. Use Appropriate Intervals

```javascript
// ✅ Good: Reasonable interval
await agenda.every('1 hour', 'check-status');

// ❌ Bad: Too frequent (high database load)
await agenda.every('1 second', 'check-status');
```

---

## Cron Syntax Reference

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *

Examples:
'0 0 * * *'    = Every day at midnight
'0 9 * * 1-5'  = 9 AM on weekdays
'0 */2 * * *'  = Every 2 hours
'*/15 * * * *' = Every 15 minutes
```

---

## Human-Readable Intervals

```javascript
await agenda.every('5 minutes', 'job-name');
await agenda.every('1 hour', 'job-name');
await agenda.every('1 day', 'job-name');
await agenda.every('1 week', 'job-name');
await agenda.every('1 month', 'job-name');
```

---

## Graceful Shutdown

```javascript
// index.js
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');

  await agenda.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');

  await agenda.stop();
  process.exit(0);
});
```

---

## Summary

Agenda in Archinza provides:
- **Background job processing** - Async task execution
- **Scheduled tasks** - Cron-like scheduling
- **Delayed execution** - Time-based job triggers
- **Dashboard UI** - Agendash at `/agenda-dash`
- **MongoDB storage** - Job persistence
- **20+ job types** - Emails, reminders, cleanups, checks
- **Concurrency control** - Resource management
