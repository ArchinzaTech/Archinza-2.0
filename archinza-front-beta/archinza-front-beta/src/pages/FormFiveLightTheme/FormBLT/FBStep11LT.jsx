import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowblack } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";
import config from "../../../config/config";
import http from "../../../helpers/http";
import SelectDropdown from "../../../components/SelectDropdown/SelectDropdown";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";
import Joi from "joi";

const FBStep11LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  const [selectedFee, setSelectedFee] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [allFees, setAllFees] = useState([]);
  const [formError, setFormError] = useState({});
  const base_url = config.api_url;
  const currencyArr = ["USD", "INR"];
  const BusinessAccountContext = useBusinessContext();

  const onHandleChange = (e) => {
    setSelectedCurrency(e.target.value);
    setSelectedFee("");
  };

  const handleSubmit = async () => {
    let form_values = {
      b_project_mimimal_fee: {
        fee: selectedFee,
        currency: selectedCurrency,
      },
    };

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

  const validate = async (data) => {
    let schemaObj = {
      b_project_mimimal_fee: Joi.object({
        fee: Joi.string().trim().required().messages({
          "string.empty": "Please select a Minimum Project Fee",
          "string.undefined": "Please select a Minimum Project Fee",
        }),
        currency: Joi.string().required(),
      }).label("Project Minimal Fee"),
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

  const fetchData = async () => {
    let data;

    if (selectedCurrency == "INR") {
      data = await http.get(
        `${config.api_url}/business/business-type-options/${BusinessAccountContext?.data?.business_type}`
      );
      if (data) {
        const updatedOption = data?.data?.min_fees
          ?.map((option) => {
            return option.value;
          })
          .filter((f) => f.currency === selectedCurrency)
          .map((it) => it.fee);
        setAllFees(updatedOption);
      }
    } else {
      data = await http.get(
        config.api_url +
          `/business/get-currency?base=INR&target=${selectedCurrency}&section=min_fees&business_type=business_type_b`
      );
      if (data) {
        setAllFees(data.data);
      }
    }
    // const { data } = await http.get(
    //   config.api_url + "/business/options?qs=min_fees"
    // );
    // if (data) {
    //   const updatedOption = data?.options
    //     ?.map((option) => {
    //       return option.value;
    //     })
    //     .filter((f) => f.currency === selectedCurrency)
    //     .map((it) => it.fee);

    //   setAllFees(updatedOption);
    // }
  };

  const formAMinFeeList = allFees.map((option) => (
    <React.Fragment key={option}>
      <RadioButton
        lightTheme
        extraSpace={true}
        label={option}
        name="minimal-fee-formB"
        checked={selectedFee === option}
        onChange={() => setSelectedFee(option)}
        labelId={`${option}_minimalFeeB`}
      />
    </React.Fragment>
  ));

  useEffect(() => {
    setSelectedFee(BusinessAccountContext?.data?.b_project_mimimal_fee?.fee);
    setSelectedCurrency(
      BusinessAccountContext?.data?.b_project_mimimal_fee?.currency ||
        selectedCurrency
    );
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((13 / 15) * 100);
    }
  }, [isActive]);
  useEffect(() => {
    fetchData();
  }, [selectedCurrency]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Your Current Minimum Project Fee?* </h1>
        <div className={`field_wrapper ${style.currency_dropdown}`}>
          <SelectDropdown
            label="Currency"
            labelId="Currency"
            lightTheme
            data={currencyArr}
            value={selectedCurrency}
            onChange={onHandleChange}
          />
        </div>
        <p className={style.description}></p>
        <div id="b_project_mimimal_fee_error">
          <p className={`${style.top_error_with_space} ${style.error}`}>
            {formError.b_project_mimimal_fee}
          </p>
        </div>
      </div>
      <div className={`${style.steps} ${style.step10}`}>
        <ul className={style.steps_ul}>{formAMinFeeList}</ul>
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
              previousStep(8);
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

export default FBStep11LT;
