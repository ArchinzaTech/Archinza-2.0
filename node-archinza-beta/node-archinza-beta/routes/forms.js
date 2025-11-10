const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  sendResponse,
  sendError,
  validator,
  deleteMedia,
} = require("../helpers/api");
const Newsletter = require("../models/newsletter");
const User = require("../models/personalAccount");
const { sendmail } = require("../helpers/mailer");
const config = require("../config/config");

const multer = require("multer");

const mediaPath = "public/uploads/user/"; // with trailing slash

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

const uploadMultiple = upload.fields([{ name: "buss_overview", maxCount: 1 }]);

router.get(
  "/newsletter",

  asyncHandler(async (req, res) => {
    const data = await Newsletter.find().sort({ createdAt: -1 });

    res.send(sendResponse(data));
  })
);
router.post(
  "/newsletter",

  asyncHandler(async (req, res) => {
    const data = await Newsletter.create(req.body);

    res.send(sendResponse(data, "Subscribed Successfullly"));
  })
);
router.delete("/newsletter/:id", async (req, res) => {
  const data = await Newsletter.findByIdAndDelete(req.params.id);
  res.send(sendResponse(data, "Record Deleted Successfully"));
});

router.put(
  "/registration/:id",

  asyncHandler(async (req, res) => {
    const data = await User.findById(req.params.id);
    if (!data) {
      res.send(sendError("Not Found", 404));
    }

    await data.updateOne(req.body);

    if (config.mail.mailer == "on" && req.body.status == "completed") {
      const mail = await sendmail({
        to: data.email,
        from: { name: config.mail.sender_name, address: config.mail.sender },
        cc: config.mail.reciever_cc,
        subject: "Congratulations! Application submitted",
        template: "application_complete",
        templateVars: { name: data.first_name },
      });

      console.log("mail sent", mail);
    }

    const userData = await User.findById(req.params.id);

    res.send(sendResponse(userData, "details updated Successfullly"));
  })
);

router.put(
  "/registration/files/:id",
  asyncHandler(async (req, res) => {
    uploadMultiple(req, res, async (err) => {
      if (err) {
        res.send(sendError(err, 400));
      } else {
        try {
          const data = await User.findById(req.params.id);
          if (!data) {
            res.send(sendError("Not Found", 404));
          }

          if (req.files.buss_overview) {
            const filename = req.files.buss_overview[0].filename;
            if (data.buss_overview) {
              deleteMedia(mediaPath + data.buss_overview);
            }

            req.body.buss_overview = filename;
          }

          await data.updateOne(req.body);

          if (config.mail.mailer == "on" && req.body.status == "completed") {
            const mail = await sendmail({
              to: data.email,
              from: {
                name: config.mail.sender_name,
                address: config.mail.sender,
              },
              cc: config.mail.reciever_cc,
              subject: "Application complete",
              template: "application_complete",
              templateVars: { name: data.first_name },
            });

            console.log("mail sent", mail);
          }

          const userData = await User.findById(req.params.id);

          res.send(sendResponse(userData, "details updated Successfullly"));
        } catch (error) {
          res.send(sendError(error.message, 500));
        }
      }
    });
  })
);

module.exports = router;
