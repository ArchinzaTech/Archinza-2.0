import React from "react";
import "./reachcard.scss";
import { rightarrowwhite } from "../../images";
import { Link } from "react-router-dom";
import { useWindowSize } from "react-use";

const ReachCard = ({ ctaText, noticeText }) => {
  const { width } = useWindowSize();
  return (
    <div className="reach_card">
      <div className="row ">
        <div className="col-sm-6 col-md-6">
          <h2 className="reach_clients">
            Reach More Clients With{" "}
            <span className="orange_text">Archinza</span>
          </h2>
        </div>
        <div className="col-sm-6 col-md-6">
          <div className="button_container">
            <Link to={() => false} className="cta_wrapper">
              <p className="cta_text">
                {ctaText}
                {width < 600 && (
                  <img
                    src={rightarrowwhite}
                    alt="arrow"
                    className="arrow_img"
                  />
                )}
              </p>
              {width > 600 && (
                <img src={rightarrowwhite} alt="arrow" className="arrow_img" />
              )}
            </Link>
            <div className="notice">{noticeText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReachCard;
