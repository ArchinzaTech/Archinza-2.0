import React from "react";
import "./toggleSwitch.scss";

const ToggleSwitch = ({ isChecked, onChange }) => {
  return (
    <div className="toggle_wrapper_switch">
      <input
        type="checkbox"
        className="toggle_input_switch"
        checked={isChecked}
        onChange={onChange}
      />
      <span className="toggle_indicator_switch"></span>
    </div>
  );
};

export default ToggleSwitch;
