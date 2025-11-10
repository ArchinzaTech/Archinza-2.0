const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user_type: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    country_code: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },
    whatsapp_country_code: {
      type: String,
      default: "",
    },
    whatsapp_no: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    dashboard_token: {
      type: String,
    },
    token_expiry: {
      type: Date,
    },
    onboarding_source: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

schema.virtual("proAccessEntry", {
  ref: "ProAccessEntry",
  localField: "_id",
  foreignField: "user",
});

// userSchema.virtual("countryData", {
//   ref: "Country",
//   foreignField: "id",
//   localField: "head_location",
// });

// userSchema.virtual("stateData", {
//   ref: "State",
//   foreignField: "id",
//   localField: "state",
// });

// userSchema.virtual("cityData", {
//   ref: "City",
//   foreignField: "id",
//   localField: "city",
// });

module.exports = mongoose.model("PersonalAccount", schema);
