import React, { useEffect, useState } from "react";
import style from "./formfive.module.scss";
import BorderLinearProgress from "../../../components/ProgressBar/ProgressBar";
import StoreSettings from "../../../components/StoreSettings/StoreSettings";
import StepWizard from "react-step-wizard";
// Form 5 imports
// Form 5 imports
import RStep01 from "../RegistrationSteps/RStep01";
import RStep02 from "../RegistrationSteps/RStep02";
// Form 5 A imports
// Form 5 A imports
import FAStep01 from "../FormA/FAStep01";
import FAStep02 from "../FormA/FAStep02";
import FAStep03 from "../FormA/FAStep03";
import FAStep04 from "../FormA/FAStep04";
import FAStep05 from "../FormA/FAStep05";
import FAStep06 from "../FormA/FAStep06";
import FAStep07 from "../FormA/FAStep07";
import FAStep08 from "../FormA/FAStep08";
import FAStep09 from "../FormA/FAStep09";
import FAStep10 from "../FormA/FAStep10";
import FAStep11 from "../FormA/FAStep11";
import FAStep12 from "../FormA/FAStep12";
import FAStep13 from "../FormA/FAStep13";
import FAStep14 from "../FormA/FAStep14";
import FAStep15 from "../FormA/FAStep15";
import FAStep16 from "../FormA/FAStep16";
// Form 5 B imports
// Form 5 B imports
import FBStep01 from "../FormB/FBStep01";
import FBStep02 from "../FormB/FBStep02";
import FBStep03 from "../FormB/FBStep03";
import FBStep04 from "../FormB/FBStep04";
import FBStep05 from "../FormB/FBStep05";
import FBStep06 from "../FormB/FBStep06";
import FBStep07 from "../FormB/FBStep07";
import FBStep08 from "../FormB/FBStep08";
import FBStep09 from "../FormB/FBStep09";
import FBStep10 from "../FormB/FBStep10";
import FBStep11 from "../FormB/FBStep11";
import FBStep12 from "../FormB/FBStep12";
import FBStep13 from "../FormB/FBStep13";
import FBStep14 from "../FormB/FBStep14";
// Form 5 C imports
// Form 5 C imports
import FCStep01 from "../FormC/FCStep01";
import FCStep02 from "../FormC/FCStep02";
import FCStep03 from "../FormC/FCStep03";
import FCStep04 from "../FormC/FCStep04";
import FCStep05 from "../FormC/FCStep05";
import FCStep06 from "../FormC/FCStep06";
import FCStep07 from "../FormC/FCStep07";
import FCStep08 from "../FormC/FCStep08";
import FCStep09 from "../FormC/FCStep09";
// Form 5 D imports
// Form 5 D imports
import FDStep01 from "../FormD/FDStep01";
import FDStep02 from "../FormD/FDStep02";
import FDStep03 from "../FormD/FDStep03";
import FDStep04 from "../FormD/FDStep04";
import FDStep05 from "../FormD/FDStep05";
import FDStep06 from "../FormD/FDStep06";
import FDStep07 from "../FormD/FDStep07";
import FDStep08 from "../FormD/FDStep08";
import FCStep10 from "../FormC/FCStep10";
import FDStep09 from "../FormD/FDStep09";
import FooterV2 from "../../../components/FooterV2/FooterV2";
import BlinkingDots from "../../../Animations/BlinkingDots/BlinkingDots";

const FormFive = () => {
  const [progress, setProgress] = useState(0);
  const [formStep] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BlinkingDots />
      <section className={style.formfive_sec1}>
        <div className={style.formfive_form_wrap}>
          <div className="my_container">
            <div className={style.progress_wrapper}>
              <BorderLinearProgress variant="determinate" value={progress} />
            </div>
            <div className={style.steps_wrapper}>
              <StepWizard
                initialStep={formStep}
                transitions={{
                  enterRight: "formChangeAnimation",
                  enterLeft: "formChangeAnimation",
                  intro: "formChangeAnimation",
                }}
              >
                <RStep01 progressStatus={setProgress} />
                <RStep02 progressStatus={setProgress} />
                {/* FORM A steps */}
                {/* FORM A steps */}
                {/* FORM A steps */}
                <FAStep01 progressStatus={setProgress} />
                <FAStep02 progressStatus={setProgress} />
                <FAStep03 progressStatus={setProgress} />
                <FAStep04 progressStatus={setProgress} />
                <FAStep05 progressStatus={setProgress} />
                <FAStep06 progressStatus={setProgress} />
                <FAStep07 progressStatus={setProgress} />
                <FAStep08 progressStatus={setProgress} />
                <FAStep09 progressStatus={setProgress} />
                <FAStep10 progressStatus={setProgress} />
                <FAStep11 progressStatus={setProgress} />
                <FAStep12 progressStatus={setProgress} />
                <FAStep13 progressStatus={setProgress} />
                <FAStep14 progressStatus={setProgress} />
                <FAStep15 progressStatus={setProgress} />
                <FAStep16 progressStatus={setProgress} />
                {/* FORM B steps */}
                {/* FORM B steps */}
                {/* FORM B steps */}
                <FBStep01 progressStatus={setProgress} />
                <FBStep02 progressStatus={setProgress} />
                <FBStep03 progressStatus={setProgress} />
                <FBStep04 progressStatus={setProgress} />
                <FBStep05 progressStatus={setProgress} />
                <FBStep06 progressStatus={setProgress} />
                <FBStep07 progressStatus={setProgress} />
                <FBStep08 progressStatus={setProgress} />
                <FBStep09 progressStatus={setProgress} />
                <FBStep10 progressStatus={setProgress} />
                <FBStep11 progressStatus={setProgress} />
                <FBStep12 progressStatus={setProgress} />
                <FBStep13 progressStatus={setProgress} />
                <FBStep14 progressStatus={setProgress} />
                {/* FORM C steps */}
                {/* FORM C steps */}
                {/* FORM C steps */}
                <FCStep01 progressStatus={setProgress} />
                <FCStep02 progressStatus={setProgress} />
                <FCStep03 progressStatus={setProgress} />
                <FCStep04 progressStatus={setProgress} />
                <FCStep05 progressStatus={setProgress} />
                <FCStep06 progressStatus={setProgress} />
                <FCStep07 progressStatus={setProgress} />
                <FCStep10 progressStatus={setProgress} />
                <FCStep08 progressStatus={setProgress} />
                <FCStep09 progressStatus={setProgress} />
                {/* FORM D steps */}
                {/* FORM D steps */}
                {/* FORM D steps */}
                <FDStep01 progressStatus={setProgress} />
                <FDStep02 progressStatus={setProgress} />
                <FDStep03 progressStatus={setProgress} />
                <FDStep04 progressStatus={setProgress} />
                <FDStep05 progressStatus={setProgress} />
                <FDStep06 progressStatus={setProgress} />
                <FDStep09 progressStatus={setProgress} />
                <FDStep07 progressStatus={setProgress} />
                <FDStep08 progressStatus={setProgress} />
              </StepWizard>
              <StoreSettings />
            </div>
          </div>
        </div>
        <FooterV2 />
      </section>
    </>
  );
};

export default FormFive;
