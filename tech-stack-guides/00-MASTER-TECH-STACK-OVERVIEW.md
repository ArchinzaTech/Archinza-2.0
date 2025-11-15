# Archinza 2.0 - Complete Tech Stack Overview

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack Summary](#technology-stack-summary)
4. [Individual Technology Guides](#individual-technology-guides)
5. [Data Flow](#data-flow)
6. [Development Workflow](#development-workflow)
7. [Deployment Architecture](#deployment-architecture)
8. [Getting Started](#getting-started)

---

## Introduction

Welcome to the comprehensive tech stack documentation for **Archinza 2.0**, a modern three-tier web application designed for managing personal and business accounts with subscription-based services.

### Project Structure

```
Archinza-2.0/
├── archinza-front-beta/         # Customer-facing React app
├── admin-archinza-beta/         # Admin dashboard React app
├── node-archinza-beta/          # Express.js REST API
├── docs/                        # Documentation
└── tech-stack-guides/           # This directory - Tech guides
```

### Application Scale

- **Total JavaScript files:** 639
- **Backend API files:** 145
- **Database models:** 50+
- **Email templates:** 11 categories
- **API endpoint groups:** 20+
- **Background job types:** 20+

---

## Architecture Overview

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────┐
│                 PRESENTATION LAYER              │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │  Customer App    │  │   Admin Panel    │   │
│  │  React 18.2.0    │  │  React 18.3.1    │   │
│  │  Port: 3000      │  │  Port: 3001      │   │
│  └──────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│              APPLICATION LAYER                  │
│         Express.js REST API Server              │
│              Node.js Backend                    │
│              Port: 3020                         │
│  ┌──────────────────────────────────────────┐  │
│  │  Routes  │  Middleware  │  Controllers  │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                  DATA LAYER                     │
│  ┌──────────────┐  ┌──────────────┐           │
│  │   MongoDB    │  │    Redis     │           │
│  │  (Database)  │  │  (Cache)     │           │
│  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────┘
```

### External Services

```
┌─────────────────────────────────────────────────┐
│           CLOUD & EXTERNAL SERVICES             │
├─────────────────────────────────────────────────┤
│  • AWS S3 - File Storage                        │
│  • AWS CloudWatch - Logging                     │
│  • Google Cloud Storage - File Storage          │
│  • Razorpay - Payment Gateway                   │
│  • SendGrid - Email Delivery                    │
│  • Mailchimp - Email Marketing                  │
│  • Google APIs - Maps, Places, Geocoding        │
│  • TextLocal/MSG91 - SMS Services               │
└─────────────────────────────────────────────────┘
```

---

## Technology Stack Summary

### Frontend Technologies

| Technology | Version | Purpose | Guide |
|------------|---------|---------|-------|
| **React** | 18.2.0 / 18.3.1 | UI Framework | [01-REACT-GUIDE.md](./01-REACT-GUIDE.md) |
| React Router | 6.14.1 / 6.23.1 | Client-side routing | [01-REACT-GUIDE.md](./01-REACT-GUIDE.md) |
| Material-UI | 5.14.8 | UI Component Library | [01-REACT-GUIDE.md](./01-REACT-GUIDE.md) |
| Ant Design | 5.20.0 / 5.18.3 | UI Component Library | [01-REACT-GUIDE.md](./01-REACT-GUIDE.md) |
| Axios | 0.27.2 / 1.7.2 | HTTP Client | [01-REACT-GUIDE.md](./01-REACT-GUIDE.md) |
| Joi | 17.13.1 | Schema Validation | [01-REACT-GUIDE.md](./01-REACT-GUIDE.md) |
| GSAP | 3.12.7 | Animations | [01-REACT-GUIDE.md](./01-REACT-GUIDE.md) |

### Backend Technologies

| Technology | Version | Purpose | Guide |
|------------|---------|---------|-------|
| **Express.js** | 4.17.1 | Web Framework | [02-EXPRESS-JS-GUIDE.md](./02-EXPRESS-JS-GUIDE.md) |
| **Node.js** | - | JavaScript Runtime | [02-EXPRESS-JS-GUIDE.md](./02-EXPRESS-JS-GUIDE.md) |
| CORS | 2.8.5 | Cross-Origin Requests | [02-EXPRESS-JS-GUIDE.md](./02-EXPRESS-JS-GUIDE.md) |
| Morgan | 1.10.0 | HTTP Logging | [02-EXPRESS-JS-GUIDE.md](./02-EXPRESS-JS-GUIDE.md) |
| Multer | 1.4.4 | File Upload | [02-EXPRESS-JS-GUIDE.md](./02-EXPRESS-JS-GUIDE.md) |

### Database & Caching

| Technology | Version | Purpose | Guide |
|------------|---------|---------|-------|
| **MongoDB** | - | NoSQL Database | [03-MONGODB-MONGOOSE-GUIDE.md](./03-MONGODB-MONGOOSE-GUIDE.md) |
| **Mongoose** | 6.0.7 | MongoDB ODM | [03-MONGODB-MONGOOSE-GUIDE.md](./03-MONGODB-MONGOOSE-GUIDE.md) |
| **Redis** | 5.8.0 | Caching & Sessions | [04-REDIS-GUIDE.md](./04-REDIS-GUIDE.md) |
| IORedis | 5.6.1 | Redis Client | [04-REDIS-GUIDE.md](./04-REDIS-GUIDE.md) |
| Connect-Redis | 7.1.1 | Session Store | [04-REDIS-GUIDE.md](./04-REDIS-GUIDE.md) |

### Cloud Services

| Technology | Version | Purpose | Guide |
|------------|---------|---------|-------|
| **AWS S3** | @aws-sdk/client-s3 ^3.772.0 | File Storage | [05-AWS-S3-GUIDE.md](./05-AWS-S3-GUIDE.md) |
| AWS CloudWatch | ^3.863.0 | Logging | [09-WINSTON-LOGGING-GUIDE.md](./09-WINSTON-LOGGING-GUIDE.md) |
| Google Cloud Storage | ^7.14.0 | File Storage | [05-AWS-S3-GUIDE.md](./05-AWS-S3-GUIDE.md) |

### Payment & Billing

| Technology | Version | Purpose | Guide |
|------------|---------|---------|-------|
| **Razorpay** | 2.9.6 | Payment Gateway | [06-RAZORPAY-GUIDE.md](./06-RAZORPAY-GUIDE.md) |

### Email & Communication

| Technology | Version | Purpose | Guide |
|------------|---------|---------|-------|
| **NodeMailer** | 6.7.7 | Email Client | [08-EMAIL-SERVICES-GUIDE.md](./08-EMAIL-SERVICES-GUIDE.md) |
| SendGrid | 1.0.3 | Email Delivery | [08-EMAIL-SERVICES-GUIDE.md](./08-EMAIL-SERVICES-GUIDE.md) |
| Mailchimp | 3.0.80 | Email Marketing | [08-EMAIL-SERVICES-GUIDE.md](./08-EMAIL-SERVICES-GUIDE.md) |
| TextLocal | API | SMS Service | [08-EMAIL-SERVICES-GUIDE.md](./08-EMAIL-SERVICES-GUIDE.md) |
| MSG91 | API | SMS Gateway | [08-EMAIL-SERVICES-GUIDE.md](./08-EMAIL-SERVICES-GUIDE.md) |

### Authentication & Security

| Technology | Version | Purpose | Guide |
|------------|---------|---------|-------|
| **JWT** | 8.5.1 | Authentication | [07-JWT-AUTHENTICATION-GUIDE.md](./07-JWT-AUTHENTICATION-GUIDE.md) |
| Crypto | Built-in | Signature Verification | [07-JWT-AUTHENTICATION-GUIDE.md](./07-JWT-AUTHENTICATION-GUIDE.md) |

### Logging & Monitoring

| Technology | Version | Purpose | Guide |
|------------|---------|---------|-------|
| **Winston** | 3.8.2 | Logging Framework | [09-WINSTON-LOGGING-GUIDE.md](./09-WINSTON-LOGGING-GUIDE.md) |
| Winston Daily Rotate | 5.0.0 | Log Rotation | [09-WINSTON-LOGGING-GUIDE.md](./09-WINSTON-LOGGING-GUIDE.md) |

### Job Scheduling

| Technology | Version | Purpose | Guide |
|------------|---------|---------|-------|
| **Agenda** | 5.0.0 | Job Scheduler | [10-AGENDA-JOB-SCHEDULING-GUIDE.md](./10-AGENDA-JOB-SCHEDULING-GUIDE.md) |
| Agendash | 4.0.0 | Job Dashboard | [10-AGENDA-JOB-SCHEDULING-GUIDE.md](./10-AGENDA-JOB-SCHEDULING-GUIDE.md) |
| BullMQ | 5.56.0 | Queue System | [10-AGENDA-JOB-SCHEDULING-GUIDE.md](./10-AGENDA-JOB-SCHEDULING-GUIDE.md) |
| Node-Cron | 3.0.3 | Cron Jobs | [10-AGENDA-JOB-SCHEDULING-GUIDE.md](./10-AGENDA-JOB-SCHEDULING-GUIDE.md) |

### CI/CD

| Technology | Purpose | Guide |
|------------|---------|-------|
| **GitHub Actions** | Automated Deployment | [11-GITHUB-ACTIONS-CI-CD-GUIDE.md](./11-GITHUB-ACTIONS-CI-CD-GUIDE.md) |
| AWS CLI | S3 Deployment | [11-GITHUB-ACTIONS-CI-CD-GUIDE.md](./11-GITHUB-ACTIONS-CI-CD-GUIDE.md) |

---

## Individual Technology Guides

Detailed guides for each technology:

1. **[React Guide](./01-REACT-GUIDE.md)** - Frontend framework, components, routing, state management
2. **[Express.js Guide](./02-EXPRESS-JS-GUIDE.md)** - Backend framework, routing, middleware, error handling
3. **[MongoDB & Mongoose Guide](./03-MONGODB-MONGOOSE-GUIDE.md)** - Database, schemas, queries, relationships
4. **[Redis Guide](./04-REDIS-GUIDE.md)** - Caching, session storage, data types
5. **[AWS S3 Guide](./05-AWS-S3-GUIDE.md)** - File storage, uploads, downloads, pre-signed URLs
6. **[Razorpay Guide](./06-RAZORPAY-GUIDE.md)** - Payments, subscriptions, webhooks, invoices
7. **[JWT Authentication Guide](./07-JWT-AUTHENTICATION-GUIDE.md)** - Token generation, verification, protected routes
8. **[Email Services Guide](./08-EMAIL-SERVICES-GUIDE.md)** - Email sending, templates, Mailchimp
9. **[Winston Logging Guide](./09-WINSTON-LOGGING-GUIDE.md)** - Logging, transports, CloudWatch integration
10. **[Agenda Job Scheduling Guide](./10-AGENDA-JOB-SCHEDULING-GUIDE.md)** - Background jobs, scheduling, Agendash
11. **[GitHub Actions CI/CD Guide](./11-GITHUB-ACTIONS-CI-CD-GUIDE.md)** - Automated deployments, workflows

---

## Data Flow

### User Registration Flow

```
1. Frontend (React)
   ↓ POST /auth/register { email, password, name }
2. Express API
   ↓ Validate with Joi
3. MongoDB
   ↓ Create user document
4. Redis
   ↓ Store session
5. Agenda
   ↓ Schedule welcome email job
6. NodeMailer + SendGrid
   ↓ Send welcome email
7. Return JWT token to frontend
```

### Payment Processing Flow

```
1. Frontend creates Razorpay order
   ↓ POST /business-plans/subscribe
2. Express API creates Razorpay subscription
   ↓ Store subscription in MongoDB
3. User completes payment (Razorpay UI)
   ↓ Payment success
4. Razorpay webhook notification
   ↓ POST /razorpay/webhook
5. Verify signature (Crypto)
   ↓ Update subscription status
6. MongoDB + PaymentLog
   ↓ Store payment details
7. Agenda job sends confirmation email
   ↓ NodeMailer sends receipt
```

### File Upload Flow

```
1. Frontend file selection
   ↓ POST /upload (multipart/form-data)
2. Multer middleware
   ↓ Parse file to buffer (memory)
3. AWS S3 SDK
   ↓ Upload buffer to S3
4. MongoDB (Media model)
   ↓ Store file metadata
5. Return S3 URL to frontend
   ↓ Display uploaded file
```

---

## Development Workflow

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/ArchinzaTech/Archinza-2.0.git
cd Archinza-2.0

# 2. Backend setup
cd node-archinza-beta/node-archinza-beta
npm install
# Create .env file with required variables
npm start  # Runs on port 3020

# 3. Frontend setup
cd ../../archinza-front-beta/archinza-front-beta
npm install
npm start  # Runs on port 3000

# 4. Admin setup
cd ../../admin-archinza-beta/admin-archinza-beta
npm install
npm start  # Runs on port 3001
```

### Required Environment Variables

**Backend (.env):**
```env
# Database
DB_HOST=localhost
DB_PORT=27017
DB_USER=admin
DB_PASS=password
DB_NAME=archinza

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_ACCESS_TOKEN=your_token

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE_TIME=86400

# AWS
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_SECRET_KEY=your_secret

# Email
SENDGRID_API_KEY=your_key
MAILCHIMP_API_KEY=your_key
MAILCHIMP_SERVER=us1

# Google
GOOGLE_PLACES_API_KEY=your_key
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:3020
REACT_APP_ENV=development
```

---

## Deployment Architecture

### Development Environment

```
GitHub (develop branch)
  ↓ push trigger
GitHub Actions
  ↓ build & deploy
AWS S3 (appdev.archinza.com)
  ↓ serve
CloudFront CDN
  ↓ deliver
Users (Development)
```

### Production Environment

```
GitHub (main branch)
  ↓ push trigger
GitHub Actions
  ↓ build & deploy
AWS S3 (www.archinza.com)
  ↓ serve
CloudFront CDN
  ↓ deliver
Users (Production)
```

### Backend Deployment

```
Server (IP: 174.138.123.146)
  ├── Node.js (PM2 process manager)
  ├── MongoDB (Database server)
  ├── Redis (Cache server)
  └── Nginx (Reverse proxy)
```

---

## Getting Started

### For Developers

1. **Read the guides** - Start with the technology you'll be working with
2. **Set up local environment** - Follow the development workflow section
3. **Understand data flow** - Review the data flow diagrams
4. **Check existing code** - Explore the codebase structure
5. **Run the application** - Test locally before making changes

### For DevOps

1. **Review CI/CD guide** - [GitHub Actions CI/CD Guide](./11-GITHUB-ACTIONS-CI-CD-GUIDE.md)
2. **Check deployment architecture** - Understand the deployment flow
3. **Configure secrets** - Set up GitHub secrets for deployments
4. **Monitor logs** - Set up CloudWatch access
5. **Manage infrastructure** - AWS S3, MongoDB, Redis servers

### For Project Managers

1. **Architecture overview** - Understand the three-tier architecture
2. **Technology stack** - Review the technology summary table
3. **Feature capabilities** - Check individual guides for feature documentation
4. **Scalability** - Understand horizontal scaling capabilities
5. **Cost analysis** - Review cloud service usage (S3, CloudWatch, Razorpay)

---

## Key Features

### User Management
- Personal account registration and login
- Business account management
- Admin dashboard with role-based access
- Multiple authentication types (personal, business, admin, AI, bot)

### Subscription Management
- Multiple subscription plans
- Razorpay integration for payments
- Recurring billing
- Invoice generation
- Payment tracking and logs

### File Management
- AWS S3 file storage
- Google Cloud Storage backup
- Profile pictures, business logos
- Document uploads
- Image optimization

### Communication
- Transactional emails (welcome, OTP, verification)
- Email marketing (Mailchimp integration)
- SMS notifications (TextLocal, MSG91)
- 11+ email template categories

### Background Jobs
- Welcome emails
- Payment reminders
- Subscription checks
- Data cleanup
- Report generation

### Logging & Monitoring
- Structured logging with Winston
- CloudWatch integration for production
- API request logging
- Razorpay transaction logging
- Daily log rotation

---

## Performance Considerations

### Frontend Optimization
- Code splitting with React lazy loading
- Image lazy loading with intersection observer
- Virtual scrolling for large lists
- Memoization with useMemo/useCallback
- CDN delivery via CloudFront

### Backend Optimization
- Redis caching for frequently accessed data
- Database indexes on commonly queried fields
- Connection pooling for MongoDB
- File uploads directly to S3 (no server storage)
- Background job processing with Agenda

### Database Optimization
- 50+ optimized Mongoose schemas
- Compound indexes for complex queries
- Aggregation pipelines for analytics
- Virtual population for relationships
- Lean queries for read-only operations

---

## Security Measures

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Token expiration (24 hours)
- Password hashing with bcrypt
- Device fingerprinting

### API Security
- CORS configuration for allowed origins
- Rate limiting on sensitive endpoints
- Input validation with Joi
- SQL injection prevention (using Mongoose)
- XSS protection

### Payment Security
- Webhook signature verification
- Razorpay SSL/TLS encryption
- Payment logs for audit trail
- Secure credential management

### File Upload Security
- File type validation
- File size limits
- Virus scanning (recommended)
- Private/public ACL control
- Pre-signed URLs for temporary access

---

## Documentation Resources

### Official Documentation
- React: https://react.dev
- Express.js: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- Mongoose: https://mongoosejs.com
- Redis: https://redis.io
- AWS S3: https://docs.aws.amazon.com/s3/
- Razorpay: https://razorpay.com/docs/

### Archinza-Specific Documentation
- **Models Documentation:** `/node-archinza-beta/node-archinza-beta/models/MODELS_DOCUMENTATION.md` (34KB)
- **Razorpay Integration:** `/docs/RAZORPAY_INTEGRATION.md` (21KB)
- **This Tech Stack Guide:** `/tech-stack-guides/` (You are here!)

---

## Support & Maintenance

### Common Tasks

**Adding a new feature:**
1. Create database model (if needed)
2. Create API routes
3. Add frontend components
4. Update documentation

**Deploying changes:**
1. Push to develop branch (auto-deploys to dev)
2. Test on dev environment
3. Merge to main (auto-deploys to production)

**Database migrations:**
1. Create migration script
2. Test on development database
3. Backup production database
4. Run migration on production

**Monitoring:**
- Check CloudWatch logs for errors
- Review Agenda dashboard at `/agenda-dash`
- Monitor Razorpay dashboard for payments
- Check Redis memory usage

---

## Conclusion

Archinza 2.0 is a modern, scalable web application built with industry-standard technologies. This documentation provides a comprehensive guide to understanding and working with the entire tech stack.

For detailed information on any specific technology, refer to the individual guides listed in the [Individual Technology Guides](#individual-technology-guides) section.

**Happy coding! 🚀**
