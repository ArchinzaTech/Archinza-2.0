import React from "react";

const DashboardPerkCard = (props) => {
  return (
    <div
      className="perk_card"
      data-aos="fade-up"
      data-aos-delay={props.id * 100}
      key={`perk-${props.id}`}
    >
      <img
        width={60}
        height={60}
        src={props.icon}
        alt="icon"
        className="perk_icon"
        loading="lazy"
      />
      <p className="desc" dangerouslySetInnerHTML={{__html: props.desc}} />
    </div>
  );
};

export default DashboardPerkCard;
