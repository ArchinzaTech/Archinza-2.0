import React, { useEffect } from "react";
import style from "../TeamAccess/teammember.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import AutoCompleteField from "../../../components/AutoCompleteField/AutoCompleteField";
import { coursesArr } from "../../../db/dataTypesData";

const TAStep01 = ({ nextStep, currentStep, totalSteps, progressStatus }) => {
  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>
          What Job Roles Do You Have Now Or{" "}
          <span className={style.break_title}> Have Worked In The Past? </span>
        </h1>
      </div>
      <div className={`${style.steps} ${style.step01}`}>
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
              nextStep(2);
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
        </div>
        <LogoutText />
      </div>
    </>
  );
};

export default TAStep01;
