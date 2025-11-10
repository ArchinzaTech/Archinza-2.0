const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema(
  {
    name: { type: String },
    event_mode: { type: String },
    location: { type: String },
    event_link: { type: Boolean },
    enquiry_email: { type: String },
    event_description: { type: String },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessAccount",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventsSchema);
