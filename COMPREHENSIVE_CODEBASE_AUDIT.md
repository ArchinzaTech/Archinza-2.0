# Archinza 2.0 - Comprehensive Codebase Audit Report

## Executive Summary

**Project Type:** Full-stack SaaS Platform for Design, Architecture & Decor Industry
**Architecture:** MERN Stack (MongoDB, Express, React, Node.js) with Multi-tenant Support
**Total Source Files:** 639 files (excluding node_modules)
**Total Lines of Code:** ~189,064 lines of JavaScript/JSX
**Current Status:** Production-ready with beta deployments
**Repository:** Monorepo structure with 3 main applications

---

## 1. PROJECT STRUCTURE & ARCHITECTURE

### Repository Layout
```
Archinza-2.0/
├── node-archinza-beta/          # Express.js Backend API (Port 3020)
├── archinza-front-beta/         # React Client Application (Port 3000)
├── admin-archinza-beta/         # React Admin Dashboard
├── docs/                        # Documentation (Models, Razorpay Integration)
└── README.md
```

### Application Type & Purpose
- **Primary Application:** B2B2C Platform for design/architecture professionals and service providers
- **Target Users:** 
  - Individual professionals (students, freelancers, designers)
  - Business accounts (design firms, contractors, sellers)
  - Admin users for platform management
- **Core Value Proposition:** 
  - Centralized profile and service showcase
  - Subscription-based monetization
  - Pro access features for premium users
  - Business verification and credibility system
  - Real-time team collaboration
  - Media management and portfolio hosting

---

## 2. TECHNOLOGY STACK ANALYSIS

### Backend Stack
- **Framework:** Express.js (v4.17.1)
- **Runtime:** Node.js
- **Database:** MongoDB with Mongoose ODM (v6.0.7)
- **Port:** 3020

**Key Dependencies:**
- **API & Validation:**
  - `express-async-handler` - Async error handling
  - `joi` (v17.4.2) - Schema validation
  - `cors` (v2.8.5) - Cross-origin resource sharing
  
- **Authentication & Security:**
  - `jsonwebtoken` (v8.5.1) - JWT token generation/verification
  - `express-session` (v1.17.3) - Session management
  - `connect-redis` (v7.1.1) - Redis session store
  
- **Database & Caching:**
  - `mongoose` (v6.0.7) - MongoDB ODM
  - `redis` (v5.8.0) - Session & cache store
  - `ioredis` (v5.6.1) - Redis client library
  - `node-cache` (v5.1.2) - In-memory caching
  
- **File Upload & Storage:**
  - `multer` (v1.4.4) - File upload middleware
  - `@aws-sdk/client-s3` (v3.772.0) - AWS S3 integration
  - `@google-cloud/storage` (v7.14.0) - Google Cloud Storage
  - `heic-convert` (v2.1.0) - iPhone image format conversion
  - `unzipper` (v0.12.3) - ZIP file handling
  
- **Payment Integration:**
  - `razorpay` (v2.9.6) - Payment gateway
  - `crypto` (built-in) - Webhook signature verification
  
- **Email & Notifications:**
  - `nodemailer` (v6.7.7) - Email sending
  - `nodemailer-sendgrid` (v1.0.3) - SendGrid provider
  - `@mailchimp/mailchimp_marketing` (v3.0.80) - Mailchimp API
  
- **Job Scheduling & Queues:**
  - `agenda` (v5.0.0) - Job scheduler
  - `agendash` (v4.0.0) - Agenda dashboard
  - `bullmq` (v5.56.0) - Message queue
  - `node-cron` (v3.0.3) - Cron job scheduling
  
- **PDF & Document Processing:**
  - `pdf-lib` (v1.17.1) - PDF manipulation
  - `pdfjs-dist` (v2.16.105) - PDF.js for rendering
  - `canvas` (v3.2.0) - Canvas for image rasterization
  - `read-excel-file` (v5.2.28) - Excel reading
  
- **Logging & Monitoring:**
  - `winston` (v3.8.2) - Structured logging
  - `winston-daily-rotate-file` (v5.0.0) - Log rotation
  - `@aws-sdk/client-cloudwatch-logs` (v3.863.0) - CloudWatch integration
  
- **Utilities:**
  - `axios` (v1.11.0) - HTTP client
  - `lodash` (v4.17.21) - Utility functions
  - `moment` (v2.29.3) - Date manipulation
  - `ua-parser-js` (v2.0.4) - User agent parsing
  - `uuid` (v11.1.0) - UUID generation
  - `fuse.js` (v7.0.0) - Fuzzy search
  - `qs` (v6.14.0) - Query string parsing

### Frontend Stack (Main Application)
- **Framework:** React (v18.2.0)
- **Build Tool:** React Scripts (v5.0.1)
- **Routing:** React Router (v6.14.1)
- **Port:** 3000

**Key UI Libraries:**
- `@mui/material` (v5.14.8) - Material UI components
- `@mui/joy` (v5.0.0-beta.7) - Joy UI
- `antd` (v5.20.0) - Ant Design components
- `react-bootstrap` (v2.10.2) - Bootstrap integration

**State Management & Context:**
- Context API (Custom implementation)
  - AuthContext - Authentication state
  - BusinessAccountContext - Business data
  - GlobalDataContext - Global app state
  - ProAccessContext - Pro access features

**Form & Input Handling:**
- `react-otp-input` (v2.4.0) - OTP input component
- `libphonenumber-js` (v1.11.7) - Phone number validation
- Custom form components (TextField, SelectDropdown, etc.)

**UI Components & Effects:**
- `gsap` (v3.12.7) - Animations
- `aos` (v2.3.4) - Scroll animations
- `react-confetti` (v6.1.0) - Confetti effects
- `swiper` (v10.0.4) - Carousel/slider
- `react-scroll` (v1.9.3) - Smooth scrolling
- `react-toastify` (v9.1.3) - Toast notifications
- `lucide-react` (v0.544.0) - Icon library
- `react-icons` (v5.5.0) - Icon sets
- `react-helmet` (v6.1.0) - Document head management

**Data & Utilities:**
- `jwt-decode` (v4.0.0) - JWT decoding
- `dayjs` (v1.11.11) - Date library
- `uuid` (v11.1.0) - UUID generation
- `lodash` (v4.17.21) - Utilities
- `axios` (v0.27.2) - HTTP client
- `joi` (v17.13.1) - Validation
- `file-type` (v21.0.0) - File type detection

**Performance & SEO:**
- `react-virtualized` (v9.22.5) - Virtual scrolling
- `react-intersection-observer` (v9.16.0) - Intersection observer
- `web-vitals` (v2.1.4) - Web performance metrics

### Admin Dashboard Stack
- **Framework:** React (v18.3.1)
- **Build Tool:** Craco (v7.1.0) - CRA config override
- **Port:** 3001

**Admin-specific Libraries:**
- `@tinymce/tinymce-react` (v5.1.1) - Rich text editor
- `react-beautiful-dnd` (v13.1.1) - Drag & drop
- `react-csv` (v2.2.2) - CSV export
- `react-slugify` (v4.0.1) - URL slug generation
- `xlsx` (v0.18.5) - Excel handling
- `ant-table-extensions` (v2.0.0) - Table enhancements
- `craco-less` (v3.0.1) - Less CSS support

---

## 3. MAIN COMPONENTS & MODULES

### Backend Routes (API Endpoints)

**Public/Unauthenticated Routes:**
- `/general` - General information endpoints
- `/forms` - Form submission handling
- `/auth` - Authentication (login, signup, OTP, reset)
- `/courses` - Course listings
- `/services` - Service listings
- `/stats` - Platform statistics
- `/options` - Global options/settings
- `/google-api` - Google Services integration

**Authenticated User Routes (Personal):**
- `/personal` - Personal account management
- `/pro-access` - Pro access features
- `/business-plans` - Subscription plans
- `/personal/details/:id` - User profile
- `/personal/login` - OTP-based login
- `/personal/edit-profile/:id` - Profile editing

**Business Account Routes:**
- `/business` - Business profile management
- `/business-plans/:id/payments` - Payment history
- Business registration, verification, media upload
- Business analytics and statistics

**Admin Routes (Authenticated):**
- `/admin/auth` - Admin authentication
- `/admin/users` - User management
- `/admin/roles` - Role management
- `/admin/feedbacks` - Feedback management
- `/admin/business-users` - Business user management
- `/admin/content/*` - Content management
- `/admin/logs` - Activity logging
- `/admin/mailchimp/*` - Mailchimp integration

**AI Routes (Special Auth):**
- `/ai/auth` - AI service authentication
- `/ai/content` - AI content management

**Bot Routes (Special Auth):**
- `/bot/auth` - Bot service authentication
- `/bot/user` - Bot user interactions
- `/bot/general` - Bot general features
- `/bot/pro-access` - Bot pro access features

**Payment Routes:**
- `/razorpay/webhook` - Razorpay webhook handler
- Payment status updates and invoice generation

### Database Models (51 Total)

**User & Account Management Models:**
1. `personalAccount.js` - Individual user profiles
2. `businessAccount.js` - Business profiles with complex schema
3. `admin.js` - Admin user accounts
4. `apiUser.js` - API service users
5. `aiUsers.js` - AI service users
6. `userDevice.js` - User device tracking for security

**Business Management:**
7. `businessTypes.js` - Business category types
8. `businessPlan.js` - Subscription plan definitions
9. `businessUserPlan.js` - User subscription tracking
10. `businessVerifications.js` - Business verification status
11. `businessWorkFlowQuestion.js` - Business questionnaire
12. `businessAccountOptions.js` - Business-specific options
13. `businessCustomOptions.js` - Custom business settings
14. `businessInvoice.js` - Invoice records
15. `businessDeleteRequests.js` - Soft delete requests
16. `businessEditRequest.js` - Edit request tracking

**Subscription & Payment:**
17. `subscriptionLogs.js` - Subscription event logging
18. `paymentLogs.js` - Payment transaction logging
19. `businessUserPlan.js` - Active subscriptions

**Content & Media:**
20. `media.js` - File/image metadata
21. `knowledgeBaseMedia.js` - Knowledge base files
22. `slider.js` - Homepage slider content
23. `courses.js` - Course listings
24. `events.js` - Event management
25. `press.js` - Press releases
26. `publisher.js` - Publisher information
27. `services.js` - Service offerings

**Location & Geographic:**
28. `country.js` - Country listings
29. `state.js` - State/province listings
30. `city.js` - City listings
31. `pincodes.js` - Postal code data

**Content Management:**
32. `options.js` - Global platform options
33. `customOptions.js` - Custom user options
34. `newsletter.js` - Newsletter subscriptions
35. `mailchimpAudience.js` - Mailchimp integration
36. `footerEntries.js` - Footer content
37. `partnerEntries.js` - Partner listings
38. `contactEntries.js` - Contact submissions

**Engagement & Communication:**
39. `feedback.js` - User feedback
40. `feedbackTopics.js` - Feedback categories
41. `chat.js` - Chat/messaging
42. `reviews.js` - User reviews
43. `proAccessEntries.js` - Pro access records
44. `finalist.js` - Contest finalists

**Administrative & Security:**
45. `role.js` - Role definitions
46. `permissions.js` - Permission mapping
47. `logActivity.js` - Activity logging
48. `personalDeleteRequests.js` - Personal data deletion

**Miscellaneous:**
49. `stats.js` - Platform statistics
50. `jobs.js` - Job listings
51. `voter.js` - Voting records

### Frontend Components (55+ Component Types)

**Layout Components:**
- `Header` - Navigation header
- `Footer`, `FooterV2` - Footer sections
- `Breadcrumb` - Navigation breadcrumb

**Form Components:**
- `TextField` - Text input
- `PasswordInput` - Password field with visibility toggle
- `CustomCheckBoxInput` - Checkbox styling
- `CheckboxButton` - Button-style checkbox
- `RadioButton` - Radio button groups
- `SelectDropdown` - Dropdown selection
- `AutoCompleteField` - Autocomplete suggestions
- `CountryCodeDropdown` - Country code picker
- `YearPicker` - Year selection

**Business Profile Components:**
- `BusinessProfile` - Main profile page
- `BusinessFileUpload`, `BusinessFileUploadEdit` - File upload
- `BusinessViewGallery` - Gallery display
- `BusinessUploadModal` - Upload dialog
- `BusinessNameModal` - Business name editor
- `BusinessCategory` - Category selection
- `BusinessBenefitsModal` - Benefits display

**Specialized Components:**
- `ProfileCard` - User profile card
- `DashboardNoticeCard` - Dashboard notices
- `DashboardPerkCard` - Perks display
- `ReachCard` - Reach metrics
- `ProgressBar`, `ProgressBarLightTheme` - Progress indicators
- `SiteLoader` - Loading states
- `ToastMsg` - Toast notifications
- `DeleteConfirmationModal` - Confirmation dialogs
- `FloatingIcon` - Floating action button
- `GlowCta` - Glowing call-to-action

**Data Display:**
- `VirtualizedListBox` - Virtual scrolling lists
- `FaqAccordion` - FAQ accordion
- `Accordion` - Generic accordion

**Advanced Features:**
- `StoreSettings` - Settings management
- `RoleChangeCongrats` - Role change celebration
- `PromotePopup` - Promotion popups
- `TypingTextAnimation` - Text animation
- `AutoplayVideo` - Auto-playing videos

### Pages (36 Pages)

**Authentication Pages:**
- `Login` - User login page
- `LoginOTP` - OTP verification
- `RegistrationForm` - User signup
- `RegisterOTP` - Signup OTP verification
- `ResetPassword` - Password reset

**Personal User Pages:**
- `Dashboard` - User dashboard
- `EditProfile` - Profile editing
- `ProAccessForm` - Pro access request
- `ContactUs` - Contact form
- `Faqs` - FAQ listing
- `DataTypes` - Data type information

**Business Pages:**
- `FormFive` - Business registration (dark theme)
- `FormFiveLightTheme` - Business registration (light theme)
- `BusinessAccountDetails` - Business details entry
- `BusinessProfile` - Business public profile
- `BusinessAccess` - Business access request
- `ChangeRole` - User role switcher
- `TeamMember/TeamAccess` - Team collaboration

**Information Pages:**
- `Home` - Homepage
- `AboutUs`, `AboutUsV2` - About page versions
- `PrivacyPolicy` - Privacy policy
- `Terms&Condition` - Terms of service
- `BlogsListing` - Blog listing
- `BlogsInner` - Blog article detail
- `NotFound` - 404 page

**Specialized Pages:**
- `Congratulations` - Success celebration
- `CongratulationsLight` - Light theme celebration
- `Comingsoon` - Coming soon page
- `DataTypes` - Data classification
- `Checkout` - Checkout process
- `PaymentSuccessfull` - Payment confirmation

### Admin Dashboard Pages

- `Auth/` - Admin login
- `User/` - User management
- `Roles/` - Role management
- `Feedback/` - Feedback review
- `BusinessAccountUsers/` - Business management
- `Content/` - Content management
- `Logs/` - Activity logging
- `NewsletterSubscriptions/` - Newsletter management

---

## 4. EXISTING TEST COVERAGE

### Current State: MINIMAL/NON-EXISTENT

**Backend Testing:**
- Test script defined: `"test": "echo \"Error: no test specified\" && exit 1"`
- **Status:** No unit tests, integration tests, or e2e tests
- **Framework:** None configured

**Frontend Testing:**
- Test script defined: `"test": "react-scripts test"`
- Sample test file: `App.test.js`
- **Framework:** Jest (implicit from react-scripts)
- **Status:** Basic test setup, no comprehensive coverage
- **Assertion Library:** React Testing Library

**Admin Testing:**
- Test script defined: `"test": "craco test"`
- Sample test file: `App.test.js`
- **Status:** Basic setup only

### Quality Assurance Gaps:
- No unit test suite
- No API integration tests
- No component testing for React
- No E2E testing framework
- No code coverage reporting
- No pre-commit test hooks
- No CI/CD testing pipeline

---

## 5. CONFIGURATION FILES

### Environment Configuration

**Backend: `config/config.js`**
- Database credentials (MongoDB)
- SMTP/Email configuration
- Redis connection settings
- JWT secrets
- Razorpay payment keys
- AWS S3 bucket configuration
- Google Cloud Storage setup
- Mailchimp API keys
- Google Places API keys
- CloudWatch logging
- ReCAPTCHA keys
- Third-party API keys (TextLocal, FX Rates)

**Frontend Configuration:**
- API endpoint URLs
- Razorpay public key
- Environment-based settings

**Deployment Domains:**
- Production: `archinza.com`, `www.archinza.com`, `admin.archinza.com`
- Beta: `beta.archinza.com`
- IP-based: Development and staging IPs
- CORS enabled for multiple origins

### Package Management

**Backend:**
- npm for Node.js package management
- 62 production dependencies
- No dev dependencies listed

**Frontend (Main):**
- npm for React packages
- 57 production dependencies
- No dev dependencies specified

**Admin:**
- npm with Craco for CRA customization
- 28 production dependencies

### Build Configuration

**Frontend:**
- React Scripts v5.0.1 (Create React App)
- ESLint configuration for code quality
- Browserslist for target browsers

**Admin:**
- Craco v7.1.0 for config overrides
- Less CSS support via craco-less
- TinyMCE editor integration

---

## 6. DEPENDENCIES & THIRD-PARTY INTEGRATIONS

### Payment Gateway
- **Razorpay** - Subscription billing
  - Webhook handling for payment events
  - Support for cards, UPI, net banking, wallets
  - Recurring subscription management
  - Invoice generation

### Email & Marketing
- **SendGrid/SMTP** - Transactional emails
- **Mailchimp** - Newsletter management and audience segmentation

### Cloud Services
- **AWS S3** - Media file storage
- **Google Cloud Storage** - Backup/secondary storage
- **AWS CloudWatch** - Application logging and monitoring

### APIs & Services
- **Google Places API** - Business location services
- **Google Geocoding API** - Location coordinates
- **Google Autocomplete API** - Address suggestions
- **FX Rates API** - Currency conversion
- **TextLocal** - SMS notifications
- **MSG91** - SMS notifications (backup)

### Job Scheduling
- **Agenda** - MongoDB-based job scheduler
- **Bull/BullMQ** - Message queue system
- **Node-cron** - Scheduled tasks

### Security & Validation
- **JWT** - Token-based authentication
- **bcrypt** (implicit) - Password hashing
- **Joi** - Schema validation
- **ReCAPTCHA** - Bot prevention

### File Processing
- **Canvas** - Image rasterization
- **PDF-lib** - PDF manipulation
- **PDFJS** - PDF rendering
- **heic-convert** - iPhone image conversion
- **Unzipper** - Archive handling

---

## 7. API ENDPOINTS SUMMARY

### Authentication Endpoints
```
POST   /auth/login                - User login
POST   /auth/signup              - User registration
POST   /auth/signup/otp          - OTP generation
POST   /auth/signup/otp/verify   - OTP verification
POST   /auth/forgot              - Password reset request
POST   /auth/reset               - Password reset
POST   /auth/verify-token        - Token validation
```

### Personal Account Endpoints
```
GET    /personal/details/:id                - Get user details
GET    /personal/edit-profile/:id          - Get edit profile data
POST   /personal/login                     - OTP-based login
POST   /personal/register                  - User registration
PUT    /personal/update/:id                - Update profile
```

### Business Account Endpoints
```
POST   /business/create                    - Create business
GET    /business/:id                       - Get business profile
PUT    /business/:id                       - Update business
POST   /business/:id/verify                - Request verification
GET    /business/:id/media                 - Get business media
POST   /business/:id/media                 - Upload media
DELETE /business/:id/media/:mediaId        - Delete media
```

### Subscription/Payment Endpoints
```
GET    /business-plans/                    - List plans
GET    /business-plans/:id/payments        - Payment history
POST   /business-plans/:id/subscribe       - Create subscription
POST   /razorpay/webhook                   - Webhook receiver
```

### Admin Endpoints
```
/admin/auth              - Admin authentication
/admin/users             - User management
/admin/roles             - Role management
/admin/business-users    - Business management
/admin/content/*         - Content management
/admin/logs              - Activity logs
/admin/mailchimp/*       - Mailchimp management
```

### AI/Bot Routes
```
/ai/auth                 - AI service auth
/ai/content              - AI content
/bot/auth                - Bot auth
/bot/user                - Bot user endpoints
/bot/general             - Bot general
/bot/pro-access          - Bot pro features
```

---

## 8. DATABASE MODELS & SCHEMAS

### Core Relationships

```
PersonalAccount
├── ProAccessEntry (virtual)
├── UserDevice
├── Reviews
└── PaymentLogs

BusinessAccount
├── BusinessAccountOptions
├── BusinessUserPlan
├── BusinessPlan
├── Media
├── BusinessVerifications
├── BusinessInvoice
├── SubscriptionLog
└── PaymentLog

Role
├── Permissions
└── AdminUsers
```

### Key Schema Features

**PersonalAccount Schema:**
- User type (student, freelancer, business owner, etc.)
- Contact information (phone, WhatsApp, email)
- Location data (country, state, city, pincode)
- Authentication tokens and expiry
- Soft delete capability
- Onboarding source tracking

**BusinessAccount Schema:**
- Business details (name, type, category)
- Multiple email addresses (general, support, sales, etc.)
- Multiple physical addresses
- Google location (latitude, longitude)
- Owner information (name, contact, private flags)
- Brand assets (logo, portfolio)
- Profile status and verification

**BusinessPlan Schema:**
- Plan name and pricing
- Billing cycle duration
- Feature limits (upload, storage, bandwidth)
- Razorpay integration IDs
- Active/default flags

**Media Schema:**
- File metadata and type
- S3/GCP storage references
- Soft delete tracking
- User/business association
- Upload timestamp

---

## 9. AUTHENTICATION & AUTHORIZATION

### Authentication Mechanisms

**JWT Token-Based Auth:**
```javascript
const token = jwt.sign(data, config.secretkey);
// Token includes:
// - User ID
// - User type (personal/business)
// - Auth type flag
// - Standard JWT claims
```

**OTP-Based Login:**
- Email/SMS OTP generation
- 1-hour expiration window
- Session storage in Redis
- Verification via token exchange

**Session Management:**
- Express-session with Redis store
- Secure cookie-based sessions
- 24-hour session duration
- CORS credentials enabled

### Authorization Mechanisms

**Role-Based Access Control (RBAC):**
- Role model with permissions
- Admin role authentication middleware
- Permission-based endpoint access
- Custom `roleAuth` middleware for permission checking

**Token Verification:**
```javascript
// Middleware pattern:
1. Extract Bearer token from Authorization header
2. Verify JWT signature
3. Add decoded user data to req.auth
4. Proceed to route handler
```

**Special Auth Types:**
- Admin authentication (`/admin/auth`)
- Bot authentication (`/bot/auth`)
- AI service authentication (`/ai/auth`)
- Separate auth middlewares for each

### Security Considerations

**Implemented:**
- JWT token validation
- Password hashing (implicit)
- CORS protection
- Session security with Redis
- Webhook signature verification for Razorpay
- Error handling without exposing internals

**Not Implemented/Gaps:**
- No rate limiting visible
- No password complexity requirements enforced in code
- No 2FA for admin accounts
- Limited HTTPS enforcement info
- No account lockout mechanisms visible

---

## 10. FRONTEND COMPONENTS & PAGES

### Component Architecture

**Functional Components with Hooks:**
- React Context for state management
- Custom hooks for business logic
- Props-based component composition

**State Management Layers:**

1. **Global Context (AuthContext)**
   - User authentication state
   - Token management
   - User type (personal/business)

2. **Business Context (BusinessAccountContext)**
   - Current business data
   - Business profile
   - Subscription status

3. **Pro Access Context (ProAccessContext)**
   - Pro access eligibility
   - Feature availability

4. **Global Data Context (GlobalDataContext)**
   - Global app state
   - Cached data
   - Shared utilities

### Component Hierarchy

```
App.js
├── Header (Navigation)
├── Routes (React Router)
│   ├── Public Routes (Home, About, Blogs, etc.)
│   ├── Protected Routes (Dashboard, Profile, etc.)
│   └── Admin Routes
└── Footer
```

### Page Structure Patterns

**Authentication Pages:**
- Multi-step forms (FormFive - 5 steps)
- OTP verification flows
- Password recovery flows
- Account type selection

**Business Pages:**
- Dynamic media upload
- File validation and processing
- Real-time preview
- Multi-field forms with validation

**Admin Pages:**
- Data tables with pagination
- Bulk operations
- Content editors (TinyMCE)
- Drag-and-drop functionality

### Styling Approach

- **CSS Framework:** Material-UI + Ant Design + Bootstrap
- **Custom SCSS:** `common.scss`, component-specific styles
- **Responsive Design:** Mobile-first approach
- **Theme Support:** Light/Dark theme capability

---

## 11. CRITICAL FILES & DIRECTORIES

### Essential Backend Files

**Core Files:**
- `/index.js` - Server entry point, route configuration
- `/config/config.js` - Environment configuration
- `/helpers/api.js` - Utility functions, response formatting (16KB)
- `/helpers/db.js` - Database connection

**Critical Routes:**
- `/routes/business.js` - Main business logic (1587 lines)
- `/routes/personal.js` - Personal account logic (785 lines)
- `/routes/auth.js` - Authentication endpoints
- `/routes/businessSubscription.js` - Payment handling
- `/routes/razorpay/webhook.js` - Payment webhook

**Middleware:**
- `/middlewares/auth.js` - JWT verification
- `/middlewares/upload.js` - File upload handling (450+ lines)
- `/middlewares/errorHandler.js` - Error handling
- `/middlewares/roleAuth.js` - Role-based access

**Job Schedulers:**
- `/jobs/agenda.js` - Main job scheduler
- `/jobs/notificationsAgenda.js` - Notification scheduling
- `/jobs/businessNotificationsAgenda.js` - Business notifications

**Database Models:**
- `/models/personalAccount.js` - User schema
- `/models/businessAccount.js` - Business schema (900+ lines)
- `/models/businessPlan.js` - Subscription plans
- `/models/businessUserPlan.js` - Active subscriptions

**Logging:**
- `/logger/index.js` - Logger factory
- `/logger/cloudwatch_dev_logger.js` - Dev logging
- `/logger/cloudwatch_prod_logger.js` - Production logging

### Essential Frontend Files

**Core:**
- `/src/index.js` - App entry point
- `/src/App.js` - Main App component
- `/src/Routing.js` - Route configuration (280 lines)
- `/src/common.scss` - Global styles

**Context:**
- `/src/context/Auth/` - Auth state
- `/src/context/BusinessAccount/` - Business state
- `/src/context/GlobalData/` - Global state

**Components:**
- `/src/components/Header/` - Navigation
- `/src/components/ProtectedRoute/` - Auth guard
- `/src/components/helpers/` - Utility components

**Pages:**
- `/src/pages/Dashboard/` - User dashboard
- `/src/pages/BusinessProfile/` - Business profile
- `/src/pages/FormFive/` - Multi-step form
- `/src/pages/Login/` - Authentication

**Configuration:**
- `/src/config/` - App configuration
- `/src/helpers/` - Frontend utilities

### Essential Admin Files

- `/src/MainLayout.js` - Admin layout
- `/src/pages/User/` - User management
- `/src/pages/BusinessAccountUsers/` - Business management
- `/src/pages/Content/` - Content management

### Documentation Files

- `/docs/MODELS_DOCUMENTATION.md` - Database schema docs
- `/docs/RAZORPAY_INTEGRATION.md` - Payment integration guide
- `/node-archinza-beta/models/MODELS_DOCUMENTATION.md` - Detailed model docs

---

## 12. QUALITY ASSURANCE MEASURES

### Implemented QA Measures

**Code Validation:**
- Joi schema validation for all inputs
- Frontend form validation with custom validators
- Request body validation in API routes

**Error Handling:**
- Express async error handling via `express-async-handler`
- Global error handler middleware
- Try-catch patterns in async functions
- Specific error responses for different scenarios

**Logging & Monitoring:**
- Winston logger with rotation
- CloudWatch integration for production
- Activity logging model (`logActivity.js`)
- Request/response logging middleware

**Session Management:**
- Redis-backed session store
- Secure cookie configuration
- OTP-based login verification

**File Upload Security:**
- Multer for file handling
- AWS S3 for secure storage
- File type validation (implicit)
- File size limits via multer

### Missing QA Measures

**Testing:**
- No unit tests
- No integration tests
- No E2E tests
- No test coverage reporting

**Code Quality:**
- No code linting (ESLint) visible in backend
- Limited frontend ESLint configuration
- No code formatting (Prettier) setup
- No pre-commit hooks

**Performance:**
- No API rate limiting visible
- No caching strategy documented
- No database query optimization visible
- No performance monitoring setup

**Security:**
- No API input sanitization visible
- No SQL injection prevention (safe with Mongoose)
- Limited HTTPS/TLS documentation
- No API versioning strategy
- No API key management for external services

**Documentation:**
- Basic README files
- Model documentation exists
- No API documentation (Swagger/OpenAPI)
- No architecture documentation
- No deployment guide

---

## SUMMARY TABLE

| Aspect | Status | Details |
|--------|--------|---------|
| **Type** | Production | Full-stack B2B2C platform |
| **Architecture** | Monorepo | 3 apps: Backend, Frontend, Admin |
| **Frontend** | React 18 | Material-UI, Ant Design, Bootstrap |
| **Backend** | Express.js | Node.js with MongoDB |
| **Database** | MongoDB | 51 models with Mongoose |
| **Authentication** | JWT + OTP | Token-based + session-based |
| **Payments** | Razorpay | Recurring subscriptions |
| **File Storage** | AWS S3 + GCS | Media and document handling |
| **Email** | SendGrid/SMTP | Transactional emails |
| **Job Scheduling** | Agenda/BullMQ | Background jobs |
| **Logging** | Winston + CloudWatch | Structured logging |
| **Testing** | Minimal | Only sample test files |
| **Documentation** | Partial | Models and payments only |
| **Deployment** | Production Ready | Multiple domain support |
| **Code Size** | 189K LOC | 639 source files |

---

## IDENTIFIED CRITICAL AREAS FOR 18-POINT TESTING AUDIT

1. **Authentication & Authorization** - JWT validation, OTP flows, RBAC
2. **API Endpoint Functionality** - CRUD operations, business logic
3. **Payment Processing** - Razorpay integration, webhook handling
4. **File Upload & Storage** - S3 integration, file handling
5. **Database Operations** - CRUD, relationships, data integrity
6. **Frontend Route Protection** - Protected routes, redirects
7. **Error Handling** - Exception handling, error responses
8. **Session Management** - Redis sessions, token expiry
9. **Email Notifications** - OTP, transactional emails
10. **Business Logic** - Subscription, verification, pro access
11. **Admin Functions** - User management, content management
12. **Data Validation** - Input validation, Joi schemas
13. **CORS & Headers** - Origin validation, security headers
14. **Job Scheduling** - Background task execution
15. **Media Processing** - File conversion, thumbnail generation
16. **Search & Filtering** - Database queries, Fuse.js search
17. **Performance** - Response times, query optimization
18. **Security** - Token handling, data protection, API abuse

