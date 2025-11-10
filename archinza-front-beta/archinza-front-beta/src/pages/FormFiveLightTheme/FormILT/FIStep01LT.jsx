import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowblack } from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteOthers from "../../../components/AutoCompleteOthers/AutoCompleteOthers";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import http from "../../../helpers/http";
import config from "../../../config/config";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";

const FIStep01LT = ({
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  previousStep,
  isActive,
  goToStep,
}) => {
  const [brandName, setBrandName] = useState("");
  const [formError, setFormError] = useState({});
  const base_url = config.api_url;
  const BusinessAccountContext = useBusinessContext();

  const validate = async (data) => {
    let schemaObj = {
      brand_name: Joi.string()
        .required()
        .label("Brand Name")
        .messages({ "string.empty": "Brand Name cannot be empty" }),
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
    let form_values = { brand_name: brandName };

    let errors = await validate(form_values);

    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }

    const status = currentStep + 1;
    let saveStatus = status;
    if (BusinessAccountContext?.data?.status > currentStep) {
      saveStatus = BusinessAccountContext.data.status;
    }
    let data = await http.post(
      base_url +
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

  const handleChange = (e) => {
    setBrandName(e.target.value);
  };

  useEffect(() => {
    setBrandName(BusinessAccountContext?.data?.brand_name);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((3 / 6) * 100);
    }
  }, [isActive]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Name of your Brand*</h1>
        {/* <p className={style.description}>Choose As Many</p> */}
        <div id="brand_name_error">
          <p className={`${style.rstep02Error} ${style.error}`}>
            {formError.brand_name}
          </p>
        </div>
      </div>
      <div className={`${style.steps} ${style.fastep04}`}>
        <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
          <div className={style.field_wrapper}>
            <FullWidthTextField
              lightTheme
              label="Brand Name"
              value={brandName}
              onChange={handleChange}
            />
          </div>
        </div>
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

export default FIStep01LT;
