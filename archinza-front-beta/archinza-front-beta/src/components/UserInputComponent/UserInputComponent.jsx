import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import "./userInputComponent.scss";
import CheckboxButton from "../CheckboxButton/CheckboxButton";
import { useWindowSize } from "react-use";
import helper from "../../helpers/helper";

const UserInputComponent = ({
  fetchServices,
  existingServices = [],
  onSubmit,
  textFieldTop,
  hideField,
  resetOnError = false, // Add prop to reset on error
}) => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [servicesList, setServicesList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const { width } = useWindowSize();

  useEffect(() => {
    const loadServices = async () => {
      const fetchedServices = await fetchServices();

      const allServices = [
        ...fetchedServices,
        ...existingServices
          .filter(
            (existing) =>
              !fetchedServices.some(
                (service) =>
                  service.label.toLowerCase() === existing.toLowerCase()
              )
          )
          .map((label) => ({ label, value: label })),
      ];

      setServicesList(allServices);

      // Initialize checked state, reset if error
      const initialCheckedState = {};
      allServices.forEach((service) => {
        initialCheckedState[service.label] = resetOnError
          ? false // Reset to unchecked on error
          : existingServices.some(
              (existing) =>
                existing.toLowerCase() === service.label.toLowerCase()
            );
      });
      setCheckedItems(initialCheckedState);
    };
    loadServices();
  }, [fetchServices, existingServices, resetOnError]); // Add resetOnError to dependencies

  const handleCheckboxChange = (label) => {
    setCheckedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      const capitalizedValue = helper.capitalizeWords(inputValue.trim());
      setTags((prevTags) => [...prevTags, capitalizedValue]);
      setInputValue("");
    }
  };

  const handleDelete = (index) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const handleFormSubmit = () => {
    const selectedServices = [
      ...Object.entries(checkedItems)
        .filter(([, isChecked]) => isChecked)
        .map(([label]) => label),
      ...tags,
    ];
    onSubmit(selectedServices);
  };

  const newAdditionList = servicesList.map((service) => (
    <React.Fragment key={service.label}>
      <CheckboxButton
        lightTheme
        isChecked={checkedItems[service.label] || false}
        label={service.label}
        labelId={service.label}
        onClick={() => handleCheckboxChange(service.label)}
      />
    </React.Fragment>
  ));

  return (
    <div className="wraper_userInput">
      {textFieldTop && hideField &&(
        <div className="user_input_field_container">
          <TextField
            fullWidth
            label="Type Here Incase of Other"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
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
              },
              "& label": {
                fontFamily: "Poppins, sans-serif",
              },
              "& label.Mui-focused": {
                fontFamily: "Poppins, sans-serif",
              },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: width > 768 ? "10px" : "5px",
                border: "1px solid #707070",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: "1px solid #707070 !important",
                },
            }}
          />
        </div>
      )}

      <div className="user_input_div">
        <ul className="user_input_ul">
          {newAdditionList}
          {tags.map((tag, index) => (
            <li key={index} className="user_input_li">
              <CheckboxButton
                lightTheme
                isChecked={true}
                label={tag}
                labelId={tag}
                onClick={() => handleDelete(index)}
              />
            </li>
          ))}
        </ul>
      </div>

      {!textFieldTop && !hideField && (
        <div className="user_input_field_container">
          <TextField
            fullWidth
            label="Type Here Incase of Other"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
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
              },
              "& label": {
                fontFamily: "Poppins, sans-serif",
              },
              "& label.Mui-focused": {
                fontFamily: "Poppins, sans-serif",
              },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: width > 768 ? "10px" : "5px",
                border: "1px solid #707070",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: "1px solid #707070 !important",
                },
            }}
          />
        </div>
      )}
      <button
        id="submit-services-btn"
        style={{ display: "none" }}
        onClick={handleFormSubmit}
      />
    </div>
  );
};

export default UserInputComponent;
