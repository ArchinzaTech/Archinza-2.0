import React, { useEffect, useState } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import FormFiveModal from "../../../components/FormFiveModal/FormFiveModal";
import RadioButton from "../../../components/RadioButton/RadioButton";

const defineBusinessArr = [
  "Design Firm/Consultancy",
  "Services Design Firm/Consultancy",
  "Design, Supply & Execute Business",
  "Product/Material - Seller/Installer/Contractor/Execution Team",
  "E Commerce/Business for Design & Decor",
  "Curator/Stylist/Gallery",
  "Event/PR/Marketing/Independ Publishing House",
  "Supporting Design",
  "Business",
];

const RStep02 = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const [modalShow, setModalShow] = useState(false);

  const concernList = defineBusinessArr.map((option) => (
    <React.Fragment key={option}>
      <RadioButton label={option} labelId={option} />
    </React.Fragment>
  ));

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Define Your Business</h1>
        <p className={style.description}>
          <span>Select One</span>
          <span className={style.entity} onClick={() => setModalShow(true)}>
            &#9432;
          </span>
        </p>
        <p className={`${style.rstep02Error} ${style.error}`}>
          error here error here
        </p>
      </div>
      <div className={`${style.steps} ${style.rstep02}`}>
        {/* <ul className={style.title_list}>{accordionList}</ul> */}
        <ul className={style.step02_ul}>{concernList}</ul>
      </div>
      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep(2);
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
              previousStep(8);
              window.scrollTo(0, 0);
            }}
          >
            Back
          </div>
        </div>
        <LogoutText />
      </div>
      <FormFiveModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
};

export default RStep02;
