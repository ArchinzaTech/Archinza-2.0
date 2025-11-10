import React, { useEffect } from "react";
import style from "../TeamAccess/teammember.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";

const concernsArr = [
  "Design Consultancy Firm",
  "Design & Build Business",
  "Services Consultancy (MEP/Structure)",
  "Vastu Firm",
  "Project Management Consultancy",
  "Restoration/Conservation Firm",
  "Lighting Design",
  "Product/Furniture Design",
  "Product Manufacturing/Selling Business",
  "Retail Store",
  "Decor/Art Gallery",
  "Online Business",
  "3D visualization Business",
  "Influencer Business",
  "Content/Photography Agency",
  "PR/Marketing/Communication Agency",
  "Publishing House",
  "Events Agency",
  "Education/Courses Business",
];

const TAStep03 = ({ nextStep, previousStep, currentStep, totalSteps, progressStatus }) => {
  const concernList = concernsArr.map((option) => (
    <React.Fragment key={option}>
      <CheckboxButton label={option} labelId={option} />
    </React.Fragment>
  ));

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={`${style.title} ${style.Step02_title}`}>
        Where Do You Work Now & Have Worked In The Past?
        </h1>
        <p className={style.description}>Choose as many</p>
      </div>
      <div className={`${style.steps} ${style.step01}`}>
        <ul className={style.step02_ul}>{concernList}</ul>
      </div>
      <div className={`${style.next_logout} ${style.step03_next_logout}`}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep(4);
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
              previousStep(2);
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

export default TAStep03;
