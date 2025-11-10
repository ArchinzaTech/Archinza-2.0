import React, { useEffect, useRef, useState } from "react";
import "./overView.scss";
import {
  BeditOverviewData,
  BeditProfileData,
} from "../../../../components/Data/bEditData";
import RadioButton from "../../../../components/RadioButton/RadioButton";
import {
  editIconBlue,
  orangeRightTick,
  sustainableLeafIcon,
} from "../../../../images";
import { Link } from "react-router-dom";
import AboutPopUp from "../../BusinessProfileComponents/PopUpComponents/AboutPopUp/AboutPopUp";
import OurFocus from "../../BusinessProfileComponents/PopUpComponents/OurFocus/OurFocus";
import AboutPopupV2 from "../../BusinessProfileComponents/PopUpComponents/AboutPopupV2/AboutPopupV2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useWindowSize } from "react-use";
import helper from "../../../../helpers/helper";

const OverView2 = ({
  isActive,
  isSubtabActive,
  overviewData,
  globalData,
  isOnline,
  scrollingTextData,
  handleExcelPopupOpen,
  workflowQuestions,
  handleGeneralInfoPopupOpen,
  containerRef,
  imageAssets,
}) => {
  const [isAboutModal, setIsAboutModal] = useState(false);
  const [showOurFocusPopup, setShowOurFocusPopup] = useState(false);
  const swiperRef = useRef(null);
  const [modalType, setModalType] = useState("");
  const handleShow = () => setIsAboutModal(true);
  const handleHide = () => setIsAboutModal(false);
  const handleOurFocusPopupOpen = () => setShowOurFocusPopup(true);
  const handleOurFocusPopupClose = () => setShowOurFocusPopup(false);
  const { width } = useWindowSize();
  const containerRefOurFocus = useRef(null);

  const {
    locationOrange,
    editIconBlue,
    bookmark_black,
    suitCase_black,
    employeesBlack,
  } = imageAssets;

  // About section
  const handleAboutShow = () => {
    setModalType("about");
    setIsAboutModal(true);
  };

  // Products/Services
  const handleProductsShow = () => {
    setModalType("products");
    setIsAboutModal(true);
  };

  const handleHideModal = () => {
    setIsAboutModal(false);
    setModalType(""); // Modal close
  };

  // Drag-to-scroll logic for rating_container
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

    slider?.addEventListener("mousedown", handleMouseDown);
    slider?.addEventListener("mouseleave", handleMouseLeave);
    slider?.addEventListener("mouseup", handleMouseUp);
    slider?.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider?.removeEventListener("mousedown", handleMouseDown);
      slider?.removeEventListener("mouseleave", handleMouseLeave);
      slider?.removeEventListener("mouseup", handleMouseUp);
      slider?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [containerRef]);

  // Map scrollingTextData to SwiperSlides
  const scrollingText = scrollingTextData.map((item, i) => (
    <SwiperSlide key={i}>
      <p
        className="scrolling_text"
        dangerouslySetInnerHTML={{ __html: item }}
      ></p>
    </SwiperSlide>
  ));

  useEffect(() => {
    const slider = containerRefOurFocus.current;
    if (!isOnline || !slider) return;
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
  }, [isOnline]);

  const overviewDataMapped = [
    {
      about: [
        {
          title: "About",
          ctaText: "Edit | View",
          desc: [`${overviewData?.bio || ""}`],
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
          focusData: overviewData?.product_positionings || [],
        },
      ],
    },
  ];
  
  return (
    <>
      <div className="profile_overview_container">
        <div className="my_container p-0">
          <div className="overview_container">
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
                    {data?.about?.map((about, i) => (
                      <div className={`about_container`} key={`about-${i}`}>
                        <div className="text_container">
                          <div className="cta_container">
                            <h2 className="title">{about.title}</h2>
                            <div
                              className="cta_wrapper p-0"
                              onClick={handleAboutShow}
                            >
                              <img
                                src={editIconBlue}
                                alt="edit icon"
                                className="edit_icon"
                              />
                              <Link
                                to={() => false}
                                className="bedit_common_cta"
                              >
                                {about.ctaText}
                              </Link>
                            </div>
                          </div>
                          {about.desc[0] === "" && (
                            <p
                              className="desc mb-0"
                              key={i}
                              style={{
                                fontStyle: "italic",
                              }}
                            >
                              Write your professional bio here...
                            </p>
                          )}

                          {about?.desc?.map((item, i) => (
                            <p
                              className="desc"
                              dangerouslySetInnerHTML={{ __html: item }}
                              key={i}
                              style={{
                                opacity: !isOnline ? "0.2" : "1",
                              }}
                            ></p>
                          ))}
                        </div>
                      </div>
                    ))}
                    {/* Add the scroll_text_container section (Where We Excel) */}
                    <div className="scroll_text_container">
                      <div className="wraper_scroling_txt">
                        <div className="title">Where We Excel</div>
                        <Swiper
                          direction={"vertical"}
                          ref={swiperRef}
                          className="scroll_text_slider"
                          effect="slide"
                          loop={true}
                          modules={[Autoplay]}
                          allowTouchMove={true}
                          speed={1500}
                          autoplay={{
                            delay: 1500,
                            disableOnInteraction: false,
                          }}
                          // autoplay={
                          //   !isOnline
                          //     ? { delay: 1500, disableOnInteraction: false }
                          //     : false
                          // }
                          style={{
                            opacity: !isOnline ? "0.2" : "1",
                          }}
                        >
                          {scrollingText}
                        </Swiper>
                      </div>

                      <div onClick={handleExcelPopupOpen}>
                        <Link
                          to={() => false}
                          className="bedit_common_cta position-absolute cta_ed_wxl"
                          style={{ right: "0" }}
                        >
                          <img
                            src={editIconBlue}
                            alt="edit icon"
                            className="edit_ic"
                          />
                          Edit | View
                        </Link>
                      </div>
                    </div>
                    <div className="wrp_pr_serv_loc">
                      {data?.products?.map((product, i) => (
                        <div
                          className="product_container pr_cont_ov2"
                          key={`product-${i}`}
                        >
                          <div className="wrp_edt_cta_prd_serv">
                            <h2 className="sub_title">{product.title}</h2>
                            <div
                              className="cta_wrapper p-0 wrp_edt"
                              onClick={handleProductsShow}
                            >
                              <img
                                src={editIconBlue}
                                alt="edit icon"
                                className="edit_icon"
                              />
                              <Link
                                to={() => false}
                                className="bedit_common_cta"
                              >
                                Edit | View
                              </Link>
                            </div>
                          </div>
                          <ul
                            className="list_wrapper ul_wr_radio"
                            style={{
                              opacity: !isOnline ? "0.2" : "1",
                            }}
                          >
                            {product?.radioField?.map((radio, index) => (
                              <RadioButton
                                label={radio}
                                labelId={`radio-${index}`}
                                lightTheme
                                className={"test"}
                                key={`radio-${index}`}
                                disabled={true}
                                isOnline={isOnline}
                              ></RadioButton>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* Location */}
                      <div className="select_field_container">
                        {overviewData?.addresses?.length > 0 ? (
                          <>
                            <img
                              src={locationOrange}
                              alt="location"
                              className="location_icon"
                            />
                            <p className="select_title">
                              {overviewData.addresses[0]?.type} :
                            </p>
                            <div
                              className="select_field"
                              style={{ background: "none" }}
                            >
                              {/* <div>{overviewData.addresses[0]?.address}</div> */}
                              {/* {width > 767 ? (
                                <>
                                  {helper?.truncateName(
                                    overviewData.addresses[0]?.address,
                                    25
                                  )}
                                </>
                              ) : (
                                <>{overviewData.addresses[0]?.address}</>
                              )} */}

                              {helper?.truncateName(
                                overviewData.addresses[0]?.address,
                                25
                              )}
                            </div>
                          </>
                        ) : (
                          <>No Data</>
                        )}
                        <Link
                          to={() => false}
                          className="bedit_common_cta"
                          onClick={handleGeneralInfoPopupOpen}
                        >
                          <img
                            src={editIconBlue}
                            alt="edit icon"
                            className="edit_ic"
                          />
                          Edit | View
                        </Link>
                      </div>

                      <div className="rating_container" ref={containerRef}>
                        {/* <div className="rating_status">
                          <img
                            src={bookmark_black}
                            alt="save"
                            className="save_icon"
                          />
                          <p className="rating_text">500 Saves</p>
                        </div> */}
                        <div className="rating_status">
                          <img
                            src={suitCase_black}
                            alt="verified"
                            className="estab_icon"
                          />
                          <p className="rating_text">
                            Estb.{" "}
                            {overviewData?.establishment_year?.data ||
                              "Add Year of establishment"}
                          </p>
                        </div>
                        <div className="rating_status">
                          <img
                            src={employeesBlack}
                            alt="verified"
                            className="emp_icon"
                          />
                          <p className="rating_text">
                            {overviewData?.team_range?.data ||
                              "Add Number of Employees"}{" "}
                            Employees
                          </p>
                        </div>
                      </div>
                    </div>

                    {data?.focus?.map((data, i) => (
                      <div className="focus_container" key={`focus-${i}`}>
                        <div className="cta_container">
                          <h2 className="title">{data.title}</h2>
                          <div
                            className="cta_wrapper p-0"
                            onClick={handleOurFocusPopupOpen}
                          >
                            <img
                              src={editIconBlue}
                              alt="edit icon"
                              className="edit_icon"
                            />
                            <Link to={() => false} className="bedit_common_cta">
                              {data.ctaText}
                            </Link>
                          </div>
                        </div>
                        {data?.focusData?.length === 0 && (
                          <p
                            className="desc mb-0"
                            key={i}
                            style={{
                              fontStyle: "italic",
                            }}
                          >
                            Pick words that apply to your market positioning
                          </p>
                        )}
                        <div
                          className="focus_wrapper"
                          ref={isOnline ? containerRefOurFocus : null}
                        >
                          {data?.focusData?.map((item, index) => (
                            <div
                              className="focus_box"
                              key={index}
                              style={{
                                opacity: isOnline ? "1" : "0.2",
                              }}
                            >
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
      {/* <AboutPopUp
        show={isAboutModal}
        onHide={() => setIsAboutModal(false)}
        handleClose={handleHide}
        data={overviewData}
        globalData={globalData}
      /> */}
      <AboutPopupV2
        show={isAboutModal}
        onHide={() => setIsAboutModal(false)}
        handleClose={handleHide}
        data={overviewData}
        globalData={globalData}
        modalType={modalType}
      />
      <OurFocus
        show={showOurFocusPopup}
        handleClose={handleOurFocusPopupClose}
        data={overviewData}
      />
    </>
  );
};

export default OverView2;
