const mongoose = require("mongoose");

const currencyRateSchema = new mongoose.Schema({
  base_currency: {
    type: String,
    trim: true,
  },
  target_currency: {
    type: String,
    trim: true,
  },
  exchange_rate: {
    type: Number,
  },
  last_updated: {
    type: Date,
    default: Date.now(),
  },
});

const schema = new mongoose.Schema(
  {
    product_positionings: [{ type: String }],
    project_typologies: [{ type: String }],
    average_budget: [
      {
        budget: { type: String },
        currency: { type: String },
      },
    ],
    minimum_project_fee: [
      {
        type: String,
      },
    ],
    project_sizes: [
      {
        size: { type: String },
        unit: { type: String },
      },
    ],
    price_ratings: [{ type: String }],
    design_styles: [{ type: String }],
    project_scope_preferences: [{ type: String }],
    project_locations: [{ type: String }],
    team_member_ranges: [{ type: String }],
    latest_currency: currencyRateSchema,
    email_types: [{ type: String }],
    address_types: [{ type: String }],
    addon_services: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// services: [{ type: String }],
// c_services: [{ type: String }],
// d_services: [{ type: String }],
// d_services_extra: [{ type: String }],
// f_services: [{ type: String }],
// g_services: [{ type: String }],
// h_services: [{ type: String }],
// j_services: [{ type: String }],
// addon_services: [{ type: String }],
// typologies: [{ type: String }],
// design_styles: [{ type: String }],
// preferences: [{ type: String }],
// min_fees: [
//   { type: { fee: { type: String }, currency: { type: String } } },
// ],
// emoployee_count: [{ type: String }],
// project_sizes: [{ type: String }],
// locations: [{ type: String }],
// currencies: [{ type: String }],
// budget: [{ type: { type: String }, currency: { type: String } }],
// address_types: [{ type: String }],
// latest_currency: [currencyRateSchema],
module.exports = mongoose.model("BusinessAccountOption", schema);
