import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowblack } from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteField from "../../../components/AutoCompleteField/AutoCompleteField";
import http from "../../../helpers/http";
import config from "../../../config/config";
import _ from "lodash";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";

const FFStep03LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  const [formError, setFormError] = useState({});
  const [typologyData, setTypologyData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [autoKey, setAutoKey] = useState(1);

  const BusinessAccountContext = useBusinessContext();

  const handleCheckboxChange = (index, value) => {
    enableDisableOption(value, false);
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions.splice(index, 1);
    setSelectedOptions((prev) => {
      return updatedSelectedOptions;
    });
  };
  const handleOptionChange = (value, field) => {
    enableDisableOption(value, true);

    setSelectedOptions((prev) => {
      return [...prev, value];
    });
  };

  const enableDisableOption = (value, isDisabled = true) => {
    const selectedIndex = _.findIndex(typologyData, { value: value });

    const updatedOptions = [...typologyData];

    if (updatedOptions[selectedIndex]) {
      updatedOptions[selectedIndex] = {
        ...updatedOptions[selectedIndex],
        disabled: isDisabled,
      };
      setTypologyData((prev) => {
        return updatedOptions;
      });
    }
  };

  const validate = async (data) => {
    let schemaObj = {
      f_project_typology: Joi.array().min(1).label("Typology").messages({
        "array.min": "You must select at least one Typology",
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
    let form_values = { f_project_typology: selectedOptions };

    let errors = await validate(form_values);

    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }
    let status = currentStep + 1;
    let saveStatus = status;
    if (BusinessAccountContext?.data?.status > currentStep) {
      saveStatus = BusinessAccountContext.data.status;
    }
    let data = await http.post(
      config.api_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        f_project_typology: selectedOptions,
        status: saveStatus,
      }
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        f_project_typology: selectedOptions,
        status: saveStatus,
      });
      nextStep();
      window.scrollTo(0, 0);
    }
  };

  const fetchServices = async () => {
    const { data } = await http.get(
      `${config.api_url}/business/business-type-options/${BusinessAccountContext?.data?.business_type}`
    );
    if (data) {
      const updatedOption = data?.typologies?.map((option) => {
        if (
          BusinessAccountContext?.data?.f_project_typology?.includes(
            option.value
          )
        ) {
          return { ...option, disabled: true };
        } else {
          return option;
        }
      });
      setTypologyData(updatedOption);
    }
  };

  const newTypologyList = selectedOptions.map((option, i) => (
    <React.Fragment key={option}>
      <CheckboxButton
        lightTheme
        isChecked={true}
        label={option}
        labelId={option + "formFTypology"}
        onChange={() => handleCheckboxChange(i, option)}
      />
    </React.Fragment>
  ));

  useEffect(() => {
    setSelectedOptions(BusinessAccountContext?.data?.f_project_typology);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((5 / 8) * 100);
    }
  }, [isActive]);
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Project Typology*</h1>
        <p className={style.description}>Choose As Many</p>
        <div id="f_project_typology_error">
          <p className="error">{formError?.f_project_typology}</p>
        </div>
      </div>
      <div className={`${style.steps} ${style.fastep04}`}>
        <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
          <div className={style.field_wrapper}>
            <AutoCompleteField
              key={`autokey${autoKey}`}
              lightTheme
              textLabel="Select an Option"
              data={typologyData}
              onChange={(e, value) => {
                handleOptionChange(value.value, "project_typology");
                setAutoKey((prev) => {
                  return prev + 1;
                });
              }}
            />
          </div>
        </div>
        <ul className={`${style.steps_ul} ${style.new_list}`}>
          {newTypologyList}
        </ul>
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
              previousStep(5);
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

export default FFStep03LT;
