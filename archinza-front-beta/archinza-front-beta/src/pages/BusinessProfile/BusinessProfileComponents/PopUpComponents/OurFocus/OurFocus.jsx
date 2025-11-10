import React, { useState, useEffect } from "react"; // Add useEffect
import "./ourFocus.scss";
import style from "../../../../FormFiveLightTheme/Form/formfivelighttheme.module.scss";
import Modal from "react-bootstrap/Modal";
import { modalCloseIcon } from "../../../../../images";
import UserInputComponent from "../../../../../components/UserInputComponent/UserInputComponent";
import http from "../../../../../helpers/http";
import config from "../../../../../config/config";
import Joi from "joi";
import { useBusinessContext } from "../../../../../context/BusinessAccount/BusinessAccountState";
import { useWindowSize } from "react-use";
import { toast } from "react-toastify";
import ToastMsg from "../../../../../components/ToastMsg/ToastMsg";

const OurFocus = ({ show, handleClose, data }) => {
  const { width } = useWindowSize();
  const [formError, setFormError] = useState({});
  const BusinessAccountContext = useBusinessContext();
  const base_url = config.api_url;

  const schema = Joi.object({
    selectedServices: Joi.array().optional(),
  });

  // Reset formError when modal opens or closes
  useEffect(() => {
    if (show) {
      setFormError({});
    }
  }, [show]);

  const handleSubmit = async (selectedServices) => {
    const validationData = { selectedServices };
    setFormError({});

    const { error } = schema.validate(validationData, { abortEarly: false });
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      setFormError(errors);
      return;
    }

    try {
      const response = await http.post(
        `${base_url}/business/business-details/${BusinessAccountContext?.data?._id}`,
        {
          product_positionings: selectedServices,
        }
      );

      if (response.data) {
        BusinessAccountContext.update({
          ...BusinessAccountContext.data,
          product_positionings: selectedServices,
        });
        handleClose();
        toast(
          <ToastMsg message={`Changes Saved Successfully`} />,
          config.success_toast_config
        );
      }
    } catch (err) {
      setFormError({
        selectedServices: "Failed to save services. Please try again.",
      });
    }
  };

  const fetchServices = async () => {
    const { data } = await http.get(
      `${base_url}/business/options?qs=product_positionings`
    );
    if (data) {
      data.sort((a, b) => (a.value > b.value ? 1 : -1));
      return data;
    }
    return [];
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="our_focus_popup our_focus--modal"
      backdropClassName="custom-backdrop"
    >
      <Modal.Header>
        <button className="custom-cancel-btn" onClick={handleClose}>
          <img
            src={modalCloseIcon}
            alt="close-icon"
            className="ctm_img_bussine_edit_about"
          />
        </button>
      </Modal.Header>
      <Modal.Body>
        <h2 className="about_modal_bussines_heading">Our Focus</h2>
        <div className="our_focus_select_container">
          <div className={style.text_container}>
            <div
              className={`${style.spacing_rl_row_recive_queries} mx-auto our_focus_query`}
            >
              <UserInputComponent
                fetchServices={fetchServices}
                existingServices={data?.product_positionings || []}
                onSubmit={handleSubmit}
                textFieldTop={width <= 767}
                resetOnError={!!formError.selectedServices} // Pass reset flag
              />
            </div>
          </div>

          {formError.selectedServices && (
            <p
              className="error_text"
              style={{ color: "red", marginTop: "10px" }}
            >
              {formError.selectedServices}
            </p>
          )}

          <div className="field_wrapper">
            <button
              type="button"
              className="popup_common_btn"
              onClick={() => {
                const submitBtn = document.getElementById(
                  "submit-services-btn"
                );
                if (submitBtn) submitBtn.click();
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OurFocus;
