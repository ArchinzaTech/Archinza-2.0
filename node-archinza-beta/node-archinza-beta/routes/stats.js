const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Stats = require("../models/stats");
const { sendResponse, updateStats } = require("../helpers/api");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const stats = await Stats.find();
    return res.send(sendResponse(stats));
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const stat = await Stats.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
    });
    return res.send(sendResponse(stat));
  })
);

module.exports = router;
