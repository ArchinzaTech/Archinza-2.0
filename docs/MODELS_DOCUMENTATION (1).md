# Archinza Models Documentation

This document provides comprehensive documentation for all Mongoose models used in the Archinza platform.

## Table of Contents

1. [User & Account Management](#user--account-management)
2. [Business Management](#business-management)
3. [Content & Media](#content--media)
4. [Location & Geographic Data](#location--geographic-data)
5. [Subscription & Payment](#subscription--payment)
6. [Administrative & Security](#administrative--security)
7. [Engagement & Communication](#engagement--communication)
8. [Miscellaneous](#miscellaneous)

---

## User & Account Management

### PersonalAccount
**File:** `personalAccount.js`

Personal user accounts for individual users on the platform.

#### Schema Fields:
- `user_type` (String) - Type of user (e.g., student, team member, business owner, freelancer)
- `name` (String) - User's full name
- `email` (String) - User's email address
- `password` (String) - Hashed password
- `country_code` (String) - Country code for phone number
- `phone` (String) - Phone number
- `whatsapp_country_code` (String) - WhatsApp country code
- `whatsapp_no` (String) - WhatsApp number
- `country` (String) - User's country
- `state` (String) - User's state
- `city` (String) - User's city
- `pincode` (String) - Postal/ZIP code
- `status` (String) - Account status
- `dashboard_token` (String) - Token for dashboard access
- `token_expiry` (Date) - Token expiration date
- `onboarding_source` (String) - Source from which user was onboarded
- `isDeleted` (Boolean, default: false) - Soft delete flag
- `deletedAt` (Date, default: null) - Deletion timestamp

#### Virtual Fields:
- `proAccessEntry` - Virtual relationship to ProAccessEntry model

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### BusinessAccount
**File:** `businessAccount.js`

Business accounts for companies and organizations on the platform.

#### Schema Fields:

**Basic Information:**
- `business_name` (String) - Name of the business
- `email` (String) - Business email
- `username` (String, unique) - Unique username for the business
- `password` (String) - Hashed password
- `country_code` (String) - Country code for phone
- `phone` (String) - Business phone number
- `whatsapp_country_code` (String) - WhatsApp country code
- `whatsapp_no` (String) - WhatsApp number
- `brand_logo` (String) - URL to brand logo
- `bio` (String) - Business biography/description
- `status` (String) - Account status
- `business_address` (String) - Primary business address

**Contact Information:**
- `email_ids` (Array) - Multiple email addresses with types
  - `email` (String) - Email address
  - `type` (String) - Email type (e.g., general, support, sales)
- `addresses` (Array) - Multiple physical addresses with types
  - `address` (String) - Address text
  - `type` (String) - Address type

**Location:**
- `google_location` (Object)
  - `latitude` (String)
  - `longitude` (String)
- `keywords` (Array of Strings) - SEO/search keywords
- `city` (String) - Business city
- `country` (String) - Business country
- `pincode` (String) - Postal code

**Owner Details:**
- `owners` (Array of Objects)
  - `name` (String, required) - Owner name
  - `email` (String, required) - Owner email
  - `country_code` (String) - Phone country code
  - `phone` (String) - Phone number
  - `whatsapp_country_code` (String) - WhatsApp country code
  - `whatsapp_no` (String) - WhatsApp number
  - Each field has `isPrivate` (Boolean) option

**Business Profile:**
- `business_types` (Array of ObjectId, ref: BusinessType) - Types of business
- `services` (Array of Strings) - Services offered
- `is_services_manually` (Boolean, default: false) - Manual service selection flag
- `renovation_work` (String) - Whether business does renovation work
- `product_positionings` (Array of Strings) - Product positioning strategies
- `featured_services` (Array of Strings) - Highlighted services

**Project Information (with privacy flags):**
- `project_sizes` (Object)
  - `sizes` (Array of Strings)
  - `unit` (String)
  - `isPrivate` (Boolean)
- `project_typology` (Object)
  - `data` (Array of Strings)
  - `isPrivate` (Boolean)
- `project_mimimal_fee` (Object)
  - `fee` (String)
  - `currency` (String)
  - `isPrivate` (Boolean)
- `design_style` (Object)
  - `data` (Array of Strings)
  - `isPrivate` (Boolean)
- `avg_project_budget` (Object)
  - `budgets` (Array of Strings)
  - `currency` (String)
  - `isPrivate` (Boolean)
- `project_scope` (Object)
  - `data` (Array of Strings)
  - `isPrivate` (Boolean)
- `project_location` (Object)
  - `data` (String)
  - `isPrivate` (Boolean)

**Business Details (with privacy flags):**
- `establishment_year` (Object)
  - `data` (String)
  - `isPrivate` (Boolean)
- `team_range` (Object)
  - `data` (String)
  - `isPrivate` (Boolean)
- `price_rating` (String with isPrivate)
- `market_segment` (String with isPrivate)
- `sustainability_rating` (String with isPrivate)

**Social & Web Presence (with privacy flags):**
- `website_link` (String with isPrivate)
- `instagram_handle` (String with isPrivate)
- `linkedin_link` (String with isPrivate)

**Enquiry Preferences:**
- `enquiry_preferences` (Object) - Contact preferences for different enquiry types
  - `projects_business` (Object)
    - `contact_person` (String)
    - `contact_methods` (Array of Strings)
  - `product_material` (Object)
  - `jobs_internships` (Object)
  - `media_pr` (Object)

**Business Hours:**
- `business_hours` (Array)
  - `day` (String)
  - `open` (String)
  - `close` (String)
  - `isClosed` (Boolean)

**System Fields:**
- `media_consent_approval` (Boolean, default: false) - Media usage consent
- `isVerified` (Boolean, default: false) - Verification status
- `pageStatus` (String, default: "offline") - Page visibility status
- `onboarding_source` (String) - Onboarding source tracking
- `additional_web_urls` (Array of Strings) - Additional website URLs
- `other_busiess_type` (String) - Other business type description
- `scrap_content_task_id` (String) - Web scraping task ID
- `last_updated_scraped_content` (Date) - Last scraping timestamp
- `new_scraped_content` (Boolean, default: false) - New content flag
- `firstValidAt` (Date) - First validation date
- `scraped_city` (String) - City from scraped data
- `scraped_country` (String) - Country from scraped data
- `scraped_pincode` (String) - Pincode from scraped data
- `isDeleted` (Boolean, default: false) - Soft delete flag
- `deletedAt` (Date) - Deletion timestamp

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### UserDevice
**File:** `userDevice.js`

Tracks devices used by users for security and session management.

#### Schema Fields:
- `user` (ObjectId, required, refPath: userModel) - Reference to user
- `userModel` (String, required, enum: ["PersonalAccount", "BusinessAccount"]) - Type of user account
- `deviceId` (String) - Unique device identifier
- `browser` (String) - Browser information
- `os` (String) - Operating system
- `ip` (String) - IP address
- `location` (Object)
  - `country` (String)
  - `city` (String)
  - `region` (String)
- `deviceType` (String, default: "desktop") - Type of device
- `isCurrent` (Boolean, default: true) - Whether this is the current active device
- `lastUsed` (Date, default: Date.now) - Last usage timestamp

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### ProAccessEntry
**File:** `proAccessEntries.js`

Stores professional access questionnaire responses for users.

#### Schema Fields:
- `user` (ObjectId, ref: PersonalAccount) - User who filled the form
- `user_type` (String) - Type of user (student, team member, business owner, freelancer)
- `status` (String) - Status of the entry

**Student Fields (st_):**
- `st_study_field` (Array) - Fields of study
- `st_graduate_year` (String) - Expected/actual graduation year
- `st_unmet_needs` (String) - Primary unmet need
- `all_st_unmet_needs` (Array) - All selected unmet needs

**Team Member Fields (tm_):**
- `tm_job_profile` (Array) - Job profiles/roles
- `tm_experience` (String) - Years of experience
- `tm_unmet_needs` (String) - Primary unmet need
- `all_tm_unmet_needs` (Array) - All selected unmet needs

**Business Owner Fields (bo_):**
- `bo_buss_establishment` (String) - When business was established
- `bo_unmet_needs` (String) - Primary unmet need
- `all_bo_unmet_needs` (Array) - All selected unmet needs

**Freelancer Fields (fl_):**
- `fl_establishment` (String) - When started freelancing
- `fl_unmet_needs` (String) - Primary unmet need
- `all_fl_unmet_needs` (Array) - All selected unmet needs

#### Indexes:
- Compound index on `updatedAt` and `status`

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

## Business Management

### BusinessType
**File:** `businessTypes.js`

Defines different types of businesses available on the platform.

#### Schema Fields:
- `name` (String) - Name of the business type
- `description` (String) - Description of the business type
- `prefix` (String) - Prefix for identification
- `icon` (String) - Icon/image URL for the business type

---

### BusinessWorkFlowQuestion
**File:** `businessWorkFlowQuestion.js`

Questions used in business onboarding workflow.

#### Schema Fields:
- `question` (String) - The question text
- `business_types` (Array of ObjectId, ref: BusinessType) - Business types this question applies to

---

### BusinessAccountOption
**File:** `businessAccountOptions.js`

Configuration options available for business accounts.

#### Schema Fields:
- `product_positionings` (Array of Strings) - Available product positioning options
- `project_typologies` (Array of Strings) - Available project typology options
- `average_budget` (Array of Objects)
  - `budget` (String)
  - `currency` (String)
- `minimum_project_fee` (Array of Strings) - Minimum fee options
- `project_sizes` (Array of Objects)
  - `size` (String)
  - `unit` (String)
- `price_ratings` (Array of Strings) - Price rating options
- `design_styles` (Array of Strings) - Available design styles
- `project_scope_preferences` (Array of Strings) - Project scope options
- `project_locations` (Array of Strings) - Location options
- `team_member_ranges` (Array of Strings) - Team size ranges
- `latest_currency` (Object) - Currency exchange rate information
  - `base_currency` (String)
  - `target_currency` (String)
  - `exchange_rate` (Number)
  - `last_updated` (Date)
- `email_types` (Array of Strings) - Email type options
- `address_types` (Array of Strings) - Address type options
- `addon_services` (Array of Strings) - Available addon services

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### BusinessCustomOption
**File:** `businessCustomOptions.js`

Custom options submitted by business users for approval.

#### Schema Fields:
- `question` (String) - The question/category
- `question_slug` (String) - URL-friendly question identifier
- `options` (Array) - Custom options submitted
  - `value` (String) - Option value
  - `status` (String, default: "pending") - Approval status
- `user` (ObjectId) - User who submitted the option
- `status` (String) - Overall status

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### BusinessVerification
**File:** `businessVerifications.js`

Tracks business verification requests and status.

#### Schema Fields:
- `user` (ObjectId, ref: BusinessAccount) - Business account being verified
- `status` (String) - Verification status (e.g., pending, approved, rejected)

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### BusinessEditRequest
**File:** `businessEditRequest.js`

Tracks edit requests from business accounts requiring admin approval.

#### Schema Fields:
- `user` (ObjectId, ref: BusinessAccount) - Business requesting edit
- `status` (String, default: "pending") - Request status
- `role_user` (ObjectId, ref: Admin) - Admin who processed the request

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### BusinessDeleteRequests
**File:** `businessDeleteRequests.js`

Tracks business account deletion requests.

#### Schema Fields:
- `user` (ObjectId, ref: BusinessAccount) - Business requesting deletion
- `status` (String, default: "pending") - Request status
- `role_user` (ObjectId, ref: Admin) - Admin who processed the request

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### PersonalDeletionRequest
**File:** `personalDeleteRequests.js`

Tracks personal account deletion requests.

#### Schema Fields:
- `user` (ObjectId, ref: PersonalAccount) - User requesting deletion
- `status` (String, default: "pending") - Request status
- `role_user` (ObjectId, ref: Admin) - Admin who processed the request

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

## Content & Media

### Media
**File:** `media.js`

Media files uploaded by business accounts.

#### Schema Fields:
- `name` (String) - File name
- `url` (String) - File URL
- `mimetype` (String) - MIME type of the file
- `size` (String) - File size
- `height` (String) - Image height (for images)
- `width` (String) - Image width (for images)
- `visibility` (Boolean, default: true) - Whether media is visible
- `userId` (ObjectId, ref: BusinessAccount, required) - Owner of the media
- `category` (String) - Media category
- `softDelete` (Boolean, default: false) - Soft delete flag
- `deletedAt` (Date) - Deletion timestamp
- `pinned` (Boolean, default: false) - Whether media is pinned
- `isUnused` (Boolean, default: false) - Whether media is unused
- `fileHash` (String) - Hash of the file for duplicate detection
- `thumbnail` (String) - Thumbnail URL
- `masonryPosition` (Number) - Position in masonry layout
- `replacedAt` (Date) - When file was replaced
- `originalPosition` (Number) - Original position

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

#### Notes:
- Contains commented-out TTL index for automatic deletion of soft-deleted items after 24 hours

---

### KnowledgebaseMedia
**File:** `knowledgeBaseMedia.js`

Media files for the knowledge base section.

#### Schema Fields:
- `name` (String) - File name
- `url` (String) - File URL
- `mimetype` (String) - MIME type
- `size` (String) - File size
- `visibility` (Boolean, default: true) - Visibility flag
- `userId` (ObjectId, ref: BusinessAccount, required) - Owner of the media

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Slider
**File:** `slider.js`

Homepage/section slider images and videos.

#### Schema Fields:
- `image` (String, default: null) - Image URL
- `type` (String, default: "image") - Media type (image/video)
- `url` (String, default: null) - External URL if needed
- `thumbnail` (String, default: null) - Thumbnail URL
- `status` (Number, default: 1) - Active status (1=active, 0=inactive)
- `sort_order` (Number, default: 0) - Display order

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Press
**File:** `press.js`

Press coverage and media mentions.

#### Schema Fields:
- `title` (String) - Press article title
- `author` (String) - Article author
- `image` (String) - Featured image URL
- `website` (String) - Publication website
- `date` (Date) - Publication date
- `status` (Number, default: 1) - Active status
- `publisher` (ObjectId, ref: Publisher) - Publisher reference
- `sort_order` (Number, default: 1) - Display order

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Publisher
**File:** `publisher.js`

Publishers/media outlets.

#### Schema Fields:
- `title` (String) - Publisher name
- `slug` (String) - URL-friendly identifier
- `image` (String) - Publisher logo/image
- `status` (Number, default: 1) - Active status

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

## Location & Geographic Data

### Country
**File:** `country.js`

Country master data.

#### Schema Fields:
- `id` (Number) - Country ID
- `name` (String) - Country name

---

### State
**File:** `state.js`

State/province master data.

#### Schema Fields:
- `id` (Number) - State ID
- `name` (String) - State name
- `country_id` (Number) - Parent country ID
- `country_code` (String) - Country code
- `country_name` (String) - Country name

---

### City
**File:** `city.js`

City master data.

#### Schema Fields:
- `id` (Number) - City ID
- `name` (String) - City name
- `state_id` (Number) - Parent state ID
- `state_code` (String) - State code
- `state_name` (String) - State name
- `country_id` (Number) - Parent country ID
- `country_code` (String) - Country code
- `country_name` (String) - Country name

---

### Pincode
**File:** `pincodes.js`

Postal code/PIN code master data.

#### Schema Fields:
- `id` (Number) - Pincode ID
- `name` (String) - Area name
- `pincode` (String) - Postal/PIN code
- `circle` (String) - Postal circle
- `district` (String) - District name
- `division` (String) - Division name
- `region` (String) - Region name
- `state` (String) - State name
- `country` (String) - Country name

---

## Subscription & Payment

### BusinessPlan
**File:** `businessPlan.js`

Subscription plans available for business accounts.

#### Schema Fields:
- `name` (String) - Plan name
- `price` (Number) - Plan price
- `description` (String) - Plan description
- `durationInMonths` (Number) - Billing cycle duration
- `features` (Object) - Plan features and limits
  - `fileUploadLimit` (Number, default: 5) - Max file uploads
  - `filePageLimit` (Number, default: 100) - Max pages per file
  - `fileSizeLimitMB` (Number, default: 100) - Max file size in MB
  - `imagesLimit` (Number, default: 200) - Max images
  - `externalLinksLimit` (Number, default: 0) - Max external links
  - `privateContentToggle` (Boolean, default: false) - Private content feature
  - `communityAccess` (Boolean, default: false) - Community access feature
  - `recentlyDeletedLimit` (Number, default: 0) - Recently deleted items limit
  - `unusedImagesLimit` (Number, default: 0) - Unused images limit
- `razorpayPlanId` (String) - Razorpay plan identifier
- `isActive` (Boolean, default: true) - Plan availability
- `isDefault` (Boolean, default: false) - Default plan flag

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### BusinessUserPlan
**File:** `businessUserPlan.js`

Active subscriptions for business accounts.

#### Schema Fields:
- `businessAccount` (ObjectId, ref: BusinessAccount) - Subscribed business
- `plan` (ObjectId, ref: BusinessPlan) - Active plan
- `startDate` (Date, default: Date.now) - Subscription start date
- `endDate` (Date) - Subscription end date
- `isActive` (Boolean, default: true) - Active status
- `paymentStatus` (String) - Payment status
- `razorpaySubscriptionId` (String) - Razorpay subscription ID
- `razorpayPaymentId` (String) - Razorpay payment ID
- `razorpayOrderId` (String) - Razorpay order ID
- `nextBillingDate` (Date) - Next billing date

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Invoice
**File:** `businessInvoice.js`

Payment invoices for business subscriptions.

#### Schema Fields:
- `invoiceId` (String, unique) - Unique invoice identifier
- `businessId` (ObjectId, ref: BusinessAccount) - Business being invoiced
- `plan` (ObjectId, ref: BusinessPlan) - Plan for this invoice
- `subscriptionId` (String) - Related subscription ID
- `paymentId` (String) - Payment gateway ID
- `amount` (Number) - Invoice amount
- `currency` (String, default: "INR") - Currency code
- `status` (String, default: "captured") - Payment status
- `paymentMethod` (Object) - Payment method details
  - `type` (String) - Payment method type
  - `info` (String) - Additional info
  - `network` (String) - Card network (if applicable)
- `customer` (Object) - Customer details
  - `name` (String)
  - `email` (String)
  - `contact` (String)
  - `address` (String)
- `invoiceDate` (Date, default: Date.now) - Invoice generation date
- `nextBillingDate` (Date) - Next billing date
- `rawPayload` (Object) - Complete payment gateway response

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### PaymentLog
**File:** `paymentLogs.js`

Logs all payment events and webhooks.

#### Schema Fields:
- `businessAccount` (ObjectId, ref: BusinessAccount) - Related business account
- `subscriptionId` (String) - Subscription identifier
- `razorpayPaymentId` (String) - Razorpay payment ID
- `amount` (Number) - Payment amount
- `currency` (String) - Currency code
- `status` (String) - Payment status
- `event` (String) - Event type
- `rawPayload` (Object) - Complete webhook payload
- `desc` (String) - Description
- `cycleStart` (Date) - Billing cycle start
- `cycleEnd` (Date) - Billing cycle end
- `createdAt` (Date, default: Date.now) - Log timestamp

---

### SubscriptionLog
**File:** `subscriptionLogs.js`

Logs subscription-related events.

#### Schema Fields:
- `businessAccount` (ObjectId, ref: BusinessAccount) - Related business account
- `customer_id` (String) - Customer ID
- `razorpaySubscriptionId` (String) - Razorpay subscription ID
- `razorpayPlanId` (String) - Razorpay plan ID
- `rawResponse` (Object) - Complete API response
- `status` (String) - Subscription status
- `latest_payment_method` (String) - Most recent payment method
- `createdAt` (Date, default: Date.now) - Log timestamp

---

## Administrative & Security

### Admin
**File:** `admin.js`

Administrator accounts.

#### Schema Fields:
- `name` (String, required) - Admin name
- `email` (String, required) - Admin email
- `password` (String, required) - Hashed password
- `role` (ObjectId, ref: Role) - Admin role

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Role
**File:** `role.js`

Role definitions for role-based access control.

#### Schema Fields:
- `name` (String, required, unique) - Role name
- `description` (String) - Role description
- `permissions` (Array of ObjectId, ref: Permission) - Assigned permissions
- `metadata` (Object) - Additional metadata

---

### Permission
**File:** `permissions.js`

Permission definitions for granular access control.

#### Schema Fields:
- `name` (String, required, unique) - Permission name
- `description` (String) - Permission description
- `resource` (String, required) - Resource this permission applies to
- `action` (String, required) - Action allowed (e.g., read, write, delete)
- `fields` (Array of Strings) - Specific fields this permission applies to
- `constraints` (Object) - Additional constraints (e.g., field masking, locked fields)

---

### LogActivity
**File:** `logActivity.js`

Activity logs for admin actions.

#### Schema Fields:
- `user` (ObjectId, ref: Admin) - Admin who performed the action
- `action_type` (String) - Type of action performed
- `module` (String) - Module/section affected
- `subModule` (String) - Sub-module affected
- `resource` (ObjectId) - ID of affected resource
- `details` (Object) - Additional details about the action
- `status` (String) - Action status

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### ApiUser
**File:** `apiUser.js`

Users for API access.

#### Schema Fields:
- `name` (String, required) - API user name
- `email` (String, required) - API user email
- `password` (String, required) - API key/password

---

### AIUser
**File:** `aiUsers.js`

Users for AI service access.

#### Schema Fields:
- `name` (String, required) - AI user name
- `email` (String, required) - AI user email
- `password` (String, required) - AI service password/key

---

## Engagement & Communication

### Review
**File:** `reviews.js`

User reviews for business accounts.

#### Schema Fields:
- `rating` (Number) - Numerical rating
- `review` (String) - Review text
- `user` (ObjectId, ref: PersonalAccount) - User who wrote the review
- `business` (ObjectId, ref: BusinessAccount) - Business being reviewed

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Feedback
**File:** `feedback.js`

User feedback and support requests.

#### Schema Fields:
- `id` (String, default: uuidv4, unique) - Unique feedback ID
- `name` (String) - User name
- `whatsapp_country_code` (String) - WhatsApp country code
- `whatsapp_number` (String) - WhatsApp number
- `email` (String) - User email
- `feedback_topic` (String) - Topic/category of feedback
- `feedback_message` (String) - Feedback message
- `status` (String, default: "new") - Feedback status
- `assigned_to` (ObjectId, ref: Admin) - Assigned admin
- `response_status` (String, default: "not_replied") - Response status
- `user_type` (String) - Type of user providing feedback
- `source` (String) - Source of feedback

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### FeedbackTopic
**File:** `feedbackTopics.js`

Available feedback topics/categories.

#### Schema Fields:
- `topic` (String) - Topic name

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Chat
**File:** `chat.js`

Chat conversations.

#### Schema Fields:
- `userId` (ObjectId, ref: PersonalAccount) - User in the chat
- `intent` (String, defaultValue: "") - Chat intent/purpose
- `datetime` (Date) - Chat timestamp
- `chats` (Array) - Chat messages
  - `sender` (String) - Message sender
  - `text` (String) - Message text

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Newsletter
**File:** `newsletter.js`

Newsletter subscriptions.

#### Schema Fields:
- `email` (String) - Subscriber email

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### MailchimpAudience
**File:** `mailchimpAudience.js`

Mailchimp audience/list information.

#### Schema Fields:
- `id` (String) - Mailchimp audience ID
- `name` (String) - Audience name
- Additional fields allowed (strict: false)

---

### ContactEntries
**File:** `contactEntries.js`

Contact form submissions.

#### Schema Fields:
- `name` (String) - Contact name
- `email` (String) - Contact email
- `phone` (String) - Contact phone
- `category` (String) - Enquiry category
- `detail` (String) - Enquiry details

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### PartnerEntries
**File:** `partnerEntries.js`

Partnership enquiry submissions.

#### Schema Fields:
- `name` (String) - Contact name
- `email` (String) - Contact email
- `phone` (String) - Contact phone
- `category` (String) - Partnership category
- `detail` (String) - Partnership details

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### FooterEntries
**File:** `footerEntries.js`

Email subscriptions from footer.

#### Schema Fields:
- `email` (String) - Subscriber email

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

## Miscellaneous

### Job
**File:** `jobs.js`

Job postings by businesses.

#### Schema Fields:
- `title` (String) - Job title
- `location` (String) - Job location
- `mode_of_work` (String) - Work mode (remote, on-site, hybrid)
- `employement_type` (String) - Employment type (full-time, part-time, contract)
- `openings` (String) - Number of openings
- `required_skills` (String) - Required skills
- `experience` (String) - Experience required
- `salary_range` (String) - Salary range
- `application_email` (String) - Email for applications
- `application_description` (String) - Job description
- `business` (ObjectId, ref: BusinessAccount) - Business posting the job

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Course
**File:** `courses.js`

Educational courses offered by businesses.

#### Schema Fields:
- `name` (String) - Course name
- `duration` (String) - Course duration
- `mode_of_learning` (String) - Learning mode (online, offline, hybrid)
- `certificate` (Boolean) - Whether certificate is provided
- `financial_aid` (Boolean) - Whether financial aid is available
- `course_link` (String) - Course URL
- `enquiry_email` (String) - Email for enquiries
- `salary_range` (String) - Expected salary after course
- `course_description` (String) - Course description
- `business` (ObjectId, ref: BusinessAccount) - Business offering the course

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Event
**File:** `events.js`

Events organized by businesses.

#### Schema Fields:
- `name` (String) - Event name
- `event_mode` (String) - Event mode (online, offline, hybrid)
- `location` (String) - Event location
- `event_link` (Boolean) - Event registration link
- `enquiry_email` (String) - Email for enquiries
- `event_description` (String) - Event description
- `business` (ObjectId, ref: BusinessAccount) - Business organizing the event

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Services
**File:** `services.js`

Master list of services available.

#### Schema Fields:
- `services` (Array)
  - `value` (String) - Service name
  - `tag` (String) - Service tag/category

#### Note:
- `_id` field is disabled for this schema

---

### Option
**File:** `options.js`

Configuration options for pro access workflow.

#### Schema Fields:
**Student Options:**
- `st_study_field` (Array) - Study field options
- `st_graduate_year` (Array) - Graduation year options
- `st_unmet_needs` (Array) - Unmet needs options

**Business Owner Options:**
- `bo_buss_establishment` (Array) - Business establishment options
- `bo_unmet_needs` (Array) - Unmet needs options

**Team Member Options:**
- `tm_job_profile` (Array) - Job profile options
- `tm_experience` (Array) - Experience options
- `tm_unmet_needs` (Array) - Unmet needs options

**Freelancer Options:**
- `fl_establishment` (Array) - Freelance establishment options
- `fl_unmet_needs` (Array) - Unmet needs options

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### CustomOption
**File:** `customOptions.js`

Custom options submitted by personal account users.

#### Schema Fields:
- `question` (String) - Question/category
- `question_slug` (String) - URL-friendly identifier
- `options` (Array) - Submitted options
  - `value` (String) - Option value
  - `status` (String, default: "pending") - Approval status
- `user` (ObjectId) - User who submitted
- `status` (String) - Overall status

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Stat
**File:** `stats.js`

Platform statistics.

#### Schema Fields:
- `consultants_registered` (Number) - Number of registered consultants
- `architects_trusting` (Number) - Number of architects trusting the platform
- `people_onboarding` (Number) - People currently onboarding
- `businesses_registered` (Number) - Total businesses registered
- `people_signed_up` (Number) - Total people signed up

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Finalist
**File:** `finalist.js`

Finalists for awards/competitions.

#### Schema Fields:
- `brand_name` (String) - Brand name
- `website` (String) - Brand website
- `instagram` (String) - Instagram handle
- `category` (String) - Competition category
- `members` (Array) - Team members
  - `name` (String) - Member name
  - `designation` (String) - Member designation
  - `company` (String) - Member company
  - `photo` (String) - Photo URL

#### Virtual Fields:
- `voters` - Virtual relationship to Voter model

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

### Voter
**File:** `voter.js`

Voting records for competitions.

#### Schema Fields:
- `email` (String) - Voter email
- `category` (String) - Competition category
- `brand` (ObjectId, ref: Finalist) - Voted finalist

#### Timestamps:
- `createdAt`, `updatedAt` - Automatically managed

---

## Best Practices & Usage Notes

### General Guidelines:

1. **Soft Deletes**: Many models use `isDeleted` and `deletedAt` fields for soft deletion. Always check these when querying.

2. **Privacy Flags**: Several fields in BusinessAccount have `isPrivate` flags. Respect these when displaying data publicly.

3. **Timestamps**: Most models automatically track `createdAt` and `updatedAt`. Use these for audit trails.

4. **References**: Use `.populate()` to load referenced documents. Example:
   ```javascript
   const business = await BusinessAccount.findById(id)
     .populate('business_types')
     .populate('plan');
   ```

5. **Indexes**: Consider adding indexes for frequently queried fields, especially:
   - Email fields (for login)
   - Status fields (for filtering)
   - User reference fields (for user-specific queries)

### Security Considerations:

1. **Password Fields**: Never include password fields in API responses. Use `.select('-password')` or projection.

2. **Sensitive Data**: Handle owner information, phone numbers, and email addresses with care. Use privacy flags.

3. **Admin Actions**: Always log admin actions using the LogActivity model.

4. **Device Tracking**: Use UserDevice model for security monitoring and suspicious activity detection.

### Performance Tips:

1. **Pagination**: Always paginate large result sets (BusinessAccount, Media, etc.).

2. **Selective Loading**: Only load fields you need using projection.

3. **Caching**: Consider caching frequently accessed, rarely changing data (Countries, States, Cities, BusinessTypes).

4. **Aggregation**: Use MongoDB aggregation pipelines for complex queries and reports.

---

## Model Relationships Diagram

```
PersonalAccount
├── has many ProAccessEntry (virtual)
├── has many UserDevice
├── has many Review (as reviewer)
├── has many Chat
└── has many PersonalDeletionRequest

BusinessAccount
├── belongs to many BusinessType
├── has many Media
├── has many KnowledgebaseMedia
├── has many Job
├── has many Course
├── has many Event
├── has many Review (as business)
├── has many UserDevice
├── has one BusinessUserPlan
├── has many Invoice
├── has many PaymentLog
├── has many SubscriptionLog
├── has many BusinessVerification
├── has many BusinessEditRequest
└── has many BusinessDeleteRequests

BusinessUserPlan
├── belongs to BusinessAccount
└── belongs to BusinessPlan

Invoice
├── belongs to BusinessAccount
└── belongs to BusinessPlan

Press
└── belongs to Publisher

Finalist
└── has many Voter

Admin
├── belongs to Role
└── has many LogActivity

Role
└── has many Permission
```

---

## Change Log

- **Initial Version**: Comprehensive documentation of all models in the Archinza platform
- **Date**: 2025-11-14

---

## Contributing

When adding or modifying models:

1. Update this documentation
2. Add appropriate indexes for performance
3. Include validation where necessary
4. Consider data privacy and security
5. Add timestamps for audit trails
6. Document any virtual fields or methods
