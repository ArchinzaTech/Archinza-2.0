import React, { useEffect } from "react";
import style from "../Form/formfive.module.scss";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";

const formBDesignArr = [
  "Custom/Bespoke",
  "Modern",
  "Classic/Neo Classic",
  "Vernacular",
  "Minimalist",
  "Maximalist",
  "Sustainable",
  "Artistic",
];

const newFormBDesign = ["Custom/Bespoke"];

const FBStep06 = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const formBDesignList = formBDesignArr.map((option) => (
    <React.Fragment key={option}>
      <CheckboxButton label={option} labelId={`form-b-design-${option}`} />
    </React.Fragment>
  ));

  const newFormBDesignList = newFormBDesign.map((option) => (
    <React.Fragment key={option}>
      <CheckboxButton
        isChecked={true}
        label={option}
        labelId={`form-b-design-${option}`}
      />
    </React.Fragment>
  ));

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Firm Design Style</h1>
        <p className={style.description}>Choose As Many</p>
      </div>
      <div className={`${style.steps} ${style.step01}`}>
        <ul className={style.steps_ul}>{formBDesignList}</ul>
        <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
          <div className={style.field_wrapper}>
            <FullWidthTextField label="Add Others" />
            <p className={style.error}></p>
          </div>
        </div>
        <ul className={`${style.steps_ul} ${style.new_list}`}>
          {newFormBDesignList}
        </ul>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep(5);
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
              previousStep(3);
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

export default FBStep06;
