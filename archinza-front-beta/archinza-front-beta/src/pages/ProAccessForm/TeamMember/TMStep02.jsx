import React, { useEffect, useState } from "react";
import style from "../ProAccess/proaccess.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";
import http from "../../../helpers/http";
import Joi from "joi";
import { useProAccess } from "../../../context/ProAccess/ProAccessState";
import { useAuth } from "../../../context/Auth/AuthState";
import config from "../../../config/config";
// const yearsArr = ["0-2", "2-5", "5-10", "10-20", "20+"];

const TMStep02 = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  // =============== VARIABLE & STATES  ===========================

  const [values, setValues] = useState({});
  const [formError, setFormError] = useState({});

  const [options, setOptions] = useState([]);

  const base_url = config.api_url;
  const joiOptions = config.joiOptions;

  const auth = useAuth();
  const ProAccess = useProAccess();

  // =============== FUNCTIONS  ===========================

  const handleChange = (e) => {
    setValues((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const validate = async (data) => {
    let schemaObj = {
      tm_experience: Joi.string().required().label("Experience"),
    };

    const schema = Joi.object(schemaObj).options({ allowUnknown: true });

    const { error } = schema.validate(data, joiOptions);

    const errors = {};

    if (error) {
      error.details.map((field) => {
        errors[field.path[0]] = field.message;
        return true;
      });
    }

    return errors ? errors : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let form_values = values;

    let errors = await validate(form_values);

    setFormError(errors);
    if (Object.keys(errors).length) {
      return;
    }
    let status = currentStep + 1;

    const data = await http.put(
      `${base_url}/pro-access/update/${ProAccess?.data?._id}`,
      {
        ...form_values,
        status: status,
      }
    );

    if (data) {
      ProAccess.update({ ...ProAccess.data, ...form_values, status: status });

      nextStep();
      window.scrollTo(0, 0);
    }
  };

  // =============== HTML RENDERING  ===========================

  const yearsList = options?.map((option, i) => (
    <React.Fragment key={`team-member-02-${i}`}>
      <RadioButton
        extraSpace={true}
        label={option.label}
        labelId={`team-member-02-${i}`}
        name="tm_experience"
        value={option.value}
        checked={values.tm_experience === option.value}
        onChange={handleChange}
      />
    </React.Fragment>
  ));

  // =============== DATA FETCHING  ===========================

  const fetchOptions = async (question_key) => {
    const res = await http.get(`${base_url}/options/${question_key}`);

    const data = res?.data || null;

    if (data) {
      setOptions(data?.options);
    }
  };

  // =============== SIDE EFFECTS  ===========================

  useEffect(() => {
    fetchOptions("tm_experience");
  }, []);

  useEffect(() => {
    setValues({
      tm_experience: ProAccess?.data?.tm_experience,
    });
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((2 / 3) * 100);
    }
  }, [isActive]);

  return (
    <>
      <div className={style.text_container}>
        <button className={`${style.dashboard_btn} ${style.teammember_pill}`}>
          Working Professional
        </button>
        <h1 className={style.title}>
          Please tell us how many years of experience do you have?
        </h1>
        <p
          className={`${style.description} ${
            formError?.tm_experience && style.active
          } ${style.subtext} `}
        >
         Feed Archinza AI<sup>tm</sup> with context to curate your dashboard!
        </p>
        <p
          className={`${style.description} ${
            formError?.tm_experience && style.active
          }`}
        >
          Choose one
        </p>
        {formError?.tm_experience && (
          <p className={`error ${style.error}`}>{formError?.tm_experience}</p>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className={`${style.steps} ${style.step02}`}>
          <ul className={style.step02_ul}>{yearsList}</ul>
        </div>

        <div className={`${style.next_logout} ${style.next_logout_step02}`}>
          <div className={style.cta_wrapper}>
            <button className={style.next_button}>
              <div className={style.text}>Next</div>
              <img
                src={rightarrowwhite}
                alt="icon"
                className={style.icon}
                loading="lazy"
              />
            </button>
            <div
              className={style.back_button}
              onClick={() => {
                previousStep(1);
                window.scrollTo(0, 0);
              }}
            >
              Back
            </div>
          </div>
          <LogoutText />
        </div>
      </form>
    </>
  );
};

export default TMStep02;
