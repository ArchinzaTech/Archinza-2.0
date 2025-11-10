import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowblack } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteField from "../../../components/AutoCompleteField/AutoCompleteField";
import http from "../../../helpers/http";
import config from "../../../config/config";
import _ from "lodash";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";

const FEStep05LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  const [formError, setFormError] = useState({});
  const [designData, setDesignData] = useState([]);
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
  const newDesignList = selectedOptions.map((option, i) => (
    <React.Fragment key={option}>
      <CheckboxButton
        lightTheme
        isChecked={true}
        label={option}
        labelId={option + "formEDesign"}
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
    const selectedIndex = _.findIndex(designData, { value: value });

    const updatedOptions = [...designData];

    if (updatedOptions[selectedIndex]) {
      updatedOptions[selectedIndex] = {
        ...updatedOptions[selectedIndex],
        disabled: isDisabled,
      };
      setDesignData((prev) => {
        return updatedOptions;
      });
    }
  };

  const validate = async (data) => {
    let schemaObj = {
      e_design_style: Joi.array().min(1).label("Design").messages({
        "array.min": "You must select at least one Design",
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
    let form_values = { e_design_style: selectedOptions };

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
        e_design_style: selectedOptions,
        status: saveStatus,
      }
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        e_design_style: selectedOptions,
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
      const updatedOption = data?.design_styles?.map((option) => {
        if (
          BusinessAccountContext?.data?.e_design_style?.includes(option.value)
        ) {
          return { ...option, disabled: true };
        } else {
          return option;
        }
      });
      setDesignData(updatedOption);
    }
  };

  useEffect(() => {
    setSelectedOptions(BusinessAccountContext?.data?.e_design_style);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((7 / 9) * 100);
    }
  }, [isActive]);
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Your Design Style*</h1>
        <p className={style.description}>Choose As Many</p>
        <div id="e_design_style_error">
          <p className="error">{formError?.e_design_style}</p>
        </div>
      </div>
      <div className={`${style.steps} ${style.fastep04}`}>
        <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
          <div className={style.field_wrapper}>
            <AutoCompleteField
              key={`autokey${autoKey}`}
              lightTheme
              textLabel="Select an Option"
              data={designData}
              onChange={(e, value) => {
                handleOptionChange(value.value, "design_styles");
                setAutoKey((prev) => {
                  return prev + 1;
                });
              }}
            />
          </div>
        </div>
        <ul className={`${style.steps_ul} ${style.new_list}`}>
          {newDesignList}
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

export default FEStep05LT;
