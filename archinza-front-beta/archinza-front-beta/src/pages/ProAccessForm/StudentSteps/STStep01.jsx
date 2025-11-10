import React, { useContext, useEffect, useState } from "react";

import style from "../ProAccess/proaccess.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { studentProAccessCourseArr } from "../../../db/dataTypesData";
import { rightarrowwhite } from "../../../images";
import AutoCompleteOthers from "../../../components/AutoCompleteOthers/AutoCompleteOthers";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import _ from "lodash";
import config from "../../../config/config";
import http from "../../../helpers/http";
import Joi from "joi";
import { useAuth } from "../../../context/Auth/AuthState";
import ProAccessContext from "../../../context/ProAccess/ProAccessContext";
import { useProAccess } from "../../../context/ProAccess/ProAccessState";
import helper from "../../../helpers/helper";

const studentNewArr = ["Architecture", "Landscape Design"];

const STStep01 = ({
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  // =============== VARIABLE & STATES  ===========================
  const [values, setValues] = useState();
  const [formError, setFormError] = useState({});

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [autoKey, setAutoKey] = useState(1);

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
      st_study_field: Joi.array().min(1).label("Study field").messages({
        "array.min": "Please select at least one option to proceed",
        "array.base": "Study field is required",
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

    let form_values = { st_study_field: selectedOptions };

    let errors = await validate(form_values);

    setFormError(errors);
    if (Object.keys(errors).length) {
      return;
    }

    //check if selectedOptions have any other field except options

    const valueSet = new Set(options.map((obj) => obj.value.toLowerCase()));

    const newOptions = selectedOptions
      .filter((str) => !valueSet.has(str.toLowerCase()))
      ?.map((option) => ({
        value: helper.capitalizeWords(option),
        status: "pending",
      }));

    if (newOptions.length > 0) {
      await http.post(`${base_url}/options/custom-options/personal`, {
        question: "What is your field of study?",
        question_slug: "st_study_field",
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
  const studentAdditionList = selectedOptions.map((option, i) => (
    <React.Fragment key={`student-01-${i}`}>
      <CheckboxButton
        isChecked={true}
        label={option}
        labelId={`student-01-${i}`}
        onChange={() => handleCheckboxChange(i, option)}
      />
    </React.Fragment>
  ));

  // =============== DATA FETCHING  ===========================
  const fetchOptions = async (question_key) => {
    const { data } = await http.get(`${base_url}/options/${question_key}`);

    if (data) {
      const sortedOptions = data?.options?.sort((a, b) =>
        a.value.localeCompare(b.value)
      );
      const updatedOption = sortedOptions?.map((option) => {
        if (ProAccess?.data?.st_study_field?.includes(option.value)) {
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
    fetchOptions("st_study_field");
  }, []);

  useEffect(() => {
    setSelectedOptions(ProAccess?.data?.st_study_field);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((1 / 3) * 100);
    }
  }, [isActive]);

  return (
    <>
      <div className={style.text_container}>
        {/* <p className={style.head_text}>Claim Your Early Access Now.</p> */}
        <button className={`${style.dashboard_btn} ${style.student_pill}`}>
          Student
        </button>
        <h1 className={style.title}>What is your field of study?</h1>
        {formError?.st_study_field && (
          <p className="error">{formError?.st_study_field}</p>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className={`${style.steps} ${style.step01}`}>
          <div className={style.field_wrapper}>
            <AutoCompleteOthers
              key={`autokey${autoKey}`}
              freeSolo={false}
              popupIcon={""}
              textLabel="What is your field of study?*"
              data={options}
              onChange={(e, value) => {
                handleSelectChange(value.value, "st_study_field");
                setAutoKey((prev) => {
                  return prev + 1;
                });
              }}
            />
          </div>

          <ul className={`${style.steps_ul} ${style.new_list}`}>
            {studentAdditionList}
          </ul>
        </div>
        <div className={style.next_logout}>
          <div className={style.cta_wrapper}>
            <button
              className={style.next_button}
              // onClick={() => {
              //   nextStep(2);
              //   window.scrollTo(0, 0);
              // }}
            >
              <div className={style.text}>Next</div>
              <img
                src={rightarrowwhite}
                alt="icon"
                className={style.icon}
                loading="lazy"
              />
            </button>
          </div>
          {/* <LogoutText /> */}
        </div>
      </form>
    </>
  );
};

export default STStep01;
