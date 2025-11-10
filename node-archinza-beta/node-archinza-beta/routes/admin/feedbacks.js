const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { sendResponse, sendError, validator } = require("../../helpers/api");
const Feedback = require("../../models/feedback");
const FeedbackTopics = require("../../models/feedbackTopics");
const Admin = require("../../models/admin");
const Role = require("../../models/role");

//get personal users feedbacks
router.get(
  "/topics",
  asyncHandler(async (req, res) => {
    const data = await FeedbackTopics.find().sort({ createdAt: -1 });
    return res.send(sendResponse(data));
  })
);

router.get(
  "/personal",
  asyncHandler(async (req, res) => {
    const data = await Feedback.find({ user_type: "personal" }).sort({
      createdAt: -1,
    });
    const topics = await FeedbackTopics.find();

    return res.send(sendResponse({ data, topics }));
  })
);

//get assigned feedbacks personal
router.get(
  "/personal/:id",
  asyncHandler(async (req, res) => {
    const data = await Feedback.find({
      user_type: "personal",
      assigned_to: req.params.id,
    }).sort({
      createdAt: -1,
    });
    const topics = await FeedbackTopics.find();

    return res.send(sendResponse({ data, topics }));
  })
);

//get business users feedbacks
router.get(
  "/business",
  asyncHandler(async (req, res) => {
    const data = await Feedback.find({ user_type: "business" }).sort({
      createdAt: -1,
    });
    const topics = await FeedbackTopics.find();
    return res.send(sendResponse({ data, topics }));
  })
);

//get assigned business users feedbacks
router.get(
  "/business/:id",
  asyncHandler(async (req, res) => {
    const data = await Feedback.find({
      user_type: "business",
      assigned_to: req.params.id,
    }).sort({
      createdAt: -1,
    });
    const topics = await FeedbackTopics.find();
    return res.send(sendResponse({ data, topics }));
  })
);

//get personal users feedbacks
router.get(
  "/feedback-admins/:role",
  asyncHandler(async (req, res) => {
    const searchQuery = req.params.role?.trim() || "";
    const role = await Role.findOne({
      name: { $regex: searchQuery.replace(/\s+/g, " "), $options: "i" },
    });
    console.log(role);
    const data = await Admin.find({ role: role._id }).select("-password");
    return res.send(sendResponse(data));
  })
);

//update feedback status
router.put(
  "/feedback-status/:id",
  asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.send(sendError("Feedack with the given ID not found", 400));
    }

    if (req.body.assigned_to) {
      await Feedback.updateOne(
        { _id: req.params.id },
        { status: req.body.status, assigned_to: req.body.assigned_to || null }
      );
    } else {
      await Feedback.updateOne(
        { _id: req.params.id },
        { status: req.body.status }
      );
    }
    return res.send(sendResponse("Feedback Updated"));
  })
);

//get personal users feedbacks
router.post(
  "/topics",
  asyncHandler(async (req, res) => {
    const data = await FeedbackTopics.create(req.body);
    return res.send(sendResponse("Topic created"));
  })
);
router.put(
  "/topics/:id",
  asyncHandler(async (req, res) => {
    const data = await FeedbackTopics.updateOne(
      { _id: req.params.id },
      { topic: req.body.topic }
    );
    return res.send(sendResponse("Topic updated"));
  })
);
router.delete(
  "/topics/:id",
  asyncHandler(async (req, res) => {
    const data = await FeedbackTopics.deleteOne({ _id: req.params.id });
    return res.send(sendResponse(data));
  })
);
module.exports = router;
