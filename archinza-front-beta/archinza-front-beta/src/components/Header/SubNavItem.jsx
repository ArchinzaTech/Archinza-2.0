import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const SubNavItem = ({ dropDownData, dropDownIndex }) => {
  const [subIndex, setSubIndex] = useState(null);
  const handleSubIndex = (i) => {
    if (subIndex === i) {
      setSubIndex(null);
    } else {
      setSubIndex(i);
    }
  };
  return (
    <>
      <h5
        className="dropdown_heading"
        onClick={() => handleSubIndex(dropDownIndex)}
      >
        {dropDownData.dropDowntitle}{" "}
        <span className="dropdown_heading_plus_minus">
          {subIndex === dropDownIndex ? (
            <img src="https://via.placeholder.com/20" alt="down arrow img" loading="lazy" />
          ) : (
            <img
              src="https://via.placeholder.com/20"
              className="down_arrow"
              alt="down arrow img"
              loading="lazy"
            />
          )}
        </span>
      </h5>
      <div
        className={`dropdown_list ${
          subIndex === dropDownIndex ? "active" : ""
        }`}
      >
        {dropDownData.linkArr.map((linkData, i) => (
          <div className="dropdown_list_item" key={linkData.id}>
            <NavLink className="dropdown_list_item_link" to={linkData.navLink}>
              {linkData.navTitle}
            </NavLink>
          </div>
        ))}
      </div>
    </>
  );
};

export default SubNavItem;
