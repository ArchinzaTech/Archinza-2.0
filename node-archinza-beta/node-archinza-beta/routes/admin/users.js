const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../../models/personalAccount");
const ProAccess = require("../../models/proAccessEntries");

const { sendResponse, sendError, validator } = require("../../helpers/api");
const BusinessAccount = require("../../models/businessAccount");
const Feedback = require("../../models/feedback");
const roleAuth = require("../../middlewares/roleAuth");
const Joi = require("joi");
const PersonalDeleteRequests = require("../../models/personalDeleteRequests");
const LogActivity = require("../../models/logActivity");
const Admin = require("../../models/admin");
const Role = require("../../models/role");

let userSchemaObj = {
  user_type: Joi.string().valid("BO", "ST", "DE", "TM", "FL").required(),
  name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  country_code: Joi.number().required(),
  phone: Joi.string().required(),
  country: Joi.string().required(),
};

router.get(
  "/",

  asyncHandler(async (req, res) => {
    const data = await User.find({ isDeleted: false })
      .populate("proAccessEntry")
      .sort({ createdAt: -1 });
    const deletionRequests = await PersonalDeleteRequests.find();
    res.send(sendResponse({ data: data, deletionRequests }));
  })
);

router.get(
  "/pro-entries/:user_id",

  asyncHandler(async (req, res) => {
    const datas = await ProAccess.find({ user: req.params.user_id }).sort({
      createdAt: -1,
    });
    res.send(sendResponse(datas));
  })
);

router.get(
  "/pro-entry/:entry_id",

  asyncHandler(async (req, res) => {
    const data = await ProAccess.findById(req.params.entry_id).populate("user");
    res.send(sendResponse(data));
  })
);

router.get(
  "/:id",

  asyncHandler(async (req, res) => {
    const data = await User.findById(req.params.id);

    res.send(sendResponse(data));
  })
);

//create user
router.post(
  "/",
  roleAuth(["edit_personal_user", "edit_personal_user_advanced"]),
  asyncHandler(async (req, res) => {
    const body = req.body;
    const userPermissions = req.permissions;

    const editPermission = userPermissions.find(
      (perm) =>
        perm.name === "edit_personal_user" ||
        perm.name === "edit_personal_user_advanced" ||
        perm.name === "full_access"
    );

    if (!editPermission) {
      return res.send(sendResponse("No edit permission found", 403));
    }

    // If super admin, allow all fields
    const isSuperAdmin = editPermission.name === "full_access";
    const lockedFields = isSuperAdmin
      ? []
      : editPermission.constraints?.lockedFields || [];

    const filteredBody = { ...body };
    for (const field of lockedFields) {
      if (filteredBody.hasOwnProperty(field)) {
        delete filteredBody[field];
      }
    }

    if (filteredBody.country) {
      if (filteredBody.country.toLowerCase() === "india") {
        userSchemaObj.city = Joi.string().required();
        userSchemaObj.pincode = Joi.string()
          .pattern(/^[0-9]{6}$/)
          .required()
          .messages({
            "string.pattern.base": "Pincode must be exactly 6 digits",
          });
      }
    }

    // Joi schema validation
    const schema = Joi.object(userSchemaObj).options({ allowUnknown: true });
    const { error } = validator(req.body, schema);
    if (error) {
      return res.send(sendError(error.details[0].message, 400));
    }

    filteredBody["onboarding_source"] = "cms";
    //check if user is DE or pro
    // Proceed to create the user with filteredBody
    const newUser = await User.create(filteredBody);

    if (filteredBody.user_type !== "DE") {
      const proAccess = await ProAccess.create({
        user: newUser._id,
        user_type: filteredBody.user_type,
        status: "registered",
      });
      return res.send(sendResponse({ proId: proAccess?._id }));
    }
    res.send(sendResponse("Personal User Created successfully"));
  })
);

//soft-delete users
router.put(
  "/delete-users",
  roleAuth(["edit_personal_user_advanced"]),
  asyncHandler(async (req, res) => {
    const users = req.body.users;
    const deletedUsers = await User.updateMany(
      { _id: { $in: users } },
      { $set: { isDeleted: true, deletedAt: new Date().toISOString() } }
    );
    return res.send(sendError("Users Deleted successfully", 200));
  })
);

//delete request
router.put(
  "/delete-request",
  asyncHandler(async (req, res) => {
    const users = req.body.users;
    const roleUser = req.body.roleUser;
    const roleUsersToCreate = users.map((userId) => ({
      user: userId,
      role_user: roleUser,
    }));
    const request = await PersonalDeleteRequests.insertMany(roleUsersToCreate);

    return res.send(sendResponse("Delete Request Sent"));
  })
);

//update personal user details
router.put(
  "/:id",
  roleAuth(["edit_personal_user", "edit_personal_user_advanced"]),
  asyncHandler(async (req, res) => {
    const body = req.body;
    const userPermissions = req.permissions;

    const editPermission = userPermissions.find(
      (perm) =>
        perm.name === "edit_personal_user" ||
        perm.name === "edit_personal_user_advanced" ||
        perm.name === "full_access"
    );

    if (!editPermission) {
      return res.send(sendResponse("No edit permission found", 403));
    }

    // If super admin, allow all fields
    const isSuperAdmin = editPermission.name === "full_access";
    const lockedFields = isSuperAdmin
      ? []
      : editPermission.constraints?.lockedFields || [];

    const filteredBody = { ...body };
    for (const field of lockedFields) {
      if (filteredBody.hasOwnProperty(field)) {
        delete filteredBody[field];
      }
    }

    if (filteredBody.country) {
      if (filteredBody.country.toLowerCase() === "india") {
        userSchemaObj.city = Joi.string().required();
        userSchemaObj.pincode = Joi.string()
          .pattern(/^[0-9]{6}$/)
          .required()
          .messages({
            "string.pattern.base": "Pincode must be exactly 6 digits",
          });
      }
    }

    // Joi schema validation
    const schema = Joi.object(userSchemaObj).options({ allowUnknown: true });
    const { error } = validator(req.body, schema);
    if (error) {
      return res.send(sendError(error.details[0].message, 400));
    }
    // Proceed to create the user with filteredBody
    const newUser = await User.updateOne({ _id: req.params.id }, filteredBody);
    res.send(sendResponse("Personal User Edited"));
  })
);

//update proaccess details
router.put(
  "/proAccess/:id",
  roleAuth(["edit_personal_user", "edit_personal_user_advanced"]),
  asyncHandler(async (req, res) => {
    const body = req.body;
    const userPermissions = req.permissions;

    const editPermission = userPermissions.find(
      (perm) =>
        perm.name === "edit_personal_user" ||
        perm.name === "edit_personal_user_advanced" ||
        perm.name === "full_access"
    );

    if (!editPermission) {
      return res.send(sendResponse("No edit permission found", 403));
    }

    // If super admin, allow all fields
    const isSuperAdmin = editPermission.name === "full_access";
    const lockedFields = isSuperAdmin
      ? []
      : editPermission.constraints?.lockedFields || [];

    let filteredBody = { ...body };
    const proAccessEntry = await ProAccess.findById(req.params.id);

    const allFieldsFilled = Object.keys(filteredBody).every((key) => {
      const value = filteredBody[key];

      if (value === undefined || value === null) return false;

      if (Array.isArray(value)) return value.length > 0;

      if (typeof value === "string") return value.trim() !== "";

      return Boolean(value); // numbers, booleans, etc.
    });

    if (allFieldsFilled) {
      filteredBody.status = "completed";
    }
    // Proceed to create the user with filteredBody
    const proUser = await ProAccess.updateOne(
      { _id: req.params.id },
      filteredBody
    );
    res.send(sendResponse("Personal User Edited"));
  })
);

//bulk upload users
router.post(
  "/bulk-upload",
  asyncHandler(async (req, res) => {
    const { users } = req.body;
    for (const user of users) {
      const personalAcc = await User.create(user);

      if (user.proEntry) {
        await ProAccess.create({
          user: personalAcc._id,
          user_type: user.user_type,
          ...user.proEntry,
        });
      }
    }
    return res.send(sendResponse("Users Added Successfully"));
  })
);

module.exports = router;
