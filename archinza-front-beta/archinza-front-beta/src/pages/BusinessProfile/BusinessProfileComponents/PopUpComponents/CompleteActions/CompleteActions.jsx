import React, { useCallback, useEffect, useRef, useState } from "react";
import "./completeActions.scss";
import Modal from "react-bootstrap/Modal";
import {
  chakMarkWhite,
  modalClose,
  searchIconConnect,
  submitIconConnect,
  uploadIcon,
} from "../../../../../images";
import style from "../../../../../../src/pages/FormFiveLightTheme/Form/formfivelighttheme.module.scss";
import { useBusinessContext } from "../../../../../context/BusinessAccount/BusinessAccountState";
import { TextField } from "@mui/material";
import { useWindowSize } from "react-use";
import Joi from "joi";
import http from "../../../../../helpers/http";
import config from "../../../../../config/config";
import { toast } from "react-toastify";
import ToastMsg from "../../../../../components/ToastMsg/ToastMsg";
import BusinessProfileFileUpload from "../../../../../components/BusinessProfileFileUpload/BusinessProfileFileUpload";

const CompleteActions = ({ show, onHide, emptyFields = [], data }) => {
  const BusinessContext = useBusinessContext();
  const [selectedLocation, setSelectedLocation] = useState(
    "My Current Location"
  );
  const textareaRef = useRef(null);
  const [text, setText] = useState(data?.bio || "");
  const [localEmptyFields, setLocalEmptyFields] = useState([]);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [uploadedMediaByType, setUploadedMediaByType] = useState({});
  const [latitude, setLatitude] = useState(
    data?.google_location?.latitude || ""
  );
  const [longitude, setLongitude] = useState(
    data?.google_location?.longitude || ""
  );
  const [formError, setFormError] = useState({});
  const maxWords = 150;
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [lastSearchedQuery, setLastSearchedQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isCurrentLocationSelected, setIsCurrentLocationSelected] =
    useState(false);
  const inputRef = useRef(null);
  const { width } = useWindowSize();
  const base_url = config.api_url;

  // Sample location data
  const locations = [
    {
      title: "My Current Location",
      address:
        "1103, Marathon Icon, Ganapatrao Kadam Marg, Lower Parel West, Lower Parel, Mumbai, Maharashtra 400013",
      latitude: "40.7128",
      longitude: "-74.0060",
    },
    {
      title: "Central Mall",
      address: "456 Shopping District, Mall Road",
      latitude: "40.730610",
      longitude: "-73.935242",
    },
    {
      title: "Business Park",
      address:
        "1103, Marathon Icon, Ganapatrao Kadam Marg, Lower Parel West, Lower Parel, Mumbai, Maharashtra 400013",
      latitude: "40.650002",
      longitude: "-73.949997",
    },
    {
      title: "City Hospital",
      address: "321 Medical Center, Health District",
      latitude: "40.678178",
      longitude: "-73.944158",
    },
    {
      title: "University Campus",
      address:
        "1103, Marathon Icon, Ganapatrao Kadam Marg, Lower Parel West, Lower Parel, Mumbai, Maharashtra 400013",
      latitude: "40.758896",
      longitude: "-73.985130",
    },
    {
      title: "Sports Complex",
      address: "987 Stadium Road, Sports City",
      latitude: "40.829643",
      longitude: "-73.926175",
    },
  ];

  const generateSessionToken = async () => {
    try {
      const response = await http.post(
        `${base_url}/google-api/places/session-token`
      );

      if (response?.data) {
        setSessionToken(response?.data.sessionToken);
        return response?.data.sessionToken;
      } else {
        console.error("Failed to generate session token");
        return null;
      }
    } catch (error) {
      console.error("Error generating session token:", error);
      return null;
    }
  };

  const fetchCurrentLocation = async (lat, lng) => {
    try {
      setIsLoading(true);
      const response = await http.get(
        `${base_url}/google-api/places/geocode?lat=${lat}&lng=${lng}`
      );

      if (response?.data) {
        const data = response.data;
        const locationData = {
          id: 0, // Special ID for current location
          placeId: data.place_id,
          title: "Current Location",
          address: data.formatted_address,
          location: data.location,
        };

        setCurrentLocation(locationData);
        setSelectedId(0);
        setSelectedPlace(locationData);
        setIsCurrentLocationSelected(true);
      } else {
        console.error("Geocoding API error:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching current location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const performAutocompleteSearch = useCallback(
    async (query, token) => {
      if (!query.trim() || !token) return;
      setIsLoading(true);
      try {
        const response = await http.post(
          `${base_url}/google-api/places/autocomplete`,
          {
            input: query,
            sessionToken: token,
            includedPrimaryTypes: ["establishment"],
          }
        );

        if (response?.data) {
          const data = response.data;
          setSuggestions(data.suggestions || []);
        } else {
          setSuggestions([]);
          if (response.status === 401) {
            const newToken = await generateSessionToken();
            if (newToken) {
              performAutocompleteSearch(query, newToken);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [base_url]
  );

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);

      // Clear previous timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      if (!isCurrentLocationSelected) {
        setSelectedId(null);
        setSelectedPlace(null);
      }

      // Set new timer for debounced search
      const newTimer = setTimeout(() => {
        const trimmedQuery = query.trim();
        if (
          trimmedQuery &&
          trimmedQuery.length >= 2 &&
          trimmedQuery !== lastSearchedQuery &&
          sessionToken
        ) {
          setLastSearchedQuery(trimmedQuery);
          performAutocompleteSearch(trimmedQuery, sessionToken);
        } else if (!trimmedQuery) {
          setSuggestions([]);
        }
      }, 700);

      setDebounceTimer(newTimer);
    },
    [
      debounceTimer,
      sessionToken,
      performAutocompleteSearch,
      lastSearchedQuery,
      isCurrentLocationSelected,
    ]
  );

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      performAutocompleteSearch(searchQuery, sessionToken);
    }
  };

  const handleLocationToggle = useCallback(
    (id) => {
      const newSelectedId = selectedId === id ? null : id;
      setSelectedId(newSelectedId);

      if (newSelectedId === 0) {
        setSelectedPlace(currentLocation);
        setIsCurrentLocationSelected(true);
        // Update latitude and longitude for current location
        setLatitude(currentLocation.location.latitude);
        setLongitude(currentLocation.location.longitude);
      } else if (newSelectedId) {
        const selected = suggestions.find((item) => item.id === newSelectedId);
        setSelectedPlace(selected);
        setIsCurrentLocationSelected(false);
        // Don't set lat/lng here - wait for place details API call
      } else {
        if (currentLocation) {
          setSelectedId(0);
          setSelectedPlace(currentLocation);
          setIsCurrentLocationSelected(true);
          setLatitude(currentLocation.location.latitude);
          setLongitude(currentLocation.location.longitude);
        } else {
          setSelectedPlace(null);
          setIsCurrentLocationSelected(false);
          setLatitude("");
          setLongitude("");
        }
      }

      // Maintain focus on input after selection
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    },
    [selectedId, suggestions, currentLocation]
  );

  const handleToggle = (title, lat, lon) => {
    setSelectedLocation(title);
    setLatitude(lat);
    setLongitude(lon);
  };

  useEffect(() => {
    const initializeLocationData = async () => {
      await generateSessionToken();

      // Check if we have existing location data
      if (
        show &&
        emptyFields.includes("google_location") &&
        data?.google_location?.latitude &&
        data?.google_location?.longitude &&
        data.google_location.latitude !== "NA" &&
        data.google_location.longitude !== "NA" &&
        data.google_location.latitude !== "" &&
        data.google_location.longitude !== ""
      ) {
        await fetchCurrentLocation(
          data.google_location.latitude,
          data.google_location.longitude
        );
      } else {
        // Clear location states if no valid data
        setCurrentLocation(null);
        setSelectedId(null);
        setSelectedPlace(null);
        setIsCurrentLocationSelected(false);
      }
    };

    if (show && emptyFields.length > 0) {
      initializeLocationData();
      // Reset search states
      setSearchQuery("");
      setSuggestions([]);
      setLastSearchedQuery("");
    }
  }, [show, data, emptyFields]);

  // Mapping for file upload fields to their display titles
  const fileUploadFields = {
    project_renders_media: "Project Photos & Renders",
    completed_products_media: "Products | Materials",
    sites_inprogress_media: "Sites In Progress",
  };

  // Joi schema for validation
  const schema = Joi.object({
    bio: Joi.string().allow("").optional(),
    google_location: Joi.object({
      latitude: Joi.string()
        .pattern(/^-?\d*\.?\d+$/)
        .allow("")
        .optional()
        .messages({
          "string.pattern.base": "Latitude must be valid",
        }),
      longitude: Joi.string()
        .pattern(/^-?\d*\.?\d+$/)
        .allow("")
        .optional()
        .messages({
          "string.pattern.base": "Longitude must be valid",
        }),
    })
      .or("latitude", "longitude")
      .optional()
      .messages({
        "object.or": "Please provide both latitude and longitude",
      }),
  });

  // Handle textarea input for bio
  const handleInput = (e) => {
    let value = e.target.value;
    const words = value.trim().split(/\s+/).filter(Boolean);

    if (words.length > maxWords) {
      const validWords = words.slice(0, maxWords).join(" ");
      value = validWords;
    }

    setText(value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    if (show && emptyFields.includes("bio")) {
      const textarea = textareaRef.current;
      if (textarea) {
        setTimeout(() => {
          textarea.style.height = "auto";
          textarea.style.height = textarea.scrollHeight + "px";
        }, 0);
      }
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      if (emptyFields.length === 0) {
        onHide();
      }
      setFormError({});
      setText(data?.bio || "");
      setLatitude(data?.google_location?.latitude || "");
      setLongitude(data?.google_location?.longitude || "");
      setUploadedMediaByType({});
      setLocalEmptyFields([...emptyFields]);
    }
  }, [show, data, emptyFields]);

  useEffect(() => {
    if (!show && pendingPayload) {
      BusinessContext.update({
        ...BusinessContext.data,
        ...pendingPayload,
      });
      setPendingPayload(null);
    }
  }, [show, pendingPayload, BusinessContext]);

  const wordCount =
    text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(Boolean).length;

  const handleLocationSubmit = async () => {
    if (!selectedPlace || !selectedPlace.placeId) {
      toast(
        <ToastMsg message="Please select a location first" danger={true} />,
        config.error_toast_config
      );
      return;
    }

    if (!sessionToken) {
      const newToken = await generateSessionToken();
      if (!newToken) {
        toast(
          <ToastMsg
            message="Failed to establish session. Please refresh the page."
            danger={true}
          />,
          config.error_toast_config
        );
        return;
      }
      return;
    }

    setIsLoading(true);

    try {
      // If current location is selected, we already have the coordinates
      if (isCurrentLocationSelected && currentLocation) {
        setLatitude(currentLocation.location.latitude);
        setLongitude(currentLocation.location.longitude);
        setIsLoading(false);
        return;
      }

      // For new locations, get place details
      const response = await http.get(
        `${base_url}/google-api/places/details/${selectedPlace.placeId}?sessionToken=${sessionToken}`
      );

      if (response?.data) {
        const data = response.data;
        setLatitude(data.location.latitude);
        setLongitude(data.location.longitude);

        // Generate new session token for next search
        generateSessionToken();
        return {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        };
      } else {
        console.error("Place Details API error");
        toast(
          <ToastMsg
            message="Error fetching location details. Please try again."
            danger={true}
          />,
          config.error_toast_config
        );
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      toast(
        <ToastMsg
          message="Error fetching location details. Please try again."
          danger={true}
        />,
        config.error_toast_config
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setFormError({});
    const payload = {};
    if (
      emptyFields.includes("google_location") &&
      selectedPlace &&
      (!latitude || !longitude || latitude === "" || longitude === "")
    ) {
      const res = await handleLocationSubmit();
      payload.google_location = {
        latitude: res.latitude?.toString(),
        longitude: res.longitude?.toString(),
      };
    }

    if (emptyFields.includes("bio") && text !== data?.bio) {
      payload.bio = text;
    }
    // if (
    //   emptyFields.includes("google_location") &&
    //   (latitude !== data?.google_location?.latitude ||
    //     longitude !== data?.google_location?.longitude)
    // ) {
    //   payload.google_location = { latitude, longitude };
    // }

    Object.keys(uploadedMediaByType).forEach((mediaType) => {
      payload[mediaType] = uploadedMediaByType[mediaType];
    });

    if (Object.keys(payload).length > 0) {
      const validationData = {
        bio: payload.bio || "",
        google_location: payload.google_location || {
          latitude: "",
          longitude: "",
        },
      };

      const { error } = schema.validate(validationData, { abortEarly: false });
      if (error) {
        const errors = {};
        error.details.forEach((detail) => {
          if (detail.path[0] === "google_location") {
            errors[detail.path[1]] = detail.message;
          } else {
            errors[detail.path[0]] = detail.message;
          }
        });
        setFormError(errors);
        return;
      }
      try {
        const response = await http.post(
          `${base_url}/business/business-details/${BusinessContext?.data?._id}`,
          payload
        );

        if (response.data) {
          // const updatedEmptyFields = localEmptyFields.filter((field) => {
          //   // Logic to determine if this field is still empty after saving
          //   // Remove fields that are now complete
          //   return ;
          // });
          // setLocalEmptyFields(updatedEmptyFields);
          setPendingPayload(payload);
          BusinessContext.update({
            ...BusinessContext.data,
            ...payload,
          });
          toast(
            <ToastMsg message={`Changes Saved Successfully`} />,
            config.success_toast_config
          );
        }
      } catch (err) {
        setFormError({
          general: "Failed to save changes. Please try again.",
        });
      }
    } else {
      // onHide();
    }
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="Complete_actions_popup"
      backdropClassName="custom-backdrop"
    >
      <Modal.Header>
        <button className="Complete_actions_popup_cancel_btn" onClick={onHide}>
          <img
            src={modalClose}
            alt="close-icon"
            className="Complete_actions_popup_cancel_btn_img"
          />
        </button>
      </Modal.Header>
      <Modal.Body>
        <h2 className="Complete_actions_popup_m_heading">
          Complete {emptyFields.length} Actions Now For Better Matchmaking
        </h2>

        {/* General Error */}
        {formError.general && (
          <p
            className="error_text"
            style={{ color: "red", marginBottom: "10px" }}
          >
            {formError.general}
          </p>
        )}

        {/* Bio Section */}
        {localEmptyFields.includes("bio") && (
          <div className="complete_actions_step_one_wrapper">
            <div className="sm_heading_complete_actions d-flex align_base_text">
              Bio
              <div
                className="count_text_aria"
                style={{ color: wordCount >= maxWords ? "red" : "inherit" }}
              >
                {wordCount}/{maxWords} words
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={text}
              onInput={handleInput}
              className={`text_input_complete_actions text_area_complete_action ${
                wordCount >= maxWords ? "limit-reached" : ""
              }`}
              placeholder="Please enter your bio"
            />
            {formError.bio && (
              <p
                className="error_text"
                style={{ color: "red", marginTop: "5px" }}
              >
                {formError.bio}
              </p>
            )}
          </div>
        )}

        {/* Google Location Section */}
        {localEmptyFields.includes("google_location") && (
          <>
            <div className="complete_actions_step_two_wrapper">
              <div className="sm_heading_complete_actions">Office Address</div>
              <div>Tell us where your office is located</div>
              <div className="user_input_field_container user_input_field_container--Complete-actions">
                {/* <TextField
                  fullWidth
                  label="Latitude"
                  variant="outlined"
                  autoComplete="off"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  error={!!formError.latitude}
                  helperText={formError.latitude}
                  sx={{
                    backgroundColor: "#fff",
                    "& fieldset": {
                      borderRadius: width > 768 ? "10px" : "5px",
                      border: "1px solid #707070",
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: width > 768 ? "10px" : "5px",
                      fontFamily: "Poppins, sans-serif",
                    },
                    "& label.Mui-focused": {
                      color: "#111",
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: "Poppins, sans-serif",
                      padding: width < 1920 ? "11.84px" : "16.5px 14px",
                    },
                    "& label": {
                      fontFamily: "Poppins, sans-serif",
                      fontSize: width < 1920 && "1.25em",
                      lineHeight: width < 1920 && "1.1em",
                    },
                    "& label.Mui-focused": {
                      fontFamily: "Poppins, sans-serif",
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: width > 768 ? "10px" : "5px",
                        border: "1px solid #707070",
                      },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "1px solid #707070",
                      },
                    // ✅ Fix floating label gap
                    "& .MuiOutlinedInput-notchedOutline legend": {
                      maxWidth: "0.01px",
                      transition: "max-width 150ms ease-in-out",
                    },
                    "& .MuiInputLabel-shrink + .MuiOutlinedInput-notchedOutline legend":
                      {
                        maxWidth: "1000px",
                      }, // ✅ Add label padding & background to avoid overlap
                    "& .MuiInputLabel-root": {
                      backgroundColor: "#fff",
                      padding: "0 4px",
                      marginLeft: "-4px",
                      lineHeight: "1.8em",
                    },
                  }}
                /> */}
                <div className="search_location_connect">
                  <img
                    src={searchIconConnect}
                    alt="search"
                    className="searchIcon_connect"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    className="search_location_ip"
                    placeholder="Type here..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    disabled={!sessionToken}
                    onFocus={() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  />
                  {/* <img
                    src={submitIconConnect}
                    alt="search"
                    className="submitIcon_connect"
                    onClick={handleSearchSubmit}
                    style={{ cursor: "pointer" }}
                  /> */}
                </div>

                <div className="search_lcation_results_wrapper">
                  {/* Show current location first if it exists */}
                  {currentLocation && (
                    <div className="search_lcation_result">
                      <div className="title_search_loaction">
                        {currentLocation.title}
                        <div
                          className={`custom_radio_location_add check_box_ctm_popup_wraper ${
                            selectedId === 0 ? "checked" : ""
                          }`}
                          onClick={() => handleLocationToggle(0)}
                          style={{ cursor: "pointer" }}
                        >
                          <input
                            type="radio"
                            name="location"
                            checked={selectedId === 0}
                            onChange={() => handleLocationToggle(0)}
                            className="hiden_ip_ctm_popup d-none"
                          />
                          {selectedId === 0 && (
                            <img
                              src={chakMarkWhite}
                              alt="Checkmark"
                              className="chek_mark_ctm_popup check_location_srch_icon"
                            />
                          )}
                        </div>
                      </div>
                      <div className="address_search_location">
                        {currentLocation.address}
                      </div>
                    </div>
                  )}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div
                      className="loading-indicator"
                      style={{
                        textAlign: "center",
                        margin: "10px 0",
                      }}
                    >
                      Searching...
                    </div>
                  )}

                  {/* Session loading */}
                  {!sessionToken && (
                    <div
                      className="session-loading"
                      style={{
                        textAlign: "center",
                        margin: "10px 0",
                        color: "#666",
                      }}
                    >
                      Initializing search...
                    </div>
                  )}

                  {/* Search suggestions */}
                  {suggestions.map((location) => (
                    <div className="search_lcation_result" key={location.id}>
                      <div className="title_search_loaction">
                        {location.title}
                        <div
                          className={`custom_radio_location_add check_box_ctm_popup_wraper ${
                            selectedId === location.id ? "checked" : ""
                          }`}
                          onClick={() => handleLocationToggle(location.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <input
                            type="radio"
                            name="location"
                            checked={selectedId === location.id}
                            onChange={() => handleLocationToggle(location.id)}
                            className="hiden_ip_ctm_popup d-none"
                          />
                          {selectedId === location.id && (
                            <img
                              src={chakMarkWhite}
                              alt="Checkmark"
                              className="chek_mark_ctm_popup check_location_srch_icon"
                            />
                          )}
                        </div>
                      </div>
                      <div className="address_search_location">
                        {location.address}
                      </div>
                    </div>
                  ))}

                  {/* No results message */}
                  {!isLoading &&
                    suggestions.length === 0 &&
                    searchQuery.trim() && (
                      <div
                        className="no-results"
                        style={{
                          textAlign: "center",
                          margin: "20px 0",
                          color: "#666",
                        }}
                      >
                        No locations found. Try a different search term.
                      </div>
                    )}
                </div>
              </div>
            </div>
            {/* <div className="complete_actions_step_two_wrapper">
              <div className="user_input_field_container">
                <TextField
                  fullWidth
                  label="Longitude"
                  variant="outlined"
                  autoComplete="off"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  error={!!formError.longitude}
                  helperText={formError.longitude}
                  sx={{
                    backgroundColor: "#fff",
                    "& fieldset": {
                      borderRadius: width > 768 ? "10px" : "5px",
                      border: "1px solid #707070",
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: width > 768 ? "10px" : "5px",
                      fontFamily: "Poppins, sans-serif",
                    },
                    "& label.Mui-focused": {
                      color: "#111",
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: "Poppins, sans-serif",
                      padding: width < 1920 ? "11.84px" : "16.5px 14px",
                    },
                    "& label": {
                      fontFamily: "Poppins, sans-serif",
                      fontSize: width < 1920 && "1.25em",
                      lineHeight: width < 1920 && "1.1em",
                    },
                    "& label.Mui-focused": {
                      fontFamily: "Poppins, sans-serif",
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: width > 768 ? "10px" : "5px",
                        border: "1px solid #707070",
                      },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "1px solid #707070",
                      },
                    // ✅ Fix floating label gap
                    "& .MuiOutlinedInput-notchedOutline legend": {
                      maxWidth: "0.01px",
                      transition: "max-width 150ms ease-in-out",
                    },
                    "& .MuiInputLabel-shrink + .MuiOutlinedInput-notchedOutline legend":
                      {
                        maxWidth: "1000px",
                      }, // ✅ Add label padding & background to avoid overlap
                    "& .MuiInputLabel-root": {
                      backgroundColor: "#fff",
                      padding: "0 4px",
                      marginLeft: "-4px",
                      lineHeight: "1.8em",
                    },
                  }}
                />
              </div>
            </div> */}
          </>
        )}

        <button
          type="button"
          className="confirmation_common_btn"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default CompleteActions;
