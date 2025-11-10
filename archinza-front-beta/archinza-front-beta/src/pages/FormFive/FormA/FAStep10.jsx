import React, { useEffect } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import RadioButton from "../../../components/RadioButton/RadioButton";
import { rightarrowwhite } from "../../../images";

const expArr = ["0 - 5 years", "5 - 10 years", "10 - 20 years", "20+ years"];

const FAStep10 = ({ nextStep, previousStep, currentStep, totalSteps, progressStatus }) => {
  const expList = expArr.map((option) => (
    <React.Fragment key={option}>
      <RadioButton label={option} labelId={option} />
    </React.Fragment>
  ));

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Business/Firm established since</h1>
        <p className={style.description}></p>
      </div>
      <div className={`${style.steps} ${style.step10}`}>
        <ul className={style.steps_ul}>{expList}</ul>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep(10);
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
              previousStep(8);
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

export default FAStep10;
