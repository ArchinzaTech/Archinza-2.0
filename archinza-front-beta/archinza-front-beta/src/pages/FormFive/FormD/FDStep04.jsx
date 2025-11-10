import React, { useEffect } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import RadioButton from "../../../components/RadioButton/RadioButton";
import { rightarrowwhite } from "../../../images";

const formDLocationArr = ["Anywhere", "In my country", "In my city", "NA"];

const FDStep04 = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const formDLocationList = formDLocationArr.map((option) => (
    <React.Fragment key={option}>
      <RadioButton
        label={option}
        labelId={`form-d-project-location-${option}`}
      />
    </React.Fragment>
  ));

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Project Location Preference</h1>
        <p className={style.description}></p>
      </div>
      <div className={`${style.steps} ${style.step08}`}>
        <ul className={style.steps_ul}>{formDLocationList}</ul>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep(9);
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
              previousStep(7);
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

export default FDStep04;
