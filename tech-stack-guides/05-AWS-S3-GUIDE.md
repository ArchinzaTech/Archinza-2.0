# AWS S3 Guide for Archinza 2.0

## Table of Contents
1. [Overview](#overview)
2. [Version & Setup](#version--setup)
3. [AWS SDK Configuration](#aws-sdk-configuration)
4. [File Upload](#file-upload)
5. [File Download](#file-download)
6. [File Management](#file-management)
7. [Pre-signed URLs](#pre-signed-urls)
8. [Best Practices](#best-practices)
9. [Patterns in Archinza](#patterns-in-archinza)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Amazon S3 (Simple Storage Service) is the primary cloud storage solution for Archinza 2.0, handling user uploads, media files, and static assets.

### Key Features
- **Scalable storage** - Unlimited capacity
- **High availability** - 99.99% uptime SLA
- **Security** - IAM policies, encryption
- **Cost-effective** - Pay for what you use
- **CDN integration** - CloudFront support

### Archinza Use Cases
1. **User uploads** - Profile pictures, documents
2. **Business media** - Logos, banners, galleries
3. **Static hosting** - Frontend deployment
4. **File storage** - PDFs, images, videos

---

## Version & Setup

### AWS SDK Version

```json
{
  "@aws-sdk/client-s3": "^3.772.0",
  "@aws-sdk/s3-request-presigner": "^3.859.0",
  "@aws-sdk/client-cloudwatch-logs": "^3.863.0"
}
```

### Installation

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Environment Variables

```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_BUCKET_NAME=archinza-uploads
```

---

## AWS SDK Configuration

### Basic S3 Client Setup

```javascript
const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

module.exports = s3Client;
```

### S3 Client with Error Handling

```javascript
const { S3Client } = require('@aws-sdk/client-s3');

class S3Service {
  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      },
      maxAttempts: 3
    });

    this.bucketName = process.env.AWS_BUCKET_NAME;
  }

  getClient() {
    return this.client;
  }

  getBucketName() {
    return this.bucketName;
  }
}

module.exports = new S3Service();
```

---

## File Upload

### 1. Upload from Buffer (Multer Integration)

```javascript
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('./s3Client');
const { v4: uuidv4 } = require('uuid');

const uploadToS3 = async (file) => {
  // Generate unique filename
  const timestamp = Date.now();
  const randomId = uuidv4();
  const extension = file.originalname.split('.').pop();
  const key = `uploads/${timestamp}-${randomId}.${extension}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read' // Or 'private' for private files
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return {
      url,
      key,
      bucket: process.env.AWS_BUCKET_NAME
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('File upload failed');
  }
};

module.exports = { uploadToS3 };
```

### 2. Upload with Express Route

```javascript
const express = require('express');
const multer = require('multer');
const { uploadToS3 } = require('./helpers/s3');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Upload single file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const result = await uploadToS3(req.file);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload multiple files
router.post('/upload-multiple', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const uploads = await Promise.all(
      req.files.map(file => uploadToS3(file))
    );

    res.json({
      success: true,
      data: uploads
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### 3. Organized Folder Structure

```javascript
const uploadToS3 = async (file, folder = 'uploads') => {
  const timestamp = Date.now();
  const randomId = uuidv4();
  const extension = file.originalname.split('.').pop();

  // Organize by folder and date
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const key = `${folder}/${year}/${month}/${timestamp}-${randomId}.${extension}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return {
    url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    key
  };
};

// Usage
await uploadToS3(file, 'profile-pictures');
await uploadToS3(file, 'business-logos');
await uploadToS3(file, 'documents');
```

### 4. Image Upload with Metadata

```javascript
const { PutObjectCommand } = require('@aws-sdk/client-s3');

const uploadImage = async (file, metadata = {}) => {
  const key = generateKey(file);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      originalName: file.originalname,
      uploadedBy: metadata.userId || 'anonymous',
      uploadedAt: new Date().toISOString(),
      ...metadata
    },
    CacheControl: 'max-age=31536000' // 1 year
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return { key, url: getPublicUrl(key) };
};
```

---

## File Download

### 1. Get Object (Download File)

```javascript
const { GetObjectCommand } = require('@aws-sdk/client-s3');

const downloadFromS3 = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return {
      buffer,
      contentType: response.ContentType,
      metadata: response.Metadata
    };
  } catch (error) {
    console.error('S3 download error:', error);
    throw new Error('File download failed');
  }
};
```

### 2. Download Route

```javascript
router.get('/download/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { buffer, contentType } = await downloadFromS3(key);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
    res.send(buffer);
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
});
```

### 3. Stream Download (Memory Efficient)

```javascript
const { GetObjectCommand } = require('@aws-sdk/client-s3');

router.get('/stream/:key', async (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.params.key
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    res.setHeader('Content-Type', response.ContentType);
    response.Body.pipe(res);
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
});
```

---

## File Management

### 1. List Objects

```javascript
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');

const listFiles = async (prefix = '', maxKeys = 1000) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: prefix,
    MaxKeys: maxKeys
  };

  const command = new ListObjectsV2Command(params);
  const response = await s3Client.send(command);

  return response.Contents.map(item => ({
    key: item.Key,
    size: item.Size,
    lastModified: item.LastModified
  }));
};

// Usage
const allFiles = await listFiles();
const userFiles = await listFiles('uploads/user-123/');
```

### 2. Delete Object

```javascript
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

const deleteFromS3 = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('File deletion failed');
  }
};

// Delete route
router.delete('/files/:key', async (req, res) => {
  try {
    await deleteFromS3(req.params.key);
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Delete Multiple Objects

```javascript
const { DeleteObjectsCommand } = require('@aws-sdk/client-s3');

const deleteMultiple = async (keys) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Delete: {
      Objects: keys.map(key => ({ Key: key }))
    }
  };

  const command = new DeleteObjectsCommand(params);
  const response = await s3Client.send(command);

  return response.Deleted;
};

// Usage
await deleteMultiple(['file1.jpg', 'file2.pdf', 'file3.png']);
```

### 4. Copy Object

```javascript
const { CopyObjectCommand } = require('@aws-sdk/client-s3');

const copyFile = async (sourceKey, destinationKey) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    CopySource: `${process.env.AWS_BUCKET_NAME}/${sourceKey}`,
    Key: destinationKey
  };

  const command = new CopyObjectCommand(params);
  await s3Client.send(command);
};

// Usage: Backup a file
await copyFile('uploads/image.jpg', 'backups/image.jpg');
```

### 5. Check if File Exists

```javascript
const { HeadObjectCommand } = require('@aws-sdk/client-s3');

const fileExists = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };

  try {
    const command = new HeadObjectCommand(params);
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
};
```

---

## Pre-signed URLs

### 1. Generate Pre-signed URL for Upload

```javascript
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const generateUploadUrl = async (key, expiresIn = 3600) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: 'image/jpeg' // Specify allowed content type
  };

  const command = new PutObjectCommand(params);
  const url = await getSignedUrl(s3Client, command, { expiresIn });

  return url;
};

// Route to get upload URL
router.get('/upload-url', async (req, res) => {
  const key = `uploads/${Date.now()}-${uuidv4()}.jpg`;
  const url = await generateUploadUrl(key);

  res.json({
    uploadUrl: url,
    key
  });
});

// Frontend usage (from browser)
// 1. Get pre-signed URL from backend
// 2. Upload directly to S3
fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': 'image/jpeg'
  }
});
```

### 2. Generate Pre-signed URL for Download

```javascript
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const generateDownloadUrl = async (key, expiresIn = 3600) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };

  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(s3Client, command, { expiresIn });

  return url;
};

// Route
router.get('/download-url/:key', async (req, res) => {
  const url = await generateDownloadUrl(req.params.key, 300); // 5 minutes

  res.json({ downloadUrl: url });
});
```

### 3. Private File Access

```javascript
// Upload as private
const uploadPrivate = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: generateKey(file),
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'private' // Private access
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
};

// Access via pre-signed URL
router.get('/private-file/:key', auth, async (req, res) => {
  // Check user has permission
  const file = await Media.findOne({ key: req.params.key, userId: req.userId });

  if (!file) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const url = await generateDownloadUrl(req.params.key, 60); // 1 minute
  res.json({ url });
});
```

---

## Best Practices

### 1. Organize with Prefixes (Folders)

```javascript
// ✅ Good: Organized structure
uploads/profile-pictures/2024/01/image.jpg
uploads/business-logos/2024/01/logo.png
uploads/documents/2024/01/file.pdf

// ❌ Bad: Flat structure
image.jpg
logo.png
file.pdf
```

### 2. Use Unique Filenames

```javascript
// ✅ Good: Unique filename
const key = `uploads/${Date.now()}-${uuidv4()}.${extension}`;

// ❌ Bad: Original filename (can conflict)
const key = `uploads/${file.originalname}`;
```

### 3. Set Appropriate ACL

```javascript
// Public files (images, static assets)
ACL: 'public-read'

// Private files (documents, personal data)
ACL: 'private'
```

### 4. Use Lifecycle Policies

```json
{
  "Rules": [{
    "Id": "Delete old uploads",
    "Prefix": "temp/",
    "Status": "Enabled",
    "Expiration": {
      "Days": 7
    }
  }]
}
```

### 5. Enable Versioning (for important files)

```bash
aws s3api put-bucket-versioning \
  --bucket archinza-uploads \
  --versioning-configuration Status=Enabled
```

### 6. Use CloudFront CDN

```javascript
// Instead of direct S3 URL
const s3Url = `https://bucket.s3.region.amazonaws.com/key`;

// Use CloudFront URL
const cdnUrl = `https://d111111abcdef8.cloudfront.net/key`;
```

---

## Patterns in Archinza

### 1. Profile Picture Upload

```javascript
const uploadProfilePicture = async (userId, file) => {
  // Delete old profile picture if exists
  const user = await User.findById(userId);
  if (user.profilePicture) {
    const oldKey = extractKeyFromUrl(user.profilePicture);
    await deleteFromS3(oldKey);
  }

  // Upload new picture
  const result = await uploadToS3(file, 'profile-pictures');

  // Update user record
  user.profilePicture = result.url;
  await user.save();

  return result;
};
```

### 2. Business Logo Upload

```javascript
const uploadBusinessLogo = async (businessId, file) => {
  const result = await uploadToS3(file, `business-logos/${businessId}`);

  // Save to Media model
  const media = await Media.create({
    url: result.url,
    key: result.key,
    type: 'logo',
    businessId
  });

  return media;
};
```

### 3. Document Upload with Tracking

```javascript
const uploadDocument = async (file, metadata) => {
  const result = await uploadToS3(file, 'documents');

  // Track in database
  const doc = await Media.create({
    url: result.url,
    key: result.key,
    filename: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    uploadedBy: metadata.userId,
    category: metadata.category
  });

  return doc;
};
```

---

## Troubleshooting

### Common Issues

1. **Access Denied**
   ```
   Error: Access Denied

   Fix:
   - Check IAM permissions
   - Verify AWS credentials
   - Check bucket policy
   ```

2. **File Too Large**
   ```javascript
   // Increase multer limit
   const upload = multer({
     limits: { fileSize: 50 * 1024 * 1024 } // 50MB
   });
   ```

3. **Invalid Region**
   ```env
   # Check region matches bucket
   AWS_REGION=us-east-1
   ```

4. **CORS Errors (Browser Upload)**
   ```json
   {
     "CORSRules": [{
       "AllowedOrigins": ["https://archinza.com"],
       "AllowedMethods": ["GET", "PUT", "POST"],
       "AllowedHeaders": ["*"]
     }]
   }
   ```

---

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/best-practices.html)

---

## Summary

AWS S3 in Archinza provides:
- **Scalable storage** - Unlimited file storage
- **High availability** - 99.99% uptime
- **Security** - IAM policies, encryption, pre-signed URLs
- **Cost-effective** - Pay per use
- **CDN ready** - CloudFront integration
- **Organized** - Folder structure for different file types
