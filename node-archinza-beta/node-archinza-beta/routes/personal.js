const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/personalAccount");
const pincodeHash = require("../helpers/pincodeCache");
const UAParser = require("ua-parser-js");
var _ = require("lodash");

const config = require("../config/config");

const {
  sendResponse,
  sendError,
  validator,
  generateToken,
  generateOTP,
  isProduction,
} = require("../helpers/api");
const { sendmail } = require("../helpers/mailer");

const agenda = require("../jobs/agenda");
const axios = require("axios");
const ProAccess = require("../models/proAccessEntries");
const Reviews = require("../models/reviews");
const notificationAgenda = require("../jobs/notificationsAgenda");
const proUsersReminderSchedule = require("../jobs/proUsers/proUsersReminders");
const UserDevice = require("../models/userDevice");

var session;

router.get(
  "/details/:id",
  asyncHandler(async (req, res) => {
    const data = await User.findById(req.params.id).select("-password");

    res.send(sendResponse(data));
  })
);

router.get(
  "/edit-profile/:id",
  asyncHandler(async (req, res) => {
    const data = await User.findById(req.params.id).select("-password").lean();
    if (!data) {
      return res.send(sendResponse("No User Found"));
    }
    const token = generateToken(data);

    return res.send(sendResponse({ token, data }));
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = await User.findOne({
      phone: req.body.phone,
      country_code: req.body.country_code,
    })
      .select("-password")
      .lean();

    if (data) {
      // const token = jwt.sign(data, config.secretkey);

      // res.send(sendResponse({ token: token }, "Login Successfull"));

      // 6 digit otp
      var otp = generateOTP();

      session = req.session;
      session.otp = otp;

      console.log("session", req.session);

      agenda.now("email-otp", { email: data.email, otp });

      if (isProduction()) {
      agenda.now("mobile-otp", {
        phone: data.phone,
        otp,
        country_code: data.country_code,
      });
      }

      res.send(sendResponse(data));
    } else {
      res.send(sendError("Invalid mobile number", 400));
    }
  })
);

router.post(
  "/login/otp-verify",
  asyncHandler(async (req, res) => {
    if (req.session.otp == req.body.otp) {
      req.session.destroy();

      const user = await User.findOne({
        phone: req.body.phone,
        country_code: req.body.country_code,
      })
        .select("-password")
        .lean();
      const token = generateToken(user);

      const { deviceId } = req.body;
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"];
      const parser = new UAParser(userAgent);
      const result = parser.getResult();

      const browser = result.browser.name;
      const os = result.os.name;
      const deviceType = result.device.type || "desktop";

      const hasExistingDevice = await UserDevice.exists({
        user: user._id,
        userModel: "PersonalAccount",
      });

      const sameDevice = await UserDevice.findOne({
        user: user._id,
        userModel: "PersonalAccount",
        deviceId,
      });
      if (!sameDevice) {
        await UserDevice.create({
          user: user._id,
          userModel: "PersonalAccount",
          deviceId,
          browser,
          os,
          ip,
          deviceType,
        });

        if (hasExistingDevice) {
          agenda.now("new-device-login", {
            email: user.email,
            loginDate: new Date().toDateString(),
            browser,
            os,
            resetLink: config.react_app_url + "/reset-password",
          });
        }
      }
      res.send(sendResponse({ token }, "Login Successfull"));
    } else {
      res.send(sendError("Invalid OTP", 400));
    }
  })
);

router.post(
  "/bot-registration",
  asyncHandler(async (req, res) => {
    const data = await User.create(_.omit(req.body, ["otp"]));

    res.send(sendResponse([], "User Registered successfully"));
  })
);

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    var email = req.body.email;
    var phone = req.body.phone;
    var country_code = req.body.country_code;
    var whatsapp_no = req.body.whatsapp_no;
    const data = await User.findOne({
      $or: [
        { email: email },
        { $and: [{ country_code: country_code }, { phone: phone }] },
      ],
    });
    if (data) {
      res.send(sendError("User already exist", 400));
      return;
    }

    // 6 digit otp
    var otp = generateOTP();

    session = req.session;
    session.otp = otp;

    console.log("session", req.session);

    agenda.now("email-otp", { email, otp });

    if (isProduction()) {
    agenda.now("mobile-otp", { phone, otp, country_code });
    }

    res.send(sendResponse([], "Sign up OTP sent successfully"));
  })
);

router.post(
  "/signup/otp-verify",
  asyncHandler(async (req, res) => {
    if (req.session.otp == req.body.otp) {
      req.session.destroy();
      req.body["onboarding_source"] = "web";
      const data = await User.create(_.omit(req.body, ["otp"]));
      if (data.user_type !== "DE") {
        const ProAccessEntry = await ProAccess.create({
          user: data._id,
          user_type: data.user_type,
          status: "registered",
        });
      }

      const user = await User.findById(data._id).select("-password").lean();
      const token = generateToken(user);

      if (data.user_type === "DE") {
        notificationAgenda.now("send-non-pro-welcome", {
          entryId: data._id,
          email: data.email,
          templateVars: {
            name: data.name || "User",
          },
        });
      } else {
        for (const {
          delay,
          label,
          template,
          subject,
        } of proUsersReminderSchedule) {
          notificationAgenda.schedule(delay, label, {
            entryId: user._id,
            email: user.email,
            subject: subject,
            templateVars: {
              name: user.name || "User",
              template: template,
            },
          });
        }
      }

      res.send(sendResponse({ token }, "Register Successfull"));
    } else {
      res.send(sendError("Invalid OTP", 400));
    }
  })
);

router.post(
  "/forgot",
  asyncHandler(async (req, res) => {
    const data = await User.findOne({ email: req.body.email }).countDocuments();

    if (data > 0) {
      // 6 digit otp
      var otp = Math.floor(10000 + Math.random() * 90000);

      session = req.session;
      session.otp = otp;
      session.reset = 1;
      if (config.mail.mailer == "on") {
        const mail = await sendmail({
          to: req.body.email,
          from: { name: config.mail.sender_name, address: config.mail.sender },
          cc: config.mail.reciever_cc,
          subject: "Reset Password OTP",
          template: "forgot_otp",
          templateVars: { otp },
        });

        console.log("mail sent", mail);
      }

      res.send(sendResponse("Forgot OTP sent successfully"));
    } else {
      res.send(sendError("Email not found", 400));
    }
  })
);

router.post(
  "/forgot/otp/verify",
  asyncHandler(async (req, res) => {
    session = req.session;
    console.log(session);
    if (session.otp == req.body.otp) {
      res.send(sendResponse("OTP is correct"));
    } else {
      res.send(sendError("Invalid OTP", 400));
    }
  })
);

router.post(
  "/reset",
  asyncHandler(async (req, res) => {
    session = req.session;

    if (!session.reset) {
      res.send(sendError("Not Allowed", 400));
      return;
    }

    const data = await User.findOne({ email: req.body.email });
    if (!data) {
      res.send(sendError("User Not Found", 404));
      return;
    }

    await data.updateOne({ password: req.body.password });
    req.session.destroy();

    res.send(sendResponse("Password Changed Successfull"));
  })
);

router.get(
  "/verify-token/:token",
  asyncHandler(async (req, res) => {
    const token = req.params.token;
    console.log(token);
    const user = await User.findOne({ dashboard_token: token })
      .select("-password")
      .lean();
    if (!user) {
      return res.send(sendResponse([], "Invalid token"));
    }

    // if (user.token_expiry < Date.now()) {
    //   return res.send(sendResponse([], "Token expired"));
    // }

    //check for pro-user
    if (user.user_type !== "DE") {
      const proAccessData = await ProAccess.findOne({ user: user._id });
      if (proAccessData) {
        user["proAccessData"] = proAccessData;
      }
    }
    const access_token = generateToken(user);

    return res.send(
      sendResponse({ token: access_token, user: user }, "Token is Valid")
    );
  })
);

router.post(
  "/change-role",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.body.user_id);

    if (!user) {
      res.send(sendError("User Not Found", 404));
      return;
    }

    //check if user is DE
    if (user.user_type === "DE") {
      notificationAgenda.now("send-non-pro-rolechange", {
        entryId: user._id,
        email: user.email,
        templateVars: {
          name: user.name || "User",
        },
      });
    }

    await user.updateOne({ user_type: req.body.user_type });
    const updatedUser = await User.findById(req.body.user_id)
      .select("-password")
      .lean();
    const entry = await ProAccess.findOne({
      user: req.body.user_id,
      user_type: req.body.user_type,
    });

    if (!entry) {
      const newEntry = await ProAccess.create({
        user: req.body.user_id,
        user_type: req.body.user_type,
        status: "registered",
      });
    }
    const token = generateToken(updatedUser);

    //queue notification jobs for reminder of pro-access not fill
    for (const {
      delay,
      label,
      template,
      subject,
    } of proUsersReminderSchedule) {
      notificationAgenda.schedule(delay, label, {
        entryId: user._id,
        email: user.email,
        subject: subject,
        templateVars: {
          name: user.name || "User",
          template: template,
        },
      });
    }
    res.send(sendResponse({ updatedUser, token }, "Role Changed Successfully"));
  })
);

router.put(
  "/edit-profile/:id",

  asyncHandler(async (req, res) => {
    const data = await User.findById(req.params.id);
    if (!data) {
      res.send(sendError("User Not Found", 404));
    }
    await data.updateOne(req.body);

    res.send(sendResponse([], "Details updated Successfullly"));
  })
);

router.post(
  "/edit-email/:id",

  asyncHandler(async (req, res) => {
    const data = await User.findById(req.params.id);
    if (!data) {
      res.send(sendError("User Not Found", 404));
      return;
    }
    if (data.email === req.body.email) {
      res.send(sendError("You cannot use the email you have entered", 400));
      return;
    }

    const isEmailUsed = await User.findOne({ email: req.body.email });

    if (isEmailUsed) {
      res.send(sendError("Email already in use", 400));
      return;
    }

    let otp = generateOTP();

    session = req.session;
    session.otp = otp;
    agenda.now("email-otp", { email: req.body.email, otp });

    // await data.updateOne(req.body);

    res.send(sendResponse([], "Email OTP Sent"));
  })
);

router.post(
  "/edit-email-verify/:id",

  asyncHandler(async (req, res) => {
    const data = await User.findById(req.params.id);
    if (!data) {
      res.send(sendError("user Not Found", 404));
      return;
    }

    session = req.session;

    if (session.otp == req.body.otp) {
      req.session.destroy();

      await data.updateOne(req.body);

      res.send(sendResponse([], "Email updated Successfullly"));
    } else {
      res.send(sendError("Invalid OTP", 400));
    }
  })
);

router.post(
  "/edit-phone/:id",

  asyncHandler(async (req, res) => {
    const data = await User.findById(req.params.id);
    if (!data) {
      res.send(sendError("User Not Found", 404));
      return;
    }
    if (
      data.phone === req.body.phone &&
      data.country_code === req.body.country_code
    ) {
      res.send(
        sendError("You cannot use the mobile number you have entered", 400)
      );
      return;
    }

    const isPhoneUsed = await User.findOne({
      phone: req.body.phone,
      country_code: req.body.country_code,
    });

    if (isPhoneUsed) {
      res.send(sendError("Mobile number already in use", 400));
      return;
    }

    let otp = generateOTP();

    session = req.session;
    session.otp = otp;

    if (isProduction()) {
    agenda.now("mobile-otp", {
      phone: req.body.phone,
      otp,
      country_code: req.body.country_code,
    });
    }

    // await data.updateOne(req.body);

    res.send(sendResponse([], "Mobile OTP Sent"));
  })
);

router.post(
  "/edit-phone-verify/:id",

  asyncHandler(async (req, res) => {
    const data = await User.findById(req.params.id);
    if (!data) {
      res.send(sendError("User Not Found", 404));
      return;
    }

    session = req.session;

    if (session.otp == req.body.otp) {
      req.session.destroy();

      await data.updateOne(req.body);

      res.send(sendResponse([], "Phone updated Successfullly"));
    } else {
      res.send(sendError("Invalid OTP", 400));
    }
  })
);

router.post(
  "/edit-whatsapp/:id",

  asyncHandler(async (req, res) => {
    const data = await User.findById(req.params.id);
    if (!data) {
      res.send(sendError("User Not Found", 404));
      return;
    }
    if (data.whatsapp_no === req.body.whatsapp_no) {
      res.send(
        sendError("You cannot use the WhatsApp number you have entered", 400)
      );
      return;
    }

    const isWAUsed = await User.findOne({
      whatsapp_no: req.body.whatsapp_no,
    });

    if (isWAUsed) {
      res.send(sendError("WhatsApp number already in use", 400));
      return;
    }

    let otp = generateOTP();

    session = req.session;
    session.otp = otp;

    if (isProduction()) {
    agenda.now("mobile-otp", {
      phone: req.body.phone,
      otp,
      country_code: "91",
    });
    }

    // await data.updateOne(req.body);

    res.send(sendResponse([], "Mobile OTP Sent"));
  })
);

router.post(
  "/edit-whatsapp-verify/:id",

  asyncHandler(async (req, res) => {
    const data = await User.findById(req.params.id);
    if (!data) {
      res.send(sendError("User Not Found", 404));
      return;
    }

    session = req.session;

    if (session.otp == req.body.otp) {
      req.session.destroy();

      await data.updateOne(req.body);

      res.send(sendResponse([], "Whatsapp updated Successfullly"));
    } else {
      res.send(sendError("Invalid OTP", 400));
    }
  })
);

router.put(
  "/edit-password/:id",

  asyncHandler(async (req, res) => {
    const data = await User.findById(req.params.id);
    if (!data) {
      res.send(sendError("User Not Found", 404));
    }
    console.log(data.password);
    console.log(req.body.current_password);
    if (data.password != req.body.current_password) {
      res.send(sendError("Current Password do not match", 400));
      return;
    }

    if (data.password === req.body.password) {
      res.send(sendError("Same password cannot be used", 400));
      return;
    }

    await data.updateOne({ password: req.body.password });

    res.send(sendResponse([], "Password updated Successfullly"));
  })
);

//validate pincode
// router.get(
//   "/check-pincode/:pincode",
//   asyncHandler(async (req, res) => {
//     const pincode = req.params.pincode;
//     const city = req.query.city;
//     const pincodeData = await pincodeHash.getPincodeData(pincode);
//     if (pincodeData[0].Status === "Error" || !pincodeData[0].PostOffice) {
//       return res.send(sendResponse(null, "Invalid Pincode"));
//     }

//     if (city) {
//       const cityMatches = pincodeData[0].PostOffice.some(
//         (postOffice) =>
//           postOffice.Name.toLowerCase() === city.toLowerCase() ||
//           postOffice.Region.toLowerCase() === city.toLowerCase() ||
//           postOffice.Division.toLowerCase() === city.toLowerCase() ||
//           postOffice.District.toLowerCase() === city.toLowerCase()
//       );

//       if (!cityMatches) {
//         return res.send(
//           sendResponse(null, "City does not match the entered pincode")
//         );
//       }
//       return res.send(
//         sendResponse(pincodeData, "City matched with the pincode")
//       );
//     }

//     res.send(sendResponse(pincodeData, "Pincode verified successfully"));
//   })
// );

router.get(
  "/check-pincode/:pincode",
  asyncHandler(async (req, res) => {
    const { pincode } = req.params;
    const { city } = req.query;
    const apiKey = config.google_places_api_key;

    // First API call with pincode
    const pincodeUrl = `${config.google_geocode_api}?address=${pincode}&key=${apiKey}`;
    const pincodeResponse = await axios.get(pincodeUrl);
    const { status, results } = pincodeResponse.data;

    if (status !== "OK" || !results.length) {
      return res.send(sendResponse(null, "Invalid Pincode"));
    }

    if (city) {
      const addressComponents = results[0].address_components;
      const localities = results[0].postcode_localities || [];
      const cityMatches =
        addressComponents.some(
          (component) =>
            component.types.includes("locality") &&
            component.long_name.toLowerCase() === city.toLowerCase()
        ) ||
        localities.some(
          (locality) => locality.toLowerCase() === city.toLowerCase()
        );

      if (cityMatches) {
        return res.send(sendResponse(results[0], "City matched with pincode"));
      }
      // Fallback: Check city without pincode
      const cityUrl = `${config.google_geocode_api}?address=${city}&key=${apiKey}`;
      const cityResponse = await axios.get(cityUrl);
      if (
        cityResponse.data.status !== "OK" ||
        !cityResponse.data.results.length
      ) {
        return res.send(sendResponse(null, "City not found"));
      }

      const cityComponents = cityResponse.data.results[0].address_components;
      const resolvedCity = cityComponents
        .find((component) => component.types.includes("locality"))
        ?.long_name.toLowerCase();
      if (!resolvedCity) {
        return res.send(sendResponse(null, "Invalid city name"));
      }

      const resolvedCityMatches =
        addressComponents.some(
          (component) =>
            (component.types.includes("locality") ||
              component.types.includes("administrative_area_level_3") ||
              component.types.includes("administrative_area_level_2")) &&
            component.long_name.toLowerCase() === resolvedCity
        ) ||
        localities.some((locality) => locality.toLowerCase() === resolvedCity);

      if (resolvedCityMatches) {
        return res.send(
          sendResponse(
            results[0],
            `City matched with pincode (resolved as ${resolvedCity})`
          )
        );
      }

      return res.send(
        sendResponse(null, "City does not match the entered pincode")
      );
    }

    res.send(sendResponse(results[0], "Pincode verified successfully"));
  })
);

//post a review
router.post(
  "/post-review",
  asyncHandler(async (req, res) => {
    const review = await Reviews.create(req.body);
    res.send(sendResponse(review, "Review posted successfully"));
  })
);

//business feedback
router.post(
  "/feedback",
  asyncHandler(async (req, res) => {
    req.body["user_type"] = "personal";
    const record = await Feedback.create(req.body);
    return res.send(sendResponse("Feedback Submitted"));
  })
);

module.exports = router;
