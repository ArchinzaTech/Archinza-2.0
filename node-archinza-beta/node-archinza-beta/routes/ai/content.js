const express = require("express");
const router = express.Router();
const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const BusinessAccount = require("../../models/businessAccount");
const BusinessAccountOptions = require("../../models/businessAccountOptions");
const BusinessUserPlan = require("../../models/businessUserPlan");
const Media = require("../../models/media");
const { default: mongoose } = require("mongoose");
const { sendError, sendResponse } = require("../../helpers/api");
// const Fuse = require("fuse.js");
const City = require("../../models/city");
const Country = require("../../models/country");
const Fuse = require("fuse.js");
const Chat = require("../../models/chat");

const fuseOptions = {
  includeScore: true,
  threshold: 0.6,

  // ignoreLocation: true,
};

function findClosestMatch(userInput, fuseInstance, threshold = 0.3) {
  return userInput.map((input) => {
    const trimmedInput = input.trim();
    const result = fuseInstance.search(trimmedInput);
    if (result.length > 0 && result[0].score <= threshold) {
      return result[0].item; // Return the closest match within threshold
    } else {
      return null;
    }
  });
}

//webhook API for media scrapping
router.post(
  "/data-validation-webhook",
  asyncHandler(async (req, res) => {
    const webhookSchema = Joi.object({
      user_id: Joi.string().required().messages({
        "string.empty": "User ID is required",
        "any.required": "User ID is required",
      }),
      addresses: Joi.array().optional(),
      google_location: Joi.object().optional(),
      // .messages({
      //   "object.base": "'google_location' must be an object",
      //   "any.required": "'google_location' is required",
      // }),
      about: Joi.string().optional(),
      keywords: Joi.array().optional(),
      city: Joi.string().allow(""),
      country: Joi.string().allow(""),
      pincode: Joi.string().allow(""),
      images: Joi.array()
        .items(
          Joi.object({
            filename: Joi.alternatives()
              .try(
                Joi.string().required().messages({
                  "string.empty": "'filename' is required",
                  "any.required": "'filename' is required",
                }),
                Joi.string().valid("NA").required().messages({
                  "any.only": "'filename' is required",
                  "any.required": "'filename' is required",
                })
              )
              .required()
              .messages({
                "any.required": "'filename' is required",
              }),
            category: Joi.alternatives()
              .try(
                Joi.string().required().messages({
                  "string.empty": "images 'category' is required",
                  "any.required": "images 'category' is required",
                }),
                Joi.string().valid("NA").required().messages({
                  "any.only": "image 'category' is required",
                  "any.required": "image 'category' is required",
                })
              )
              .required()
              .messages({
                "any.required": "image 'category' is required",
              }),
            height: Joi.alternatives()
              .try(Joi.number(), Joi.string().valid("NA"))
              .optional()
              .messages({
                "number.base": "image 'height' must be a number",
                "any.only": "image 'height' must be a number or 'NA'",
              }),

            width: Joi.alternatives()
              .try(Joi.number(), Joi.string().valid("NA"))
              .optional()
              .messages({
                "number.base": "image 'width' must be a number",
                "any.only": "image 'width' must be a number or 'NA'",
              }),
            source: Joi.string().optional(),
            pdf_name: Joi.string().optional(),
          }).messages({
            "object.base": "Image details are required",
          })
        )
        .required()
        .messages({
          "array.base": "'images' are required",
          "any.required": "'images' are required",
        }),
      logo_url_instagram: Joi.string().allow(""),
      logo_url_linkedin: Joi.string().allow(""),
      debug: Joi.string().allow(""),
      gpt: Joi.string().allow(""),
      detailed_keywords: Joi.array().optional(),
    });

    // Validation
    const { error, value } = webhookSchema.validate(req.body);
    if (error) {
      const validationErrors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/^"(.*)"/, "$1"),
      }));
      return res.status(400).send(sendError(validationErrors, 400));
    }

    // User Check
    if (!mongoose.Types.ObjectId.isValid(value.user_id)) {
      return res
        .status(400)
        .send(
          sendError([{ field: "user_id", message: "User not found" }], 400)
        );
    }

    const user = await BusinessAccount.findOne({
      _id: mongoose.Types.ObjectId(value.user_id),
    });
    if (!user) {
      return res
        .status(400)
        .send(
          sendError([{ field: "user_id", message: "User not found" }], 400)
        );
    }

    const subscriptionPlan = await BusinessUserPlan.findOne({
      businessAccount: value.user_id,
      isActive: true,
    }).populate("plan");

    // Media Handling
    if (value.images?.length > 0) {
      const validCategories = [
        "project_renders_media",
        "completed_products_media",
        "sites_inprogress_media",
      ];
      const validImages = value.images.filter(
        (image) =>
          image.filename !== "NA" &&
          image.category !== "NA" &&
          validCategories.includes(image.category)
      );
      const imagesLimit = subscriptionPlan?.plan?.features?.imagesLimit || 0;
      const unusedImagesLimit =
        subscriptionPlan?.plan?.features?.unusedImagesLimit || 0;

      const allMedia = await Media.find({
        userId: value.user_id,
        category: { $in: validCategories },
        $or: [{ isUnused: false }, { isUnused: { $exists: false } }],
      });
      const currentMediaCount = allMedia.length;
      const remainingQuota = Math.max(0, imagesLimit - currentMediaCount);

      const mediaPromises = [];
      let imagesToSave = [];

      imagesToSave = validImages.slice(0, remainingQuota).map((image) => ({
        ...image,
        isUnused: false,
      }));

      const remainingImages = validImages.slice(remainingQuota);
      if (remainingImages.length > 0) {
        const unusedToSave =
          unusedImagesLimit === 0
            ? remainingImages
            : remainingImages.slice(0, unusedImagesLimit);
        imagesToSave.push(
          ...unusedToSave.map((image) => ({
            ...image,
            isUnused: true,
          }))
        );
      }

      const pinnedCountByCategory = {};

      imagesToSave.forEach((image, index) => {
        const category = image.category;
        pinnedCountByCategory[category] = pinnedCountByCategory[category] || 0;

        const shouldPin = pinnedCountByCategory[category] < 5;
        if (shouldPin) pinnedCountByCategory[category]++;
        const newMedia = new Media({
          name: image.filename,
          url: image.filename,
          userId: value.user_id,
          category: image.category,
          height: image.height,
          width: image.width,
          source: image.source,
          pdf_name: image.pdf_name,
          isUnused: image.isUnused,
          pinned: shouldPin,
        });
        mediaPromises.push(
          newMedia.save().then(() => ({
            mediaId: newMedia._id,
            category: image.category,
            isUnused: image.isUnused,
            pinned: shouldPin,
          }))
        );
      });
      await Promise.all(mediaPromises);
    }
    await BusinessAccount.findByIdAndUpdate(req.body.user_id, {
      last_updated_scraped_content: new Date(),
    });
    return res.send(
      sendResponse(
        {
          ...req.body,
        },
        "Data processed successfully"
      )
    );
  })
);

//webhook API for textual data only scrapping
router.post(
  "/textual-data-webhook",
  asyncHandler(async (req, res) => {
    const webhookSchema = Joi.object({
      user_id: Joi.string().required().messages({
        "string.empty": "User ID is required",
        "any.required": "User ID is required",
      }),
      addresses: Joi.alternatives()
        .try(
          Joi.array()
            .items(
              Joi.alternatives().try(
                Joi.object({
                  address: Joi.alternatives()
                    .try(
                      Joi.string().required().messages({
                        "string.empty": "'address' is required",
                        "any.required": "'address' is required",
                      }),
                      Joi.string().valid("NA").required().messages({
                        "any.only": "'address' is required",
                        "any.required": "'address' is required",
                      })
                    )
                    .required()
                    .messages({
                      "any.required": "'address' is required",
                    }),
                  type: Joi.alternatives()
                    .try(
                      Joi.string().required().messages({
                        "string.empty": "address 'type' is required",
                        "any.required": "address 'type' is required",
                      }),
                      Joi.string().valid("NA").required().messages({
                        "any.only": "address 'type' is required",
                        "any.required": "address 'type' is required",
                      })
                    )
                    .required()
                    .messages({
                      "any.required": "address 'type' is required",
                    }),
                }).messages({
                  "object.base": "address details are required",
                }),
                Joi.any() // Allow stray items (like strings) to pass validation
              )
            )
            .required()
            .messages({
              "array.base": "'addresses' are required",
              "any.required": "'addresses' are required",
            }),
          Joi.string().valid("NA").required().messages({
            "any.only": "'addresses' are required",
            "any.required": "'addresses' are required",
          })
        )
        .required()
        .messages({
          "any.required": "'addresses' are required",
        }),
      google_location: Joi.object({
        latitude: Joi.any()
          // .try(
          //   Joi.number().required().messages({
          //     "number.base": "'latitude' must be a number",
          //     "any.required": "'latitude' is required",
          //   }),
          //   Joi.string().valid("NA").required().messages({
          //     "any.only": "'latitude' can only be 'NA' if not a number",
          //     "any.required": "'latitude' is required",
          //   })
          // )
          .required()
          .messages({
            "any.required": "'latitude' is required",
          }),
        longitude: Joi.any()
          // .try(
          //   Joi.number().required().messages({
          //     "number.base": "'longitude' must be a number",
          //     "any.required": "'longitude' is required",
          //   }),
          //   Joi.string().valid("NA").required().messages({
          //     "any.only": "'longitude' can only be 'NA' if not a number",
          //     "any.required": "'longitude' is required",
          //   })
          // )
          .required()
          .messages({
            "any.required": "'longitude' is required",
          }),
      }).optional(),
      // .messages({
      //   "object.base": "'google_location' must be an object",
      //   "any.required": "'google_location' is required",
      // }),
      about: Joi.string().required().messages({
        "string.empty": "'about' is required",
        "any.required": "'about' is required",
      }),
      keywords: Joi.alternatives()
        .try(
          Joi.array().items(Joi.string().allow("")).required().messages({
            "array.base": "'keywords' are required",
            "any.required": "'keywords' are required",
          }),
          Joi.string().valid("NA").required().messages({
            "any.only": "'keywords' are required",
            "any.required": "'keywords' are required",
          })
        )
        .required()
        .messages({
          "any.required": "'keywords' are required",
        }),
      city: Joi.string().allow("", null),
      country: Joi.string().allow("", null),
      pincode: Joi.string().allow("", null),
      images: Joi.array().optional(),
      // logo_url_instagram: Joi.string().allow(""),
      // logo_url_linkedin: Joi.string().allow(""),
      debug: Joi.string().allow(""),
      gpt: Joi.string().allow(""),
      detailed_keywords: Joi.alternatives()
        .try(
          Joi.array().items(Joi.string().allow("")).required().messages({
            "array.base": "'detailed_keywords' are required",
            "any.required": "'detailed_keywords' are required",
          }),
          Joi.string().valid("NA").required().messages({
            "any.only": "'detailed_keywords' are required",
            "any.required": "'detailed_keywords' are required",
          })
        )
        .required()
        .messages({
          "any.required": "'detailed_keywords' are required",
        }),
    });

    // Validation
    const { error, value } = webhookSchema.validate(req.body);
    if (error) {
      const validationErrors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/^"(.*)"/, "$1"),
      }));
      return res.status(400).send(sendError(validationErrors, 400));
    }

    // User Check
    if (!mongoose.Types.ObjectId.isValid(value.user_id)) {
      return res
        .status(400)
        .send(
          sendError([{ field: "user_id", message: "User not found" }], 400)
        );
    }

    const user = await BusinessAccount.findOne({
      _id: mongoose.Types.ObjectId(value.user_id),
    });
    if (!user) {
      return res
        .status(400)
        .send(
          sendError([{ field: "user_id", message: "User not found" }], 400)
        );
    }

    let validatedCityName = null;
    let validatedCountryName = null;

    // if (req.body.country === "NA" && req.body.city !== "NA") {
    //   return res.status(400).send(
    //     sendError(
    //       [
    //         {
    //           field: "country",
    //           message: "'country' is required",
    //         },
    //       ],
    //       400
    //     )
    //   );
    // }

    // if (
    //   req.body.country &&
    //   req.body.country !== "NA" &&
    //   req.body.city &&
    //   req.body.city === "NA"
    // ) {
    //   const countries = await Country.find().then((res) =>
    //     res.map((country) => country.name)
    //   );
    //   const countryFuse = new Fuse(countries, fuseOptions);
    //   const userInputCountry = req.body.country;
    //   const userInputCountryArray = userInputCountry.split(",");
    //   const matchedFields = findClosestMatch(
    //     userInputCountryArray,
    //     countryFuse,
    //     fuseOptions.threshold
    //   );

    //   if (matchedFields[0] === null) {
    //     return res
    //       .status(400)
    //       .send(
    //         sendError(
    //           [{ field: "country", message: "Invalid country name" }],
    //           400
    //         )
    //       );
    //   }
    //   validatedCountryName = matchedFields[0];
    //   const cities = await City.find({ country_name: matchedFields[0] }).then(
    //     (res) => res.map((city) => city.name)
    //   );
    //   const cityFuse = new Fuse(cities, fuseOptions);
    //   const userInputCity = req.body.city;
    //   const userInputCityArray = userInputCity.split(",");
    //   const matchedCityFields = findClosestMatch(
    //     userInputCityArray,
    //     cityFuse,
    //     fuseOptions.threshold
    //   );

    //   if (matchedCityFields[0] === null) {
    //     return res
    //       .status(400)
    //       .send(
    //         sendError([{ field: "city", message: "Invalid city name" }], 400)
    //       );
    //   }
    //   validatedCityName = matchedCityFields[0];
    // }

    const updateData = {
      bio: value.about && value.about !== "NA" ? value.about : user.bio,
      addresses: Array.isArray(value.addresses)
        ? value.addresses
            .filter((addr) => addr.address !== "NA" && addr.type !== "NA") // Ignore "NA" addresses
            .map((addr) => ({
              ...addr,
              type: addr.type, // No validation against allowedAddressTypes
            }))
        : user.addresses,
      google_location:
        value.google_location &&
        value.google_location.latitude !== "NA" &&
        value.google_location.longitude !== "NA"
          ? value.google_location
          : user.google_location,
      keywords:
        value.keywords && value.keywords !== "NA"
          ? value.keywords.filter((keyword) => keyword !== "NA") // Ignore "NA" keywords
          : user.keywords,
      services:
        value.detailed_keywords && value.detailed_keywords !== "NA"
          ? value.detailed_keywords.filter((keyword) => keyword !== "NA") // Ignore "NA" keywords
          : user.detailed_keywords,
      scraped_city:
        value.city !== "NA" && value.city !== null ? value.city : "",
      scraped_country:
        value.country !== "NA" && value.country !== null ? value.country : "",
      scraped_pincode:
        value.pincode !== "NA" && value.pincode !== null ? value.pincode : "",
    };

    if (user.services.length > 0) {
      delete updateData.services;
    }
    updateData.is_services_manually = true;
    const updatedUser = await BusinessAccount.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true }
    );

    return res.send(
      sendResponse(
        {
          ...req.body,
        },
        "Data processed successfully"
      )
    );
  })
);

//webhook API for chat summarization
router.post(
  "/chat-summarization-webhook",
  asyncHandler(async (req, res) => {
    const chatsIntentWebhookSchema = Joi.object({
      chatSessionId: Joi.string().required(),
      intent: Joi.string().required(),
    });

    const { error, value } = chatsIntentWebhookSchema.validate(req.body);
    if (error) {
      const validationErrors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/^"(.*)"/, "$1"),
      }));
      return res.status(400).send(sendError(validationErrors, 400));
    }

    const chat = await Chat.findOne({
      _id: req.body.chatSessionId,
    });

    if (!chat) {
      return res.status(400).send(
        sendError(
          [
            {
              field: "userId",
              message: "Chat with the given chatSessionId not found",
            },
          ],
          400
        )
      );
    }
    await chat.updateOne({ intent: req.body.intent });
    return res.send(sendResponse(chat, "Data processed successfully"));
  })
);

module.exports = router;
