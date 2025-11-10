import React from "react";
import "./GlowCta.scss";
import { Link } from "react-router-dom";
import { rightarrowwhite } from "../../images";
import { useWindowSize } from "react-use";

const GlowCta = ({ link, text }) => {
  const { width } = useWindowSize();
  return (
    <>
      <div className="glowcta_wrapper">
        <Link to={link} className="cta_link">
          <p className="cta_text">
            <span dangerouslySetInnerHTML={{ __html: text }}></span>
            {width < 600 && (
              <img src={rightarrowwhite} alt="arrow" className="arrow_img" />
            )}
          </p>
          {width > 600 && (
            <img src={rightarrowwhite} alt="arrow" className="arrow_img" />
          )}
        </Link>
      </div>
    </>
  );
};

export default GlowCta;
