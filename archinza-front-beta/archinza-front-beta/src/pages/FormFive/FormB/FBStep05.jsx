import React, { useEffect } from "react";
import style from "../Form/formfive.module.scss";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";

const formBTypologyArr = [
  "Residential",
  "Hospitality",
  "Hotels",
  "Guest Houses",
  "Retail",
  "Restaurants",
  "Wellness",
  "Salons",
  "Spa",
  "Offices",
  "Corporate",
  "Cafes",
];

const newFormBTypology = ["Residential"];

const FBStep05 = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const formBTypologyList = formBTypologyArr.map((option) => (
    <React.Fragment key={option}>
      <CheckboxButton label={option} labelId={`form-b-${option}`} />
    </React.Fragment>
  ));

  const newFormBTypologyList = newFormBTypology.map((option) => (
    <React.Fragment key={option}>
      <CheckboxButton isChecked={true} label={option} labelId={`form-b-new-${option}`} />
    </React.Fragment>
  ));

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Project Typology</h1>
        <p className={style.description}>Choose As Many</p>
      </div>
      <div className={`${style.steps} ${style.fbstep05}`}>
        <ul className={style.steps_ul}>{formBTypologyList}</ul>
        <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
          <div className={style.field_wrapper}>
            <FullWidthTextField label="Add Others" />
            <p className={style.error}></p>
            <p className={style.blue_notice}>Max 2 Words in A Type.<br />Can Add Upto 5 More.</p>
          </div>
        </div>
        <ul className={`${style.steps_ul} ${style.new_list}`}>
          {newFormBTypologyList}
        </ul>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep(4);
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

export default FBStep05;
