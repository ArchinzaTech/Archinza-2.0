import React, { useEffect, useRef, useState } from "react";
import "./rolechangecongrats.scss";
import Modal from "react-bootstrap/Modal";
import { changeRoleCup } from "../../images";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import config from "../../config/config";
import _find from "lodash/find";
import RadioButton from "../RadioButton/RadioButton";
import { changeRoleURL, dashboardURL } from "../helpers/constant-words";
import { Link } from "react-router-dom";

const RoleChangeCongrats = ({
  features,
  roleColor,
  updatedRole,
  showConfetti,
  isItConfirmationPopup,
  modelCloseEvent,
  ...rest
}) => {
  const { windowHeight } = useWindowSize();
  const refContainer = useRef();
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (refContainer.current) {
        setDimensions({
          width: refContainer.current.offsetWidth,
          //   height: refContainer.current.offsetHeight,
        });
      }
    };

    updateDimensions();

    // Add event listener for window resize
    window.addEventListener("resize", updateDimensions);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);
  const handleWhatsAppClick = () => {
    const message = "Hi";
    const phoneNumber = "919871185558";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };
  return (
    <>
      <div className="change_role_popup_wrapper">
        <Modal {...rest} className="change_role_popup">
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body ref={refContainer}>
            {(showConfetti === undefined || showConfetti) && (
              <div className="confetti_wrapper">
                <ReactConfetti
                  width={dimensions.width}
                  height={windowHeight}
                  colors={["#a67c0066", "#bf9b3066", "#ffbf0066"]}
                />
              </div>
            )}
            {isItConfirmationPopup ? (
              <div className="content_wrapper">
                <h2 className="role">
                  Looks like you’re a non-industry user, and a design
                  Enthusiast!
                </h2>
                <p className="access" key={Math.random()}>
                  Please continue in your current role on Archinza to get the
                  most out of our features designed just for you:
                </p>
                <ul className="feature">
                  <li key={`feature-list-${Math.random()}`}>
                    Stay updated on Design Events
                  </li>
                  <li key={`feature-list-${Math.random()} `}>
                    <a
                      href="/"
                      target="_"
                      className="text-decoration-underline"
                      onClick={handleWhatsAppClick}
                    >
                      Click here
                    </a>{" "}
                    to start chatting with the Archinza Bot (your customised AI
                    led design assistant) on WhatsApp
                  </li>
                  <li key={`feature-list-${Math.random()}`}>
                    Search for Products, Materials, and People (Coming Soon)
                  </li>
                </ul>

                <div className="design_wrapper">
                  <form action="">
                    <ul className="radio_container radio_container_form De_change_role_confirmation">
                      <Link to={dashboardURL}>
                        <RadioButton
                          label="Okay"
                          labelId="okay"
                          name="DE_change_role"
                          value="okay"
                        />
                      </Link>
                      {/* <RadioButton
                        label="No"
                        labelId="No"
                        name="DE_change_role"
                        value="No"
                        onClick={modelCloseEvent}
                      /> */}
                    </ul>
                  </form>
                </div>
              </div>
            ) : (
              <div className="content_wrapper">
                <img src={changeRoleCup} alt="cup" className="cup_img" />
                <h2 className="role">
                  Congratulations! <br /> You've Switched To <br />
                  <span style={{ color: roleColor }}>
                    {_find(config.user_types, { code: updatedRole })?.name}
                  </span>
                  .
                </h2>
                <p className="access" key={Math.random()}>
                  You’ll soon have access to these features:
                </p>
                <ul className="feature">
                  {features?.map((list) => (
                    <li key={`feature-list-${Math.random()}`}>{list}</li>
                  ))}
                </ul>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default RoleChangeCongrats;
