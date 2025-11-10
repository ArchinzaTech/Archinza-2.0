const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/personalAccount");
// require("../../models/role");
// console.log(models);
const config = require("../config/config");

const { sendResponse, sendError, validator } = require("../helpers/api");
const { sendmail } = require("../helpers/mailer");
const auth = require("../middlewares/auth");
const { verifyToken } = require("../helpers/api");
const BusinessAccount = require("../models/businessAccount");

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (data) {
      const token = jwt.sign(data, config.secretkey);

      res.send(sendResponse({ token: token }, "Login Successfull"));
    } else {
      res.send(sendError("Invalid email/password", 400));
    }
  })
);

router.post(
  "/signup/otp",
  asyncHandler(async (req, res) => {
    var otp = 123456;
    if (config.mail.mailer == "on") {
      const mail = await sendmail({
        to: req.body.email,
        from: { name: config.mail.sender_name, address: config.mail.sender },
        cc: config.mail.reciever_cc,
        subject: "Sign Up OTP",
        template: "signup_otp",
        templateVars: { otp },
      });

      console.log("mail sent", mail);
    }

    res.send(sendResponse("Sign up OTP sent successfullt"));
  })
);

router.post(
  "/signup/otp/resend",
  asyncHandler(async (req, res) => {
    res.send(sendResponse(data, "Register Successfull"));
  })
);
router.post(
  "/signup/otp/verify",
  asyncHandler(async (req, res) => {
    res.send(sendResponse(data, "Register Successfull"));
  })
);

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const data = await User.create(req.body);

    res.send(sendResponse(data, "Register Successfull"));
  })
);

router.post(
  "/forgot",
  asyncHandler(async (req, res) => {
    res.send(sendResponse(data, "Register Successfull"));
  })
);
router.post(
  "/forgot/otp/resend",
  asyncHandler(async (req, res) => {
    res.send(sendResponse(data, "Register Successfull"));
  })
);
router.post(
  "/forgot/otp/verify",
  asyncHandler(async (req, res) => {
    res.send(sendResponse(data, "Register Successfull"));
  })
);

router.post(
  "/reset",
  asyncHandler(async (req, res) => {
    res.send(sendResponse(data, "Register Successfull"));
  })
);

router.post(
  "/verify-token",
  asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.send(
        sendResponse({ valid: false, message: "Token is required" })
      );
    }

    const { valid, decoded, error } = verifyToken(token);

    if (!valid) {
      return res.send(sendResponse({ valid: false, message: error }));
    }
    if (decoded.auth_type === "personal") {
      const user = await User.findById(decoded._id);
      if (!user) {
        return res.send(
          sendResponse({ valid: false, message: "User not found" })
        );
      }
      return res.send(sendResponse({ valid: true, user: decoded }));
    } else {
      const user = await BusinessAccount.findById(decoded._id);
      if (!user) {
        return res.send(
          sendResponse({ valid: false, message: "User not found" })
        );
      }
      return res.send(sendResponse({ valid: true, user: decoded }));
    }
  })
);

module.exports = router;
