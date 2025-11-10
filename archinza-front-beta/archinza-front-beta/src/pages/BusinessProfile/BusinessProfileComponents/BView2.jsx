import React, { useEffect, useRef, useState } from "react";
import "./BView.scss";
import {
  bEdit_background,
  bookmark_black,
  ConnectIcon,
  CopyLinkCircleOrange,
  draftRedIcon,
  editicon,
  editIconBlue,
  employeesBlack,
  employeesOrange,
  establishedOrange,
  faceBookCircleOrange,
  heartBlack,
  heartOutline,
  linkedInLinkCircleOrange,
  locationOrange,
  msgIcon,
  shareBlackInside,
  suitCase_black,
  verifiedBlueIcon,
  whatsappCircleOrange,
  XCircleOrange,
} from "../../../images";
import { Link, Navigate, useParams } from "react-router-dom";
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
import VerticalAccodianView from "../BEditComponent/VerticalAccordianView/VerticalAccodianView";
import GalleryPopupV2 from "./BusinessViewPopups/GalleryPopupV2/GalleryPopupV2";
import {
  businessConnectViwUrl,
  businessProfileViewURL2,
} from "../../../components/helpers/constant-words";
import { Events, Link as ScrollLink } from "react-scroll";
import { useWindowSize } from "react-use";
import config from "../../../config/config";
import http from "../../../helpers/http";
import helper from "../../../helpers/helper";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";
import BusinessConnectEdit from "./BusinessConnectEditPage/BusinessConnectEdit";
import SocialMediaLinksPopup from "./PopUpComponents/SocialMediaLinksPopup/SocialMediaLinksPopup";
import MsonarySlider from "../BEditComponent/MsonarySlider/MsonarySlider";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import { useAuth } from "../../../context/Auth/AuthState";
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

const BView2 = () => {
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

  const { username } = useParams();
  const { width } = useWindowSize();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(0);
  const [isSubtabActive, setIsSubtabActive] = useState(0);
  const [workflowQuestions, setWorkFlowQuestions] = useState();
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [isWhereWePopup, setIsWhereWePopup] = useState(false);
  const [isLocationPopup, setIsLocationPopup] = useState(false);
  const [isGalleryPopupV2, setIsGalleryPopupV2] = useState(false);
  const headerRef = useRef(null);
  const stickyTabsRef = useRef(null);
  const menuRef = useRef(null);
  const containerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [stickyTabsHeight, setStickyTabsHeight] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isClickScrolling = useRef(false);
  const auth = useAuth();
  // const { width } = useWindowSize();
  // const [isActive, setIsActive] = useState(0);
  // const [isSubtabActive, setIsSubtabActive] = useState(0);
  // const headerRef = useRef(null); // Ref for header section
  // const [headerHeight, setHeaderHeight] = useState(0); // State for header height
  // const [workflowQuestions, setWorkFlowQuestions] = useState();

  // const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  // const menuRef = useRef(null);
  // const [isHovered, setIsHovered] = useState(false);
  // const [active, setActive] = useState("section-bedit-01");
  // const [stickyTabsHeight, setStickyTabsHeight] = useState(0);
  // const stickyTabsRef = useRef(null);
  // const { username } = useParams();

  useEffect(() => {
    const fetchWorkflowQuestions = async () => {
      const questionsData = await http.get(
        `${config.api_url}/business/business-questions`
      );
      setWorkFlowQuestions(questionsData.data);
    };

    fetchWorkflowQuestions();
  }, []);

  // Calculate header and sticky tabs height dynamically
  useEffect(() => {
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      const height = rect.height; // This gives fractional pixels
      setHeaderHeight(height);
    }
    if (stickyTabsRef.current) {
      const rect = stickyTabsRef.current.getBoundingClientRect();
      const height = rect.height;
      setStickyTabsHeight(height);
    }
  }, [width, profileData?.business_name, profileData?.brand_logo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsHovered(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    Events.scrollEvent.register("end", () => {
      const anyActive = document.querySelector(".mobile_sticky_tabs .active");
      if (!anyActive) {
        setIsActive("section-bedit-01");
      }
    });

    return () => {
      Events.scrollEvent.remove("end");
    };
  }, []);

  useEffect(() => {
    const slider = containerRef.current;
    if (!slider) return;
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await http.get(
          `${config.api_url}/business/profile/${username}`
        );
        // console.log(response?.data?._id, data);
        if (response?.data?._id == auth?.user?._id) {
          if (
            response?.data?.status === "completed" &&
            !response?.data?.isDeleted
          ) {
            setProfileData(response?.data);
          } else {
            setError({ message: "No User Found" });
            return;
          }
        } else {
          if (
            response?.data?.status === "completed" &&
            response?.data?.pageStatus === "online" &&
            !response?.data?.isDeleted
          ) {
            setProfileData(response?.data);
          } else {
            setError({ message: "No User Found" });
            return;
          }
        }
        // if (!response.data) throw new Error("Profile not found");
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <Navigate to="/404" replace />;
  if (!profileData) return <div>No profile data found</div>;

  const truncateText = (arr, maxLength = 35) => {
    if (!arr || arr.length === 0) return "";
    const joinedText = arr.join(", ");
    return joinedText.length > maxLength
      ? `${joinedText.slice(0, maxLength)}...`
      : joinedText;
  };

  const shouldRenderField = (fieldKey) => {
    if (!workflowQuestions || !profileData?.business_types) {
      return false;
    }

    const question = workflowQuestions.find((q) => q.question === fieldKey);
    if (!question) {
      return false;
    }

    const userBusinessTypeIds = profileData.business_types.map((bt) => bt._id);
    const questionBusinessTypeIds = question.business_types.map((bt) => bt._id);

    return userBusinessTypeIds.some((id) =>
      questionBusinessTypeIds.includes(id)
    );
  };

  const scrollingTextData = [
    shouldRenderField("location_preference") &&
      profileData?.project_location?.data &&
      `Can do Projects : <span>${
        profileData?.project_location?.data || ""
      }</span>`,
    shouldRenderField("renovation_work") &&
      profileData?.renovation_work &&
      `Renovation Work : <span>${profileData?.renovation_work || ""}</span>`,
    // shouldRenderField("average_budget") &&
    //   profileData?.avg_project_budget?.budgets &&
    //   profileData?.avg_project_budget?.budgets?.length > 0 &&
    //   `Approx Budget of Projects : ${truncateText(
    //     profileData?.avg_project_budget?.budgets?.map(
    //       (budget) => `<span>${budget}</span> `
    //     )
    //   )}`,
    // shouldRenderField("current_minimal_fee") &&
    //   profileData?.project_mimimal_fee?.fee &&
    //   profileData?.project_mimimal_fee?.fee !== "" &&
    //   `Current Min. Project Fee : <span>${
    //     profileData?.project_mimimal_fee?.fee || ""
    //   }</span>`,
    shouldRenderField("minimum_project_size") &&
      profileData?.project_sizes?.sizes &&
      profileData?.project_sizes?.sizes?.length > 0 &&
      `Min. Project Size : ${truncateText(
        profileData?.project_sizes?.sizes?.map(
          (size) => `<span>${size} ${profileData?.project_sizes?.unit}</span> `
        )
      )}`,
    shouldRenderField("project_typology") &&
      profileData?.project_typology?.data?.length &&
      `Project Typology : <span>${truncateText(
        profileData?.project_typology?.data || ""
      )}</span>`,
    shouldRenderField("service_design_style") &&
      profileData?.design_style?.data?.length &&
      `Design Style : <span>${truncateText(
        profileData?.design_style?.data || ""
      )}</span>`,
  ].filter(Boolean);

  // const [isWhereWePopup, setIsWhereWePopup] = useState(false);
  const handleShow = () => setIsWhereWePopup(true);
  const handleHide = () => setIsWhereWePopup(false);
  const handleOptionsPopupOpen = () => setShowOptionsPopup(true);
  const handleOptionsPopupClose = () => setShowOptionsPopup(false);
  // const sectionRefs = useRef([]);
  // const isClickScrolling = useRef(false);
  // const [isLocationPopup, setIsLocationPopup] = useState(false);
  const handleShowLocation = () => setIsLocationPopup(true);
  const handleHideLocation = () => setIsLocationPopup(false);

  // const [isGalleryPopupV2, setIsGalleryPopupV2] = useState(false);
  const handleShowGalleryPopupV2 = () => setIsGalleryPopupV2(true);
  const handleHideGalleryPopupV2 = () => setIsGalleryPopupV2(false);

  // const swiperRef = useRef(null);
  const scrollingText = scrollingTextData.map((item, i) => (
    <SwiperSlide key={i}>
      <p
        className="scrolling_text"
        dangerouslySetInnerHTML={{ __html: item }}
      ></p>
    </SwiperSlide>
  ));

  // const updateCompanyProfileData = (newData) => {
  //   update(newData);
  // };

  // Handle tab click with scroll and prevent observer interference
  const handleTabSelect = (index) => {
    setIsSubtabActive(index);
    if (width <= 992) {
      const section = document.getElementById(`section-bedit-${index}`);
      if (section) {
        isClickScrolling.current = true; // Mark as click-initiated scroll
        section.scrollIntoView({ behavior: "smooth" });
        // Reset isClickScrolling after scroll animation completes
        setTimeout(() => {
          isClickScrolling.current = false;
        }, 1000); // Match scroll animation duration
      }
    }
  };

  // const containerRef = useRef(null);

  const sendVerificationRequest = async () => {
    if (emptyFields.length === 0) {
      await http.post(`${config.api_url}/business/get-verified`, {
        user: profileData._id,
        status: "pending",
      });

      // setVerificationStatus("Pending Verification");
    }
  };

  const { nonEmptyCount, emptyFields } = fieldsToCheck.reduce(
    (acc, field) => {
      const value = profileData?.[field];

      if (field === "google_location") {
        // Check if google_location has both latitude and longitude as non-empty strings
        if (
          value &&
          typeof value === "object" &&
          value.latitude?.trim() &&
          value.longitude?.trim()
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

  const shareUrl =
    // window.location.host + `/business/profile/${profileData?.username}`;
    window.location.host + `/business/profile/${profileData?.username}`;
  const shareTitle =
    profileData?.business_name || "Check out this business profile!";

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
      {width <= 992 && (
        <MsonarySlider
          isSliderEdit={false}
          onClick={() => {}}
          onImageReplace={""}
          data={profileData}
        />
      )}
      <WhereWePopup
        show={isWhereWePopup}
        onHide={() => setIsWhereWePopup(false)}
        handleClose={handleHide}
        data={profileData}
        workflowQuestions={workflowQuestions}
      />

      <GalleryPopupV2
        show={isGalleryPopupV2}
        onHide={() => setIsGalleryPopupV2(false)}
        handleClose={handleHideGalleryPopupV2}
        // data={data}
      />

      <LocationPopupView
        show={isLocationPopup}
        onHide={() => setIsLocationPopup(false)}
        handleClose={handleHideLocation}
        data={profileData}
      />
      <main className="bedit_main business_view_main--page">
        <section className="bedit_bg">
          <img
            src={bEdit_background}
            alt="background"
            className="bg_image_bedit"
          />
        </section>

        {/* <section className="bedit_sec0 bedit_sec1">
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
        </section> */}

        <section
          className="bedit_sec0 bedit_sec1 bdt_1_sect"
          ref={headerRef}
          style={{
            zIndex: "1",
          }}
        >
          <div className="heading_container wrap_fm_strip">
            <div className="my_container d-flex">
              <div className="head_container flex-grow-1">
                <h1
                  className="title firm_name_title position-relative"
                  // onClick={handleShowPendingVerificationPopup}
                >
                  <div
                    className="FirmName_image_wrapper firm_nm_strip"
                    style={{
                      backgroundColor: profileData?.brand_logo && "transparent",
                    }}
                  >
                    {profileData?.brand_logo ? (
                      <img
                        src={`${config.aws_object_url}business/${profileData?.brand_logo}`}
                        alt="Firm-image"
                        className="firm_image_edit"
                      />
                    ) : (
                      helper.generateInitials(profileData?.business_name)
                    )}
                  </div>

                  {profileData?.business_name?.toUpperCase()}
                  {profileData?.isVerified && (
                    <img
                      src={verifiedBlueIcon}
                      alt="verified icon"
                      className="verified_icon_top_header"
                    />
                  )}
                </h1>

                <div className="social_icon_container">
                  <>
                    {/* <Link
                      to={() => false}
                      className="social_icon_wrapper"
                      // onClick={handleEditFirmNamePopupOpen}
                    >
                      <img
                        src={editicon}
                        alt="Edit icon"
                        className="heart_icon"
                      />
                    </Link> */}

                    <Link
                      to={() => false}
                      className="social_icon_wrapper position-relative"
                      ref={menuRef}
                      onClick={
                        width <= 768
                          ? handleOptionsPopupOpen
                          : () => setIsHovered(!isHovered)
                      }
                    >
                      <img
                        src={shareBlackInside}
                        alt="share icon"
                        className="share_icon"
                      />

                      <div
                        className={`hover-menu hover-menu-share ${
                          isHovered ? "show" : "hide"
                        }`}
                      >
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            shareTitle + " " + shareUrl
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="share_top_header_menu_item"
                          onClick={() => {
                            window.open(
                              `https://api.whatsapp.com/send?text=${encodeURIComponent(
                                shareTitle + " " + shareUrl
                              )}`
                            );
                          }}
                        >
                          <img
                            src={whatsappCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />
                          WhatsApp
                        </a>

                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                            shareUrl
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            window.open(
                              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                shareUrl
                              )}`
                            );
                          }}
                          className="share_top_header_menu_item"
                        >
                          <img
                            src={linkedInLinkCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />{" "}
                          LinkedIn
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            shareTitle
                          )}&url=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            window.open(
                              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                shareTitle
                              )}&url=${encodeURIComponent(shareUrl)}`
                            );
                          }}
                          className="share_top_header_menu_item"
                        >
                          <img
                            src={XCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />{" "}
                          X
                        </a>

                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            shareUrl
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            window.open(
                              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                shareUrl
                              )}`
                            );
                          }}
                          className="share_top_header_menu_item"
                        >
                          <img
                            src={faceBookCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />{" "}
                          Facebook
                        </a>
                        <div
                          onClick={() => {
                            if (navigator.clipboard && window.isSecureContext) {
                              navigator.clipboard
                                .writeText(shareUrl)
                                .then(() => {
                                  toast(
                                    <ToastMsg message="Link copied to clipboard" />,
                                    config.success_toast_config
                                  );
                                });
                            } else {
                              const textArea =
                                document.createElement("textarea");
                              textArea.value = shareUrl;
                              textArea.style.position = "fixed";
                              textArea.style.left = "-999999px";
                              document.body.appendChild(textArea);
                              textArea.focus();
                              textArea.select();
                              document.execCommand("copy");
                              textArea.remove();

                              toast(
                                <ToastMsg message="Link copied to clipboard" />,
                                config.success_toast_config
                              );
                            }
                          }}
                          className="share_top_header_menu_item border-0"
                        >
                          <img
                            src={CopyLinkCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />{" "}
                          Copy Link
                        </div>
                      </div>
                    </Link>
                  </>
                </div>
              </div>
            </div>
          </div>
        </section>
        {width <= 992 && (
          <div
            className="mobile_sticky_tabs my_container"
            ref={stickyTabsRef}
            style={{ top: `${headerHeight}px` }}
          >
            <ScrollLink
              to={"section-bedit-01"}
              spy={true}
              smooth={true}
              duration={300}
              activeClass={"active"}
              onSetActive={() => setIsActive("section-bedit-01")}
              className={isActive === "section-bedit-01" ? "active" : ""}
              offset={
                width <= 992 && width > 800
                  ? -160
                  : width <= 800 && width > 767
                  ? -160
                  : width <= 767 && width > 576
                  ? -120
                  : width <= 576
                  ? -120
                  : -120
              }
            >
              About
            </ScrollLink>
            <ScrollLink
              to={"section-bedit-22"}
              spy={true}
              smooth={true}
              duration={300}
              activeClass={"active"}
              onSetActive={() => setIsActive("section-bedit-22")}
              className={isActive === "section-bedit-22" ? "active" : ""}
              offset={
                width <= 992 && width > 800
                  ? -145
                  : width <= 800 && width > 767
                  ? -145
                  : width <= 767 && width > 576
                  ? -120
                  : width <= 576
                  ? -120
                  : -120
              }
            >
              Gallery
            </ScrollLink>
            <ScrollLink
              to={"section-bedit-03"}
              spy={true}
              smooth={true}
              duration={300}
              activeClass={"active"}
              onSetActive={() => setIsActive("section-bedit-03")}
              className={isActive === "section-bedit-03" ? "active" : ""}
              offset={
                width <= 992 && width > 800
                  ? -155
                  : width <= 800 && width > 767
                  ? -155
                  : width <= 767 && width > 576
                  ? -130
                  : width <= 576
                  ? -127
                  : -127
              }
            >
              PDFs
            </ScrollLink>
            <ScrollLink
              to={"section-bedit-04"}
              spy={true}
              smooth={true}
              duration={300}
              activeClass={"active"}
              onSetActive={() => setIsActive("section-bedit-04")}
              className={isActive === "section-bedit-04" ? "active" : ""}
              offset={
                width <= 992 && width > 800
                  ? -135
                  : width <= 800 && width > 767
                  ? -130
                  : width <= 767 && width > 576
                  ? -110
                  : width <= 576
                  ? -120
                  : -120
              }
            >
              Contact
            </ScrollLink>
          </div>
        )}
        <section
          className={`bEdit_grid_wrapper ${
            width < 767 ? "mobile-fix-view" : ""
          }`}
        >
          <div className="my_container">
            <div className="row">
              <div className="col-lg-5 col_left_bEdit_section b_view_left--wrapper">
                <section className="bedit_sect01 bedit_sec1">
                  <div className="my_container p-0">
                    {/* <div className="status_container">
                      <div className="profile_wrapper">
                        <Link
                          to={businessConnectViwUrl}
                          className="profile_status verified_status bView_connect_link"
                        >
                    
                          <img
                            src={ConnectIcon}
                            alt="verified"
                            className="verified_icon"
                          />
                          <p className={`status_text `}>Contact Info</p>
                 
                        </Link>
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
                    </div> */}

                    {/* {data?.addresses?.length > 0 && (
                      <div className="select_field_container">
                        <img
                          src={locationOrange}
                          alt="location"
                          className="location_icon"
                        />
                        <p className="select_title">
                          {data?.addresses?.[0]?.type} :
                        </p>
                        &nbsp;
                        <div
                          className="select_field"
                          onClick={handleShowLocation}
                        >
                          {data?.addresses?.[0]?.address}
                        </div>
                      </div>
                    )} */}

                    {/* <div className="rating_container" ref={containerRef}>
                      <div className="rating_status">
                        <img
                          src={bookmark_black}
                          alt="save"
                          className="save_icon"
                        />
                        <p className={`rating_text `}>152 Saves</p>
                      </div>

                      {data?.establishment_year?.data && (
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
                      )}

                      {data?.team_range?.data && (
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
                      )}

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
                    </div> */}

                    {/* <div className="scroll_text_container">
                      <div className="wraper_scroling_txt">
                        <div className="heading_scroll">Where We Excel</div>
                       
                        <Swiper
                          direction={"vertical"}
                          className="scroll_text_slider"
                          effect="slide"
                          loop={true}
                          modules={[Autoplay]}
                          observer={true}
                          observeParents={true}
                          onSwiper={(swiper)=>{ swiperRef.current = swiper; }}
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
                        className="bedit_common_cta position-absolute"
                        style={{
                          right: "0",
                        }}
                        onClick={handleShow}
                      >
                       
                        View More
                      </Link>
                    </div> */}

                    {/* <OverView isActive={0} isSubtabActive={0} 
                    ctaText = {"View More"}
                    editIcon = {false} /> */}
                    <div id="section-bedit-3" name="section-bedit-01">
                      <OverViewBpreview
                        isActive={0}
                        isSubtabActive={0}
                        ctaText={"View More"}
                        editIcon={false}
                        overviewData={profileData}
                        // globalData={GlobalContextData}
                        // isOnline={isOnline}
                        scrollingText={scrollingText}
                        scrollingTextData={scrollingTextData}
                        handleShowLocation={handleShowLocation}
                        // workflowQuestions={workflowQuestions}
                        // handleGeneralInfoPopupOpen={handleGeneralInfoPopupOpen}
                        handleShow={handleShow}
                        containerRef={containerRef}
                        imageAssets={{
                          locationOrange,
                          editIconBlue,
                          bookmark_black,
                          suitCase_black,
                          employeesBlack,
                        }}
                        workflowQuestions={workflowQuestions}
                      />
                    </div>
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
                          onClick={() => {
                            handleTabSelect(i);
                            setIsSubtabActive(i);
                            document
                              .getElementById(`section-bedit-${i}`)
                              ?.scrollIntoView({
                                behavior: "smooth",
                              });
                          }}
                          // onClick={() => setIsSubtabActive(i)}
                          key={`sub-tab-${i}`}
                        >
                          {item.tabName}
                        </p>
                      ))}
                      {/* </div> */}
                    </div>
                  </div>
                  {/* For Desktop: Conditional rendering based on active tab */}
                  {width > 992 && (
                    <>
                      {isSubtabActive === 0 && (
                        <VerticalAccodianView
                          isActive={isActive}
                          isSubtabActive={isSubtabActive}
                          galleryData={profileData}
                          editIcon={false}
                        />
                      )}
                      {isSubtabActive === 1 && (
                        <CompanyProfile
                          isActive={isActive}
                          isSubtabActive={isSubtabActive}
                          companyProfileData={profileData}
                          editIcon={false}
                        />
                      )}
                      {isSubtabActive === 2 && profileData && (
                        <div className="connect_edit_bs_wrapper">
                          <BusinessConnectEdit isEditable={false} />
                        </div>
                      )}
                    </>
                  )}

                  {/* For Mobile: All sections always rendered */}
                  {width <= 992 && (
                    <>
                      {/* Gallery Section */}
                      <div
                        id="section-bedit-22"
                        name="section-bedit-22"
                        className="mobile-section"
                      >
                        <VerticalAccodianView
                          isActive={isActive}
                          isSubtabActive={0}
                          galleryData={profileData}
                          editIcon={false}
                        />
                      </div>

                      {/* PDFs Section */}
                      <div
                        id="section-bedit-03"
                        name="section-bedit-03"
                        className="mobile-section"
                      >
                        <CompanyProfile
                          isActive={isActive}
                          isSubtabActive={1}
                          companyProfileData={profileData}
                          editIcon={false}
                          // updateCompanyProfileData={updateCompanyProfileData}
                        />
                      </div>

                      {/* Contact Section */}
                      <div
                        id="section-bedit-04"
                        name="section-bedit-04"
                        className="mobile-section"
                      >
                        {profileData && (
                          <div className="connect_edit_bs_wrapper">
                            <BusinessConnectEdit
                              isEditable={false}
                              data={profileData}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </section>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="bEdit_section_3">
          <Reviews
            reviewData={ratingData}
            ctaText={"View All"}
            editIcon={false}
          />
        </section> */}
        <FooterV2 lightTheme />
      </main>
    </>
  );
};

export default BView2;
