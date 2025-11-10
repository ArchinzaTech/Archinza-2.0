import React from "react";
import "./lightthemebackground.scss";
import { archinzaLabel, images, lightthemebackground } from "../../images";

const LightThemeBackground = () => {
  return (
    <>
      <div className="my_container custom_container">
        <div className="lt_anim_container">
         <img
            width={1920}
            height={1080}
            src={lightthemebackground}
            alt={images.archinzaFormBg.alt}
            className="background_img"
            loading="lazy"
          />
           {/* <img
            width={878}
            height={948}
            src={archinzaLabel}
            alt="archinza label"
            className="archinza_label"
            loading="lazy"
          /> */}
          {/* <div className="pulsating-circle pulsating-circle1"></div>
          <div className="pulsating-circle pulsating-circle2"></div>
          <div className="pulsating-circle pulsating-circle3"></div> */}
        </div>
      </div>
    </>
  );
};

export default LightThemeBackground;
