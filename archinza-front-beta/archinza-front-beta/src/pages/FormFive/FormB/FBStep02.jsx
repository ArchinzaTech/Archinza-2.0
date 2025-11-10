import React, { useEffect } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import { rightarrowwhite } from "../../../images";

const FBStep02 = ({
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  previousStep,
}) => {
  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>
          Be Found By Clients,{" "}
          <span className={style.coloured_text}>led by AI!</span>
        </h1>
        <p className={style.description}>Register your business</p>
      </div>
      <div className={`${style.steps} ${style.fastep01}`}>
        <div className={style.led_ai_row}>
          <div className={style.field_wrapper}>
            <FullWidthTextField label="Business/Firm Name*" />
            <p className={style.error}></p>
          </div>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep();
              window.scrollTo(0, 0);
            }}
          >
            <div className={style.text}>Next</div>
            <img
              src={rightarrowwhite}
              alt="icon"
              className={style.icon}
              loading="lazy"
            />
          </div>
          <div
            className={style.back_button}
            onClick={() => {
              previousStep();
              window.scrollTo(0, 0);
            }}
          >
            Back
          </div>
        </div>
        <LogoutText />
      </div>
    </>
  );
};

export default FBStep02;
