const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    brand_name: String,
    website: String,
    instagram: String,
    category: String,
    members: [
      {
        name: String,
        designation: String,
        company: String,
        photo: String,
      },
    ],
  },
  { timestamps: true ,
    toJSON: { virtuals: true }
}
);


schema.virtual("voters", {
    ref: "Voter",
    foreignField: "brand",
    localField: "_id"
  });

module.exports = mongoose.model("Finalist", schema);
