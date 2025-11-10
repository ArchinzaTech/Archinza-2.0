import React from "react";
import "./pofileComplitionBar.scss";
const ProfileComplitionBar = ({ percentage }) => {
  return (
    <div className="profile-completion-container">
      <span className="label">Profile Completion :</span>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="percentage">{percentage}%</span>
    </div>
  );
};

export default ProfileComplitionBar;
