# PDF Storage Implementation Guide

## Overview
This guide documents the complete PDF storage flow from the Archinza project, including file upload, S3 storage, thumbnail generation, and MongoDB persistence.

---

## Architecture Flow

```
Client Upload (FormData)
    ↓
Multer Middleware (Memory Storage)
    ↓
validateRequestFile()
    ├─ Validate file extension
    ├─ Check PDF page count (pdf-lib)
    ├─ Extract/Generate thumbnail
    ├─ Upload thumbnail to S3
    ├─ Generate SHA256 hash
    ├─ Check for duplicates in MongoDB
    └─ Upload main file to S3
    ↓
Create MongoDB Document (Media.create)
    ↓
Return Response with Media Data
```

---

## 1. API Endpoint

### Route Definition
```javascript
POST /business-details/:id/upload/:section_name
```

### URL Parameters
- `:id` - User/Business Account ID (MongoDB ObjectId)
- `:section_name` - Media category/section name

### Request Body (multipart/form-data)
```javascript
{
  files: [File, File, ...],     // Array of files
  filePageLimit: 100             // Max PDF pages (from subscription plan)
}
```

### Response
```javascript
{
  success: true,
  message: "Details Uploaded Successfully",
  data: [
    [
      {
        _id: "mongodb_id",
        name: "1234567890-filename.pdf",
        url: "1234567890-filename.pdf",
        mimetype: "application/pdf",
        size: "1024000",
        userId: "user_id",
        category: "company_profile_media",
        fileHash: "sha256_hash",
        thumbnail: "1234567891-thumbnail-filename.jpg",
        createdAt: "2025-01-15T10:00:00.000Z",
        updatedAt: "2025-01-15T10:00:00.000Z"
      }
    ]
  ]
}
```

---

## 2. Implementation Code

### 2.1 Main Route Handler

**File Location**: `routes/business.js:556-624`

```javascript
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Media = require("../models/media");
const { uploadMultiple, validateRequestFile } = require("../middlewares/upload");

router.post(
  "/business-details/:id/upload/:section_name",
  uploadMultiple,  // Multer middleware
  asyncHandler(async (req, res) => {
    const files = req.files;
    let uploadedMediaList = [];

    // Define allowed extensions based on section
    const allowedExtensionsWorkspace = [
      "jpeg", "png", "jpg", "heic", "heif", "webp"
    ];

    const allowedExtensionsProfile = [
      "pdf", "pptx", "jpeg", "png", "jpg", "heic", "heif", "webp"
    ];

    const extensions = req.params.section_name === "workspace_media"
      ? allowedExtensionsWorkspace
      : allowedExtensionsProfile;

    // Process each file
    for (const file of files) {
      const fileValidation = await validateRequestFile({
        file,
        extensions,
        userId: req.params.id,
        filePageLimit: req.body.filePageLimit,
      });

      // Check for validation errors
      if (fileValidation?.error) {
        return res.send(sendResponse([], fileValidation.message, 400));
      }

      // Create MongoDB document
      const mediaDoc = {
        name: fileValidation.uniqueFileName,
        url: fileValidation.uniqueFileName,
        mimetype: file.mimetype,
        size: file.size,
        userId: req.params.id,
        category: req.params.section_name,
        fileHash: fileValidation.fileHash,
        thumbnail: fileValidation.thumbnailUniqueFileName || null,
      };

      // Save to MongoDB
      const media = await Media.create(mediaDoc);
      uploadedMediaList.push(media);
    }

    return res.send(
      sendResponse([uploadedMediaList], "Details Uploaded Successfully")
    );
  })
);

module.exports = router;
```

---

### 2.2 Multer Configuration

**File Location**: `middlewares/upload.js:36-40`

```javascript
const multer = require("multer");

// Configure multer to use memory storage
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

// Export middleware for multiple files
const uploadMultiple = upload.any();
const uploadSingle = upload.single("file");

module.exports = { uploadMultiple, uploadSingle };
```

---

### 2.3 validateRequestFile() Function

**File Location**: `middlewares/upload.js:304-515`

```javascript
const path = require("path");
const crypto = require("crypto");
const { PDFDocument } = require("pdf-lib");
const mongoose = require("mongoose");
const Media = require("../models/media");

async function validateRequestFile({
  file,              // File object with buffer, originalname, mimetype
  extensions,        // Array of allowed extensions
  userId,            // User ID for duplicate check
  filePageLimit,     // Max PDF pages allowed
  section,           // (Optional) Category name
  count,             // (Optional) File count
  businessName       // (Optional) Business name
}) {
  // 1. Validate file extension
  const allowedExtensions = extensions || [
    "jpeg", "jpg", "png", "heic", "heif", "svg", "webp"
  ];

  const extname = path.extname(file.originalname).toLowerCase();
  let fileExtension = extname.replace(".", "");

  if (!allowedExtensions.includes(fileExtension)) {
    return { error: "Mimetype", message: "Invalid File Type" };
  }

  // 2. Generate unique filename
  let thumbnailUniqueFileName;
  const baseName = path.basename(
    file.originalname,
    path.extname(file.originalname)
  );
  const uniqueFileName = `${Date.now()}-${baseName}.${fileExtension}`;
  const destination = `business/${uniqueFileName}`;

  // 3. FOR PDFs: Check page count and extract thumbnail
  if (filePageLimit && fileExtension === "pdf") {
    try {
      // Load PDF using pdf-lib
      const pdfDoc = await PDFDocument.load(file.buffer);
      const pageCount = pdfDoc.getPageCount();

      // Validate page count
      if (pageCount > filePageLimit) {
        return {
          error: "PageLimitExceeded",
          message: `File ${file.originalname} exceeds your plan's ${filePageLimit}-page limit.`,
        };
      }

      // Extract images from first page
      const thumbnailImages = await extractFirstPageImages(file.buffer);

      if (thumbnailImages.length > 0) {
        // Try to find embedded JPEG image
        const jpegImage = thumbnailImages.find(
          (img) => img.filter === "/DCTDecode"
        );

        if (jpegImage) {
          // Use embedded JPEG
          console.log("✅ Using embedded JPEG from PDF");
          const thumbnailFile = {
            buffer: jpegImage.data,
            originalname: `thumbnail_${baseName}.jpg`,
            mimetype: "image/jpeg",
          };
          thumbnailUniqueFileName = `${Date.now()}-thumbnail-${baseName}.jpg`;
          const thumbnailDestination = `business/${thumbnailUniqueFileName}`;
          await uploadToAWS(thumbnailFile, thumbnailDestination);
        } else {
          // Fallback: Rasterize first page to PNG
          console.log("⚠️ No JPEG found, rasterizing PDF...");
          const { buffer } = await rasterizeFirstPage(file.buffer);
          const thumbnailFile = {
            buffer,
            originalname: `thumbnail_${baseName}.png`,
            mimetype: "image/png",
          };
          thumbnailUniqueFileName = `${Date.now()}-thumbnail-${baseName}.png`;
          const thumbnailDestination = `business/${thumbnailUniqueFileName}`;
          await uploadToAWS(thumbnailFile, thumbnailDestination);
        }
      }
    } catch (err) {
      console.error("Error reading PDF:", err);
      return { error: "InvalidPDF", message: "Unable to process PDF file." };
    }
  }

  // 4. FOR PPTX: Check slide count and extract images
  if (filePageLimit && fileExtension === "pptx") {
    try {
      const slideCount = await getPptxSlideCount(file.buffer);

      if (slideCount > filePageLimit) {
        return {
          error: "SlideLimitExceeded",
          message: `File "${file.originalname}" exceeds your plan's ${filePageLimit}-slide limit.`,
        };
      }

      const thumbnailImages = await extractPptxImages(file.buffer);

      if (thumbnailImages.length > 0) {
        const thumbnailFile = {
          buffer: thumbnailImages[0].data,
          originalname: `thumbnail_${baseName}.jpg`,
          mimetype: "image/jpeg",
        };
        thumbnailUniqueFileName = `${Date.now()}-thumbnail-${baseName}.jpg`;
        const thumbnailDestination = `business/${thumbnailUniqueFileName}`;
        await uploadToAWS(thumbnailFile, thumbnailDestination);
      }
    } catch (err) {
      console.error("Error reading PPTX:", err);
      return { error: "InvalidPPTX", message: "Unable to process PPTX file." };
    }
  }

  // 5. Process image files (HEIC conversion if needed)
  if (["jpeg", "jpg", "png", "heic", "heif"].includes(fileExtension)) {
    const { buffer, newExtension } = await processImageFile(
      file,
      fileExtension
    );
    file.buffer = buffer;
    fileExtension = newExtension;
    thumbnailUniqueFileName = uniqueFileName;
  }

  // 6. Process image file (final conversion)
  let { buffer, newExtension } = await processImageFile(file, fileExtension);
  file.buffer = buffer;
  fileExtension = newExtension;

  // 7. Generate SHA256 hash for duplicate detection
  const fileHash = crypto
    .createHash("sha256")
    .update(file.buffer)
    .digest("hex");

  // 8. Check for duplicates in MongoDB
  if (userId) {
    const existing = await Media.findOne({
      userId: mongoose.Types.ObjectId(userId),
      fileHash,
      softDelete: false,
    });

    if (existing) {
      console.log("File already exists");
      return {
        error: "DuplicateFile",
        message: "This file already exists in your database.",
      };
    }
  }

  // 9. Upload main file to S3
  try {
    const fileURL = await uploadToAWS(file, destination);

    return {
      uniqueFileName,
      fileHash,
      thumbnailUniqueFileName,
    };
  } catch (error) {
    console.error("Error uploading file to AWS:", error);
    return { error: "UploadError", message: "Error uploading file to AWS" };
  }
}

module.exports = { validateRequestFile };
```

---

### 2.4 S3 Upload Function

**File Location**: `middlewares/upload.js:165-185`

```javascript
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const config = require("../config/config");

// Initialize S3 Client
const s3Client = new S3Client({
  region: config.aws_region,
  credentials: {
    accessKeyId: config.aws_access_key_id,
    secretAccessKey: config.aws_secret_access_key,
  },
});

const bucketName = config.aws_bucket_name;

async function uploadToAWS(file, destination) {
  try {
    const params = {
      Bucket: bucketName,
      Key: destination,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    console.log(`File uploaded to AWS S3 as ${destination}`);
    return `https://${bucketName}.s3.${config.aws_region}.amazonaws.com/${destination}`;
  } catch (error) {
    console.error("Error uploading to AWS S3:", error);
    throw error;
  }
}

module.exports = { uploadToAWS };
```

---

### 2.5 Extract PDF Thumbnail Functions

**File Location**: `middlewares/upload.js:83-163`

```javascript
const { PDFDocument, PDFName, PDFDict, PDFRawStream } = require("pdf-lib");
const { getDocument } = require("pdfjs-dist/legacy/build/pdf.js");
const { createCanvas } = require("canvas");

// Extract embedded images from PDF first page
async function extractFirstPageImages(pdfBuffer) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const [firstPage] = pdfDoc.getPages();

  const xObjects = firstPage.node
    .Resources()
    ?.lookupMaybe(PDFName.of("XObject"), PDFDict);

  if (!xObjects) {
    console.log("No XObject found on first page.");
    return [];
  }

  const images = [];
  for (const key of xObjects.keys()) {
    const xObject = xObjects.lookupMaybe(key, PDFRawStream);

    if (
      xObject &&
      xObject.dict.lookup(PDFName.of("Subtype"))?.toString() === "/Image"
    ) {
      const filter = xObject.dict.lookup(PDFName.of("Filter"));
      const filterName = filter?.toString();
      const contents = xObject.getContents();

      images.push({
        name: key.encodedName,
        data: contents,
        filter: filterName,
      });
    }
  }

  return images;
}

// Rasterize PDF first page to PNG (fallback)
async function rasterizeFirstPage(pdfBuffer) {
  // Set up DOMMatrix for canvas
  global.DOMMatrix = class {
    constructor() {
      return new (require("canvas").DOMMatrix)();
    }
  };

  const loadingTask = getDocument({ data: pdfBuffer });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext("2d");

  await page.render({ canvasContext: context, viewport }).promise;

  const buffer = canvas.toBuffer("image/png");
  return { buffer, originalname: "thumbnail.png" };
}

module.exports = { extractFirstPageImages, rasterizeFirstPage };
```

---

### 2.6 HEIC Image Conversion

**File Location**: `middlewares/upload.js:68-81`

```javascript
const heicConvert = require("heic-convert");

async function processImageFile(file, fileExtension) {
  // Convert HEIC/HEIF to JPEG
  if (fileExtension === "heic" || fileExtension === "heif") {
    const outputBuffer = await heicConvert({
      buffer: file.buffer,
      format: "JPEG",
      quality: 1, // 0..1
    });
    return { buffer: outputBuffer, newExtension: "jpg" };
  }

  // Return original for other formats
  return { buffer: file.buffer, newExtension: fileExtension };
}

module.exports = { processImageFile };
```

---

### 2.7 PPTX Slide Counter

**File Location**: `middlewares/upload.js:44-65`

```javascript
const unzipper = require("unzipper");

async function getPptxSlideCount(buffer) {
  let slideCount = 0;

  await new Promise((resolve, reject) => {
    const zipStream = unzipper.Parse();

    zipStream.on("entry", (entry) => {
      if (
        entry.path.startsWith("ppt/slides/slide") &&
        entry.path.endsWith(".xml")
      ) {
        slideCount++;
      }
      entry.autodrain();
    });

    zipStream.on("close", resolve);
    zipStream.on("error", reject);

    zipStream.end(buffer);
  });

  return slideCount;
}

module.exports = { getPptxSlideCount };
```

---

## 3. MongoDB Schema

**File Location**: `models/media.js`

```javascript
const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    name: { type: String },
    url: { type: String },
    mimetype: { type: String },
    size: { type: String },
    height: { type: String },
    width: { type: String },
    visibility: { type: Boolean, default: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessAccount",
      required: true,
    },
    category: { type: String },
    softDelete: { type: Boolean, default: false },
    deletedAt: { type: Date },
    pinned: { type: Boolean, default: false },
    isUnused: { type: Boolean, default: false },
    fileHash: { type: String },
    thumbnail: { type: String },
    masonryPosition: { type: Number },
    replacedAt: { type: Date },
    originalPosition: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);
```

---

## 4. Dependencies Required

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "express-async-handler": "^1.2.0",
    "multer": "^1.4.4",
    "@aws-sdk/client-s3": "^3.772.0",
    "pdf-lib": "^1.17.1",
    "pdfjs-dist": "^2.16.105",
    "canvas": "^3.2.0",
    "heic-convert": "^2.1.0",
    "unzipper": "^0.12.3",
    "mongoose": "^6.0.0",
    "lodash": "^4.17.21"
  }
}
```

---

## 5. Environment Variables

```env
# AWS S3 Configuration
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your-bucket-name

# MongoDB
MONGODB_URI=mongodb://localhost:27017/your_database
```

---

## 6. S3 Storage Structure

```
s3://your-bucket-name/
  ├── business/
  │   ├── 1234567890-document.pdf          (Main PDF)
  │   ├── 1234567891-thumbnail-document.jpg (Thumbnail)
  │   ├── 1234567892-image.jpg
  │   └── ...
  └── recently_deleted/                     (Soft-deleted files)
      └── 1234567890-document.pdf
```

---

## 7. File Categories (section_name)

| Category | Allowed Extensions | Description |
|----------|-------------------|-------------|
| `workspace_media` | jpeg, png, jpg, heic, heif, webp | Images only |
| `project_renders_media` | pdf, pptx, jpeg, png, jpg, heic, heif, webp | All formats |
| `completed_products_media` | pdf, pptx, jpeg, png, jpg, heic, heif, webp | All formats |
| `sites_inprogress_media` | pdf, pptx, jpeg, png, jpg, heic, heif, webp | All formats |
| `company_profile_media` | pdf, pptx, jpeg, png, jpg, heic, heif, webp | All formats |
| `product_catalogues_media` | pdf, pptx, jpeg, png, jpg, heic, heif, webp | All formats |

---

## 8. Frontend Integration Example

```javascript
// React/Next.js Upload Component
const uploadPDF = async (file, userId, category) => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('filePageLimit', 100); // From subscription plan

  try {
    const response = await fetch(
      `/business/business-details/${userId}/upload/${category}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (result.success) {
      const uploadedFile = result.data[0][0];
      console.log('Uploaded:', uploadedFile);

      // Construct S3 URL
      const s3Url = `https://your-bucket.s3.region.amazonaws.com/business/${uploadedFile.url}`;
      const thumbnailUrl = uploadedFile.thumbnail
        ? `https://your-bucket.s3.region.amazonaws.com/business/${uploadedFile.thumbnail}`
        : null;

      return { s3Url, thumbnailUrl, media: uploadedFile };
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

---

## 9. Error Handling

| Error Code | Message | Cause |
|------------|---------|-------|
| `Mimetype` | Invalid File Type | File extension not allowed |
| `PageLimitExceeded` | Exceeds page limit | PDF pages > filePageLimit |
| `SlideLimitExceeded` | Exceeds slide limit | PPTX slides > filePageLimit |
| `InvalidPDF` | Unable to process PDF | Corrupt or invalid PDF |
| `InvalidPPTX` | Unable to process PPTX | Corrupt or invalid PPTX |
| `DuplicateFile` | File already exists | SHA256 hash matches existing |
| `UploadError` | Error uploading to AWS | S3 upload failed |

---

## 10. Key Features

✅ **File Validation**: Extension and page count checks
✅ **Duplicate Detection**: SHA256 hash-based deduplication
✅ **Thumbnail Generation**: Automatic for PDFs and PPTX
✅ **HEIC Support**: Auto-conversion to JPEG
✅ **S3 Storage**: Scalable cloud storage
✅ **MongoDB Persistence**: Metadata and references
✅ **Soft Delete**: Recoverable file deletion
✅ **Plan Limits**: Subscription-based restrictions

---

## 11. Testing the Implementation

### Test Upload with cURL
```bash
curl -X POST \
  http://localhost:3000/business/business-details/USER_ID/upload/company_profile_media \
  -F "files=@/path/to/document.pdf" \
  -F "filePageLimit=100"
```

### Expected Response
```json
{
  "success": true,
  "message": "Details Uploaded Successfully",
  "data": [[{
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "1705318234567-document.pdf",
    "url": "1705318234567-document.pdf",
    "mimetype": "application/pdf",
    "size": "524288",
    "userId": "USER_ID",
    "category": "company_profile_media",
    "fileHash": "abc123...",
    "thumbnail": "1705318234568-thumbnail-document.jpg",
    "visibility": true,
    "softDelete": false,
    "createdAt": "2025-01-15T10:30:34.567Z",
    "updatedAt": "2025-01-15T10:30:34.567Z"
  }]]
}
```

---

## 12. Implementation Checklist

- [ ] Install all dependencies
- [ ] Set up AWS S3 bucket and credentials
- [ ] Configure environment variables
- [ ] Create MongoDB Media model
- [ ] Implement multer middleware
- [ ] Implement validateRequestFile() function
- [ ] Implement uploadToAWS() function
- [ ] Implement PDF thumbnail extraction
- [ ] Implement PPTX slide counter
- [ ] Create upload route handler
- [ ] Test with sample PDFs
- [ ] Verify S3 uploads
- [ ] Verify MongoDB entries
- [ ] Test duplicate detection
- [ ] Test error handling

---

## Support

For issues or questions, refer to:
- AWS S3 SDK: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
- pdf-lib: https://pdf-lib.js.org/
- pdfjs-dist: https://mozilla.github.io/pdf.js/
- Multer: https://github.com/expressjs/multer

---

**Last Updated**: January 2025
**Project**: Archinza PDF Storage System
