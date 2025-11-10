const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/personalAccount");
const Option = require("../models/options");
const CustomOptions = require("../models/customOptions");
const BusinessCustomOptions = require("../models/businessCustomOptions");
var _ = require("lodash");

const config = require("../config/config");

const {
  sendResponse,
  sendError,
  validator,
  generateToken,
  generateOTP,
  isProduction,
} = require("../helpers/api");
const { sendmail } = require("../helpers/mailer");

const agenda = require("../jobs/agenda");
const axios = require("axios");

var session;

router.post(
  "/",
  asyncHandler(async (req, res) => {
    // const user = await User.findById(req.params.id);
    const data = await Option.create(req.body);

    res.send(sendResponse(data));
  })
);

router.get(
  "/:question_key",
  asyncHandler(async (req, res) => {
    // const user = await User.findById(req.params.id);
    let data = await Option.findOne().lean();

    if (!data) {
      res.send(sendError("No Options Found", 404));
    }
    const transformedOptions = data?.[req.params.question_key]?.map(
      (option) => ({
        label: option,
        value: option,
      })
    );

    data.options = transformedOptions;
    res.send(sendResponse({ options: transformedOptions }));
  })
);

//request for custom option
router.post(
  "/custom-options/personal",
  asyncHandler(async (req, res) => {
    const existingCustomOption = await CustomOptions.findOne({
      question_slug: req.body.question_slug,
      user: req.body.user,
    });

    if (existingCustomOption) {
      await existingCustomOption.updateOne({ ...req.body, status: "pending" });
    } else {
      const customOption = await CustomOptions.create({
        ...req.body,
        status: "pending",
      });
    }

    return res.send(sendResponse([], "Custom option request sent sucessfully"));
  })
);

//request for custom option
router.post(
  "/custom-options/business",
  asyncHandler(async (req, res) => {
    const existingCustomOption = await BusinessCustomOptions.findOne({
      question_slug: req.body.question_slug,
      user: req.body.user,
    });

    if (existingCustomOption) {
      await existingCustomOption.updateOne({ ...req.body, status: "pending" });
    } else {
      const customOption = await BusinessCustomOptions.create({
        ...req.body,
        status: "pending",
      });
    }

    return res.send(sendResponse([], "Custom option request sent sucessfully"));
  })
);

module.exports = router;
