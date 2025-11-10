import Modal from "react-bootstrap/Modal";
import "./businessnamemodal.scss";
import { closeIcon } from "../../images";
import FullWidthTextField from "../TextField/FullWidthTextField";
import { useState } from "react";

function BusinessNameModal(props) {
  const [newBusinessName, setNewBusinessName] = useState(props.currentName);

  const handleClose = () => {
    props.onHide(false);
  };

  const handleSubmit = () => {
    if (newBusinessName.trim()) {
      props.onBusinessNameChange(newBusinessName);
      props.onHide();
    }
  };

  return (
    <Modal
      {...props}
      className="bname_edit"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="define_modal_wrapper">
          <img
            width={30}
            height={30}
            src={closeIcon}
            alt="close"
            className="close_icon"
            onClick={handleClose}
          />
          <div className="edit_content">
            <p className="notice">Edit Business Name</p>
            <p className="current_name">Current Name : {props.currentName}</p>
            <div className="field_wrapper">
              <FullWidthTextField
                lightTheme
                label="Enter New Business Name*"
                name="business_name"
                onChange={(e) => setNewBusinessName(e.target.value)}
              />
            </div>
            <div className="cta_wrapper">
              <button className="solid_cta" onClick={handleSubmit}>
                Save
              </button>
              <button className="solid_cta white" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default BusinessNameModal;
