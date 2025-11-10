import React, { useEffect, useState } from "react";
import "./galleryPopupComn.scss";
import Modal from "react-bootstrap/Modal";
import {
  deleteIconCircleOrange,
  eyeClose,
  modalClose,
  moveIocn,
  pinIocn,
} from "../../../../../images";

const BottomSheetOptions = (props) => {
  const [animationClass, setAnimationClass] = useState("opening");
  // When modal opens, add "opening" class
  useEffect(() => {
    if (props.show) {
      setAnimationClass("opening");
    }
  }, [props.show]);

  // When modal is closing, delay actual close to complete animation
  const handleClose = () => {
    setAnimationClass("closing");
    setTimeout(() => {
      props.handleClose();
    }, 100); // Match animation duration
  };

  return (
    <>
      <Modal
        {...props}
        centered
        // className="Where_We_excel_popup"
        className={`Where_We_excel_popup ${animationClass} Bottom_sheet_options`}
        backdropClassName="custom-backdrop"
        onHide={handleClose}
        // onExit={() => setIsClosing(true)}
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
          <div className="bottom_options_wrapper">
            <div
              className="bottom_option"
              onClick={() => {
                props.handelOpenDelete();
                handleClose();
              }}
            >
              <img
                src={deleteIconCircleOrange}
                alt="Delete"
                className="bottom_option_img"
              />
              <div className="bottom_option_title">Delete Images</div>
            </div>
            {props.workplaceBottomSheet !== true && (
              <>
                <div
                  className="bottom_option"
                  onClick={() => {
                    props.handleHidePopupOpen();
                    handleClose();
                  }}
                >
                  <img
                    src={eyeClose}
                    alt="Delete"
                    className="bottom_option_img"
                  />
                  <div className="bottom_option_title">Hide Images</div>
                </div>
                <div
                  className="bottom_option"
                  onClick={() => {
                    props.handlePinPopupOpen();
                    handleClose();
                  }}
                >
                  <img
                    src={pinIocn}
                    alt="Delete"
                    className="bottom_option_img"
                  />
                  <div className="bottom_option_title">Pin Images</div>
                </div>
                <div
                  className="bottom_option border-0"
                  onClick={() => {
                    props.handelOpenMove();
                    handleClose();
                  }}
                >
                  <img
                    src={moveIocn}
                    alt="Delete"
                    className="bottom_option_img"
                  />
                  <div className="bottom_option_title">Move Images</div>
                </div>
              </>
            )}

            {/* <div
              className="bottom_option border-0"
              onClick={() => {
                props.handelOpenRecentlyDeleted();
                handleClose();
              }}
            >
              <div className="bottom_option_title">Recently Deleted</div>
            </div> */}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BottomSheetOptions;
