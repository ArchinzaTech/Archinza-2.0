import React, { useEffect, useState } from "react";
import "./homepage.scss";
import { consoleBackground_1, images, rightarrowwhite } from "../../images";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { bannerArr } from "../../components/Data/homeData";
import { useWindowSize } from "react-use";

const Homepage = () => {
  const { width } = useWindowSize();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const deadline = "August, 30, 2024 00:00:00";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();
    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);

  const bannerList = bannerArr.map((data, i) => (
    <React.Fragment key={i}>
      <SwiperSlide>
        <div className="banner_wrap">
          <h2
            className="banner_title"
            dangerouslySetInnerHTML={{ __html: data.title }}
          />
          <p className="banner_desc">{data.desc}</p>
          <div className="cta_wrapper">
            <div className="common_cta">
              <div className="text">{data.ctaText}</div>
              <img
                src={rightarrowwhite}
                alt="icon"
                className="icon"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </SwiperSlide>
    </React.Fragment>
  ));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="home_sec1">
        <img
          src={images.homeBg.image}
          alt={images.homeBg.alt}
          className="home_background"
        />
        <div className="my_container">
          <div className="banner_slider">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              pagination={true}
              autoplay={true}
              speed={1500}
              loop={true}
            >
              {bannerList}
            </Swiper>
          </div>
          <div className="launch_container">
            <p className="title">Launching in</p>
            <div className="clock_wrapper">
              <div className="clock_content">
                <p className="clock_number">
                  {days >= 0 ? (days < 10 ? "0" + days : days) : "00"}
                </p>
                <p className="clock_text">Days</p>
              </div>
              <div className="clock_dots">:</div>
              <div className="clock_content">
                <p className="clock_number">
                  {hours >= 0 ? (hours < 10 ? "0" + hours : hours) : "00"}
                </p>
                <p className="clock_text">Hours</p>
              </div>
              <div className="clock_dots">:</div>
              <div className="clock_content">
                <p className="clock_number">
                  {minutes >= 0
                    ? minutes < 10
                      ? "0" + minutes
                      : minutes
                    : "00"}
                </p>
                <p className="clock_text">Minutes</p>
              </div>
              <div className="clock_dots">:</div>
              <div className="clock_content">
                <p className="clock_number">
                  {seconds >= 0
                    ? seconds < 10
                      ? "0" + seconds
                      : seconds
                    : "00"}
                </p>
                <p className="clock_text">Seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
