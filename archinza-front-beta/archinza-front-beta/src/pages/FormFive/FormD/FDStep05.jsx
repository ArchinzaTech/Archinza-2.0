import React, { useEffect } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import RadioButton from "../../../components/RadioButton/RadioButton";
import { rightarrowwhite } from "../../../images";

const formDBusEstablishmentArr = [
  "0 - 5 years",
  "5 - 10 years",
  "10 - 20 years",
  "20+ years",
];

const FDStep05 = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const formDBusEstablishmentList = formDBusEstablishmentArr.map((option) => (
    <React.Fragment key={option}>
      <RadioButton
        label={option}
        labelId={`form-d-business-establishment-${option}`}
      />
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
        <ul className={style.steps_ul}>{formDBusEstablishmentList}</ul>
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

export default FDStep05;
