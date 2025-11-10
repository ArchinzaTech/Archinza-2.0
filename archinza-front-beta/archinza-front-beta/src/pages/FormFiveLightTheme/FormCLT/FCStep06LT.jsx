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

const FCStep06LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  const [locations, setLocations] = useState([]);
  const [values, setValues] = useState({
    c_project_location: "",
  });
  const [formError, setFormError] = useState("");
  const base_url = config.api_url;
  const BusinessAccountContext = useBusinessContext();

  const formALocationList = locations.map((option) => (
    <React.Fragment key={option}>
      <RadioButton
        lightTheme
        label={option}
        labelId={option + "formCLocation"}
        name="project_location_formC"
        checked={values.c_project_location === option}
        onChange={() => handleRadioChange(option)}
      />
    </React.Fragment>
  ));

  const validate = async (data) => {
    let schemaObj = {
      c_project_location: Joi.string()
        .trim()
        .required()
        .label("Project Location")
        .messages({
          "string.empty": "Please Select a Project Location",
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
    setValues((prevState) => ({
      ...prevState,
      c_project_location: option,
    }));
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
      const updatedOption = data?.locations?.map((option) => {
        return option.value;
      });
      setLocations(updatedOption);
    }
  };

  useEffect(() => {
    setValues({
      c_project_location: BusinessAccountContext?.data?.c_project_location,
    });
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((8 / 15) * 100);
    }
  }, [isActive]);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Project Location Preference</h1>
        <p className={style.description}></p>
        <div id="c_project_location_error">
          <p className={`${style.top_error_with_space} ${style.error}`}>
            {formError.c_project_location}
          </p>
        </div>
      </div>
      <div className={`${style.steps} ${style.step08}`}>
        <ul className={style.steps_ul}>{formALocationList}</ul>
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

export default FCStep06LT;
