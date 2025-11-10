import React, { useEffect } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import RadioButton from "../../../components/RadioButton/RadioButton";
import { rightarrowwhite } from "../../../images";

const formAMinFeeArr = [
  "1L and below",
  "1 - 5L",
  "5 - 10L",
  "10L +",
];

const FAStep11 = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const formAMinFeeList = formAMinFeeArr.map((option) => (
    <React.Fragment key={option}>
      <RadioButton extraSpace={true} label={option} labelId={`PF${option}`} />
    </React.Fragment>
  ));

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Minimum fee charged currently for the smallest project?</h1>
        <p className={style.description}></p>
      </div>
      <div className={`${style.steps} ${style.step10}`}>
        <ul className={style.steps_ul}>{formAMinFeeList}</ul>
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

export default FAStep11;
