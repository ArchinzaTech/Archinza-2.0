import React, { useEffect, useRef, useState } from "react";
import style from "../../../FormFiveLightTheme/Form/formfivelighttheme.module.scss";
import "./businessConnect.scss";
import FooterV2 from "../../../../components/FooterV2/FooterV2";
import { Link } from "react-router-dom";
// import Swiper from 'swiper'
import OverViewBpreview from "../../BEditComponent/OverViewBPreviw/OverViewBPreview";
import WhereWePopup from "../BusinessViewPopups/WhereWePopup";
import LocationPopupView from "../BusinessViewPopups/LocationPopupView/LocationPopupView";
import { useBusinessContext } from "../../../../context/BusinessAccount/BusinessAccountState";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  bEdit_background,
  ConnectIcon,
  employeesOrange,
  establishedOrange,
  linkedinHeader,
  instaWhite,
  facebookIconOrange,
  groupImageIcon,
  heartOutline,
  locationOrange,
  msgIcon,
  rightarrowblack,
  rightarrowwhite,
  shareBlackInside,
  verifiedBlueIcon,
  webIconOrange,
  workplace01,
  webIcon,
  linkedInIcon,
  instaIcon,
  employeesBlack,
  suitCase_black,
  bookmark_black,
} from "../../../../images";
import { Rating } from "@mui/material";
import { Autoplay } from "swiper/modules";
import FullWidthTextField from "../../../../components/TextField/FullWidthTextField";
import AutoCompleteField from "../../../../components/AutoCompleteField/AutoCompleteField";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { useWindowSize } from "react-use";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import GalleryPopupConnect from "../BusinessViewPopups/GalleryPopupConnect/GalleryPopupConnect";
import helper from "../../../../helpers/helper";

const BusinessConnect = () => {
  //   const [isActive, setIsActive] = useState(0);
  //   const [isSubtabActive, setIsSubtabActive] = useState(0);
  const { data, editMode, toggleEditMode, updateSection, saveAllChanges } =
    useBusinessContext();
  const { width } = useWindowSize();

  const truncateText = (arr, maxLength = 20) => {
    if (!arr || arr.length === 0) return "";
    const joinedText = arr.join(", ");
    return joinedText.length > maxLength
      ? `${joinedText.slice(0, maxLength)}...`
      : joinedText;
  };

  const scrollingTextData = [
    `Can do Projects : <span>${data?.project_location?.data || ""}</span>`,
    `Renovation Work : <span>${data?.renovation_work || ""}</span>`,
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

  const [isWhereWePopup, setIsWhereWePopup] = useState(false);
  const handleShow = () => setIsWhereWePopup(true);
  const handleHide = () => setIsWhereWePopup(false);

  const [isLocationPopup, setIsLocationPopup] = useState(false);
  const handleShowLocation = () => setIsLocationPopup(true);
  const handleHideLocation = () => setIsLocationPopup(false);

  const [isGalleryPopupConnect, setIsGalleryPopupConnect] = useState(false);
  const handleShowGalleryPopupConnect = () => setIsGalleryPopupConnect(true);
  const handleHideGalleryPopupConnect = () => setIsGalleryPopupConnect(false);

  const scrollingText = scrollingTextData.map((item, i) => (
    <SwiperSlide key={i}>
      <p
        className="scrolling_text"
        dangerouslySetInnerHTML={{ __html: item }}
      ></p>
    </SwiperSlide>
  ));

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = React.useState(null);

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
  };

  const location = { latitude: 27.213, longitude: 77.20234 };
  const DummyData = [
    {
      label: "Data - 1",
      value: "Data - 1",
    },
    {
      label: "Data - 2",
      value: "Data - 2",
    },
    {
      label: "Data - 3",
      value: "Data - 3",
    },
    {
      label: "Data - 4",
      value: "Data - 4",
    },
    {
      label: "Data - 5",
      value: "Data - 5",
    },
  ];
  // const currentYear = new Date().getFullYear();
  // const minYear = currentYear - 50;
  // const minDate = new Date(minYear, 0, 1);

  const containerRef = useRef(null);

  useEffect(() => {
    const slider = containerRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // scroll speed multiplier
      slider.scrollLeft = scrollLeft - walk;
    };

    // Add event listeners
    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <WhereWePopup
        show={isWhereWePopup}
        onHide={() => setIsWhereWePopup(false)}
        handleClose={handleHide}
        data={data}
      />
      <GalleryPopupConnect
        show={isGalleryPopupConnect}
        onHide={() => setIsGalleryPopupConnect(false)}
        handleClose={handleHideGalleryPopupConnect}
        data={data?.workspace_media}
      />
      <LocationPopupView
        show={isLocationPopup}
        onHide={() => setIsLocationPopup(false)}
        handleClose={handleHideLocation}
        data={data}
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
                  {data?.business_name?.toUpperCase()}
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
                          <p className={`status_text `}>Contact Info</p>
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
                      <p className="select_title">
                        {data?.addresses?.[0]?.type?.toUpperCase()} :
                      </p>
                      &nbsp;
                      {/* <select className="select_field">
                      {locationDropdown.map((loc, index) => ( 
                        <option value={loc} key={index}> 
                        {loc}
                        </option> 
                     ))} 
                    </select> */}
                      {/* this needs to be uncomment */}
                      {/* <div
                      className="select_field"
                      onClick={handleShowLocation}
                    >
                      {data?.addresses?.[0]?.address}
                    </div> */}
                      <div
                        className="select_field"
                        onClick={handleShowLocation}
                      >
                        {data?.addresses?.[0]?.address}
                      </div>
                    </div>

                    <div className="rating_container" ref={containerRef}>
                      <div className="rating_status">
                        <img
                          src={bookmark_black}
                          alt="save"
                          className="save_icon"
                        />
                        <p className={`rating_text `}>152 Saves</p>
                      </div>

                      <div className="rating_status">
                        <img
                          src={suitCase_black}
                          alt="verified"
                          className="estab_icon"
                        />
                        <p className={`rating_text `}>
                          Estb. {data?.establishment_year?.data}
                        </p>
                      </div>
                      <div className="rating_status">
                        <img
                          src={employeesBlack}
                          alt="verified"
                          className="emp_icon"
                        />
                        <p className={`rating_text `}>
                          {data?.team_range?.data} Employees
                        </p>
                      </div>

                      <div className="rating_status">
                        <Rating
                          name="half-rating"
                          defaultValue={1}
                          max={1}
                          readOnly
                          className="star_icon"
                          style={{ color: "#111111" }}
                        />
                        <p className={`rating_text `}>4.5 (2065)</p>
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

                    <OverViewBpreview
                      isActive={0}
                      isSubtabActive={0}
                      ctaText={"View More"}
                      editIcon={false}
                      overviewData={data}
                    />
                  </div>
                </section>
              </div>

              <div className="col-lg-7 right_section_col_bEdit Contact_Info_col_main_warapper">
                <div className="my_container">
                  {/* Contact Info */}
                  <div className="Contact_Info_wrapper">
                    <div className="heading_common_contact_info">
                      Contact Info
                    </div>
                    <div className="map_gallery_wrapper">
                      <div className="gallery_Workplace">
                        <img
                          src={workplace01}
                          alt="workplace-image"
                          className="work_place_default_image"
                        />
                        <img
                          src={groupImageIcon}
                          alt="img-icon"
                          className="group_Image_Icon"
                          onClick={handleShowGalleryPopupConnect}
                        />
                      </div>
                      <div className="connect_map">
                        <iframe
                          title="google map frame"
                          src={`https://www.google.com/maps?q=${data.google_location?.latitude},${data.google_location?.longitude}&output=embed`}
                          width="100%"
                          height="100%"
                          style={{ border: "0", margin: "0", padding: "0" }}
                          allowFullScreen
                          loading="lazy"
                          className="map_frame_connect"
                        ></iframe>
                      </div>
                    </div>
                  </div>

                  {/* Socail links */}
                  <div className="Contact_Info_wrapper nw_social_links_wrapper">
                    <div className="heading_common_contact_info">
                      Social Links
                    </div>
                    {data?.website_link && (
                      <div className="social_liks_connect">
                        <img
                          src={webIcon}
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
                      </div>
                    )}
                    {data.instagram_handle && (
                      <div className="social_liks_connect">
                        <img
                          src={instaIcon}
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
                    )}
                    {data.linkedin_link && (
                      <div className="social_liks_connect">
                        <img
                          src={linkedInIcon}
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
                    )}
                  </div>

                  {/*  Business Working Hours */}

                  {/* Have An Enquiry? Request A Call Back */}
                  {/* <div className="Contact_Info_wrapper nw_Business_Working_hr_wrap border-0">
                    <div className="heading_common_contact_info mb-business-conect-heading">
                      Have An Enquiry? Request A Call Back
                    </div>

                    <div className="row row_contact_info_wrapper">
                      <div className="col-md-6 row_contact_info_col contact_info_col-1">
                        <FullWidthTextField
                          lightTheme
                          key="Name"
                          label="Name"
                          name="name"
                        />
                      </div>
                      <div className="col-md-6 row_contact_info_col contact_info_col-2">
                        <FullWidthTextField
                          lightTheme
                          key="number"
                          label="Tel. Number"
                          type="number"
                        />
                      </div>

                      <div className="col-md-6 row_contact_info_col contact_info_col-3">
                        <FullWidthTextField
                          lightTheme
                          key="Email ID"
                          label="Email ID"
                        />
                      </div>

                      <div className="col-md-6 row_contact_info_col contact_info_col-4">
                        <AutoCompleteField
                          lightTheme
                          key="product_material_contact_person"
                          textLabel="Preferred Mode"
                          data={DummyData}
                          disablePortal
                        />
                      </div>

                      <div className="col-md-6 row_contact_info_col contact_info_col-5">
                        <div className="row row_contact_info_col_nested">
                          <div className="col-6 contact_time_picker_custom_bs">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <TimePicker
                                label="Select Time"
                                value={selectedTime}
                                onChange={handleTimeChange}
                                minutesStep={1}
                                timeSteps={{ hours: 1, minutes: 1 }}
                                views={["hours", "minutes"]}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  "& .MuiOutlinedInput-root": {
                                    height: "100%", // Make the input field fill the height
                                    borderRadius: "10px",
                                    backgroundColor: "white",
                                    "&:hover fieldset": {
                                      borderColor: "#8D8D8D",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#8D8D8D",
                                    },
                                  },
                                  "& .MuiInputBase-input": {
                                    height: "100%", // Adjust input height
                                    padding: "0.75em", // Adjust padding if needed
                                    display: "flex",
                                    alignItems: "center",
                                  },
                                  "& label": {
                                    lineHeight: width > 768 ? "2em" : "1.5em",
                                    fontFamily: "'Poppins', sans-serif",
                                  },
                                  "& label.Mui-focused": {
                                    color: true ? "#111" : "fff",
                                    fontFamily: "'Poppins', sans-serif",
                                  },
                                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderRadius: "10px",
                                      border: "1px solid #707070",
                                    },
                                  "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      border: "1px solid #707070",
                                    },
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    sx={{ height: "100%" }} // Ensure the TextField itself takes full height
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </div>
                          <div className="col-6 contact_date_picker_custom_bs">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="Select Date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                sx={{
                                  width: "100%",
                                  minWidth: "100%",
                                  height: "100%",
                                  "& .MuiOutlinedInput-root": {
                                    height: "100%",
                                    borderRadius: "10px",
                                    backgroundColor: "white",
                                    // '& fieldset': {
                                    //     borderColor: '#8D8D8D',
                                    // },
                                    "&:hover fieldset": {
                                      borderColor: "#8D8D8D", // On hover
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#8D8D8D", // On focus
                                    },
                                  },

                                  "& label": {
                                    lineHeight: width > 768 ? "2em" : "1.5em",
                                  },
                                  "& label.Mui-focused": {
                                    color: true ? "#111" : "fff",
                                  },
                                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderRadius:
                                        width > 768 ? "10px" : "10px",
                                      border: "1px solid #707070",
                                    },
                                  "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      border: "1px solid #707070",
                                    },
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            </LocalizationProvider>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 row_contact_info_col contact_info_col-6">
                        <AutoCompleteField
                          lightTheme
                          key="product_material_contact_person"
                          textLabel="Purpose"
                          data={DummyData}
                          disablePortal
                        />
                      </div>
                    </div>

                    <button className="button_connect_book_now">
                      Book Now
                      <img
                        src={rightarrowwhite}
                        alt="icon"
                        className="book_now_arr"
                      />
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        <FooterV2 lightTheme />
      </main>
    </>
  );
};

export default BusinessConnect;
