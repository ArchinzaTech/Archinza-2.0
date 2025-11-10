import React, { useRef, useState } from "react";
import "./BEdit.scss";
import {
  Aura,
  bEdit_background,
  draftRedIcon,
  editConnectIcon,
  editicon,
  editIconBlue,
  employeesOrange,
  enhanceProfileIcon,
  enhanceProfileicon,
  enhanceProfileIconStar,
  establishedOrange,
  eyeIcon,
  getVerifiedWhite,
  heartBlack,
  heartOutline,
  locationOrange,
  mutedVerifIcon,
  prmoteIcon,
  shareBlackInside,
  verifiedBlueIcon,
  verifiedIcon,
} from "../../../images";
import { Link } from "react-router-dom";
import OverView from "../BEditComponent/OverView/OverView";
import FooterV2 from "../../../components/FooterV2/FooterV2";
import VerticalAccordion from "../BEditComponent/VerticalAccordion/VerticalAccordion";
import {
  BeditProfileData,
  ratingData,
} from "../../../components/Data/bEditData";
import CompanyProfile from "../BEditComponent/CompanyProfile/CompanyProfile";
import { Rating } from "@mui/material";
import Reviews from "../BEditComponent/Reviews/Reviews";
// import GridImage from "../BEditComponent/GridImageComponent/GridImage";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import LoadingStateComp from "../BEditComponent/LoadingStateComp/LoadingStateComp";
import ProfileComplitionBar from "../ProfileComplitionBar/ProfileComplitionBar";
import ToggleSwitch from "../BEditComponent/ToggleSwitch/ToggleSwitch";
import PromotePopup from "./PopUpComponents/PromotePopup/PromotePopup";
import { businessProfileViewURL2 } from "../../../components/helpers/constant-words";
import CompleteActions from "./PopUpComponents/CompleteActions/CompleteActions";
// import SelectDropdown from "../../../components/SelectDropdown/alt=""SelectDropdown";

const locationDropdown = [
  "Gandhidham, Gujarat, India",
  "Gandhidham, Maharashtra, India",
  "Gandhidham, Gujarat, India",
];

const scrollingTextData = [
  "Can do Projects : <span>Globally</span>",
  "Renovation : <span>Yes</span>",
  "Can do Projects : <span>Globally</span>",
];

const BEdit = () => {
  const [isActive, setIsActive] = useState(0);
  const [isSubtabActive, setIsSubtabActive] = useState(0);

  const [isGetVerifiedActive, setIsGetVerifiedActive] = useState(false);

  const [hasClicked, setHasClicked] = useState(false);

  const [isPromotePopupModal, setIsPromotePopupModal] = useState(false);
  const handleShow = () => setIsPromotePopupModal(true);
  const handleHide = () => setIsPromotePopupModal(false);

  const [isCompleteActionsModal, setIsCompleteActionsModal] = useState(false);
  const handleShowCompleteActions = () => setIsCompleteActionsModal(true);
  const handleHideCompleteActions = () => setIsCompleteActionsModal(false);

  const handleTextClick = () => {
    if (isGetVerifiedActive && !hasClicked) {
      setHasClicked(true);
    }
  };

  const scrollingText = scrollingTextData.map((item, i) => (
    <SwiperSlide key={i}>
      <p
        className="scrolling_text"
        dangerouslySetInnerHTML={{ __html: item }}
      ></p>
    </SwiperSlide>
  ));

  return (
    <>
      <PromotePopup
        show={isPromotePopupModal}
        onHide={() => setIsPromotePopupModal(false)}
        handleClose={handleHide}
      />
      <CompleteActions
        show={isCompleteActionsModal}
        onHide={() => setIsCompleteActionsModal(false)}
        handleClose={handleHideCompleteActions}
      />
      <main className="bedit_main">
        <section className="bedit_bg">
          <img
            src={bEdit_background}
            alt="background"
            className="bg_image_bedit"
          />
        </section>

        <section className="bedit_sec0 bedit_sec1">
          <div className="heading_container">
            <div className="my_container">
              <div className="head_container">
                <h1 className="title">
                  ATINNER INTERIOR FIRM{" "}
                  <img
                    src={verifiedBlueIcon}
                    alt="verified icon"
                    className="verified_icon_top_header"
                  />
                </h1>
                <div className="social_icon_container">
                  <Link to={() => false} className="social_icon_wrapper">
                    <img
                      src={shareBlackInside}
                      alt="share icon"
                      className="share_icon"
                    />
                  </Link>
                  <Link to={() => false} className="social_icon_wrapper">
                    <img
                      src={heartOutline}
                      alt="share icon"
                      className="heart_icon"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bEdit_grid_wrapper">
          <div className="my_container">
            <div className="row">
              <div className="col-lg-5 col_left_bEdit_section">
                <section className="bedit_sect01 bedit_sec1">
                  <div className="my_container p-0">
                    {/* <div className="status_container">
                      <div className="profile_wrapper">
                        <div className="profile_status verified_status">
                          <img
                            src={verifiedBlueIcon}
                            alt="verified"
                            className="verified_icon"
                          />
                          <p className={`status_text `}>Get Verified Now!</p>
                        </div>
                        <div className="profile_status draft_status">
                          <img
                            src={draftRedIcon}
                            alt="draft"
                            className="draft_icon"
                          />
                          <p className={`status_text`}>Draft</p>
                        </div>
                      </div>
                      <div className="profile_status">
                        <img src={editicon} alt="edit" className="edit_icon" />
                        <p className={`status_text`}>Edit</p>
                      </div>
                    </div> */}

                    <ProfileComplitionBar percentage={88} />

                    <div className="pending_actions_status_pf">
                      {isGetVerifiedActive ? (
                        <div className="pending_actions_status_pf_text pending_actions_status_pf_text_sucess">
                          Congratulations! Your profile is complete! Verify now
                          to start reaching a wider audience.
                        </div>
                      ) : (
                        <div
                          className="pending_actions_status_pf_text"
                          onClick={handleShowCompleteActions}
                        >
                          3 pending actions for your profile completion
                        </div>
                      )}
                    </div>

                    {/* after get verified buttons start from here */}
                    <div className="enhance_profile_cta_container_pf">
                      <div className="enhance_profile_cta_pf">
                        <img
                          src={enhanceProfileIconStar}
                          alt="Enhance Profile"
                          className="enhance_profile_icon_pf"
                        />
                        <p className={`enhance_profile_pf_text`}>
                          Enhance Your Profile Now! For Better Client
                          Matchmaking
                        </p>
                      </div>
                    </div>

                    <div className="online_status_pf__promote_conatiner">
                      <div className="status_pf_wrapper">
                        <span className="status_pf_wrapper_text">
                          Status : Online
                        </span>{" "}
                        <ToggleSwitch />
                      </div>

                      <div className="promote_buiness_pf" onClick={handleShow}>
                        <div className="video_button">
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            controls={false}
                            src={Aura}
                            className="cta_scr_video"
                          />
                          <div className="overlay">
                           <img src={prmoteIcon} alt="Promote Business Page" className="promote_icon" /> <span>Promote Business Page</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* after get verified buttons end here */}

                    <div className="status_container">
                      <div className="profile_wrapper_compliteion">
                        <div className="edit_connect_details_completion_pf_btn">
                          <img
                            src={editConnectIcon}
                            alt="Connect"
                            className="connect_icon_pf"
                          />
                          <p
                            className={`edit_connect_details_completion_pf_text`}
                          >
                            Edit Contact Details
                          </p>
                        </div>

                        {/* Preview Business Page button */}
                        <Link to={businessProfileViewURL2}>
                          <div className="edit_connect_details_completion_pf_btn">
                            <img
                              src={eyeIcon}
                              alt="Connect"
                              className="connect_icon_pf"
                            />
                            <p
                              className={`edit_connect_details_completion_pf_text`}
                            >
                              Preview Business Page
                            </p>
                          </div>
                        </Link>
                        {/* get verified now muted */}
                        {/* <div
                          className={`verify_completion_pf_btn ${
                            isGetVerifiedActive
                              ? "active_verify_completion_pf_btn"
                              : ""
                          }`}
                          onClick={handleTextClick}
                        >
                          <img
                            src={
                              isGetVerifiedActive
                                ? getVerifiedWhite
                                : mutedVerifIcon
                            }
                            alt="verified"
                            className="verified_icon_pf"
                          />
                          <p className="verify_completion_pf_text">
                            {hasClicked
                              ? "Pending Verification"
                              : "Get Verified Now!"}
                          </p>
                        </div> */}
                      </div>
                    </div>

                    {/* <div className="field_wrapper service_dropdown">
                            <SelectDropdown
                              lightTheme
                              label="Select Typology*"
                              labelId="selecttypology"
                              data={servicesDropdownArr}
                            />
                          </div> */}

                    <div className="select_field_container">
                      <img
                        src={locationOrange}
                        alt="location"
                        className="location_icon"
                      />
                      <p className="select_title">STUDIO :</p>
                      &nbsp;
                      <select className="select_field">
                        {locationDropdown.map((loc, index) => (
                          <option value={loc} key={index}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="rating_container">
                      <div className="rating_status">
                        {/* <img src={orangeStar} alt="verified" className="star_icon" /> */}
                        <Rating
                          name="half-rating"
                          defaultValue={1}
                          max={1}
                          readOnly
                          className="star_icon"
                          style={{ color: "#EF7B13" }}
                        />
                        <p className={`rating_text `}>4.5 (2065)</p>
                      </div>
                      <div className="rating_status">
                        <img
                          src={establishedOrange}
                          alt="verified"
                          className="estab_icon"
                        />
                        <p className={`rating_text `}>Estb. 1998</p>
                      </div>
                      <div className="rating_status">
                        <img
                          src={employeesOrange}
                          alt="verified"
                          className="emp_icon"
                        />
                        <p className={`rating_text `}>100+ Employees</p>
                      </div>
                    </div>

                    <div className="scroll_text_container">
                      <div className="wraper_scroling_txt">
                        <div className="heading_scroll">Where We Excel</div>
                        {/* <p className="scrolling_text">
                          Can do Projects : <span>Globally</span>
                        </p> */}
                        <Swiper
                          direction={"vertical"}
                          className="scroll_text_slider"
                          effect="slide"
                          loop={true}
                          modules={[Autoplay]}
                          speed={1500}
                          autoplay={{
                            delay: 1000,
                            disableOnInteraction: false,
                          }}
                        >
                          {scrollingText}
                        </Swiper>
                      </div>

                      <Link to={() => false} className="bedit_common_cta">
                        <img
                          src={editIconBlue}
                          alt="edit icon"
                          className="edit_ic"
                        />
                        Edit | View
                      </Link>
                    </div>
                    <OverView
                      isActive={0}
                      isSubtabActive={0}
                      ctaText={"Edit | View"}
                      editIcon={true}
                    />
                  </div>
                </section>
              </div>

              <div className="col-lg-7 right_section_col_bEdit">
                <section className="bedit_sec2">
                  <div className="my_container">
                    {/* <div className="main_tab_wrapper">
                      {BeditProfileData?.map((item, i) => (
                        <p
                          className={`main_tab_name ${
                            isActive === i ? "active" : ""
                          }`}
                          onClick={() => {
                            setIsActive(i);
                            setIsSubtabActive(0);
                          }}
                          key={`main-tab-${i}`}
                        >
                          {item.mainTab}
                        </p>
                      ))}
                    </div> */}
                    {/* <div className="sub_tab_container">
                      <div className="sub_tab_wrapper">
                        {BeditProfileData[isActive]?.subTab?.map((item, i) => (
                          <p
                            className={`sub_tab_name ${
                              isSubtabActive === i ? "active" : ""
                            }`}
                            onClick={() => setIsSubtabActive(i)}
                            key={`sub-tab-${i}`}
                          >
                            {item.tabName}
                          </p>
                        ))}
                      </div>
                    </div> */}

                    {/* New oneLine Tab */}
                    <div className="main_tab_wrapper">
                      {/* <div className="sub_tab_wrapper"> */}
                      {BeditProfileData[isActive]?.subTab?.map((item, i) => (
                        <p
                          className={`main_tab_name ${
                            isSubtabActive === i ? "active" : ""
                          }`}
                          onClick={() => setIsSubtabActive(i)}
                          key={`sub-tab-${i}`}
                        >
                          {item.tabName}
                        </p>
                      ))}
                      {/* </div> */}
                    </div>
                  </div>
                  <VerticalAccordion
                    isActive={isActive}
                    isSubtabActive={isSubtabActive}
                    galleryData={BeditProfileData}
                    editIcon={true}
                  />
                  <LoadingStateComp />
                  {/* <GridImage/> */}
                  <CompanyProfile
                    isActive={isActive}
                    isSubtabActive={isSubtabActive}
                    companyProfileData={BeditProfileData}
                    editIcon={true}
                  />
                </section>
              </div>
            </div>
          </div>
        </section>
        <section className="bEdit_section_3">
          <Reviews
            isActive={isActive}
            isSubtabActive={isSubtabActive}
            reviewData={ratingData}
            ctaText={"Edit | View"}
            editIcon={true}
          />
        </section>
        <FooterV2 lightTheme />
      </main>
    </>
  );
};

export default BEdit;
