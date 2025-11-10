import React, { useEffect, useRef, useState } from "react";
import "./bcEdit.scss";
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

const locationDropdown = [
  "Gandhidham, Gujarat, India",
  "Gandhidham, Maharashtra, India",
  "Gandhidham, Gujarat, India",
];

const BCEdit = () => {
  const [isActive, setIsActive] = useState(0);
  const [isSubtabActive, setIsSubtabActive] = useState(0);
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
  const [verificationStatus, setVerificationStatus] =
    useState("Get Verified Now!");
  const { data, editMode, toggleEditMode, updateSection, saveAllChanges } =
    useBusinessContext();
  const GlobalContextData = useGlobalDataContext();
  const [isPromotePopupModal, setIsPromotePopupModal] = useState(false);
  const [isOnline, setIsOnline] = useState(data?.pageStatus === "online");
  const aws_object_url = config.aws_object_url;

  const handlePopupOpen = () => setShowPopup(true);
  const handlePopupClose = () => setShowPopup(false);
  const handleEnhancePopupOpen = () => setShowEnhancePopup(true);
  const handleEnhancePopupClose = () => setShowEnhancePopup(false);
  const handleExcelPopupOpen = () => setShowExcelPopup(true);
  const handleExcelPopupClose = () => setShowExcelPopup(false);
  const handleGeneralInfoPopupOpen = () => setShowGeneralInfoPopup(true);
  const handleGeneralInfoPopupClose = () => setShowGeneralInfoPopup(false);
  const handleFileUploadPopupOpen = () => setShowFileUploadPopup(true);
  const handleFileUploadPopupClose = () => setShowFileUploadPopup(false);

  const handleShowGalleryPopupConnect = () => setIsGalleryPopupConnect(true);
  const handleHideGalleryPopupConnect = () => setIsGalleryPopupConnect(false);
  const handleShowEditSocialLinkPopup = () => setIsEditSocialLinkPopup(true);
  const handleHideEditSocialLinkPopup = () => setIsEditSocialLinkPopup(false);
  const handleShowBusinessHoursPopup = () => setIsBusinessHoursPopup(true);
  const handleHideBusinessHoursPopup = () => setIsBusinessHoursPopup(false);
  const handleShowAddLocationPopup = () => setIsAddLocationPopup(true);
  const handleHideAddLocationPopup = () => setIsAddLocationPopup(false);

  // useEffect(() => {
  //   if (data?.isVerified) {
  //     setVerificationStatus("Promote Business Page");
  //   }
  // }, [data?.isVerified]);

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

  return (
    <>
      <WorkPlaceDefaultPopup
        show={isGalleryPopupConnect}
        onHide={() => setIsGalleryPopupConnect(false)}
        handleClose={handleHideGalleryPopupConnect}
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
      />
      <EditSocialLinkPopup
        show={isEditSocialLinkPopup}
        onHide={() => setIsEditSocialLinkPopup(false)}
        handleClose={handleHideEditSocialLinkPopup}
        data={data}
        onSuccess
      />
      <AddLocationPopup
        show={isAddLocationPopup}
        onHide={() => setIsAddLocationPopup(false)}
        handleClose={handleHideAddLocationPopup}
      />
      <main className="bedit_main">
        <section className="bEdit_grid_wrapper">
          <div className="my_container">
            <div className="row">
              <div className="col-lg-7 right_section_col_bEdit Contact_Info_col_main_warapper">
                <div className="my_container">
                  {/* Contact Info */}
                  <div className="Contact_Info_wrapper">
                    <div className="heading_common_contact_info">
                      Contact Info
                    </div>
                    <div className="map_gallery_wrapper">
                      {data?.workspace_media?.length > 0 ? (
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
                              alt="add iamge"
                              className="addWorkplace_image_icon"
                            />
                            <div className="empty_workplace_title">
                              Add Workplace Images
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="connect_map">
                        {/* <iframe
                          title="google map frame"
                          src={`https://www.google.com/maps?q=${data.google_location?.latitude},${data.google_location?.longitude}&output=embed`}
                          width="100%"
                          height="100%"
                          style={{ border: "0", margin: "0", padding: "0" }}
                          allowFullScreen
                          loading="lazy"
                          className="map_frame_connect"
                        ></iframe> */}

                        {/* empty state for location */}
                        <div
                          className="gallery_Workplace galery_workplace_empty_state empty_state_location_connect"
                          onClick={handleShowAddLocationPopup}
                        >
                          <div className="empty_workplace_conetnt">
                            <img
                              src={images.addIcon}
                              alt="add iamge"
                              className="addWorkplace_image_icon"
                            />
                            <div className="empty_workplace_title">
                              Add Location
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Socail links */}
                  <div className="Contact_Info_wrapper nw_social_links_wrapper">
                    <div className="heading_common_contact_info d-flex justify-content-between align-items-center">
                      Social Links
                      <div
                        className="edit_connect_wrapper_title"
                        onClick={handleShowEditSocialLinkPopup}
                      >
                        <img
                          src={images.editIconBlue}
                          alt="edit"
                          className="edit_icon_conect"
                        />
                        Edit | View
                      </div>
                    </div>

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
                        {helper.formatSocialLink("website", data.website_link)}
                      </a>
                    </div>

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
                    </div>

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
                    </div>
                  </div>

                  {/*  Business Working Hours */}
                  <div className="Contact_Info_wrapper nw_Business_Working_hr_wrap">
                    {/* <div className="heading_common_contact_info">
                      Business Working Hours
                    </div> */}
                    <div className="business_working_hr">
                      <div className="day_working">Monday</div>
                      <div className="time_working">10:00 am - 6:30 pm</div>
                    </div>
                    <div className="business_working_hr">
                      <div className="day_working">Tuesday</div>
                      <div className="time_working">10:00 am - 6:30 pm</div>
                    </div>
                    <div className="business_working_hr">
                      <div className="day_working">Wednesday</div>
                      <div className="time_working">10:00 am - 6:30 pm</div>
                    </div>
                    <div className="business_working_hr">
                      <div className="day_working">Thursday</div>
                      <div className="time_working">10:00 am - 6:30 pm</div>
                    </div>
                    <div className="business_working_hr">
                      <div className="day_working">Friday</div>
                      <div className="time_working">10:00 am - 6:30 pm</div>
                    </div>
                    <div className="business_working_hr">
                      <div className="day_working">Saturday</div>
                      <div className="time_working">Closed</div>
                    </div>
                    <div className="business_working_hr">
                      <div className="day_working">Sunday</div>
                      <div className="time_working">Closed</div>
                    </div>
                  </div>

                  {/* Business Working Hours */}
                  <div className="Contact_Info_wrapper nw_social_links_wrapper">
                    <div className="heading_common_contact_info d-flex justify-content-between align-items-center">
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
                    </div>

                    <div className="Business_pera_Working_hr">
                      Your business timings are missing! Add them now to let
                      your clients know when you're available.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <FooterV2 lightTheme />
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
        handleClose={handleFileUploadPopupClose}
        data={data}
        categoryData={{ category: { key: "workspace_media" } }}
      />
      <PromotePopup
        show={isPromotePopupModal}
        onHide={() => setIsPromotePopupModal(false)}
        handleClose={() => setIsPromotePopupModal(false)}
      />
    </>
  );
};

export default BCEdit;
