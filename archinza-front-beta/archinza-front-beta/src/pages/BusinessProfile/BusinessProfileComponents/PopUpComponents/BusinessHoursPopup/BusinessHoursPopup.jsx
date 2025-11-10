import React, { useState, useEffect } from "react";
import "./businessHoursPopup.scss";
import "../AboutPopUp/aboutPopUp.scss";
import Modal from "react-bootstrap/Modal";
import { modalClose } from "../../../../../images";
import style from "../../../../../../src/pages/FormFiveLightTheme/Form/formfivelighttheme.module.scss";
import CheckboxButton from "../../../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteOthers from "../../../../../components/AutoCompleteOthers/AutoCompleteOthers";
import Joi from "joi";
import { TextField } from "@mui/material";

const BusinessHoursPopupData = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
  { label: "All", value: "All" },
];

// Extended hours options for a more complete dropdown
const openingHoursOptions = [
  { label: "6:00 am", value: "6:00 am" },
  { label: "7:00 am", value: "7:00 am" },
  { label: "8:00 am", value: "8:00 am" },
  { label: "9:00 am", value: "9:00 am" },
  { label: "10:00 am", value: "10:00 am" },
  { label: "11:00 am", value: "11:00 am" },
  { label: "12:00 pm", value: "12:00 pm" },
];

const closingHoursOptions = [
  { label: "4:00 pm", value: "4:00 pm" },
  { label: "5:00 pm", value: "5:00 pm" },
  { label: "6:00 pm", value: "6:00 pm" },
  { label: "7:00 pm", value: "7:00 pm" },
  { label: "8:00 pm", value: "8:00 pm" },
  { label: "9:00 pm", value: "9:00 pm" },
  { label: "10:00 pm", value: "10:00 pm" },
];

// Joi validation schema
const businessHoursSchema = Joi.object({
  days: Joi.array().min(1).required().messages({
    "array.min": "Please select at least one day",
    "array.base": "Days selection is required",
  }),
  open: Joi.string().required().messages({
    "string.empty": "Opening hour is required",
    "any.required": "Opening hour is required",
  }),
  close: Joi.string().required().messages({
    "string.empty": "Closing hour is required",
    "any.required": "Closing hour is required",
  }),
});

const BusinessHoursPopup = ({
  show,
  onHide,
  onSaveBusinessHours,
  businessHours,
}) => {
  // State to track selected days, opening and closing hours
  const [selectedDays, setSelectedDays] = useState(businessHours?.days || []);
  const [openingHour, setOpeningHour] = useState(businessHours?.open || "");
  const [closingHour, setClosingHour] = useState(businessHours?.close || "");
  const [validationErrors, setValidationErrors] = useState({});
  const [autoKey, setAutoKey] = useState(1);

  useEffect(() => {
    if (show) {
      resetToOriginalValues();
    }
  }, [show, businessHours]);

  const resetToOriginalValues = () => {
    if (businessHours) {
      const allDaysExceptAll = BusinessHoursPopupData?.filter(
        (item) => item.value !== "All"
      ).map((item) => item.value);

      // Get selected days (where isClosed is false)
      const selectedDays = businessHours
        ?.filter(
          (entry) => !entry.isClosed && allDaysExceptAll.includes(entry.day)
        )
        .map((entry) => entry.day);

      // Check if all days are selected
      const allDaysSelected = allDaysExceptAll.every((day) =>
        selectedDays.includes(day)
      );

      // Set selected days, including "All" if all days are selected
      setSelectedDays(
        allDaysSelected ? [...selectedDays, "All"] : selectedDays
      );

      // Get opening and closing hours from the first non-closed day
      const firstNonClosedDay = businessHours.find((entry) => !entry.isClosed);

      setOpeningHour({
        label: firstNonClosedDay?.open || "",
        value: firstNonClosedDay?.open || "",
      });

      setClosingHour({
        label: firstNonClosedDay?.close || "",
        value: firstNonClosedDay?.close || "",
      });
    } else {
      // Reset to defaults if no business hours are provided
      setSelectedDays([]);
      setOpeningHour({ label: "", value: "" });
      setClosingHour({ label: "", value: "" });
    }

    // Reset validation errors
    setValidationErrors({});
  };

  const handleTimeInputChange = (e, setter, currentValue) => {
    let value = e.target.value.replace(/[^0-9:amp]/g, ""); // Allow only numbers, colon, a, m, p

    // Extract current parts
    const hasColon = value.includes(":");
    const numberPart = value.replace(/[^0-9]/g, "");
    let timePart = value.match(/[ap]m/i)?.[0]?.toLowerCase() || "";

    // Handle colon insertion logic
    if (numberPart.length === 2 && !hasColon) {
      // When user enters 2 digits, automatically add colon
      value = numberPart.substring(0, 2) + ":" + numberPart.substring(2);
    } else if (numberPart.length === 3 && !hasColon) {
      // For 3 digits, format as H:MM
      value = numberPart.substring(0, 1) + ":" + numberPart.substring(1);
    } else if (numberPart.length === 4) {
      // For 4 digits, format as HH:MM
      value = numberPart.substring(0, 2) + ":" + numberPart.substring(2);
    }

    // Add am/pm if it exists
    if (timePart) {
      value = value + timePart;
    }

    // Validate format (e.g., HH:MMam or HH:MMpm)
    const timeRegex = /^(0?[1-9]|1[0-2])?:?[0-5]?[0-9]?(am|pm)?$/;
    if (value === "" || timeRegex.test(value)) {
      setter({ label: value, value });
    }
  };

  const handleCancel = () => {
    resetToOriginalValues();
    onHide();
  };

  // Handle day selection
  // Handle day selection
  const handleDaySelection = (day) => {
    const allDaysExceptAll = BusinessHoursPopupData.filter(
      (item) => item.value !== "All"
    ).map((item) => item.value);

    if (day === "All") {
      if (selectedDays.includes("All")) {
        // If "All" is already selected, unselect all days
        setSelectedDays([]);
      } else {
        // Select "All" (no need to include individual days)
        setSelectedDays(["All"]);
      }
    } else {
      // We're selecting/deselecting an individual day
      if (selectedDays.includes("All")) {
        // If "All" is selected, deselect "All" and select only the clicked day
        setSelectedDays([day]);
      } else {
        // Normal handling when "All" isn't selected
        let newSelectedDays;
        if (selectedDays.includes(day)) {
          // If the day is already selected, remove it
          newSelectedDays = selectedDays.filter((d) => d !== day);
        } else {
          // Add the day
          newSelectedDays = [...selectedDays, day];
          // Check if all individual days are now selected
          const allIndividualDaysSelected = allDaysExceptAll.every((d) =>
            newSelectedDays.includes(d)
          );
          // If all days are selected, set to "All"
          if (allIndividualDaysSelected) {
            newSelectedDays = ["All"];
          }
        }
        setSelectedDays(newSelectedDays);
      }
    }
  };

  // Check if a day is selected
  const isDaySelected = (day) => {
    // If "All" is selected and we're checking an individual day, don't show it as selected
    if (selectedDays.includes("All") && day !== "All") {
      return false;
    }
    return selectedDays.includes(day);
  };
  // Handle opening hour selection
  const handleOpeningHourChange = (e, value) => {
    setOpeningHour(value);
  };

  // Handle closing hour selection
  const handleClosingHourChange = (e, value) => {
    setClosingHour(value);
  };

  // Validate and handle save
  const handleSaveChanges = () => {
    const dataToValidate = {
      days: selectedDays,
      open: openingHour.value,
      close: closingHour.value,
    };

    // Validate with Joi
    const { error } = businessHoursSchema.validate(dataToValidate, {
      abortEarly: false,
    });

    if (error) {
      // Create an object with validation errors
      const errors = {};
      error.details.forEach((detail) => {
        const key = detail.path[0];
        errors[key] = detail.message;
      });
      setValidationErrors(errors);
      return;
    }

    const allDays = BusinessHoursPopupData.filter(
      (item) => item.value !== "All"
    ).map((item) => item.value);
    const filteredDays = selectedDays.includes("All") ? allDays : selectedDays;
    // Create payload with the new structure
    const business_hours = allDays.map((day) => ({
      day,
      open: filteredDays.includes(day) ? openingHour.value : "",
      close: filteredDays.includes(day) ? closingHour.value : "",
      isClosed: !filteredDays.includes(day),
    }));

    const payload = business_hours;

    // Clear validation errors if validation passes
    setValidationErrors({});
    onSaveBusinessHours(payload);
  };

  return (
    <Modal
      show={show}
      centered
      className="Complete_actions_popup BusinessHoursPopup"
      backdropClassName="custom-backdrop"
    >
      <Modal.Header>
        <button
          className="Complete_actions_popup_cancel_btn"
          onClick={handleCancel}
        >
          <img
            src={modalClose}
            alt="close-icon"
            className="Complete_actions_popup_cancel_btn_img"
          />
        </button>
      </Modal.Header>
      <Modal.Body>
        <h2 className="Complete_actions_popup_m_heading">
          Business Working Hours
        </h2>

        <div
          className={`${style.steps} ${style.reduceSpace} Custom_checks_pils_wrapper`}
        >
          {BusinessHoursPopupData.map((option) => (
            <CheckboxButton
              key={option.value}
              lightTheme
              label={option.label}
              labelId={`${option.value}-formproject_scope`}
              checked={isDaySelected(option.value)}
              onChange={() => handleDaySelection(option.value)}
            />
          ))}
          {validationErrors.days && (
            <div className="validation-error">{validationErrors.days}</div>
          )}
        </div>
        <div className="row">
          <div className="col-md-6 hours_select_ip_wrapper_left">
            <div className="form_autocomplete_b_edit_wrapper_popUp">
              <div className={`${style.steps} ${style.fastep04}`}>
                <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
                  <div className={`${style.field_wrapper} field_wrapper`}>
                    <div className="autocomplete_coustom_wrapper">
                      <AutoCompleteOthers
                        key={`autokey${autoKey}`}
                        lightTheme
                        textLabel="Opening Hour"
                        data={openingHoursOptions}
                        value={openingHour}
                        onChange={(e, v) => {
                          handleOpeningHourChange(e, v);
                          setAutoKey((prev) => prev + 1);
                        }}
                        // renderInput={(params) => (
                        //   <TextField
                        //     {...params}
                        //     label="Opening Hour"
                        //     variant="outlined"
                        //     value={openingHour.value}
                        //     onChange={(e) =>
                        //       handleTimeInputChange(
                        //         e,
                        //         setOpeningHour,
                        //         openingHour
                        //       )
                        //     }
                        //     inputProps={{
                        //       ...params.inputProps,
                        //       placeholder: "HH:MM am/pm",
                        //     }}
                        //   />
                        // )}
                      />
                      {validationErrors.open && (
                        <div className="validation-error">
                          {validationErrors.open}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 hours_select_ip_wrapper_right">
            <div className="form_autocomplete_b_edit_wrapper_popUp">
              <div className={`${style.steps} ${style.fastep04}`}>
                <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
                  <div className={`${style.field_wrapper} field_wrapper`}>
                    <div className="autocomplete_coustom_wrapper">
                      <AutoCompleteOthers
                        lightTheme
                        textLabel="Closing Hour"
                        data={closingHoursOptions}
                        value={closingHour}
                        onChange={(e, v) => {
                          handleClosingHourChange(e, v);
                          setAutoKey((prev) => prev + 1);
                        }}
                        // renderInput={(params) => (
                        //   <TextField
                        //     {...params}
                        //     label="Closing Hour"
                        //     variant="outlined"
                        //     value={closingHour.value}
                        //     onChange={(e) =>
                        //       handleTimeInputChange(e, setClosingHour)
                        //     }
                        //     inputProps={{
                        //       ...params.inputProps,
                        //       maxLength: 5,
                        //       pattern: "[0-9:]*",
                        //     }}
                        //   />
                        // )}
                      />
                      {validationErrors.close && (
                        <div className="validation-error">
                          {validationErrors.close}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="confirmation_common_btn"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default BusinessHoursPopup;
