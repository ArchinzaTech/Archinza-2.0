import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";
import http from "../../../helpers/http";
import config from "../../../config/config";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import Joi from "joi";
import helper from "../../../helpers/helper";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const FAStep09LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [locations, setLocations] = useState([]);
  const [values, setValues] = useState({
    project_location: "",
  });
  const [formError, setFormError] = useState("");
  const base_url = config.api_url;
  const BusinessAccountContext = useBusinessContext();

  const handleRadioChange = (event) => {
    const { value } = event.target;
    if (event.target.checked) {
      setValues((prevState) => ({
        ...prevState,
        project_location: "",
      }));
    } else {
      setValues((prevState) => ({
        ...prevState,
        project_location: value,
      }));
    }
  };

  const formALocationList = locations.map((option) => (
    <React.Fragment key={option}>
      <RadioButton
        lightTheme
        label={option}
        labelId={option + "formALocation"}
        name="project_location_forma"
        value={option}
        checked={values.project_location === option}
        onChange={handleRadioChange}
        deSelectedItem={true}
      />
    </React.Fragment>
  ));
  const validate = async (data) => {
    let schemaObj = {
      project_location: Joi.string()
        .trim()
        .allow("")
        .label("Project Location")
        .messages({
          "string.empty": "Please select a project location",
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
    let errors = await validate(values);
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

    values["project_location"] = { data: values.project_location };

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
      // nextStep();
      goToStep(stepNumber);
      window.scrollTo(0, 0);
    }
  };

  const fetchData = async () => {
    const { data } = await http.get(
      `${config.api_url}/business/options?qs=project_locations`
    );

    if (data) {
      let updatedOptions = data?.map((option) => option.value);

      if (
        BusinessAccountContext?.data?.country &&
        BusinessAccountContext.data.country.toLowerCase() !== "india"
      ) {
        updatedOptions = updatedOptions.filter(
          (location) => location.toLowerCase() !== "in/near my city"
        );
      }
      setLocations(updatedOptions);
    }
  };

  useEffect(() => {
    setValues({
      project_location: BusinessAccountContext?.data?.project_location?.data,
    });
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((7 / 18) * 100);
    }
  }, [isActive]);
  useEffect(() => {
    fetchData();
  }, []);

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
        <h1 className={style.title}>Project/client location preference</h1>
        <h2
          className={`${style.description} ${style.desc_renovation}`}
          style={{
            marginBottom: "2.4em",
          }}
        >
          This information is used by Archinza AI™️to matchmake your ideal
          clients.
        </h2>
        <div id="project_location_error">
          <p className={`${style.top_error_with_space} ${style.error}`}>
            {formError.project_location}
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

export default FAStep09LT;
