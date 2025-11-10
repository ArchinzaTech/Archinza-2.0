const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    services: [
      {
        value: { type: String },
        tag: { type: String },
      },
    ],
  },
  { _id: false }
);

module.exports = mongoose.model("Services", servicesSchema);
