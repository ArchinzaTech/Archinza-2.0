import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";
import config from "../../../config/config";
import http from "../../../helpers/http";
import SelectDropdown from "../../../components/SelectDropdown/SelectDropdown";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import { congratulationsLightURL } from "../../../components/helpers/constant-words";
import { useGlobalDataContext } from "../../../context/GlobalData/GlobalDataState";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const FAStep15LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [selectedFee, setSelectedFee] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [allFees, setAllFees] = useState([]);
  const [formError, setFormError] = useState({});
  const base_url = config.api_url;
  const currencyArr = ["INR", "USD"];
  const BusinessAccountContext = useBusinessContext();
  const GlobalDataContext = useGlobalDataContext();

  const handleOptionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedFee("");
    } else {
      setSelectedFee(value);
    }
  };

  const onHandleChange = (e) => {
    if (
      e.target.value ===
      BusinessAccountContext?.data?.project_mimimal_fee?.currency
    ) {
      setSelectedFee(BusinessAccountContext?.data?.project_mimimal_fee?.fee);
    } else {
      setSelectedFee("");
    }
    setSelectedCurrency(e.target.value);
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

  const handleSubmit = async () => {
    let form_values = {
      project_mimimal_fee: {
        fee: selectedFee,
        currency: selectedCurrency,
      },
    };

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
      goToStep(stepNumber);
      // navigate(congratulationsLightURL);
      window.scrollTo(0, 0);
    }
  };

  const validate = async (data) => {
    let schemaObj = {
      project_mimimal_fee: Joi.object({
        fee: Joi.string().trim().allow(""),
        currency: Joi.string().allow(""),
      }).label("Project Minimal Fee"),
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

  const fetchData = async (currency) => {
    if (currency === "INR") {
      if (GlobalDataContext?.minimum_project_fee?.length > 0) {
        setAllFees(GlobalDataContext.minimum_project_fee);
      } else {
        const data = await http.get(
          `${config.api_url}/business/options?qs=minimum_project_fee`
        );
        if (data) {
          const updatedOption = data?.data?.map((option) => {
            return option.value;
          });
          setAllFees(updatedOption);
        }
      }
    } else {
      const data = await http.get(`${config.api_url}/business/get-currency`);
      if (data) {
        setAllFees(data.data);
      }
    }
  };

  const formAMinFeeList = allFees.map((option) => (
    <React.Fragment key={option}>
      <RadioButton
        lightTheme
        extraSpace={true}
        label={option}
        name="minimal-fee-formB"
        checked={selectedFee === option}
        value={option}
        onChange={handleOptionChange}
        labelId={`${option}_minimalFeeB`}
        deSelectedItem={true}
      />
    </React.Fragment>
  ));

  useEffect(() => {
    setSelectedFee(BusinessAccountContext?.data?.project_mimimal_fee?.fee);
    setSelectedCurrency(
      BusinessAccountContext?.data?.project_mimimal_fee?.currency ||
        selectedCurrency
    );
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((13 / 18) * 100);
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      fetchData(selectedCurrency);
    }
  }, [isActive, selectedCurrency]);

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
        <h1 className={style.title}>Your Current Minimum Project Fee?</h1>
        <h2 className={`${style.description} ${style.desc_renovation}`}>
          NOTE: This information is only for Archinza AI matchmaking and won't
          be displayed on your business profile
        </h2>
        <p className={`${style.description} ${style.select_notice}`}>
          Choose one
        </p>
        <div id="project_mimimal_fee_error">
          <p className={`${style.top_error_with_space} ${style.error}`}>
            {formError.project_mimimal_fee}
          </p>
        </div>
        <div
          className={`field_wrapper ${style.currency_dropdown} ${style.currency_dropdown_above_options}`}
        >
          <SelectDropdown
            label="Unit"
            labelId="Unit"
            lightTheme
            data={currencyArr}
            value={selectedCurrency}
            onChange={onHandleChange}
          />
        </div>
      </div>
      <div className={`${style.steps} ${style.step10}`}>
        <ul className={style.steps_ul}>{formAMinFeeList}</ul>
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

export default FAStep15LT;
