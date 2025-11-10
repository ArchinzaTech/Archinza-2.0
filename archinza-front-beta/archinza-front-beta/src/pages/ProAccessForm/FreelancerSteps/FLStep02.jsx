import React, { useEffect, useState } from "react";
import style from "../ProAccess/proaccess.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
// import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import http from "../../../helpers/http";
import Joi from "joi";
import { useProAccess } from "../../../context/ProAccess/ProAccessState";

import config from "../../../config/config";
import RadioButton from "../../../components/RadioButton/RadioButton";
import { useNavigate } from "react-router-dom";
import { dashboardURL } from "../../../components/helpers/constant-words";
import { useWindowSize } from "react-use";
import { useAuth } from "../../../context/Auth/AuthState";
// const concernArr = [
//   "Finding Leads/Clients",
//   "Finding People/Products",
//   "Marketing",
//   "Networking",
//   "Business Operations",
//   "All of the Above",
// ];

const FLStep02 = ({
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
  const { width } = useWindowSize();
  const base_url = config.api_url;
  const joiOptions = config.joiOptions;

  const ProAccess = useProAccess();
  const navigate = useNavigate();
  const auth = useAuth();

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
      fl_unmet_needs: Joi.string().required().label("Unmet needs"),
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
    if (form_values.fl_unmet_needs?.toLowerCase().includes("all")) {
      //insert all the options except "All of the above" in all_fl_unmet_needs
      //insert only "All of the above" option in fl_unmet_needs
      form_values.fl_unmet_needs = options.find((option) =>
        option.value.toLowerCase().includes("all")
      )?.value;
      form_values.all_fl_unmet_needs = options
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
    <React.Fragment key={`freelancer-02-${i}`}>
      <RadioButton
        extraSpace={true}
        label={option.label}
        labelId={`freelancer-02-${i}`}
        name="fl_unmet_needs"
        value={option.value}
        checked={values.fl_unmet_needs === option.value}
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
    fetchOptions("fl_unmet_needs");
  }, []);

  useEffect(() => {
    setValues({
      fl_unmet_needs: ProAccess?.data?.fl_unmet_needs,
    });
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((2 / 2) * 100);
    }
  }, [isActive]);

  return (
    <>
      <div className={style.text_container}>
        <button className={`${style.dashboard_btn} ${style.businessFirm_pill}`}>
          Freelancer/Artist
        </button>
        <h1 className={style.title}>
          What is your largest concern or unmet need at your work / business /
          firm?
        </h1>
        <p
          className={`${style.description} ${
            formError?.fl_unmet_needs && style.active
          }`}
        >
          Choose one
        </p>
        {formError?.fl_unmet_needs && (
          <p className={`error ${style.error}`}>{formError?.fl_unmet_needs}</p>
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
            <button
              className={style.next_button}
              // onClick={() => {
              //   nextStep();
              //   window.scrollTo(0, 0);
              // }}
            >
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

export default FLStep02;
