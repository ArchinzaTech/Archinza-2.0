const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { sendResponse, sendError, validator } = require("../helpers/api");
const Joi = require("joi");
const Country = require("../models/country");
const State = require("../models/state");
const City = require("../models/city");
const mongoose = require("mongoose");

const { sendmail } = require("../helpers/mailer");
const config = require("../config/config");
const BusinessAccountOptions = require("../models/businessAccountOptions");

router.post(
  "/validation",

  asyncHandler(async (req, res) => {
    const data = await mongoose
      .model(req.body.modelName)
      .findOne({ slug: req.body.slug });
    if (data) {
      res.send(sendError("Slug already exist", 400));
    } else {
      res.send(sendResponse(data));
    }
  })
);

router.post(
  "/email-validation",

  asyncHandler(async (req, res) => {
    const data = await mongoose
      .model(req.body.modelName)
      .findOne({ email: req.body.email });
    if (data) {
      res.send(sendError("Email already exist", 400));
    } else {
      res.send(sendResponse(data));
    }
  })
);

router.post(
  "/phone-validation",

  asyncHandler(async (req, res) => {
    const data = await mongoose
      .model(req.body.modelName)
      .findOne({ phone: req.body.phone, country_code: req.body.country_code });
    if (data) {
      res.send(sendError("Phone Number already exist", 400));
    } else {
      res.send(sendResponse(data));
    }
  })
);

router.get(
  "/countries",

  asyncHandler(async (req, res) => {
    const datas = await Country.find().select("id name -_id");

    const fromIndex = datas.findIndex((x) => x.name === "India");

    const toIndex = 0;

    const element = datas.splice(fromIndex, 1)[0];

    datas.splice(toIndex, 0, element);
    // datas.toJSON();

    const transformedOptions = datas?.map((data) => ({
      ...data.toJSON(),
      label: data.name,
      value: data.name,
    }));

    // datas.toJSON();
    // datas.options = transformedOptions;

    res.send(sendResponse(transformedOptions));
  })
);

router.get(
  "/states/:country_id",

  asyncHandler(async (req, res) => {
    const datas = await State.find({
      country_id: req.params.country_id,
    }).select("id name -_id");
    res.send(sendResponse(datas));
  })
);

router.get(
  "/cities/:state_id",

  asyncHandler(async (req, res) => {
    const datas = await City.find({
      state_id: req.params.state_id,
    }).select("id name -_id");

    const transformedOptions = datas?.map((data) => ({
      ...data.toJSON(),
      label: data.name,
      value: data.name,
    }));
    res.send(sendResponse(transformedOptions));
  })
);

router.get(
  "/cities-by-country/:country_id",

  asyncHandler(async (req, res) => {
    const datas = await City.find({
      country_id: req.params.country_id,
    })
      .sort({ name: 1 })
      .select("id name state_name -_id");

    const transformedOptions = datas?.map((data) => ({
      ...data.toJSON(),
      label: data.name,
      value: data.name,
    }));

    res.send(sendResponse(transformedOptions));
  })
);

router.get(
  "/countries/codes",

  asyncHandler(async (req, res) => {
    const datas = await Country.find().select("phone_code iso3 name");

    // const transformedOptions = datas?.map((data) => ({
    //   ...data.toJSON(),
    //   label: data.name,
    //   value: data.name,
    // }));

    res.send(sendResponse(datas));
  })
);

router.get(
  "/sendmail",

  asyncHandler(async (req, res) => {
    const mail = await sendmail({
      to: "talha@togglehead.in",
      from: {
        name: config.mail.sender_name,
        address: config.mail.sender,
      },
      cc: "om@togglehead.in",
      subject: "B&Y New Emailer",
      template: "2023/LoginOTPEmailer",
      templateVars: { name: "khalid" },
    });

    res.send(mail);
  })
);

router.get(
  "/close-match/:query",

  asyncHandler(async (req, res) => {
    function levenshteinDistance(a, b) {
      const an = a.length;
      const bn = b.length;
      if (an === 0) return bn;
      if (bn === 0) return an;

      const matrix = Array.from({ length: an + 1 }, () =>
        Array(bn + 1).fill(0)
      );

      for (let i = 0; i <= an; i++) matrix[i][0] = i;
      for (let j = 0; j <= bn; j++) matrix[0][j] = j;

      for (let i = 1; i <= an; i++) {
        for (let j = 1; j <= bn; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1, // deletion
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j - 1] + cost // substitution
          );
        }
      }

      return matrix[an][bn];
    }

    function findClosestMatch(userString, locations) {
      let closestMatch = locations[0];
      let smallestDistance = levenshteinDistance(userString, closestMatch);

      for (let i = 1; i < locations.length; i++) {
        const currentDistance = levenshteinDistance(userString, locations[i]);
        if (currentDistance < smallestDistance) {
          smallestDistance = currentDistance;
          closestMatch = locations[i];
        }
      }

      return closestMatch;
    }

    const locations = ["india", "usa", "thane", "Abu", "Abu Road"];
    const userString = req.params.query;

    const closestMatch = findClosestMatch(userString, locations);
    console.log(`The closest match to "${userString}" is "${closestMatch}"`);

    res.send(closestMatch);
  })
);

router.get(
  "/business-types",
  asyncHandler(async (req, res) => {
    const business_account_options = await BusinessAccountOptions.findOne();

    return res.send(sendResponse(business_account_options.business_types));
  })
);

module.exports = router;
