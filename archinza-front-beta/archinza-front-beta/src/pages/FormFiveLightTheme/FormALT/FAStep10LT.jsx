import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";
import config from "../../../config/config";
import http from "../../../helpers/http";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";
import { congratulationsLightURL } from "../../../components/helpers/constant-words";
import { useNavigate } from "react-router-dom";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const employeeCountArr = ["Low", "Medium", "High"];

const FAStep10LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const base_url = config.api_url;
  const [formError, setFormError] = useState({});
  const BusinessAccountContext = useBusinessContext();
  const navigate = useNavigate();

  const validate = async (data) => {
    let schemaObj = {
      renovation_work: Joi.string()
        .valid("Yes", "No")
        .allow("")
        .label("Renovation Work")
        .messages({
          "string.empty": "Please select an option",
          "any.only": "Please select an option",
        }),
    };

    const schema = Joi.object(schemaObj).options({ allowUnknown: true });

    const { error } = schema.validate(data, config.joiOptions);

    const errors = {};

    if (error) {
      error.details.map((field) => {
        errors[field.path[0]] = field.message;
        return true;
      });
    }

    return errors ? errors : null;
  };

  const handleRadioChange = (option) => {
    setSelectedOption(option);
  };

  const redirectToPrevStep = async () => {
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
    // console.log(stepNumber);
    goToStep(stepNumber);
  };

  const handleSubmit = async () => {
    let form_values = { renovation_work: selectedOption };
    // console.log(form_values);
    let errors = await validate(form_values);
    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
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
        ...form_values,
        status: saveStatus,
      }
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        ...form_values,
        status: saveStatus,
      });
      // navigate(congratulationsLightURL);
      goToStep(stepNumber);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const renovationWork = BusinessAccountContext?.data?.renovation_work;
    // Only set if it's a valid string value, otherwise keep empty string
    if (renovationWork === "Yes" || renovationWork === "No") {
      setSelectedOption(renovationWork);
    } else {
      setSelectedOption(""); // Explicitly set to empty string for any other value
    }
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((8 / 18) * 100);
    }
  }, [isActive]);

  return (
    <>
      <LightThemeBackground />
      <div className={style.text_container}>
        <p className={style.page_title}>AI-Powered Client matchmaking</p>
        <p
          className={`${style.description} ${style.select_notice} mb-2`}
          style={{ fontSize: "1em" }}
        >
          (Optional)
        </p>
        <h1 className={style.title}>Do you do renovation work?</h1>
        <h2
          className={`${style.description} ${style.desc_renovation}`}
          style={{
            marginBottom: "2.4em",
          }}
        >
          This will help us matchmake you with your ideal clients.
        </h2>{" "}
        <div id="user_type_error">
          {/* {designIndustryError && (
            <p className="error top_error">{designIndustryError}</p>
          )} */}
        </div>
        <div className="design_wrapper">
          <form onSubmit={handleSubmit}>
            <div
              className={`${style.steps} ${style.step01} ${style.radioBtn_wrapper_renovation}`}
            >
              <RadioButton
                lightTheme
                label="Yes"
                labelId="renovateYes"
                name="renovation_work"
                value="Yes"
                checked={selectedOption === "Yes"}
                onChange={() => handleRadioChange("Yes")}
              />
              <RadioButton
                lightTheme
                label="No"
                labelId="designNo"
                name="renovation_work"
                value="No"
                checked={selectedOption === "No"}
                onChange={() => handleRadioChange("No")}
              />
            </div>
          </form>
        </div>
        <div id="renovation_work_error">
          <p className={`${style.top_error_with_space} ${style.error}`}>
            {formError.renovation_work}
          </p>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div className={style.next_button} onClick={handleSubmit}>
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

export default FAStep10LT;
