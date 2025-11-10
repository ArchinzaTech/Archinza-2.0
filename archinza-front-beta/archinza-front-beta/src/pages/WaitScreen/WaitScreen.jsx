import React from "react";
import "./waitscreen.scss";
import Modal from "react-bootstrap/Modal";
import { confirmationSvg, waitIcon } from "../../images";

const WaitScreen = (props) => {
  return (
    <>
      <Modal
        {...props}
        animation={false}
        fullscreen={true}
        centered
        className="waitScreen_popup_modal"
        //   dialogClassName="custom-modal-dialog" // Custom class for backdrop
        backdropClassName="custom-modal-backdrop-wait-screen"
      >
        {/* <Modal.Header closeButton></Modal.Header> */}
        {/* <Modal.Header>
        <button className="custom-cancel-btn" onClick={props.handleClose}>
          <img
            src={modalCloseIcon}
            alt="close-icon"
            className="ctm_img_bussine_edit_about closeIcon_confm_popup"
          />
        </button>
      </Modal.Header> */}
        <Modal.Body className="modal_wrapper_waitscreen">
          <div className="d-flex justify-content-center">
            <img
              src={waitIcon}
              alt="confirmation"
              className="confrimation_svg"
              height={171}
              width={171}
            />
          </div>
          <div className="waitScreen_popup_modal_heading">Please Wait!</div>
          <div className="waitScreen_popup_desc">
            "Archinza AI™ is analyzing your business specifics <br /> to find the best
            client matches... <br />This may take a moment."
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WaitScreen;
