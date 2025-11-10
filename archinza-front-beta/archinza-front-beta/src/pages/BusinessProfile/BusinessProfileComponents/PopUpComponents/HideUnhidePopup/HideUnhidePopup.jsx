import React from "react";
import "./hideUnhidePopup.scss";
import Modal from "react-bootstrap/Modal";
import {
  addIconGallery,
  closeChipsIcon,
  closeIcon,
  closeOrangBorderIcon,
  deleteicon,
  deleteIconBlue,
  modalCloseIcon,
  uploadIcon,
} from "../../../../../images";
import { CancelSharp } from "@mui/icons-material";

const HideUnhideProfilePopup = (props) => {
  const handleHideUnhideDocument = () => {
    props.onConfirm(props.selectedDoc?._id);
  };

  return (
    <>
      <Modal
        {...props}
        centered
        className="file_upload_popup"
        backdrop="static"
        backdropClassName="nested-backdrop"
        enforceFocus={false} // ✅ Important when nesting modals
        keyboard={false}
      >
        {/* <Modal.Header>
          <button className="custom-cancel-btn" onClick={props.handleClose}>
            <img
              src={modalCloseIcon}
              alt="close-icon"
              className="ctm_img_bussine_edit_about"
            />
          </button>
        </Modal.Header> */}
        <Modal.Body>
          <h2 className="about_modal_bussines_heading">
            {props.selectedDoc?.visibility ? "Hide" : "Un-Hide"} this document?
          </h2>

          <div className="delet_confirmation_box_conatiner">
            <div className="delet_confirmation_box">
              <img
                src={uploadIcon}
                alt="Delete"
                className="delete_confirmation_img"
              />
              {props.selectedDoc?.visibility ? (
                <div className="desc_delete_confirmation_msg">
                  {props.selectedDoc?.prefixName} and its related media will be
                  hidden from your preview page.
                </div>
              ) : (
                <div className="desc_delete_confirmation_msg">
                  {props.selectedDoc?.prefixName} and its related media will be
                  un-hidden from your preview page.
                </div>
              )}
            </div>
          </div>

          <div className="delete_confirmation_actions_btn_group">
            <button
              className="cancel_delet_btn cmn_styling_delete_confm_btn"
              onClick={props.handleClose}
            >
              <img
                src={closeOrangBorderIcon}
                alt="Cancel"
                className="closeIcon_delete_confm"
              />
              Cancel
            </button>
            <button
              className="delet_btn cmn_styling_delete_confm_btn"
              onClick={handleHideUnhideDocument}
            >
              <img
                src={deleteIconBlue}
                alt="Delete"
                className="deleteIcon_delete_confm"
              />
              Continue
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HideUnhideProfilePopup;
