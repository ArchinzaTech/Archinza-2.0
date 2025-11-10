const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema(
  {
    name: { type: String },
    duration: { type: String },
    mode_of_learning: { type: String },
    certificate: { type: Boolean },
    financial_aid: { type: Boolean },
    course_link: { type: String },
    enquiry_email: { type: String },
    salary_range: { type: String },
    course_description: { type: String },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessAccount",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", coursesSchema);
