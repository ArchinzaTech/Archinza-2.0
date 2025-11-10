import React, { useEffect, useState } from "react";
import "./reviews.scss";
import { Link } from "react-router-dom";
import { Box, Rating, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { editIconBlue, writeIcon } from "../../../../images";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useWindowSize } from "react-use";

const Reviews = ({ isSubtabActive, reviewData, ctaText, editIcon }) => {
  const { width } = useWindowSize();
  const [isMarginLeft, setIsMarginLeft] = useState();

  const adjustMargins = () => {
    const windowsize = window.innerWidth;
    // const secwidth = document.querySelector(".my_container").offsetWidth;
    let secwidth;
    if (window.matchMedia("(max-width: 834px)").matches) {
      secwidth = 708.46;
    } else if (window.matchMedia("(max-width: 1194px)").matches) {
      secwidth = 1014.27;
    } else if (window.matchMedia("(max-width: 1280px)").matches) {
      secwidth = 1087.33;
    } else if (window.matchMedia("(max-width: 1366px)").matches) {
      secwidth = 1160.38;
    } else if (window.matchMedia("(max-width: 1440px)").matches) {
      secwidth = 1223.25;
    } else if (window.matchMedia("(max-width: 1536px)").matches) {
      secwidth = 1354.8;
    } else if (window.matchMedia("(max-width: 1919px)").matches) {
      secwidth = 1504.8;
    } else if (window.matchMedia("(max-width: 1920px)").matches) {
      secwidth = 1670;
    } else if (window.matchMedia("(min-width: 1921px)").matches) {
      secwidth = 1921;
    } else if (window.matchMedia("(min-width: 2560px)").matches) {
      secwidth = 2174.7;
    } else {
      secwidth = document.querySelector(".my_container")?.offsetWidth || 0; // Fallback to actual width
    }
    const calcwidth = windowsize - secwidth;

    if (calcwidth > 0) {
      setIsMarginLeft(calcwidth / 2);
    } else {
      setIsMarginLeft(0);
    }
  };

  useEffect(() => {
    adjustMargins();
    // Adjust margins when window resizes
    const handleResize = () => adjustMargins();
    window.addEventListener("resize", handleResize);
    // Adjust margins on window load
    window.addEventListener("load", handleResize);
    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", adjustMargins);
    };
  }, []);

  return (
    <>
      <div className={`review_container`}>
        <div className="my_container">
          <div className="cta_container">
            <h2 className="title">Reviews</h2>
            <div className="cta_wrapper">
           {editIcon && <img src={editIconBlue} alt="edit icon" className="edit_icon" />}   
              <Link to={() => false} className="bedit_common_cta">
               {ctaText}
              </Link>
            </div>
          </div>
          <div className="cta_container_2">
            <div className="average_review">
              <h2 className="rating_numb">4.0</h2>
              <Box sx={{ "& > legend": { mt: 0 } }}>
                <Rating
                  name="half-rating"
                  defaultValue={4}
                  max={5}
                  className="star_icon"
                  style={{ color: "#EF7B13" }}
                  emptyIcon={
                    <StarIcon style={{ color: "#E4E4E4" }} fontSize="inherit" />
                  }
                  readOnly
                />
                <Typography component="legend" className="star_label">
                  Based on {"<VAL>"} Reviews
                </Typography>
              </Box>
            </div>
            {width > 767 && (
              <div className="cta_wrapper mng_cta_wrapper">
                <Link to={() => false} className="solid_cta">
                  <img src={writeIcon} alt="write" className="write_icon" />
                  Manage Reviews
                </Link>
              </div>
            )}
          </div>
        </div>

        {width > 767 ? (
          <div
            className="my_container full_container"
            style={{ marginLeft: `${isMarginLeft}px` }}
          >
            <div className="review_slider_wrapper">
              <Swiper
                slidesPerView={3.45}
                spaceBetween={28}
                // loopFillGroupWithBlank={true}
                // freeMode={true}
                watchSlidesProgress={true}
                allowTouchMove={false}
                loop={true}
                // loopAdditionalSlides={reviewData?.length * 3}
                // loopAddBlankSlides={10}
                // loop={data?.ratingData?.length !== 0 ? true : false}
                modules={[Autoplay]}
                speed={4000}
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                  reverseDirection: false,
                }}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  },
                  600: {
                    slidesPerView: 1.5,
                    spaceBetween: 10,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  992: {
                    slidesPerView: 2.8,
                    spaceBetween: 16,
                  },
                  1280: {
                    slidesPerView: 3.2,
                    spaceBetween: 20,
                  },
                  1440: {
                    slidesPerView: 3.45,
                    spaceBetween: 28,
                  },
                }}
              >
                {reviewData?.map((item, i) => (
                  <SwiperSlide key={i}>
                    <div className="review_box">
                      <div className="review_wrapper" key={`rating_list-${i}`}>
                        <img
                          src={item?.thumb}
                          alt={item?.name}
                          className="thumb"
                        />
                        <div className="rating_wrapper">
                          <h3 className="rater_name">{item?.name}</h3>
                          <Box
                            sx={{ "& > legend": { mt: 0 } }}
                            className="rating_box"
                          >
                            <Rating
                              name="half-rating"
                              defaultValue={4}
                              max={5}
                              className="star_icon"
                              style={{ color: "#EF7B13" }}
                              emptyIcon={
                                <StarIcon
                                  style={{
                                    color: "#E4E4E4",
                                    stroke: "#1111114C",
                                    strokeWidth: 0.25,
                                  }}
                                  fontSize="inherit"
                                />
                              }
                              //   readOnly
                            />
                            <Typography
                              component="legend"
                              className="star_label"
                            >
                              {`${item?.rating}.0`}
                            </Typography>
                          </Box>
                        </div>
                      </div>
                      <p className="rating_desc">{item?.desc}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ) : (
          <div className="my_container">
            {reviewData?.map((item, i) => (
              <div className="review_box" key={i}>
                <div className="review_wrapper" key={`rating_list-${i}`}>
                  <img src={item?.thumb} alt={item?.name} className="thumb" />
                  <div className="rating_wrapper">
                    <h3 className="rater_name">{item?.name}</h3>
                    <Box
                      sx={{ "& > legend": { mt: 0 } }}
                      className="rating_box"
                    >
                      <Rating
                        name="half-rating"
                        defaultValue={4}
                        max={5}
                        className="star_icon"
                        style={{ color: "#EF7B13" }}
                        emptyIcon={
                          <StarIcon
                            style={{
                              color: "#E4E4E4",
                              stroke: "#1111114C",
                              strokeWidth: 0.25,
                            }}
                            fontSize="inherit"
                          />
                        }
                        //   readOnly
                      />
                      <Typography component="legend" className="star_label">
                        {`${item?.rating}.0`}
                      </Typography>
                    </Box>
                  </div>
                </div>
                <p className="rating_desc">{item?.desc}</p>
              </div>
            ))}
          </div>
        )}
        {width <= 767 && (
          <div className="my_container">
            <div className="cta_wrapper mng_cta_wrapper">
              <Link to={() => false} className="solid_cta">
                Manage Reviews
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Reviews;
