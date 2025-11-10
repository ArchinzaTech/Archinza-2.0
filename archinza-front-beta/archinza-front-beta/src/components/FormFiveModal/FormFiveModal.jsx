import Modal from "react-bootstrap/Modal";
import "./formfive-modal.scss";
import { imgclose, infoIcon, infoIconDark } from "../../images";

const defineArr = [
  "Design Firm/Consultancy : Architecture, Interior, Landscape, Urban Design, Landscape etc.",
  "Services Design Firm/Consultancy : MEP, Vaastu, HVAC, Lighting, Waterbody, LEED, art etc. related consultancy",
  "Design, Supply & Execute Business : you do both the design and build/install steps of a project",
  "Design, Supply & Execute Business : you do both the design and build/install steps of a project",
  "Product/Material - Seller/Installer/Contractor/Execution Team : you execute/manufacture/install/sell elements of a project, designed by another",
  "E Commerce/Business for Design & Décor : you sell products on your E-commerce store/website",
  "Business : You manufacture products",
];

function FormFiveModal(props) {
  const defineList = defineArr.map((data, i) => (
    <li className="list_item" key={`define-${Math.random(i)}`}>
      {data}
    </li>
  ));
  // console.log()
  return (
    <Modal
      {...props}
      className={`define_modal ${props.className}`}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="define_modal_wrapper">
          {/* <div className="icon">&#9432;</div> */}
          <div className="icon info_icon_v2">
            <img
              src={props.infoIconLightTheme ? infoIconDark : infoIcon}
              alt="Info"
              className="info_icon_v2"
            />
          </div>
          <ul className="define_list">
            {!props.dataText ? (
              props.list ? (
                props.list
              ) : (
                defineList
              )
            ) : (
              <li className="list_item">{props.dataText}</li>
            )}
          </ul>
          <div className="close_icon" onClick={() => props.onHide()}>
            <img
              src={imgclose}
              alt="close"
              className="close_icon"
              loading="lazy"
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default FormFiveModal;
