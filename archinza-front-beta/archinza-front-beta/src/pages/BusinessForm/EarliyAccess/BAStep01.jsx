import React, { useEffect } from "react";
import style from "../BusinessAccess/business.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";

const concernsArr = [
  "Consultancy Firm",
  "Business",
  "Agency",
  "Business",
  "Creator Studio",
  "Gallery",
  "Retail Store",
];

const BAStep01 = ({ currentStep, totalSteps, nextStep, progressStatus }) => {
  const concernList = concernsArr.map((option) => (
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
        <h1 className={style.title}>What Do You Own?</h1>
        <p className={style.description}>Choose one</p>
      </div>
      <div className={`${style.steps} ${style.step01}`}>
        <ul className={style.step02_ul}>{concernList}</ul>
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

export default BAStep01;
