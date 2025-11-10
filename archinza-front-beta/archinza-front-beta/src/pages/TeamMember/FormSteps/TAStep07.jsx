import React, { useEffect } from "react";
import style from "../TeamAccess/teammember.module.scss";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";


const concernsArr = [
  "Jobs",
  "Education & Knowledge on trends/materials",
  "Upskill & learn new software",
  "Knowledge/Confidence to Start my own firm",
  "Searching products materials for projects",
];

const TAStep07 = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const concernList = concernsArr.map((option) => (
    <React.Fragment key={option}>
      <CheckboxButton label={option} labelId={option} />
    </React.Fragment>
  ));

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>
          What Are Your Largest Concerns/Unmet Needs?
        </h1>
        <p className={style.description}>Choose as many</p>
      </div>
      <div className={`${style.steps} ${style.step01}`}>
        <ul className={style.step02_ul}>{concernList}</ul>
        <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
          <div className={style.field_wrapper}>
            <FullWidthTextField label="Add Others" />
            <p className={style.error}></p>
          </div>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep(3);
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
              previousStep(1);
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

export default TAStep07;
