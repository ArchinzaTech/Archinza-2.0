const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Model = require("../../models/finalist");
const Voter = require("../../models/voter");

const { sendResponse, sendError } = require("../../helpers/api");


const moduleName = "Finalist";
router.get(
  "/",

  asyncHandler(async (req, res) => {
    const datas = await Model.find().populate('voters');
    res.send(sendResponse(datas));
  })
);

router.get(
  "/:id",

  asyncHandler(async (req, res) => {
    const data = await Model.findById(req.params.id).populate('voters');

    res.send(sendResponse(data));
  })
);

router.post("/", async (req, res) => {

  const finalist= {
    brand_name: "BAHUT BEAUTY LLP",
    website: null,
    instagram: null,
    category: "imagine",
    members: [
      {
        name: "Sonya Khubchandani De Castelbajac",
        designation: "FOUNDER",
        company: "BAHUT BEAUTY LLP",
        photo: "photo.png",
      },
    ],
  }
  const data = await Model.create(finalist);

  res.send(sendResponse(data, `${moduleName} Created Successfullly`));
});


router.post("/voter", async (req, res) => {

  const voter= {
    email: "khalid@togglehead.in",

    brand: "63513ca622979b00685faa9a"
  }
  const data = await Voter.create(voter);

  res.send(sendResponse(data, `Voter Created Successfullly`));
});

module.exports = router;
