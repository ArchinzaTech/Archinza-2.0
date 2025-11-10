import React, { useEffect, useRef, useState } from "react";
import "../BEdit.scss";
import "./businessConnectEditPage.scss";
import * as images from "../../../../images";
import { Link } from "react-router-dom";
import { Rating, Switch } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Progress, Button, Popover } from "antd";
import {
  WhatsAppOutlined,
  LinkedinOutlined,
  LinkOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import FooterV2 from "../../../../components/FooterV2/FooterV2";
import { useBusinessContext } from "../../../../context/BusinessAccount/BusinessAccountState";
import { useGlobalDataContext } from "../../../../context/GlobalData/GlobalDataState";
import OverView2 from "../../BEditComponent/OverView/Overview2";
import TestPopup from "../BusinessViewPopups/TestPopup";
import {
  businessConnectEditUrl,
  businessProfileViewURL2,
} from "../../../../components/helpers/constant-words";
import http from "../../../../helpers/http";
import config from "../../../../config/config";
import ExcelPopup from "../PopUpComponents/ExcelPopup/ExcelPopup";
import ProfileComplitionBar from "../../ProfileComplitionBar/ProfileComplitionBar";
import ToggleSwitch from "../../BEditComponent/ToggleSwitch/ToggleSwitch";
import ToastMsg from "../../../../components/ToastMsg/ToastMsg";
import GeneralInformation from "../PopUpComponents/GeneralInformation/GeneralInformation";
import FileUpload from "../../BusinessProfileComponents/PopUpComponents/FileUpload/FileUpload";
import GalleryPopupConnect from "../BusinessViewPopups/GalleryPopupConnect/GalleryPopupConnect";
import EditSocialLinkPopup from "../PopUpComponents/EditSocialLinkPopup/EditSocialLinkPopup";
import NonMandatoryActionsV2 from "../PopUpComponents/NonMandatoryActionsV2/NonMandatoryActionsV2";
import PromotePopup from "../PopUpComponents/PromotePopup/PromotePopup";
import helper from "../../../../helpers/helper";
import WorkPlaceDefaultPopup from "../PopUpComponents/WorkplaceEditPopups/WorkPlaceDefaultPopup";
import AddLocationPopup from "../PopUpComponents/AddLocationPopup/AddLocationPopup";
import BusinessHoursPopup from "../PopUpComponents/BusinessHoursPopup/BusinessHoursPopup";
import { useWindowSize } from "react-use";
import EditFirmNamePopup from "../PopUpComponents/EditFirmNamePopup/EditFirmNamePopup";
import CompleteActions from "../PopUpComponents/CompleteActions/CompleteActions";
import SocialMediaLinksPopup from "../PopUpComponents/SocialMediaLinksPopup/SocialMediaLinksPopup";
import { infoIconEditProfile } from "../../../../images";
import FormFiveModal from "../../../../components/FormFiveModal/FormFiveModal";
import { orangeRightTick } from "../../../../images";
import OwnerDetailsPopup from "../PopUpComponents/OwnerDetailsPopup/OwnerDetailsPopup";
import EnquiryPrefrencePopup from "../PopUpComponents/EnquiryPreferencePopup/EnquiryPrefrencePopup";

const locationDropdown = [
  "Gandhidham, Gujarat, India",
  "Gandhidham, Maharashtra, India",
  "Gandhidham, Gujarat, India",
];

const datainfoBedit = (
  <li className="list_item">
    These links form a permanent part of your business intelligence used for AI
    matchmaking. To replace or delete them, please contact us at{" "}
    <a href="mailto:reach@archinza.com" className="text-decoration-underline">
      reach@archinza.com
    </a>
  </li>
);

const BusinessConnectEdit = (props) => {
  const { width } = useWindowSize();
  const [showEditFirmNamePopup, setShowEditFirmNamePopup] = useState(false);
  const [isActive, setIsActive] = useState(0);
  const [isCompleteActionsModal, setIsCompleteActionsModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef(null);
  const [isSubtabActive, setIsSubtabActive] = useState(0);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showExcelPopup, setShowExcelPopup] = useState(false);
  const [showGeneralInfoPopup, setShowGeneralInfoPopup] = useState(false);
  const [showFileUploadPopup, setShowFileUploadPopup] = useState(false);
  const [showEnhancePopup, setShowEnhancePopup] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [showEnhanceButton, setShowEnhanceButton] = useState(false);
  const [isGalleryPopupConnect, setIsGalleryPopupConnect] = useState(false);
  const [isEditSocialLinkPopup, setIsEditSocialLinkPopup] = useState(false);
  const [isBusinessHoursPopup, setIsBusinessHoursPopup] = useState(false);
  const [isAddLocationPopup, setIsAddLocationPopup] = useState(false);
  const [isNonMandatoryActionsModal, setIsNonMandatoryActionsModal] =
    useState(false);
  const [verificationStatus, setVerificationStatus] =
    useState("Get Verified Now!");
  const [modalShow, setModalShow] = useState(false);
  const [isOwnerDetailsPopup, setIsOwnerDetailsPopup] = useState(false);
  const [isEnquiryPrefrencePopup, setIsEnquiryPrefrencePopup] = useState(false);
  const { data, editMode, toggleEditMode, updateSection, fetchData, update } =
    useBusinessContext();
  const GlobalContextData = useGlobalDataContext();
  const [isPromotePopupModal, setIsPromotePopupModal] = useState(false);
  const [isOnline, setIsOnline] = useState(data?.pageStatus === "online");
  const aws_object_url = config.aws_object_url;
  const fieldsToCheck = [
    // "city",
    // "country",
    // "pincode",
    // "addresses",
    "bio",
    "google_location",
    // "keywords",
    "project_renders_media",
    "completed_products_media",
    "sites_inprogress_media",
  ];
  const nonMandatoryQuestions = [
    "services",
    "project_scope",
    // "workspace_media",
    // "establishment_year",
    "team_range",
    "project_location",
    "project_typology",
    "design_style",
    "project_sizes",
    "avg_project_budget",
    "project_mimimal_fee",
  ];

  const showContactInfo =
    props.isEditable ||
    (data?.google_location?.latitude &&
      data?.google_location?.longitude &&
      data?.google_location?.latitude !== "NA" &&
      data?.google_location?.longitude !== "NA") ||
    data?.workspace_media?.length > 0;

  const calculateProfileCompletion = () => {
    const basePercentage = 75;
    const totalFields = fieldsToCheck.length;
    const maxAdditionalPercentage = 25;
    const percentagePerField = maxAdditionalPercentage / totalFields;
    const { nonEmptyCount, emptyFields } = fieldsToCheck.reduce(
      (acc, field) => {
        const value = data[field];

        if (field === "google_location") {
          // Check if google_location has both latitude and longitude as non-empty strings
          if (
            value &&
            typeof value === "object" &&
            value?.latitude &&
            value?.longitude
          ) {
            acc.nonEmptyCount += 1;
          } else {
            acc.emptyFields.push(field);
          }
        } else if (value) {
          if (Array.isArray(value) && value.length > 0) acc.nonEmptyCount += 1;
          else if (typeof value === "string" && value.trim() !== "")
            acc.nonEmptyCount += 1;
          else if (typeof value === "object" && Object.keys(value).length > 0)
            acc.nonEmptyCount += 1;
          else acc.emptyFields.push(field);
        } else {
          acc.emptyFields.push(field);
        }
        return acc;
      },
      { nonEmptyCount: 0, emptyFields: [] }
    );

    const percentage = basePercentage + nonEmptyCount * percentagePerField;

    const pendingNonMandatory = nonMandatoryQuestions.filter((field) => {
      const value = data[field];

      if (!value) return true;

      switch (field) {
        case "project_location":
        case "team_range":
          return !value.data || value.data.trim() === "";
        case "project_scope":
        case "project_typology":
        case "design_style":
          return (
            !value.data || !Array.isArray(value.data) || value.data.length === 0
          );
        case "avg_project_budget":
          return (
            !value.budgets ||
            !Array.isArray(value.budgets) ||
            value.budgets.length === 0
          );
        case "project_sizes":
          return (
            !value.sizes ||
            !Array.isArray(value.sizes) ||
            value.sizes.length === 0
          );
        case "project_mimimal_fee":
          return !value.fee || value.fee.trim() === "";
        case "services":
          return !value || (Array.isArray(value) && value.length === 0);
        default:
          return true;
      }
    });

    return { percentage, emptyFields, pendingNonMandatory };
  };

  const containerRef = useRef(null);

  const { percentage, emptyFields, pendingNonMandatory } =
    calculateProfileCompletion();
  const handleShowCompleteActions = () => setIsCompleteActionsModal(true);
  const handleShowNonMandatoryActions = () =>
    setIsNonMandatoryActionsModal(true);
  const handleHideCompleteActions = () => setIsCompleteActionsModal(false);
  const handlePopupOpen = () => setShowPopup(true);
  const handlePopupClose = () => setShowPopup(false);
  const handleEnhancePopupOpen = () => setShowEnhancePopup(true);
  const handleEnhancePopupClose = () => setShowEnhancePopup(false);
  const handleOptionsPopupOpen = () => setShowOptionsPopup(true);
  const handleEditFirmNamePopupOpen = () => setShowEditFirmNamePopup(true);
  const handleEditFirmNamePopupClose = () => setShowEditFirmNamePopup(false);
  const handleExcelPopupOpen = () => setShowExcelPopup(true);
  const handleExcelPopupClose = () => setShowExcelPopup(false);
  const handleGeneralInfoPopupOpen = () => setShowGeneralInfoPopup(true);
  const handleGeneralInfoPopupClose = () => setShowGeneralInfoPopup(false);
  const handleFileUploadPopupOpen = () => setShowFileUploadPopup(true);
  const handleFileUploadPopupClose = async () => {
    const updatedData = await fetchData(data?._id);
    update(updatedData);
    setShowFileUploadPopup(false);
  };

  const handleShowGalleryPopupConnect = () => setIsGalleryPopupConnect(true);
  const handleHideGalleryPopupConnect = () => setIsGalleryPopupConnect(false);
  const handleShowEditSocialLinkPopup = () => setIsEditSocialLinkPopup(true);
  const handleHideEditSocialLinkPopup = () => setIsEditSocialLinkPopup(false);
  const handleShowBusinessHoursPopup = () => setIsBusinessHoursPopup(true);
  const handleHideBusinessHoursPopup = () => setIsBusinessHoursPopup(false);
  const handleShowAddLocationPopup = () => setIsAddLocationPopup(true);
  const handleHideAddLocationPopup = () => setIsAddLocationPopup(false);
  // const handleOptionsPopupOpen = () => setShowOptionsPopup(true);
  const handleOptionsPopupClose = () => setShowOptionsPopup(false);
  const handleShowOwnerDetailsPopup = () => setIsOwnerDetailsPopup(true);
  const handleHideOwnerDetailsPopup = () => setIsOwnerDetailsPopup(false);
  const handleShowEnquiryPrefrencePopup = () =>
    setIsEnquiryPrefrencePopup(true);
  const handleHideEnquiryPrefrencePopup = () =>
    setIsEnquiryPrefrencePopup(false);

  const truncateText = (arr, maxLength = 20) => {
    if (!arr || arr.length === 0) return "";
    const joinedText = arr.join(", ");
    return joinedText.length > maxLength
      ? `${joinedText.slice(0, maxLength)}...`
      : joinedText;
  };

  const sendVerificationRequest = async () => {
    if (emptyFields.length === 0) {
      await http.post(`${config.api_url}/business/get-verified`, {
        user: data._id,
        status: "pending",
      });

      setVerificationStatus("Pending Verification");
    }
  };

  const updatePageStatus = async (status) => {
    await http.put(`${config.api_url}/business/change-visibility/${data._id}`, {
      pageStatus: status,
    });
  };

  const handleStatusToggle = async () => {
    // Use the current state value to determine the new state
    const currentIsOnline = isOnline;
    const newIsOnline = !currentIsOnline;
    const newStatus = newIsOnline ? "online" : "offline";

    setIsOnline(newIsOnline);

    try {
      await updatePageStatus(newStatus);
      toast(
        <ToastMsg message={`Status changed to ${newStatus?.toUpperCase()}`} />,
        config.success_toast_config
      );
    } catch (error) {
      setIsOnline(currentIsOnline);
      console.error("Failed to update status:", error);
    }
  };

  const handleSaveBusinessHours = async (businessHours) => {
    const response = await http.post(
      `${config.api_url}/business/business-details/${data._id}`,
      { business_hours: businessHours }
    );

    if (response?.data) {
      data.business_hours = businessHours;
      await update({
        ...data,
        business_hours: businessHours,
      });
      toast(
        <ToastMsg message={`Changes saved successfully`} />,
        config.success_toast_config
      );
    }
  };

  const scrollingTextData = [
    `Project Scope : <span>${
      truncateText(data?.project_scope?.data) || ""
    }</span>`,
    `Can do Projects : <span>${data?.project_location?.data || ""}</span>`,
    `Renovation Work : <span>${data?.renovation_work || ""}</span>`,
    `Approx Budget of Projects : <span>${
      data?.avg_project_budget?.budget || ""
    }</span>`,
    `Current Min. Project Fee : <span>${
      data?.project_mimimal_fee?.fee || ""
    }</span>`,
    `Min. Project Size : ${truncateText(
      data?.project_sizes?.sizes?.map(
        (size) => `<span>${size} ${data?.project_sizes?.unit}</span> `
      )
    )}`,
    `Project Typology : <span>${truncateText(
      data?.project_typology?.data || ""
    )}</span>`,
    `Design Style : <span>${truncateText(
      data?.design_style?.data || ""
    )}</span>`,
  ];

  const scrollingText = scrollingTextData.map((item, i) => (
    <SwiperSlide key={i}>
      <p
        className="scrolling_text"
        dangerouslySetInnerHTML={{ __html: item }}
      ></p>
    </SwiperSlide>
  ));

  useEffect(() => {
    if (percentage === 100) {
      setShowCompletionMessage(true);
      const timer = setTimeout(() => {
        setShowCompletionMessage(false);
        setShowEnhanceButton(true);
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowCompletionMessage(false);
      setShowEnhanceButton(false);
      setIsLoading(false);
    }
  }, [percentage]);

  const handleSaveBusinessDetails = async (businessData) => {
    const formData = new FormData();
    businessData.logoFile && formData.append("file", businessData.logoFile);
    businessData.businessName &&
      formData.append("business_name", businessData.businessName);
    const response = await http.post(
      `${config.api_url}/business/business-details/${data._id}`,
      formData
    );

    if (response?.data) {
      data.business_name = businessData.businessName;
      await update({
        ...data,
        business_name: businessData.businessName,
        brand_logo: response?.data?.brand_logo,
      });
      toast(
        <ToastMsg message={`Changes saved successfully`} />,
        config.success_toast_config
      );
      setShowEditFirmNamePopup(false);
    }
  };

  const handleSelectLocation = async (locationData) => {
    if (locationData?.location) {
      await http.post(
        `${config.api_url}/business/business-details/${data._id}`,
        { google_location: locationData.location }
      );
      await update({
        ...data,
        google_location: locationData.location,
      });
      toast(
        <ToastMsg message={`Location saved successfully`} />,
        config.success_toast_config
      );
    }
  };

  useEffect(() => {
    setIsOnline(data?.pageStatus === "online");
  }, [data?.pageStatus]);

  useEffect(() => {
    if (!data?.verificationData) {
      setVerificationStatus("Get Verified Now!");
    }
    if (data?.verificationData?.status === "pending") {
      setVerificationStatus("Pending Verification");
    }
  }, [data?.verificationData]);

  const shareUrl = window.location.host + `${businessProfileViewURL2}`;
  // const shareUrl = window.location.host + `/${data?.username}`;
  const shareTitle = data?.business_name || "Check out this business profile!";

  const shareContent = (
    <div
      className="share_popup"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px",
        minWidth: "200px",
      }}
    >
      <div style={{ width: "100%" }}>
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
            shareTitle + " " + shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 12px",
            borderRadius: "4px",
            transition: "background-color 0.2s",
            textDecoration: "none",
            color: "#333",
            width: "100%",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f5f5f5")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <WhatsAppOutlined style={{ fontSize: "24px", flexShrink: 0 }} />
          <span style={{ fontSize: "14px" }}>Share on WhatsApp</span>
        </a>
      </div>

      <div style={{ width: "100%" }}>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 12px",
            borderRadius: "4px",
            transition: "background-color 0.2s",
            textDecoration: "none",
            color: "#333",
            width: "100%",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f5f5f5")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <LinkedinOutlined style={{ fontSize: "24px", flexShrink: 0 }} />
          <span style={{ fontSize: "14px" }}>Share on LinkedIn</span>
        </a>
      </div>

      <div style={{ width: "100%" }}>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareTitle
          )}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 12px",
            borderRadius: "4px",
            transition: "background-color 0.2s",
            textDecoration: "none",
            color: "#333",
            width: "100%",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f5f5f5")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ flexShrink: 0 }}
          >
            <text x="8" y="18" fontSize="18" fontWeight="bold">
              X
            </text>
          </svg>
          <span style={{ fontSize: "14px" }}>Share on X</span>
        </a>
      </div>

      <div style={{ width: "100%" }}>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 12px",
            borderRadius: "4px",
            transition: "background-color 0.2s",
            textDecoration: "none",
            color: "#333",
            width: "100%",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f5f5f5")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <FacebookOutlined style={{ fontSize: "24px", flexShrink: 0 }} />
          <span style={{ fontSize: "14px" }}>Share on Facebook</span>
        </a>
      </div>

      <div style={{ width: "100%" }}>
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            // Optional: You could add a visual feedback here
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 12px",
            borderRadius: "4px",
            transition: "background-color 0.2s",
            textDecoration: "none",
            color: "#333",
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f5f5f5")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <LinkOutlined style={{ fontSize: "24px", flexShrink: 0 }} />
          <span style={{ fontSize: "14px" }}>Copy Link</span>
        </button>
      </div>
    </div>
  );

  const renderBusinessHours = () => {
    if (data?.business_hours && Array.isArray(data.business_hours)) {
      return data.business_hours.map((item, index) => (
        <div key={index} className="business_working_hr">
          <div className="day_working">{item.day}</div>
          {item.isClosed ? (
            <div className="time_working">Closed</div>
          ) : (
            <div className="time_working">{`${item.open} - ${item.close}`}</div>
          )}
        </div>
      ));
    }
    return null; // Or a fallback UI, e.g., <div>No business hours available</div>
  };

  return (
    <>
      {width <= 768 && (
        <SocialMediaLinksPopup
          show={showOptionsPopup}
          handleClose={handleOptionsPopupClose}
          shareUrl={shareUrl}
          shareTitle={shareTitle}
        />
      )}
      <CompleteActions
        show={isCompleteActionsModal}
        onHide={() => setIsCompleteActionsModal(false)}
        handleClose={handleHideCompleteActions}
        data={data}
        emptyFields={emptyFields}
      />
      <WorkPlaceDefaultPopup
        show={isGalleryPopupConnect}
        onHide={() => setIsGalleryPopupConnect(false)}
        handleClose={handleHideGalleryPopupConnect}
        data={data?.workspace_media}
        recentlyDeletedData={data?.recently_deleted}
        isEditable={props.isEditable}
      />
      {/* <GalleryPopupConnect
        show={isGalleryPopupConnect}
        onHide={() => setIsGalleryPopupConnect(false)}
        handleClose={handleHideGalleryPopupConnect}
        data={data?.workspace_media}
      /> */}
      <BusinessHoursPopup
        show={isBusinessHoursPopup}
        onHide={() => setIsBusinessHoursPopup(false)}
        handleClose={handleHideBusinessHoursPopup}
        businessHours={data?.business_hours}
        onSaveBusinessHours={handleSaveBusinessHours}
      />
      <EditSocialLinkPopup
        show={isEditSocialLinkPopup}
        onHide={() => setIsEditSocialLinkPopup(false)}
        handleClose={handleHideEditSocialLinkPopup}
        data={data}
        onSuccess
      />
      <EditFirmNamePopup
        show={showEditFirmNamePopup}
        handleClose={handleEditFirmNamePopupClose}
        OpenEditFirmNamePopup={handleEditFirmNamePopupOpen}
        data={{
          business_name: data?.business_name,
          brand_logo: data?.brand_logo,
        }}
        onSaveChanges={handleSaveBusinessDetails}
      />
      <AddLocationPopup
        show={isAddLocationPopup}
        onHide={() => setIsAddLocationPopup(false)}
        handleClose={handleHideAddLocationPopup}
        onLocationSelect={handleSelectLocation}
        data={data?.google_location}
        editMode={
          data?.google_location?.latitude &&
          data?.google_location?.longitude &&
          data?.google_location?.latitude !== "NA" &&
          data?.google_location?.longitude !== "NA"
            ? true
            : false
        }
      />

      <OwnerDetailsPopup
        show={isOwnerDetailsPopup}
        onHide={() => setIsOwnerDetailsPopup(false)}
        handleClose={handleHideOwnerDetailsPopup}
        // businessHours={data?.business_hours}
        // onSaveBusinessHours={handleSaveBusinessHours}
      />

      <EnquiryPrefrencePopup
        show={isEnquiryPrefrencePopup}
        onHide={() => setIsEnquiryPrefrencePopup(false)}
        handleClose={handleHideEnquiryPrefrencePopup}
      />

      <main className="bedit_main">
        <section className="bEdit_grid_wrapper">
          <div className="my_container">
            <div className="row">
              <div className="col-lg-7 right_section_col_bEdit Contact_Info_col_main_warapper">
                <div className="my_container">
                  {/* Contact Info */}
                  {showContactInfo && (
                    <div className="Contact_Info_wrapper">
                      <div className="heading_common_contact_info d-flex justify-content-between align-items-center">
                        Contact Info
                        {props.isEditable &&
                          data?.google_location?.latitude &&
                          data?.google_location?.longitude &&
                          data?.google_location?.latitude !== "NA" &&
                          data?.google_location?.longitude !== "NA" && (
                            <div
                              className="edit_connect_wrapper_title edt_ic_map "
                              onClick={handleShowAddLocationPopup}
                            >
                              <img
                                src={images.editIconBlue}
                                alt="edit"
                                className="edit_icon_conect"
                              />
                              Edit Location
                            </div>
                          )}
                      </div>
                      <div className="map_gallery_wrapper">
                        {props.isEditable ? (
                          data?.workspace_media?.length > 0 ? (
                            <div className="gallery_Workplace">
                              <img
                                src={`${aws_object_url}business/${data?.workspace_media[0]?.url}`}
                                alt="workplace-image"
                                className="work_place_default_image"
                              />
                              <img
                                src={images.groupImageIcon}
                                alt="img-icon"
                                className="group_Image_Icon"
                                onClick={handleShowGalleryPopupConnect}
                              />
                            </div>
                          ) : (
                            <div
                              className="gallery_Workplace galery_workplace_empty_state"
                              onClick={handleFileUploadPopupOpen}
                            >
                              <div className="empty_workplace_conetnt">
                                <img
                                  src={images.addIcon}
                                  alt="add image"
                                  className="addWorkplace_image_icon"
                                />
                                <div className="empty_workplace_title">
                                  Add Workplace Images
                                </div>
                              </div>
                            </div>
                          )
                        ) : (
                          data?.workspace_media?.length > 0 && (
                            <div className="gallery_Workplace">
                              <img
                                src={`${aws_object_url}business/${data?.workspace_media[0]?.url}`}
                                alt="workplace-image"
                                className="work_place_default_image"
                              />
                              <img
                                src={images.groupImageIcon}
                                alt="img-icon"
                                className="group_Image_Icon"
                                onClick={handleShowGalleryPopupConnect}
                              />
                            </div>
                          )
                        )}
                        <div className="connect_map">
                          {!isLoading &&
                            (data?.google_location?.latitude &&
                            data?.google_location?.longitude &&
                            data?.google_location?.latitude !== "NA" &&
                            data?.google_location?.longitude !== "NA" ? (
                              <iframe
                                title="google map frame"
                                src={`https://www.google.com/maps?q=${data.google_location?.latitude},${data.google_location?.longitude}&output=embed`}
                                width="100%"
                                height="100%"
                                style={{
                                  border: "0",
                                  margin: "0",
                                  padding: "0",
                                }}
                                allowFullScreen
                                loading="lazy"
                                className="map_frame_connect"
                              ></iframe>
                            ) : props.isEditable ? (
                              <div
                                className="gallery_Workplace galery_workplace_empty_state empty_state_location_connect"
                                onClick={handleShowAddLocationPopup}
                              >
                                <div className="empty_workplace_conetnt">
                                  <img
                                    src={images.addIcon}
                                    alt="add image"
                                    className="addWorkplace_image_icon"
                                  />
                                  <div className="empty_workplace_title">
                                    Add Location
                                  </div>
                                </div>
                              </div>
                            ) : null)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Socail links */}
                  <div className="Contact_Info_wrapper nw_social_links_wrapper">
                    <div className="heading_common_contact_info d-flex justify-content-between align-items-center">
                      <div>
                        Social Links
                        <img
                          src={infoIconEditProfile}
                          alt="info"
                          className="inf_icon_prf"
                          onClick={() => setModalShow(true)}
                        />
                      </div>
                      {props.isEditable && (
                        <div
                          className="edit_connect_wrapper_title edt_ic_map"
                          onClick={handleShowEditSocialLinkPopup}
                        >
                          <img
                            src={images.editIconBlue}
                            alt="edit"
                            className="edit_icon_conect"
                          />
                          Edit | View
                        </div>
                      )}
                    </div>

                    {data?.website_link && (
                      <div className="social_liks_connect">
                        <img
                          src={images.webIcon}
                          alt="web icon"
                          className="social-icons_connect"
                        />
                        <a
                          href={data.website_link}
                          target="_"
                          className="social_link"
                        >
                          {helper.formatSocialLink(
                            "website",
                            data.website_link
                          )}
                        </a>

                        <div className="lock_icon_wrapper">
                          <img
                            src={images.lockIcon}
                            alt="Lock Icon"
                            className="link_lock"
                          />

                          <span className="custom_tooltip">
                            Links get locked after onboarding
                          </span>
                        </div>
                      </div>
                    )}
                    {data?.linkedin_link && (
                      <div className="social_liks_connect">
                        <img
                          src={images.linkedInIcon}
                          alt="web icon"
                          className="social-icons_connect"
                        />
                        <a
                          href={data.linkedin_link}
                          target="_"
                          className="social_link"
                        >
                          {helper.formatSocialLink(
                            "linkedin",
                            data.linkedin_link
                          )}
                        </a>

                        <div className="lock_icon_wrapper">
                          <img
                            src={images.lockIcon}
                            alt="Lock Icon"
                            className="link_lock"
                          />

                          <span className="custom_tooltip">
                            Links get locked after onboarding
                          </span>
                        </div>
                      </div>
                    )}
                    {data?.instagram_handle && (
                      <div className="social_liks_connect">
                        <img
                          src={images.instaIcon}
                          alt="web icon"
                          className="social-icons_connect"
                        />
                        <a
                          href={data.instagram_handle}
                          target="_"
                          className="social_link"
                        >
                          {helper.formatSocialLink(
                            "instagram",
                            data.instagram_handle
                          )}
                        </a>

                        <div className="lock_icon_wrapper">
                          <img
                            src={images.lockIcon}
                            alt="Lock Icon"
                            className="link_lock"
                          />

                          <span className="custom_tooltip">
                            Links get locked after onboarding
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/*  Business Working Hours */}
                  {data?.business_hours?.length ? (
                    <div className="Contact_Info_wrapper nw_Business_Working_hr_wrap ">
                      {/* <div className="heading_common_contact_info">
                        Business Working Hours
                        <div
                          className="edit_connect_wrapper_title"
                          onClick={handleShowBusinessHoursPopup}
                        >
                          <img
                            src={images.editIconBlue}
                            alt="edit"
                            className="edit_icon_conect"
                          />
                          Edit | Add
                        </div>
                      </div> */}

                      <div className="heading_common_contact_info d-flex justify-content-between align-items-center">
                        Business Working Hours
                        {props.isEditable && (
                          <div
                            className="edit_connect_wrapper_title edt_ic_map"
                            onClick={handleShowBusinessHoursPopup}
                          >
                            <img
                              src={images.editIconBlue}
                              alt="edit"
                              className="edit_icon_conect"
                            />
                            Edit | Add
                          </div>
                        )}
                      </div>

                      {renderBusinessHours()}
                    </div>
                  ) : (
                    <div className="Contact_Info_wrapper nw_social_links_wrapper pb-0">
                      <div className="heading_common_contact_info d-flex justify-content-between align-items-center">
                        Business Working Hours
                        {props.isEditable && (
                          <div
                            className="edit_connect_wrapper_title"
                            onClick={handleShowBusinessHoursPopup}
                          >
                            <img
                              src={images.editIconBlue}
                              alt="edit"
                              className="edit_icon_conect"
                            />
                            Edit | Add
                          </div>
                        )}
                      </div>

                      <div className="Business_pera_Working_hr pb-0">
                        Your business timings are missing! Add them now to let
                        your clients know when you're available.
                      </div>
                    </div>
                  )}
                  {/* Business Working Hours */}

                  {/* Owner Details */}
                  {/* <div className="owner_details">
                    <div className="heading_common_contact_info d-flex justify-content-between align-items-center">
                      Owner Details
                      {props.isEditable && (
                        <div
                          className="edit_connect_wrapper_title edt_ic_map"
                          onClick={handleShowOwnerDetailsPopup}
                        >
                          <img
                            src={images.editIconBlue}
                            alt="edit"
                            className="edit_icon_conect"
                          />
                          Edit | Add
                        </div>
                      )}
                    </div>

                    <div className="owner_cards">
                      <div className="owner_card">
                        <p className="name">Rohit Gurunath Sharma</p>
                        <p className="email">ashish@gmail.com</p>
                        <p className="number">8879045599</p>
                        <p className="whatsappnumber">8879504985</p>
                      </div>
                      <div className="owner_card">
                        <p className="name">Ashish Manna</p>
                        <p className="email">ashish@gmail.com</p>
                        <p className="number">8879045599</p>
                        <p className="whatsappnumber">8879504985</p>
                      </div>
                      <div className="owner_card">
                        <p className="name">Ashish Manna</p>
                        <p className="email">ashish@gmail.com</p>
                        <p className="number">8879045599</p>
                        <p className="whatsappnumber">8879504985</p>
                      </div>
                      <div className="owner_card">
                        <p className="name">Ashish Manna</p>
                        <p className="email">ashish@gmail.com</p>
                        <p className="number">8879045599</p>
                        <p className="whatsappnumber">8879504985</p>
                      </div>
                    </div>
                  </div> */}

                  {/* Enquiry Prefrence Details */}
                  {/* <div className="enquiry_prefrence_details_wrapper">
                    <div className="heading_common_contact_info d-flex justify-content-between align-items-center">
                      Enquiries Prefrence Details
                      {props.isEditable && (
                        <div
                          className="edit_connect_wrapper_title edt_ic_map"
                          onClick={handleShowEnquiryPrefrencePopup}
                        >
                          <img
                            src={images.editIconBlue}
                            alt="edit"
                            className="edit_icon_conect"
                          />
                          Edit | Add
                        </div>
                      )}
                    </div>

                    <div className="enquiry_prefrence_details">
                      <div className="enquiry">
                        <p className="title">
                          Project/Business :{" "}
                          <span className="detail">
                            Both(Owner & Business Contact Person)
                          </span>
                        </p>
                        <div className="contact_details">
                          <span>
                            <img src={orangeRightTick} alt="Right Tick" />
                            Email Id
                          </span>
                          <span>
                            <img src={orangeRightTick} alt="Right Tick" />
                            WhatsApp
                          </span>
                        </div>
                      </div>
                      <div className="enquiry">
                        <p className="title">
                          Product/Material Showcase :{" "}
                          <span className="detail">
                            Both(Owner & Business Contact Person)
                          </span>
                        </p>
                        <div className="contact_details">
                          <span>
                            <img src={orangeRightTick} alt="Right Tick" />
                            Email Id
                          </span>
                          <span>
                            <img src={orangeRightTick} alt="Right Tick" />
                            WhatsApp
                          </span>
                        </div>
                      </div>
                      <div className="enquiry">
                        <p className="title">
                          Jobs/Internship/Hiring :{" "}
                          <span className="detail">
                            Both(Owner & Business Contact Person)
                          </span>
                        </p>
                        <div className="contact_details">
                          <span>
                            <img src={orangeRightTick} alt="Right Tick" />
                            Email Id
                          </span>
                          <span>
                            <img src={orangeRightTick} alt="Right Tick" />
                            WhatsApp
                          </span>
                          <span>
                            <img src={orangeRightTick} alt="Right Tick" />
                            Phone Call
                          </span>
                        </div>
                      </div>
                      <div className="enquiry">
                        <p className="title">
                          Media/PR/Events :{" "}
                          <span className="detail">
                            Both(Owner & Business Contact Person)
                          </span>
                        </p>
                        <div className="contact_details">
                          <span>
                            <img src={orangeRightTick} alt="Right Tick" />
                            Email Id
                          </span>
                          <span>
                            <img src={orangeRightTick} alt="Right Tick" />
                            WhatsApp
                          </span>
                        </div>
                      </div>
                    </div>
                  </div> */}


                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <FooterV2 lightTheme /> */}
      </main>
      <ExcelPopup
        show={showExcelPopup}
        handleClose={handleExcelPopupClose}
        globalData={GlobalContextData}
        data={data}
      />
      <GeneralInformation
        show={showGeneralInfoPopup}
        handleClose={handleGeneralInfoPopupClose}
        data={data}
        globalData={GlobalContextData}
      />
      <FileUpload
        show={showFileUploadPopup}
        handleCloseAndUpdate={handleFileUploadPopupClose}
        data={data}
        category={"workspace_media"}
      />
      <PromotePopup
        show={isPromotePopupModal}
        onHide={() => setIsPromotePopupModal(false)}
        handleClose={() => setIsPromotePopupModal(false)}
      />
      <FormFiveModal
        list={datainfoBedit}
        show={modalShow}
        onHide={() => setModalShow(false)}
        infoIconLightTheme={true}
        className="company-profile-modal-pdf-info"
        backdropClassName="company-profile-pdf-info-backdrop"
      />
    </>
  );
};

export default BusinessConnectEdit;
