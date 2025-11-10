import React, { useEffect, useState } from "react";
import style from "../ProAccess/proaccess.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
// import { studentProAccessCourseArr } from "../../../db/dataTypesData";
import { rightarrowwhite } from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteField from "../../../components/AutoCompleteField/AutoCompleteField";
import config from "../../../config/config";
import http from "../../../helpers/http";
import Joi from "joi";
import { useAuth } from "../../../context/Auth/AuthState";
// import ProAccessContext from "../../../context/ProAccess/ProAccessContext";
import { useProAccess } from "../../../context/ProAccess/ProAccessState";
import _ from "lodash";
import AutoCompleteOthers from "../../../components/AutoCompleteOthers/AutoCompleteOthers";
import helper from "../../../helpers/helper";

// const teamNewArr = ["Landscape Design"];

const TMStep01 = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  // =============== VARIABLE & STATES  ===========================
  // const [values, setValues] = useState();
  const [formError, setFormError] = useState({});
  const [autoKey, setAutoKey] = useState(1);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);

  const base_url = config.api_url;
  const joiOptions = config.joiOptions;

  const auth = useAuth();
  const ProAccess = useProAccess();

  // =============== FUNCTIONS  ===========================

  const handleSelectChange = (value, fieldName) => {
    //disable the selected options
    enableDisableOption(value, true);

    setSelectedOptions((prev) => {
      return [...prev, value];
    });
  };

  const enableDisableOption = (value, isDisabled = true) => {
    const selectedIndex = _.findIndex(options, { value: value });

    const updatedOptions = [...options];

    if (updatedOptions[selectedIndex]) {
      updatedOptions[selectedIndex] = {
        ...updatedOptions[selectedIndex],
        disabled: isDisabled,
      };
      setOptions((prev) => {
        return updatedOptions;
      });
    }
  };
  const handleCheckboxChange = (index, value) => {
    //enable the removed options
    enableDisableOption(value, false);

    //removing item from selected options
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions.splice(index, 1);
    setSelectedOptions((prev) => {
      return updatedSelectedOptions;
    });
  };

  const validate = async (data) => {
    let schemaObj = {
      tm_job_profile: Joi.array().min(1).label("Job Profile").messages({
        "array.min": "Please select at least one option to proceed",
        "array.base": "Job profile is required",
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

    let form_values = { tm_job_profile: selectedOptions };

    let errors = await validate(form_values);

    setFormError(errors);
    if (Object.keys(errors).length) {
      return;
    }
    const valueSet = new Set(options.map((obj) => obj.value.toLowerCase()));

    const newOptions = selectedOptions
      .filter((str) => !valueSet.has(str.toLowerCase()))
      ?.map((option) => ({
        value: helper.capitalizeWords(option),
        status: "pending",
      }));

    if (newOptions.length > 0) {
      await http.post(`${base_url}/options/custom-options/personal`, {
        question: " What is your current/past job profile/s?",
        question_slug: "tm_job_profile",
        options: newOptions,
        user: auth?.user?._id,
      });
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
  const teamAdditionList = selectedOptions?.map((option, i) => (
    <React.Fragment key={`team-member-01-${i}`}>
      <CheckboxButton
        isChecked={true}
        label={option}
        labelId={`team-member-01-${i}`}
        onChange={() => handleCheckboxChange(i, option)}
      />
    </React.Fragment>
  ));

  // =============== DATA FETCHING  ===========================
  const fetchOptions = async (question_key) => {
    const { data } = await http.get(`${base_url}/options/${question_key}`);

    if (data) {
      const updatedOption = data?.options?.map((option) => {
        if (ProAccess?.data?.tm_job_profile?.includes(option.value)) {
          return { ...option, disabled: true };
        } else {
          return option;
        }
      });
      setOptions(updatedOption);
    }
  };

  // =============== SIDE EFFECTS  ===========================

  useEffect(() => {
    fetchOptions("tm_job_profile");
  }, []);

  useEffect(() => {
    setSelectedOptions(ProAccess?.data?.tm_job_profile);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((1 / 3) * 100);
    }
  }, [isActive]);

  return (
    <>
      <div className={style.text_container}>
        <button className={`${style.dashboard_btn} ${style.teammember_pill}`}>
          Working Professional
        </button>
        {/* <p className={style.head_text}>Claim Your Early Access Now.</p> */}

        <h1 className={style.title}>
          What is your current/past job profile/s?
        </h1>

        {formError?.tm_job_profile && (
          <p className={`error ${style.error}`}>{formError?.tm_job_profile}</p>
        )}
        <p className={`${style.description} ${style.subtext} `}>
          Feed Archinza AI<sup>tm</sup> with context to curate your dashboard!
        </p>
        <p className={`${style.description}`}>
          Pick all that fit, or type your own!
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={`${style.steps} ${style.step01}`}>
          <div className={style.field_wrapper}>
            <AutoCompleteOthers
              // textLabel="What is your current/past job profile/s?*"
              // data={options}
              // onChange={(e, value) => {
              //   handleSelectChange(value.value, "tm_job_profile");
              // }}
              key={`autokey${autoKey}`}
              freeSolo={false}
              popupIcon={""}
              textLabel="What is your current/past job profile/s?*"
              data={options}
              onChange={(e, value) => {
                handleSelectChange(value.value, "tm_job_profile");
                setAutoKey((prev) => {
                  return prev + 1;
                });
              }}
            />
          </div>
          <ul className={`${style.steps_ul} ${style.new_list}`}>
            {teamAdditionList}
          </ul>
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
            {/* <div
              className={style.back_button}
              onClick={() => {
                previousStep();
                window.scrollTo(0, 0);
              }}
            >
              Back
            </div> */}
          </div>
          {/* <LogoutText /> */}
        </div>
      </form>
    </>
  );
};

export default TMStep01;
