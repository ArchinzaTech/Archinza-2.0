import React, { useEffect } from "react";
import style from "../TeamAccess/teammember.module.scss";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";

const concernsArr = [
  "Jobs",
  "Searching products materials for projects",
  "Education & Knowledge on Trends/Materials",
  "Upskill & Learn New Software",
  "Knowledge/Confidence to Start my own firm",
];

const SAStep05 = ({
  previousStep,
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
        <p className={`${style.description} ${style.description_step05}`}>
          Choose as many
        </p>
      </div>
      <div className={`${style.steps} ${style.step01}`}>
        <ul className={style.step02_ul}>{concernList}</ul>
        <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
          <div className={style.field_wrapper}>
            <FullWidthTextField label="Add More" />
            <p className={style.error}></p>
          </div>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div className={style.next_button}>
            <div className={style.text}>Submit</div>
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
              previousStep(4);
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

export default SAStep05;
