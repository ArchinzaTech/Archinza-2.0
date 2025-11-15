# MongoDB & Mongoose Guide for Archinza 2.0

## Table of Contents
1. [Overview](#overview)
2. [Version & Setup](#version--setup)
3. [Database Connection](#database-connection)
4. [Mongoose Schemas & Models](#mongoose-schemas--models)
5. [CRUD Operations](#crud-operations)
6. [Query Operations](#query-operations)
7. [Relationships & Population](#relationships--population)
8. [Validation](#validation)
9. [Indexes](#indexes)
10. [Middleware (Hooks)](#middleware-hooks)
11. [Aggregation Pipeline](#aggregation-pipeline)
12. [Best Practices](#best-practices)
13. [Common Patterns in Archinza](#common-patterns-in-archinza)
14. [Troubleshooting](#troubleshooting)

---

## Overview

MongoDB is the primary NoSQL database for Archinza 2.0, and Mongoose is the ODM (Object Document Mapper) that provides schema-based modeling for MongoDB.

### Key Features
- **Document-oriented** - Store data as JSON-like documents
- **Flexible schema** - Easy to modify data structure
- **Scalable** - Horizontal scaling with sharding
- **High performance** - Fast read/write operations

### Archinza Database
- **50+ Collections** (Mongoose models)
- **Connection via Mongoose** 6.0.7
- **Authentication** required
- **Connection pooling** enabled

---

## Version & Setup

### Mongoose Version

```json
{
  "mongoose": "^6.0.7"
}
```

### Installation

```bash
npm install mongoose
```

---

## Database Connection

### Connection Helper (`helpers/db.js`)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT;
    const dbUser = process.env.DB_USER;
    const dbPass = process.env.DB_PASS;
    const dbName = process.env.DB_NAME;

    const connectionString = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(connectionString, options);

    console.log('MongoDB Connected Successfully');

    // Connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Environment Variables

```env
DB_HOST=localhost
DB_PORT=27017
DB_USER=admin
DB_PASS=password123
DB_NAME=archinza
```

### Usage in Server

```javascript
// index.js
const connectDB = require('./helpers/db');

// Connect to database
connectDB();

// Start server after connection
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Mongoose Schemas & Models

### 1. Basic Schema

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  isActive: Boolean,
  createdAt: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;
```

### 2. Schema with Types & Validation

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  age: {
    type: Number,
    min: [18, 'Must be at least 18 years old'],
    max: [120, 'Invalid age']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profilePicture: {
    type: String,
    default: null
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});
```

### 3. Nested Objects

```javascript
const businessSchema = new mongoose.Schema({
  name: String,
  contact: {
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    }
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  }
});
```

### 4. Arrays

```javascript
const productSchema = new mongoose.Schema({
  name: String,
  tags: [String], // Array of strings
  images: [{
    url: String,
    alt: String
  }], // Array of objects
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: Date
  }]
});
```

### 5. References (Relationships)

```javascript
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});
```

### 6. Archinza Schema Example (PersonalAccount)

```javascript
const personalAccountSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false // Don't include in queries by default
  },
  profilePicture: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  location: {
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  options: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Options'
  }],
  customOptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomOptions'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  devices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDevice'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('PersonalAccount', personalAccountSchema);
```

---

## CRUD Operations

### 1. Create (Insert)

```javascript
// Create single document
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

// Alternative: new + save
const user = new User({
  name: 'John Doe',
  email: 'john@example.com'
});
await user.save();

// Create multiple documents
const users = await User.insertMany([
  { name: 'User 1', email: 'user1@example.com' },
  { name: 'User 2', email: 'user2@example.com' }
]);
```

### 2. Read (Find)

```javascript
// Find all
const users = await User.find();

// Find with conditions
const activeUsers = await User.find({ isActive: true });

// Find one
const user = await User.findOne({ email: 'john@example.com' });

// Find by ID
const user = await User.findById('507f1f77bcf86cd799439011');

// Find with selected fields
const users = await User.find().select('name email -_id');

// Find with limit and skip
const users = await User.find().limit(10).skip(20);

// Find and sort
const users = await User.find().sort({ createdAt: -1 }); // Descending
const users = await User.find().sort({ name: 1 }); // Ascending

// Count documents
const count = await User.countDocuments({ isActive: true });
```

### 3. Update

```javascript
// Update one document
const result = await User.updateOne(
  { email: 'john@example.com' },
  { $set: { age: 31 } }
);

// Update multiple documents
const result = await User.updateMany(
  { isActive: false },
  { $set: { isActive: true } }
);

// Find and update (returns updated document)
const user = await User.findOneAndUpdate(
  { email: 'john@example.com' },
  { $set: { age: 31 } },
  { new: true } // Return updated document
);

// Find by ID and update
const user = await User.findByIdAndUpdate(
  userId,
  { name: 'Updated Name' },
  { new: true }
);

// Update operators
await User.updateOne(
  { _id: userId },
  {
    $set: { name: 'New Name' },
    $inc: { age: 1 }, // Increment
    $push: { tags: 'newTag' }, // Add to array
    $pull: { tags: 'oldTag' }, // Remove from array
    $addToSet: { tags: 'uniqueTag' } // Add if not exists
  }
);
```

### 4. Delete

```javascript
// Delete one document
const result = await User.deleteOne({ email: 'john@example.com' });

// Delete multiple documents
const result = await User.deleteMany({ isActive: false });

// Find and delete (returns deleted document)
const user = await User.findOneAndDelete({ email: 'john@example.com' });

// Find by ID and delete
const user = await User.findByIdAndDelete(userId);
```

---

## Query Operations

### 1. Comparison Operators

```javascript
// Greater than
const users = await User.find({ age: { $gt: 18 } });

// Greater than or equal
const users = await User.find({ age: { $gte: 18 } });

// Less than
const users = await User.find({ age: { $lt: 65 } });

// Less than or equal
const users = await User.find({ age: { $lte: 65 } });

// Not equal
const users = await User.find({ status: { $ne: 'deleted' } });

// In array
const users = await User.find({ role: { $in: ['admin', 'moderator'] } });

// Not in array
const users = await User.find({ role: { $nin: ['banned', 'suspended'] } });
```

### 2. Logical Operators

```javascript
// AND
const users = await User.find({
  $and: [
    { age: { $gte: 18 } },
    { isActive: true }
  ]
});

// OR
const users = await User.find({
  $or: [
    { role: 'admin' },
    { role: 'moderator' }
  ]
});

// NOT
const users = await User.find({
  age: { $not: { $lt: 18 } }
});

// NOR
const users = await User.find({
  $nor: [
    { isActive: false },
    { isDeleted: true }
  ]
});
```

### 3. String Queries

```javascript
// Regular expression
const users = await User.find({ name: /^John/i }); // Case insensitive

// Contains
const users = await User.find({ email: { $regex: 'gmail', $options: 'i' } });

// Exact match
const users = await User.find({ name: 'John Doe' });
```

### 4. Array Queries

```javascript
// Array contains element
const posts = await Post.find({ tags: 'javascript' });

// Array contains all elements
const posts = await Post.find({ tags: { $all: ['javascript', 'node'] } });

// Array size
const posts = await Post.find({ tags: { $size: 3 } });

// Element match (nested objects in array)
const products = await Product.find({
  reviews: {
    $elemMatch: {
      rating: { $gte: 4 },
      verified: true
    }
  }
});
```

### 5. Projection (Select Fields)

```javascript
// Include specific fields
const users = await User.find().select('name email');

// Exclude specific fields
const users = await User.find().select('-password -__v');

// Mixed
const users = await User.find().select('name email -_id');
```

---

## Relationships & Population

### 1. One-to-One

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }
});

// Populate
const user = await User.findById(userId).populate('profile');
```

### 2. One-to-Many

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

// Populate
const user = await User.findById(userId).populate('posts');

// Populate with selected fields
const user = await User.findById(userId)
  .populate('posts', 'title content -_id');

// Populate nested
const user = await User.findById(userId)
  .populate({
    path: 'posts',
    populate: {
      path: 'comments',
      select: 'text author'
    }
  });
```

### 3. Many-to-Many

```javascript
const studentSchema = new mongoose.Schema({
  name: String,
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

const courseSchema = new mongoose.Schema({
  name: String,
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
});

// Add relationship
const student = await Student.findById(studentId);
const course = await Course.findById(courseId);

student.courses.push(course._id);
course.students.push(student._id);

await student.save();
await course.save();
```

### 4. Virtual Population

```javascript
const userSchema = new mongoose.Schema({
  name: String
});

// Virtual field (not stored in DB)
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author'
});

// Enable virtuals in JSON
userSchema.set('toJSON', { virtuals: true });

// Populate virtual
const user = await User.findById(userId).populate('posts');
```

---

## Validation

### 1. Built-in Validators

```javascript
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
    lowercase: true,
    uppercase: true,
    match: /^[a-z]+$/
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  age: {
    type: Number,
    min: [18, 'Must be at least 18'],
    max: 120
  },
  role: {
    type: String,
    enum: ['user', 'admin']
  }
});
```

### 2. Custom Validators

```javascript
const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
      },
      message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
    }
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function(v) {
        return v === this.password;
      },
      message: 'Passwords do not match'
    }
  }
});
```

### 3. Async Validators

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    validate: {
      validator: async function(v) {
        const count = await mongoose.models.User.countDocuments({
          username: v,
          _id: { $ne: this._id }
        });
        return count === 0;
      },
      message: 'Username already exists'
    }
  }
});
```

---

## Indexes

### 1. Single Field Index

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true, // Creates unique index
    index: true   // Creates regular index
  },
  createdAt: {
    type: Date,
    index: true
  }
});
```

### 2. Compound Index

```javascript
userSchema.index({ email: 1, isActive: 1 }); // Ascending
userSchema.index({ createdAt: -1 }); // Descending
```

### 3. Text Index (Full-text Search)

```javascript
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

postSchema.index({ title: 'text', content: 'text' });

// Search
const posts = await Post.find({ $text: { $search: 'mongodb tutorial' } });
```

### 4. Geospatial Index

```javascript
const placeSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
});

placeSchema.index({ location: '2dsphere' });

// Find nearby
const places = await Place.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      $maxDistance: 5000 // 5km
    }
  }
});
```

---

## Middleware (Hooks)

### 1. Pre Middleware

```javascript
// Before save
userSchema.pre('save', async function(next) {
  // Only hash password if modified
  if (!this.isModified('password')) {
    return next();
  }

  const bcrypt = require('bcrypt');
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Before remove
userSchema.pre('remove', async function(next) {
  // Delete user's posts
  await Post.deleteMany({ author: this._id });
  next();
});

// Before find
userSchema.pre('find', function() {
  this.where({ isDeleted: { $ne: true } });
});
```

### 2. Post Middleware

```javascript
// After save
userSchema.post('save', function(doc) {
  console.log('User saved:', doc._id);
  // Send welcome email
  sendWelcomeEmail(doc.email);
});

// After remove
userSchema.post('remove', function(doc) {
  console.log('User deleted:', doc._id);
});
```

### 3. Instance Methods

```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcrypt');
  return await bcrypt.compare(candidatePassword, this.password);
};

// Usage
const user = await User.findOne({ email });
const isMatch = await user.comparePassword(password);
```

### 4. Static Methods

```javascript
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Usage
const user = await User.findByEmail('john@example.com');
```

---

## Aggregation Pipeline

### 1. Basic Aggregation

```javascript
const results = await User.aggregate([
  { $match: { isActive: true } },
  { $group: {
    _id: '$role',
    count: { $sum: 1 },
    avgAge: { $avg: '$age' }
  }},
  { $sort: { count: -1 } }
]);
```

### 2. Common Stages

```javascript
// $match - Filter documents
{ $match: { age: { $gte: 18 } } }

// $group - Group by field
{ $group: {
  _id: '$category',
  total: { $sum: '$price' },
  count: { $sum: 1 }
}}

// $project - Select/transform fields
{ $project: {
  name: 1,
  email: 1,
  fullName: { $concat: ['$firstName', ' ', '$lastName'] }
}}

// $sort - Sort results
{ $sort: { createdAt: -1 } }

// $limit - Limit results
{ $limit: 10 }

// $skip - Skip documents
{ $skip: 20 }

// $lookup - Join collections
{ $lookup: {
  from: 'posts',
  localField: '_id',
  foreignField: 'author',
  as: 'userPosts'
}}

// $unwind - Deconstruct array
{ $unwind: '$tags' }
```

### 3. Complex Example

```javascript
const stats = await Order.aggregate([
  // Match orders from last month
  {
    $match: {
      createdAt: { $gte: new Date('2024-01-01') }
    }
  },
  // Lookup customer details
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'customer'
    }
  },
  // Unwind customer array
  {
    $unwind: '$customer'
  },
  // Group by product category
  {
    $group: {
      _id: '$category',
      totalRevenue: { $sum: '$amount' },
      orderCount: { $sum: 1 },
      avgOrderValue: { $avg: '$amount' },
      customers: { $addToSet: '$customer.email' }
    }
  },
  // Sort by revenue
  {
    $sort: { totalRevenue: -1 }
  },
  // Add calculated fields
  {
    $project: {
      category: '$_id',
      totalRevenue: 1,
      orderCount: 1,
      avgOrderValue: 1,
      customerCount: { $size: '$customers' }
    }
  }
]);
```

---

## Best Practices

### 1. Use Lean Queries for Read-Only

```javascript
// ✅ Good: Faster, returns plain JS objects
const users = await User.find().lean();

// ❌ Bad: Slower, returns Mongoose documents
const users = await User.find();
```

### 2. Select Only Needed Fields

```javascript
// ✅ Good
const users = await User.find().select('name email');

// ❌ Bad
const users = await User.find(); // Returns all fields
```

### 3. Use Indexes

```javascript
// ✅ Good: Create index on frequently queried fields
userSchema.index({ email: 1, isActive: 1 });

// Check query performance
const explain = await User.find({ email: 'test@example.com' }).explain();
```

### 4. Avoid N+1 Queries

```javascript
// ✅ Good: Single query with populate
const users = await User.find().populate('posts');

// ❌ Bad: N+1 queries
const users = await User.find();
for (let user of users) {
  user.posts = await Post.find({ author: user._id });
}
```

### 5. Use Transactions for Multi-Document Operations

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  await User.create([{ name: 'John' }], { session });
  await Post.create([{ title: 'Post 1', author: userId }], { session });

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

## Common Patterns in Archinza

### 1. User Registration

```javascript
const registerUser = async (userData) => {
  const { email, password, phone } = userData;

  // Check if user exists
  const existingUser = await PersonalAccount.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password (done in pre-save hook)
  const user = await PersonalAccount.create({
    email,
    password,
    phone,
    isVerified: false
  });

  // Don't return password
  user.password = undefined;

  return user;
};
```

### 2. Pagination

```javascript
const getUsers = async (page = 1, limit = 10, filters = {}) => {
  const skip = (page - 1) * limit;

  const users = await User.find(filters)
    .select('-password')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filters);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};
```

### 3. Soft Delete

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
});

// Soft delete method
userSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
};

// Exclude deleted by default
userSchema.pre('find', function() {
  this.where({ isDeleted: { $ne: true } });
});

// Usage
await user.softDelete();
```

---

## Troubleshooting

### Common Issues

1. **Validation Errors**
   ```javascript
   try {
     await user.save();
   } catch (error) {
     if (error.name === 'ValidationError') {
       console.log(error.errors); // Field-specific errors
     }
   }
   ```

2. **Duplicate Key Error**
   ```javascript
   try {
     await User.create({ email });
   } catch (error) {
     if (error.code === 11000) {
       console.log('Duplicate email');
     }
   }
   ```

3. **Connection Issues**
   - Check MongoDB is running
   - Verify connection string
   - Check network/firewall

4. **Slow Queries**
   - Add indexes
   - Use `.explain()` to analyze
   - Use `.lean()` for read-only

---

## Additional Resources

- [MongoDB Official Docs](https://docs.mongodb.com)
- [Mongoose Official Docs](https://mongoosejs.com)
- [MongoDB University](https://university.mongodb.com)

---

## Summary

MongoDB with Mongoose provides Archinza with:
- **Flexible schema** for evolving data models
- **50+ collections** for different business domains
- **Powerful queries** with aggregation pipeline
- **Built-in validation** for data integrity
- **Relationships** via population
- **High performance** with proper indexing
