const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Newsletter = require("../../models/newsletter");


const { sendResponse, sendError } = require("../../helpers/api");

router.get(
  "/newsletter",

  asyncHandler(async (req, res) => {
    const datas = await Newsletter.find().sort({ createdAt: -1 });
    res.send(sendResponse(datas));
  })
);


module.exports = router;
