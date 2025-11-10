const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    // question: {
    //   type: String,
    //   default: "",
    // },
    st_study_field: {
      type: Array,
      default: [],
    },
    st_graduate_year: {
      type: Array,
      default: [],
    },
    st_unmet_needs: {
      type: Array,
      default: [],
    },
    bo_buss_establishment: {
      type: Array,
      default: [],
    },
    bo_unmet_needs: {
      type: Array,
      default: [],
    },
    tm_job_profile: {
      type: Array,
      default: [],
    },
    tm_experience: {
      type: Array,
      default: [],
    },
    tm_unmet_needs: {
      type: Array,
      default: [],
    },
    fl_establishment: {
      type: Array,
      default: [],
    },
    fl_unmet_needs: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true },
  }
);

module.exports = mongoose.model("Option", schema);
