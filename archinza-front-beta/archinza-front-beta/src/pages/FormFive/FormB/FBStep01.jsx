import React, { useEffect } from "react";
import style from "../Form/formfive.module.scss";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";

const formBServicesArr = [
  "Art",
  "Sculpture",
  "Tiles",
  "Furniture",
  "Wallpaper",
  "Wall Finishes",
  "Textures",
  "Air Conditioning",
  "Ducting",
  "Wooden Flooring",
  "Curtains",
  "Furnishing",
];

const newFormBServicesArr = ["Residential"];

const FBStep01 = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const formBServicesList = formBServicesArr.map((option, i) => (
    <React.Fragment key={option}>
      <CheckboxButton label={option} labelId={`${i}-${option}`} />
    </React.Fragment>
  ));

  const newFormBServicesList = newFormBServicesArr.map((option, i) => (
    <React.Fragment key={option}>
      <CheckboxButton
        isChecked={true}
        label={option}
        labelId={`${i}-${option}`}
      />
    </React.Fragment>
  ));

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Services/Products</h1>
        <p className={style.description}></p>
      </div>
      <div className={`${style.steps} ${style.reduceSpace}`}>
        <ul className={style.steps_ul}>{formBServicesList}</ul>
        <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
          <div className={style.field_wrapper}>
            <FullWidthTextField label="Add Others" />
            <p className={style.error}></p>
          </div>
        </div>
        <ul className={`${style.steps_ul} ${style.new_list}`}>
          {newFormBServicesList}
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

export default FBStep01;
