import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import BusinessFileUpload from "../../../components/BusinessFileUpload/BusinessFileUpload";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import http from "../../../helpers/http";
import config from "../../../config/config";
import { useNavigate } from "react-router-dom";
import helper from "../../../helpers/helper";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const FAStep06LT2 = ({ currentStep, progressStatus, isActive, goToStep }) => {
  const [upload, setUpload] = useState(false);
  const [media, setMedia] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BusinessContext = useBusinessContext();
  const base_url = config.api_url;
  const MAX_FILES = 10;

  const handleFileUpload = (uploadedFileData, stateType) => {
    const { state } = stateType;
    if (state == "removed") {
      setMedia([...uploadedFileData]);
      setData([...uploadedFileData]);
      BusinessContext.update({
        ...BusinessContext.data,
        workspace_media: [...data, ...uploadedFileData],
      });
    } else {
      setMedia((prevData) => [...prevData, ...uploadedFileData]);
      setData((prevData) => [...prevData, ...uploadedFileData]);
      BusinessContext.update({
        ...BusinessContext.data,
        workspace_media: [...media, ...uploadedFileData],
      });
    }
  };

  const validateBeforeUpload = () => {
    const currentFileCount = media.length;

    if (currentFileCount >= MAX_FILES) {
      toast(
        <ToastMsg
          message={`Maximum ${MAX_FILES} files allowed. Please remove some files before uploading new ones.`}
          danger={true}
        />,
        config.error_toast_config
      );
      return false;
    }
    return true;
  };

  const checkFileSelectionLimit = (fileList) => {
    const currentFileCount = media.length;
    const selectedFileCount = fileList.length;
    const totalAfterUpload = currentFileCount + selectedFileCount;

    if (totalAfterUpload > MAX_FILES) {
      const allowedCount = MAX_FILES - currentFileCount;
      toast(
        <ToastMsg
          message={`You can only upload ${allowedCount} more file(s). Maximum ${MAX_FILES} files allowed.`}
          danger={true}
        />,
        config.error_toast_config
      );
      return false;
    }
    return true;
  };

  const redirectToPrevStep = async () => {
    const questionsData = await http.get(
      `${config.api_url}/business/business-questions`
    );
    const business_types = BusinessContext.data.business_types.map(
      (it) => it._id
    );
    let stepNumber = helper.redirectBusinessUserBack(
      questionsData?.data,
      business_types,
      currentStep
    );
    goToStep(stepNumber);
  };

  const handleSubmit = async () => {
    const questionsData = await http.get(
      `${config.api_url}/business/business-questions`
    );
    const business_types = BusinessContext.data.business_types.map(
      (it) => it._id
    );
    let stepNumber = helper.redirectBusinessUser(
      questionsData?.data,
      business_types,
      currentStep
    );
    let nextStepToGo = currentStep + 1;
    let saveStatus = Math.max(stepNumber, nextStepToGo);

    if (BusinessContext?.data?.status > currentStep) {
      saveStatus = BusinessContext.data.status;
    }

    await http.post(
      config.api_url +
        `/business/business-details/${BusinessContext?.data?._id}`,
      { status: saveStatus }
    );
    BusinessContext.update({
      ...BusinessContext.data,
      workspace_media: [...media],
      status: saveStatus,
    });

    goToStep(stepNumber);
    window.scrollTo(0, 0);
    setError("");
  };

  const fetchData = async () => {
    const { data } = await http.get(
      `${base_url}/business/business-details/${BusinessContext?.data?._id}`
    );
    if (data?.workspace_media) {
      setMedia(data.workspace_media);
    } else {
      setMedia([]);
    }
  };
  useEffect(() => {
    setUpload(BusinessContext?.data);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((8 / 19) * 100);
    }
  }, [isActive]);

  useEffect(() => {
    fetchData();
  }, []);

  const remainingSlots = MAX_FILES - media.length;
  const canUpload = remainingSlots > 0;

  return (
    <>
      <LightThemeBackground />
      <div className={style.text_container}>
        <p className={style.page_title}>Add Business Details</p>
        <p
          className={`${style.description} ${style.select_notice} mb-2`}
          style={{ fontSize: "1em" }}
        >
          (Optional)
        </p>
        <h1 className={style.title}>
          Upload photos of your workplace (studio, showroom, factory etc.)
        </h1>
        <h2 className={`${style.description} ${style.desc_renovation}`}>
          A visual idea, validates your brand to prospective customers. These
          need not be professional shots.
        </h2>
        <p
          className={`${style.description} ${style.select_notice}`}
          style={{
            marginBottom: "3em",
          }}
        >
          <span>Upload up to 10</span>
        </p>
        {/* {!canUpload && (
          <p
            className={`${style.description}`}
            style={{ color: "#d32f2f", fontWeight: "500" }}
          >
            Maximum files limit reached. Remove some files to upload new ones.
          </p>
        )} */}
      </div>
      <div className={`${style.steps} ${style.fastep12}`}>
        {/* <div className={style.fileupload_wrapper}>
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
        </div> */}
        <div className={style.customdUpload_wrapper}>
          <BusinessFileUpload
            businessContext={upload}
            onFileUpload={handleFileUpload}
            documentMediaType={"workspace_media"}
            validateBeforeUpload={validateBeforeUpload}
            checkFileSelectionLimit={checkFileSelectionLimit}
            maxFiles={MAX_FILES}
            currentFileCount={media.length}
          />
          <p className={style.error}>{error}</p>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div className={style.next_button} onClick={handleSubmit}>
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
              redirectToPrevStep();
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

export default FAStep06LT2;
