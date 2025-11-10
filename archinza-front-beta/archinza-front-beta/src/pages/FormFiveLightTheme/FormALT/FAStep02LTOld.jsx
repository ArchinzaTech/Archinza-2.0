import React, { useEffect } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { blackDeleteicon, plusicon, rightarrowwhite } from "../../../images";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import SelectDropdown from "../../../components/SelectDropdown/SelectDropdown";

const concernsArr = [
  "Hiring",
  "Knowledge on trends/materials",
  "Add new skill sets to the business",
  "Sampling",
  "Finding products materials for live projects",
  "Marketing & Reach to get new clients",
  "Maintaining product/material library",
];

const FAStep02LTOld = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Principal Designers/Owners/Founders</h1>
      </div>
      <div className={`${style.steps} ${style.fastep02}`}>
        <div className={`row ${style.owner_row}`}>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField lightTheme label="Add Name" />
              <p className={style.error}>Enter valid name</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <SelectDropdown
                lightTheme
                key="Highest Qualification"
                label="Highest Qualification*"
                labelId="highestqualification"
                data={concernsArr}
              />
              <p className={style.error}>Enter highest Qualification</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField lightTheme label="Email ID*" />
              <p className={style.error}>Enter email id</p>
            </div>
          </div>
        </div>
        <div className={style.add_category}>
          <div className={style.dashed_line}></div>
          <div className={style.add_flex}>
            <img src={plusicon} alt="icon" className={style.icon} />
            <div className={style.title}>Add more names</div>
          </div>
        </div>
        <div className={`row ${style.owner_row}`}>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField lightTheme label="Add Name" />
              <p className={style.error}>Error message here error message</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <SelectDropdown
                lightTheme
                key="highestqualification"
                label="Highest Qualification*"
                labelId="highestqualification"
                data={concernsArr}
              />
              <p className={style.error}>Error message here error message</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`${style.field_wrapper} ${style.field_with_crud}`}>
              <FullWidthTextField lightTheme label="Email ID*" />
              <p className={`${style.error} ${style.error_absolute}`}>Error message here error message</p>
              <div className={style.add_delete_icon}>
                <img
                  src={plusicon}
                  alt="icon"
                  className={style.plusicon}
                  loading="lazy"
                />
                <img
                  src={blackDeleteicon}
                  alt="icon"
                  className={style.deleteicon}
                  loading="lazy"
                  style={{ visibility: "visible" }}
                />
              </div>
            </div>
          </div>
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
          <div
            className={style.back_button}
            onClick={() => {
              previousStep();
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

export default FAStep02LTOld;
