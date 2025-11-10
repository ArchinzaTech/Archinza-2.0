import React from "react";
import "./dashboardnotice.scss";

const DashboardNoticeCard = ({ notice }) => {
  return (
    <>
      <div className="notice_card" style={{ cursor: "default" }}>
        {/* <h2 className="heading">{title}</h2> */}
        <p className="desc" style={{ cursor: "default" }}>
          {notice}
        </p>
      </div>
    </>
  );
};

export default DashboardNoticeCard;
