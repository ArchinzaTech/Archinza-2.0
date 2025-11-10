import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteField from "../../../components/AutoCompleteField/AutoCompleteField";
import http from "../../../helpers/http";
import config from "../../../config/config";
import _ from "lodash";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const FAStep11LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [formError, setFormError] = useState({});
  const [typologyData, setTypologyData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [autoKey, setAutoKey] = useState(1);
  const [submitData, setSubmitData] = useState([]);
  const BusinessAccountContext = useBusinessContext();
  const [allOptionValue, setAllOptionValue] = useState("All");

  // const handleCheckboxChange = (index, value) => {
  //   enableDisableOption(value, false);
  //   const updatedSelectedOptions = [...selectedOptions];
  //   updatedSelectedOptions.splice(index, 1);
  //   setSelectedOptions((prev) => {
  //     return updatedSelectedOptions;
  //   });
  // };
  const handleCheckboxChange = (index, value) => {
    const updatedSelectedOptions = selectedOptions.filter(
      (option) => option !== value
    );
    setSelectedOptions(updatedSelectedOptions);

    const updatedSubmitData = submitData.filter((option) => option !== value);
    setSubmitData(updatedSubmitData);

    enableDisableOption(updatedSelectedOptions);
  };

  const handleOptionChange = (value, field) => {
    setSelectedOptions((prev) => {
      let newSelectedOptions;
      let newSubmitData;

      const isAllOption = value.toLowerCase() === "all";
      const allOptionsExceptAll = typologyData
        .filter((option) => option.value.toLowerCase() !== "all")
        .map((option) => option.value);

      if (isAllOption) {
        // Condition 1 and 3: When "ALL" is selected
        newSelectedOptions = [allOptionValue];
        newSubmitData = allOptionsExceptAll;
      } else if (prev.includes(allOptionValue)) {
        // Condition 2: When "ALL" is already there and another option is selected
        newSelectedOptions = [value];
        newSubmitData = [value];
      } else {
        // When a non-"ALL" option is selected and "ALL" is not in prev
        newSelectedOptions = [...prev, value];
        newSubmitData = [...submitData, value];

        const allOptionsExceptAll = typologyData
          .filter((option) => option.value !== allOptionValue)
          .map((option) => option.value);
        if (
          newSelectedOptions.length === allOptionsExceptAll.length &&
          allOptionsExceptAll.every((option) =>
            newSelectedOptions.includes(option)
          )
        ) {
          newSelectedOptions = [allOptionValue];
          newSubmitData = allOptionsExceptAll;
        }
      }

      // Update submitData
      setSubmitData(newSubmitData);
      enableDisableOption(newSelectedOptions);

      return newSelectedOptions;
    });
  };

  const enableDisableOption = (values, isDisabled = true) => {
    const allOptionsExceptAll = typologyData
      .filter((option) => option.value !== allOptionValue)
      .map((option) => option.value);
    const allSelected = allOptionsExceptAll.every((option) =>
      values.includes(option)
    );

    const updatedOptions = typologyData.map((option) => {
      if (values.includes(allOptionValue)) {
        return {
          ...option,
          disabled: values.includes(option.value),
        };
      } else if (allSelected) {
        return {
          ...option,
          disabled: option.value === allOptionValue,
        };
      } else {
        return {
          ...option,
          disabled: values.includes(option.value),
        };
      }
    });

    setTypologyData(updatedOptions);
  };

  const validate = async (data) => {
    let schemaObj = {
      project_typology: Joi.array().label("Typology"),
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

  const handleSubmit = async () => {
    const options = submitData;
    let form_values = { project_typology: options };
    let errors = await validate(form_values);
    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }
    const business_types = BusinessAccountContext.data.business_types.map(
      (it) => it._id
    );
    const questionsData = await http.get(
      `${config.api_url}/business/business-questions`
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
        project_typology: { data: options },
        status: saveStatus,
      }
    );
    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        project_typology: { data: options },
        status: saveStatus,
      });
      goToStep(stepNumber);
      window.scrollTo(0, 0);
    }
  };

  const fetchData = async () => {
    const { data } = await http.get(
      `${config.api_url}/business/options?qs=project_typologies`
    );

    if (data) {
      const allOption = data.find(
        (option) => option.value.toLowerCase() === "all"
      );
      const allOptionValue = allOption ? allOption.value : "All";

      setAllOptionValue(allOptionValue);

      const sortedData = data
        .filter((option) => option.value.toLowerCase() !== "all")
        .sort((a, b) => a.value.localeCompare(b.value));

      // Append "All" option to the start of the sorted data
      const updatedOption = [allOption, ...sortedData];

      if (BusinessAccountContext?.data) {
        const filteredOptions = updatedOption.filter(
          (it) => it.value.toLowerCase() !== "all"
        );
        const contextTypologies =
          BusinessAccountContext?.data?.project_typology?.data || [];

        // Check if all options except "All" are selected
        const allOptionsExceptAll = filteredOptions.map(
          (option) => option.value
        );
        const allSelected = allOptionsExceptAll.every((option) =>
          contextTypologies.includes(option)
        );

        if (allSelected) {
          // If all options are selected, show "All" in the UI
          setSelectedOptions([allOptionValue]);
          setSubmitData(allOptionsExceptAll);
          setTypologyData(
            updatedOption.map((option) => ({
              ...option,
              disabled: option.value.toLowerCase() === "all" ? true : false,
            }))
          );
        } else {
          // Otherwise, show the individual selected options
          setSelectedOptions(contextTypologies);
          setSubmitData(contextTypologies);
          setTypologyData(
            updatedOption.map((option) => ({
              ...option,
              disabled: contextTypologies.includes(option.value),
            }))
          );
        }
      }
    }
  };

  const newTypologyList = selectedOptions.map((option, i) => (
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

  useEffect(() => {
    fetchData();
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((9 / 18) * 100);
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
        <h1 className={style.title}>Project typology</h1>
        <h2 className={`${style.description} ${style.desc_renovation}`}>
          This information is used by Archinza AI™️to matchmake your ideal
          clients.
        </h2>
        <p className={`${style.description} ${style.select_notice}`}>
          Choose as Many or choose All!
        </p>
        <div id="project_typology_error">
          <p className="error">{formError?.project_typology}</p>
        </div>
      </div>
      <div className={`${style.steps} ${style.fastep04}`}>
        <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
          <div className={style.field_wrapper}>
            <AutoCompleteField
              key={`autokey${autoKey}`}
              lightTheme
              textLabel="Select an Option"
              data={typologyData}
              onChange={(e, value) => {
                handleOptionChange(value.value, "project_typology");
                setAutoKey((prev) => {
                  return prev + 1;
                });
              }}
            />
          </div>
        </div>
        <ul className={`${style.steps_ul} ${style.new_list}`}>
          {newTypologyList}
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

export default FAStep11LT;
