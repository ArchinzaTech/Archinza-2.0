import React from "react";
import "./customCheckBox.scss";
import { checkMarkOrange } from "../../images";

const CustomCheckBoxInput = ({ label, checked, onChange }) => {
  return (
    <label className="custom-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="custom-checkbox__input"
      />
      <span className="custom-checkbox__box">
        <img
          src={checkMarkOrange}
          alt="Checked"
          className="custom-checkbox__icon"
        />
      </span>
      <span className="custom-checkbox__label">{label}</span>
      {/* <span
        className="custom-checkbox__label"
        dangerouslySetInnerHTML={{ __html: label }}
      ></span> */}
    </label>
  );
};

export default CustomCheckBoxInput;
