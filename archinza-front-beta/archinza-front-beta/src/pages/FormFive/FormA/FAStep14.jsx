import React, { useEffect, useState } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { formupload, rightarrowwhite } from "../../../images";

const FAStep14 = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const [upload, setUpload] = useState(false);
  const [error] = useState(false);

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Upload Company Profile</h1>
        <p className={style.description}></p>
      </div>
      <div className={`${style.steps} ${style.fastep12}`}>
        <div className={style.fileupload_wrapper}>
          <div className={style.fileupload}>
            <input
              className={style.input_box}
              type="file"
              id="uploadFile"
              hidden
              name="company_logo"
            />
            <label
              htmlFor="uploadFile"
              className={style.upload_label}
              onClick={() => setUpload(true)}
            >
              <div className={style.img_wrapper}>
                <img
                  width={57}
                  height={40}
                  src={formupload}
                  alt="upload"
                  className={style.upload_icon}
                  loading="lazy"
                />
              </div>
              <div className={style.cta_wrapper}>
                <div className={style.next_button}>
                  <div className={style.text}>Upload file</div>
                  <img
                    src={rightarrowwhite}
                    alt="icon"
                    className={style.icon}
                    loading="lazy"
                  />
                </div>
              </div>
              <div
                className={style.filename}
                style={{ display: error || upload === true ? "block" : "none" }}
              >
                {upload === true ? "File name" : "Error message here"}
              </div>
              <div className={style.notice}>
                Maximum file size is 100MB. PDF, JPEG, PNG allowed
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep(10);
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
    </>
  );
};

export default FAStep14;
