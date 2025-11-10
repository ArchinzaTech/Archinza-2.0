const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const Model = require("../../models/press");
const ModuleName="Press";
const ImagePath="public/uploads/press/"; //with tailing slash

// console.log(models);

const {
  sendResponse,
  sendError,
  validator,
  deleteMedia,
} = require("../../helpers/api");

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

const uploadMultiple = upload.fields([{ name: "image", maxCount: 1 }]);

router.get(
  "/",

  asyncHandler(async (req, res) => {
    const datas = await Model.find().populate("publisher");
    res.send(sendResponse(datas));
  })
);

router.get(
  "/:id",

  asyncHandler(async (req, res) => {
    const data = await Model.findById(req.params.id);

    res.send(sendResponse(data));
  })
);

router.post("/", async (req, res) => {
  uploadMultiple(
    req,
    res,
    asyncHandler(async (err) => {
      if (err) {
        res.send(sendError(err, 400));
      } else {
        try {
          // if (req.files.image) {
          req.body.image = req.files.image[0].filename;
          // }

          const data = await Model.create(req.body);

          res.send(sendResponse(data, `${ModuleName} Created Successfullly`));
        } catch (error) {
          res.status(500).send(sendError(error.message, 500));
        }
      }
    })
  );
});

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    uploadMultiple(req, res, async (err) => {
      if (err) {
        res.send(sendError(err, 400));
      } else {
        try {
          const data = await Model.findById(req.params.id);
          if (!data) {
            res.send(sendError("Not Found", 404));
          }
          // res.send(sendResponse(req.files, ""));
          // return;
          if (req.files.image) {
            const filename = req.files.image[0].filename;
            if (data.image) {
              deleteMedia(ImagePath + data.image);
            }

            req.body.image = filename;
          }

          await data.updateOne(req.body);

          res.send(sendResponse(data, `${ModuleName} Update Successfullly`));
        } catch (error) {
          res.send(sendError(error.message, 500));
        }
      }
    });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = await Model.findById(req.params.id);
    if (!data) {
      res.send(sendError("Not Found", 404));
      return;
    }
    if (data.image) {
      deleteMedia(ImagePath + data.image);
    }

    await data.deleteOne();

    res.send(sendResponse(data, `${ModuleName} Deleted Successfullly`));
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
