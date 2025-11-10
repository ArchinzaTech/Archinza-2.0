import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowblack } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";
import http from "../../../helpers/http";
import config from "../../../config/config";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import Joi from "joi";
import helper from "../../../helpers/helper";

const FDStep03LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  const base_url = config.api_url;
  const [values, setValues] = useState({
    d_employees_range: "",
  });
  const [employees, setEmployees] = useState([]);
  const [formError, setFormError] = useState({});

  const BusinessAccountContext = useBusinessContext();

  const handleRadioChange = (option) => {
    setValues((prevState) => {
      return {
        ...prevState,
        ["d_employees_range"]: option,
      };
    });
  };
  const validate = async (data) => {
    let schemaObj = {
      d_employees_range: Joi.string()
        .trim()
        .required()
        .label("Employees Range")
        .messages({
          "string.empty": "Please Select an Employee Range",
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

  const handleSubmit = async () => {
    let errors = await validate(values);
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
        ...values,
        status: saveStatus,
      }
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        ...values,
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
      const updatedOption = data?.emoployee_count?.map((option) => {
        return option.value;
      });
      setEmployees(updatedOption);
    }
  };
  const employeeCountList = employees.map((option) => (
    <React.Fragment key={option}>
      <RadioButton
        lightTheme
        label={option}
        labelId={option + "formD"}
        name="employeeCountFormD"
        checked={values.d_employees_range === option}
        onChange={() => handleRadioChange(option)}
      />
    </React.Fragment>
  ));

  useEffect(() => {
    setValues({
      d_employees_range: BusinessAccountContext?.data?.d_employees_range,
    });
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((5 / 11) * 100);
    }
  }, [isActive]);

  useEffect(() => {
    fetchData();
  }, []);
  // useEffect(() => {
  //   progressStatus((currentStep / totalSteps) * 100);
  // }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Number of Employees*</h1>
        <p className={style.description}></p>
        <div id="d_employees_range_error">
          {formError.d_employees_range && (
            <p className={`${style.top_error_with_space} ${style.error}`}>
              {formError.d_employees_range}
            </p>
          )}
        </div>
      </div>
      <div className={`${style.steps} ${style.step01}`}>
        <ul className={style.steps_ul}>{employeeCountList}</ul>
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

export default FDStep03LT;
