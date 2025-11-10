import React from "react";
import "./confirmationPopup.scss";
import Modal from "react-bootstrap/Modal";
import { confirmationSvg, modalCloseIcon } from "../../../images";

const ConfirmationPopup = (props) => {
  return (
    <>
      <Modal
        {...props}
        centered
        className="bussinessEdit_about_Modal confirmation_popup_modal"
        dialogClassName="custom-modal-dialog" // Custom class for backdrop
      backdropClassName="custom-backdrop-confirmation"
      >
        {/* <Modal.Header closeButton></Modal.Header> */}
        <Modal.Header>
          <button className="custom-cancel-btn" onClick={props.handleClose}>
            <img
              src={modalCloseIcon}
              alt="close-icon"
              className="ctm_img_bussine_edit_about closeIcon_confm_popup"
            />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <img src={confirmationSvg} alt="confirmation" className="confrimation_svg" />
          </div>
          <div className="confrimation_popup_desc">
            By submitting your profile and work, you confirm that the
            information provided is accurate, complete, and represents your own
            original contributions. You are solely responsible for ensuring that
            all content submitted does not infringe upon the intellectual
            property rights or other rights of third parties. Archinza shall not
            be held liable for any claims, damages, or legal issues arising from
            copyright infringement or other violations related to the content
            you submit.
          </div>
          <button type="submit" className="popup_common_btn" onClick={props.handleSubmit}>
            I AGREE
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConfirmationPopup;
