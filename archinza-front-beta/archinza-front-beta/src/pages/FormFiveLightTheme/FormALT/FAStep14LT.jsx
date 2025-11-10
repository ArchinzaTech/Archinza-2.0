import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import http from "../../../helpers/http";
import config from "../../../config/config";
import SelectDropdown from "../../../components/SelectDropdown/SelectDropdown";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import { useGlobalDataContext } from "../../../context/GlobalData/GlobalDataState";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const FAStep14LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [selectedBudgets, setSelectedBudgets] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [allFees, setAllFees] = useState([]);
  const [formError, setFormError] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("Rs/sq.ft.");
  const [tempSelectedBudgets, setTempSelectedBudgets] = useState([]);
  const currencyArr = ["Rs/sq.ft.", "USD/sq.m."];

  const base_url = config.api_url;
  const BusinessAccountContext = useBusinessContext();
  const GlobalDataContext = useGlobalDataContext();

  const onChangeHandler = (option, e) => {
    const isSelected = e.target.checked;
    const updatedOptions = [...selectedBudgets];

    if (isSelected) {
      updatedOptions.push(option);
    } else {
      const index = updatedOptions.indexOf(option);
      if (index !== -1) updatedOptions.splice(index, 1);
    }
    setSelectedBudgets(updatedOptions);
  };

  const formAAverageBudgetList = allFees.map((option) => (
    <React.Fragment key={option}>
      <CheckboxButton
        lightTheme
        label={option}
        labelId={option + "formBAvgBudget"}
        name="budget_b"
        checked={selectedBudgets.includes(option)}
        onChange={(e) => onChangeHandler(option, e)}
      />
    </React.Fragment>
  ));

  const onHandleChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);

    // Save the current selections before switching currency
    if (
      BusinessAccountContext?.data?.avg_project_budget?.currency &&
      newCurrency !== BusinessAccountContext.data.avg_project_budget.currency
    ) {
      setTempSelectedBudgets(selectedBudgets);
    }

    // Filter budgets based on the new currency
    const filteredBudgets = initialData
      .filter((option) => option.currency === newCurrency)
      .map((it) => it.budget);

    setAllFees(filteredBudgets);
    setSelectedBudgets([]);
  };

  const validate = async (data) => {
    let schemaObj = {
      avg_project_budget: Joi.object({
        budgets: Joi.array().label("Project Budget"),
        currency: Joi.string().allow(""),
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

  const fetchData = async () => {
    const data = GlobalDataContext.average_budget;

    if (data && data.length) {
      setInitialData(data);

      if (BusinessAccountContext?.data?.avg_project_budget) {
        const budgetCurrency =
          BusinessAccountContext?.data?.avg_project_budget?.currency ||
          selectedCurrency;
        const filteredBudgets = data
          .filter((option) => option.currency === budgetCurrency)
          .map((it) => it.budget);

        const contextBudgets =
          BusinessAccountContext?.data?.avg_project_budget?.budgets ||
          (BusinessAccountContext?.data?.avg_project_budget?.budget
            ? [BusinessAccountContext.data.avg_project_budget.budget]
            : []);

        setSelectedBudgets(contextBudgets);
        setAllFees(filteredBudgets);
        console.log(budgetCurrency);
        setSelectedCurrency(budgetCurrency);
      } else {
        // If no context data, just filter by current currency
        const filteredBudgets = data
          .filter((option) => option.currency === selectedCurrency)
          .map((it) => it.budget);

        setAllFees(filteredBudgets);
      }
    }
  };

  const handleSubmit = async () => {
    let form_values = {
      avg_project_budget: {
        budgets: selectedBudgets,
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

      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((12 / 18) * 100);
    }
  }, [isActive]);

  // Restore selected options when returning to the previously used currency
  useEffect(() => {
    if (
      BusinessAccountContext?.data?.avg_project_budget?.currency &&
      selectedCurrency ===
        BusinessAccountContext.data.avg_project_budget.currency
    ) {
      const contextBudgets =
        BusinessAccountContext?.data?.avg_project_budget?.budgets ||
        (BusinessAccountContext?.data?.avg_project_budget?.budget
          ? [BusinessAccountContext.data.avg_project_budget.budget]
          : []);

      setSelectedBudgets(contextBudgets);
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
        <h1 className={style.title}>
          Approximate budget of the projects you have worked on
        </h1>
        <h2 className={`${style.description} ${style.desc_renovation}`}>
          NOTE: This information is only for Archinza AI matchmaking and won't
          be displayed on your business profile.
        </h2>
        <p className={`${style.description} ${style.select_notice}`}>
          Choose as many
        </p>
        <div id="avg_project_budget_error">
          <p className={`${style.top_error_with_space} ${style.error}`}>
            {formError.avg_project_budget}
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
      <div className={`${style.steps} ${style.step01}`}>
        <ul className={style.steps_ul}>{formAAverageBudgetList}</ul>
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

export default FAStep14LT;
