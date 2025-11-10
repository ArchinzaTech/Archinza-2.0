const express = require("express");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin");
// console.log(models);
const config = require("../../config/config");

const { sendResponse, sendError, validator } = require("../../helpers/api");

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = await Admin.findOne({
      email: req.body.email,
      password: req.body.password,
    }).populate({
      path: "role",
      populate: {
        path: "permissions",
      },
    });

    if (data) {
      const token = jwt.sign(
        { id: data._id, name: data.name, role: data.role },
        config.secretkey
      );

      res.send(sendResponse({ token: token }, "Login Successfull"));
    } else {
      res.send(sendError("Invalid email/password", 400));
    }
  })
);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const data = await Admin.create(req.body);

    res.send(sendResponse(data, "Register Successfull"));
  })
);

module.exports = router;
