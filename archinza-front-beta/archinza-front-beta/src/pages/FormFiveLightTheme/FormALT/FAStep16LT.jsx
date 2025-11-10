import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import config from "../../../config/config";
import http from "../../../helpers/http";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";
import {
  businessProfileEditURL2,
  congratulationsLightURL,
} from "../../../components/helpers/constant-words";
import { useNavigate } from "react-router-dom";
import UserInputComponent from "../../../components/UserInputComponent/UserInputComponent";
// import WaitScreen from "../../WaitScreen/WaitScreen";
import Joi from "joi";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const FAStep16LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const base_url = config.api_url;
  const [formError, setFormError] = useState({});
  const BusinessAccountContext = useBusinessContext();
  const navigate = useNavigate();

  const schema = Joi.object({
    selectedServices: Joi.array().allow(),
  });

  const redirectToPrevStep = async () => {
    const questionsData = await http.get(
      `${config.api_url}/business/business-questions`
    );
    const business_types = BusinessAccountContext.data.business_types.map(
      (it) => it._id
    );
    let stepNumber = helper.redirectBusinessUserBack(
      questionsData?.data,
      business_types,
      currentStep
    );
    goToStep(stepNumber);
  };

  const handleSubmit = async (selectedServices) => {
    const validationData = { selectedServices };
    setFormError({});
    const { error } = schema.validate(validationData, { abortEarly: false });
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      setFormError(errors);
      if (Object.keys(errors).length) {
        helper.scroll(helper.getFirstError(errors));
        return;
      }
    }
    const questionsData = await http.get(
      `${config.api_url}/business/business-questions`
    );
    const business_types = BusinessAccountContext.data.business_types.map(
      (it) => it._id
    );
    let stepNumber = helper.redirectBusinessUser(
      questionsData?.data,
      business_types,
      currentStep
    );
    let nextStepToGo = currentStep + 1;

    let saveStatus = Math.max(stepNumber, nextStepToGo);

    const updatedData = await http.get(
      `${base_url}/business/business-details/${BusinessAccountContext?.data?._id}`
    );
    if (
      updatedData?.data?.services?.length > 0 &&
      updatedData?.data?.is_services_manually
    ) {
    } else {
      saveStatus = currentStep + 1;
    }

    const { data } = await http.post(
      config.api_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        product_positionings: selectedServices,
        status: saveStatus,
      }
    );
    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        product_positionings: selectedServices,
        status: saveStatus,
        is_services_manually: updatedData?.data?.is_services_manually,
        services: updatedData?.data?.services,
      });
      goToStep(saveStatus);
      window.scrollTo(0, 0);
      return;
    }
  };

  // Fetch services in current step
  const fetchServices = async () => {
    const { data } = await http.get(
      `${config.api_url}/business/options?qs=product_positionings`
    );

    if (data) {
      data.sort((a, b) => (a.value > b.value ? 1 : -1));
    }
    return data || [];
  };

  useEffect(() => {
    if (isActive) {
      progressStatus((14 / 18) * 100);
    }
  }, [isActive]);

  const [isAboutModal, setIsAboutModal] = useState(false);
  const handleHide = () => setIsAboutModal(false);

  useEffect(() => {
    if (isAboutModal) {
      const timer = setTimeout(() => {
        setIsAboutModal(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAboutModal]);

  return (
    <>
      <LightThemeBackground />
      <div className={style.text_container}>
        <p className={style.page_title}>AI-Powered Client matchmaking</p>
        <h1 className={style.title}>
          Pick words that apply to your market positioning?
        </h1>
        <h2
          className={`${style.description} ${style.desc_renovation} ${style.aditional_spacing}`}
        >
          This will help us match you with your ideal clients
        </h2>
        <p className={`${style.description} ${style.select_notice}`}>
          <span>Choose as many or choose all, just be relevant!</span>
          {/* <span className={style.entity}>&#9432;</span> */}
        </p>
        <div id="selectedServices_error">
          <p className={`${style.rstep02Error} ${style.error}`}>
            {formError.selectedServices}
          </p>
        </div>
        <div className={`${style.spacing_rl_row_recive_queries} mx-auto`}>
          <UserInputComponent
            fetchServices={fetchServices}
            existingServices={
              BusinessAccountContext?.data?.product_positionings || []
            }
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() =>
              document.getElementById("submit-services-btn").click()
            }
          >
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
              redirectToPrevStep();
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

export default FAStep16LT;
