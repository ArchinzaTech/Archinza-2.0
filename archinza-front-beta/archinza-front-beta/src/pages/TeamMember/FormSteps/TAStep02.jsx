import React, { useEffect } from "react";
import style from "../TeamAccess/teammember.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteField from "../../../components/AutoCompleteField/AutoCompleteField";
import { coursesArr } from "../../../db/dataTypesData";

const concernsArr = ["Designer", "Curator", "Lighting Consultant"];

const TAStep02 = ({
  nextStep,
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
        <h1 className={`${style.title} ${style.Step02_title}`}>
          What Job Roles Do You Have Now Or{" "}
          <span className={style.break_title}> Have Worked In The Past? </span>
        </h1>
        <p className={style.description}>Add as many</p>
      </div>
      <div className={`${style.steps} ${style.step01}`}>
        <ul className={style.step02_ul}>{concernList}</ul>
        <div className={style.field_wrapper}>
          <AutoCompleteField
            freeSolo={false}
            popupIcon={""}
            textLabel="Enter roles"
            data={coursesArr}
          />
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

export default TAStep02;
