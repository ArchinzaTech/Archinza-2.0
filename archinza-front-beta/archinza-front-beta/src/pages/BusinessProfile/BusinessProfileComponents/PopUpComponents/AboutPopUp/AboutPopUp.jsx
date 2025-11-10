import React, { useEffect, useRef, useState } from "react";
import "./aboutPopUp.scss";
import Modal from "react-bootstrap/Modal";
import { blackClose, modalCloseIcon } from "../../../../../images";
import AutoCompleteOthers from "../../../../../components/AutoCompleteOthers/AutoCompleteOthers";
import _ from "lodash";
import CheckboxButton from "../../../../../components/CheckboxButton/CheckboxButton";
import style from "../../../../FormFiveLightTheme/Form/formfivelighttheme.module.scss";
import { toast } from "react-toastify";
import ToastMsg from "../../../../../components/ToastMsg/ToastMsg";
import config from "../../../../../config/config";
import { useBusinessContext } from "../../../../../context/BusinessAccount/BusinessAccountState";
import http from "../../../../../helpers/http";

const AboutPopUp = (props) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [initialServices, setInitialServices] = useState([]);
  const textareaRef = useRef(null);
  const [text, setText] = useState("");
  const maxWords = 150;
  const BusinessContext = useBusinessContext();
  const baseUrl = config.api_url;
  const [autoKey, setAutoKey] = useState(1);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    // Set initial text from props
    setText(props?.data?.bio || "");

    // Set up services data from globalData
    if (props.globalData && props.globalData.addon_services) {
      const services = props.globalData.addon_services.map((service) => ({
        label: service,
        value: service,
      }));
      setServicesData(services);
    }

    // Set initial services from props data
    if (props.data && props.data.services) {
      setInitialServices(props.data.services || []);
    }

    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      setTimeout(() => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }, 0);
    }
  }, [props.data, props.globalData]);

  // Effect to disable initially selected services in the dropdown
  useEffect(() => {
    if (initialServices.length > 0 && servicesData.length > 0) {
      const updatedServicesData = [...servicesData];
      let needsUpdate = false;

      initialServices.forEach((service) => {
        const index = _.findIndex(updatedServicesData, { value: service });
        if (index !== -1 && !updatedServicesData[index].disabled) {
          updatedServicesData[index] = {
            ...updatedServicesData[index],
            disabled: true,
          };
          needsUpdate = true;
        }
      });

      if (needsUpdate) {
        setServicesData(updatedServicesData);
      }
    }
  }, [initialServices, servicesData]);

  const handleOptionChange = (value) => {
    // Enable/disable the selected option in the dropdown
    enableDisableOption(value, true);

    // Add to selected options
    setSelectedOptions((prev) => [...prev, value]);
  };

  const handleCheckboxChange = (index, value) => {
    // Re-enable the option in the dropdown
    enableDisableOption(value, false);

    // Remove from selected options
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions.splice(index, 1);
    setSelectedOptions(updatedSelectedOptions);
  };

  const enableDisableOption = (value, isDisabled = true) => {
    const selectedIndex = _.findIndex(servicesData, { value: value });

    if (selectedIndex !== -1) {
      const updatedOptions = [...servicesData];
      updatedOptions[selectedIndex] = {
        ...updatedOptions[selectedIndex],
        disabled: isDisabled,
      };
      setServicesData(updatedOptions);
    }
  };

  const handleRemove = (value) => {
    // Re-enable the option in dropdown
    enableDisableOption(value, false);

    // Remove from initial services
    const updatedInitialServices = initialServices.filter(
      (service) => service !== value
    );
    setInitialServices(updatedInitialServices);
  };

  const handleSubmit = async () => {
    // Combine initial and newly selected services
    const allServices = [...initialServices, ...selectedOptions];

    const payload = {
      bio: text,
      services: allServices,
    };

    try {
      const response = await http.post(
        `${baseUrl}/business/business-details/${BusinessContext?.data?._id}`,
        payload
      );

      if (response.data) {
        BusinessContext.update({
          ...BusinessContext.data,
          ...payload,
        });
        toast(
          <ToastMsg message={`Changes Saved Successfully`} />,
          config.success_toast_config
        );

        // Update initialServices to include all services
        setInitialServices(allServices);
        // Clear selected options as they are now part of initialServices
        setSelectedOptions([]);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast(
        <ToastMsg message={`Error saving changes`} />,
        config.error_toast_config
      );
    }
  };

  const handleInput = (e) => {
    let value = e.target.value;

    // Split words and trim excess
    const words = value.trim().split(/\s+/).filter(Boolean);

    if (words.length > maxWords) {
      value = words.slice(0, maxWords).join(" ");
    }

    setText(value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  // Render selected options from state
  const selectedList = selectedOptions.map((option, i) => (
    <CheckboxButton
      key={`selected-${i}`}
      lightTheme
      isChecked={true}
      label={option}
      labelId={option}
      onChange={() => handleCheckboxChange(i, option)}
    />
  ));

  // Calculate word count for display
  const wordCount =
    text?.trim() === "" ? 0 : text?.trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      <Modal
        {...props}
        centered
        className="bussinessEdit_about_Modal"
        backdropClassName="custom-backdrop"
      >
        <Modal.Header>
          <button
            className="custom-cancel-btn about_popup_cancel"
            onClick={props.handleClose}
          >
            <img
              src={modalCloseIcon}
              alt="close-icon"
              className="ctm_img_bussine_edit_about"
            />
          </button>
        </Modal.Header>

        <Modal.Body>
          <h2 className="about_modal_bussines_heading">
            About
            <div className="sm_heading_complete_actions d-flex align_base_text">
              <div
                className="count_text_aria ms-auto"
                style={{ color: wordCount >= maxWords ? "red" : "inherit" }}
              >
                {wordCount}/{maxWords} words
              </div>
            </div>
          </h2>

          <div className="complete_actions_step_one_wrapper">
            <textarea
              ref={textareaRef}
              value={text}
              onInput={handleInput}
              className={`text_input_complete_actions text_area_complete_action about_text_area ${
                wordCount >= maxWords ? "limit-reached" : ""
              }`}
              placeholder="Please enter your bio"
            />
          </div>

          <div className="form_autocomplete_b_edit_wrapper_popUp">
            <h2 className="automplete_b_edit_heading">Our Products/Services</h2>
            <div className={`${style.steps} ${style.fastep04}`}>
              <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
                <div className={`${style.field_wrapper} field_wrapper`}>
                  <div className="autocomplete_coustom_wrapper">
                    <AutoCompleteOthers
                      key={`autokey${autoKey}`}
                      lightTheme
                      textLabel="Select your products/services"
                      data={servicesData}
                      onChange={(e, value) => {
                        handleOptionChange(value.value);
                        setAutoKey((prev) => prev + 1);
                      }}
                    />
                  </div>
                  <ul className="checkboxes chips_b_edit_autoComplete">
                    {/* Render initial services (pre-selected) */}
                    {initialServices.map((value, index) => (
                      <li
                        className="black_border_chips_custom"
                        key={`initial-${index}`}
                        onClick={() => handleRemove(value)}
                      >
                        {value}
                        <img
                          src={blackClose}
                          alt="close"
                          className="close_icon cl_ic_cs_black"
                        />
                      </li>
                    ))}

                    {/* Render newly selected services */}
                    {selectedList}
                  </ul>
                  <button
                    type="button"
                    className="popup_common_btn"
                    onClick={handleSubmit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AboutPopUp;
