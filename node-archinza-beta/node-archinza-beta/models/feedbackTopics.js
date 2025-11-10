const mongoose = require("mongoose");

const feedbackTopicSchema = new mongoose.Schema(
  {
    topic: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeedbackTopic", feedbackTopicSchema);
