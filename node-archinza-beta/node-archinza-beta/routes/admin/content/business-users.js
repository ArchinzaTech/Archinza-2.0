const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { sendResponse, sendError } = require("../../../helpers/api");
const {
  uploadSingle,
  validateRequestFile,
  uploadMultiple,
  deleteMediaFromAWS,
} = require("../../../middlewares/upload");
const path = require("path");
const fs = require("fs");
const BusinessAccount = require("../../../models/businessAccount");
const Media = require("../../../models/media");
const roleAuth = require("../../../middlewares/roleAuth");
const BusinessDeleteRequests = require("../../../models/businessDeleteRequests");
const BusinessPlan = require("../../../models/businessPlan");
const BusinessUserPlan = require("../../../models/businessUserPlan");
const BusinessVerifications = require("../../../models/businessVerifications");
const SubscriptionLogs = require("../../../models/subscriptionLogs");
const PaymentLogs = require("../../../models/paymentLogs");
const Invoice = require("../../../models/businessInvoice");

//get all users with their media
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = { isDeleted: false };
    if (req.query.business_types) {
      query.business_types = { $in: [...req.query.business_types.split(",")] };
    }
    if (req.query.status) {
      const statuses = req.query.status.split(",");

      if (statuses.includes("inprogress")) {
        query.$or = [
          { status: { $nin: ["registered", "completed"] } },
          { status: { $in: statuses.filter((s) => s !== "inprogress") } },
        ];
      } else {
        query.status = { $in: statuses };
      }
    }

    const users = await BusinessAccount.find(query)
      .select("-password")
      .populate(["business_types"])
      .sort({ createdAt: -1 });

    // Fetch and embed media for each user
    const usersWithMedia = await Promise.all(
      users.map(async (user) => {
        const media = await Media.find({ userId: user._id });
        const groupedMedia = media.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        }, {});

        return {
          ...user.toObject(),
          ...groupedMedia,
        };
      })
    );

    const deletionRequests = await BusinessDeleteRequests.find();

    return res.send(sendResponse({ data: usersWithMedia, deletionRequests }));
  })
);

//get single business user
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = await BusinessAccount.findOne({ _id: req.params.id })
      .select("-password")
      .populate("business_types");

    if (!data) {
      return res.send(sendResponse(null));
    }

    const subscriptionPlan = await BusinessUserPlan.findOne({
      businessAccount: data._id,
      isActive: true,
    }).populate("plan");

    let allMedia = await Media.find({ userId: req.params.id });

    let groupedMedia = {};
    let recentlyDeleted = {};

    allMedia.forEach((item) => {
      if (item.softDelete === true) {
        if (!recentlyDeleted[item.category])
          recentlyDeleted[item.category] = [];
        recentlyDeleted[item.category].push(item);
      } else {
        if (!groupedMedia[item.category]) groupedMedia[item.category] = [];
        groupedMedia[item.category].push(item);
      }
    });

    const result = {
      ...data.toObject(),
      ...groupedMedia,
      recently_deleted: recentlyDeleted,
      subscription: subscriptionPlan,
    };

    const verificationData = await BusinessVerifications.findOne({
      user: data._id,
    });

    if (verificationData) {
      result.verificationData = verificationData;
    }

    return res.send(sendResponse(result));
  })
);

//fetch subscription payments data of a single user
router.get(
  "/subscription-data/:id",
  asyncHandler(async (req, res) => {
    const user = await BusinessAccount.findById(req.params.id).select("_id");
    const subscriptionLogs = await SubscriptionLogs.find({
      businessAccount: user._id,
    }).lean();
    const subscriptionIds = subscriptionLogs.map(
      (log) => log.razorpaySubscriptionId
    );
    const allPaymentLogs = await PaymentLogs.find({
      subscriptionId: { $in: subscriptionIds },
    }).lean();
    const paymentLogMap = allPaymentLogs.reduce((acc, log) => {
      if (!acc[log.subscriptionId]) acc[log.subscriptionId] = [];
      acc[log.subscriptionId].push(log);
      return acc;
    }, {});
    const modifiedLogs = subscriptionLogs.map((log) => ({
      ...log,
      paymentLogs: paymentLogMap[log.razorpaySubscriptionId] || [],
    }));
    const plans = await BusinessPlan.find();
    return res.send(sendResponse({ subscriptionLogs: modifiedLogs, plans }));
  })
);

router.get(
  "/get-invoice/:paymentId",
  asyncHandler(async (req, res) => {
    const paymentId = req.params.paymentId;
    const invoice = await Invoice.findOne({ paymentId: paymentId });
    return res.send(sendResponse(invoice));
  })
);

//fetch payments logs data of a subscription
router.get(
  "/payment-logs/:subscriptionId",
  asyncHandler(async (req, res) => {
    const logs = await PaymentLogs.find({
      subscriptionId: req.params.subscriptionId,
    });
    return res.send(sendResponse(logs));
  })
);

router.post(
  "/",
  roleAuth(["edit_business_user", "edit_business_user_advanced"]),
  asyncHandler(async (req, res) => {
    req.body["onboarding_source"] = "cms";
    const user = await BusinessAccount.create(req.body);
    return res.send(sendResponse(user));
  })
);

router.post(
  "/check-username",
  asyncHandler(async (req, res) => {
    const { username, id } = req.body;
    const user = await BusinessAccount.findOne({ username });
    if (!user) {
      return res.send(sendResponse({ available: true }, "Username Available"));
    }
    if (user._id.toString() === id.toString()) {
      return res.send(sendResponse({ available: true }, "Username Available"));
    }
    return res.send(
      sendResponse({ available: false }, "Username already exists")
    );
  })
);

router.post(
  "/:id/upload-multiple",
  uploadMultiple,
  asyncHandler(async (req, res) => {
    console.log(req.files);
    const userId = req.params.id;
    const files = req.files;
    const fileTypes = req.body; // Contains information about which file belongs to which section

    if (!files || files.length === 0) {
      return res.send(sendResponse([], "No files provided", 400));
    }

    const filesBySection = {};

    // Process each file and determine its section
    for (const file of files) {
      const fieldname = file.fieldname; // This will be the section name from formData.append("section_name", file)

      if (!filesBySection[fieldname]) {
        filesBySection[fieldname] = [];
      }

      filesBySection[fieldname].push(file);
    }

    // Process files by section
    const results = {};

    for (const [sectionName, sectionFiles] of Object.entries(filesBySection)) {
      const allowedExtensionsProfile = ["pdf", "ppt", "jpeg", "png", "jpg"];
      const extensions = allowedExtensionsProfile;

      const sectionUploadedMedia = [];
      const sectionFileIds = [];

      // Process each file in the section
      for (const file of sectionFiles) {
        const fileValidation = await validateRequestFile(file, extensions);

        if (fileValidation?.error) {
          console.error(
            `File validation error for ${file.originalname}: ${fileValidation.message}`
          );
          continue;
        }

        const mediaData = {
          name: fileValidation.uniqueFileName,
          url: fileValidation.uniqueFileName,
          mimetype: file.mimetype,
          size: file.size,
          userId: userId,
          category: sectionName,
        };

        const media = await Media.create(mediaData);
        sectionUploadedMedia.push(media);
        sectionFileIds.push(media._id);
      }

      results[sectionName] = sectionUploadedMedia;
    }

    return res.send(sendResponse(results, "Files uploaded successfully", 200));
  })
);

//soft-delete users
router.put(
  "/delete-users",
  roleAuth(["edit_business_user_advanced"]),
  asyncHandler(async (req, res) => {
    const users = req.body.users;
    const deletedUsers = await BusinessAccount.updateMany(
      { _id: { $in: users } },
      { $set: { isDeleted: true, deletedAt: new Date().toISOString() } }
    );
    return res.send(sendError("Users Deleted successfully", 200));
  })
);

//create delete request
router.put(
  "/delete-request",
  roleAuth(["edit_business_user"]),
  asyncHandler(async (req, res) => {
    const users = req.body.users;
    const roleUser = req.body.roleUser;
    const roleUsersToCreate = users.map((userId) => ({
      user: userId,
      role_user: roleUser,
    }));
    const request = await BusinessDeleteRequests.insertMany(roleUsersToCreate);

    return res.send(sendResponse("Delete Request Sent"));
  })
);

router.delete(
  "/media/:fileName",
  asyncHandler(async (req, res) => {
    const media = await Media.deleteOne({ name: req.params.fileName });
    await deleteMediaFromAWS(req.params.fileName);

    return res.send(sendResponse([], "File Deleted Successfully"));
  })
);

module.exports = router;
