import React from "react";
import "./businessbenefitsmodal.scss";
import Modal from "react-bootstrap/Modal";
import { bbicon, rightarrowwhite } from "../../images";
import _find from "lodash/find";
import { registrationBusinessURL } from "../helpers/constant-words";
import { Link } from "react-router-dom";

const BusinessBenefitsModal = ({
  features,
  roleColor,
  updatedRole,
  ...rest
}) => {
  return (
    <>
      <div className="business_benefits_popup_wrapper">
        <Modal {...rest} className="business_benefits_popup">
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div className="content_wrapper">
              <img
                width={256}
                height={256}
                src={bbicon}
                alt="cup"
                className="cup_img"
                loading="lazy"
              />
              <h2 className="role">
                Register your business now
                <br/>
                <span className="orange_text">Key Features</span>
              </h2>
              <ul className="feature">
                {features?.map((list) => (
                  <li key={`feature-list-${Math.random()}`}>{list}</li>
                ))}
              </ul>
              <div className="cta_wrapper">
                <Link className="common_cta" to={registrationBusinessURL}>
                  <div className="text">Create Business Account</div>
                  <img
                    src={rightarrowwhite}
                    alt="icon"
                    className="icon"
                    loading="lazy"
                  />
                </Link>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default BusinessBenefitsModal;
