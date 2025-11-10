const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const feedbackSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: {
      type: String,
    },
    whatsapp_country_code: { type: String },
    whatsapp_number: {
      type: String,
    },
    email: {
      type: String,
    },
    feedback_topic: {
      type: String,
    },
    feedback_message: {
      type: String,
    },
    status: {
      type: String,
      default: "new",
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    response_status: {
      type: String,
      default: "not_replied",
    },
    user_type: { type: String },
    source: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
