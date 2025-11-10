import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowblack } from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import config from "../../../config/config";
import http from "../../../helpers/http";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import Joi from "joi";
import helper from "../../../helpers/helper";

const FBStep10LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  const [projetScopeData, setProjectScopeData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [formError, setFormError] = useState({});
  const BusinessAccountContext = useBusinessContext();

  const validate = async (data) => {
    let schemaObj = {
      b_project_scope: Joi.array()
        .min(1)
        .required()
        .label("Project Scope")
        .messages({
          "array.min": "Please Select atleast 1 Project Scope",
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

  const onChangeHandler = (option, e) => {
    const isSelected = e.target.checked;
    const updatedOptions = [...selectedOptions];

    if (option === "ALL") {
      if (isSelected) {
        updatedOptions.length = 0;
        updatedOptions.push("ALL");
        setAllSelected(true);
        setAllOptions([...projetScopeData.slice(1)]);
      } else {
        updatedOptions.length = 0;
      }
    } else {
      if (updatedOptions.includes("ALL")) {
        updatedOptions.splice(updatedOptions.indexOf("ALL"), 1);
      }
      if (isSelected) {
        updatedOptions.push(option);
      } else {
        updatedOptions.splice(updatedOptions.indexOf(option), 1);
      }
      const allOtherSelected = projetScopeData
        .slice(1)
        .every((item) => updatedOptions.includes(item));

      if (allOtherSelected && !allSelected) {
        updatedOptions.length = 0;
        updatedOptions.push("ALL");
        setAllSelected(true);
        setAllOptions([...projetScopeData.slice(1)]);
      } else {
        setAllSelected(false);
      }
    }
    setSelectedOptions(updatedOptions);
  };

  const handleSubmit = async () => {
    const options = allSelected ? allOptions : selectedOptions;

    let errors = await validate({ b_project_scope: options });
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
      config.api_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        b_project_scope: options,
        status: saveStatus,
      }
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        b_project_scope: options,
        status: saveStatus,
      });
      nextStep();
      window.scrollTo(0, 0);
    }
  };

  const fetchData = async () => {
    const { data } = await http.get(
      `${config.api_url}/business/business-type-options/${BusinessAccountContext?.data?.business_type}`
    );
    if (data) {
      const updatedOption = data?.preferences?.map((option) => {
        return option.value;
      });

      if (
        updatedOption.length ===
        BusinessAccountContext?.data?.b_project_scope?.length
      ) {
        setSelectedOptions(["ALL"]);
        setAllSelected(true);
        setAllOptions(updatedOption);
      } else {
        setSelectedOptions(BusinessAccountContext?.data?.b_project_scope);
      }
      setProjectScopeData(["ALL", ...updatedOption]);
    }
  };

  const projectSizeList = projetScopeData.map((option) => (
    <React.Fragment key={option}>
      <CheckboxButton
        lightTheme
        label={option}
        labelId={option + "formB_project_scope"}
        checked={selectedOptions.includes(option)}
        onChange={(e) => onChangeHandler(option, e)}
      />
    </React.Fragment>
  ));
  useEffect(() => {
    fetchData();
  }, [currentStep]);
  useEffect(() => {
    if (isActive) {
      progressStatus((12 / 15) * 100);
    }
  }, [isActive]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Preference of Project Scope</h1>
        <p className={style.description}>Choose As Many</p>
        <div id="b_project_scope_error">
          <p className={`${style.rstep02Error} ${style.error}`}>
            {formError.b_project_scope}
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
              src={rightarrowblack}
              alt="icon"
              className={style.icon}
              loading="lazy"
            />
          </div>
          <div
            className={style.back_button}
            onClick={() => {
              previousStep(3);
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

export default FBStep10LT;
