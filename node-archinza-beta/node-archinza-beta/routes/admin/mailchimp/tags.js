const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
// const Model = require("../../../models/mailchimpAudience");
const ModuleName = "Tag";
const ImagePath = "public/uploads/mailchimp/tag/"; //with tailing slash
// console.log(models);
const client = require("@mailchimp/mailchimp_marketing");
const {
  sendResponse,
  sendError,
  validator,
  deleteMedia,
} = require("../../../helpers/api");
const config = require("../../../config/config");

const storage = multer.diskStorage({
  destination: ImagePath,
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

const uploadMultiple = upload.fields([
  // { name: "image", maxCount: 1 }
]);

client.setConfig({
  apiKey: config.mailchimp.api_key,
  server: config.mailchimp.server,
});

router.get(
  "/:audienceId",

  asyncHandler(async (req, res) => {
    const audienceId = req.params.audienceId;
    try {
      const response = await client.lists.listSegments(audienceId, {
        type: "static",
      });

      res.send(sendResponse(response?.segments));
    } catch (error) {
     
      res.send(sendError(error.response.body.detail, error.status));
    }
  })
);

router.get(
  "/:audienceId/:id",

  asyncHandler(async (req, res) => {
    const audienceId = req.params.audienceId;
    const id = req.params.id;
    try {
      const response = await client.lists.getSegment(audienceId, id);

      res.send(sendResponse(response));
    } catch (error) {
    
      res.send(sendError(error.response.body.detail, error.status));
    }
  })
);

router.post(
  "/:audienceId",
  asyncHandler(async (req, res) => {
    const audienceId = req.params.audienceId;

    try {
      const response = await client.lists.createSegment(audienceId, {
        name: req.body.name,
        static_segment: [],
      });

      res.send(sendResponse(response, `${ModuleName} Created Successfullly`));
    } catch (error) {
      
      res.send(sendError(error.response.body.detail, error.status));
    }
  })
);
router.put(
  "/:audienceId/:id",
  asyncHandler(async (req, res) => {
    const audienceId = req.params.audienceId;
    const id = req.params.id;

    try {
      const response = await client.lists.updateSegment(audienceId, id, {
        name: req.body.name,
      });

      res.send(sendResponse(response, `${ModuleName} updated Successfullly`));
    } catch (error) {
     
      res.send(sendError(error.response.body.detail, error.status));
    }
  })
);



router.delete(
  "/:audienceId/:id",
  asyncHandler(async (req, res) => {
    const audienceId = req.params.audienceId;
    const id = req.params.id;

    try {
      const response = await client.lists.deleteSegment(audienceId, id);

      res.send(sendResponse(response, `${ModuleName} Deleted Successfullly`));
    } catch (error) {
     
      res.send(sendError(error.response.body.detail, error.status));
    }

   
  })
);

router.put(
  "/status/:id",
  asyncHandler(async (req, res) => {
    try {
      const data = await Model.findById(req.params.id);
      if (!data) {
        res.send(sendError("Not Found", 404));
      }

      await data.updateOne(req.body);

      res.send(sendResponse(data, `${ModuleName} Status Updated`));
    } catch (error) {
      res.send(sendError(error.message, 500));
    }
  })
);

module.exports = router;
