import React from "react";
import "./blinkingdots.scss";
import { archinzaLabel, images } from "../../images";
import useTheme from "../../components/useTheme/useTheme";

const BlinkingDots = () => {
  // const { theme } = useTheme();
  const theme = "dark";
  return (
    <>
      <div className="my_container custom_container">
        <div
          className="anim_container"
          style={{ background: theme === "dark" ? "#000000" : "#fff" }}
        >
          {theme === "dark" && (
            <img
              width={1920}
              height={1080}
              src={images.archinzaFormBg.image}
              alt={images.archinzaFormBg.alt}
              className="background_img"
            />
          )}

          <img
            width={878}
            height={948}
            src={archinzaLabel}
            alt="archinza label"
            className="archinza_label"
            loading="lazy"
            style={{
              opacity: theme === "dark" ? "1" : "0.17",
            }}
          />
          {theme === "dark" && (
            <>
              <div className="pulsating-circle pulsating-circle1"></div>
              <div className="pulsating-circle pulsating-circle2"></div>
              <div className="pulsating-circle pulsating-circle3"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlinkingDots;
