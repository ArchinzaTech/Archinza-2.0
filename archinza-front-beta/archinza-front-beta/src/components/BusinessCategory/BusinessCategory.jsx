import React from "react";
import "./businessCategory.scss";
import { selected_card_bg } from "../../images";

const BusinessCategory = ({ BusinessData, isActive, onClick }) => {
  return (
    <div
      className={`business_ctg_card ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {isActive && (
        <img src={selected_card_bg} alt="backgroun" className="selcetd_bg" />
      )}
      <img
        src={BusinessData.icon}
        alt={BusinessData?.alt}
        className="business_ctg_img"
      />
      {/* <div className="business_ctg_title">{BusinessData.name}</div> */}

      <div className="business_ctg_title">
      {BusinessData.name.split("|").map((part, index, arr) => (
        <React.Fragment key={index}>
          {part.trim()}
          {index < arr.length - 1 && (
            <span className="vericle_line_grey_ctg_business">|</span>
          )}
        </React.Fragment>
      ))} 
      </div>

     

      <div className="business_ctg_example">
        Example: <br />
        {BusinessData.description}
      </div>
    </div>
  );
};

export default BusinessCategory;
