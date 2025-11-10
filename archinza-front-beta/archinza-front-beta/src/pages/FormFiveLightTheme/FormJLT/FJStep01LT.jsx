import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowblack } from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteOthers from "../../../components/AutoCompleteOthers/AutoCompleteOthers";
import http from "../../../helpers/http";
import config from "../../../config/config";
import _ from "lodash";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";
// const newOptionsArr = ["newly added"];

const FJStep01LT = ({
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  previousStep,
  isActive,
  goToStep,
}) => {
  const [formError, setFormError] = useState({});
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
  const [servicesData, setServicesData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const newAdditionList = selectedOptions.map((option, i) => (
    <React.Fragment key={option}>
      <CheckboxButton
        lightTheme
        isChecked={true}
        label={option}
        labelId={option}
        onChange={() => handleCheckboxChange(i, option)}
      />
    </React.Fragment>
  ));

  const handleOptionChange = (value, field) => {
    enableDisableOption(value, true);

    setSelectedOptions((prev) => {
      return [...prev, value];
    });
  };

  const enableDisableOption = (value, isDisabled = true) => {
    const selectedIndex = _.findIndex(servicesData, { value: value });

    const updatedOptions = [...servicesData];

    if (updatedOptions[selectedIndex]) {
      updatedOptions[selectedIndex] = {
        ...updatedOptions[selectedIndex],
        disabled: isDisabled,
      };
      setServicesData((prev) => {
        return updatedOptions;
      });
    }
  };

  const validate = async (data) => {
    let schemaObj = {
      courses: Joi.array().min(1).required().label("Courses").messages({
        "array.min": "Please Select atleast 1 Course",
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
    let form_values = { courses: selectedOptions };

    let errors = await validate(form_values);

    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }
    let status = currentStep + 1;
    let saveStatus = status;
    if (
      BusinessAccountContext?.data?.status > currentStep &&
      !["registered", "completed"].includes(
        BusinessAccountContext?.data?.status
      )
    ) {
      saveStatus = BusinessAccountContext.data.status;
    }

    let data = await http.post(
      config.api_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        ...form_values,
        status: saveStatus,
      }
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        ...form_values,
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
      const capitalizeFirstLetter = (string) => {
        return string.replace(/\b\w/g, (char) => char.toUpperCase());
      };

      const updatedOption = data?.courses?.map((option) => {
        option.label = capitalizeFirstLetter(option.label);
        option.value = capitalizeFirstLetter(option.value);
        if (BusinessAccountContext?.data?.courses?.includes(option.value)) {
          return { ...option, disabled: true };
        } else {
          return option;
        }
      });

      setServicesData(updatedOption);
    }
  };

  useEffect(() => {
    setSelectedOptions(BusinessAccountContext?.data?.courses);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((3 / 7) * 100);
    }
  }, [isActive]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>What courses do you provide?*</h1>
        <p className={style.description}>Choose As Many</p>
        <div id="courses_error">
          {formError?.courses && <p className="error">{formError?.courses}</p>}
        </div>
      </div>
      <div className={`${style.steps} ${style.fastep04}`}>
        <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
          <div className={style.field_wrapper}>
            <AutoCompleteOthers
              key={`autokey${autoKey}`}
              lightTheme
              textLabel="Choose As Many"
              data={servicesData}
              onChange={(e, value) => {
                handleOptionChange(value.value, "services");
                setAutoKey((prev) => {
                  return prev + 1;
                });
              }}
            />
          </div>
        </div>
        <ul className={`${style.steps_ul} ${style.new_list}`}>
          {newAdditionList}
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
              goToStep(2);
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

export default FJStep01LT;
