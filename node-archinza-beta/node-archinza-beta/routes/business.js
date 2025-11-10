const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
var _ = require("lodash");
const auth = require("../middlewares/auth");
const UAParser = require("ua-parser-js");
const axios = require("axios");
const FormData = require("form-data");
const {
  generateOTP,
  sendResponse,
  generateOTPExpiration,
  sendError,
  generateToken,
  fetchLatestrates,
  fetchUpdatedBudgetRanges,
  getBusinessTypeId,
  fetchUpdatedLargeBudgetRanges,
  streamToBuffer,
  convertINRtoUSDRanges,
  assignInitialPositions,
  checkAndFixPositions,
  reassignAllPositions,
  isProduction,
} = require("../helpers/api");
const agenda = require("../jobs/agenda");
const BusinessAccount = require("../models/businessAccount");
const BusinessAccountOptions = require("../models/businessAccountOptions");
const Media = require("../models/media");
const {
  uploadMultiple,
  uploadSingle,
  validateRequestFile,
  deleteMediaFromAWS,
  awsStorage,
  softDeleteMedia,
  restoreMedia,
} = require("../middlewares/upload");
const config = require("../config/config");
const path = require("path");
const fs = require("fs").promises;
const { sendmail } = require("../helpers/mailer");
const BusinessTypes = require("../models/businessTypes");
const BusinessWorkQuestions = require("../models/businessWorkFlowQuestion");
const PersonalAccount = require("../models/personalAccount");
const PersonalAccountOptions = require("../models/options");
const Services = require("../models/services");
const Reviews = require("../models/reviews");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const BusinessVerifications = require("../models/businessVerifications");
const KnowledgeBaseMedia = require("../models/knowledgeBaseMedia");
const Feedback = require("../models/feedback");
const { default: mongoose } = require("mongoose");
const businessNotificationAgenda = require("../jobs/businessNotificationsAgenda");
const businessReminderSchedule = require("../jobs/businessUsers/businessReminders");
const businessOfflinePageSchedule = require("../jobs/businessUsers/businessOfflineReminders");
const UserDevice = require("../models/userDevice");
const BusinessUserPlan = require("../models/businessUserPlan");
const BusinessPlan = require("../models/businessPlan");
const aiApiLogger = require("../middlewares/aiApiLogger");

const galleryTitles = [
  "project_renders_media",
  "completed_products_media",
  "sites_inprogress_media",
];
const parseRangeString = (rangeString) => {
  rangeString = rangeString.trim().toUpperCase();
  if (rangeString.startsWith("UNDER")) {
    const maxValue = parseInt(
      rangeString.replace("UNDER", "").replace(/,/g, "").trim(),
      10
    );
    return { min: 0, max: maxValue };
  }

  if (rangeString.startsWith("ABOVE")) {
    const maxValue = parseInt(
      rangeString.replace("ABOVE", "").replace(/,/g, "").trim(),
      10
    );
    return { min: "Above", max: maxValue };
  }

  const [minPart, maxPart] = rangeString.split(" - ");
  const minValue = parseInt(minPart.replace(/,/g, "").trim(), 10);
  const maxValue = maxPart
    ? parseInt(maxPart.replace(/,/g, "").trim(), 10)
    : null;

  return { min: minValue, max: maxValue };
};

const parseProjectFeeRangeString = (rangeString) => {
  rangeString = rangeString.trim().toUpperCase();
  if (rangeString.startsWith("UNDER")) {
    const maxValue = parseInt(
      rangeString.replace("UNDER", "").replace(/,/g, "").trim(),
      10
    );
    return { min: "Under", max: maxValue };
  }

  if (rangeString.startsWith("ABOVE")) {
    const maxValue = parseInt(
      rangeString.replace("ABOVE", "").replace(/,/g, "").trim(),
      10
    );
    return { min: "Above", max: maxValue };
  }

  const [minPart, maxPart] = rangeString.split(" - ");
  const minValue = parseInt(minPart.replace(/,/g, "").trim(), 10);
  const maxValue = maxPart
    ? parseInt(maxPart.replace(/,/g, "").trim(), 10)
    : null;

  return { min: minValue, max: maxValue };
};

//signup
router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const body = req.body;
    // 6 digit otp
    var otp = generateOTP();

    session = req.session;
    session.otp = otp;

    console.log("session", req.session);
    agenda.now("email-otp", { email: body.email, otp });

    if (isProduction()) {
    agenda.now("mobile-otp", {
      phone: body.phone,
      otp: otp,
      country_code: body.country_code,
    });
    }

    res.send(sendResponse([], "Sign up OTP sent successfully"));
  })
);

//otp verify
router.post(
  "/signup/otp-verify",
  asyncHandler(async (req, res) => {
    session = req.session;
    console.log(session.otp);
    const defaultPlan = await BusinessPlan.findOne({ isDefault: true });
    req.session.destroy();
    req.body["onboarding_source"] = "web";
    const data = await BusinessAccount.create(_.omit(req.body, ["otp"]));
    const user = await BusinessAccount.findById(data._id)
      .select("-password")
      .lean();
    if (defaultPlan) {
      const endDate = new Date();
      endDate.setMonth(
        endDate.getMonth() + Number(defaultPlan.durationInMonths)
      );
      await BusinessUserPlan.create({
        businessAccount: user._id,
        plan: defaultPlan._id,
        startDate: new Date(),
        endDate,
      });
    }
    const token = generateToken(user, "business");
    return res.send(sendResponse({ token }, "Register Successfull"));
    if (session.otp == req.body.otp) {
    } else {
      return res.send(sendError("Invalid OTP", 400));
    }
  })
);

//check username
router.post(
  "/check-username",
  asyncHandler(async (req, res) => {
    const { username } = req.body;

    //case-insensitive check
    const user = await BusinessAccount.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    });

    if (user) {
      return res.send(
        sendResponse({ available: false }, "Username already exists")
      );
    }
    return res.send(sendResponse({ available: true }, "Username Available"));
  })
);

//to update business account step form details
router.post(
  "/business-details/:id",
  uploadSingle,
  asyncHandler(async (req, res) => {
    if (req.file) {
      const file = req.file;
      const allowedExtensions = ["jpeg", "jpg", "png", "svg", "heic", "webp"];

      const validationResult = await validateRequestFile({
        file,
        extensions: allowedExtensions,
      });
      if (validationResult.error) {
        return res.status(200).send(sendError(validationResult.message, 400));
      }

      const { uniqueFileName } = validationResult;

      req.body["brand_logo"] = uniqueFileName;
      await BusinessAccount.updateOne({ _id: req.params.id }, req.body);
      return res.send(sendResponse(req.body, "Details updated Successfullly"));
    } else {
      //check if bio/location is added or not and is not verified
      //trigger reminder emails
      await BusinessAccount.updateOne({ _id: req.params.id }, req.body);
      const account = await BusinessAccount.findById(req.params.id);

      if (!account.firstValidAt) {
        if (
          account.bio?.trim() !== "" &&
          account.google_location?.latitude?.trim() !== "" &&
          account.google_location?.longitude?.trim() !== ""
        ) {
          await BusinessAccount.updateOne(
            { _id: req.params.id },
            { firstValidAt: new Date() }
          );

          if (!account.isVerified) {
            console.log("Mails Scheduled");
            //schedule mails
            for (const {
              delay,
              label,
              template,
              subject,
            } of businessReminderSchedule) {
              businessNotificationAgenda.schedule(delay, label, {
                entryId: account._id,
                email: account.email,
                subject: subject,
                templateVars: {
                  name: account.business_name || "User",
                  template: template,
                },
              });
            }
          }
        }
      }
      return res.send(sendResponse([], "Details updated Successfullly"));
    }
  })
);

//get single business account entry
router.get(
  "/business-details/:id",
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

    const positionCount = await Media.countDocuments({
      userId: mongoose.Types.ObjectId(req.params.id),
      category: { $in: galleryTitles },
      softDelete: false,
      visibility: true,
      masonryPosition: { $exists: true, $ne: null },
    });
    if (positionCount === 0 || positionCount < 14) {
      await reassignAllPositions(req.params.id, galleryTitles);
    }
    // await reassignAllPositions(req.params.id, galleryTitles);

    // Fetch ALL media at once
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

//check for user data by username
router.get(
  "/profile/:username",
  asyncHandler(async (req, res) => {
    const { username } = req.params;
    const data = await BusinessAccount.findOne({ username })
      .select("-password")
      .populate("business_types");

    if (!data) {
      return res.send(sendResponse(null));
    }

    const subscriptionPlan = await BusinessUserPlan.findOne({
      businessAccount: data._id,
      isActive: true,
    }).populate("plan");

    const allMedia = await Media.find({ userId: data._id });

    const groupedMedia = {};
    const recentlyDeleted = {};

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

//get meta tags for busiess by username
router.get(
  "/meta-data/:username",
  asyncHandler(async (req, res) => {
    const { username } = req.params;
    console.log("Inside meta data api");
    console.log(username);
    const data = await BusinessAccount.findOne({ username: username }).select(
      "business_name brand_logo"
    );
    return res.send(sendResponse(data));
  })
);

//get business-types
router.get(
  "/business-types",
  asyncHandler(async (req, res) => {
    const businessTypes = await BusinessTypes.find();
    return res.send(sendResponse(businessTypes));
  })
);

//upload dummmy data
router.post(
  "/upload",
  asyncHandler(async (req, res) => {
    const data = [
      "3D Modelling",
      "Measurements",
      "Shop Drawings",
      "Site Survey",
      "Estimation & Costing",
      "Material Sourcing",
      "Building Permits",
      "PMC",
      "Post Construction Support",
    ];

    const business = await Media.create({
      name: "1746787211258-gallery_9.png",
      url: "1746787211258-gallery_9.png",
      mimetype: "image/png",
      size: "194347",
      visibility: true,
      userId: "68257cd740036549ef56bf93",
      category: "project_renders_media",
      softDelete: true,
      createdAt: "2025-05-09T10:40:11.609Z",
      updatedAt: "2025-05-09T10:40:11.609Z",
      deletedAt: new Date(),
      __v: 0,
    });
    // const business_types = types.map((it) => ({
    //   category: it,
    //   prefix: getBusinessTypeId(it),
    // }));

    return res.send(sendResponse("OK"));
  })
);

//get business master options
router.get(
  "/options",
  asyncHandler(async (req, res) => {
    const qs = req.query.qs;
    const data = await BusinessAccountOptions.findOne();
    if (!data) {
      res.send(sendError("No Options Found", 404));
    }

    let transformedOptions;
    if (qs) {
      transformedOptions = data?.[qs]?.map((option) => ({
        label: option,
        value: option,
      }));
    } else {
      transformedOptions = data;
    }

    data.toJSON();
    // data.options = transformedOptions;

    return res.send(sendResponse(transformedOptions));
  })
);

//update media visibility status
router.put(
  "/business-edit/media/:id",
  asyncHandler(async (req, res) => {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.send(sendResponse([], "No Media found"));
    }
    console.log(req.body.visibility);

    await media.updateOne({ visibility: req.body.visibility });

    return res.send(sendResponse(media, "Media Updated Successfully"));
  })
);

// login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = await BusinessAccount.findOne({
      username: req.body.username,
    }).lean();

    if (data) {
      //match password
      if (data.password !== req.body.password) {
        return res.send(sendError("Invalid Credentials", 400));
      }

      if (data.isDeleted && data.deletedAt) {
        return res.send(
          sendResponse({
            error:
              "This account is no longer active. Contact the admin for more details.",
          })
        );
      }
      const { deviceId } = req.body;
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"];
      const parser = new UAParser(userAgent);
      const result = parser.getResult();

      const browser = result.browser.name;
      const os = result.os.name;
      const deviceType = result.device.type || "desktop";

      const existingDevice = await UserDevice.findOne({
        user: data._id,
        deviceId,
      });
      //new device
      if (!existingDevice) {
        await UserDevice.create({
          user: data._id,
          userModel: "BusinessAccount",
          deviceId,
          browser,
          os,
          ip,
          deviceType,
        });
        agenda.now("new-device-login", {
          email: data.email,
          loginDate: new Date().toDateString(),
          browser,
          os,
          resetLink: config.react_app_url + "/reset-password",
        });
      }
      const token = generateToken({ _id: data._id }, "business");
      res.send(sendResponse(token));
    } else {
      res.send(sendError("Invalid Credentials", 400));
    }
  })
);

//upload sections media
router.post(
  "/business-details/:id/upload/:section_name",
  uploadMultiple,
  asyncHandler(async (req, res) => {
    const files = req.files;
    let filesList = [];
    let uploadedMediaList = [];
    const allowedExtensionsWorkspace = [
      "jpeg",
      "png",
      "jpg",
      "heic",
      "heif",
      "webp",
    ];
    const allowedExtensionsProfile = [
      "pdf",
      "pptx",
      "jpeg",
      "png",
      "jpg",
      "heic",
      "heif",
      "webp",
    ];
    const extensions =
      req.params.section_name === "workspace_media"
        ? allowedExtensionsWorkspace
        : allowedExtensionsProfile;
    for (const file of files) {
      const fileValidation = await validateRequestFile({
        file,
        extensions,
        userId: req.params.id,
        filePageLimit: req.body.filePageLimit,
      });

      if (fileValidation?.error) {
        return res.send(sendResponse([], fileValidation.message, 400));
      }
      const image = {
        name: fileValidation.uniqueFileName,
        url: fileValidation.uniqueFileName,
        mimetype: file.mimetype,
        size: file.size,
        userId: req.params.id,
        category: req.params.section_name,
        fileHash: fileValidation.fileHash,
        thumbnail: fileValidation.thumbnailUniqueFileName || null,
      };
      const media = await Media.create(image);
      uploadedMediaList.push(media);
      filesList.push(media._id);
    }

    // const upload = await BusinessAccount.findByIdAndUpdate(
    //   { _id: req.params.id },
    //   {
    //     $push: {
    //       [`${req.params.section_name}`]: [filesList],
    //     },
    //   },
    //   { new: true }
    // );
    return res.send(
      sendResponse([uploadedMediaList], "Details Uploaded Successfully")
    );
  })
);

//upload media in business edit
router.post(
  "/business-edit/:id/upload/:section_name",
  uploadMultiple,
  asyncHandler(async (req, res) => {
    const files = req.body.files.map((file) => ({
      ...file,
      userId: req.params.id,
      category: req.params.section_name,
    }));

    const upload = await Media.insertMany(files);
    // const upload = await BusinessAccount.findByIdAndUpdate(
    //   { _id: req.params.id },
    //   {
    //     $push: {
    //       [`${req.params.section_name}`]: [...files],
    //     },
    //   },
    //   { new: true }
    // );
    return res.send(
      sendResponse([req.body.files], "Media Uploaded Successfully")
    );
  })
);

//delete media uploads from specific section
router.put(
  "/business-details/:id/documents",
  asyncHandler(async (req, res) => {
    const { documentId } = req.body;

    // const result = await BusinessAccount.updateOne(
    //   { _id: id },
    //   { $pull: { [`${section}`]: documentId } }
    // );

    //delete from Media
    const media = await Media.findByIdAndDelete(documentId);
    if (media) {
      await deleteMediaFromAWS([media.name]);
    }
    res.send(sendResponse([], "Document deleted successfully"));
  })
);

//upload media
router.post(
  "/upload-media",
  uploadMultiple,
  asyncHandler(async (req, res) => {
    const files = req.files;
    const filesList = [];
    const uploadedMediaList = [];

    const allowedFormats = req.body.allowedExtensions;
    for (const file of files) {
      const fileValidation = await validateRequestFile(file, allowedFormats);
      if (fileValidation?.error) {
        return res.send(sendResponse([], fileValidation.message, 400));
      }

      const image = {
        name: fileValidation.uniqueFileName,
        url: fileValidation.uniqueFileName,
        mimetype: file.mimetype,
        size: file.size,
      };
      // const media = await Media.create(image);
      uploadedMediaList.push(image);
      // filesList.push(media._id);
    }
    return res.send(
      sendResponse(uploadedMediaList, "Media Uploaded Successfully")
    );
  })
);

//delete all media for a business user
router.delete(
  "/delete-media/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const media = await Media.find({ userId: id });

    if (media.length) {
      await Media.deleteMany({ userId: id });
      media.forEach((it) => {
        deleteMediaFromAWS(it.name);
      });
    }
    res.send(sendResponse([], "Media deleted successfully"));
  })
);

router.post(
  "/update-currency",
  asyncHandler(async (req, res) => {
    const { base_currency, target_currency, exchange_rate } = req.body;
    const latest_currency = {
      base_currency,
      target_currency,
      exchange_rate,
    };

    await BusinessAccountOptions.findOneAndUpdate(
      {
        _id: "66b4834da7b01c1f3d633936",
        "latest_currency.base_currency": base_currency,
        "latest_currency.target_currency": target_currency,
      },
      {
        $set: {
          "latest_currency.$.exchange_rate": exchange_rate,
          "latest_currency.$.last_updated": new Date(),
        },
      },
      { new: true, upsert: true, useFindAndModify: false }
    );
    return res.send(sendResponse(latest_currency, "Latest Currency Updated"));
  })
);

//update field visibility
router.put(
  "/:id/sections-visibility",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { section, visibility } = req.body;
    const user = await BusinessAccount.findByIdAndUpdate(
      id,
      {
        [`${section}.isPrivate`]: visibility,
      },
      { new: true }
    );

    return res.send(sendResponse(user));
  })
);

//fetch latest currency
router.get(
  "/get-currency",
  asyncHandler(async (req, res) => {
    const data = await BusinessAccountOptions.findOne();
    let currencyData = data.latest_currency;
    if (currencyData) {
      const diffTime = Math.abs(new Date() - currencyData.last_updated);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // if (diffDays > 1) {
      //   const latestRates = await fetchLatestrates("INR", "USD");
      //   const latestConversionRate = Object.values(latestRates.rates)[0];
      //   const usdRanges = await convertINRtoUSDRanges(
      //     data["minimum_project_fee"],
      //     latestConversionRate
      //   );

      //   currencyData = {
      //     exchange_rate: latestConversionRate,
      //     last_updated: new Date(),
      //   };
      //   //update currencyData in BusinessAccountOptions
      //   await data.update({ latest_currency: currencyData });
      //   return res.send(sendResponse(usdRanges));
      // } else {
      const usdRanges = await convertINRtoUSDRanges(
        data["minimum_project_fee"],
        currencyData.exchange_rate
      );
      return res.send(sendResponse(usdRanges));
      // }
    }
  })
);

//check corresponding account
router.post(
  "/check-corresponding-account",
  asyncHandler(async (req, res) => {
    const { email, countryCode, currentAuthType } = req.body;

    if (currentAuthType === "personal") {
      const user = await BusinessAccount.findOne({
        email,
      }).select("-password");

      if (!user) {
        return res.send(sendResponse({}));
      }
      const media = await Media.find({ userId: user.id });
      const groupedMedia = media.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});

      const result = {
        ...user.toObject(),
        ...groupedMedia,
        auth_type: "business",
      };

      return res.send(sendResponse(result));
    } else {
      const user = await PersonalAccount.findOne({
        email,
      });

      if (!user) {
        return res.send(sendResponse({}));
      }
      const result = {
        ...user.toObject(),
        auth_type: "personal",
      };
      return res.send(sendResponse(result));
    }
  })
);

//get all business datatypes
router.get(
  "/options",
  asyncHandler(async (req, res) => {
    const qs = req.query.qs;
    const business_type = req.query.businessType;

    const data = await BusinessAccountOptions.findOne();
    if (!data) {
      res.send(sendError("No Options Found", 404));
    }

    let transformedOptions;
    if (qs) {
      transformedOptions = data?.[qs]?.map((option) => ({
        label: option,
        value: option,
      }));
    } else {
      transformedOptions = data;
    }

    data.toJSON();
    data.options = transformedOptions;

    return res.send(sendResponse({ options: transformedOptions }));
  })
);

router.get(
  "/business-type-options",
  asyncHandler(async (req, res) => {
    const options = await BusinessAccountOptions.findOne();

    return res.send(sendResponse(options));
  })
);

router.get(
  "/business-type-options/:business_type",
  asyncHandler(async (req, res) => {
    const business_type_id = getBusinessTypeId(req.params.business_type);
    const options = await BusinessAccountOptions.findOne();

    const businessTypeOptions = options["business_type_" + business_type_id];
    const transformedOptions = {};

    for (const key in businessTypeOptions) {
      if (Array.isArray(businessTypeOptions[key])) {
        transformedOptions[key] = businessTypeOptions[key].map((item) => ({
          label: item,
          value: item,
        }));
      }
    }
    return res.send(sendResponse(transformedOptions));
  })
);

router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await BusinessAccount.findOne({ email: email });

    if (!user) {
      return res.send(sendError("User not found", 400));
    }
    var otp = generateOTP();
    session = req.session;
    session.otp = otp;
    session.reset = 1;
    if (config.mail.mailer == "on") {
      const mail = sendmail({
        to: email,
        from: {
          name: config.mail.sender_name,
          address: config.mail.sender,
        },
        cc: config.mail.reciever_cc,
        subject: "Reset Password OTP",
        template: "forgot_otp",
        templateVars: { otp },
      });

      console.log("mail sent", mail);
    }

    return res.send(sendResponse("OTP sent Successfully"));
  })
);

router.post(
  "/forgot-password/resend",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await BusinessAccount.findOne({ email: email });

    if (!user) {
      return res.send(sendError("User not found", 400));
    }
    var otp = generateOTP();
    session = req.session;
    session.otp = otp;
    session.reset = 1;
    if (config.mail.mailer == "on") {
      const mail = sendmail({
        to: email,
        from: {
          name: config.mail.sender_name,
          address: config.mail.sender,
        },
        cc: config.mail.reciever_cc,
        subject: "Reset Password OTP",
        template: "forgot_otp",
        templateVars: { otp },
      });

      console.log("mail sent", mail);
    }

    return res.send(sendResponse("OTP sent Successfully"));
  })
);

router.post(
  "/forgot-password/otp-verify",
  asyncHandler(async (req, res) => {
    const session = req.session;
    if (session.otp == req.body.otp) {
      res.send(sendResponse("OTP is correct"));
    } else {
      res.send(sendError("Invalid OTP", 400));
    }
  })
);

router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    session = req.session;

    if (!session.reset) {
      res.send(sendError("Reset Password Not Allowed", 400));
      return;
    }

    const data = await BusinessAccount.findOne({ email: req.body.email });
    if (!data) {
      res.send(sendError("User Not Found", 400));
      return;
    }

    await data.updateOne({ password: req.body.password });
    req.session.destroy();

    res.send(sendResponse("Password Changed Successfully"));
  })
);

router.get(
  "/business-details/:id/workspace-data/:category",
  asyncHandler(async (req, res) => {
    const workspaceData = await BusinessAccount.findOne({ _id: req.params.id });

    if (!workspaceData) {
      res.send(sendError("No User Available"));
    }
    const business_type_id = getBusinessTypeId(workspaceData.business_type);

    const data = workspaceData[
      `${business_type_id}_workspace_category_media`
    ].filter((it) => it.category === req.params.category);
    return res.send(sendResponse(data));
  })
);

router.get(
  "/business-types",
  asyncHandler(async (req, res) => {
    const businessTypes = await BusinessTypes.find();
    return res.send(sendResponse(businessTypes));
  })
);

router.get(
  "/business-questions",
  asyncHandler(async (req, res) => {
    const businessTypesArray = req.query.business_types
      ? req.query.business_types.split(",")
      : [];

    const questions = await BusinessWorkQuestions.find().populate(
      "business_types"
    );
    if (businessTypesArray.length) {
      const filteredQuestions = questions.filter((question) =>
        question.business_types.some((businessType) =>
          businessTypesArray.includes(businessType._id.toString())
        )
      );

      return res.send(sendResponse(filteredQuestions));
    } else {
      return res.send(sendResponse(questions));
    }
  })
);

//fetch gcp media files
router.get("/get-file", async (req, res) => {
  const fileName = req.query.fileName;

  try {
    const params = {
      Bucket: config.aws_bucket_name,
      Key: `business/${fileName}`,
    };

    const command = new GetObjectCommand(params);
    const response = await awsStorage.send(command);

    const fileContents = await streamToBuffer(response.Body);

    res.setHeader("Content-Type", "application/octet-stream");
    res.send(sendResponse(fileContents));
  } catch (error) {
    console.error("Error retrieving file from AWS S3:", error);
    res.status(500).send(sendResponse(null, "Error retrieving file"));
  }
});

//get all reviews
router.post(
  "/get-reviews/:id",
  asyncHandler(async (req, res) => {
    const reviews = await Reviews.find({ business: req.params.id });

    res.send(sendResponse(reviews, "Reviews fetched successfully"));
  })
);

//request for verification
router.post(
  "/get-verified",
  asyncHandler(async (req, res) => {
    const response = await BusinessVerifications.create(req.body);
    const user = await BusinessAccount.findById(req.body.user).populate("");

    //cancel all the reminder notifications
    await businessNotificationAgenda.cancel({
      name: "send-business-reminder",
      "data.entryId": user._id,
    });
    //trigger verification notification
    // businessNotificationAgenda.now("send-business-verify", {
    //   entryId: user._id,
    //   email: user.email,
    //   templateVars: {
    //     name: user.name || "User",
    //   },
    // });
    res.send(sendResponse(response, "Verification request sent successfully"));
  })
);

//change visibility status
router.put(
  "/change-visibility/:id",
  asyncHandler(async (req, res) => {
    const response = await BusinessAccount.findByIdAndUpdate(req.params.id, {
      pageStatus: req.body.pageStatus,
    });
    //check if status is offline
    //schedule mail
    if (req.body.pageStatus === "online") {
      await businessNotificationAgenda.cancel({
        name: "send-business-offline-notification",
        "data.entryId": response._id,
      });
    } else {
      for (const {
        delay,
        label,
        template,
        subject,
      } of businessOfflinePageSchedule) {
        businessNotificationAgenda.schedule(delay, label, {
          entryId: response._id,
          email: response.email,
          subject: subject,
          templateVars: {
            name: response.business_name || "User",
            template: template,
          },
        });
      }
    }
    res.send(sendResponse(response, "Status changes successfully"));
  })
);

//upload knowledge base media
router.put(
  "/knowledge-base-media/:id",
  uploadMultiple,
  asyncHandler(async (req, res) => {
    const user = await BusinessAccount.findById(req.params.id);
    if (!user) {
      return res.send(sendResponse([], "No user found"));
    }

    const files = req.files;
    if (!files || files.length === 0) {
      return res.send(sendResponse([], "No files uploaded", 400));
    }

    const mediaDocs = files.map((result, index) => ({
      name: result.name,
      url: result.name,
      mimetype: files[index].mimetype,
      size: files[index].size,
      userId: req.params.id,
    }));

    // Batch insert all media documents
    const uploadedMediaList = await KnowledgeBaseMedia.insertMany(mediaDocs);
    res.send(sendResponse(uploadedMediaList, "Media uploaded successfully"));
  })
);

// soft-delete images
router.put(
  "/soft-delete-images/:section",
  asyncHandler(async (req, res) => {
    const section = req.params.section;
    const { imageIds } = req.body;
    const objectIds = imageIds.map((id) => new mongoose.Types.ObjectId(id));
    const result = await Media.updateMany(
      {
        _id: { $in: objectIds },
      },
      { $set: { softDelete: true, deletedAt: new Date() } }
    );
    softDeleteMedia(imageIds);
    return res.send(sendResponse(result, "Media soft deleted successfully"));
  })
);

// router.put(
//   "/soft-delete-images/:user",
//   asyncHandler(async (req, res) => {
//     const user = req.params.user;
//     const { imageIds } = req.body;
//     const objectIds = imageIds.map((id) => new mongoose.Types.ObjectId(id));

//     // Soft-delete the images
//     const result = await Media.updateMany(
//       {
//         _id: { $in: objectIds },
//         userId: mongoose.Types.ObjectId(user),
//       },
//       { $set: { softDelete: true, deletedAt: new Date() } }
//     );

//     // Handle previously soft-deleted images
//     const softDeletedImages = await Media.find({
//       userId: mongoose.Types.ObjectId(user),
//       softDelete: true,
//     })
//       .sort({ deletedAt: 1 })
//       .limit(imageIds.length);
//     console.log(softDeletedImages);
//     if (softDeletedImages.length > 0) {
//       const imageNames = softDeletedImages.map((img) => img.name);
//       await deleteMediaFromAWS(imageNames);
//       await Media.deleteMany({
//         _id: { $in: softDeletedImages.map((img) => img._id) },
//       });
//     }

//     // // Call existing softDeleteMedia function
//     softDeleteMedia(imageIds);

//     return res.send(sendResponse(result, "Media soft deleted successfully"));
//   })
// );

router.put(
  "/pin-images",
  asyncHandler(async (req, res) => {
    const { pinnedImages, unpinnedImages } = req.body;

    const pinnedObjectIds = pinnedImages.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const unpinnedObjectIds = unpinnedImages.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Perform bulk write operations for efficiency
    const bulkOperations = [
      ...(pinnedObjectIds.length > 0
        ? [
            {
              updateMany: {
                filter: { _id: { $in: pinnedObjectIds } },
                update: { $set: { pinned: true } },
              },
            },
          ]
        : []),

      ...(unpinnedObjectIds.length > 0
        ? [
            {
              updateMany: {
                filter: { _id: { $in: unpinnedObjectIds } },
                update: { $set: { pinned: false } },
              },
            },
          ]
        : []),
    ];

    // Execute bulk write if there are operations
    let result = { modifiedCount: 0 };
    if (bulkOperations.length > 0) {
      result = await Media.bulkWrite(bulkOperations);
    }

    return res.send(
      sendResponse(
        result,
        `Images ${pinnedImages.length > 0 ? "pinned" : "unpinned"} successfully`
      )
    );
  })
);

// hide/unhide images
router.put(
  "/hide-images",
  asyncHandler(async (req, res) => {
    const { hiddenImages, visibleImages } = req.body;

    const hiddenObjectIds = hiddenImages.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const visibleObjectIds = visibleImages.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Perform bulk write operations for efficiency
    const bulkOperations = [
      ...(hiddenObjectIds.length > 0
        ? [
            {
              updateMany: {
                filter: { _id: { $in: hiddenObjectIds } },
                update: { $set: { visibility: false } },
              },
            },
          ]
        : []),

      ...(visibleObjectIds.length > 0
        ? [
            {
              updateMany: {
                filter: { _id: { $in: visibleObjectIds } },
                update: { $set: { visibility: true } },
              },
            },
          ]
        : []),
    ];

    // Execute bulk write if there are operations
    let result = { modifiedCount: 0 };
    if (bulkOperations.length > 0) {
      result = await Media.bulkWrite(bulkOperations);
    }

    return res.send(
      sendResponse(
        result,
        `Images ${hiddenImages.length > 0 ? "hidden" : "visibled"} successfully`
      )
    );
  })
);

//hide/unhide documents
router.put(
  "/hide-documents",
  asyncHandler(async (req, res) => {
    const { documentId, visibility } = req.body;
    await Media.findByIdAndUpdate(documentId, { visibility });
    // await Media.updateMany({ source: media._id, visibility });
    return res.send(sendResponse("Document updated successfully"));
  })
);

// move images
router.put(
  "/move-images",
  asyncHandler(async (req, res) => {
    const { imageIds, section } = req.body;
    const result = await Media.updateMany(
      {
        _id: { $in: imageIds },
      },
      { $set: { category: section } }
    );

    return res.send(sendResponse([], "Images moved successfully"));
  })
);

// restore images
router.put(
  "/restore-images",
  asyncHandler(async (req, res) => {
    const { imageIds } = req.body;
    const objectIds = imageIds.map((id) => new mongoose.Types.ObjectId(id));
    const result = await Media.updateMany(
      {
        _id: { $in: objectIds },
      },
      { $set: { softDelete: false, deletedAt: null } }
    );
    await restoreMedia(imageIds);

    return res.send(sendResponse([], "Images restored successfully"));
  })
);

// delete multiple media for a user
router.put(
  "/delete-images",
  asyncHandler(async (req, res) => {
    const { imageIds } = req.body;
    const objectIds = imageIds.map((id) => new mongoose.Types.ObjectId(id));
    const allMedia = await Media.find(
      { _id: { $in: objectIds } },
      { name: 1, _id: 0 }
    );
    const imageNames = allMedia.map((media) => media.name);

    const media = await Media.deleteMany({ _id: { $in: objectIds } });
    if (media) {
      await deleteMediaFromAWS(imageNames);
    }
    res.send(sendResponse([], "Document deleted successfully"));
  })
);

//scrap_content API
router.post(
  "/scrape_content",
  uploadMultiple,
  asyncHandler(async (req, res) => {
    try {
      console.log(req.body);
      const formData = new FormData();
      // Normalize files_s3 to mimic cURL style
      if (req.body.files_s3) {
        let files = req.body.files_s3;

        // if frontend sent as array of strings → stringify into JSON array
        if (Array.isArray(files)) {
          req.body["files_s3[]"] = JSON.stringify(files);
          delete req.body.files_s3;
        }

        // if frontend sent as string already → wrap properly
        else if (typeof files === "string") {
          try {
            JSON.parse(files); // check if it's already JSON
            req.body["files_s3[]"] = files;
          } catch {
            req.body["files_s3[]"] = JSON.stringify([files]);
          }
          delete req.body.files_s3;
        }
      }

      // Append body fields to form data
      Object.entries(req.body).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`${key}`, v));
        } else {
          formData.append(key, value);
        }
      });

      req.files.forEach((file) => {
        formData.append(file.fieldname, file.buffer, {
          filename: file.originalname || "file",
          contentType: file.mimetype,
        });
      });

      const apiUrl = config.scrap_content_api + "scrap_content/";
      const response = await axios.post(apiUrl, formData, {
        headers: formData.getHeaders(),
      });

      // if (response.data) {
      //   // await BusinessAccount.findByIdAndUpdate(req.body.user_id, {
      //   //   scrap_content_task_id: response.data.task_id || null,
      //   // });
      // }
      return res.send(sendResponse(response.data));
    } catch (error) {
      console.error("Error calling scrape API:", error.response.data);
      return res.send(sendError("Failed to scrape content", 500));
    }
  })
);

//business feedback
router.post(
  "/feedback",
  asyncHandler(async (req, res) => {
    req.body["user_type"] = "business";
    req.body["source"] = "web";
    const record = await Feedback.create(req.body);
    return res.send(sendResponse("Feedback Submitted"));
  })
);

//check scrap content API status
router.get("/scrape_content/status/:taskId", async (req, res) => {
  try {
    const response = await axios.get(
      `${config.scrap_content_api}/scrap_content_status/${req.params.taskId}`
    );
    if (response.data) {
      if (response.data.status === true) {
        // if (response.data.data.images?.length > 0) {
        //   const validImages = response.data.data.images.filter(
        //     (image) => image.filename !== "NA" && image.category !== "NA"
        //   );
        //   const mediaPromises = validImages.map(async (image) => {
        //     const newMedia = new Media({
        //       name: image.filename,
        //       url: image.filename,
        //       userId: response.data.data.user_id,
        //       category: image.category,
        //       height: image.height,
        //       width: image.width,
        //     });
        //     await newMedia.save();
        //     return { mediaId: newMedia._id, category: image.category };
        //   });
        //   await Promise.all(mediaPromises);
        // }
        return res.send(sendResponse({ status: response.data.status }));
      } else if (response.data.state === "FAILURE") {
        return res.send(sendResponse({ status: false }));
      } else {
        return res.send(sendResponse({ status: response.data.status }));
      }
    }
  } catch (err) {
    console.log(err.message);
  }
});

//slider images update
router.post(
  "/media/update-position",
  asyncHandler(async (req, res) => {
    const { imageId, position, userId } = req.body;
    console.log(position);
    // Validate input
    if (!imageId || position === undefined || position === null || !userId) {
      return res.send(sendResponse(null, "Missing required fields"));
    }

    // Validate position range
    if (position < 0 || position > 13) {
      return res.send(sendResponse(null, "Invalid position"));
    }

    try {
      // Check if the image exists and belongs to the user
      const image = await Media.findById(imageId);
      console.log(image);
      if (!image) {
        return res.send(sendResponse(null, "Image not found"));
      }

      // if (image.userId.toString() !== userId) {
      //   return res.send(sendResponse(null, "Unauthorized"));
      // }

      // Check if there's already an image at this position
      const existingImageAtPosition = await Media.findOne({
        userId: userId,
        masonryPosition: position,
        softDelete: false,
        visibility: true,
      });
      console.log(existingImageAtPosition);
      // If another image is at the target position, swap its position
      if (
        existingImageAtPosition &&
        existingImageAtPosition._id.toString() !== imageId
      ) {
        await Media.findByIdAndUpdate(existingImageAtPosition._id, {
          masonryPosition: null,
        });
      }

      // Update current image to new position
      await Media.findByIdAndUpdate(imageId, {
        masonryPosition: position,
        replacedAt: new Date(),
      });

      return res.send(
        sendResponse({
          message: "Image position updated successfully",
          imageId: imageId,
          newPosition: position,
        })
      );
    } catch (error) {
      console.error("Error updating image position:", error);
      return res.status(500).send(sendResponse(null, "Server error"));
    }
  })
);

module.exports = router;
