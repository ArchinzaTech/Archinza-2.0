import React, { useEffect } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";

const formAProjectBudgetArr = [
  "Anything",
  "1000 - 2500 Rs/sft",
  "2500-5000 Rs/sft",
  "Above 5000 Rs/sft",
];

const FAStep07 = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const formAProjectBudgetList = formAProjectBudgetArr.map((option) => (
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
        <h1 className={style.title}>
          Minimum Project Budget at an average that you have handled
        </h1>
        <p className={style.description}></p>
      </div>
      <div className={`${style.steps} ${style.step06}`}>
        <ul className={style.steps_ul}>{formAProjectBudgetList}</ul>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep(7);
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
              previousStep(5);
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

export default FAStep07;
