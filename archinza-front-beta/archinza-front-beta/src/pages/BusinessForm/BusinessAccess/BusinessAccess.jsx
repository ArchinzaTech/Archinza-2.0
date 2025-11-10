import React, { useEffect, useState } from "react";
import style from "./business.module.scss";
import BorderLinearProgress from "../../../components/ProgressBar/ProgressBar";
import StepWizard from "react-step-wizard";
import BAStep01 from "../EarliyAccess/BAStep01";
import BAStep02 from "../EarliyAccess/BAStep02";
import BAStep03 from "../EarliyAccess/BAStep03";
import FooterV2 from "../../../components/FooterV2/FooterV2";
import BlinkingDots from "../../../Animations/BlinkingDots/BlinkingDots";

const BusinessAccess = () => {
  const [progress, setProgress] = useState(0);
  const [formStep] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <BlinkingDots />
      <section className={style.business_sec1}>
        <div className={style.business_form_wrap}>
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
                <BAStep01 progressStatus={setProgress} />
                <BAStep02 progressStatus={setProgress} />
                <BAStep03 progressStatus={setProgress} />
              </StepWizard>
            </div>
          </div>
        </div>
      </section>
      <FooterV2 />
    </>
  );
};

export default BusinessAccess;
