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
import SelectDropdown from "../../../components/SelectDropdown/SelectDropdown";
import { useGlobalDataContext } from "../../../context/GlobalData/GlobalDataState";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const FAStep13LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [projectSizes, setProjectSizes] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [formError, setFormError] = useState({});
  const BusinessAccountContext = useBusinessContext();
  const GlobalDataContext = useGlobalDataContext();
  const currencyArr = ["sq.ft.", "sq.m."];
  const [selectedCurrency, setSelectedCurrency] = useState("sq.ft.");
  const [tempSelectedOptions, setTempSelectedOptions] = useState([]);

  const validate = async (data) => {
    let schemaObj = {
      project_sizes: Joi.array()
        // .min(1)
        // .required()
        .label("Project Size"),
      // .messages({
      //   "array.min": "Please select at least 1 project size",
      // }),
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
      updatedOptions.push(option);
    } else {
      const index = updatedOptions.indexOf(option);
      if (index !== -1) updatedOptions.splice(index, 1);
    }
    setSelectedOptions(updatedOptions);
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
    goToStep(stepNumber);
  };

  const onHandleChange = (e) => {
    const newUnit = e.target.value;
    setSelectedCurrency(newUnit);

    const filteredData = initialData
      .filter((option) => option.unit === newUnit)
      .map((it) => it.size);

    if (
      BusinessAccountContext?.data?.project_sizes?.unit &&
      newUnit !== BusinessAccountContext.data.project_sizes.unit
    ) {
      setTempSelectedOptions(selectedOptions);
    }

    setProjectSizes(filteredData);
    setSelectedOptions([]);
  };

  const handleSubmit = async () => {
    let errors = await validate({ project_sizes: selectedOptions });
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
      config.api_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        project_sizes: { sizes: selectedOptions, unit: selectedCurrency },
        status: saveStatus,
      }
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        project_sizes: { sizes: selectedOptions, unit: selectedCurrency },
        status: saveStatus,
      });
      goToStep(stepNumber);
      window.scrollTo(0, 0);
    }
  };

  const fetchData = async () => {
    const data = GlobalDataContext.project_sizes;

    if (data) {
      setInitialData(data);

      if (BusinessAccountContext?.data) {
        const projectUnit =
          BusinessAccountContext?.data?.project_sizes?.unit || selectedCurrency;
        const filteredSizes = data
          .filter((option) => option.unit === projectUnit)
          .map((it) => it.size);

        const contextSizes =
          BusinessAccountContext?.data?.project_sizes?.sizes || [];
        setSelectedOptions(contextSizes);
        setProjectSizes(filteredSizes);
        setSelectedCurrency(
          BusinessAccountContext.data.project_sizes.unit || "sq.ft."
        );
      }
    }
  };

  const projectSizeList = projectSizes.map((option) => (
    <React.Fragment key={option}>
      <CheckboxButton
        lightTheme
        label={`${option} ${selectedCurrency}`}
        labelId={option + "formA_project_size"}
        checked={selectedOptions?.includes(option)}
        onChange={(e) => onChangeHandler(option, e)}
      />
    </React.Fragment>
  ));

  useEffect(() => {
    fetchData();
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((11 / 18) * 100);
    }
  }, [isActive]);

  useEffect(() => {
    if (
      BusinessAccountContext?.data?.project_sizes?.unit &&
      selectedCurrency === BusinessAccountContext.data.project_sizes.unit
    ) {
      setSelectedOptions(
        BusinessAccountContext.data.project_sizes?.sizes || []
      );
    }
  }, [selectedCurrency, BusinessAccountContext.data]);

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
        <h1 className={style.title}>Minimum Project Size</h1>
        <h2 className={`${style.description} ${style.desc_renovation}`}>
          This information is used by Archinza AI™️to matchmake your ideal
          clients.
        </h2>
        <p className={`${style.description} ${style.select_notice}`}>
          Choose as many
        </p>
        <div id="project_sizes_error">
          <p className={`${style.rstep02Error} ${style.error}`}>
            {formError.project_sizes}
          </p>
        </div>
        <div className={`field_wrapper ${style.currency_dropdown}`}>
          <SelectDropdown
            label="Unit"
            labelId="unit"
            lightTheme
            data={currencyArr}
            value={selectedCurrency}
            onChange={onHandleChange}
          />
        </div>
      </div>
      <div
        className={`${style.steps} ${style.reduceSpace}`}
        style={{
          marginTop: "4em",
        }}
      >
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

export default FAStep13LT;
