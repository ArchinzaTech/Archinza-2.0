const express = require("express");
const router = express.Router();

// const multer = require("multer");
// const fs = require("fs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const ApiUser = require("../../models/apiUser");
// console.log(models);
const config = require("../../config/config");
const Joi = require("joi");

const { sendResponse, sendError, validator } = require("../../helpers/api");

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const rules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }).options({});

    const { error } = validator(req.body, rules);
    if (error) {
      res.send(sendError(error.details[0].message, 400));
      return;
    }

    const data = await ApiUser.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (data) {
      const token = jwt.sign(
        { id: data._id, name: data.name },
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
    const data = await ApiUser.create(req.body);

    res.send(sendResponse(data, "Register Successfull"));
  })
);

module.exports = router;
