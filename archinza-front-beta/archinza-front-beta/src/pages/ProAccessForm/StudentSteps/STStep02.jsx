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

// const yearsArr = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

const STStep02 = ({
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
      st_graduate_year: Joi.string().required().messages({
        "string.empty": `Please choose an option to proceed`,
      }),
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
    <React.Fragment key={`student-02-${i}`}>
      <RadioButton
        extraSpace={true}
        label={option.label}
        labelId={`student-02-${i}`}
        name="st_graduate_year"
        value={option.value}
        checked={values.st_graduate_year === option.value}
        onChange={handleChange}
      />
    </React.Fragment>
  ));

  // =============== DATA FETCHING  ===========================

  const fetchOptions = async (question_key) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear + i).map(
      (it) => ({ label: it.toString(), value: it.toString() })
    );

    setOptions(years);
  };

  // =============== SIDE EFFECTS  ===========================

  useEffect(() => {
    fetchOptions("st_graduate_year");
  }, []);

  useEffect(() => {
    setValues({
      st_graduate_year: ProAccess?.data?.st_graduate_year,
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
        <button className={`${style.dashboard_btn} ${style.student_pill}`}>
          Student
        </button>
        <h1 className={style.title}>
          Please tell us the year you will graduate
        </h1>
        <p
          className={`${style.description} ${
            formError?.st_graduate_year && style.active
          }`}
        >
          Choose one
        </p>
        {formError?.st_graduate_year && (
          <p className={`error ${style.error}`}>
            {formError?.st_graduate_year}
          </p>
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

export default STStep02;
