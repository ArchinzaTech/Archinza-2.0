import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowblack } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";
import config from "../../../config/config";
import http from "../../../helpers/http";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";

const employeeCountArr = ["Low", "Medium", "High"];

const FHStep03LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  const [selectedRating, setSelectedRating] = useState("");
  const base_url = config.api_url;
  const [formError, setFormError] = useState({});
  const BusinessAccountContext = useBusinessContext();

  const employeeCountList = employeeCountArr.map((option) => (
    <React.Fragment key={option}>
      <RadioButton
        lightTheme
        label={option}
        labelId={option + "formH"}
        name="rating"
        checked={selectedRating === option}
        onChange={() => setSelectedRating(option)}
      />
    </React.Fragment>
  ));

  const validate = async (data) => {
    let schemaObj = {
      price_rating: Joi.string()
        .required()
        .label("Price Rating")
        .messages({ "string.empty": "Select a Rating" }),
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
    let form_values = { price_rating: selectedRating };

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

  useEffect(() => {
    setSelectedRating(BusinessAccountContext?.data?.price_rating);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((5 / 7) * 100);
    }
  }, [isActive]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>
          How would you rate your pricing based on industry trends?*
        </h1>
        <p className={style.description}></p>
        <div id="price_rating_error">
          <p className={`${style.top_error_with_space} ${style.error}`}>
            {formError.price_rating}
          </p>
        </div>
      </div>
      <div className={`${style.steps} ${style.step01}`}>
        <ul className={style.steps_ul}>{employeeCountList}</ul>
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

export default FHStep03LT;
