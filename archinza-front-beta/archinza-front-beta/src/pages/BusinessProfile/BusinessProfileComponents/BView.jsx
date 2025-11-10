import React, { useState } from "react";
import "./BView.scss";
import {
  bEdit_background,
  ConnectIcon,
  draftRedIcon,
  editicon,
  editIconBlue,
  employeesOrange,
  establishedOrange,
  heartBlack,
  heartOutline,
  locationOrange,
  msgIcon,
  shareBlackInside,
  verifiedBlueIcon,
} from "../../../images";
import { Link } from "react-router-dom";
import OverViewBpreview from "../BEditComponent/OverViewBPreviw/OverViewBPreview";
import FooterV2 from "../../../components/FooterV2/FooterV2";
import VerticalAccordion from "../BEditComponent/VerticalAccordion/VerticalAccordion";
import {
  BViewProfileData,
  ratingData,
} from "../../../components/Data/bViewData";
import CompanyProfile from "../BEditComponent/CompanyProfile/CompanyProfile";
import { Rating } from "@mui/material";
import Reviews from "../BEditComponent/Reviews/Reviews";
// import GridImage from "../BEditComponent/GridImageComponent/GridImage";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import WhereWePopup from "./BusinessViewPopups/WhereWePopup";
import AboutPopupView from "./BusinessViewPopups/AboutPopupView/AboutPopupView";
import LocationPopupView from "./BusinessViewPopups/LocationPopupView/LocationPopupView";
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

const BView = () => {
  const [isActive, setIsActive] = useState(0);
  const [isSubtabActive, setIsSubtabActive] = useState(0);

  const [isWhereWePopup, setIsWhereWePopup] = useState(false);
  const handleShow = () => setIsWhereWePopup(true);
  const handleHide = () => setIsWhereWePopup(false);

  const [isLocationPopup, setIsLocationPopup] = useState(false);
  const handleShowLocation = () => setIsLocationPopup(true);
  const handleHideLocation = () => setIsLocationPopup(false);

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
      <WhereWePopup
        show={isWhereWePopup}
        onHide={() => setIsWhereWePopup(false)}
        handleClose={handleHide}
      />
     
      <LocationPopupView
        show={isLocationPopup}
        onHide={() => setIsLocationPopup(false)}
        handleClose={handleHideLocation}
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
                  ATINNER INTERIOR FIRM
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
                    <div className="status_container">
                      <div className="profile_wrapper">
                        <a
                          href="/"
                          className="profile_status verified_status bView_connect_link"
                          target="_"
                        >
                          {/* <a href="/"> */}
                          <img
                            src={ConnectIcon}
                            alt="verified"
                            className="verified_icon"
                          />
                          <p className={`status_text `}>Connect</p>
                          {/* </a> */}
                        </a>
                        <div className="profile_status verified_status">
                          <img
                            src={msgIcon}
                            alt="draft"
                            className="verified_icon"
                          />
                          <p className={`status_text`}>
                            Ask & Search the Business
                          </p>
                        </div>
                      </div>
                      {/* <div className="profile_status">
                        <img src={editicon} alt="edit" className="edit_icon" />
                        <p className={`status_text`}>Edit</p>
                      </div> */}
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
                      {/* <select className="select_field">
                        {locationDropdown.map((loc, index) => ( 
                          <option value={loc} key={index}> 
                          {loc}
                          </option> 
                       ))} 
                      </select> */}
                      <div
                        className="select_field"
                        onClick={handleShowLocation}
                      >
                        Gandhidham, Gujarat, India
                      </div>
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
                          observer={true}
                          observeParents={true}
                          speed={1500}
                          autoplay={{
                            delay: 1000,
                            disableOnInteraction: false,
                          }}
                        >
                          {scrollingText}
                        </Swiper>
                      </div>

                      <Link
                        to={() => false}
                        className="bedit_common_cta"
                        onClick={handleShow}
                      >
                        {/* <img
                          src={editIconBlue}
                          alt="edit icon"
                          className="edit_ic"
                        /> */}
                        View More
                      </Link>
                    </div>
                    {/* <OverView isActive={0} isSubtabActive={0} 
                    ctaText = {"View More"}
                    editIcon = {false} /> */}
                    <OverViewBpreview
                      isActive={0}
                      isSubtabActive={0}
                      ctaText={"View More"}
                      editIcon={false}
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
                      {BViewProfileData[isActive]?.subTab?.map((item, i) => (
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
                    galleryData={BViewProfileData}
                    editIcon={false}
                  />
                  {/* <GridImage/> */}
                  <CompanyProfile
                    isActive={isActive}
                    isSubtabActive={isSubtabActive}
                    companyProfileData={BViewProfileData}
                    editIcon={false}
                  />
                </section>
              </div>
            </div>
          </div>
        </section>
        <section className="bEdit_section_3">
          <Reviews
            reviewData={ratingData}
            ctaText={"View All"}
            editIcon={false}
          />
        </section>
        <FooterV2 lightTheme />
      </main>
    </>
  );
};

export default BView;
