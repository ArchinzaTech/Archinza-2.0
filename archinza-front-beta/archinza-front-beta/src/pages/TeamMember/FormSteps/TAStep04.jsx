import React, { useEffect } from "react";
import style from "../TeamAccess/teammember.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";

const numbRangeArr = ["0-5", "5-10", "10-20", "20+"];

const TAStep04 = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const numbRangeList = numbRangeArr.map((option) => (
    <React.Fragment key={option}>
      <RadioButton
        extraSpace={true}
        label={option}
        labelId={option}
        radio_label_class={style.radio_label}
      />
    </React.Fragment>
  ));

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>
          How Many Years Of Experience Do You Have After Education?
        </h1>
        <p className={`${style.description} ${style.description_step04}`}>
          Choose one
        </p>
      </div>
      <div className={`${style.steps} ${style.step02}`}>
        <ul className={`${style.step02_ul} ${style.step04_ul}`}>
          {numbRangeList}
        </ul>
      </div>

      <div className={`${style.next_logout} ${style.step04_next_logout}`}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep(5);
              window.scrollTo(0, 0);
            }}
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
              previousStep(3);
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

export default TAStep04;
