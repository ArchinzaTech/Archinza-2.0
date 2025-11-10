import React, { useEffect, useState } from "react";
import "./whereWePopup.scss";
import Modal from "react-bootstrap/Modal";
import { modalClose } from "../../../../images";

const TestPopup = (props) => {
  const [animationClass, setAnimationClass] = useState("opening");
  const { data } = props; // data contains { emptyFields }

  useEffect(() => {
    if (props.show) {
      setAnimationClass("opening");
    }
  }, [props.show]);

  const handleClose = () => {
    setAnimationClass("closing");
    setTimeout(() => {
      props.handleClose();
    }, 100);
  };

  return (
    <Modal
      {...props}
      centered
      className={`Where_We_excel_popup ${animationClass}`}
      backdropClassName="custom-backdrop"
      onHide={handleClose}
    >
      <Modal.Header>
        <button className="custom-cancel-btn" onClick={handleClose}>
          <img
            src={modalClose}
            alt="close-icon"
            className="ctm_img_Where_We_excel_popup"
          />
        </button>
      </Modal.Header>
      <Modal.Body>
        <h2 className="Where_We_excel_popup_heading">
          {data?.title || "Pending Fields"}
        </h2>{" "}
        <ul className="common_ul_popups">
          {data?.emptyFields?.length > 0 ? (
            data.emptyFields.map((field, index) => (
              <li key={index} className="common_li_popup">
                {field.replace(/_/g, " ")}{" "}
                {/* Replace underscores with spaces for readability */}
              </li>
            ))
          ) : (
            <li className="common_li_popup">No pending fields</li>
          )}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default TestPopup;
