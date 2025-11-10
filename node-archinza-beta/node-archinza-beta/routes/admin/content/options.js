const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");

const Model = require("../../../models/options");
const BusinessOptions = require("../../../models/businessAccountOptions");
const ProAccessEntry = require("../../../models/proAccessEntries");
const PersonalAccount = require("../../../models/personalAccount");
const BusinessAccount = require("../../../models/businessAccount");

// console.log(models);
const mediaPath = "public/uploads/content/option/"; // with trailing slash
const moduleName = "Option";

const {
  sendResponse,
  sendError,
  validator,
  deleteMedia,
} = require("../../../helpers/api");
const CustomOptions = require("../../../models/customOptions");
const PersonalDeleteRequests = require("../../../models/personalDeleteRequests");
const BusinessDeleteRequests = require("../../../models/businessDeleteRequests");
const BusinessEditRequests = require("../../../models/businessEditRequest");
const roleAuth = require("../../../middlewares/roleAuth");

const storage = multer.diskStorage({
  destination: mediaPath,
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

const uploadMultiple = upload.fields([
  // { name: "stockGraph", maxCount: 1 }
]);

router.get(
  "/",

  asyncHandler(async (req, res) => {
    // const create = await Model.create({
    //   st_study_field:[]
    // });
    const datas = await Model.findOne();

    // let options = {};
    //  datas.forEach((data)=>{
    //   options[data.question]=data.options
    // })

    res.send(sendResponse(datas));
  })
);

router.put(
  "/sort/:question",
  asyncHandler(async (req, res) => {
    const sortedOptions = req.body;

    const data = await Model.findOne();
    if (!data) {
      res.send(sendError("Not Found", 404));
    }

    await data.updateOne({ [req.params.question]: sortedOptions });

    res.send(sendResponse(`Sorting Updated`));
  })
);

router.put(
  "/",
  asyncHandler(async (req, res) => {
    uploadMultiple(req, res, async (err) => {
      if (err) {
        res.send(sendError(err, 400));
      } else {
        try {
          const data = await Model.findOne();
          if (!data) {
            res.send(sendError("Not Found", 404));
          }
          // res.send(sendResponse(req.files, ""));
          // return;
          // if (req.files.stockGraph) {
          //   const filename = req.files.stockGraph[0].filename;
          //   if (data.stockGraph) {
          //     deleteMedia(mediaPath + data.stockGraph);
          //   }

          //   req.body.stockGraph = filename;
          // }
          await data.updateOne(req.body);

          res.send(sendResponse(data, `${moduleName} Update Successfullly`));
        } catch (error) {
          res.send(sendError(error.message, 500));
        }
      }
    });
  })
);

//get all custom options
router.get(
  "/custom-options",
  asyncHandler(async (req, res) => {
    const records = await CustomOptions.find().sort({ updatedAt: -1 });

    return res.send(sendResponse(records));
  })
);

//handling custom options
router.put(
  "/custom-options/:id",
  asyncHandler(async (req, res) => {
    const { updates, approvedOptions, rejectedOptions, previouslyApproved } =
      req.body;
    const record = await CustomOptions.findOne({ _id: req.params.id });

    if (!record) {
      return res.status(400).send(sendResponse([], "Record not found"));
    }

    updates.forEach((update, index) => {
      if (record.options[update.index]) {
        record.options[update.index] = {
          value: update.value,
          status: update.status,
        };
      }
    });

    const allStatuses = record.options.map((opt) => opt.status);
    const hasApproved = allStatuses.includes("approved");
    const hasRejected = allStatuses.includes("rejected");
    const hasPending = allStatuses.includes("pending");
    const allApproved = allStatuses.every((status) => status === "approved");
    const allRejected = allStatuses.every((status) => status === "rejected");

    // New status logic
    if (hasPending) {
      if (hasApproved || hasRejected) {
        record.status = "in_progress"; // Some options processed, but at least one is pending
      } else {
        record.status = "pending"; // All options are pending
      }
    } else if (hasApproved && hasRejected) {
      record.status = "partially_processed"; // Mix of approved and rejected, no pending
    } else if (allApproved) {
      record.status = "approved"; // All options are approved
    } else if (allRejected) {
      record.status = "rejected"; // All options are rejected
    }
    const options = await Model.findOne();
    const personalUser = await ProAccessEntry.findOne({
      user: record.user,
    });

    if (options && personalUser) {
      const optionsToRemove = rejectedOptions.filter(
        (opt) => previouslyApproved[opt]
      );

      if (optionsToRemove.length > 0) {
        if (options[record.question_slug]) {
          options[record.question_slug] = options[record.question_slug].filter(
            (opt) => !optionsToRemove.includes(opt)
          );
          await options.save();
        }

        if (personalUser[record.question_slug]) {
          personalUser[record.question_slug] = personalUser[
            record.question_slug
          ].filter((opt) => !optionsToRemove.includes(opt));

          await personalUser.save();
        }
      }

      if (approvedOptions.length > 0) {
        if (options[record.question_slug]) {
          options[record.question_slug] = [
            ...new Set([...options[record.question_slug], ...approvedOptions]),
          ];
          console.log(options[record.question_slug]);
          await options.save();
        }

        if (personalUser[record.question_slug]) {
          personalUser[record.question_slug] = [
            ...new Set([
              ...personalUser[record.question_slug],
              ...approvedOptions,
            ]),
          ];
          await personalUser.save();
        }
      }
    }

    await record.save();
    return res.send(sendResponse([], "Options updated successfully"));
  })
);

//get deletion requests
router.get(
  "/deletion-requests",
  asyncHandler(async (req, res) => {
    const requests = await PersonalDeleteRequests.find().populate([
      { path: "user" },
      {
        path: "role_user",
        populate: {
          path: "role",
        },
      },
    ]);

    return res.send(sendResponse(requests));
  })
);
//get deletion requests
router.get(
  "/business-deletion-requests",
  asyncHandler(async (req, res) => {
    const requests = await BusinessDeleteRequests.find().populate([
      { path: "user" },
      {
        path: "role_user",
        populate: {
          path: "role",
        },
      },
    ]);

    return res.send(sendResponse(requests));
  })
);

//get  edit requests
router.get(
  "/business-edit-requests",
  asyncHandler(async (req, res) => {
    const requests = await BusinessEditRequests.find().populate([
      {
        path: "user",
        select:
          "business_name username email country_code phone whatsapp_country_code whatsapp_no country city state _id",
      },
      {
        path: "role_user",
        populate: {
          path: "role",
        },
      },
    ]);

    return res.send(sendResponse(requests));
  })
);

router.get(
  "/business-edit-requests/:id",
  asyncHandler(async (req, res) => {
    const requests = await BusinessEditRequests.find({
      role_user: req.params.id,
    }).populate([
      // { path: "user" },
      {
        path: "role_user",
        populate: {
          path: "role",
        },
      },
    ]);

    return res.send(sendResponse(requests));
  })
);

router.put(
  "/business-deletion-requests/:id",
  asyncHandler(async (req, res) => {
    const request = await BusinessDeleteRequests.findById(req.params.id);

    if (!request) {
      return res.send(sendError("No request found", 400));
    }
    console.log(request);
    await BusinessAccount.updateOne(
      { _id: request.user },
      {
        isDeleted: req.body.action === "approved" ? true : false,
        deletedAt:
          req.body.action === "approved" ? new Date().toISOString() : null,
      }
    );
    await BusinessDeleteRequests.updateOne(
      { _id: request._id },
      { status: req.body.action }
    );
    return res.send(sendResponse("User deleted"));
  })
);
router.put(
  "/deletion-requests/:id",
  asyncHandler(async (req, res) => {
    const user = await PersonalAccount.findById(req.params.id);

    if (!user) {
      return res.send(sendError("No user found", 400));
    }

    await PersonalAccount.updateOne(
      { _id: user._id },
      {
        isDeleted: req.body.action === "approved" ? true : false,
        deletedAt:
          req.body.action === "approved" ? new Date().toISOString() : null,
      }
    );
    await PersonalDeleteRequests.updateOne(
      { user: user._id },
      { status: req.body.action }
    );
    return res.send(sendResponse(`Request ${req.body.action}`));
  })
);

router.put(
  "/business-edit-requests/:id",
  asyncHandler(async (req, res) => {
    const request = await BusinessEditRequests.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status }
    );

    return res.send(sendResponse(`Request ${req.body.status}`));
  })
);

//create edit request
router.put(
  "/edit-request",
  roleAuth(["edit_business_user"]),
  asyncHandler(async (req, res) => {
    const user = req.body.user;
    const roleUser = req.body.roleUser;
    const request = await BusinessEditRequests.create({
      user: user,
      role_user: roleUser,
    });

    return res.send(sendResponse("Edit Request Sent"));
  })
);

//check for duplicate emails and phone numbers
router.post(
  "/check-duplicates",
  asyncHandler(async (req, res) => {
    const { emails, phones } = req.body;
    const duplicatePhones = [];
    const duplicateEmails = [];

    for (const item of emails) {
      // Check for duplicate email
      if (item) {
        const existingEmail = await PersonalAccount.findOne({
          email: item,
        });
        if (existingEmail) {
          duplicateEmails.push({ item });
        }
      }
    }
    for (const item of phones) {
      // Check for duplicate email
      if (item) {
        const existingPhone = await PersonalAccount.findOne({
          country_code: item.country_code,
          phone: item.phone,
        });
        if (existingPhone) {
          duplicatePhones.push({ item });
        }
      }
    }

    const result = {};
    if (duplicatePhones.length > 0) {
      result.duplicatePhones = duplicatePhones;
    }
    if (duplicateEmails.length > 0) {
      result.duplicateEmails = duplicateEmails;
    }

    if (Object.keys(result).length > 0) {
      return res.send(sendResponse(result));
    }

    return res.send(sendResponse("No Duplicates found"));
  })
);

//bulk-upload personal users
router.post(
  "/bulk-upload",
  asyncHandler(async (req, res) => {
    const { users } = req.body;
    const data = await PersonalAccount.create(users);
  })
);

module.exports = router;
