import { useEffect, useRef, useState } from "react";
import "./app.scss";
import HeroSection from "./app/Hero";
import MobileHeroSection from "./app/MobileHeroSection";
import WhosItFor from "./app/WhosItFor";
import WebOffering from "./app/Offerings";
import GetStarted from "./app/GetStarted";
import FAQ from "./app/FAQ";
import FoundingUserCard from "./app/foundingUserCard";
import ShareSection from "./app/ShareSection";
import Bot from "./app/Bot_offering";
import FooterV2 from "../components/FooterV2/FooterV2";
import { homeBmoAISteps, socialStatusIcons } from "../components/Data/homeData";
import AutoplayVideo from "../components/AutoplayVideo/AutoplayVideo";
import {
  rightArrowBlue,
  chatImg,
  archinzaChatVideoNew,
  images,
} from "../images";
import { Link } from "react-router-dom";
import { useWindowSize } from "react-use";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Autoplay,
  EffectCoverflow,
  Navigation,
  EffectFade,
} from "swiper/modules";
import http from "../helpers/http";
import config from "../config/config";
import PromotePopup from "../components/PromotePopup/PromotePopup";
import useTheme from "../components/useTheme/useTheme";

const App = () => {
  const { width } = useWindowSize();
  const [socialData, setSocialData] = useState({});
  const { theme } = useTheme();
  const base_url = config.api_url;
  const videoSource = archinzaChatVideoNew;
  const posterImage = chatImg;
  // const [days, setDays] = useState(0);
  // const [hours, setHours] = useState(0);
  // const [minutes, setMinutes] = useState(0);
  // const [seconds, setSeconds] = useState(0);
  // const deadline = "October, 07, 2025 00:00:00";
  const [isPromotePopupModal, setIsPromotePopupModal] = useState(false);
  const handleShow = () => setIsPromotePopupModal(true);
  const handleHide = () => setIsPromotePopupModal(false);

  const handleWhatsAppClick = () => {
    const message = "Hi";
    const phoneNumber = "919871185558";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  const socialStatus = [
    {
      id: 1,
      count: socialData[0]?.architects_trusting,
      desc: "Architects & Interior Designers trust Archinza.",
    },
    {
      id: 2,
      count: socialData[0]?.businesses_registered,
      desc: "Businesses Registered!",
    },
     {
      id: 3,
      count: `${socialData[0]?.people_signed_up}`,
      desc: "Personal Users Signed up.",
    },
     {
      id: 4,
      count: socialData[0]?.people_onboarding,
      desc: "Product & Material Vendors joined.",
    },
    {
      id: 5,
      count: socialData[0]?.consultants_registered,
      desc: "MEP Consultants just Onboarded!",
    },
  ];

  const avatarList = socialStatus.map((data, i) => (
    <SwiperSlide
      key={`social-status-${i}`}
      className={`${theme === "dark" ? "text-white" : ""}`}
    >
      <span className="signup-count">{data.count}</span> {data.desc}
    </SwiperSlide>
  ));

  const fetchSocial = async () => {
    const { data } = await http.get(`${base_url}/stats`);

    if (data) {
      setSocialData(data);
      console.log(data);
    }
  };

  useEffect(() => {
    fetchSocial();
  }, []);

  // const getTime = () => {
  //   const time = Date.parse(deadline) - Date.now();
  //   if (time <= 0) {
  //     setDays(0);
  //     setHours(0);
  //     setMinutes(0);
  //     setSeconds(0);
  //   } else {
  //     setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
  //     setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
  //     setMinutes(Math.floor((time / 1000 / 60) % 60));
  //     setSeconds(Math.floor((time / 1000) % 60));
  //   }
  // };

  // useEffect(() => {
  //   const interval = setInterval(() => getTime(deadline), 1000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main
        className={`app_main  ${
          theme === "dark" ? "dark_mode--theme-styles" : ""
        }`}
      >
        <section
          className={`social_count_sec ${
            theme === "dark" ? "dark_mode--theme-styles" : ""
          }`}
        >
          <div className="my_container">
            <div>
              <div className="multi-avatar">
                <div className="avatar-group">
                  {socialStatusIcons.slice(0, 4).map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className="avatar"
                    />
                  ))}
                </div>
                <p className="signup-text">
                  {/* <span className="signup-count">{1599}</span> architects and
                        interior designer trust Archinza */}
                  <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={50}
                    loop={true}
                    // speed={1000}
                    slidesPerView={1}
                    // pagination={width < 768 ? true : false}
                    speed={2000}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    breakpoints={{
                      0: {
                        spaceBetween: 10,
                      },
                      601: {
                        spaceBetween: 50,
                      },
                    }}
                  >
                    {avatarList}
                  </Swiper>
                </p>
              </div>
            </div>

            {/* <div className="launch_container" data-aos="fade-up">
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
            </div> */}
          </div>
        </section>

        <div className="desktop_hero d-none d-md-block">
          <HeroSection />
        </div>

        <div className="mobile_hero d-block d-md-none">
          <MobileHeroSection />
        </div>

        <WhosItFor
        // openPopup={handleShow}
        />
        <WebOffering
        // openPopup={handleShow}
        />

        {/* <Bot /> */}
        {/* <=============== Bot section start ===============> */}
        <section className="bot_sec">
          <div className="my_container">
            <div className="row video_row">
              <div className="col-md-6 order-md-2">
                <div className="text_container">
                  <h2 className="title">Your AI-led design assistant</h2>
                  {/* <p className="desc">
                          Redesigning <br />
                          the business of design
                        </p> */}
                  {width > 786 ? (
                    <>
                      {homeBmoAISteps.map((item, i) => (
                        <div
                          className={`ai-step ai-step-${i}`}
                          key={`home-AIStep-${i}`}
                        >
                          <div className="img_wrapper">
                            <img
                              src={item.icon}
                              alt="icon"
                              className="ai-img"
                            />
                          </div>
                          <div>
                            <p className="ai-title">{item.title}</p>
                            <p className="ai-subtitle">{item.desc}</p>
                          </div>
                        </div>
                      ))}{" "}
                    </>
                  ) : (
                    <p className="desc">
                      Chat to Ask & Search <br />& get Answers instantly
                    </p>
                  )}
                  <div className="cta_wrapper">
                    <Link className="common_cta" onClick={handleWhatsAppClick}>
                      <div className="text">Chat Now!</div>
                      <img
                        src={rightArrowBlue}
                        alt="icon"
                        className="icon"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-6 order-md-1">
                <div className="archinza_chat_video">
                  <AutoplayVideo
                    className="video_box"
                    videoSource={videoSource}
                    fallbackImg={posterImage}
                    width="100%"
                    height="50.188em"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <=============== Bot section end ===============> */}

        <GetStarted />
        <FAQ />

        <section id="Found">
          <FoundingUserCard
          // openPopup={handleShow}
          />
        </section>

        <ShareSection
        // openPopup={handleShow}
        />
        <PromotePopup
          show={isPromotePopupModal}
          onHide={() => setIsPromotePopupModal(false)}
          handleClose={handleHide}
          title="Under Construction"
          desc="Coming Soon to help you design & build!"
        />
      </main>
      {theme === "dark" ? <FooterV2 /> : <FooterV2 lightTheme />}
    </>
  );
};

export default App;
