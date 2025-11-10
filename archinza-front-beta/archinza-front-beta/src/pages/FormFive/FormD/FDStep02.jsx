import React, { useEffect } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import SelectDropdown from "../../../components/SelectDropdown/SelectDropdown";
import { deleteicon, plusicon, rightarrowwhite } from "../../../images";

const formDHighestQualificationArr = [
  "Option 01",
  "Option 02",
  "Option 03",
];

const FDStep02 = ({
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
        <p className={style.description}></p>
      </div>
      <div className={`${style.steps} ${style.fastep02}`}>
        <div className={`row ${style.owner_row}`}>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField label="Add Name" />
              <p className={style.error}></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <SelectDropdown
                key="Highest Qualification"
                label="Highest Qualification*"
                labelId="highestqualification"
                data={formDHighestQualificationArr}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField label="Email ID*" />
            </div>
          </div>
        </div>
        <div className={style.add_category}>
          <div className={style.dashed_line}></div>
          <div className={style.add_flex}>
            <img src={plusicon} alt="icon" className={style.icon} />
            <div className={style.title}>Add more names</div>
          </div>
          <div className={style.dashed_line}></div>
        </div>
        <div className={`row ${style.owner_row}`}>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField label="Add Name" />
              <p className={style.error}></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <SelectDropdown
                key="Highest Qualification"
                label="Highest Qualification*"
                labelId="highestqualification"
                data={formDHighestQualificationArr}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className={`${style.field_wrapper} ${style.field_with_crud}`}>
              <FullWidthTextField label="Email ID*" />
              <div className={style.add_delete_icon}>
                <img
                  src={plusicon}
                  alt="icon"
                  className={style.plusicon}
                  loading="lazy"
                />
                <img
                  src={deleteicon}
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

export default FDStep02;
