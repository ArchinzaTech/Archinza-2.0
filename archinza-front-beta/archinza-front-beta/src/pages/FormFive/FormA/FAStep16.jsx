import React, { useEffect, useState } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import {
  deleteicon,
  formupload,
  imgclose,
  plusicon,
  rightarrowwhite,
} from "../../../images";

// make new array for individual I've used this one for all to showcase
const formAProjectPhotos = ["Img123.jpg", "Img123.jpg", "Img123.jpg"];
// make new array for individual I've used this one for all to showcase

const FAStep16 = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>
          Upload <br />
          Project Photos/Renders
        </h1>
        <p className={style.description}></p>
      </div>
      <div className={`${style.steps} ${style.fastep16}`}>
        <div className={`row  ${style.owner_row}`}>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField label="Project Name/Type*" />
              <p className={style.error}></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <div className={style.image_upload_wrapper}>
                <div className={style.image}>
                  <input
                    className={style.input_box}
                    type="file"
                    id="uploadFile"
                    hidden
                    name="company_logo"
                  />
                  <label htmlFor="uploadFile" className={style.upload_label}>
                    <div className={style.text}>Project Photos/Renders*</div>
                    <img
                      src={formupload}
                      alt="icon"
                      className={style.icon}
                      loading="lazy"
                    />
                  </label>
                </div>
              </div>
              <p
                className={error === false ? style.pass_notice : style.error}
                onClick={() => setError(true)}
              >
                {error === true && (
                  <span className={style.error_msg}>Error message here</span>
                )}
                {formAProjectPhotos.map((item) => (
                  <span className={style.img_name}>
                    {item}
                    <img
                      src={imgclose}
                      alt=""
                      className={style.close_icon}
                      loading="lazy"
                    />
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <div className={style.image_upload_wrapper}>
                <div className={style.image}>
                  <input
                    className={style.input_box}
                    type="file"
                    id="uploadFile"
                    hidden
                    name="company_logo"
                  />
                  <label htmlFor="uploadFile" className={style.upload_label}>
                    <div className={style.text}>WIP Photos/Renders*</div>
                    <img
                      src={formupload}
                      alt="icon"
                      className={style.icon}
                      loading="lazy"
                    />
                  </label>
                </div>
              </div>
              <p
                className={error === false ? style.pass_notice : style.error}
                onClick={() => setError(true)}
              >
                <span className={style.error_msg}>Error message here</span>
                {formAProjectPhotos.map((item) => (
                  <span className={style.img_name}>
                    {item}
                    <img
                      src={imgclose}
                      alt=""
                      className={style.close_icon}
                      loading="lazy"
                    />
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
        <div className={style.add_category}>
          <div className={style.dashed_line}></div>
          <div className={style.add_flex}>
            <img src={plusicon} alt="icon" className={style.icon} />
            <div className={style.title}>Add more projects</div>
          </div>
          <div className={style.dashed_line}></div>
        </div>
        <div className={`row  ${style.owner_row}`}>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField label="Project Name/Type*" />
              <p className={style.error}></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <div className={style.image_upload_wrapper}>
                <div className={style.image}>
                  <input
                    className={style.input_box}
                    type="file"
                    id="uploadFile"
                    hidden
                    name="company_logo"
                  />
                  <label htmlFor="uploadFile" className={style.upload_label}>
                    <div className={style.text}>Project Photos/Renders*</div>
                    <img
                      src={formupload}
                      alt="icon"
                      className={style.icon}
                      loading="lazy"
                    />
                  </label>
                </div>
              </div>
              <p
                className={error === false ? style.pass_notice : style.error}
                onClick={() => setError(true)}
              >
                {error === true && (
                  <span className={style.error_msg}>Error message here</span>
                )}
                {formAProjectPhotos.map((item) => (
                  <span className={style.img_name}>
                    {item}
                    <img
                      src={imgclose}
                      alt=""
                      className={style.close_icon}
                      loading="lazy"
                    />
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`${style.field_wrapper} ${style.field_with_crud}`}>
              <div className={style.image_upload_wrapper}>
                <div className={style.image}>
                  <input
                    className={style.input_box}
                    type="file"
                    id="uploadFile"
                    hidden
                    name="company_logo"
                  />
                  <label htmlFor="uploadFile" className={style.upload_label}>
                    <div className={style.text}>WIP Photos/Renders*</div>
                    <img
                      src={formupload}
                      alt="icon"
                      className={style.icon}
                      loading="lazy"
                    />
                  </label>
                </div>
              </div>
              <p
                className={error === false ? style.pass_notice : style.error}
                onClick={() => setError(true)}
              >
                <span className={style.error_msg}>Error message here</span>
                {formAProjectPhotos.map((item) => (
                  <span className={style.img_name}>
                    {item}
                    <img
                      src={imgclose}
                      alt=""
                      className={style.close_icon}
                      loading="lazy"
                    />
                  </span>
                ))}
              </p>
              <div className={style.add_delete_icon}>
                <img
                  src={plusicon}
                  alt="icon"
                  className={style.plusicon}
                  loading="lazy"
                />
                <img
                  src={deleteicon}
                  alt="icon"
                  className={style.deleteicon}
                  loading="lazy"
                  style={{ visibility: "visible" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep();
              window.scrollTo(0, 0);
            }}
          >
            <div className={style.text}>Submit</div>
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
              previousStep();
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

export default FAStep16;
