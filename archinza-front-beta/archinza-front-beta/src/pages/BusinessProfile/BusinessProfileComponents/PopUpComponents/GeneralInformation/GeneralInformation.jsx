import React, { useEffect, useState } from "react";
import "./generalInformation.scss";
import "../EditLocationPopup/editLocationPopup.scss";
import Modal from "react-bootstrap/Modal";
import { modalCloseIcon, plusicon, TrashOrange } from "../../../../../images";
import _ from "lodash";
import AutoCompleteField from "../../../../../components/AutoCompleteField/AutoCompleteField";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { useWindowSize } from "react-use";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import style from "../../../../../pages/FormFiveLightTheme/Form/formfivelighttheme.module.scss";
import { TextField } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import http from "../../../../../helpers/http";
import config from "../../../../../config/config";
import { useBusinessContext } from "../../../../../context/BusinessAccount/BusinessAccountState";
import { toast } from "react-toastify";
import ToastMsg from "../../../../../components/ToastMsg/ToastMsg";
import Joi from "joi";

const GeneralInformation = (props) => {
  const { width } = useWindowSize();
  const [formData, setFormData] = useState({
    establishment_year: "",
    team_range: "",
  });
  const [formError, setFormError] = useState({});
  const { data, globalData } = props;
  const BusinessContext = useBusinessContext();
  const [locations, setLocations] = useState([{ type: "", address: "" }]);
  const [newLocations, setNewLocations] = useState([]);
  const [showAddNewLocation, setShowAddNewLocation] = useState(false);
  const [locationErrors, setLocationErrors] = useState([{}]);
  const [newLocationErrors, setNewLocationErrors] = useState([]);

  const locationSchema = Joi.object({
    type: Joi.string().required().messages({
      "string.empty": "Address Type is required",
    }),
    address: Joi.string().required().messages({
      "string.empty": "Address is required",
    }),
  });

  const handleSelectChange = (value, category) => {
    setFormData((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const [date, setDate] = useState(null);
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const minDate = new Date(minYear, 0, 1);

  const handleDateChange = (option) => {
    setDate(option);

    if (option) {
      const selectedYear = option.$y;
      if (selectedYear < minYear || selectedYear > currentYear) {
        setFormError({
          ...formError,
          establishment_year: "Year must be within the last 100 years",
        });
      } else {
        // Clear error if valid year
        const newErrors = { ...formError };
        delete newErrors.establishment_year;
        setFormError(newErrors);
      }

      setFormData((prevState) => ({
        ...prevState,
        establishment_year: option ? option.$y.toString() : "",
      }));
    } else {
      // Clear error if field is empty
      const newErrors = { ...formError };
      delete newErrors.establishment_year;
      setFormError(newErrors);

      setFormData((prevState) => ({
        ...prevState,
        establishment_year: "",
      }));
    }
  };

  const handleLocationChange = (index, field, value, isNewLocation = false) => {
    if (isNewLocation) {
      const updatedLocations = [...newLocations];
      updatedLocations[index][field] = value;
      setNewLocations(updatedLocations);
      validateLocationField(index, field, value, true);
    } else {
      const updatedLocations = [...locations];
      updatedLocations[index][field] = value;
      setLocations(updatedLocations);
      validateLocationField(index, field, value, false);
    }
  };

  const validateLocationField = (
    index,
    field,
    value,
    isNewLocation = false
  ) => {
    const fieldSchema = Joi.object({
      [field]: locationSchema.extract(field),
    });

    const { error } = fieldSchema.validate({ [field]: value });

    if (isNewLocation) {
      const newErrors = [...newLocationErrors];
      if (error) {
        newErrors[index] = {
          ...newErrors[index],
          [field]: error.details[0].message,
        };
      } else {
        const currentErrors = { ...newErrors[index] };
        delete currentErrors[field];
        newErrors[index] = currentErrors;
      }
      setNewLocationErrors(newErrors);
    } else {
      const newErrors = [...locationErrors];
      if (error) {
        newErrors[index] = {
          ...newErrors[index],
          [field]: error.details[0].message,
        };
      } else {
        const currentErrors = { ...newErrors[index] };
        delete currentErrors[field];
        newErrors[index] = currentErrors;
      }
      setLocationErrors(newErrors);
    }
  };

  const validateAllLocations = () => {
    let isValid = true;

    // Validate existing locations
    const newLocationErrorsArray = locations.map((location) => {
      const { error } = locationSchema.validate(location, {
        abortEarly: false,
      });

      if (error) {
        isValid = false;
        const errorObj = {};
        error.details.forEach((detail) => {
          errorObj[detail.path[0]] = detail.message;
        });
        return errorObj;
      }
      return {};
    });
    setLocationErrors(newLocationErrorsArray);

    // Validate new locations
    const newNewLocationErrorsArray = newLocations.map((location) => {
      const { error } = locationSchema.validate(location, {
        abortEarly: false,
      });

      if (error) {
        isValid = false;
        const errorObj = {};
        error.details.forEach((detail) => {
          errorObj[detail.path[0]] = detail.message;
        });
        return errorObj;
      }
      return {};
    });
    setNewLocationErrors(newNewLocationErrorsArray);

    return isValid;
  };

  const handleAddLocation = () => {
    setNewLocations([...newLocations, { type: "", address: "" }]);
    setNewLocationErrors([...newLocationErrors, {}]);
    setShowAddNewLocation(true);
  };

  const handleDeleteLocation = (index, isNewLocation = false) => {
    if (isNewLocation) {
      const updatedLocations = [...newLocations];
      updatedLocations.splice(index, 1);
      setNewLocations(updatedLocations);

      const updatedErrors = [...newLocationErrors];
      updatedErrors.splice(index, 1);
      setNewLocationErrors(updatedErrors);

      // If no new locations left, hide the "Add New Locations" section
      if (updatedLocations.length === 0) {
        setShowAddNewLocation(false);
      }
    } else {
      const updatedLocations = [...locations];
      updatedLocations.splice(index, 1);
      setLocations(updatedLocations);

      const updatedErrors = [...locationErrors];
      updatedErrors.splice(index, 1);
      setLocationErrors(updatedErrors);
    }
  };

  const handleSubmit = async () => {
    // Validate before submission
    if (Object.keys(formError).length > 0) {
      return;
    }

    const locationsValid = validateAllLocations();
    if (!locationsValid) {
      return;
    }

    // Combine existing and new locations
    const allLocations = [...locations, ...newLocations];

    const payload = {
      establishment_year: { data: formData.establishment_year },
      team_range: { data: formData.team_range },
      addresses: allLocations,
    };

    const response = await http.post(
      `${config.api_url}/business/business-details/${data?._id}`,
      payload
    );
    if (response?.data) {
      BusinessContext.update({
        ...BusinessContext.data,
        ...payload,
      });
      toast(
        <ToastMsg message={`Changes Saved Successfully`} />,
        config.success_toast_config
      );
      props.handleClose();
    }
  };

  useEffect(() => {
    const establishmentYearData = data?.establishment_year?.data;
    if (establishmentYearData && dayjs(establishmentYearData).isValid()) {
      const parsedDate = dayjs(establishmentYearData);
      setDate(parsedDate);
      if (parsedDate && parsedDate.$y < minYear) {
        setFormError({
          ...formError,
          establishment_year: "Year must be within the last 100 years",
        });
      }
    } else {
      setDate(null);
    }

    // Validate initially loaded date

    setFormData({
      establishment_year: establishmentYearData,
      team_range: data?.team_range?.data,
    });

    if (data?.addresses && data.addresses.length > 0) {
      setLocations(data.addresses);
      // Initialize error state for each address
      setLocationErrors(Array(data.addresses.length).fill({}));
      setShowAddNewLocation(false);
      setNewLocations([]);
      setNewLocationErrors([]);
    } else {
      // If no addresses, show "Add New Locations" section automatically
      setLocations([]);
      setLocationErrors([]);
      setShowAddNewLocation(true);
      setNewLocations([{ type: "", address: "" }]);
      setNewLocationErrors([{}]);
    }
  }, [data, globalData]);

  return (
    <>
      <Modal
        {...props}
        centered
        className="general_info_popup general_information--modal"
        backdropClassName="custom-backdrop"
      >
        <Modal.Header>
          <button
            className="custom-cancel-btn"
            onClick={() => {
              props.handleClose();
              setFormError({});
              setLocationErrors({});
              setNewLocationErrors({});
            }}
          >
            <img
              src={modalCloseIcon}
              alt="close-icon"
              className="ctm_img_bussine_edit_about"
            />
          </button>
        </Modal.Header>
        <Modal.Body>
          <h2 className="about_modal_bussines_heading">General Information</h2>
          <div className="info_select_container">
            <div className="row general_info_fields_wrapper">
              <div className="col-md-8 p-0">
                <div className="info_select_wrapper pb-0 border-0">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker", "DatePicker"]}>
                      <DatePicker
                        label={"Establishment Year"}
                        openTo="year"
                        views={["year"]}
                        minDate={dayjs(minDate)}
                        maxDate={dayjs(new Date())}
                        disableFuture
                        className={style.year_date_picker}
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          width: "100%",
                          minWidth: "100%",
                          "& *": {
                            fontFamily: "Poppins, sans-serif !important",
                          },
                          "& .MuiOutlinedInput-root": {
                            borderRadius: width > 768 ? "10px" : "10px",
                          },
                          "& label": {
                            lineHeight: width > 768 ? "2em" : "1.5em",
                          },
                          "& label.Mui-focused": {
                            color: true ? "#111" : "fff",
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderRadius: width > 768 ? "10px" : "10px",
                              border: "1px solid #707070",
                            },
                          "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              border: "1px solid #707070",
                            },
                          "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: formError.establishment_year
                                ? "red"
                                : true
                                ? "#111"
                                : "fff",
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
                        value={date || null}
                        onChange={(newdate) => handleDateChange(newdate)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>

                  {formError.establishment_year && (
                    <p className="error_text">{formError.establishment_year}</p>
                  )}
                </div>
              </div>
              <div className="col-md-8 p-0">
                <div className="info_select_wrapper mb-0 border-0">
                  <AutoCompleteField
                    lightTheme
                    key="projects_contact_person"
                    textLabel="Number of Team Members"
                    data={
                      globalData?.team_member_ranges?.map((it) => ({
                        label: it,
                        value: it,
                      })) || []
                    }
                    value={
                      globalData?.team_member_ranges
                        ?.map((it) => ({
                          label: it,
                          value: it,
                        }))
                        .find(
                          (option) => option.value === formData.team_range
                        ) || null
                    }
                    onChange={(e, option) =>
                      handleSelectChange(option.value, "team_range")
                    }
                  />
                </div>
              </div>
            </div>

            {/* Location Fields Section */}
            {locations?.length > 0 && (
              <>
                <h2 className="about_modal_bussines_heading ctm_mb_heading">
                  Locations
                </h2>

                {locations.map((location, index) => (
                  <div className="loaction_wrapper row mt-3" key={index}>
                    <div className="col-md-4 text_field_edit_location">
                      <TextField
                        fullWidth
                        label="Type"
                        variant="outlined"
                        autoComplete="off"
                        value={location.type}
                        onChange={(e) =>
                          handleLocationChange(index, "type", e.target.value)
                        }
                        error={!!locationErrors[index]?.type}
                        sx={{
                          backgroundColor: "#fff",
                          "& fieldset": {
                            borderRadius: width > 768 ? "10px" : "5px",
                            border: locationErrors[index]?.type
                              ? "1px solid red"
                              : "1px solid #707070",
                            fontWeight: "500",
                          },
                          "& .MuiOutlinedInput-root": {
                            borderRadius: width > 768 ? "10px" : "5px",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: "500",
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
                            fontWeight: "400",
                          },
                          "& label.Mui-focused": {
                            fontFamily: "Poppins, sans-serif",
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderRadius: width > 768 ? "10px" : "5px",
                              border: locationErrors[index]?.type
                                ? "1px solid red"
                                : "1px solid #707070",
                            },
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              border: locationErrors[index]?.type
                                ? "1px solid red"
                                : "1px solid #707070",
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
                      {locationErrors[index]?.type && (
                        <p className="error_text">
                          {locationErrors[index].type}
                        </p>
                      )}
                    </div>
                    {/* <div className="col-md-8 adress_location_wrapper">
                      <TextField
                        fullWidth
                        label="Address"
                        variant="outlined"
                        autoComplete="off"
                        value={location.address}
                        onChange={(e) =>
                          handleLocationChange(index, "address", e.target.value)
                        }
                        error={!!locationErrors[index]?.address}
                        sx={{
                          backgroundColor: "#fff",
                          "& fieldset": {
                            borderRadius: width > 768 ? "10px" : "5px",
                            border: locationErrors[index]?.address
                              ? "1px solid red"
                              : "1px solid #707070",
                            fontWeight: "500",
                          },
                          "& .MuiOutlinedInput-root": {
                            borderRadius: width > 768 ? "10px" : "5px",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: "500",
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
                            fontWeight: "400",
                          },
                          "& label.Mui-focused": {
                            fontFamily: "Poppins, sans-serif",
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderRadius: width > 768 ? "10px" : "5px",
                              border: locationErrors[index]?.address
                                ? "1px solid red"
                                : "1px solid #707070",
                            },
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              border: locationErrors[index]?.address
                                ? "1px solid red"
                                : "1px solid #707070",
                            },
                        }}
                      />
                      {locationErrors[index]?.address && (
                        <p className="error_text">
                          {locationErrors[index].address}
                        </p>
                      )}
                      <img
                        src={TrashOrange}
                        alt="Delete"
                        className="delete_location_edit"
                        onClick={() => handleDeleteLocation(index)}
                      />
                    </div> */}
                    <div
                      className={`${
                        locationErrors[index]?.address && "align-items-start"
                      } col-md-8 adress_location_wrapper flex-column`}
                    >
                      <div className="wrapeer_ip_trash">
                        <TextField
                          className={`${
                            locationErrors[index]?.address && "border-0 pb-0"
                          }`}
                          fullWidth
                          label="Address"
                          variant="outlined"
                          autoComplete="off"
                          value={location.address}
                          onChange={(e) =>
                            handleLocationChange(
                              index,
                              "address",
                              e.target.value,
                              false
                            )
                          }
                          error={!!locationErrors[index]?.address}
                          sx={{
                            backgroundColor: "#fff",
                            "& fieldset": {
                              borderRadius: width > 768 ? "10px" : "5px",
                              border: "1px solid #707070",
                              fontWeight: "500",
                            },
                            "& .MuiOutlinedInput-root": {
                              borderRadius: width > 768 ? "10px" : "5px",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: "500",
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
                              fontWeight: "400",
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

                        {locations.length + newLocations.length > 1 && (
                          <img
                            src={TrashOrange}
                            alt="Delete"
                            className="delete_location_edit"
                            onClick={() => handleDeleteLocation(index, false)} // for existing locations
                          />
                        )}
                      </div>

                      {locationErrors[index]?.address && (
                        <div
                          className={`${
                            locationErrors[index]?.address &&
                            "error_border_bottom"
                          } error_text`}
                        >
                          {locationErrors[index].address}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {showAddNewLocation && (
              <div className="add_new_location_container">
                <h2 className="about_modal_bussines_heading">
                  Add New Locations
                </h2>
                {newLocations.map((location, index) => (
                  <div
                    className="loaction_wrapper row mt-3"
                    key={`new-${index}`}
                  >
                    <div className="col-md-4 text_field_edit_location">
                      <TextField
                        fullWidth
                        label="Type"
                        variant="outlined"
                        autoComplete="off"
                        value={location.type}
                        onChange={(e) =>
                          handleLocationChange(
                            index,
                            "type",
                            e.target.value,
                            true
                          )
                        }
                        error={!!newLocationErrors[index]?.type}
                        sx={{
                          backgroundColor: "#fff",
                          "& fieldset": {
                            borderRadius: width > 768 ? "10px" : "5px",
                            border: "1px solid #707070",
                            fontWeight: "500",
                          },
                          "& .MuiOutlinedInput-root": {
                            borderRadius: width > 768 ? "10px" : "5px",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: "500",
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
                            fontWeight: "400",
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
                      {newLocationErrors[index]?.type && (
                        <p className="error_text">
                          {newLocationErrors[index].type}
                        </p>
                      )}
                    </div>
                    <div
                      className={`${
                        newLocationErrors[index]?.address && "align-items-start"
                      } col-md-8 adress_location_wrapper flex-column`}
                    >
                      <div className="wrapeer_ip_trash">
                        <TextField
                          className={`${
                            newLocationErrors[index]?.address && "border-0 pb-0"
                          }`}
                          fullWidth
                          label="Address"
                          variant="outlined"
                          autoComplete="off"
                          value={location.address}
                          onChange={(e) =>
                            handleLocationChange(
                              index,
                              "address",
                              e.target.value,
                              true
                            )
                          }
                          error={!!newLocationErrors[index]?.address}
                          sx={{
                            backgroundColor: "#fff",
                            "& fieldset": {
                              borderRadius: width > 768 ? "10px" : "5px",
                              border: "1px solid #707070",
                              fontWeight: "500",
                            },
                            "& .MuiOutlinedInput-root": {
                              borderRadius: width > 768 ? "10px" : "5px",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: "500",
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
                              fontWeight: "400",
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

                        {locations.length + newLocations.length > 1 && (
                          <img
                            src={TrashOrange}
                            alt="Delete"
                            className="delete_location_edit"
                            onClick={() => handleDeleteLocation(index, true)} // for new locations
                          />
                        )}
                      </div>

                      {newLocationErrors[index]?.address && (
                        <div
                          className={`${
                            newLocationErrors[index]?.address &&
                            "error_border_bottom"
                          } error_text`}
                        >
                          {newLocationErrors[index].address}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="add_new_location_action_wrapper mt-3 mb-4">
              <div
                className="d-flex align-items-center cursor-pointer"
                onClick={handleAddLocation}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={plusicon}
                  alt="Add location"
                  className="add_location_wrapper"
                />
                <div className="text_action_add_location ml-2">
                  Add more locations
                </div>
              </div>
            </div>

            <div className={`field_wrapper`}>
              <button
                type="submit"
                className="popup_common_btn"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GeneralInformation;
