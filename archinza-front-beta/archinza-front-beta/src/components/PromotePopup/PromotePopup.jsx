import React, { useState } from "react";
import "./promote.scss";
import Modal from "react-bootstrap/Modal";
import { comingSoonIcon } from "../../images";

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
              src={comingSoonIcon}
              alt="Stay Tuned!"
              className="promote_popup_image"
            />
          </div>

          <h2 className="promote_popup__heading">{props.title}</h2>
          <div className="promote_popup_dec">{props.desc}</div>


          <div className="promote_popup_confirm_btn" onClick={props.onHide}>
            {props.ctaText ? props.ctaText : "Okay, Got it!"}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PromotePopup;
