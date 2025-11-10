import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import {
  blackDeleteicon,
  errorFailed,
  errorSuccess,
  formBehance,
  formLinkedin,
  formfb,
  forminsta,
  plusicon,
  rightarrowwhite,
  websiteicon,
} from "../../../images";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import http from "../../../helpers/http";
import config from "../../../config/config";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";
import StepFormConfrimationPopup from "../../BusinessProfile/BusinessProfileComponents/PopUpComponents/StepFormConfrimationPopup/StepFormConfrimationPopup";

const FAStep04LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [gstValid, setGstValid] = useState(null);
  const [formError, setFormError] = useState({});
  const [emailError, setEmailError] = useState({});
  const [addressesError, setAddressesError] = useState({});

  const [showStepFormConfrimationPopup, setStepFormConfrimationPopup] =
    useState(false);
  const handleStepFormConfrimationPopupOpen = () =>
    setStepFormConfrimationPopup(true);
  const handleStepFormConfrimationPopupClose = () =>
    setStepFormConfrimationPopup(false);

  const [formData, setFormData] = useState({
    website_link: "",
    instagram_handle: "",
    linkedin_link: "",
  });

  const base_url = config.api_url;
  const joiOptions = config.joiOptions;
  const BusinessAccountContext = useBusinessContext();
  const { website_link, instagram_handle, linkedin_link } =
    BusinessAccountContext?.data || {};
  const isDisabled = !!(website_link || instagram_handle || linkedin_link);

  const validationSchema = (data) => {
    const schemaObj = {
      website_link: Joi.string()
        .label("Website")
        .allow("")
        .custom((value, helpers) => {
          const urlRegex =
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
          if (value && !urlRegex.test(value)) {
            return helpers.message("Invalid website URL");
          }
          return value;
        }),
      instagram_handle: Joi.string()
        .label("Instagram")
        .allow("")
        .custom((value, helpers) => {
          if (!value) return value;

          // Extract username from URL if provided
          let username = value;
          // const urlPattern =
          //   /^(https?:\/\/)?(www\.)?instagram\.com\/(.*?)\/?$/i;
          const urlPattern =
            /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^/?#]+)(?:[/?#].*)?$/i;
          const match = value.match(urlPattern);
          if (match) {
            username = match[1]; // Extract username from URL
          }

          // Remove leading '@' if present
          username = username.replace(/^@/, "");

          // Validate username format
          const usernameRegex = /^[a-zA-Z0-9._]+$/;
          if (!usernameRegex.test(username)) {
            return helpers.message(
              "Instagram username can only contain letters, numbers, periods, and underscores"
            );
          }

          // Check length explicitly for clarity
          // if (username.length > 30) {
          //   return helpers.message(
          //     "Instagram username cannot exceed 30 characters"
          //   );
          // }

          return value; // Return original value for further processing
        }),
      linkedin_link: Joi.string()
        .label("LinkedIn")
        .allow("")
        .custom((value, helpers) => {
          if (!value) return value;

          const validDomainRegex =
            /^(https:\/\/)?([a-z]{2}\.)?(www\.)?(linkedin\.com|linkedin\.in)\//i;
          if (!validDomainRegex.test(value)) {
            return helpers.message("Invalid LinkedIn URL");
          }

          if (
            /^http:\/\/([a-z]{2}\.)?(www\.)?(linkedin\.com|linkedin\.in)/i.test(
              value
            )
          ) {
            return helpers.message(
              "Please use 'https://' instead of 'http://' for LinkedIn URLs"
            );
          }

          const validPathRegex =
            /^(https:\/\/)?([a-z]{2}\.)?(www\.)?(linkedin\.com|linkedin\.in)\/[a-z]+\/[\w-]+(\/)?(\?.*)?$/i;
          if (!validPathRegex.test(value)) {
            return helpers.message(
              "Please enter a valid LinkedIn URL with a proper path (e.g., linkedin.com/in/username, linkedin.in/company/companyname)"
            );
          }

          return value;
        }),
    };

    const schema = Joi.object(schemaObj)
      .options({ allowUnknown: true, abortEarly: false })
      .custom((value, helpers) => {
        const requiredFields = [
          "website_link",
          "instagram_handle",
          "linkedin_link",
        ];
        const hasValue = requiredFields.some((field) => !!value[field]);
        if (!hasValue) {
          return helpers.message("Add atleast one of the following");
        }
        return value;
      });
    const { error } = schema.validate(data, config.joiOptions);

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return errors;
    }

    return {}; // Return an empty object on successful validation
  };

  const redirectToPrevStep = async () => {
    const hasOtherThanPrefix4 = BusinessAccountContext.data.business_types.some(
      (bt) => bt.prefix !== "4"
    );
    if (!hasOtherThanPrefix4) {
      goToStep(1);
    } else {
      const questionsData = await http.get(
        `${config.api_url}/business/business-questions`
      );
      const business_types = BusinessAccountContext.data.business_types.map(
        (it) => it._id
      );
      let stepNumber = helper.redirectBusinessUserBack(
        questionsData?.data,
        business_types,
        currentStep
      );
      goToStep(stepNumber);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleNextClick = () => {
    if (isDisabled) {
      nextStep();
      return;
    }

    const errors = validationSchema(formData);
    if (Object.keys(errors).length) {
      if (errors.undefined) {
        errors["atleast_one"] = errors.undefined;
        delete errors.undefined;
      }
      setFormError(errors);
      helper.scroll(helper.getFirstError(errors));
      return;
    }
    setFormError({});
    handleStepFormConfrimationPopupOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Re-validate before submitting, just in case.
    const errors = validationSchema(formData);
    if (Object.keys(errors).length) {
      setFormError(errors);
      helper.scroll(helper.getFirstError(errors));
      handleStepFormConfrimationPopupClose(); // Close popup if validation fails
      return;
    }
    setFormError({});

    if (formData.website_link && !/^https?:\/\//i.test(formData.website_link)) {
      formData.website_link = `https://${formData.website_link}`;
    }
    // Check if formData has instagram_handle
    if (formData.instagram_handle) {
      // Extract username from URL if provided
      let username = formData.instagram_handle;
      const urlPattern = /^(https?:\/\/)?(www\.)?instagram\.com\/(.*?)\/?$/i;
      const match = formData.instagram_handle.match(urlPattern);
      if (match) {
        username = match[3]; // Extract username from URL
      }

      // Remove leading '@' if present
      username = username.replace(/^@/, "");

      // Store the cleaned URL
      formData.instagram_handle = `https://www.instagram.com/${username}`;
    }

    const questionsData = await http.get(
      `${config.api_url}/business/business-questions`
    );
    const business_types = BusinessAccountContext.data.business_types.map(
      (it) => it._id
    );
    let stepNumber = helper.redirectBusinessUser(
      questionsData?.data,
      business_types,
      currentStep
    );

    let nextStepToGo = currentStep + 1;
    let saveStatus = Math.max(stepNumber, nextStepToGo);

    if (BusinessAccountContext?.data?.status > currentStep) {
      saveStatus = BusinessAccountContext.data.status;
    }

    let data = await http.post(
      base_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        ...formData,
        status: saveStatus,
      }
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        ...formData,
        status: saveStatus,
      });

      nextStep();
      window.scrollTo(0, 0);
    }
  };

  const handleConfirmationSubmit = async () => {
    try {
      const mockEvent = { preventDefault: () => {} };
      await handleSubmit(mockEvent);
      handleStepFormConfrimationPopupClose();
    } catch (error) {
      console.error("Error in handleConfirmationSubmit:", error);
    }
  };

  useEffect(() => {
    const { website_link, instagram_handle, linkedin_link } =
      BusinessAccountContext?.data;

    setFormData({
      website_link: website_link,
      instagram_handle: instagram_handle,
      linkedin_link: linkedin_link,
    });
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((3 / 18) * 100);
    }
  }, [isActive]);

  return (
    <>
      <StepFormConfrimationPopup
        show={showStepFormConfrimationPopup}
        handleClose={handleStepFormConfrimationPopupClose}
        data={"Review your links before submitting."}
        dataNextStep={`Your added links help build your business's long-term
      intelligence within Archinza.<b style="color:#111"> Please note that replacing them later may incur a fee.`}
        label={
          "I confirm that I have reviewed these links and they are accurate."
        }
        nextStep={handleConfirmationSubmit}
      />

      <LightThemeBackground />
      <div className={style.firm_connect}>
        {/* SOCIALS STARTS HERE */}
        {/* SOCIALS STARTS HERE */}
        {/* SOCIALS STARTS HERE */}
        <div className={style.social_box}>
          <div className={style.text_container}>
            <p className={style.page_title}>Tell Us About Your Firm/Business</p>
            <h1 className={style.title}>
              Where can we find your professional presence online?{" "}
              {/* <span className={style.coloured_text}>led by AI!</span>* */}
            </h1>
            <h2 className={`${style.description} ${style.desc_renovation}`}>
              Note: Social account must be set to public.
            </h2>{" "}
            <p
              className={`${style.description} ${style.select_notice}`}
              style={{
                marginBottom: "3em",
              }}
            >
              One mandatory
            </p>
            <div id="atleast_one_error">
              {formError.atleast_one && (
                <p className={`${style.rstep02Error} ${style.error}`}>
                  {formError.atleast_one}
                </p>
              )}
            </div>
          </div>
          <div className={`${style.steps} ${style.reduceSpace}`}>
            <div className={`row ${style.social_row}`}>
              <div className="col-md-6">
                <div className={style.field_wrapper}>
                  <TextFieldWithIcon
                    lightTheme
                    label="Website Url"
                    icon={websiteicon}
                    name="website_link"
                    value={formData.website_link}
                    onChange={handleInputChange}
                    disabled={isDisabled}
                  />
                  <div id="website_link_error">
                    {formError.website_link && (
                      <p className={style.error}>{formError.website_link}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className={`${style.field_wrapper} ${style.insta_handale_fix_label}`}
                >
                  <TextFieldWithIcon
                    lightTheme
                    label="Instagram Handle"
                    icon={forminsta}
                    name="instagram_handle"
                    value={formData.instagram_handle}
                    onChange={handleInputChange}
                    disabled={isDisabled}
                  />
                  <div id="instagram_handle_error">
                    {formError.instagram_handle && (
                      <p className={style.error}>
                        {formError.instagram_handle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={style.field_wrapper}>
                  <TextFieldWithIcon
                    lightTheme
                    label="Linkedin Url"
                    icon={formLinkedin}
                    name="linkedin_link"
                    value={formData.linkedin_link}
                    onChange={handleInputChange}
                    disabled={isDisabled}
                  />
                  <div id="linkedin_link_error">
                    {formError.linkedin_link && (
                      <p className={style.error}>{formError.linkedin_link}</p>
                    )}
                  </div>
                </div>
              </div>
              {/* <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField
                lightTheme
                label="Address/ google location"
                name="address_google_location"
                value={formData.address_google_location}
                onChange={handleInputChange}
              />
              <div id="address_google_location_error">
                {formError.address_google_location && (
                  <p className={style.error}>
                    {formError.address_google_location}
                  </p>
                )}
              </div>
            </div>
          </div> 
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <div className={style.input_wrapper}>
                <FullWidthTextField
                  lightTheme
                  type="text"
                  label="GST number"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleInputChange}
                />
                {gstValid && !formError.gst_number && (
                  <img
                    className={style.val_icon}
                    src={errorSuccess}
                    alt="success"
                  />
                )}
                {gstValid === false && (
                  <img
                    className={style.val_icon}
                    src={errorFailed}
                    alt="failed"
                  />
                )}
              </div>
              <div id="gst_number_error">
                <p className={style.error}>{formError.gst_number}</p>
              </div>
            </div>
          </div>*/}
            </div>
          </div>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            // onClick={handleSubmit}
            onClick={handleNextClick}
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
              redirectToPrevStep();
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

export default FAStep04LT;
