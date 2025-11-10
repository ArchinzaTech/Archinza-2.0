import React, { useEffect, useRef, useState } from "react";
import "./overViewBPreview.scss";
import { BeditOverviewData } from "../../../../components/Data/bEditData";
import RadioButton from "../../../../components/RadioButton/RadioButton";
import {
  bookmark_black,
  editIconBlue,
  employeesBlack,
  locationOrange,
  orangeRightTick,
  suitCase_black,
  sustainableLeafIcon,
} from "../../../../images";
import { Link } from "react-router-dom";
import AboutPopupView from "../../BusinessProfileComponents/BusinessViewPopups/AboutPopupView/AboutPopupView";
import { Rating } from "@mui/material";
import { Swiper } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useWindowSize } from "react-use";

const OverView = ({
  isActive,
  isSubtabActive,
  ctaText,
  editIcon,
  overviewData,
  handleShowLocation,
  containerRef,
  scrollingText,
  handleShow,
  workflowQuestions,
}) => {
  const [isAboutPopup, setIsAboutPopup] = useState(false);
  const swiperRef = useRef(null);
  const { width } = useWindowSize();
  const handleShowAbout = () => setIsAboutPopup(true);
  const handleHideAbout = () => setIsAboutPopup(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const handleToggleAbout = () => setIsAboutExpanded(!isAboutExpanded);
  const [isExcelExpanded, setIsExcelExpanded] = useState(false);
  const handleToggleExcelExpanded = () => setIsExcelExpanded(!isExcelExpanded);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);

  const [isProductServExpanded, setIsProductServExpanded] = useState(false);
  const handleToggleProductServ = () =>
    setIsProductServExpanded(!isProductServExpanded);

  const handleToggleLocationExpanded = () =>
    setIsLocationExpanded(!isLocationExpanded);

  // Ref for focus_wrapper drag-to-scroll
  const focusWrapperRef = useRef(null);
  const shouldRenderField = (fieldKey) => {
    if (!workflowQuestions || !overviewData?.business_types) {
      return false;
    }

    const question = workflowQuestions.find((q) => q.question === fieldKey);
    if (!question) {
      return false;
    }

    const userBusinessTypeIds = overviewData.business_types.map((bt) => bt._id);
    const questionBusinessTypeIds = question.business_types.map((bt) => bt._id);

    return userBusinessTypeIds.some((id) =>
      questionBusinessTypeIds.includes(id)
    );
  };

  // Drag-to-scroll logic for focus_wrapper
  useEffect(() => {
    const slider = focusWrapperRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      slider.scrollLeft = scrollLeft - walk;
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        slider.scrollBy({ left: -100, behavior: "smooth" }); // Scroll left by 100px
      } else if (e.key === "ArrowRight") {
        slider.scrollBy({ left: 100, behavior: "smooth" }); // Scroll right by 100px
      }
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);
    slider.addEventListener("keydown", handleKeyDown);

    // Ensure slider is focusable for key events
    slider.tabIndex = 0;

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
      slider.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const overviewDataMapped = [
    {
      about: [
        {
          title: "About",
          ctaText: isAboutExpanded ? "View Less" : "View More",
          desc: [`${overviewData?.bio}`],
        },
      ],
      products: [
        {
          title: "Our Products/Services",
          radioField: overviewData?.featured_services,
        },
      ],
      focus: [
        {
          title: "Our Focus",
          ctaText: "Edit | View",
          focusData: overviewData?.product_positionings,
        },
      ],
    },
  ];
  return (
    <>
      <AboutPopupView
        show={isAboutPopup}
        onHide={() => setIsAboutPopup(false)}
        handleClose={handleHideAbout}
        data={overviewData}
      />
      <div
        className="profile_overview_container profile__overview--container
"
      >
        <div className="my_container p-0">
          <div className={`overview_container `}>
            {/* {BeditProfileData[isActive]?.subTab?.map( */}
            {overviewDataMapped.map(
              (data, index) =>
                data?.about && (
                  <div
                    className={`data_container ${
                      isSubtabActive === index ? "active" : ""
                    }`}
                    key={index}
                  >
                    {overviewData.bio &&
                      data?.about?.map((about, i) => (
                        <div className={`about_container`} key={`about-${i}`}>
                          <div className="text_container">
                            <div className="cta_container">
                              <h2 className="title">{about.title}</h2>
                              <div
                                className="cta_wrapper p-0"
                                // onClick={handleShowAbout}
                                onClick={
                                  width > 992
                                    ? handleToggleAbout
                                    : handleShowAbout
                                }
                              >
                                {editIcon && (
                                  <img
                                    src={editIconBlue}
                                    alt="edit icon"
                                    className="edit_icon"
                                  />
                                )}
                                <Link
                                  to={() => false}
                                  className="bedit_common_cta"
                                >
                                  {about.ctaText}
                                </Link>
                              </div>
                            </div>
                            {about?.desc?.map((item, i) => (
                              <p
                                className={`desc ${
                                  isAboutExpanded ? "expanded_container" : ""
                                }`}
                                dangerouslySetInnerHTML={{ __html: item }}
                                key={i}
                              ></p>
                            ))}
                          </div>
                        </div>
                      ))}

                    <div className="scroll_text_container">
                      <div className="wraper_scroling_txt">
                        {width > 992 && (
                          <div
                            className="title"
                            // onClick={handleShow}
                          >
                            Where We Excel
                          </div>
                        )}
                        {!isExcelExpanded ? (
                          <Swiper
                            direction={"vertical"}
                            className="scroll_text_slider"
                            effect="slide"
                            loop={true}
                            modules={[Autoplay]}
                            observer={true}
                            observeParents={true}
                            onSwiper={(swiper) => {
                              swiperRef.current = swiper;
                            }}
                            speed={1500}
                            autoplay={{
                              delay: 1000,
                              disableOnInteraction: false,
                            }}
                          >
                            {scrollingText}
                          </Swiper>
                        ) : (
                          <ul className="common_ul_popups">
                            {shouldRenderField("location_preference") &&
                              overviewData?.project_location?.data && (
                                <li className="common_li_popup">
                                  <div className="wrp_ov_text">
                                    Can do Projects :
                                  </div>
                                  <span className="bold_common_li_popup">
                                    {overviewData.project_location.data}
                                  </span>
                                </li>
                              )}

                            {shouldRenderField("renovation_work") &&
                              overviewData?.renovation_work && (
                                <li className="common_li_popup">
                                  <div className="wrp_ov_text">
                                    Renovation Work :
                                  </div>
                                  <span className="bold_common_li_popup">
                                    {overviewData.renovation_work}
                                  </span>
                                </li>
                              )}

                            {/* {shouldRenderField("average_budget") &&
                              overviewData?.avg_project_budget?.budgets
                                ?.length > 0 && (
                                <li className="common_li_popup">
                                  <div className="wrp_ov_text">
                                    Approx Budget of Projects :
                                  </div>
                                  <span className="bold_common_li_popup">
                                    {overviewData.avg_project_budget.budgets.join(
                                      ", "
                                    )}
                                  </span>
                                </li>
                              )} */}

                            {/* {shouldRenderField("current_minimal_fee") &&
                              overviewData?.project_mimimal_fee?.fee && (
                                <li className="common_li_popup">
                                  <div className="wrp_ov_text">
                                    Current Min. Project Fee :
                                  </div>
                                  <span className="bold_common_li_popup">
                                    {overviewData.project_mimimal_fee.fee}
                                  </span>
                                </li>
                              )} */}

                            {shouldRenderField("minimum_project_size") &&
                              overviewData?.project_sizes?.sizes?.length >
                                0 && (
                                <li className="common_li_popup">
                                  <div className="wrp_ov_text">
                                    {" "}
                                    Min. Project Size :
                                  </div>{" "}
                                  <span className="bold_common_li_popup">
                                    {overviewData.project_sizes.sizes
                                      .map(
                                        (size) =>
                                          `${size} ${overviewData?.project_sizes?.unit}`
                                      )
                                      .join(", ")}
                                  </span>
                                </li>
                              )}

                            {shouldRenderField("project_typology") &&
                              overviewData?.project_typology?.data?.length >
                                0 && (
                                <li className="common_li_popup common_multi_line_list">
                                  Project Typology :
                                  <div className="pills_common_li_popup mt-3">
                                    {overviewData.project_typology.data.map(
                                      (it, idx) => (
                                        <div
                                          key={idx}
                                          className="pill_span_li pill_style--project-typology"
                                        >
                                          {it}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </li>
                              )}

                            {shouldRenderField("service_design_style") &&
                              overviewData?.design_style?.data?.length > 0 && (
                                <>
                                  <li className="common_li_popup common_multi_line_list extra_mb">
                                    Design Style :
                                  </li>
                                  <div className="pills_common_li_popup">
                                    {overviewData.design_style.data.map(
                                      (it, idx) => (
                                        <div key={idx} className="pill_span_li">
                                          {it}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </>
                              )}
                          </ul>
                        )}
                      </div>
                      {width > 992 && (
                        <div
                          className="bedit_common_cta position-absolute"
                          style={{
                            right: "0",
                            cursor: "pointer",
                          }}
                          onClick={handleToggleExcelExpanded}
                          // onClick={handleShow}
                        >
                          {isExcelExpanded ? "View Less" : "View More"}
                        </div>
                      )}
                    </div>

                    {overviewData.services &&
                      data?.products?.map((product, i) => (
                        <div
                          className="product_container prd_cont_serv"
                          key={`product-${i}`}
                        >
                          <div className="wrapper_title_cta_overView">
                            {width > 992 && (
                              <h2 className="sub_title">{product.title}</h2>
                            )}

                            {/* show this View All when About is not available */}
                            {/* {!overviewData.bio && ( */}
                            {width > 992 && (
                              <div
                                className="cta_wrapper"
                                onClick={handleToggleProductServ}
                              >
                                <div
                                  style={{
                                    cursor: "pointer",
                                    marginTop: "-0.2em",
                                  }}
                                  className="bedit_common_cta"
                                >
                                  {isProductServExpanded
                                    ? "View Less"
                                    : "View More"}
                                </div>
                              </div>
                            )}

                            {/* )} */}
                          </div>
                          <ul className="list_wrapper ul_wr_radio">
                            {product?.radioField
                              ?.slice(0, isProductServExpanded ? undefined : 3)
                              .map((radio, index) => (
                                <RadioButton
                                  label={radio}
                                  labelId={`radio-${index}`}
                                  lightTheme
                                  className={"test"}
                                  key={`radio-${index}`}
                                  disabled={true}
                                ></RadioButton>
                              ))}
                          </ul>
                        </div>
                      ))}

                    {/* {overviewData?.addresses?.length > 0 && (
                      <div className="select_field_container">
                        <img
                          src={locationOrange}
                          alt="location"
                          className="location_icon"
                        />
                        <div className="wrp_st_loc_bview">
                          <p className="select_title">
                            {overviewData?.addresses?.[0]?.type} :
                          </p>
                        
                          <div
                            className="select_field"
                            onClick={handleShowLocation}
                          >
                            {overviewData?.addresses?.[0]?.address}
                          </div>
                        </div>
                        <div
                          className="bedit_common_cta position-absolute"
                          style={{
                            right: "0",
                            cursor: "pointer",
                          }}
                          onClick={handleToggleLocationExpanded}
                        >
                          {isLocationExpanded ? "View Less" : "View More"}
                        </div>
                      </div>
                    )} */}

                    {overviewData?.addresses?.length > 0 && (
                      <div className="select_field_container">
                        {width > 992 && (
                          <h2 class="sub_title heding_loc_bview">Locations</h2>
                        )}
                        {(isLocationExpanded
                          ? overviewData?.addresses
                          : overviewData?.addresses?.slice(0, 1)
                        )?.map((address, index) => (
                          <div key={index} className="wrp_st_loc_bview_item">
                            <div className="wrp_st_loc_bview">
                              <p className="select_title">
                                {" "}
                                <img
                                  src={locationOrange}
                                  alt="location"
                                  className="location_icon"
                                />
                                {address?.type} :
                              </p>
                              <div
                                className="select_field"
                                // onClick={handleShowLocation}
                              >
                                {address?.address}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* View More / View Less CTA */}
                        {width > 992 && overviewData?.addresses?.length > 1 && (
                          <div
                            className="bedit_common_cta position-absolute"
                            style={{ right: "0", cursor: "pointer" }}
                            onClick={handleToggleLocationExpanded}
                          >
                            {isLocationExpanded ? "View Less" : "View More"}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="rating_container" ref={containerRef}>
                      {/* <div className="rating_status">
                        <img
                          src={bookmark_black}
                          alt="save"
                          className="save_icon"
                        />
                        <p className={`rating_text `}>152 Saves</p>
                      </div> */}

                      {overviewData?.establishment_year?.data && (
                        <div className="rating_status">
                          <img
                            src={suitCase_black}
                            alt="verified"
                            className="estab_icon"
                          />
                          <p className={`rating_text `}>
                            Estb. {overviewData?.establishment_year?.data}
                          </p>
                        </div>
                      )}

                      {overviewData?.team_range?.data && (
                        <div className="rating_status">
                          <img
                            src={employeesBlack}
                            alt="verified"
                            className="emp_icon"
                          />
                          <p className={`rating_text `}>
                            {overviewData?.team_range?.data} Employees
                          </p>
                        </div>
                      )}

                      {/* <div className="rating_status">
                        <Rating
                          name="half-rating"
                          defaultValue={1}
                          max={1}
                          readOnly
                          className="star_icon"
                          style={{ color: "#111111" }}
                        />
                        <p className={`rating_text `}>4.5 (2065)</p>
                      </div> */}
                    </div>

                    {overviewData.product_positionings?.length > 0 &&
                      data?.focus?.map((data, i) => (
                        <div className="focus_container" key={`focus-${i}`}>
                          <div className="cta_container">
                            <h2 className="title">{data.title}</h2>
                            <div className="cta_wrapper">
                              {editIcon && (
                                <img
                                  src={editIconBlue}
                                  alt="edit icon"
                                  className="edit_icon"
                                />
                              )}
                              {ctaText === "Edit | View" ? (
                                <Link
                                  to={() => false}
                                  className="bedit_common_cta"
                                >
                                  {ctaText}
                                </Link>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="focus_wrapper" ref={focusWrapperRef}>
                            {data?.focusData?.map((item, index) => (
                              <div className="focus_box" key={index}>
                                {item !== "Sustainable" ? (
                                  <img
                                    src={orangeRightTick}
                                    alt="right tick"
                                    className="focus_img"
                                  />
                                ) : (
                                  <img
                                    src={sustainableLeafIcon}
                                    alt="right tick"
                                    className="focus_img"
                                  />
                                )}

                                <p className="focus_title">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OverView;
