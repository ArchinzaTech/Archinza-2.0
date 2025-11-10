import React, { useEffect } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import {
  formBehance,
  formLinkedin,
  formfb,
  forminsta,
  rightarrowwhite,
  websiteicon,
} from "../../../images";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";

const FDStep06 = ({
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
        <h1 className={style.title}>
          Be found by clients,{" "}
          <span className={style.coloured_text}>led by AI!</span>
        </h1>
        <p className={style.description}>Fill One</p>
      </div>
      <div className={`${style.steps} ${style.reduceSpace}`}>
        <div className={`row ${style.owner_row}`}>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <TextFieldWithIcon label="Website" icon={websiteicon} />
              <p className={style.error}></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <TextFieldWithIcon label="Instagram" icon={forminsta} />
              <p className={style.error}></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <TextFieldWithIcon label="Facebook" icon={formfb} />
              <p className={style.error}></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <TextFieldWithIcon label="Linkedin" icon={formLinkedin} />
              <p className={style.error}></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <TextFieldWithIcon label="Behance" icon={formBehance} />
              <p className={style.error}></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField label="Other" />
              <p className={style.error}></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField label="GST Number" />
              <p className={style.error}></p>
            </div>
          </div>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep(10);
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
              previousStep(8);
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

export default FDStep06;
