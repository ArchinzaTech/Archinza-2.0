const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/personalAccount");
const Option = require("../../models/options");
var _ = require("lodash");
const Fuse = require("fuse.js");

const config = require("../../config/config");

const {
  sendResponse,
  sendError,
  validator,
  generateToken,
  generateOTP,
  isProduction,
} = require("../../helpers/api");
const proAccessEntries = require("../../models/proAccessEntries");

router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    let schemaObj = {
      id: Joi.string().required(),
      user_type: Joi.string().valid("BO", "ST", "TM", "FL").required(),
    };

    if (req.body.user_type === "ST") {
      schemaObj.st_study_field = Joi.array().min(1).required();
      schemaObj.st_graduate_year = Joi.string().required();
      schemaObj.st_unmet_needs = Joi.string().required();
    }
    if (req.body.st_unmet_needs === "all") {
      schemaObj.all_st_unmet_needs = Joi.array().min(1).required();
    }
    if (req.body.user_type === "TM") {
      schemaObj.tm_job_profile = Joi.array().min(1).required();
      schemaObj.tm_experience = Joi.string().required();
      schemaObj.tm_unmet_needs = Joi.string().required();
    }
    if (req.body.tm_unmet_needs === "all") {
      schemaObj.all_tm_unmet_needs = Joi.array().min(1).required();
    }
    if (req.body.user_type === "BO") {
      schemaObj.bo_buss_establishment = Joi.string().required();
      schemaObj.bo_unmet_needs = Joi.string().required();
    }
    if (req.body.bo_unmet_needs === "all") {
      schemaObj.all_bo_unmet_needs = Joi.array().min(1).required();
    }
    if (req.body.user_type === "FL") {
      schemaObj.fl_establishment = Joi.string().required();
      schemaObj.fl_unmet_needs = Joi.string().required();
    }
    if (req.body.fl_unmet_needs === "all") {
      schemaObj.all_fl_unmet_needs = Joi.array().min(1).required();
    }

    const schema = Joi.object(schemaObj).options({ allowUnknown: true });

    const { error } = validator({ ...req.body, id: req.params.id }, schema);
    if (error) {
      res.send(sendError(error.details[0].message, 400));
      return;
    }

    const proAccessEntry = await proAccessEntries.findOne({
      user: req.params.id,
    });
    if (!proAccessEntry) {
      res.send(sendError("User Not Found", 404));
      return;
    }

    if (proAccessEntry.user_type === "DE") {
      res.send(sendError("Pro access is not available for DE user", 400));
      return;
    }

    if (proAccessEntry.status === "completed") {
      res.send(sendError("Pro Access form is already filled", 400));
      return;
    }
    if (proAccessEntry.user_type != req.body.user_type) {
      res.send(sendError("user_type is not correct", 400));
      return;
    }

    let requestBody = {};

    if (proAccessEntry.user_type === "ST") {
      requestBody.st_study_field = req.body.st_study_field;
      requestBody.st_graduate_year = req.body.st_graduate_year;
      requestBody.st_unmet_needs = req.body.st_unmet_needs;
      requestBody.all_st_unmet_needs = req.body.all_st_unmet_needs;
    }
    if (proAccessEntry.user_type === "TM") {
      requestBody.tm_job_profile = req.body.tm_job_profile;
      requestBody.tm_experience = req.body.tm_experience;
      requestBody.tm_unmet_needs = req.body.tm_unmet_needs;
      requestBody.all_tm_unmet_needs = req.body.all_tm_unmet_needs;
    }
    if (proAccessEntry.user_type === "BO") {
      requestBody.bo_buss_establishment = req.body.bo_buss_establishment;
      requestBody.bo_unmet_needs = req.body.bo_unmet_needs;
      requestBody.all_bo_unmet_needs = req.body.all_bo_unmet_needs;
    }
    if (proAccessEntry.user_type === "FL") {
      requestBody.fl_establishment = req.body.fl_establishment;
      requestBody.fl_unmet_needs = req.body.fl_unmet_needs;
      requestBody.all_fl_unmet_needs = req.body.all_fl_unmet_needs;
    }

    requestBody.status = "completed";

    await proAccessEntry.updateOne(requestBody);

    res.send(sendResponse(null, "Pro Access Entry Saved Successfully"));
  })
);

function findClosestMatch(userInput, fuseInstance, threshold = 0.3) {
  // console.log({userInput})
  return userInput.map((input) => {
    const trimmedInput = input.trim();
    const result = fuseInstance.search(trimmedInput);
    // console.log({result})
    // return result[0].item;
    if (result.length > 0 && result[0].score <= threshold) {
      return result[0].item; // Return the closest match within threshold
    } else {
      // Return the original input if no close match is found
      // var is_spelled_correctly = dictionary.check(trimmedInput);
      // console.log({is_spelled_correctly});
      // var array_of_suggestions = dictionary.suggest(trimmedInput);

      return `${trimmedInput}`;
    }
  });
}

router.post(
  "/close-match/job-profiles",
  asyncHandler(async (req, res) => {
    const rules = Joi.object({
      input: Joi.string().required(),
    }).options({});

    const { error } = validator(req.body, rules);
    if (error) {
      res.send(sendError(error.details[0].message, 400));
      return;
    }

    const options = await Option.findOne();

    const jobProfiles = options.tm_job_profile;
    const fuseOptions = {
      includeScore: true,
      threshold: 0.3,

      // ignoreLocation: true,
    };

    // Create a Fuse instance
    const fuse = new Fuse(jobProfiles, fuseOptions);

    const userInputString = req.body.input;
    const userInputArray = userInputString.split(",");

    // Find and log the closest matches
    const matchedFields = findClosestMatch(
      userInputArray,
      fuse,
      fuseOptions.threshold
    );

    res.send(sendResponse(matchedFields));
  })
);

router.post(
  "/close-match/study-fields",
  asyncHandler(async (req, res) => {
    const rules = Joi.object({
      input: Joi.string().required(),
    }).options({});

    const { error } = validator(req.body, rules);
    if (error) {
      res.send(sendError(error.details[0].message, 400));
      return;
    }

    const options = await Option.findOne();

    const studyFields = options.st_study_field;

    const fuseOptions = {
      includeScore: true,
      threshold: 0.3,

      // ignoreLocation: true,
    };

    // Create a Fuse instance
    const fuse = new Fuse(studyFields, fuseOptions);

    const userInputString = req.body.input;
    const userInputArray = userInputString.split(",");

    // Find and log the closest matches
    const matchedFields = findClosestMatch(
      userInputArray,
      fuse,
      fuseOptions.threshold
    );

    res.send(sendResponse(matchedFields));
  })
);

module.exports = router;
