import React, { useEffect } from "react";
import style from "../BusinessAccess/business.module.scss";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";


const concernsArr = [
  "Sampling",
  "Knowledge on trends/materials",
  "Add new skill sets to the business",
  "Hiring",
  "Marketing & Reach to get new clients",
  "Finding products materials for live projects",
  "Maintaining product/material library",
];

const BAStep03 = ({
  currentStep,
  totalSteps,
  previousStep,
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
          What are your largest concerns/unmet Needs?
        </h1>
        <p className={style.description}>Choose as many</p>
      </div>
      <div className={`${style.steps} ${style.step02}`}>
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
          >
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
              previousStep(2);
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

export default BAStep03;
