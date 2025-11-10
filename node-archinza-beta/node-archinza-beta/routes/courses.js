const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
var _ = require("lodash");
const Courses = require("../models/courses");
const { sendResponse } = require("../helpers/api");

router.post(
  "/publish",
  asyncHandler(async (req, res) => {
    const course = await Courses.create(req.body);

    return res.send(sendResponse(course));
  })
);

router.get(
  "/business/:id",
  asyncHandler(async (req, res) => {
    const courses = await Courses.find({ business: req.params.id });
    return res.send(sendResponse(courses));
  })
);

router.get("/filter-courses", async (req, res) => {
  const {
    mode_of_learning,
    duration,
    startDate,
    endDate,
    title,
    search,
    certificate,
  } = req.query;

  let filter = {};

  if (mode_of_learning) filter.mode_of_learning = mode_of_learning;
  if (duration) filter.duration = duration;
  if (startDate && endDate) {
    filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  if (title) filter.title = new RegExp(title, "i");

  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [
      { title: searchRegex },
      { duration: searchRegex },
      { required_skills: searchRegex },
      { experience: searchRegex },
      { mode_of_learning: searchRegex },
    ];
  }

  const courses = await Courses.find(filter).sort({ createdAt: -1 });
  return res.send(sendResponse(courses));
});

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const course = await Courses.findById(req.params.id);
    if (!course) {
      return res.send(sendResponse([], "No Course Found"));
    }
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const course = await Courses.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.send(sendResponse([], "No Course Found"));
    }
    return res.send(sendResponse(course));
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.send(sendResponse(course));
  })
);
