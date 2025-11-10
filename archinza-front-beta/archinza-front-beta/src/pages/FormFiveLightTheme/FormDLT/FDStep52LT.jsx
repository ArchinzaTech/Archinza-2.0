import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import { formupload, rightarrowblack } from "../../../images";
import CountryCodeDropdown from "../../../components/CountryCodeDropdown/CountryCodeDropdown";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import CountryCodeDropdownLigthTheme from "../../../components/CountryCodeDropdownLigthTheme/CountryCodeDropdownLigthTheme";
import { congratulationsLightURL } from "../../../components/helpers/constant-words";

const FDStep52LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // let errors = validationSchema(formData);
    // setFormError(errors);

    // if (Object.keys(errors).length) {
    //   helper.scroll(helper.getFirstError(errors));
    //   return;
    // }

    // const status = currentStep + 1;
    // let data = await http.post(
    //   base_url +
    //     `/business/business-details/${BusinessAccountContext?.data?._id}`,
    //   {
    //     ...formData,
    //     status: status,
    //   }
    // );

    // if (data) {
    //   BusinessAccountContext.update({
    //     ...BusinessAccountContext.data,
    //     ...formData,
    //     status: status,
    //   });
    // navigate(congratulationsLightURL);
    //   window.scrollTo(0, 0);
    // }
  };
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
              <FullWidthTextField
                lightTheme
                label="Name of the Contact person*"
              />
              <p className={style.error}></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <div className="row">
                <div className="col-md-4 ps-0">
                  <div className={style.country_code}>
                    <CountryCodeDropdownLigthTheme textLabel="Code" />
                    <p className="error"></p>
                  </div>
                </div>
                <div className="col-md-8 pe-0">
                  <div className={style.country_code}>
                    <FullWidthTextField
                      lightTheme
                      label="Phone*"
                      type="number"
                    />
                    <p className="error"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField lightTheme label="WhatsApp number*" />
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
              <FullWidthTextField lightTheme label="GST number*" />
              <p className={style.error}></p>
            </div>
            <div className={style.field_wrapper}>
              <TextFieldWithIcon
                lightTheme
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
                lightTheme
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
          <div className={style.next_button} onClick={handleSubmit}>
            <div className={style.text}>Next</div>
            <img
              src={rightarrowblack}
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

export default FDStep52LT;
