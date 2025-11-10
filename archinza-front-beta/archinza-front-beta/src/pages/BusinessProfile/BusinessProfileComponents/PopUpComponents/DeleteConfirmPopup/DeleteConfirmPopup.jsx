import React from "react";
import "./deleteConfirmPopup.scss";
import Modal from "react-bootstrap/Modal";
import {
  closeOrangBorderIcon,
  deleteIconBlue,
  modalCloseIcon,
  TrashOrange,
} from "../../../../../images";

const DeleteConfirmPopup = (props) => {
  const handleDeleteImages = () => {
    props.deleteImages(props?.data);
  };

  const deleteMessage =
    props.action === "permanent"
      ? "will be permanently deleted. Once removed, they cannot be restored."
      : ` will be deleted from your dashboard. Backed-up photos stay in "Recently Deleted" for 30 days in the folder.`;
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
        <Modal.Header>
          <button className="custom-cancel-btn" onClick={props.handleClose}>
            <img
              src={modalCloseIcon}
              alt="close-icon"
              className="ctm_img_bussine_edit_about"
            />
          </button>
        </Modal.Header>
        <Modal.Body>
          <h2 className="about_modal_bussines_heading">
            Delete {props?.data?.length} Photo(s)?
          </h2>

          <div className="delet_confirmation_box_conatiner">
            <div className="delet_confirmation_box">
              <img
                src={TrashOrange}
                alt="Delete"
                className="delete_confirmation_img"
              />
              <div className="desc_delete_confirmation_msg">
                {props?.data?.length} photo(s) {deleteMessage}
              </div>
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
              onClick={handleDeleteImages}
            >
              <img
                src={deleteIconBlue}
                alt="Delete"
                className="deleteIcon_delete_confm"
              />
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeleteConfirmPopup;
