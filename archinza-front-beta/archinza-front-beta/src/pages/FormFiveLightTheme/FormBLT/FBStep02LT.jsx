import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteOthers from "../../../components/AutoCompleteOthers/AutoCompleteOthers";
import http from "../../../helpers/http";
import config from "../../../config/config";
import _ from "lodash";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";

const FBStep02LT = ({
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  previousStep,
  isActive,
}) => {
  const [formError, setFormError] = useState({});
  const [servicesData, setServicesData] = useState([]);
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
  const newFormASupportList = selectedOptions.map((option, i) => (
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
      b_additional_services: Joi.array().min(1).label("Support").messages({
        "array.min": "You must select at least one Service",
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
    let form_values = { b_additional_services: selectedOptions };
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
        b_additional_services: selectedOptions,
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

  const fetchServices = async () => {
    const { data } = await http.get(
      `${config.api_url}/business/business-type-options/${BusinessAccountContext?.data?.business_type}`
    );
    if (data) {
      const capitalizeFirstLetter = (string) => {
        return string.replace(/\b\w/g, (char) => char.toUpperCase());
      };
      const updatedOption = data?.addon_services?.map((option) => {
        option.label = capitalizeFirstLetter(option.label);
        option.value = capitalizeFirstLetter(option.value);
        if (
          BusinessAccountContext?.data?.b_additional_services?.includes(
            option.value
          )
        ) {
          return { ...option, disabled: true };
        } else {
          return option;
        }
      });
      setServicesData(updatedOption);
    }
  };

  useEffect(() => {
    setSelectedOptions(BusinessAccountContext?.data?.b_additional_services);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((4 / 15) * 100);
    }
  }, [isActive]);

  useEffect(() => {
    fetchServices();
  }, []);

  // useEffect(() => {
  //   progressStatus((currentStep / 13) * 100);
  // }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>
          What support does the business/firm provide in{" "}
          <br className={style.desktop_break} />
          addition to design & build?*
        </h1>
        <p className={style.description}>Choose As Many</p>
        <div id="b_additional_services_error"></div>
        {formError?.b_additional_services && (
          <p className="error">{formError?.b_additional_services}</p>
        )}
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
                handleOptionChange(value.value, "additional_servicess");
                setAutoKey((prev) => {
                  return prev + 1;
                });
              }}
            />
          </div>
        </div>
        <ul className={`${style.steps_ul} ${style.new_list}`}>
          {newFormASupportList}
        </ul>
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

export default FBStep02LT;
