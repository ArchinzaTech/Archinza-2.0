const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const LogsActivity = require("../../../models/logActivity");
const { sendResponse } = require("../../../helpers/api");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const logs = await LogsActivity.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        populate: {
          path: "role",
        },
      });
    const filteredLogs = logs.filter(
      (log) => log.user?.role?.name !== "Super Admin"
    );
    return res.send(sendResponse(filteredLogs));
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const logs = await LogsActivity.create(req.body);
    return res.send(sendResponse("Logs created"));
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const logs = await LogsActivity.deleteOne({ _id: req.params.id });
    return res.send(sendResponse("Log deleted"));
  })
);

module.exports = router;
