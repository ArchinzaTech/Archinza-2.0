const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");

const Model = require("../../../models/homepageContent");

// console.log(models);
const mediaPath = "public/uploads/content/homepage/"; // with trailing slash
const moduleName = "Homepage Content";

const {
  sendResponse,
  sendError,
  validator,
  deleteMedia,
} = require("../../../helpers/api");

const storage = multer.diskStorage({
  destination: mediaPath,
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

const uploadMultiple = upload.fields([{ name: "stockGraph", maxCount: 1 }]);

router.get(
  "/",

  asyncHandler(async (req, res) => {
    const datas = await Model.findOne();
    res.send(sendResponse(datas));
  })
);

router.put(
  "/",
  asyncHandler(async (req, res) => {
    uploadMultiple(req, res, async (err) => {
      if (err) {
        res.send(sendError(err, 400));
      } else {
        try {
          const data = await Model.findOne();
          if (!data) {
            res.send(sendError("Not Found", 404));
          }
          // res.send(sendResponse(req.files, ""));
          // return;
          if (req.files.stockGraph) {
            const filename = req.files.stockGraph[0].filename;
            if (data.stockGraph) {
              deleteMedia(mediaPath + data.stockGraph);
            }

            req.body.stockGraph = filename;
          }

          await data.updateOne(req.body);

          res.send(sendResponse(data, `${moduleName} Update Successfullly`));
        } catch (error) {
          res.send(sendError(error.message, 500));
        }
      }
    });
  })
);

module.exports = router;
