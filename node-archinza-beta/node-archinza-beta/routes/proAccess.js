const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/personalAccount");
const ProAccess = require("../models/proAccessEntries");
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
const notificationAgenda = require("../jobs/notificationsAgenda");
const proUsersReminderSchedule = require("../jobs/proUsers/proUsersReminders");

var session;

router.get(
  "/entries/:user_type/:id",
  asyncHandler(async (req, res) => {
    // const user = await User.findById(req.params.id);
    const data = await ProAccess.findOne({
      user: req.params.id,
      user_type: req.params.user_type,
    });

    res.send(sendResponse(data));
  })
);

router.put(
  "/update/:id",

  asyncHandler(async (req, res) => {
    const data = await ProAccess.findById(req.params.id).populate("user");
    if (!data) {
      res.send(sendError("Entry Not Found", 404));
    }

    await data.updateOne(req.body);
    const updatedEntry = await ProAccess.findById(req.params.id);
    await notificationAgenda.cancel({
      name: "send-pro-reminder",
      "data.entryId": updatedEntry.user._id,
    });

    if (updatedEntry.status === "completed") {
      await notificationAgenda.now("send-pro-welcome", {
        entryId: data.user._id,
        email: data.user.email,
        userType: updatedEntry.user_type,
        templateVars: {
          name: data.user.name || "User",
        },
      });
    } else {
      for (const {
        delay,
        label,
        template,
        subject,
      } of proUsersReminderSchedule) {
        await notificationAgenda.schedule(delay, label, {
          entryId: data.user._id,
          email: data.user.email,
          subject: subject,
          templateVars: {
            name: data.user.name || "User",
            template: template,
          },
        });
      }
    }
    res.send(sendResponse(data, "Entry updated Successfullly"));
  })
);

module.exports = router;
