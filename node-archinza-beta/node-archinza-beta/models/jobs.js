const mongoose = require("mongoose");

const jobsSchema = new mongoose.Schema(
  {
    title: { type: String },
    location: { type: String },
    mode_of_work: { type: String },
    employement_type: { type: String },
    openings: { type: String },
    required_skills: { type: String },
    experience: { type: String },
    salary_range: { type: String },
    application_email: { type: String },
    application_description: { type: String },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessAccount",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobsSchema);
