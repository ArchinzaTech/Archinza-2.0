import React, { useEffect, useState } from "react";
import "./editLocationPopup.scss";
import Modal from "react-bootstrap/Modal";
import { modalCloseIcon, plusicon, TrashOrange } from "../../../../../images";
import AutoCompleteOthers from "../../../../../components/AutoCompleteOthers/AutoCompleteOthers";
import _ from "lodash";
import CheckboxButton from "../../../../../components/CheckboxButton/CheckboxButton";
import style from "../../../../FormFiveLightTheme/Form/formfivelighttheme.module.scss";
import AutoCompleteField from "../../../../../components/AutoCompleteField/AutoCompleteField";
import { TextField } from "@mui/material";
import { useWindowSize } from "react-use";

const EditLocationPopup = ({ show, handleClose }) => {
  const { width } = useWindowSize();
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="excel_popup edit_location_popup_edp"
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
        <h2 className="about_modal_bussines_heading fw-semibold">
          Lorem Locations
        </h2>

        <div className="loaction_wrapper row">
          <div className="col-md-5 text_field_edit_location">
              <TextField
                fullWidth
                label="Type"
                variant="outlined"
                autoComplete="off"
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
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderRadius: width > 768 ? "10px" : "5px",
                    border: "1px solid #707070",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "1px solid #707070",
                    },
                }}
              />
          </div>
          <div className="col-md-7  adress_location_wrapper">
           <TextField
                fullWidth
                label="Address"
                variant="outlined"
                autoComplete="off"
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
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderRadius: width > 768 ? "10px" : "5px",
                    border: "1px solid #707070",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "1px solid #707070",
                    },
                }}
              />
            <img
              src={TrashOrange}
              alt="Delete"
              className="delete_location_edit"
            />
          </div>
        </div>
           <div className="loaction_wrapper row">
          <div className="col-md-5 text_field_edit_location">
              <TextField
                fullWidth
                label="Type"
                variant="outlined"
                autoComplete="off"
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
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderRadius: width > 768 ? "10px" : "5px",
                    border: "1px solid #707070",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "1px solid #707070",
                    },
                }}
              />
          </div>
          <div className="col-md-7  adress_location_wrapper">
           <TextField
                fullWidth
                label="Address"
                variant="outlined"
                autoComplete="off"
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
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderRadius: width > 768 ? "10px" : "5px",
                    border: "1px solid #707070",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "1px solid #707070",
                    },
                }}
              />
            <img
              src={TrashOrange}
              alt="Delete"
              className="delete_location_edit"
            />
          </div>
        </div>

           <div className="loaction_wrapper row">
          <div className="col-md-5 text_field_edit_location">
              <TextField
                fullWidth
                label="Type"
                variant="outlined"
                autoComplete="off"
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
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderRadius: width > 768 ? "10px" : "5px",
                    border: "1px solid #707070",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "1px solid #707070",
                    },
                }}
              />
          </div>
          <div className="col-md-7  adress_location_wrapper">
           <TextField
                fullWidth
                label="Address"
                variant="outlined"
                autoComplete="off"
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
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderRadius: width > 768 ? "10px" : "5px",
                    border: "1px solid #707070",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "1px solid #707070",
                    },
                }}
              />
            <img
              src={TrashOrange}
              alt="Delete"
              className="delete_location_edit"
            />
          </div>
        </div>
        

        <h2 className="about_modal_bussines_heading fw-semibold heading_add_location_edit">
          Add New Locations
        </h2>

        <div className="add_new_location_container">
          <div className="loaction_wrapper row">
            <div className="col-md-5 text_field_edit_location">
              <TextField
                fullWidth
                label="Type"
                variant="outlined"
                autoComplete="off"
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
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderRadius: width > 768 ? "10px" : "5px",
                    border: "1px solid #707070",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "1px solid #707070",
                    },
                }}
              />
            </div>
            <div className="col-md-7 adress_location_wrapper add_new_location_wrapper">
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                autoComplete="off"
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
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderRadius: width > 768 ? "10px" : "5px",
                    border: "1px solid #707070",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "1px solid #707070",
                    },
                }}
              />
              <img
                src={TrashOrange}
                alt="Delete"
                className="delete_location_edit addNewLocation_icon"
              />
            </div>
          </div>
        </div>


        <div className="add_new_location_action_wrapper">
          <img
            src={plusicon}
            alt="Add location"
            className="add_location_wrapper"
          />
          <div className="text_action_add_location">Add more locations</div>
        </div>

        <button type="submit" className="popup_common_btn">
          Save Changes
        </button>
        
      </Modal.Body>
    </Modal>
  );
};

export default EditLocationPopup;
