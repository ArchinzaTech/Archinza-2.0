import Modal from "react-bootstrap/Modal";
import "./deleteconfirmationmodal.scss";
import { closeIcon, deleteiconcircle } from "../../images";

function DeleteConfirmationModal(props) {
  const handleClose = () => {
    props.onHide(false);
  };

  const handleDelete = () => {
    props.onConfirmDelete();
    handleClose();
  };

  return (
    <Modal
      {...props}
      className="delete_confirmation_modal"
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
          <div className="delete_content">
            <img
              width={170}
              height={170}
              src={deleteiconcircle}
              alt="delete icon"
              className="delete_icon"
            />
            <p className="notice">
              Are you sure you want to permanently delete this item?
            </p>
            <div className="cta_wrapper">
              <button className="solid_cta" onClick={handleDelete}>
                Delete
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

export default DeleteConfirmationModal;
