const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/config");
const { sendResponse } = require("../helpers/api");
const axios = require("axios");

const sessionTokens = new Map();

router.post(
  "/places/session-token",
  asyncHandler(async (req, res) => {
    const sessionToken = uuidv4();
    const timestamp = Date.now();

    sessionTokens.set(sessionToken, {
      createdAt: timestamp,
      //   expiresAt: timestamp + 60 * 60 * 1000, // 30 minutes
    });

    cleanExpiredTokens();

    return res.send(sendResponse({ sessionToken }));
  })
);

router.post(
  "/places/autocomplete",
  asyncHandler(async (req, res) => {
    const { input, sessionToken, includedPrimaryTypes } = req.body;

    if (!input || !sessionToken) {
      return res.send(
        sendResponse([], "Input and sessionToken are required", 400)
      );
    }

    // Validate session token
    const tokenData = sessionTokens.get(sessionToken);
    console.log(tokenData);
    // console.log(Date.now() > tokenData.expiresAt);
    if (!tokenData) {
      return res.send(
        sendResponse(null, "Invalid or expired session token", 401)
      );
    }

    try {
      const response = await axios.post(
        config.google_autocomplete,
        {
          input,
          sessionToken,
          includedPrimaryTypes: includedPrimaryTypes || ["establishment"],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": config.google_places_api_key,
            "X-Goog-FieldMask":
              "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat.mainText,suggestions.placePrediction.structuredFormat.secondaryText",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;

        let formattedSuggestions =
          data.suggestions?.map((suggestion, index) => ({
            id: index + 1,
            placeId: suggestion.placePrediction.placeId,
            title: suggestion.placePrediction.structuredFormat.mainText.text,
            address:
              suggestion.placePrediction.structuredFormat.secondaryText.text,
          })) || [];

        // Sort suggestions by country (India first)
        formattedSuggestions = formattedSuggestions.sort((a, b) => {
          const aHasIndia = a.address.toLowerCase().includes("india");
          const bHasIndia = b.address.toLowerCase().includes("india");

          if (aHasIndia && !bHasIndia) return -1;
          if (!aHasIndia && bHasIndia) return 1;
          return 0;
        });

        return res.send(sendResponse({ suggestions: formattedSuggestions }));
      } else {
        console.error(
          "Google Places Autocomplete API error:",
          response.statusText,
          errorData
        );
        return res.send(
          sendResponse(null, "Failed to fetch autocomplete suggestions", 401)
        );
      }
    } catch (error) {
      console.error("Error calling Google Places Autocomplete API:", error);
      return res
        .status(500)
        .send(sendResponse(null, "Internal server error", 500));
    }
  })
);

router.get(
  "/places/details/:placeId",
  asyncHandler(async (req, res) => {
    const { placeId } = req.params;
    const { sessionToken } = req.query;

    if (!placeId || !sessionToken) {
      return res.send(
        sendResponse(null, "PlaceId and sessionToken are required", 401)
      );
    }

    // Validate session token
    const tokenData = sessionTokens.get(sessionToken);

    if (!tokenData || Date.now() > tokenData.expiresAt) {
      return res.send(
        sendResponse(null, "Invalid or expired session token", 401)
      );
    }

    try {
      const response = await axios.get(
        `${config.google_place_details}/${placeId}`,
        {
          headers: {
            "X-Goog-Api-Key": config.google_places_api_key,
            "X-Goog-FieldMask": "location,displayName,formattedAddress",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;

        // Remove session token after successful place details call (as per Google's billing model)
        sessionTokens.delete(sessionToken);

        const locationData = {
          location: {
            latitude: data.location?.latitude,
            longitude: data.location?.longitude,
          },
          displayName: data.displayName?.text,
          formattedAddress: data.formattedAddress,
        };

        return res.send(sendResponse(locationData));
      } else {
        const errorData = await response.text();
        console.error(
          "Google Place Details API error:",
          response.statusText,
          errorData
        );
        return res.send(
          sendResponse(null, "Failed to fetch place details", 401)
        );
      }
    } catch (error) {
      console.error("Error calling Google Place Details API:", error);
      return res
        .status(500)
        .send(sendResponse(null, "Internal server error", 500));
    }
  })
);

router.get(
  "/places/geocode",
  asyncHandler(async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.send(
        sendResponse(null, "Latitude and longitude are required", 400)
      );
    }

    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            latlng: `${lat},${lng}`,
            key: config.google_places_api_key,
          },
        }
      );

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const result = response.data.results[0];

        const geocodeData = {
          formatted_address: result.formatted_address,
          place_id: result.place_id,
          location: {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
          },
        };

        return res.send(sendResponse(geocodeData));
      } else {
        return res.send(
          sendResponse([], "No address found for the provided coordinates")
        );
      }
    } catch (error) {
      console.error("Error calling Google Geocoding API:", error);
      return res
        .status(500)
        .send(sendResponse(null, "Internal server error", 500));
    }
  })
);

// Helper function to clean expired tokens
function cleanExpiredTokens() {
  const now = Date.now();
  for (const [token, data] of sessionTokens.entries()) {
    if (now > data.expiresAt) {
      sessionTokens.delete(token);
    }
  }
}

// Clean expired tokens every 10 minutes
// setInterval(cleanExpiredTokens, 10 * 60 * 1000);

module.exports = router;
