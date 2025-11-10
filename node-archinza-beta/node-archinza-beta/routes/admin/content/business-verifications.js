const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  sendResponse,
  sendError,
  validator,
  deleteMedia,
  getBusinessTypeId,
} = require("../../../helpers/api");
const BusinessVerification = require("../../../models/businessVerifications");
const { uploadSingle } = require("../../../middlewares/upload");
const path = require("path");
const fs = require("fs");
const BusinessAccount = require("../../../models/businessAccount");
const businessNotificationAgenda = require("../../../jobs/businessNotificationsAgenda");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const records = await BusinessVerification.find().populate("user");
    res.send(sendResponse(records));
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const record = await BusinessVerification.findById(req.params.id).populate(
      "user"
    );
    res.send(sendResponse(record));
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const status = req.body.status;
    const record = await BusinessVerification.findById(req.params.id);
    if (!record) {
      return res.send(sendError("Record not found", 400));
    }
    await record.updateOne(req.body);
    const user = await BusinessAccount.findByIdAndUpdate(record.user._id, {
      isVerified: status === "approved" ? true : false,
    });

    //if approved, trigger approve mail
    if (status === "approved") {
      businessNotificationAgenda.now("send-business-verified", {
        entryId: user._id,
        email: user.email,
        templateVars: {
          name: user.business_name || "User",
        },
      });
    } else {
    }
    return res.send(sendResponse(record, "Record updated successfully"));
  })
);

module.exports = router;
