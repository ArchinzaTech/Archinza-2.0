const multer = require("multer");
const mediaPath = "public/uploads/business";
const path = require("path");
const fs = require("fs");
const { Storage } = require("@google-cloud/storage");
const { PDFDocument, PDFName, PDFDict, PDFRawStream } = require("pdf-lib");
const { getDocument } = require("pdfjs-dist/legacy/build/pdf.js");
const { createCanvas } = require("canvas");
const unzipper = require("unzipper");
const heicConvert = require("heic-convert");
const Media = require("../models/media");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  CopyObjectCommand,
  PutBucketLifecycleConfigurationCommand,
} = require("@aws-sdk/client-s3");
const config = require("../config/config");
const crypto = require("crypto");
const { default: mongoose } = require("mongoose");
const { getBusinessNamePrefix } = require("../helpers/api");
const s3Client = new S3Client({
  region: config.aws_region,
  credentials: {
    accessKeyId: config.aws_access_key_id,
    secretAccessKey: config.aws_secret_access_key,
  },
});

const serviceAccountKey = path.join(__dirname, "../config/gcp-key.json");

const storage = new Storage({ keyFilename: serviceAccountKey });
const bucketName = config.aws_bucket_name;

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const uploadMultiple = upload.any();
const uploadSingle = upload.single("file");

//pptx slides counter
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

//convert iphone img formats (heic/heif)
async function processImageFile(file, fileExtension) {
  // If it's HEIC/HEIF → convert to JPEG
  if (fileExtension === "heic" || fileExtension === "heif") {
    const outputBuffer = await heicConvert({
      buffer: file.buffer, // HEIC input buffer
      format: "JPEG",
      quality: 1, // 0..1 (JPEG quality)
    });
    return { buffer: outputBuffer, newExtension: "jpg" };
  }

  // Otherwise keep original
  return { buffer: file.buffer, newExtension: fileExtension };
}

async function extractFirstPageImages(pdfBuffer) {
  // Load PDF
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  // Get first page
  const [firstPage] = pdfDoc.getPages();
  // console.log(firstPage.node.Resources().lookup(PDFName.of("XObject")));
  // Get the XObject dictionary (where images are stored)
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
      // const { contents } = xObject;
      // images.push({ name: key.encodedName, data: contents });
    }
  }

  return images;
}

async function extractPptxImages(pptxBuffer) {
  const images = [];

  // Open the PPTX buffer as a zip
  const directory = await unzipper.Open.buffer(pptxBuffer);

  // Loop through all entries
  for (const entry of directory.files) {
    if (entry.path.startsWith("ppt/media/")) {
      const buffer = await entry.buffer();
      images.push({
        name: entry.path.replace("ppt/media/", ""), // filename only
        data: buffer,
      });
    }
  }

  return images;
}

//in-case if the image on 1st page is non-image, ex: it is vector
async function rasterizeFirstPage(pdfBuffer) {
  // const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.js");
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

async function uploadToAWS(file, destination) {
  try {
    const params = {
      Bucket: bucketName,
      Key: destination,
      Body: file.buffer,
      ContentType: file.mimetype,
      // Optional: Make file public if needed
      // ACL: "public-read",
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

async function deleteMediaFromAWS(fileNames, folder) {
  console.log(fileNames);
  const folderName = folder || "business";
  try {
    const params = {
      Bucket: bucketName,
      Delete: {
        Objects: fileNames.map((fileName) => ({
          Key: `${folderName}/${fileName}`,
        })),
        Quiet: false,
      },
    };

    const command = new DeleteObjectsCommand(params);
    const response = await s3Client.send(command);

    // console.log(`Files deleted successfully from AWS S3:`, response.Deleted);
    return true;
  } catch (error) {
    console.error("Error deleting files from AWS S3:", error);
    // if (error.name === "NoSuchKey") {
    //   console.log(`File ${fileName} not found in AWS S3`);
    return false;
    // }

    throw error;
  }
}

async function softDeleteMedia(mediaItems) {
  try {
    const promises = mediaItems.map(async ({ name }) => {
      try {
        const newKey = `recently_deleted/${name}`;

        // Copy first
        await s3Client.send(
          new CopyObjectCommand({
            Bucket: config.aws_bucket_name,
            CopySource: `${config.aws_bucket_name}/business/${name}`,
            Key: newKey,
          })
        );

        // Delete original
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: config.aws_bucket_name,
            Key: `business/${name}`,
          })
        );

        return { name, status: "success" };
      } catch (err) {
        console.warn(`Skipping ${name}, error: ${err.name || err.message}`);
        return { name, status: "failed", error: err.message };
      }
    });

    return Promise.all(promises);
  } catch (error) {
    console.error("Failed to soft delete media batch:", error);
    return false;
  }
}

async function restoreMedia(mediaItems) {
  try {
    const promises = mediaItems.map(async ({ name }) => {
      const currentS3Key = name;
      await s3Client.send(
        new CopyObjectCommand({
          Bucket: config.aws_bucket_name,
          CopySource: `${config.aws_bucket_name}/recently_deleted/${currentS3Key}`,
          Key: `business/${name}`,
        })
      );

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: config.aws_bucket_name,
          Key: `recently_deleted/${currentS3Key}`,
        })
      );
    });
    return Promise.all(promises);

    // console.info(`Restored media ${mediaId} to ${originalS3Key}`);
  } catch (error) {
    logger.error(`Failed to restore media ${mediaId}: ${error.message}`);
    throw error;
  }
}

async function setupS3LifecycleRule() {
  try {
    const command = new PutBucketLifecycleConfigurationCommand({
      Bucket: config.aws_bucket_name,
      LifecycleConfiguration: {
        Rules: [
          {
            ID: "DeleteRecentlyDeletedAfter30Days",
            Status: "Enabled",
            Prefix: "recently_deleted/",
            Expiration: { Days: 1 },
          },
        ],
      },
    });
    await s3Client.send(command);
    console.info("S3 Lifecycle Rule created for recently_deleted/");
  } catch (error) {
    console.info("Failed to create S3 Lifecycle Rule:", error.message);
  }
}

async function validateRequestFile({
  file,
  extensions,
  userId,
  section,
  count,
  businessName,
  filePageLimit,
}) {
  const allowedExtensions = extensions || [
    "jpeg",
    "jpg",
    "png",
    "heic",
    "heif",
    "svg",
    "webp",
  ];
  const extname = path.extname(file.originalname).toLowerCase();
  let fileExtension = extname.replace(".", "");
  if (!allowedExtensions.includes(fileExtension)) {
    return { error: "Mimetype", message: "Invalid File Type" };
  }

  let thumbnailImages = [];
  let thumbnailUniqueFileName;
  const baseName = path.basename(
    file.originalname,
    path.extname(file.originalname)
  );
  const uniqueFileName = `${Date.now()}-${baseName}.${fileExtension}`;
  const destination = `business/${uniqueFileName}`;

  if (filePageLimit && fileExtension === "pdf") {
    try {
      const pdfDoc = await PDFDocument.load(file.buffer);
      const pageCount = pdfDoc.getPageCount();
      if (pageCount > filePageLimit) {
        return {
          error: "PageLimitExceeded",
          message: `File ${file.originalname} exceeds your plan’s ${filePageLimit}-page limit.`,
        };
      }
      thumbnailImages = await extractFirstPageImages(file.buffer);
      if (thumbnailImages.length > 0) {
        const jpegImage = thumbnailImages.find(
          (img) => img.filter === "/DCTDecode"
        );
        if (jpegImage) {
          console.log("✅ Using embedded JPEG from PDF");
          const thumbnailFile = {
            buffer: jpegImage.data,
            originalname: `thumbnail_${baseName}.jpg`,
            contentType: "image/jpeg",
          };
          thumbnailUniqueFileName = `${Date.now()}-thumbnail-${baseName}.jpg`;
          const thumbnailDestination = `business/${thumbnailUniqueFileName}`;
          await uploadToAWS(thumbnailFile, thumbnailDestination);
        } else {
          console.log("⚠️ No JPEG image found, rasterizing with pdf2pic...");
          const { buffer } = await rasterizeFirstPage(file.buffer); // fallback
          console.log(buffer);
          const thumbnailFile = {
            buffer,
            originalname: `thumbnail_${baseName}.png`,
            contentType: "image/png",
          };
          thumbnailUniqueFileName = `${Date.now()}-thumbnail-${baseName}.png`;
          const thumbnailDestination = `business/${thumbnailUniqueFileName}`;
          await uploadToAWS(thumbnailFile, thumbnailDestination);
        }
      }
      console.log("thumbnailImages");
      console.log(thumbnailImages);
    } catch (err) {
      console.error("Error reading PDF:", err);
      return { error: "InvalidPDF", message: "Unable to process PDF file." };
    }
  }

  if (filePageLimit && fileExtension === "pptx") {
    try {
      const slideCount = await getPptxSlideCount(file.buffer);
      if (slideCount > filePageLimit) {
        return {
          error: "SlideLimitExceeded",
          message: `File "${file.originalname}" exceeds your plan’s ${filePageLimit}-slide limit.`,
        };
      }
      thumbnailImages = await extractPptxImages(file.buffer);
      if (thumbnailImages.length === 0) {
        console.log("No images found in PPTX.");
      } else {
        console.log(
          "Extracted PPTX images:",
          thumbnailImages.map((img) => img.name)
        );
        // Optionally: upload the first image as a thumbnail to S3
        const thumbnailFile = {
          buffer: thumbnailImages[0].data,
          originalname: `thumbnail_${baseName}.jpg`,
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

  if (["jpeg", "jpg", "png", "heic", "heif"].includes(fileExtension)) {
    // processImageFile can still do HEIC → JPEG/WebP conversion if needed
    const { buffer, newExtension } = await processImageFile(
      file,
      fileExtension
    );
    file.buffer = buffer;
    fileExtension = newExtension;

    thumbnailUniqueFileName = uniqueFileName;
  }

  // let isValidMagicNumber = false;

  // if (extensions) {
  //   if (magicNumbers[fileExtension]) {
  //     if (Array.isArray(magicNumbers[fileExtension])) {
  //       for (const magicNumber of magicNumbers[fileExtension]) {
  //         if (file.buffer.slice(0, magicNumber.length).equals(magicNumber)) {
  //           isValidMagicNumber = true;
  //           break;
  //         }
  //       }
  //     } else {
  //       isValidMagicNumber = file.buffer
  //         .slice(0, magicNumbers[fileExtension].length)
  //         .equals(magicNumbers[fileExtension]);
  //     }
  //   }
  // } else {
  //   for (const extension in magicNumbers) {
  //     if (fileExtension === extension) {
  //       if (Array.isArray(magicNumbers[extension])) {
  //         for (const magicNumber of magicNumbers[extension]) {
  //           if (file.buffer.slice(0, magicNumber.length).equals(magicNumber)) {
  //             isValidMagicNumber = true;
  //             break;
  //           }
  //         }
  //       } else if (magicNumbers[extension]) {
  //         isValidMagicNumber = file.buffer
  //           .slice(0, magicNumbers[extension].length)
  //           .equals(magicNumbers[extension]);
  //       }
  //       break;
  //     }
  //   }
  // }
  // if (!isValidMagicNumber) {
  //   return { error: "Mimetype", message: "Invalid File Type" };
  // }

  let { buffer, newExtension } = await processImageFile(file, fileExtension);
  file.buffer = buffer;
  fileExtension = newExtension;

  const fileHash = crypto
    .createHash("sha256")
    .update(file.buffer)
    .digest("hex");

  if (userId) {
    const existing = await Media.findOne({
      userId: mongoose.Types.ObjectId(userId),
      fileHash,
      softDelete: false,
    });
    if (existing) {
      console.log("File ALready exists");
      return {
        error: "DuplicateFile",
        message: "This file already exists in your database.",
      };
    }
    console.log("File Does not exists");
  }

  const sectionMap = {
    company_profile_media: "profile",
    product_catalogues_media: "catalogue",
    bot_media: "bot",
  };
  const prefix = sectionMap[section] || "file";
  const businessPrefix = getBusinessNamePrefix(businessName);
  const paddedCount = String(Number(count) + 1).padStart(2, "0"); // 01, 02, 03
  const uniqueFileCategoryName = `${prefix}_${paddedCount}_${businessPrefix}.${fileExtension}`;

  try {
    const fileURL = await uploadToAWS(file, destination);
    return {
      uniqueFileName,
      uniqueFileCategoryName,
      fileHash,
      thumbnailUniqueFileName,
    };
  } catch (error) {
    console.error("Error uploading file to AWS:", error);
    return { error: "UploadError", message: "Error uploading file to AWS" };
  }
}

module.exports = {
  uploadMultiple,
  uploadSingle,
  validateRequestFile,
  deleteMediaFromAWS,
  awsStorage: s3Client,
  setupS3LifecycleRule,
  softDeleteMedia,
  restoreMedia,
};
