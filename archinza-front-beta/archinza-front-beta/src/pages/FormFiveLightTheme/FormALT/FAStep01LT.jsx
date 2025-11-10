import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteOthers from "../../../components/AutoCompleteOthers/AutoCompleteOthers";
import http from "../../../helpers/http";
import config from "../../../config/config";
import _ from "lodash";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";
// const newOptionsArr = ["newly added"];

const FAStep01LT = ({
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  previousStep,
  isActive,
  goToStep,
}) => {
  const [formError, setFormError] = useState({});
  const [autoKey, setAutoKey] = useState(1);
  const [maxServicesError, setMaxServicesError] = useState(null);

  const BusinessAccountContext = useBusinessContext();

  const handleCheckboxChange = (index, value) => {
    enableDisableOption(value, false);
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions.splice(index, 1);
    setSelectedOptions((prev) => {
      return updatedSelectedOptions;
    });
    setMaxServicesError(null);
  };

  const [servicesData, setServicesData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const newAdditionList = selectedOptions.map((option, i) => (
    <React.Fragment key={option}>
      <CheckboxButton
        lightTheme
        isChecked={true}
        label={option}
        labelId={option}
        onChange={() => handleCheckboxChange(i, option)}
      />
    </React.Fragment>
  ));

  const handleOptionChange = (value, field) => {
    enableDisableOption(value, true);

    setSelectedOptions((prev) => {
      return [...prev, value];
    });
    setMaxServicesError(null);
  };

  const enableDisableOption = (value, isDisabled = true) => {
    const selectedIndex = _.findIndex(servicesData, { value: value });

    const updatedOptions = [...servicesData];

    if (updatedOptions[selectedIndex]) {
      updatedOptions[selectedIndex] = {
        ...updatedOptions[selectedIndex],
        disabled: isDisabled,
      };
      setServicesData((prev) => {
        return updatedOptions;
      });
    }
  };

  const validate = async (data) => {
    let schemaObj = {
      services: Joi.array()
        .min(1)
        .required()
        .messages({
          "array.min": "Please select at least 1 service",
          "any.required": "Please select at least 1 service",
        })
        .label("Services"),
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

  const handleSubmit = async () => {
    let form_values = { services: selectedOptions };
    let errors = await validate(form_values);
    console.log(form_values);
    console.log(errors);
    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }

    const valueSet = new Set(
      servicesData.map((obj) => obj.value.toLowerCase())
    );
    const newOptions = selectedOptions
      .filter((str) => !valueSet.has(str.toLowerCase()))
      ?.map((option) => ({
        value: helper.capitalizeWords(option),
        status: "pending",
      }));
    if (newOptions.length > 0) {
      await http.post(`${config.api_url}/options/custom-options/business`, {
        question: "What products/services do you provide?",
        question_slug: "services",
        options: newOptions,
        user: BusinessAccountContext?.data?._id,
      });
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

    if (
      BusinessAccountContext?.data?.status > currentStep &&
      !["registered", "completed"].includes(
        BusinessAccountContext?.data?.status
      )
    ) {
      saveStatus = BusinessAccountContext.data.status;
    }
    let data = await http.post(
      config.api_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        services: form_values.services,
        status: currentStep + 1,
      }
    );
    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        services: form_values.services,
        status: saveStatus,
      });

      nextStep();
      window.scrollTo(0, 0);
    }
  };

  const fetchData = async () => {
    if (BusinessAccountContext?.data) {
      const { data } = await http.get(`${config.api_url}/services`);

      if (data) {
        const uniqueServicesMap = new Map();
        data.forEach((record) => {
          if (!uniqueServicesMap.has(record.value)) {
            uniqueServicesMap.set(record.value, record);
          }
        });

        const mergedServices = Array.from(uniqueServicesMap.values());

        mergedServices.sort((a, b) => (a.value > b.value ? 1 : -1));

        const updatedOption = mergedServices?.map((option) => {
          if (BusinessAccountContext?.data?.services?.includes(option.value)) {
            return { ...option, disabled: true };
          } else {
            return option;
          }
        });

        setServicesData(updatedOption);
      }
    }
  };

  useEffect(() => {
    setSelectedOptions(BusinessAccountContext?.data?.services);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((16 / 18) * 100);
    }
  }, [isActive]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <LightThemeBackground />
      <div className={style.text_container}>
        <p className={style.page_title}>Tell Us About Your Firm/Business</p>
        <h1 className={style.title}>What products/services do you provide?*</h1>
        <h2 className={`${style.description} ${style.desc_renovation}`}>
          You are most likely to be found by potential clients if you provide a
          complete list of products/services, including support services like
          measurement, 3d visualisation, drawings, supervision etc.
        </h2>{" "}
        <p
          className={`${style.description} ${style.select_notice} ${style.select_notice_mob_column}`}
        >
          Choose as many, or{" "}
          <span className="mx-1 fw-bold"> add custom text </span> if your
          product/service is not found.
        </p>
        <div id="services_error">
          {formError?.services && (
            <p className={style.error}>{formError?.services}</p>
          )}
          {maxServicesError && (
            <p className={style.error}>{maxServicesError}</p>
          )}
        </div>
      </div>
      <div className={`${style.steps} ${style.fastep04}`}>
        <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
          <div className={style.field_wrapper}>
            <AutoCompleteOthers
              key={`autokey${autoKey}`}
              lightTheme
              textLabel="Select your products/services"
              data={servicesData}
              onChange={(e, value) => {
                handleOptionChange(value.value, "services");
                setAutoKey((prev) => {
                  return prev + 1;
                });
              }}
            />
          </div>
        </div>
        <ul className={`${style.steps_ul} ${style.new_list}`}>
          {newAdditionList}
        </ul>
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

export default FAStep01LT;
