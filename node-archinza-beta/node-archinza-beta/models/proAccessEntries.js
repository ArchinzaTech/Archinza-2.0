const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalAccount",
    },
    user_type: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    st_study_field: {
      type: Array,
      default: [],
    },
    st_graduate_year: {
      type: String,
      default: "",
    },
    st_unmet_needs: {
      type: String,
      default: "",
    },
    all_st_unmet_needs: {
      type: Array,
      default: [],
    },
    tm_job_profile: {
      type: Array,
      default: [],
    },

    tm_experience: {
      type: String,
      default: "",
    },
    tm_unmet_needs: {
      type: String,
      default: "",
    },
    all_tm_unmet_needs: {
      type: Array,
      default: [],
    },
    bo_buss_establishment: {
      type: String,
      default: "",
    },
    bo_unmet_needs: {
      type: String,
      default: "",
    },
    all_bo_unmet_needs: {
      type: Array,
      default: [],
    },
    fl_establishment: {
      type: String,
      default: "",
    },
    fl_unmet_needs: {
      type: String,
      default: "",
    },
    all_fl_unmet_needs: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true },
  }
);

schema.index({ updatedAt: 1, status: 1 });

module.exports = mongoose.model("ProAccessEntry", schema);
