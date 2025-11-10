const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    business_name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    username: { type: String, unique: true },
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
    brand_logo: { type: String },
    bio: { type: String, default: "" },
    status: { type: String, default: "" },
    business_address: { type: String, default: "" },
    email_ids: [
      { email: { type: String }, type: { type: String }, _id: false },
    ],
    addresses: [
      { address: { type: String }, type: { type: String }, _id: false },
    ],
    google_location: {
      latitude: { type: String },
      longitude: { type: String },
    },
    keywords: [{ type: String }],
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    pincode: { type: String, default: "" },
    //Owners details
    owners: [
      {
        name: {
          type: String,
          required: true,
          isPrivate: { type: Boolean, default: false },
        },
        email: {
          type: String,
          required: true,
          isPrivate: { type: Boolean, default: false },
        },
        country_code: {
          type: String,
          isPrivate: { type: Boolean, default: false },
        },
        phone: { type: String, isPrivate: { type: Boolean, default: false } },
        whatsapp_country_code: {
          type: String,
          isPrivate: { type: Boolean, default: false },
        },
        whatsapp_no: {
          type: String,
          isPrivate: { type: Boolean, default: false },
        },
      },
    ],

    business_types: [
      { type: mongoose.Schema.Types.ObjectId, ref: "BusinessType" },
    ],
    services: [{ type: String }],
    is_services_manually: { type: Boolean, default: false }, //to track if the user has selected services manually
    renovation_work: { type: String, default: false },
    product_positionings: [{ type: String }],
    featured_services: [{ type: String }],
    project_sizes: {
      sizes: [{ type: String }],
      unit: { type: String },
      isPrivate: { type: Boolean, default: false },
    },
    project_typology: {
      data: [{ type: String, default: "" }],
      isPrivate: { type: Boolean, default: false },
    },
    project_mimimal_fee: {
      fee: { type: String, default: "" },
      currency: { type: String, default: "" },
      isPrivate: { type: Boolean, default: false },
    },
    design_style: {
      data: [{ type: String, default: "" }],
      isPrivate: { type: Boolean, default: false },
    },
    avg_project_budget: {
      budgets: [{ type: String, default: "" }],
      currency: { type: String, default: "" },
      isPrivate: { type: Boolean, default: false },
    },
    project_scope: {
      data: [{ type: String, default: "" }],
      isPrivate: { type: Boolean, default: false },
    },

    project_location: {
      data: { type: String, default: "" },
      isPrivate: { type: Boolean, default: false },
    },
    establishment_year: {
      data: { type: String, default: "" },
      isPrivate: { type: Boolean, default: false },
    },
    team_range: {
      data: { type: String, default: "" },
      isPrivate: { type: Boolean, default: false },
    },
    price_rating: {
      type: String,
      default: "",
      isPrivate: { type: Boolean, default: false },
    },
    market_segment: {
      type: String,
      default: "",
      isPrivate: { type: Boolean, default: false },
    },
    sustainability_rating: {
      type: String,
      default: "",
      isPrivate: { type: Boolean, default: false },
    },
    website_link: {
      type: String,
      default: "",
      isPrivate: { type: Boolean, default: false },
    },
    instagram_handle: {
      type: String,
      default: "",
      isPrivate: { type: Boolean, default: false },
    },
    linkedin_link: {
      type: String,
      default: "",
      isPrivate: { type: Boolean, default: false },
    },
    enquiry_preferences: {
      projects_business: {
        contact_person: {
          type: String,
          default: "",
        },
        contact_methods: [
          {
            type: String,
          },
        ],
      },
      product_material: {
        contact_person: {
          type: String,
          default: "",
        },
        contact_methods: [
          {
            type: String,
          },
        ],
      },
      jobs_internships: {
        contact_person: {
          type: String,
          default: "",
        },
        contact_methods: [
          {
            type: String,
          },
        ],
      },
      media_pr: {
        contact_person: {
          type: String,
          default: "",
        },
        contact_methods: [
          {
            type: String,
          },
        ],
      },
    },
    business_hours: [
      {
        day: { type: String },
        open: { type: String },
        close: { type: String },
        isClosed: { type: Boolean, default: false },
        _id: false,
      },
    ],
    media_consent_approval: { type: Boolean, default: false },
    isVerified: {
      type: Boolean,
      default: false,
    },
    pageStatus: {
      type: String,
      default: "offline",
    },
    onboarding_source: { type: String },
    additional_web_urls: { type: [String] },
    other_busiess_type: { type: String },
    scrap_content_task_id: { type: String },
    last_updated_scraped_content: { type: Date, default: null },
    new_scraped_content: { type: Boolean, default: false },
    firstValidAt: { type: Date },
    scraped_city: { type: String },
    scraped_country: { type: String },
    scraped_pincode: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

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

module.exports = mongoose.model("BusinessAccount", schema);
