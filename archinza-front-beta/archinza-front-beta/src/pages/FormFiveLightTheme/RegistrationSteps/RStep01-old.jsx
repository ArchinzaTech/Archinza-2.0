import React, { useEffect } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import { rightarrowwhite } from "../../../images";
import CountryCodeDropdown from "../../../components/CountryCodeDropdown/CountryCodeDropdown";

const RStep01Old = ({ nextStep, currentStep, totalSteps, progressStatus }) => {
  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Your Contact Details</h1>
        <p className={style.description}></p>
      </div>
      <div className={`${style.steps} ${style.rstep1}`}>
        <div className={`row`}>
          <div className={`col-md-6 ${style.rstep01_col}`}>
            <div className={style.field_wrapper}>
              <FullWidthTextField
                key="Name of the Contact person* hasgkjasngkj"
                label="Name of the Contact person*"
              />
              <p className={style.error}>error here error here</p>
            </div>
          </div>
          <div className={`col-md-6 ${style.rstep01_col}`}>
            <div className={style.field_wrapper}>
              <div className="row">
                <div className="col-4 col-sm-4 col-md-4 ps-0">
                  <div className={style.country_code}>
                    <CountryCodeDropdown textLabel="Code" />
                    <p className="error">error here</p>
                  </div>
                </div>
                <div className="col-8 col-sm-8 col-md-8 pe-0">
                  <div className={style.country_code}>
                    <FullWidthTextField
                      key="number"
                      label="Phone*"
                      type="number"
                    />
                    <p className="error">error here error here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`col-md-6 ${style.rstep01_col}`}>
            <div className={style.field_wrapper}>
              <FullWidthTextField
                key="WhatsApp number*"
                label="WhatsApp number*"
              />
              <p className={style.error}>error here error here</p>
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
          </div>
          <div className={`col-md-6 ${style.rstep01_col}`}>
            <div className={style.field_wrapper}>
              <FullWidthTextField
                key="Address or link of your address*"
                fullWidth={true}
                rows={1}
                rowsMax={1}
                label="Address or link of your address*"
              />
              <p className={style.error}>error here error here</p>
            </div>
          </div>
          <div className={`col-md-6 ${style.rstep01_col}`}>
            <div className={style.field_wrapper}>
              <FullWidthTextField key="GST number" label="GST number" />
              <p className={style.error}>error here error here</p>
            </div>
          </div>
          <div className={`col-md-6 ${style.rstep01_col}`}>
            <div className={style.field_wrapper}>
              <FullWidthTextField
                key="Link to the video"
                label="Link to the video"
              />
              <p className={style.error}>error here error here</p>{" "}
              <div className={style.virtual_notice}>
                Add store video or virtual walkthrough link of office
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
        </div>
        <LogoutText />
      </div>
    </>
  );
};

export default RStep01Old;
