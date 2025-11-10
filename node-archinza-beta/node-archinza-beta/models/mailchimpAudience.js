const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    id: String,
    name: String,
  },
  { strict: false }
);

module.exports = mongoose.model("MailchimpAudience", Schema);
