import React, { useCallback, useEffect, useState, useRef } from "react";
import "./addLocationPopup.scss";
import Modal from "react-bootstrap/Modal";
import {
  chakMarkWhite,
  modalClose,
  searchIconConnect,
  submitIconConnect,
} from "../../../../../images";
import { v4 as uuidv4 } from "uuid";
import config from "../../../../../config/config";
import http from "../../../../../helpers/http";
import { toast } from "react-toastify";
import ToastMsg from "../../../../../components/ToastMsg/ToastMsg";

const AddLocationPopup = (props) => {
  const options = [
    {
      id: 1,
      title: "Atinner Interior Firm",
      address:
        "1103, Marathon Icon, Ganapatrao Kadam Marg, Lower Parel West, Lower Parel, Mumbai, Maharashtra 400013",
    },
    {
      id: 2,
      title: "Atinner Interior Firm",
      address:
        "1103, Marathon Icon, Ganapatrao Kadam Marg, Lower Parel West, Lower Parel, Mumbai, Maharashtra 400013",
    },
    {
      id: 3,
      title: "Atinner Interior Firm",
      address:
        "1103, Marathon Icon, Ganapatrao Kadam Marg, Lower Parel West, Lower Parel, Mumbai, Maharashtra 400013",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const inputRef = useRef(null);
  const [lastSearchedQuery, setLastSearchedQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isCurrentLocationSelected, setIsCurrentLocationSelected] =
    useState(false);

  const API_BASE_URL = config.api_url;

  const generateSessionToken = async () => {
    try {
      const response = await http.post(
        `${API_BASE_URL}/google-api/places/session-token`
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

  // Initialize session token on component mount
  useEffect(() => {
    generateSessionToken();
  }, []);

  const sortSuggestionsByCountry = (suggestions) => {
    return suggestions.sort((a, b) => {
      const aHasIndia = a.address.toLowerCase().includes("india");
      const bHasIndia = b.address.toLowerCase().includes("india");

      if (aHasIndia && !bHasIndia) return -1;
      if (!aHasIndia && bHasIndia) return 1;
      return 0;
    });
  };

  const performAutocompleteSearch = useCallback(
    async (query, token) => {
      if (!query.trim() || !token) return;
      setIsLoading(true);
      try {
        const response = await http.post(
          `${API_BASE_URL}/google-api/places/autocomplete`,
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
    [API_BASE_URL]
  );

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      // Clear previous timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      if (!(props.editMode && isCurrentLocationSelected)) {
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
          console.log(trimmedQuery, sessionToken);
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

  const fetchCurrentLocation = async (lat, lng) => {
    try {
      setIsLoading(true);
      const response = await http.get(
        `${API_BASE_URL}/google-api/places/geocode?lat=${lat}&lng=${lng}`
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

  useEffect(() => {
    const initializeComponent = async () => {
      await generateSessionToken();

      // If in edit mode and coordinates are provided, fetch current location
      if (props.editMode && props.data?.latitude && props.data?.longitude) {
        await fetchCurrentLocation(props.data?.latitude, props.data?.longitude);
      }
    };

    initializeComponent();
  }, [props.editMode]);

  useEffect(() => {
    if (inputRef.current && searchQuery) {
      inputRef.current.focus();
    }
  }, [suggestions, searchQuery]);

  // Handle manual search trigger
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      performAutocompleteSearch(searchQuery, sessionToken);
    }
  };

  const handleToggle = useCallback(
    (id) => {
      const newSelectedId = selectedId === id ? null : id;
      setSelectedId(newSelectedId);

      if (newSelectedId === 0) {
        setSelectedPlace(currentLocation);
        setIsCurrentLocationSelected(true);
      } else if (newSelectedId) {
        const selected = suggestions.find((item) => item.id === newSelectedId);
        setSelectedPlace(selected);
        setIsCurrentLocationSelected(false);
      } else {
        if (props.editMode && currentLocation) {
          setSelectedId(0);
          setSelectedPlace(currentLocation);
          setIsCurrentLocationSelected(true);
        } else {
          setSelectedPlace(null);
          setIsCurrentLocationSelected(false);
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

  const resetModalState = () => {
    if (props.editMode && currentLocation) {
      // In edit mode, keep current location selected and clear search
      setSearchQuery("");
      setSuggestions([]);
      setSelectedId(0);
      setSelectedPlace(currentLocation);
      setIsCurrentLocationSelected(true);
      setLastSearchedQuery("");
    } else {
      // In add mode, clear everything
      setSearchQuery("");
      setSuggestions([]);
      setSelectedId(null);
      setSelectedPlace(null);
      setIsCurrentLocationSelected(false);
      setLastSearchedQuery("");
    }
  };

  // Update the modal close handler - add this to Modal props
  const handleModalHide = () => {
    resetModalState();
    props.onHide();
  };

  const handleSaveChanges = async () => {
    if (!selectedPlace || !selectedPlace.placeId) {
      toast(
        <ToastMsg message="Please select a location first" danger={true} />,
        config.error_toast_config
      );
      return;
    }

    if (!sessionToken) {
      toast(
        <ToastMsg message="Session expired. Please try again." danger={true} />,
        config.error_toast_config
      );
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
      const response = await http.get(
        `${API_BASE_URL}/google-api/places/details/${selectedPlace.placeId}?sessionToken=${sessionToken}`
      );

      if (response?.data) {
        const data = response.data;

        // Prepare the location data to send to parent
        const locationData = {
          placeId: selectedPlace.placeId,
          title: selectedPlace.title,
          address: selectedPlace.address,
          location: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          },
          // displayName: placeDetails.displayName,
          // formattedAddress: placeDetails.formattedAddress,
        };
        // Send location data to parent component
        if (props.onLocationSelect) {
          props.onLocationSelect(locationData);
        }

        // Session token expires after place details API call
        // Generate new token for next search
        generateSessionToken();

        // Reset form
        setSearchQuery("");
        setSuggestions([]);
        setSelectedId(null);
        setSelectedPlace(null);
        setLastSearchedQuery("");

        // Close modal
        props.onHide();
      } else {
        console.error("Place Details API error:");
        alert("Error fetching place details. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      alert("Error fetching place details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <>
      <Modal
        {...props}
        centered
        className={`Complete_actions_popup edit_social_link_b_connect_edit border_radius_custom ctm_popup_search_location`}
        backdropClassName="custom-backdrop"
        onHide={handleModalHide}
      >
        <Modal.Header>
          <button
            className="Complete_actions_popup_cancel_btn"
            onClick={props.onHide}
          >
            <img
              src={modalClose}
              alt="close-icon"
              className="Complete_actions_popup_cancel_btn_img"
            />
          </button>
        </Modal.Header>
        <Modal.Body>
          <h2 className="Complete_actions_popup_m_heading social_link_edi_heading">
            {props?.editMode ? "Edit" : "Add"} Location/Address
          </h2>

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
            {props.editMode && currentLocation && (
              <div className="search_lcation_result">
                <div className="title_search_loaction">
                  {currentLocation.title}

                  <div
                    className={`custom_radio_location_add ${
                      selectedId === 0
                        ? "checked check_box_ctm_popup_wraper"
                        : "check_box_ctm_popup_wraper"
                    }`}
                    onClick={() => handleToggle(0)}
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      checked={selectedId === 0}
                      readOnly
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

            {isLoading && (
              <div
                className="loading-indicator"
                style={{ textAlign: "center", margin: "10px 0" }}
              >
                Searching...
              </div>
            )}
            {!sessionToken && (
              <div
                className="session-loading"
                style={{ textAlign: "center", margin: "10px 0", color: "#666" }}
              >
                Initializing search...
              </div>
            )}

            {suggestions.map((item) => {
              const isChecked = selectedId === item.id;

              return (
                <div key={item.id} className="search_lcation_result">
                  <div className="title_search_loaction">
                    {item.title}

                    <div
                      className={`custom_radio_location_add ${
                        isChecked
                          ? "checked check_box_ctm_popup_wraper"
                          : "check_box_ctm_popup_wraper"
                      }`}
                      onClick={() => handleToggle(item.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Fake radio button */}
                      <input
                        type="radio"
                        checked={isChecked}
                        readOnly
                        className="hiden_ip_ctm_popup d-none"
                      />

                      {isChecked && (
                        <img
                          src={chakMarkWhite}
                          alt="Checkmark"
                          className="chek_mark_ctm_popup check_location_srch_icon"
                        />
                      )}
                    </div>
                  </div>

                  <div className="address_search_location">{item.address}</div>
                </div>
              );
            })}
            {!isLoading && suggestions.length === 0 && searchQuery.trim() && (
              <div
                className="no-results"
                style={{ textAlign: "center", margin: "20px 0", color: "#666" }}
              >
                No locations found. Try a different search term.
              </div>
            )}
          </div>

          <button
            type="submit"
            className="confirmation_common_btn confirmation_cmn_edit_coonect_btn"
            onClick={handleSaveChanges}
            disabled={
              !selectedPlace ||
              isLoading ||
              !sessionToken ||
              (props.editMode && isCurrentLocationSelected)
            }
            style={{
              opacity:
                !selectedPlace ||
                isLoading ||
                !sessionToken ||
                (props.editMode && isCurrentLocationSelected)
                  ? 0.6
                  : 1,
              cursor:
                !selectedPlace ||
                isLoading ||
                !sessionToken ||
                (props.editMode && isCurrentLocationSelected)
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Save Changes
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddLocationPopup;
