import React, { useEffect, useState } from "react";
import style from "./teammember.module.scss";
import BorderLinearProgress from "../../../components/ProgressBar/ProgressBar";
import StepWizard from "react-step-wizard";
import TAStep01 from "../FormSteps/TAStep01";
import TAStep02 from "../FormSteps/TAStep02";
import TAStep03 from "../FormSteps/TAStep03";
import TAStep04 from "../FormSteps/TAStep04";
import TAStep05 from "../FormSteps/TAStep05";
import FooterV2 from "../../../components/FooterV2/FooterV2";
import BlinkingDots from "../../../Animations/BlinkingDots/BlinkingDots";

const TeamAccessForm = () => {
  const [progress, setProgress] = useState(0);
  const [formStep] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <BlinkingDots />
      <section className={style.team_sec1}>
        <div className={style.team_form_wrap}>
          <div className="my_container">
            <div className={style.progress_wrapper}>
              <BorderLinearProgress variant="determinate" value={progress} />
            </div>
            <StepWizard
              initialStep={formStep}
              transitions={{
                enterRight: "formChangeAnimation",
                enterLeft: "formChangeAnimation",
                intro: "formChangeAnimation",
              }}
            >
              <TAStep01 progressStatus={setProgress} />
              <TAStep02 progressStatus={setProgress} />
              <TAStep03 progressStatus={setProgress} />
              <TAStep04 progressStatus={setProgress} />
              <TAStep05 progressStatus={setProgress} />
            </StepWizard>
          </div>
        </div>
        <FooterV2 />
      </section>
    </>
  );
};

export default TeamAccessForm;
