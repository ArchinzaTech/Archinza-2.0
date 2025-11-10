import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowblack } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";
import http from "../../../helpers/http";
import config from "../../../config/config";
import SelectDropdown from "../../../components/SelectDropdown/SelectDropdown";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";

const FBStep09LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  const [selectedBudget, setSelectedBudget] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [formError, setFormError] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const currencyArr = ["USD", "INR"];
  const base_url = config.api_url;
  const BusinessAccountContext = useBusinessContext();

  const formAAverageBudgetList = budgets.map((option) => (
    <React.Fragment key={option}>
      <RadioButton
        lightTheme
        label={option}
        labelId={option + "formBAvgBudget"}
        name="budget_b"
        checked={selectedBudget == option}
        onChange={() => setSelectedBudget(option)}
      />
    </React.Fragment>
  ));

  const onHandleChange = (e) => {
    setSelectedCurrency(e.target.value);
    setSelectedBudget("");
  };

  const validate = async (data) => {
    let schemaObj = {
      b_avg_project_budget: Joi.object({
        budget: Joi.string().trim().required().messages({
          "string.empty": "Please select a Budget",
          "string.undefined": "Please select a Budget",
        }),
        currency: Joi.string().required(),
      }).label("Project Budget"),
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
    let form_values = {
      b_avg_project_budget: {
        budget: selectedBudget,
        currency: selectedCurrency,
      },
    };

    let errors = await validate(form_values);

    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }

    const status = currentStep + 1;
    let saveStatus = status;
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
      nextStep();
      window.scrollTo(0, 0);
    }
  };

  const fetchData = async (selectedCurrency) => {
    let data;

    if (selectedCurrency == "INR") {
      data = await http.get(
        `${config.api_url}/business/business-type-options/${BusinessAccountContext?.data?.business_type}`
      );
      if (data) {
        const updatedOption = data?.data?.budget
          ?.map((option) => {
            return option.value;
          })
          .filter((f) => f.currency === selectedCurrency)
          .map((it) => it.type);
        setBudgets(updatedOption);
      }
    } else {
      data = await http.get(
        config.api_url +
          `/business/get-currency?base=INR&target=${selectedCurrency}&section=budget&business_type=business_type_b`
      );
      if (data) {
        setBudgets(data.data);
      }
    }
    //Check in database if the latest currency exists and
    //if the last updated is 1 day before
    //then fetch the latest_currency
    //store it in the db and use it in here

    //if selectedCurrency == INR
    //dont fetch, else fetch
    // if (data) {
    //   const updatedOption = data?.options
    //     ?.map((option) => {
    //       return option.value;
    //     })
    //     .filter((f) => f.currency === selectedCurrency)
    //     .map((it) => it.type);
    //   setBudgets(updatedOption);
    // }
  };

  useEffect(() => {
    setSelectedBudget(
      BusinessAccountContext?.data?.b_avg_project_budget?.budget
    );
    setSelectedCurrency(
      BusinessAccountContext?.data?.b_avg_project_budget?.currency ||
        selectedCurrency
    );
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((11 / 15) * 100);
    }
  }, [isActive]);
  useEffect(() => {
    fetchData(selectedCurrency);
  }, [selectedCurrency]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Average Budget of your Projects</h1>
        <div className={`field_wrapper ${style.currency_dropdown}`}>
          <SelectDropdown
            label="Currency"
            labelId="Currency"
            lightTheme
            data={currencyArr}
            value={selectedCurrency}
            onChange={onHandleChange}
          />
        </div>
        <p className={style.description}>Choose a Budget</p>
        <div id="b_avg_project_budget_error">
          <p className={`${style.top_error_with_space} ${style.error}`}>
            {formError.b_avg_project_budget}
          </p>
        </div>
      </div>
      <div className={`${style.steps} ${style.step01}`}>
        <ul className={style.steps_ul}>{formAAverageBudgetList}</ul>
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
              previousStep(7);
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

export default FBStep09LT;
