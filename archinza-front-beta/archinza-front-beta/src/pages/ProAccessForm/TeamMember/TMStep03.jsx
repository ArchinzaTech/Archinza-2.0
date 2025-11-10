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
import { useNavigate } from "react-router-dom";
import { dashboardURL } from "../../../components/helpers/constant-words";
// const concernArr = [
//   "Starting a Business",
//   "Jobs/ Internships",
//   "Networking",
//   "Practical Learning",
//   "Upskilling",
//   "Market Survey",
//   "All of the Above",
// ];

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
  const navigate = useNavigate();

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
      tm_unmet_needs: Joi.string().required().label("Unmet needs"),
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
    let status = "completed";
    if (form_values.tm_unmet_needs?.toLowerCase().includes("all")) {
      //insert all the options except "All of the above" in all_tm_unmet_needs
      //insert only "All of the above" option in tm_unmet_needs
      form_values.tm_unmet_needs = options.find((option) =>
        option.value.toLowerCase().includes("all")
      )?.value;
      form_values.all_tm_unmet_needs = options
        .filter((option) => !option.value.toLowerCase().includes("all"))
        .map((option) => option.value);
    }
    const data = await http.put(
      `${base_url}/pro-access/update/${ProAccess?.data?._id}`,
      {
        ...form_values,
        status: status,
      }
    );

    if (data) {
      ProAccess.update({ ...ProAccess.data, ...form_values, status: status });

      navigate(dashboardURL);

      window.scrollTo(0, 0);
    }
  };

  // =============== HTML RENDERING  ===========================

  const optionsList = options?.map((option, i) => (
    <React.Fragment key={`team-member-03-${i}`}>
      <RadioButton
        extraSpace={true}
        label={option.label}
        labelId={`team-member-03-${i}`}
        name="tm_unmet_needs"
        value={option.value}
        checked={values.tm_unmet_needs === option.value}
        onChange={handleChange}
      />
    </React.Fragment>
  ));

  // =============== DATA FETCHING  ===========================

  const fetchOptions = async (question_key) => {
    const res = await http.get(`${base_url}/options/${question_key}`);
    const data = res?.data || null;

    if (data) {
      let options = data?.options || [];

      const hasAllOfTheAbove = options.some(
        (option) => option.value.toLowerCase() === "all of the above"
      );

      if (!hasAllOfTheAbove) {
        options.push({ value: "All of the Above", label: "All of the Above" });
      }

      options = options
        .sort((a, b) => a.value.localeCompare(b.value))
        .sort((a, b) =>
          a.value.toLowerCase() === "all of the above"
            ? 1
            : b.value.toLowerCase() === "all of the above"
            ? -1
            : 0
        );

      setOptions(options);
    }
  };

  // =============== SIDE EFFECTS  ===========================

  useEffect(() => {
    fetchOptions("tm_unmet_needs");
  }, []);

  useEffect(() => {
    setValues({
      tm_unmet_needs: ProAccess?.data?.tm_unmet_needs,
    });
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((3 / 3) * 100);
    }
  }, [isActive]);

  return (
    <>
      <div className={style.text_container}>
        <button className={`${style.dashboard_btn} ${style.teammember_pill}`}>
          Working Professional
        </button>
        <h1 className={style.title}>
          Tell us about your largest concern/unmet need?
        </h1>
        <p
          className={`${style.description} ${
            formError?.tm_unmet_needs && style.active
          } ${style.subtext}`}
        >
          Feed Archinza AI<sup>tm</sup> with context to curate your dashboard!
        </p>
        <p
          className={`${style.description} ${
            formError?.tm_unmet_needs && style.active
          }`}
        >
          Choose one
        </p>
        {formError?.tm_unmet_needs && (
          <p className={`error ${style.error}`}>{formError?.tm_unmet_needs}</p>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className={`${style.steps} ${style.step02}`}>
          <ul className={style.step02_ul}>{optionsList}</ul>
        </div>

        {/* <div className={`${style.checkbox_wrapper}`}>
        <label className={style.checkbox_label} htmlFor="sameas">
          <input type="checkbox" className={style.check_box} id="sameas" />
          Select All
        </label>
      </div> */}

        <div className={`${style.next_logout} ${style.next_logout_step02}`}>
          <div className={style.cta_wrapper}>
            <button className={style.next_button}>
              <div className={style.text}>Submit</div>
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
                previousStep(2);
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
