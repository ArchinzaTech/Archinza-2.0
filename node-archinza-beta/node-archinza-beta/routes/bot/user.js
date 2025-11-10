const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/personalAccount");
const Option = require("../../models/options");
var _ = require("lodash");
const Fuse = require("fuse.js");
const pincodeHash = require("../../helpers/pincodeCache");
const City = require("../../models/city");
const config = require("../../config/config");
const qs = require("qs");
const FormData = require("form-data");

const {
  sendResponse,
  sendError,
  validator,
  generateToken,
  generateOTP,
  isProduction,
  generatePersonalUserUniqueToken,
} = require("../../helpers/api");
const proAccessEntries = require("../../models/proAccessEntries");
const Country = require("../../models/country");
const Chats = require("../../models/chat");
const Feedback = require("../../models/feedback");
const { default: axios } = require("axios");
const BusinessUser = require("../../models/businessAccount");
const FeedbackTopics = require("../../models/feedbackTopics");
const { uploadSingle } = require("../../middlewares/upload");
const fuseOptions = {
  includeScore: true,
  threshold: 0.3,
};

function normalizeString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const aliasMapping = [{ delhi: "New Delhi", perumpadappu: "Perumpadappu" }];

router.post(
  "/",
  asyncHandler(async (req, res) => {
    // Define schema for initial validation
    let schemaObj = {
      user_type: Joi.string().valid("BO", "ST", "DE", "TM", "FL").required(),
      name: Joi.string()
        .pattern(/^[A-Za-z\s]+$/)
        .required()
        .messages({
          "string.pattern.base": "Name should contain only alphabets",
        }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      country_code: Joi.number().required(),
      phone: Joi.string()
        .pattern(/^[0-9]+$/) // only digits
        .required()
        .messages({
          "string.pattern.base": "Phone must contain only digits",
        }),
      country: Joi.string()
        .pattern(/^[A-Za-z\s]+$/)
        .required()
        .messages({
          "string.pattern.base": "Country should contain only alphabets",
        }),
    };

    // Initial validation based on user input
    if (req.body.country) {
      if (req.body.country.toLowerCase() === "india") {
        schemaObj.city = Joi.string()
          .pattern(/^[A-Za-z\s]+$/)
          .required()
          .messages({
            "string.pattern.base": "City should contain only alphabets",
          });
        schemaObj.pincode = Joi.string()
          .pattern(/^[0-9]{6}$/)
          .required()
          .messages({
            "string.pattern.base": "Pincode must be exactly 6 digits",
          });
      }
    }

    // Joi schema validation
    const schema = Joi.object(schemaObj).options({ allowUnknown: true });
    const { error } = validator(req.body, schema);
    if (error) {
      return res.send(sendError(error.details[0].message, 400));
    }

    // Initialize requestBody
    const requestBody = {
      user_type: req.body.user_type,
      name: req.body.name,
      email: req.body.email,
      country_code: req.body.country_code,
      phone: req.body.phone,
      whatsapp_country_code: req.body.country_code,
      whatsapp_no: req.body.phone,
    };

    const api_key = config.google_places_api_key;

    const countryResponse = await axios.get(
      `${config.google_geocode_api}?address=${req.body.country}&key=${api_key}`
    );

    if (
      countryResponse.data.status !== "OK" ||
      countryResponse.data.results.length === 0
    ) {
      return res.send(sendError("Invalid country name", 400));
    }
    const countryResult = countryResponse.data.results[0];

    if (!countryResult.types.includes("country")) {
      return res.send(sendError("Invalid country name", 400));
    }
    const countryComponents = countryResult.address_components;
    const officialCountryFromGoogle = countryComponents.find((comp) =>
      comp.types.includes("country")
    )?.long_name;

    if (!officialCountryFromGoogle) {
      return res.send(sendError("Invalid country name", 400));
    }

    console.log(
      `Official country from Google for "${req.body.country}": ${officialCountryFromGoogle}`
    );

    requestBody["country"] = officialCountryFromGoogle;

    // ADDITIONAL VALIDATION: Check if official country is India but required fields are missing
    if (officialCountryFromGoogle === "India") {
      if (!req.body.city) {
        return res.send(sendError("city is not allowed to be empty", 400));
      }
      if (!req.body.pincode) {
        return res.send(sendError("pincode is not allowed to be empty", 400));
      }

      // Validate pincode format again for India
      const pincodePattern = /^[0-9]{6}$/;
      if (!pincodePattern.test(req.body.pincode)) {
        return res.send(sendError("Pincode must be exactly 6 digits", 400));
      }
    }

    if (officialCountryFromGoogle === "India") {
      const api_key = config.google_places_api_key;

      console.log("API hit 1st time - Validating city name");

      const inputCity = req.body.city.toLowerCase();
      const aliasMap = Object.assign({}, ...aliasMapping);

      // Step 1: Validate city name using Google Geocoding API with more specific query
      let officialCityFromGoogle;

      //check in aliasMapping
      if (aliasMap[inputCity]) {
        officialCityFromGoogle = aliasMap[inputCity];
        console.log("Got the officla city", officialCityFromGoogle);
      } else {
        const cityResponse = await axios.get(
          `${config.google_geocode_api}?address=${encodeURIComponent(
            req.body.city
          )}&components=country:IN&key=${api_key}`
        );

        if (
          cityResponse.data.status !== "OK" ||
          cityResponse.data.results.length === 0
        ) {
          return res.send(sendError("Invalid city name", 400));
        }
        const results = cityResponse?.data?.results[0] || [];
        let cityType;
        // Loop through all results
        const cityComponents = results.address_components;
        const localityComponent = cityComponents.find(
          (comp) =>
            comp.types.includes("locality") && comp.types.includes("political")
        );
        if (localityComponent) {
          officialCityFromGoogle = localityComponent.long_name;
          cityType = "locality";
        }
        console.log("officialCityFromGoogle", officialCityFromGoogle);

        if (!officialCityFromGoogle) {
          return res.send(sendError("Invalid city name", 400));
        }

        console.log(
          `Official city from Google for "${req.body.city}": ${officialCityFromGoogle}`
        );
      }

      console.log("API hit 2nd time - Validating pincode");

      // Step 2: Validate pincode using Google Geocoding API with country restriction
      const pincodeResponse = await axios.get(
        `${config.google_geocode_api}?address=${req.body.pincode}&components=country:IN&key=${api_key}`
      );

      if (
        pincodeResponse.data.status !== "OK" ||
        pincodeResponse.data.results.length === 0
      ) {
        return res.send(sendError("Invalid pincode", 400));
      }

      const pincodeResult = pincodeResponse.data.results[0];
      const pincodeComponents = pincodeResult.address_components;
      const localities = pincodeResult.postcode_localities || [];

      let officialCityFromPincode = null;

      const localityFromPincode = pincodeComponents.find(
        (comp) =>
          comp.types.includes("locality") && comp.types.includes("political")
      );
      console.log(localityFromPincode);
      console.log("officialCityFromGoogle");
      console.log(officialCityFromGoogle);
      const localityFromPostcodeLocalities = localities.find(
        (it) => it?.toLowerCase() === officialCityFromGoogle?.toLowerCase()
      );
      console.log(localityFromPostcodeLocalities);
      if (localityFromPincode) {
        if (
          localityFromPincode.long_name.toLowerCase() ===
          officialCityFromGoogle.toLowerCase()
        ) {
          officialCityFromPincode = officialCityFromGoogle;
        }
      }
      if (localityFromPostcodeLocalities) {
        if (
          localityFromPostcodeLocalities.toLowerCase() ===
          officialCityFromGoogle.toLowerCase()
        ) {
          officialCityFromPincode = officialCityFromGoogle;
        }
      }

      if (!officialCityFromPincode) {
        return res.send(sendError("Invalid pincode", 400));
      }

      console.log(`City-Pincode validation successful.`);

      // Step 4: Success - Add validated data to request body
      requestBody["city"] = officialCityFromGoogle; // Use Google's official name
      requestBody["pincode"] = req.body.pincode;

      console.log("City-Pincode validation completed successfully");
    }

    // Check if the user already exists by email or phone number
    const userExist = await User.findOne({
      $or: [
        { email: req.body.email },
        {
          $and: [
            { country_code: req.body.country_code },
            { phone: req.body.phone },
          ],
        },
      ],
    });
    if (userExist) {
      return res.send(sendError("User already exists", 400));
    }

    // Generate a unique token for the user
    const tokenExpiryTimestamp = Date.now() + 15 * 60 * 1000;
    const { token, tokenExpiry } = await generatePersonalUserUniqueToken(
      req.body.email,
      tokenExpiryTimestamp
    );

    // Add dashboard token and token expiry to requestBody
    requestBody["dashboard_token"] = token;
    requestBody["token_expiry"] = tokenExpiry;
    requestBody["onboarding_source"] = "bot";
    // Create the user and send the response
    const userData = await User.create(requestBody);
    const plainData = userData.toJSON();

    await proAccessEntries.create({
      user: userData._id,
      user_type: userData.user_type,
      status: "registered",
    });

    plainData["dashboard_url"] =
      config.react_app_url + `/dashboard?token=${token}`;

    res.send(
      sendResponse(
        _.omit(plainData, [
          "password",
          "whatsapp_country_code",
          "whatsapp_no",
          "state",
          "status",
          "token_expiry",
          "dashboard_token",
          "updatedAt",
        ])
      )
    );
  })
);
// router.post(
//   "/",
//   asyncHandler(async (req, res) => {
//     // Define schema for initial validation
//     let schemaObj = {
//       user_type: Joi.string().valid("BO", "ST", "DE", "TM", "FL").required(),
//       name: Joi.string().required(),
//       email: Joi.string()
//         .email({ tlds: { allow: false } })
//         .required(),
//       country_code: Joi.number().required(),
//       phone: Joi.string().required(),
//       country: Joi.string().required(),
//     };

//     if (req.body.country) {
//       if (req.body.country.toLowerCase() === "india") {
//         schemaObj.city = Joi.string().required();
//         schemaObj.pincode = Joi.string()
//           .pattern(/^[0-9]{6}$/)
//           .required()
//           .messages({
//             "string.pattern.base": "Pincode must be exactly 6 digits",
//           });
//       }
//     }

//     // Joi schema validation
//     const schema = Joi.object(schemaObj).options({ allowUnknown: true });
//     const { error } = validator(req.body, schema);
//     if (error) {
//       return res.send(sendError(error.details[0].message, 400));
//     }

//     // if (!country) {
//     //   return res.send(sendError("Country not found", 400));
//     // }

//     // Initialize requestBody
//     const requestBody = {
//       user_type: req.body.user_type,
//       name: req.body.name,
//       email: req.body.email,
//       country_code: req.body.country_code,
//       phone: req.body.phone,
//       whatsapp_country_code: req.body.country_code,
//       whatsapp_no: req.body.phone,
//     };

//     const api_key = config.google_places_api_key;

//     const countryResponse = await axios.get(
//       `${config.google_geocode_api}?address=${req.body.country}&key=${api_key}`
//     );

//     if (
//       countryResponse.data.status !== "OK" ||
//       countryResponse.data.results.length === 0
//     ) {
//       return res.send(sendError("Invalid country name", 400));
//     }
//     const countryResult = countryResponse.data.results[0];

//     if (!countryResult.types.includes("country")) {
//       return res.send(sendError("Invalid country name", 400));
//     }
//     const countryComponents = countryResult.address_components;
//     const officialCountryFromGoogle = countryComponents.find((comp) =>
//       comp.types.includes("country")
//     )?.long_name;

//     if (!officialCountryFromGoogle) {
//       return res.send(sendError("Invalid country name", 400));
//     }

//     console.log(
//       `Official country from Google for "${req.body.country}": ${officialCountryFromGoogle}`
//     );

//     requestBody["country"] = officialCountryFromGoogle;
//     if (officialCountryFromGoogle) {
//       let officialCityFromGoogle;
//       if (officialCountryFromGoogle === "India") {
//         const api_key = config.google_places_api_key;

//         console.log("API hit 1st time - Validating city name");

//         // Step 1: Validate city name using Google Geocoding API
//         const cityResponse = await axios.get(
//           `${config.google_geocode_api}?address=${req.body.city},India&key=${api_key}`
//         );

//         if (
//           cityResponse.data.status !== "OK" ||
//           cityResponse.data.results.length === 0
//         ) {
//           return res.send(sendError("Invalid city name", 400));
//         }

//         const cityResult = cityResponse.data.results[0];
//         const cityComponents = cityResult.address_components;

//         const localityComponent = cityComponents.find(
//           (comp) =>
//             comp.types.includes("locality") && comp.types.includes("political")
//         );
//         if (localityComponent) {
//           officialCityFromGoogle = localityComponent.long_name;
//           cityType = "locality";
//         } else {
//           // Check for administrative_area_level_1
//           const level1Component = cityComponents.find((comp) =>
//             comp.types.includes("administrative_area_level_1")
//           );
//           if (level1Component) {
//             officialCityFromGoogle = level1Component.long_name;
//             cityType = "administrative_area_level_1";
//           } else {
//             // Check for administrative_area_level_2
//             const level2Component = cityComponents.find((comp) =>
//               comp.types.includes("administrative_area_level_2")
//             );
//             if (level2Component) {
//               officialCityFromGoogle = level2Component.long_name;
//               cityType = "administrative_area_level_2";
//             }
//           }
//         }
//         console.log(officialCityFromGoogle);
//         // Extract the official city name from Google's response
//         // const officialCityFromGoogle =
//         //   cityComponents.find(
//         //     (comp) =>
//         //       comp.types.includes("locality") && comp.types.includes("political")
//         //   )?.long_name ||
//         //   cityComponents.find((comp) =>
//         //     comp.types.includes("administrative_area_level_1")
//         //   )?.long_name ||
//         //   cityComponents.find((comp) =>
//         //     comp.types.includes("administrative_area_level_2")
//         //   )?.long_name;
//         if (!officialCityFromGoogle) {
//           return res.send(sendError("Invalid city name", 400));
//         }

//         console.log(
//           `Official city from Google for "${req.body.city}": ${officialCityFromGoogle}`
//         );

//         // Step 2: Check if this city exists in your database
//         let standardizedCityName = null;
//         // First try exact match
//         // const cityExists = await City.findOne({
//         //   $or: [
//         //     {
//         //       name: { $regex: new RegExp(`^${req.body.city}$`, "i") },
//         //       country_name: "India",
//         //     },
//         //     {
//         //       name: { $regex: new RegExp(`^${officialCityFromGoogle}$`, "i") },
//         //       country_name: "India",
//         //     },
//         //   ],
//         // });

//         // if (cityExists) {
//         //   standardizedCityName = cityExists.name;
//         //   console.log(`City found in database: ${standardizedCityName}`);
//         // } else {
//         //   return res.send(sendError("Invalid city name", 400));
//         // }

//         console.log("API hit 2nd time - Validating pincode");

//         // Step 3: Validate pincode using Google Geocoding API
//         const pincodeResponse = await axios.get(
//           `${config.google_geocode_api}?address=${req.body.pincode}&key=${api_key}`
//         );

//         if (
//           pincodeResponse.data.status !== "OK" ||
//           pincodeResponse.data.results.length === 0
//         ) {
//           return res.send(sendError("Invalid pincode", 400));
//         }

//         const pincodeResult = pincodeResponse.data.results[0];
//         const pincodeComponents = pincodeResult.address_components;
//         const postcodeLocalities = pincodeResult.postcode_localities || [];

//         let officialCityFromPincode = null;

//         console.log("first time checking priority");
//         if (cityType === "locality") {
//           const localityFromPincode = pincodeComponents.find(
//             (comp) =>
//               comp.types.includes("locality") &&
//               comp.types.includes("political")
//           );
//           if (localityFromPincode) {
//             officialCityFromPincode = localityFromPincode.long_name;
//           }
//         } else if (cityType === "administrative_area_level_1") {
//           const level1FromPincode = pincodeComponents.find((comp) =>
//             comp.types.includes("administrative_area_level_1")
//           );
//           if (level1FromPincode) {
//             officialCityFromPincode = level1FromPincode.long_name;
//           }
//         } else if (cityType === "administrative_area_level_2") {
//           const level2FromPincode = pincodeComponents.find((comp) =>
//             comp.types.includes("administrative_area_level_2")
//           );
//           if (level2FromPincode) {
//             officialCityFromPincode = level2FromPincode.long_name;
//           }
//         }

//         if (!officialCityFromPincode) {
//           console.log("second time checking priority");
//           officialCityFromPincode =
//             pincodeComponents.find(
//               (comp) =>
//                 comp.types.includes("locality") &&
//                 comp.types.includes("political")
//             )?.long_name ||
//             pincodeComponents.find((comp) =>
//               comp.types.includes("administrative_area_level_1")
//             )?.long_name ||
//             pincodeComponents.find((comp) =>
//               comp.types.includes("administrative_area_level_2")
//             )?.long_name;
//         }
//         // Extract the city from pincode
//         // const officialCityFromPincode =
//         //   pincodeComponents.find(
//         //     (comp) =>
//         //       comp.types.includes("locality") && comp.types.includes("political")
//         //   )?.long_name ||
//         //   pincodeComponents.find((comp) =>
//         //     comp.types.includes("administrative_area_level_1")
//         //   )?.long_name;
//         // pincodeComponents.find((comp) =>
//         //   comp.types.includes("administrative_area_level_2")
//         // )?.long_name;

//         if (!officialCityFromPincode) {
//           return res.send(sendError("Invalid pincode", 400));
//         }

//         console.log(
//           `Official city for pincode ${req.body.pincode}: ${officialCityFromPincode}`
//         );

//         // Step 4: Match city from step 1 with city from pincode
//         let cityPincodeMatch = false;

//         // Direct city match
//         if (
//           officialCityFromGoogle.toLowerCase() ===
//           officialCityFromPincode.toLowerCase()
//         ) {
//           cityPincodeMatch = true;
//         }

//         if (!cityPincodeMatch) {
//           return res.send(sendError(`Invalid pincode`, 400));
//         }

//         console.log(`City-Pincode validation successful.`);

//         // Step 5: Success - Add validated data to request body
//         requestBody["city"] = standardizedCityName;
//         requestBody["pincode"] = req.body.pincode;

//         console.log("City-Pincode validation completed successfully");
//       }
//     }

//     // Check if the user already exists by email or phone number
//     const userExist = await User.findOne({
//       $or: [
//         { email: req.body.email },
//         {
//           $and: [
//             { country_code: req.body.country_code },
//             { phone: req.body.phone },
//           ],
//         },
//       ],
//     });
//     if (userExist) {
//       return res.send(sendError("User already exists", 400));
//     }

//     // Generate a unique token for the user
//     const tokenExpiryTimestamp = Date.now() + 15 * 60 * 1000;
//     const { token, tokenExpiry } = await generatePersonalUserUniqueToken(
//       req.body.email,
//       tokenExpiryTimestamp
//     );

//     // Add dashboard token and token expiry to requestBody
//     requestBody["dashboard_token"] = token;
//     requestBody["token_expiry"] = tokenExpiry;

//     // Create the user and send the response
//     const userData = await User.create(requestBody);
//     const plainData = userData.toJSON();

//     await proAccessEntries.create({
//       user: userData._id,
//       user_type: userData.user_type,
//       status: "registered",
//     });

//     plainData["dashboard_url"] =
//       config.react_app_url + `/dashboard?token=${token}`;

//     res.send(
//       sendResponse(
//         _.omit(plainData, [
//           "password",
//           "whatsapp_country_code",
//           "whatsapp_no",
//           "state",
//           "status",
//           "token_expiry",
//           "dashboard_token",
//           "updatedAt",
//         ])
//       )
//     );
//   })
// );

router.get(
  "/by-phone",
  asyncHandler(async (req, res) => {
    const rules = Joi.object({
      country_code: Joi.string().required(),
      phone: Joi.string().required(),
    }).options({});

    const { error } = validator(
      {
        country_code: req.query.country_code,
        phone: req.query.phone,
      },
      rules
    );
    if (error) {
      res.send(sendError(error.details[0].message, 400));
      return;
    }

    const country_code = req.query.country_code;
    const phone = req.query.phone;
    let data = await User.findOne({
      $or: [
        {
          $and: [{ country_code: country_code }, { phone: phone }],
        },
        {
          $and: [
            { whatsapp_country_code: country_code },
            { whatsapp_no: phone },
          ],
        },
      ],
    }).select(
      " name country_code phone whatsapp_country_code whatsapp_no user_type"
    );

    if (!data) {
      res.send(sendError("User Not Found", 404));

      return;
    }

    const proEntry = await proAccessEntries.findOne({
      user: data._id,
      user_type: data.user_type,
    });

    data = data.toJSON();
    data.isProFormFilled = false;
    if (proEntry) {
      if (proEntry.status === "completed") {
        data.isProFormFilled = true;
      }
    }

    res.send(sendResponse(data));
  })
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const rules = Joi.object({
      country_code: Joi.string().required(),
      phone: Joi.string().required(),
    }).options({});

    const { error } = validator(
      {
        country_code: req.query.country_code,
        phone: req.query.phone,
      },
      rules
    );
    if (error) {
      res.send(sendError(error.details[0].message, 400));
      return;
    }

    const country_code = req.query.country_code;
    const phone = req.query.phone;
    let data = await User.findOne({
      $or: [
        {
          $and: [{ country_code: country_code }, { phone: phone }],
        },
        {
          $and: [
            { whatsapp_country_code: country_code },
            { whatsapp_no: phone },
          ],
        },
      ],
    }).select(
      " name country_code phone whatsapp_country_code whatsapp_no user_type"
    );

    if (!data) {
      res.send(sendError("User Not Found", 404));

      return;
    }

    const proEntry = await proAccessEntries.deleteMany({
      user: data._id,
    });

    await data.deleteOne();

    res.send(sendResponse(data, "User Deleted Successfully"));
  })
);

//user chats validation webhook
router.post(
  "/user-chats-webhook",
  uploadSingle,
  asyncHandler(async (req, res) => {
    if (typeof req.body.chats === "string") {
      req.body.chats = JSON.parse(req.body.chats);
    }
    const userChatsWebhookSchema = Joi.object({
      phone: Joi.string().required(),
      country_code: Joi.string().pattern(/^\d+$/).required(),
      datetime: Joi.string().isoDate().required(),
      chats: Joi.array()
        // .items(
        //   Joi.object({
        //     sender: Joi.string().required(),
        //     text: Joi.string().required(),
        //   })
        // )
        .min(1)
        .required(),
    });
    console.log(req.body);
    const { error, value } = userChatsWebhookSchema.validate(req.body);
    if (error) {
      const validationErrors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/^"(.*)"/, "$1"),
      }));
      return res.status(400).send(sendError(validationErrors, 400));
    }
    const user = await User.findOne({
      country_code: req.body.country_code,
      phone: req.body.phone,
    });
    if (!user) {
      return res.send(sendError("No User Found", 400));
    }

    const data = {
      userId: user._id,
      datetime: req.body.datetime,
      chats: req.body.chats,
    };

    const newChat = await Chats.create(data);
    //hit SCRAP_CONTENT API here
    try {
      const formData = new FormData();
      formData.append("session_id", newChat._id.toString());
      formData.append("messages", JSON.stringify(data.chats));
      formData.append(
        "attributes_file",
        fs.createReadStream("public/target_attributes.json")
      );
      // const chatSummarizationData = {
      //   session_id: newChat._id.toString(),
      //   messages: data.chats,
      // };
      const response = await axios.post(
        config.scrap_content_api + "chat_summarization/",
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      return res.send(sendResponse(newChat, "Data processed successfully"));
    } catch (err) {
      // console.log(err.message);
      return res.send(
        sendError("Error Accessing the chat summarization API", 400)
      );
    }
  })
);

router.post(
  "/feedback",
  asyncHandler(async (req, res) => {
    const feedbackTopics = await FeedbackTopics.findOne();
    const schema = Joi.object({
      name: Joi.string().trim().required().label("name"),
      whatsapp_number: Joi.string()
        .pattern(/^[0-9]*$/)
        .required()
        .label("whatsapp_number")
        .messages({
          "string.pattern.base": "Whatsapp number should contain only digits",
        }),
      whatsapp_country_code: Joi.string()
        .pattern(/^\+?\d{1,4}$/)
        .required()
        .label("whatsapp_country_code")
        .messages({
          "string.pattern.base": "Invalid WhatsApp country code",
        }),
      email: Joi.string().email().optional().allow("").label("email"),
      feedback_topic: Joi.string()
        .valid(...feedbackTopics.topics)
        .required()
        .label("feedback_topic"),
      feedback_message: Joi.string().required().label("feedback_message"),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      const validationErrors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/^"(.*)"/, "$1"),
      }));
      return res.status(400).send(sendError(validationErrors, 400));
    }

    req.body["user_type"] = "personal";
    req.body["source"] = "bot";
    const newFeedback = await Feedback.create(req.body);
    const feedbackObj = newFeedback.toObject();
    delete feedbackObj._id;
    return res.send(
      sendResponse(feedbackObj, "Feedback Submitted Successfully")
    );
  })
);

module.exports = router;
