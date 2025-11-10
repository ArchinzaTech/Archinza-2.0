import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import {
  formupload,
  infoIcon,
  infoIconDark,
  rightarrowwhite,
} from "../../../images";
import BusinessFileUpload from "../../../components/BusinessFileUpload/BusinessFileUpload";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import http from "../../../helpers/http";
import config from "../../../config/config";
import { useNavigate } from "react-router-dom";
import helper from "../../../helpers/helper";
import targetAttributesFile from "../../../config/target_attributes.json";
import ConfirmationPopup from "../Confirmation/ConfirmationPopup";
import FormFiveModal from "../../../components/FormFiveModal/FormFiveModal";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const FAStep06LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [upload, setUpload] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [media, setMedia] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BusinessContext = useBusinessContext();
  const base_url = config.api_url;

  const handleFileUpload = (uploadedFileData, stateType) => {
    const { state } = stateType;
    if (state == "removed") {
      setMedia([...uploadedFileData]);
      setData([...uploadedFileData]);
      BusinessContext.update({
        ...BusinessContext.data,
        bot_media: [...data, ...uploadedFileData],
      });
    } else {
      setMedia((prevData) => [...prevData, ...uploadedFileData]);
      setData((prevData) => [...prevData, ...uploadedFileData]);
      BusinessContext.update({
        ...BusinessContext.data,
        bot_media: [...media, ...uploadedFileData],
      });
    }
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
    const stepNumber = helper.redirectBusinessUser(
      questionsData?.data,
      business_types,
      currentStep
    );
    const nextStepToGo = currentStep + 1;
    let saveStatus = Math.max(stepNumber, nextStepToGo);

    if (BusinessContext?.data?.status > currentStep) {
      saveStatus = BusinessContext.data.status;
    }

    await http.post(
      `${config.api_url}/business/business-details/${BusinessContext?.data?._id}`,
      {
        status: saveStatus,
      }
    );
    BusinessContext.update({
      ...BusinessContext.data,
      bot_media: [...media],
      status: saveStatus,
    });
    goToStep(stepNumber);
    window.scrollTo(0, 0);
    setError("");

    // const shaharApiData = new FormData();

    // const fieldsToAppend = [
    //   { key: "webpage_url", value: BusinessContext.data.website_link },
    //   { key: "linkedin_url", value: BusinessContext.data.linkedin_link },
    //   { key: "instagram_url", value: BusinessContext.data.instagram_handle },
    //   { key: "images_bucket", value: config.gcp_bucket },
    //   { key: "images_folder", value: "business" },
    //   { key: "images_prefix", value: BusinessContext.data.username },
    //   { key: "user_id", value: BusinessContext.data._id },
    //   { key: "images_min_size_b", value: 1024 },
    //   {
    //     key: "scrapingdog_instagram_en",
    //     value: !!BusinessContext.data.instagram_handle,
    //   },
    //   {
    //     key: "scrapingdog_linkedin_en",
    //     value: !!BusinessContext.data.linkedin_link,
    //   },
    //   {
    //     key: "attributes_file",
    //     value: new Blob([JSON.stringify(targetAttributesFile)], {
    //       type: "application/json",
    //     }),
    //   },
    // ];

    // fieldsToAppend.forEach(({ key, value }) =>
    //   shaharApiData.append(key, value)
    // );

    // const appendMediaFiles = async (mediaArray, formDataKey) => {
    //   if (mediaArray && mediaArray.length > 0) {
    //     for (const mediaItem of mediaArray) {
    //       const file = await fetchFileFromUrl(mediaItem.url);
    //       shaharApiData.append(formDataKey, file);
    //     }
    //   }
    // };
    // for (const [key, value] of fieldsToAppend.entries()) {
    //   console.log(key, value);
    // }

    // await Promise.all([
    //   appendMediaFiles(BusinessContext.data.company_profile_media, "files"),
    //   appendMediaFiles(media, "files"),
    // ]);

    // await Promise.all([
    //   http.post(
    //     `${config.api_url}/business/business-details/${BusinessContext?.data?._id}`,
    //     {
    //       status: saveStatus,
    //     }
    //   ),
    //   http.post(`${config.scrap_content_api}scrap_content/`, shaharApiData),
    // ]);
  };

  const fetchData = async () => {
    const { data } = await http.get(
      `${base_url}/business/business-details/${BusinessContext?.data?._id}`
    );
    if (data?.bot_media) {
      setMedia(data.bot_media);
    } else {
      setMedia([]);
    }
  };

  useEffect(() => {
    setUpload(BusinessContext?.data);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((5 / 18) * 100);
    }
  }, [isActive]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <LightThemeBackground />
      <div className={style.text_container}>
        <p className={style.page_title}>Add Business Documents</p>
        <p
          className={`${style.description} ${style.select_notice} mb-2`}
          style={{ fontSize: "1em" }}
        >
          (Optional)
        </p>
        <h1 className={style.title}>
          Would you like to upload any additional documents?
          {/* <div>
            {" "}
            (Business FAQs, training documents for sales/marketing teams etc.){" "}
          </div> */}
        </h1>
        <h2 className={`${style.description} ${style.desc_renovation}`}>
          Uploading documents like Business FAQs, sales decks, or training
          materials helps us train your business BOT to accurately answer
          customer queries using your own content.
        </h2>
        <p
          className={`${style.description} ${style.select_notice} align-items-start`}
          style={{
            marginBottom: "3em",
          }}
        >
          The more context you provide, the better your personalised bot will
          answer real-world clients.
          {/* <span className={style.entity} > */}
          {/* &#9432; */}
          <img
            src={infoIconDark}
            alt="info"
            className="Info_icon_dark"
            style={{
              width: "1em",
              marginLeft: "0.4em",
              position: "relative",
              top: "0.3em",
              cursor: "pointer",
            }}
            onClick={() => setModalShow(true)}
          />
          {/* </span> */}
        </p>
      </div>
      <div className={`${style.steps} ${style.fastep12}`}>
        <div className={style.customdUpload_wrapper}>
          <BusinessFileUpload
            businessContext={upload}
            onFileUpload={handleFileUpload}
            documentMediaType={"bot_media"}
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
      <FormFiveModal
        className="white_theme"
        show={modalShow}
        onHide={() => setModalShow(false)}
        dataText={
          "Uploading documents like Business FAQs, sales decks, or training materials helps us train your business bot to accurately answer customer queries using your own content. The more context you provide, the better the bot will perform in real-world scenarios."
        }
        infoIconLightTheme={infoIconDark}
      />
    </>
  );
};

export default FAStep06LT;
