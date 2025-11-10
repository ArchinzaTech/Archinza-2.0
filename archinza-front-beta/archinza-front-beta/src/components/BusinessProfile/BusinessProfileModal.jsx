import Modal from "react-bootstrap/Modal";
import "./businessprofilemodal.scss";

function BusinessProfileModal(props) {
  const defineList = props.dataarr.map((data, i) => (
    <li className="list_item" key={`define-${Math.random(i)}`}>
      {data}
    </li>
  ));
  return (
    <Modal
      {...props}
      className={`define_modal ${props.className}`}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="define_modal_wrapper">
          <div className="icon">&#9432;</div>
          <ul className="define_list">{defineList}</ul>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default BusinessProfileModal;
