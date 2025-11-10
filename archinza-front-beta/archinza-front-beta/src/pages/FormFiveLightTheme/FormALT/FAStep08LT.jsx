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

const FBStep08LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const base_url = config.api_url;
  const [values, setValues] = useState({
    team_range: "",
  });
  const [teamRange, setTeamRange] = useState([]);
  const [formError, setFormError] = useState({});

  const BusinessAccountContext = useBusinessContext();

  const handleRadioChange = (event) => {
    const { value } = event.target;
    if (event.target.checked) {
      setValues((prevState) => {
        return {
          ...prevState,
          ["team_range"]: "",
        };
      });
    } else {
      setValues((prevState) => {
        return {
          ...prevState,
          ["team_range"]: value,
        };
      });
    }
  };

  const validate = async (data) => {
    let schemaObj = {
      team_range: Joi.string().trim().allow("").label("Team Range").messages({
        "string.empty": "Please Select an Team Range",
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

    values["team_range"] = { data: values.team_range };

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
      goToStep(stepNumber);
      window.scrollTo(0, 0);
    }
  };

  const fetchData = async () => {
    const { data } = await http.get(
      `${config.api_url}/business/options?qs=team_member_ranges`
    );
    if (data) {
      const updatedOption = data?.map((option) => {
        return option.value;
      });
      setTeamRange(updatedOption);
    }
  };
  const employeeCountList = teamRange.map((option) => (
    <React.Fragment key={option}>
      <RadioButton
        lightTheme
        label={option}
        labelId={option + "formB"}
        name="reamRangeFormB"
        value={option}
        checked={values.team_range === option}
        onChange={handleRadioChange}
        deSelectedItem={true}
      />
    </React.Fragment>
  ));

  useEffect(() => {
    setValues({
      team_range: BusinessAccountContext?.data?.team_range?.data,
    });
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((6 / 18) * 100);
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
      <LightThemeBackground />
      <div className={style.text_container}>
        <p className={style.page_title}>AI-Powered Client matchmaking</p>
        <p
          className={`${style.description} ${style.select_notice} mb-2`}
          style={{ fontSize: "1em" }}
        >
          (Optional)
        </p>
        <h1 className={style.title}>Number of team members</h1>
        <h2
          className={`${style.description} ${style.desc_renovation}`}
          style={{
            marginBottom: "2.4em",
          }}
        >
          This information is used by Archinza AI™️to matchmake your ideal
          clients.
        </h2>
        <div id="team_range_error">
          {formError.team_range && (
            <p className={`${style.top_error_with_space} ${style.error}`}>
              {formError.team_range}
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

export default FBStep08LT;
