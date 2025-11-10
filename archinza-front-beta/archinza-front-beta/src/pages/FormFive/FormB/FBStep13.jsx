import React, { useEffect, useState } from "react";
import style from "../Form/formfive.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import {
  catalougeDelete,
  formupload,
  plusicon,
  rightarrowwhite,
} from "../../../images";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import { Link } from "react-router-dom";
import { useWindowSize } from "react-use";

const newFormBCatalougeBrandArr = ["Kohler"];
const newFormBNewCatalougeBrandArr = ["New business"];

const FBStep13 = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
}) => {
  const [upload, setUpload] = useState(false);
  const [error] = useState(false);
  const { width } = useWindowSize();

  const newFormBCatalougeBrandList = newFormBCatalougeBrandArr.map((option) => (
    <React.Fragment key={option}>
      <CheckboxButton
        label={option}
        labelId={`form-b-catalouge-${option}`}
        isChecked={true}
      />
    </React.Fragment>
  ));

  const newFormBNewCatalougeBrandList = newFormBNewCatalougeBrandArr.map(
    (option) => (
      <React.Fragment key={option}>
        <CheckboxButton
          label={option}
          labelId={`form-b-new-catalouge-${option}`}
          isChecked={true}
        />
      </React.Fragment>
    )
  );

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Upload Product Catalogues</h1>
        <p className={style.description}></p>
      </div>
      <div className={`${style.steps} ${style.fastep12} ${style.fbstep13}`}>
        <div className="row">
          <div className="col-md-6">
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
                    </div>
                  </div>
                  <div
                    className={style.filename}
                    style={{
                      display: error || upload === true ? "block" : "none",
                    }}
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
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField label="Name Of The Catalogue*" />
              <p className={style.error}></p>
            </div>
            <div className={style.field_wrapper}>
              <FullWidthTextField label="Add Your Business Name" />
              <p className={style.error}></p>
            </div>
            <ul className={`${style.steps_ul} ${style.fbstep13_ul}`}>
              {newFormBCatalougeBrandList}
            </ul>
          </div>
        </div>

        <div className={style.add_category}>
          <div className={style.dashed_line}></div>
          <div className={style.add_flex}>
            <img src={plusicon} alt="icon" className={style.icon} />
            <div className={style.title}>Add more catalogues</div>
          </div>
          <div className={style.dashed_line}></div>
        </div>

        <div className={`row ${style.new_category_row}`}>
          <div className="col-md-6">
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
                    </div>
                  </div>
                  <div
                    className={style.filename}
                    style={{
                      display: error || upload === true ? "block" : "none",
                    }}
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
          <div className="col-md-6">
            <div className={style.delete_col}>
              <div className={style.field_wrapper}>
                <FullWidthTextField label="Name Of The Catalogue*" />
                <p className={style.error}></p>
              </div>
              <div className={style.field_wrapper}>
                <FullWidthTextField label="Add Your Business Name" />
                <p className={style.error}></p>
              </div>
              {width > 768 && (
                <Link>
                  <img
                    src={catalougeDelete}
                    alt="delete"
                    className={style.delete_icon}
                    loading="lazy"
                  />
                </Link>
              )}
            </div>
            <ul className={`${style.steps_ul} ${style.fbstep13_ul}`}>
              {newFormBNewCatalougeBrandList}
            </ul>
            {width < 768 && (
              <Link>
                <img
                  src={catalougeDelete}
                  alt="delete"
                  className={style.delete_icon}
                  loading="lazy"
                />
              </Link>
            )}
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

export default FBStep13;
