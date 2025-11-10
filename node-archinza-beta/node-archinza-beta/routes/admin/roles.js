const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../../models/admin");
const Role = require("../../models/role");
const Permissions = require("../../models/permissions");
const { sendResponse } = require("../../helpers/api");
const roleAuth = require("../../middlewares/roleAuth");

router.post(
  "/",
  roleAuth(["full_access"]),
  asyncHandler(async (req, res) => {
    const newRole = await Role.create(req.body);

    res.send(sendResponse("New Role Created"));
  })
);
router.post(
  "/users",
  roleAuth(["full_access"]),
  asyncHandler(async (req, res) => {
    let role = await Role.findById(req.body.role);
    const user = await User.create({ ...req.body, role: role._id });

    res.send(sendResponse("New Role Created"));
  })
);

router.get(
  "/",
  roleAuth(["full_access"]),
  asyncHandler(async (req, res) => {
    const roles = await Role.find().populate("permissions");
    const filteredRoles = roles.filter(
      (role) => role && role.name !== "Super Admin"
    );

    res.send(sendResponse(filteredRoles));
  })
);

//get users for the role
router.get(
  "/:id/users",
  roleAuth(["full_access"]),
  asyncHandler(async (req, res) => {
    const users = await User.find({ role: req.params.id });

    res.send(sendResponse(users));
  })
);

router.get(
  "/users",
  roleAuth(["full_access"]),
  asyncHandler(async (req, res) => {
    const users = await User.find().populate({
      path: "role",
      populate: {
        path: "permissions",
      },
    });
    const filteredUsers = users.filter(
      (user) => user.role && user.role.name !== "Super Admin"
    );

    res.send(sendResponse(filteredUsers));
  })
);
router.get(
  "/permissions",
  roleAuth(["full_access"]),
  asyncHandler(async (req, res) => {
    const permissions = await Permissions.find();
    res.send(sendResponse(permissions));
  })
);

module.exports = router;
