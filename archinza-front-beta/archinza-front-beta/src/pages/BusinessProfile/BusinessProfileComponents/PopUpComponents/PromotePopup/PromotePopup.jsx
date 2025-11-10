import React, { useState } from "react";
import "./promote.scss";
import Modal from "react-bootstrap/Modal";
import {stayTunedSvg } from "../../../../../images";

const PromotePopup = (props) => {
  
  return (
    <>
      <Modal
        show={props.show}
        backdrop="static"
        keyboard={false}
        {...props}
        centered
        className="promote_popup_modal"
        backdropClassName="custom-backdrop"
      >
        <Modal.Body>
          <div className="promote_popup_image_wrapper">
            <img
              src={stayTunedSvg}
              alt="Stay Tuned!"
              className="promote_popup_image"
            />
          </div>

          <h2 className="promote_popup__heading">Stay Tuned!</h2>
          <div className="promote_popup_dec">
            The promotion tools are still under construction.
          </div>

          <div className="promote_popup_confirm_btn" onClick={props.onHide}>
            Okay, Got it!
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PromotePopup;
