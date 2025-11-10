import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { countries } from "../../../db/dataTypesData";
import {
  blackDeleteicon,
  deleteicon,
  plusicon,
  rightarrowwhite,
} from "../../../images";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import AutoCompleteField from "../../../components/AutoCompleteField/AutoCompleteField";
import { useWindowSize } from "react-use";

const FAStep03LTOld = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const [secondRow, setSecondRow] = useState(false);
  const { width } = useWindowSize();

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Business/Firm Location</h1>
      </div>
      <div className={`${style.steps} ${style.fastep02}`}>
        <div className={`row ${style.location_row}`}>
          <div className={`col-md-6 ${style.location_column}`}>
            <div className={style.field_wrapper}>
              <AutoCompleteField
                lightTheme
                textLabel="Country"
                data={countries}
              />
              <p className={style.error}>Error message here error message</p>
            </div>
          </div>
          <div className={`col-md-6 ${style.location_column}`}>
            <div className={style.field_wrapper}>
              <AutoCompleteField
                lightTheme
                textLabel="State"
                data={countries}
              />
              <p className={style.error}>Error message here error message</p>
            </div>
          </div>
          <div className={`col-md-6 ${style.location_column}`}>
            <div className={style.field_wrapper}>
              <AutoCompleteField
                lightTheme
                textLabel="City"
                data={countries}
              />
              <p className={`${style.error} ${style.error_absolute}`}>Error message here error message</p>
            </div>
          </div>
          <div className={`col-md-6 ${style.location_column}`}>
            <div className={style.field_wrapper}>
              <FullWidthTextField
                lightTheme
                type="number"
                label="Enter Pin Code"
              />
              <p className={`${style.error} ${style.error_absolute}`}>Error message here error message</p>
            </div>
            <div
              className={style.add_delete_icon}
              onClick={() => setSecondRow(true)}
            >
              <img
                style={{ margin: width < 600 && 0 }}
                src={plusicon}
                alt="icon"
                className={style.plusicon}
                loading="lazy"
              />
              <img
                style={{ visibility: "hidden", display: width < 600 && "none" }}
                src={deleteicon}
                alt="icon"
                className={style.deleteicon}
                loading="lazy"
              />
            </div>
          </div>
        </div>
        {/* Row two demonstration */}
        {/* Row two demonstration */}
        {/* Row two demonstration */}
        {secondRow === true && (
          <div className={`row ${style.location_row}`}>
            <div className={`col-md-6 ${style.location_column}`}>
              <div className={style.field_wrapper}>
                <AutoCompleteField
                  lightTheme
                  textLabel="Country"
                  data={countries}
                />
                <p className={style.error}></p>
              </div>
            </div>
            <div className={`col-md-6 ${style.location_column}`}>
              <div className={style.field_wrapper}>
                <AutoCompleteField
                  lightTheme
                  textLabel="State"
                  data={countries}
                />
              </div>
            </div>
            <div className={`col-md-6 ${style.location_column}`}>
              <div className={style.field_wrapper}>
                <AutoCompleteField
                  lightTheme
                  textLabel="City"
                  data={countries}
                />
              </div>
            </div>
            <div className={`col-md-6 ${style.location_column}`}>
              <div className={style.field_wrapper}>
                <FullWidthTextField
                  lightTheme
                  type="number"
                  label="Enter Pin Code"
                />
              </div>
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
                  onClick={() => setSecondRow(false)}
                />
              </div>
            </div>
          </div>
        )}
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

export default FAStep03LTOld;
