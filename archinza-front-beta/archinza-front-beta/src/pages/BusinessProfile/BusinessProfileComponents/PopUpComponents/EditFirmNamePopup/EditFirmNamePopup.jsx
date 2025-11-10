import React, { useEffect, useRef, useState } from "react";
import "./editFirmNamePopup.scss";
import Modal from "react-bootstrap/Modal";
import { gallery10, gallery12, modalCloseIcon } from "../../../../../images";
import { TextField } from "@mui/material";
import { useWindowSize } from "react-use";
import Joi from "joi";
import { toast } from "react-toastify";
import ToastMsg from "../../../../../components/ToastMsg/ToastMsg";
import config from "../../../../../config/config";
import helper from "../../../../../helpers/helper";
const EditFirmNamePopup = (props) => {
  const { width } = useWindowSize();
  const [showFileUploadPopup, setShowFileUploadPopup] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [logoImage, setLogoImage] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef(null);
  const schema = Joi.object({
    businessName: Joi.string().trim().required().messages({
      "string.empty": "Business/Firm name is required",
      "any.required": "Business/Firm name is required",
    }),
  });
  const aws_object_url = config.aws_object_url;
  const handleFileUploadPopupOpen = () => setShowFileUploadPopup(true);
  const handleFileUploadPopupClose = () => setShowFileUploadPopup(false);
  const handleBusinessNameChange = (e) => {
    setBusinessName(e.target.value);
    // if (error) setError("");
  };

  const validateBusinessName = () => {
    const { error } = schema.validate({ businessName });
    if (error) {
      setError(error.details[0].message);
      return false;
    }
    return true;
  };

  const handleSaveChanges = () => {
    if (validateBusinessName()) {
      props.onSaveChanges({ businessName, logoFile });
      setError("");
      props.handleClose();
    }
  };

  const handleLogoClick = () => {
    // Trigger file input click
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast(
        <ToastMsg message={`Please select an image file`} danger={true} />,
        config.error_toast_config
      );
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast(
        <ToastMsg
          message={`File size should be less than 100MB`}
          danger={true}
        />,
        config.error_toast_config
      );
      // toast.error("File size should be less than 100MB");
      return;
    }
    file.originalname = file.name;
    setLogoFile(file);
    // Create URL for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (props.data && props.data.business_name) {
      setBusinessName(props.data.business_name);
    }
    // Set initial logo if available
    if (props.data && props.data.brand_logo) {
      setLogoImage(`${aws_object_url}business/${props.data.brand_logo}`);
    } else {
      setLogoImage(null);
    }
  }, [props.data]);

  return (
    <>
      <Modal
        {...props}
        centered
        className="general_info_popup edit_firm_name_modal edit_firm_modal--name"
        backdropClassName="custom-backdrop"
      >
        <Modal.Header>
          <button
            className="custom-cancel-btn"
            onClick={() => {
              setError("");
              props.handleClose();
              // setLogoImage(null);
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
          <h2 className="about_modal_bussines_heading fw-semibold">
            Edit Business Name & Logo
          </h2>
          <div className="Firm_name_image_wrapper">
            <div
              className="FirmName_image_wrapper_modal"
              style={{
                backgroundColor: logoImage && "transparent",
              }}
            >
              {logoImage ? (
                <img
                  src={logoImage}
                  alt="Firm-image"
                  className="firm_image_edit"
                />
              ) : (
                helper.generateInitials(props?.data?.business_name)
              )}
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
          <div
            className="Firm_image_add_popup"
            onClick={() => {
              handleLogoClick();
              // props.handleClose();
            }}
          >
            Edit your Business Logo
          </div>

          <div className="Firm_name_edit_input">
            <TextField
              fullWidth
              label="Name of the Firm/Business*"
              variant="outlined"
              autoComplete="off"
              value={businessName}
              onChange={handleBusinessNameChange}
              error={!!error}
              // helperText={error}
              sx={{
                backgroundColor: "#fff",
                "& fieldset": {
                  borderRadius: width > 768 ? "10px" : "5px",
                  border: "1px solid #707070",
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
            {error && <p className="error_text">{error}</p>}
          </div>

          <div className="info_select_container">
            <div className={`field_wrapper`}>
              <button
                type="submit"
                className="popup_common_btn"
                onClick={handleSaveChanges}
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

export default EditFirmNamePopup;
