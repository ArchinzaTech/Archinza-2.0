import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import config from "../../../config/config";
import http from "../../../helpers/http";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import Joi from "joi";
import helper from "../../../helpers/helper";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const FAStep03LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [projetScopeData, setProjectScopeData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [formError, setFormError] = useState({});
  const BusinessAccountContext = useBusinessContext();

  const validate = async (data) => {
    let schemaObj = {
      featured_services: Joi.array()
        .min(1)
        .max(5)
        .required()
        .messages({
          "array.min": "Please select at least 1 service",
          "array.max": "Please select maximum 5 services",
          "any.required": "Please select at least 1 service",
        })
        .label("Offering"),
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

  const onChangeHandler = (option, e) => {
    const isSelected = e.target.checked;
    const updatedOptions = [...selectedOptions];
    if (isSelected) {
      if (updatedOptions.length >= 5) {
        setFormError({
          ...formError,
          featured_services: "Maximum 5 services are allowed to be featured",
        });
        return;
      }
      updatedOptions.push(option);
    } else {
      updatedOptions.splice(updatedOptions.indexOf(option), 1);
    }
    if (updatedOptions.length >= 1 && updatedOptions.length <= 5) {
      setFormError({
        ...formError,
        featured_services: undefined,
      });
    }
    const allOtherSelected = projetScopeData.every((item) =>
      updatedOptions.includes(item)
    );

    if (allOtherSelected && !allSelected) {
      setAllSelected(true);
      setAllOptions([...projetScopeData]);
    } else {
      setAllSelected(false);
    }

    setSelectedOptions(updatedOptions);
  };

  const redirectToPrevStep = async () => {
    //check if services are selected manually
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
    const options = allSelected ? allOptions : selectedOptions;

    let errors = await validate({ featured_services: options });
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
    const { data } = await http.post(
      config.api_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        featured_services: options,
        status: saveStatus,
      }
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        featured_services: options,
        status: saveStatus,
      });

      goToStep(stepNumber);
      window.scrollTo(0, 0);
    }
  };

  const fetchData = async () => {
    const latestData = await BusinessAccountContext?.fetchData(
      BusinessAccountContext.data?._id
    );
    await BusinessAccountContext.update(latestData);
    if (latestData?.services) {
      const modifiedOptions = latestData.services.map(
        (option) => ({
          label: helper.capitalizeWords(option),
          value: helper.capitalizeWords(option),
        })
      );
      const updatedOption = modifiedOptions
        .map((option) => option.value)
        .sort();

      if (
        updatedOption?.length ===
        BusinessAccountContext?.data?.featured_services?.length
      ) {
        setSelectedOptions(updatedOption);
        setAllSelected(true);
        setAllOptions(updatedOption);
      } else {
        const contextProjectScope =
          BusinessAccountContext?.data?.featured_services || [];
        setSelectedOptions(contextProjectScope);
      }
      setProjectScopeData(updatedOption);
    }
  };

  const projectSizeList = projetScopeData.map((option) => (
    <React.Fragment key={option}>
      <CheckboxButton
        lightTheme
        label={option}
        labelId={option + "formproject_scope"}
        checked={selectedOptions.includes(option)}
        onChange={(e) => onChangeHandler(option, e)}
      />
    </React.Fragment>
  ));

  useEffect(() => {
    fetchData();
    console.log(BusinessAccountContext.data.services);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((17 / 18) * 100);
    }
  }, [isActive]);

  return (
    <>
      <LightThemeBackground />
      <div className={style.text_container}>
        <p className={style.page_title}>Tell Us About Your Firm/Business</p>
        <h1 className={style.title}>
          Based on the links and documents you shared we’ve put together a list
          of services and offerings that reflect what your business does.*
        </h1>
        <h2 className={`${style.description} ${style.desc_renovation}`}>
          {/* From the previously selected products/services, select your TOP
          offerings */}
          Please select the top 5 that best represent your work and add if
          there’s anything we’ve missed
        </h2>
        <p
          className={`${style.description} ${style.select_notice}`}
          style={{
            marginBottom: "2em",
          }}
        >
          This helps Archinza AI™ understand your strengths better and connect
          you to the right opportunities.
        </p>
        <div id="featured_services_error">
          <p className={`${style.rstep02Error} ${style.error}`}>
            {formError.featured_services}
          </p>
        </div>
        <p className={`${style.rstep02Error} ${style.error}`}></p>
      </div>
      <div className={`${style.steps} ${style.reduceSpace}`}>
        <ul className={style.steps_ul}>{projectSizeList}</ul>
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

export default FAStep03LT;
