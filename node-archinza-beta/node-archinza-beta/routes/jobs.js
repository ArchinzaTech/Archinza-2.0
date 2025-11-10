const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
var _ = require("lodash");
const Jobs = require("../models/jobs");
const { sendResponse } = require("../helpers/api");

router.post(
  "/publish",
  asyncHandler(async (req, res) => {
    const job = await Jobs.create(req.body);

    return res.send(sendResponse(job));
  })
);

router.get(
  "/business/:id",
  asyncHandler(async (req, res) => {
    const jobs = await Jobs.find({ business: req.params.id });
    return res.send(sendResponse(jobs));
  })
);

router.get("/filter-jobs", async (req, res) => {
  const { mode_of_work, employement_type, startDate, endDate, title, search } =
    req.query;

  let filter = {};

  if (mode_of_work) filter.mode_of_work = mode_of_work;
  if (employement_type) filter.employement_type = employement_type;
  if (startDate && endDate) {
    filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  if (title) filter.title = new RegExp(title, "i");

  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [
      { title: searchRegex },
      { location: searchRegex },
      { required_skills: searchRegex },
      { experience: searchRegex },
      { mode_of_work: searchRegex },
      { employement_type: searchRegex },
    ];
  }

  const jobs = await Jobs.find(filter).sort({ createdAt: -1 });
  return res.send(sendResponse(jobs));
});

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const job = await Jobs.findById(req.params.id);
    if (!job) {
      return res.send(sendResponse([], "No Job Found"));
    }
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const jobs = await Jobs.find({});
    return res.send(sendResponse(jobs));
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const job = await Jobs.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.send(sendResponse([], "No Job Found"));
    }
    return res.send(sendResponse(job));
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const job = await Jobs.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.send(sendResponse(job));
  })
);
