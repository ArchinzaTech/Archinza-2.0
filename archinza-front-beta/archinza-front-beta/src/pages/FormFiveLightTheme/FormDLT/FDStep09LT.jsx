import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { formupload, rightarrowwhite, rightarrowblack } from "../../../images";
import BusinessFileUpload from "../../../components/BusinessFileUpload/BusinessFileUpload";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import http from "../../../helpers/http";
import config from "../../../config/config";
import { useNavigate } from "react-router-dom";
import { congratulationsLightURL } from "../../../components/helpers/constant-words";

const FDStep09LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  const [upload, setUpload] = useState(false);
  const [media, setMedia] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BusinessContext = useBusinessContext();

  const handleFileUpload = (uploadedFileData, stateType) => {
    const { state } = stateType;

    if (state == "removed") {
      setMedia([...uploadedFileData]);
      setData([...uploadedFileData]);
      BusinessContext.update({
        ...BusinessContext.data,
        d_documents_media: [...data, ...uploadedFileData],
      });
    } else {
      setMedia((prevData) => [...prevData, ...uploadedFileData]);
      setData((prevData) => [...prevData, ...uploadedFileData]);
      BusinessContext.update({
        ...BusinessContext.data,
        d_documents_media: [...media, ...uploadedFileData],
      });
    }
  };

  const handleSubmit = async () => {
    let status = "completed";

    if (data.length == 0 && media.length == 0) {
      setError("Upload atleast one document");
      return;
    }

    await http.post(
      config.api_url +
        `/business/business-details/${BusinessContext?.data?._id}`,
      { status: status }
    );
    BusinessContext.update({
      ...BusinessContext.data,
      d_documents_media: [...media, ...data],
      status: status,
    });
    navigate(congratulationsLightURL);
    window.scrollTo(0, 0);
    setError("");
  };

  useEffect(() => {
    setUpload(BusinessContext?.data);
    setMedia(BusinessContext?.data?.d_documents_media);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((11 / 11) * 100);
    }
  }, [isActive]);
  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Upload Company Profile</h1>
        <p className={style.description}></p>
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
            documentMediaType={"d_documents_media"}
          />
          <p className={style.error}>{error}</p>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div className={style.next_button} onClick={handleSubmit}>
            <div className={style.text}>Next</div>
            <img
              src={rightarrowblack}
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

export default FDStep09LT;
