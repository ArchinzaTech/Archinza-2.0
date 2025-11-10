import React, { useEffect, useState } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import { formupload, rightarrowwhite } from "../../../images";
import CountryCodeDropdown from "../../../components/CountryCodeDropdown/CountryCodeDropdown";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";

const FDStep52 = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Your Contact Details</h1>
        <p className={style.description}></p>
      </div>
      <div className={`${style.steps} ${style.fastep14}`}>
        <div className={`row`}>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField label="Name of the Contact person*" />
              <p className={style.error}></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <div className="row">
                <div className="col-md-4 ps-0">
                  <div className={style.country_code}>
                    <CountryCodeDropdown textLabel="Code" />
                    <p className="error"></p>
                  </div>
                </div>
                <div className="col-md-8 pe-0">
                  <div className={style.country_code}>
                    <FullWidthTextField label="Phone*" type="number" />
                    <p className="error"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField label="WhatsApp number*" />
              <p className={style.error}></p>
            </div>
            <div className={style.checkbox_wrapper}>
              <label className={style.checkbox_label} htmlFor="sameas">
                <input
                  type="checkbox"
                  className={style.check_box}
                  id="sameas"
                />
                Same as phone number
              </label>
            </div>
            <div className={style.field_wrapper}>
              <FullWidthTextField label="GST number*" />
              <p className={style.error}></p>
            </div>
            <div className={style.field_wrapper}>
              <TextFieldWithIcon
                label="Link to the video or upload"
                icon={formupload}
              />
              <p
                className={error === false ? style.pass_notice : style.error}
                onClick={() => setError(true)}
              >
                your password should be at least 8 characters
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField
                fullWidth={true}
                multiline={true}
                rows={7}
                rowsMax={7}
                label="Address or link of your address*"
              />
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
              nextStep();
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

export default FDStep52;
