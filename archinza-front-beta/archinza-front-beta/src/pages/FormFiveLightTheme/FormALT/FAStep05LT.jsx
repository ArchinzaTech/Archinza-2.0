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
import { use } from "react";
import { useWindowSize } from "react-use";
import StepFormConfrimationPopup from "../../BusinessProfile/BusinessProfileComponents/PopUpComponents/StepFormConfrimationPopup/StepFormConfrimationPopup";
import targetAttributesFile from "../../../config/target_attributes.json";
import {
  chooseYourPlan,
  pricingPlansURL,
} from "../../../components/helpers/constant-words";

const FAStep05LT = ({ currentStep, progressStatus, isActive, goToStep }) => {
  const [upload, setUpload] = useState(false);
  const [companyProfileMedia, setCompanyProfileMedia] = useState([]);
  const [productCataloguesMedia, setProductCataloguesMedia] = useState([]);
  const [companyProfileData, setCompanyProfileData] = useState([]);
  const [productCataloguesData, setProductCataloguesData] = useState([]);
  const [companyProfileError, setCompanyProfileError] = useState("");
  const [productCataloguesError, setProductCataloguesError] = useState("");
  const navigate = useNavigate();
  const BusinessContext = useBusinessContext();
  const [initialMediaPresent, setInitialMediaPresent] = useState(false);
  const [hasNewUploads, setHasNewUploads] = useState(false);
  const base_url = config.api_url;
  const [maxTotalFiles, setMaxTotalFiles] = useState(5);
  const { width } = useWindowSize();

  const [showStepFormConfrimationPopup, setStepFormConfrimationPopup] =
    useState(false);
  const handleStepFormConfrimationPopupOpen = () =>
    setStepFormConfrimationPopup(true);
  const handleStepFormConfrimationPopupClose = () =>
    setStepFormConfrimationPopup(false);

  const getTotalDocumentsCount = () => {
    return companyProfileMedia.length + productCataloguesMedia.length;
  };

  const validateBeforeUpload = (documentMediaType) => {
    const totalFileCount = getTotalDocumentsCount();
    if (totalFileCount >= maxTotalFiles) {
      toast(
        <ToastMsg
          message={`Maximum ${maxTotalFiles} documents allowed in total across all sections. Please remove some files before uploading new ones.`}
          danger={true}
        />,
        config.error_toast_config
      );
      return false;
    }
    return true;
  };

  const checkFileSelectionLimit = (fileList, documentMediaType) => {
    const totalFileCount = getTotalDocumentsCount();
    const selectedFileCount = fileList.length;
    const totalAfterUpload = totalFileCount + selectedFileCount;

    if (totalAfterUpload > maxTotalFiles) {
      const allowedCount = maxTotalFiles - totalFileCount;
      toast(
        <ToastMsg
          message={`You can only upload ${allowedCount} more file(s). Maximum ${maxTotalFiles} documents allowed in total across all sections.`}
          danger={true}
        />,
        config.error_toast_config
      );
      return false;
    }
    return true;
  };

  const isUploadDisabledForSection = (sectionType) => {
    const totalCount = getTotalDocumentsCount();
    return totalCount >= maxTotalFiles;
  };

  const handleFileUpload = (uploadedFileData, stateType) => {
    const { state, isCurrentUpload } = stateType;
    const isCompanyProfile =
      stateType.documentMediaType === "company_profile_media";

    if (isCompanyProfile) {
      if (state === "removed") {
        setCompanyProfileMedia([...uploadedFileData]);
        setCompanyProfileData([...uploadedFileData]);
        console.log(uploadedFileData);
        BusinessContext.update({
          ...BusinessContext.data,
          company_profile_media: [...uploadedFileData],
        });
        if (uploadedFileData.length === 0 && companyProfileMedia.length === 0) {
          setInitialMediaPresent(false);
        }
      } else {
        setCompanyProfileMedia((prevData) => {
          const newData = [...prevData, ...uploadedFileData];
          console.log(newData);
          // Update BusinessContext with the new data
          BusinessContext.update({
            ...BusinessContext.data,
            company_profile_media: newData,
          });
          return newData;
        });
        setCompanyProfileData((prevData) => [...prevData, ...uploadedFileData]);
        if (state !== "removed") setHasNewUploads(true);
      }
    } else if (stateType.documentMediaType === "product_catalogues_media") {
      if (state === "removed") {
        setProductCataloguesMedia([...uploadedFileData]);
        setProductCataloguesData([...uploadedFileData]);
        BusinessContext.update({
          ...BusinessContext.data,
          product_catalogues_media: [...uploadedFileData],
        });
        if (
          uploadedFileData.length === 0 &&
          productCataloguesMedia.length === 0
        ) {
          setInitialMediaPresent(false);
        }
      } else {
        setProductCataloguesMedia((prevData) => {
          const newData = [...prevData, ...uploadedFileData];
          BusinessContext.update({
            ...BusinessContext.data,
            product_catalogues_media: newData,
          });
          return newData;
        });
        setProductCataloguesData((prevData) => [
          ...prevData,
          ...uploadedFileData,
        ]);
        if (state !== "removed") setHasNewUploads(true);
      }
    } else {
      if (state === "removed") {
        BusinessContext.update({
          ...BusinessContext.data,
          [stateType.documentMediaType]: [...uploadedFileData],
        });
      } else {
        BusinessContext.update({
          ...BusinessContext.data,
          [stateType.documentMediaType]: [
            ...(BusinessContext.data[stateType.documentMediaType] || []),
            ...uploadedFileData,
          ],
        });
        if (state !== "removed") setHasNewUploads(true);
      }
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
    const hasMedia =
      companyProfileMedia.length > 0 || productCataloguesMedia.length > 0;
    const media_consent_approval = hasMedia;

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
      { status: saveStatus, media_consent_approval }
    );
    BusinessContext.update({
      ...BusinessContext.data,
      company_profile_media: [...companyProfileMedia],
      product_catalogues_media: [...productCataloguesMedia],
      status: saveStatus,
      media_consent_approval,
    });

    goToStep(stepNumber);
    window.scrollTo(0, 0);
    setCompanyProfileError("");
    setProductCataloguesError("");

    //hit scrap content API without image scrapping
    const company_profile_media_urls =
      BusinessContext?.data?.company_profile_media?.map((item) => item.url);
    const product_catalogues_media_urls =
      BusinessContext?.data?.product_catalogues_media?.map((item) => item.url);
    const fileS3Urls = [
      ...(company_profile_media_urls || []),
      ...(product_catalogues_media_urls || []),
    ];

    const scrapeContent = async (
      images_scraping_en,
      linkedin_url,
      instagram_url
    ) => {
      const scrapeContentApiData = new FormData();

      const basePayload = [
        {
          key: "webpage_url",
          value: BusinessContext?.data?.website_link,
        },
        { key: "images_bucket", value: config.aws_bucket },
        { key: "images_folder", value: "business" },
        {
          key: "images_prefix",
          value: BusinessContext?.data?.username,
        },
        {
          key: "images_max_png_size_b",
          value: 1048576,
        },
        {
          key: "images_compression",
          value: 0,
        },
        {
          key: "remove_duplicates_thr",
          value: 90,
        },
        { key: "user_id", value: BusinessContext?.data?._id },
        { key: "images_min_size_b", value: 10240 },
        {
          key: "instagram_engine",
          value: "BrightData",
        },
        {
          key: "linkedin_engine",
          value: "BrightData",
        },
        {
          key: "filtering_posts_num",
          value: 300,
        },
        {
          key: "filtering_start_date",
          value: "",
        },
        {
          key: "filtering_end_date",
          value: "",
        },
        {
          key: "max_upload_size_mb",
          value: 80,
        },
        {
          key: "attributes_file",
          value: new Blob([JSON.stringify(targetAttributesFile)], {
            type: "application/json",
          }),
        },
        {
          key: "images_scraping_en",
          value: images_scraping_en,
        },
        {
          key: "linkedin_url",
          value: linkedin_url,
        },
        {
          key: "instagram_url",
          value: instagram_url,
        },
      ];

      basePayload.forEach(({ key, value }) =>
        scrapeContentApiData.append(key, value)
      );
      scrapeContentApiData.append("files_s3[]", JSON.stringify(fileS3Urls));

      await http.post(
        `${base_url}/business/scrape_content`,
        scrapeContentApiData
      );
    };

    // Call for the first time
    await scrapeContent(false, "", "");

    // Call for the second time
    // await scrapeContent(
    //   true,
    //   BusinessContext?.data?.linkedin_link || "",
    //   BusinessContext?.data?.instagram_handle || ""
    // );
  };

  const fetchData = async () => {
    const { data } = await http.get(
      `${base_url}/business/business-details/${BusinessContext?.data?._id}`
    );
    if (data?.company_profile_media) {
      setCompanyProfileMedia(data.company_profile_media);
    } else {
      setCompanyProfileMedia([]);
    }
    if (data?.product_catalogues_media) {
      setProductCataloguesMedia(data.product_catalogues_media);
    } else {
      setProductCataloguesMedia([]);
    }
  };

  useEffect(() => {
    setUpload(BusinessContext?.data);
  }, [currentStep, BusinessContext?.data]);

  useEffect(() => {
    if (isActive) {
      progressStatus((4 / 18) * 100);
    }
  }, [isActive]);

  useEffect(() => {
    if (BusinessContext?.data?.subscription?.plan?.features?.fileUploadLimit) {
      setMaxTotalFiles(
        BusinessContext.data.subscription.plan.features.fileUploadLimit
      );
    }
  }, [BusinessContext.data]);

  const remainingSlots = maxTotalFiles - getTotalDocumentsCount();
  const canUpload = remainingSlots > 0;

  const handleConfirmationSubmit = async () => {
    try {
      const mockEvent = { preventDefault: () => {} };
      await handleSubmit(mockEvent);
      handleStepFormConfrimationPopupClose();
    } catch (error) {
      console.error("Error in handleConfirmationSubmit:", error);
    }
  };

  const handleNextClick = () => {
    if (
      companyProfileMedia.length > 0 ||
      productCataloguesMedia.length > 0
    ) {
      handleStepFormConfrimationPopupOpen();
    } else {
      handleSubmit();
    }
  };

  useEffect(() => {
    const checkInitialMedia = () => {
      const { company_profile_media, product_catalogues_media } =
        BusinessContext?.data || {};
      if (
        (Array.isArray(company_profile_media) &&
          company_profile_media.length > 0) ||
        (Array.isArray(product_catalogues_media) &&
          product_catalogues_media.length > 0)
      ) {
        setInitialMediaPresent(true);
      }
    };

    fetchData();
    checkInitialMedia();
  }, []);

  return (
    <>
      <StepFormConfrimationPopup
        show={showStepFormConfrimationPopup}
        handleClose={handleStepFormConfrimationPopupClose}
        data={"Review your documents before submitting."}
        dataNextStep={` Your added PDFs help build your business's long-term
            intelligence within Archinza.
              <b style="color:#111"> Please note that replacing
            them later may incur a fee.`}
        label={"I confirm that all my data is accurate."}
        nextStep={handleConfirmationSubmit}
      />
      <LightThemeBackground />
      {/* <div className={style.text_container}>
        <p className={style.page_title}>Add Business Documents</p>
        <h1 className={style.title}>Upload your firm/company profile*</h1>
        <h2 className={`${style.description} ${style.desc_renovation}`}>
          Add atleast one of the following so that we can know your business and
          refer better
        </h2>
        <p className={style.error}>{companyProfileError}</p>
      </div>
      <div className={`${style.steps} ${style.fastep12}`}>
        <div className={style.customdUpload_wrapper}>
          <BusinessFileUpload
            businessContext={upload}
            onFileUpload={handleFileUpload}
            documentMediaType={"company_profile_media"}
            validateBeforeUpload={validateMaxDocuments}
          />
        </div>

        <div className={style.text_container} style={{ marginTop: "2rem" }}>
          <h1 className={style.title}>Product catalogues (if applicable)</h1>
          <h2 className={`${style.description} ${style.desc_renovation}`}>
            Add product catalogues to showcase your offerings
          </h2>
          <p className={style.error}>{productCataloguesError}</p>
        </div>
        <div className={style.customdUpload_wrapper}>
          <BusinessFileUpload
            businessContext={upload}
            onFileUpload={handleFileUpload}
            documentMediaType={"product_catalogues_media"}
            validateBeforeUpload={validateMaxDocuments}
          />
        </div>
      </div> */}

      <div className={style.text_container}>
        <p className={style.page_title}>Add Business Documents</p>
        <h1 className={style.title}>
          Power your visual identity with Archinza AI<sup>TM</sup>
        </h1>
        <h2 className={`${style.description} ${style.desc_renovation}`}>
          Upload pdfs to generate an intelligent view of your business visually.
        </h2>{" "}
        <p
          className={`${style.description} ${style.select_notice} d-block`}
          style={{
            marginBottom: width > 768 && "3em",
          }}
        >
          Upload min 1 & max 5 PDFs to build your <b>FREE</b> profile. You can
          add more from your Dashboard by choosing an upgrade.{" "}
          <b
            onClick={() => {
              const url = `${chooseYourPlan}?source=onboarding`;
              window.open(pricingPlansURL, "_blank");
            }}
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            }}
          >
            Pricing Plans
          </b>
        </p>
        <p className={style.error} id="profile_err">
          {companyProfileError}
        </p>
      </div>
      <div className={`${style.steps} ${style.fastep12} row`}>
        <div className={` ${style.input_filed_container_col_left}`}>
          <div className={style.text_container} style={{ marginTop: "2rem" }}>
            <h1 className={style.title}>Upload your firm/company profile</h1>
            {/* <h2 className={`${style.description} ${style.desc_renovation}`}>
              Add product catalogues to showcase your offerings
            </h2> */}
            <p className={style.error}>{productCataloguesError}</p>
          </div>
          <div className={style.customdUpload_wrapper}>
            <BusinessFileUpload
              businessContext={upload}
              onFileUpload={handleFileUpload}
              documentMediaType={"company_profile_media"}
              validateBeforeUpload={validateBeforeUpload}
              checkFileSelectionLimit={checkFileSelectionLimit}
              currentFileCount={getTotalDocumentsCount()}
              freeMaxFileSize={
                BusinessContext?.data?.subscription?.plan?.features
                  ?.fileSizeLimitMB || 100
              }
              freeMaxFilePages={
                BusinessContext?.data?.subscription?.plan?.features
                  ?.filePageLimit || 100
              }
              disabled={isUploadDisabledForSection("company_profile")}
            />
          </div>
        </div>
        <div className={` ${style.input_filed_container_col_right}`}>
          <div className={style.text_container} style={{ marginTop: "2rem" }}>
            <h1 className={style.title}>Product catalogues (if applicable)</h1>
            {/* <h2 className={`${style.description} ${style.desc_renovation}`}>
              Add product catalogues to showcase your offerings
            </h2> */}
            <p className={style.error}>{productCataloguesError}</p>
          </div>
          <div className={style.customdUpload_wrapper}>
            <BusinessFileUpload
              businessContext={upload}
              onFileUpload={handleFileUpload}
              documentMediaType={"product_catalogues_media"}
              validateBeforeUpload={validateBeforeUpload}
              checkFileSelectionLimit={checkFileSelectionLimit}
              currentFileCount={getTotalDocumentsCount()}
              freeMaxFileSize={
                BusinessContext?.data?.subscription?.plan?.features
                  ?.fileSizeLimitMB || 100
              }
              freeMaxFilePages={
                BusinessContext?.data?.subscription?.plan?.features
                  ?.filePageLimit || 100
              }
              disabled={isUploadDisabledForSection("product_catalogues")}
            />
          </div>
        </div>
        <div className={`border-0 ${style.input_filed_container_col_right}`}>
          <div className={style.text_container} style={{ marginTop: "2rem" }}>
            <h1 className={style.title}>
              Would you like to upload any additional documents?
            </h1>
            <h2 className={`${style.description} ${style.desc_renovation}`}>
              Business FAQs, sales decks, or training materials to train your
              business BOT to answer better.
            </h2>
            {/* <p
              className={`${style.description} ${style.select_notice} d-block`}
              style={{
                marginBottom: width > 768 && "3em",
              }}
            >
              The more context you provide, the better your personalised bot
              will answer real-world clients.
            </p> */}
            <p className={style.error}>{productCataloguesError}</p>
          </div>
          <div className={style.customdUpload_wrapper}>
            <BusinessFileUpload
              businessContext={upload}
              onFileUpload={handleFileUpload}
              documentMediaType={"bot_media"}
              validateBeforeUpload={validateBeforeUpload}
              checkFileSelectionLimit={checkFileSelectionLimit}
              currentFileCount={getTotalDocumentsCount()}
              freeMaxFileSize={
                BusinessContext?.data?.subscription?.plan?.features
                  ?.fileSizeLimitMB || 100
              }
              freeMaxFilePages={
                BusinessContext?.data?.subscription?.plan?.features
                  ?.filePageLimit || 100
              }
              disabled={isUploadDisabledForSection("bot_media")}
            />
          </div>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div className={style.next_button} onClick={handleNextClick}>
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

export default FAStep05LT;
