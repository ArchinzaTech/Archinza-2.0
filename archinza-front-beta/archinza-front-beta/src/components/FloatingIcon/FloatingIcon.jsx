import React from "react";
import "./floatingicon.scss";
import {
  floatingIcon,
  floatingIcon1,
  shareWhatsappIcon,
  shareWhatsappIconWhite,
  whatsAppIconNew,
} from "../../images";
import { Link } from "react-router-dom";

const FloatingIcon = ({ isEnabled = true, onClick }) => {
  if (!isEnabled) {
    return null;
  }

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
      <div className="floating_sec1">
        <Link to={() => false} onClick={handleWhatsAppClick}>
          <div className="img_wrapper">
            {/* <img
              src={shareWhatsappIconWhite}
              alt="whatsapp"
              className="floating_icon1"
            /> */}

            <img
              src={whatsAppIconNew}
              alt="whatsapp"
              className="floating_icon1"
            />

            {/* <img
              src={shareWhatsappIcon}
              alt="whatsapp"
              className="floating_icon2"
            /> */}
          </div>
        </Link>
      </div>
    </>
  );
};

export default FloatingIcon;
