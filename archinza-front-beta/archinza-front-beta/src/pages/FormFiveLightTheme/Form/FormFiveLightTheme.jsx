import React, { useContext, useEffect, useState } from "react";
import style from "./formfivelighttheme.module.scss";
import StoreSettings from "../../../components/StoreSettings/StoreSettings";
import StepWizard from "react-step-wizard";

import BusinessAccountContext from "../../../context/BusinessAccount/BusinessAccountContext";

// Form 5 imports
// Form 5 imports
import RStep01LT from "../RegistrationSteps/RStep01LT";
import RStep02LT from "../RegistrationSteps/RStep02LT";
// Form 5 A imports
// Form 5 A imports
import FAStep01LT from "../FormALT/FAStep01LT";
import FAStep04LT from "../FormALT/FAStep04LT";
import FAStep05LT from "../FormALT/FAStep05LT";
import FAStep06LT from "../FormALT/FAStep06LT";
import FAStep07LT from "../FormALT/FAStep07LT";
import FAStep08LT from "../FormALT/FAStep08LT";
import FAStep09LT from "../FormALT/FAStep09LT";
import FAStep10LT from "../FormALT/FAStep10LT";
import FAStep11LT from "../FormALT/FAStep11LT";
import FAStep12LT from "../FormALT/FAStep12LT";
import FAStep13LT from "../FormALT/FAStep13LT";
import FAStep14LT from "../FormALT/FAStep14LT";
import FAStep15LT from "../FormALT/FAStep15LT";
import FAStep16LT from "../FormALT/FAStep16LT";
import FAStep17LT from "../FormALT/FAStep17LT";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";
import BorderLinearProgressLightTheme from "../../../components/ProgressBarLightTheme/ProgressBarLightTheme";
import FooterV2 from "../../../components/FooterV2/FooterV2";
import FAStep02LT from "../FormALT/FAStep02LT";
import FAStep03LT from "../FormALT/FAStep03LT";
import config from "../../../config/config";
import http from "../../../helpers/http";
import { useAuth } from "../../../context/Auth/AuthState";
import { businessProfileEditURL2 } from "../../../components/helpers/constant-words";
import { useNavigate } from "react-router-dom";
import FDStep10LT from "../FormDLT/FDStep10LT";
import FBStep15LT from "../FormBLT/FBStep15LT";
import FCStep12LT from "../FormCLT/FCStep12LT";
import FEStep07LT from "../FormELT/FEStep07LT";
import FFStep06LT from "../FormFLT/FFStep06LT";
import FGStep04LT from "../FormGLT/FGStep04LT";
import FIStep04LT from "../FormILT/FIStep04LT";
import FJStep05LT from "../FormJLT/FJStep05LT";
import FAStep06LT2 from "../FormALT/FAStep06LT2";

const FormFiveLightTheme = () => {
  const [progress, setProgress] = useState(0);
  const [formStep, setformStep] = useState(1);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const navigate = useNavigate();
  const BusinessAccount = useContext(BusinessAccountContext);
  const auth = useAuth();
  const base_url = config.api_url;

  const fetchEntry = async (id) => {
    const response = await http.get(
      base_url + `/business/business-details/${id}`
    );

    if (response?.data) {
      const data = response.data;
      if (data?.status === "registered") {
        setformStep(1);
      } else if (data?.status === "completed") {
        // navigate(businessProfileURL);
        navigate(businessProfileEditURL2);
        // navigate(businessProfileViewURL2);
      } else {
        setformStep(parseInt(data.status));
      }
      BusinessAccount.update(data);
    }
    setLoading(false);
  };

  const handleNextStep = () => {
    console.log("Next Step function called");
  };

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);

    const handleBackButton = (event) => {
      event.preventDefault();
      window.history.pushState(null, null, window.location.pathname);
      console.log("Back button pressed, staying on current step:", formStep);
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [formStep]);

  useEffect(() => {
    if (auth?.user) {
      const data = auth.user;
      console.log(data);
      if (data?.status === "registered") {
        setformStep(1);
      } else if (data?.status === "completed") {
        // navigate(businessProfileURL);
        navigate(businessProfileEditURL2);
        // navigate(businessProfileViewURL2);
      } else {
        setformStep(parseInt(data.status));
      }
      BusinessAccount.update(data);

      setLoading(false);
    } else {
      // auth.businessLogin();
      // console.log("No User");
    }
  }, [auth]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      {/* <BlinkingDots /> */}
      <LightThemeBackground />
      <section className={style.formfive_sec1_lt}>
        <div className={style.formfive_form_wrap}>
          <div className="my_container">
            <div className={style.progress_wrapper}>
              <BorderLinearProgressLightTheme
                variant="determinate"
                value={progress}
              />
            </div>
            <div className={style.steps_wrapper}>
              <StepWizard
                isLazyMount={true}
                initialStep={formStep}
                transitions={{
                  enterRight: "formChangeAnimation",
                  enterLeft: "formChangeAnimation",
                  intro: "formChangeAnimation",
                }}
              >
                <RStep01LT progressStatus={setProgress} />
                <RStep02LT progressStatus={setProgress} />
                {/* FORM A steps */}
                {/* FORM A steps */}
                {/* FORM A steps */}
                <FAStep04LT progressStatus={setProgress} />
                <FAStep05LT progressStatus={setProgress} />
                <FAStep07LT progressStatus={setProgress} />
                <FAStep08LT progressStatus={setProgress} />
                <FAStep09LT progressStatus={setProgress} />
                <FAStep10LT progressStatus={setProgress} />
                <FAStep11LT progressStatus={setProgress} />
                <FAStep12LT progressStatus={setProgress} />
                <FAStep13LT progressStatus={setProgress} />
                <FAStep14LT progressStatus={setProgress} />
                <FAStep15LT progressStatus={setProgress} />
                <FAStep16LT progressStatus={setProgress} />
                <FAStep01LT progressStatus={setProgress} />
                <FAStep02LT progressStatus={setProgress} />
                <FAStep03LT progressStatus={setProgress} />
                <FAStep17LT progressStatus={setProgress} />
                <FAStep06LT progressStatus={setProgress} />
                <FAStep06LT2 progressStatus={setProgress} />
                {/* <FAStep17LT progressStatus={setProgress} /> */}
              </StepWizard>
              <StoreSettings />
            </div>
          </div>
        </div>
        <FooterV2 whatsappBotIcon={false} lightTheme />
      </section>
    </>
  );
};

export default FormFiveLightTheme;
