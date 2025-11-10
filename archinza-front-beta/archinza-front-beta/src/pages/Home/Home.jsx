import React, { useEffect, useRef, useState } from "react";
import "./homepage.scss";
import {
  archinzaChatVideoNew,
  chatImg,
  dashedline,
  images,
  perkLeftArrow,
  perkRightArrow,
  rightArrowBlue,
  rightarrowwhite,
  shareBlackIcon,
  shareLinkedInIcon,
  shareWhatsappIcon,
} from "../../images";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Autoplay,
  EffectCoverflow,
  Navigation,
  EffectFade,
} from "swiper/modules";
import {
  bannerData,
  builtData,
  homeBmoAISteps,
  homeFaqData,
  noticeData,
  perksData,
  socialStatusIcons,
} from "../../components/Data/homeData";
import { useWindowSize } from "react-use";
import { CustomAccordion } from "../../components/Accordion/Accordion";
import { Link, useNavigate } from "react-router-dom";
import AutoplayVideo from "../../components/AutoplayVideo/AutoplayVideo";
import ReactTyped from "react-typed";
import FooterV2 from "../../components/FooterV2/FooterV2";
import {
  accountCategoryURL,
  businessFormFiveLTURL,
  dashboardURL,
} from "../../components/helpers/constant-words";
import ToastMsg from "../../components/ToastMsg/ToastMsg";
import { toast } from "react-toastify";
import config from "../../config/config";
import http from "../../helpers/http";
import TypingTextAnimation from "../../components/TypingTextAnimation/TypingTextAnimation";
import { useAuth } from "../../context/Auth/AuthState";

const messages = ["Hello, world!", "Welcome to my site.", "Enjoy your stay."];
const textsArray = ["Clients", "Architects", "Interior Designers"];

const Home = () => {
  const { width } = useWindowSize();
  const bannerSwiperRef = useRef(null);
  const typedRef = useRef([]);
  const auth = useAuth();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [randomFact, setRandomFact] = useState(null);
  const deadline = "Jun, 13, 2025 00:00:00";
  const videoSource = archinzaChatVideoNew;
  const posterImage = chatImg;
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [socialData, setSocialData] = useState({});
  const navigate = useNavigate();
  const base_url = config.api_url;
  const shareUrl = encodeURI(window.location.href);
  const date = new Date();
  const currentDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  // =============== DATA  ===========================

  const findDate = noticeData.find((date) => date.date === currentDate);

  const socialStatus = [
    {
      id: 1,
      count: socialData[0]?.consultants_registered,
      desc: "consultants registered!",
    },
    {
      id: 2,
      count: socialData[0]?.architects_trusting,
      desc: "architects and interior designers trust Archinza",
    },
    {
      id: 3,
      count: socialData[0]?.people_onboarding,
      desc: "people are onboarding now!",
    },
    {
      id: 4,
      count: socialData[0]?.businesses_registered,
      desc: "businesses registered",
    },
    {
      id: 5,
      count: `${socialData[0]?.people_signed_up}+`,
      desc: "people signed up!",
    },
  ];

  const fetchSocial = async () => {
    const { data } = await http.get(`${base_url}/stats`);

    if (data) {
      setSocialData(data);
    }
  };

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();
    if (time <= 0) {
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    } else {
      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedIndex = sessionStorage.getItem("noticeIndex");
    let newIndex = storedIndex ? parseInt(storedIndex) + 1 : 0;

    if (newIndex >= noticeData.length) {
      newIndex = 0;
    }

    sessionStorage.setItem("noticeIndex", newIndex);
    setRandomFact(noticeData[newIndex]);
  }, []);

  // useEffect(() => {
  //   if (auth.isLoggedIn() && auth.user) {
  //     if (auth.user.auth_type === "business") {
  //       navigate(businessFormFiveLTURL, { replace: true }); // or use businessFormFiveLTURL
  //     } else {
  //       navigate(dashboardURL, { replace: true });
  //     }
  //   }
  // }, [auth, navigate]);

  const perkList = perksData.map((data, i) => (
    <SwiperSlide key={`perk-${i}`}>
      <div className="perk_card" data-aos="fade-up" data-aos-delay={i * 100}>
        <div className="blank_box"></div>
        <img
          width={110}
          height={110}
          src={data.icon}
          alt="icon"
          className="perk_icon"
          // loading="lazy"
        />
        <h2 className="heading">{data.title}</h2>
        <p className="desc">{data.desc}</p>
      </div>
    </SwiperSlide>
  ));

  const joinUsList = builtData.map((data, i) => (
    <SwiperSlide key={`joinus-${i}`}>
      <div className="joinus_card" data-aos="fade-up" data-aos-delay={i * 100}>
        <h2 className="heading">{data.title}</h2>
        <div
          className="desc"
          dangerouslySetInnerHTML={{ __html: data.content }}
        ></div>
      </div>
    </SwiperSlide>
  ));

  const avatarList = socialStatus.map((data, i) => (
    <SwiperSlide key={`social-status-${i}`}>
      <span className="signup-count">{data.count}</span> {data.desc}
    </SwiperSlide>
  ));

  const handleProductTabChange = (event) => {
    const selectedIndex = event.target.selectedIndex;
    setSelectedCategory(selectedIndex);
  };

  const handleCopyUrl = async (e) => {
    e.preventDefault();
    try {
      const currentUrl = window.location.href;

      // Fallback method for older browsers
      if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();

        try {
          document.execCommand("copy");
          toast(
            <ToastMsg message={`URL copied to clipboard`} />,
            config.success_toast_config
          );
        } catch (err) {
          console.error("Unable to copy", err);
          toast(
            <ToastMsg message={`Failed to copy URL`} />,
            config.error_toast_config
          );
        }

        document.body.removeChild(textArea);
        return;
      }

      // Modern Clipboard API method
      await navigator.clipboard.writeText(currentUrl);
      toast(
        <ToastMsg message={`URL copied to clipboard`} />,
        config.success_toast_config
      );
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast(
        <ToastMsg message={`Failed to copy URL`} />,
        config.error_toast_config
      );
    }
  };

  const handleWhatsAppClick = () => {
    const message = "Hi";
    const phoneNumber = "919871185558";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  const shareOnWhatsApp = () => {
    // const shareTitle = encodeURIComponent("Archinza");
    // const shareText = encodeURIComponent(
    //   "Archinza matches you with the right people and products in the industry—effortlessly"
    // );
    // const shareEncodedUrl = encodeURIComponent(shareUrl);
    // const message = encodeURIComponent(
    //   `${shareTitle}\n\n${shareText}\n\n${shareEncodedUrl}`
    // );
    const message = `*Archinza*%0AArchinza matches you with the right people and products in the industry effortlessly%0A%0A🔗 Check it out here:%0A${shareUrl}`;

    window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=Archinza&summary=Archinza Post Test 1`,
      "_blank"
    );
  };

  useEffect(() => {
    if (bannerSwiperRef.current) {
      bannerSwiperRef.current.swiper.on("slideChange", () => {
        if (typedRef.current) {
          typedRef.current[
            bannerSwiperRef.current.swiper.realIndex
          ].typed.reset();
        }
      });
    }
  }, [bannerSwiperRef]);

  useEffect(() => {
    fetchSocial();
  }, []);

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
          <section>
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

            <p className="banner-tagline">
              Ask <span className="orange_text">Archinza</span> to{" "}
              <span className="orange_text">Design & Build</span> <br /> Search
              & Reach; PEOPLE & PRODUCTS
            </p>
          </section>

          <div className="banner_slider" data-aos="fade">
            <div className="banner_wrap">
              <h2 className="banner_title banner_title7">
                <span className="block animating_text_wrapper">
                  <span>Get found by </span>{" "}
                  <span className="typing_text_wrap">
                    <TypingTextAnimation texts={textsArray} />
                  </span>
                </span>{" "}
                {/* <span className="block">Get found by</span>{" "} */}
                {/* <ReactTyped
                  strings={["Clients", "Architects", "Interior Designers"]}
                  typeSpeed={80}
                  backSpeed={90}
                  loop={true}
                  style={{ color: "#EF7B13" }}
                /> */}
                <p>
                  searching for you with Archinza AI
                  <sup className="sup">TM</sup>
                </p>
              </h2>
            </div>
          </div>
          <div className="cta_wrapper">
            <Link className="solid_cta" to={accountCategoryURL}>
              <div className="text">
                Get Early Access - <span className="linethrough">₹5999</span>{" "}
                FREE
              </div>
            </Link>
          </div>
          <div className="launch_container" data-aos="fade-up">
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

      <section className="home_sec2">
        <div className="my_container">
          <h2 className="title" data-aos="fade-up">
            Here's what you can do
          </h2>
          <p className="description" data-aos="fade-up">
            Archinza, your personal AI-powered design assistant simplifies
            Search & Reach within the Design & Build industry
          </p>
          <div className="perks_container">
            <Swiper
              modules={[Autoplay, EffectCoverflow, Navigation]}
              spaceBetween={10}
              slidesPerView={4}
              autoplay={true}
              navigation={{
                nextEl: ".perk_right_arrow",
                prevEl: ".perk_left_arrow",
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 5,
                  loop: false,
                  autoplay: {
                    disableOnInteraction: false,
                    delay: 2000,
                  },
                },
                600: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                  loop: false,
                },
                992: {
                  slidesPerView: 4,
                  spaceBetween: 62,
                },
              }}
            >
              {perkList}
            </Swiper>
            {width <= 991 && (
              <div className="perk_arrows">
                <img
                  src={perkLeftArrow}
                  alt="left arrow"
                  className="perk_left_arrow"
                />
                <img
                  src={perkRightArrow}
                  alt="left arrow"
                  className="perk_right_arrow"
                />
              </div>
            )}
          </div>
          <div className="cta_wrapper" data-aos="fade-up">
            <Link className="solid_cta" to={accountCategoryURL}>
              <div className="text">
                Get Early Access - <span className="linethrough">₹5999</span>{" "}
                FREE
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* <section className="home_sec3">
        <div className="my_container">
          <div className="row question_mbrow">
            <div className="col-lg-8 question_col">
              <div className={width < 992 && "row question_mbrow"}>
                <div className={width < 992 && "col-7 p-0"}>
                  <div className="text_container" data-aos="fade-up">
                    <h2 className="title">Built for all stakeholders</h2>
                    <p className="desc">
                      <span className="orange_text">No commissions |</span>{" "}
                      Equal Access <span className="orange_text"> |</span>{" "}
                      Reliable Reach
                    </p>
                  </div>
                </div>
                <div className={width < 992 && "col-5 p-0 question_col2"}>
                  {width < 992 && (
                    <img
                      width={553}
                      height={654}
                      src={images.mannequeenImg.image}
                      alt={images.mannequeenImg.alt}
                      className="mannequeen_model"
                      loading="lazy"
                      data-aos="fade-up"
                    />
                  )}
                </div>
              </div>
              <div className="question_container">
                <div data-aos="fade-up">
                  <CustomAccordion
                    firstActive={false}
                    borderLeft={true}
                    items={builtData}
                  />
                </div>
                <div className="cta_wrapper" data-aos="fade-up">
                  <Link className="common_cta" to={accountCategoryURL}>
                    <div className="text">Get Early Access</div>
                    <img
                      src={rightarrowwhite}
                      alt="icon"
                      className="icon"
                      loading="lazy"
                    />
                  </Link>
                </div>
              </div>
            </div>
            {width > 992 && (
              <div className="col-lg-4 question_col question_col2">
                <img
                  width={553}
                  height={654}
                  src={images.mannequeenImg.image}
                  alt={images.mannequeenImg.alt}
                  className="mannequeen_model"
                  loading="lazy"
                  data-aos="fade-up"
                />
              </div>
            )}
          </div>
        </div>
      </section> */}

      <section className="home_sec3">
        <div className="my_container">
          <div className="joinus_wrapper">
            <h2 className="title" data-aos="fade-up">
              Why join us?
            </h2>
            <div className="joinus_container">
              {width > 600 ? (
                <Swiper
                  modules={[Autoplay, EffectCoverflow]}
                  spaceBetween={80}
                  slidesPerView={3}
                  autoplay={true}
                  // effect={width < 600 && "coverflow"}
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                      spaceBetween: -20,
                      loop: true,
                      autoplay: {
                        disableOnInteraction: false,
                        delay: 2000,
                      },
                    },
                    600: {
                      slidesPerView: 2,
                      spaceBetween: 40,
                      loop: false,
                    },
                    992: {
                      slidesPerView: 3,
                      spaceBetween: 60,
                    },
                    1600: {
                      slidesPerView: 3,
                      spaceBetween: 80,
                    },
                  }}
                >
                  {joinUsList}
                </Swiper>
              ) : (
                <>
                  <div className="joinus_select">
                    <p className="select_text">I'm a</p>
                    <select
                      className={`category-button`}
                      onChange={handleProductTabChange}
                    >
                      {builtData.map((category, i) => (
                        <option value={category.title} key={i}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="joinus_card">
                    <h2 className="heading">
                      {builtData[selectedCategory].title}
                    </h2>
                    <div
                      className="desc"
                      dangerouslySetInnerHTML={{
                        __html: builtData[selectedCategory].content,
                      }}
                    ></div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div
            className="cta_wrapper d-flex justify-content-center"
            data-aos="fade-up"
          >
            <Link className="solid_cta" to={accountCategoryURL}>
              <div className="text">
                Get Early Access - <span className="linethrough">₹5999</span>{" "}
                FREE
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="home_sec4">
        <div className="my_container">
          <div className="row">
            <div className="col-lg-6">
              <div className="text_container" data-aos="fade-up">
                <h2 className="title">
                  Frequently asked <br />
                  questions
                </h2>
                <p className="desc">Answers to most common Questions</p>
                <div className="cta_wrapper" data-aos="fade-up">
                  <Link className="solid_cta" to={accountCategoryURL}>
                    <div className="text">
                      Get Early Access -{" "}
                      <span className="linethrough">₹5999</span> FREE
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div data-aos="fade-up" data-aos-delay="100">
                <CustomAccordion items={homeFaqData} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home_sec5">
        <div className="my_container">
          <div className="row video_row">
            <div className="col-md-6 order-md-2">
              <div className="text_container" data-aos="fade-up">
                <h2 className="title">Your AI led design assistant</h2>
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
                          <img src={item.icon} alt="icon" className="ai-img" />
                        </div>
                        <div>
                          <p className="ai-title">{item.title}</p>
                          <p className="ai-subtitle">{item.desc}</p>
                        </div>
                      </div>
                    ))}{" "}
                  </>
                ) : (
                  <p className="desc">Chat, Ask and Get Answers!</p>
                )}
                <div className="cta_wrapper" data-aos="fade-up">
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
              <div className="archinza_chat_video" data-aos="fade-up">
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

      <section className="home_sec6">
        <div className="my_container">
          <div className="notice_container">
            <h2 className="heading">Did you know?</h2>
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              speed={500}
              // loop={true}
              modules={[Pagination, Autoplay]}
              // autoplay={{
              //   delay: 3000,
              //   disableOnInteraction: false,
              // }}
            >
              {/* {noticeData.map((notice) => (
                <SwiperSlide key={`desktop-${notice.id}`}>
                  <div className="notice_card">
                    <p className="desc">{notice.desc}</p>
                  </div>
                </SwiperSlide>
              ))} */}
              {randomFact && (
                <SwiperSlide>
                  {/* {findDate.map((notice) => ( */}
                  <div className="notice_card">
                    <p className="desc">{randomFact.desc}</p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="home_sec7">
        <div className="my_container">
          <div className="share_wrapper">
            <h2 className="title">
              <span>Love Archinza?</span> Share it with your friends!
            </h2>
            <p className="desc">
              Invite your network to experience the simplicity and efficiency of
              AI-based matchmaking.
            </p>
            <h3 className="sub_title">
              <span className="orange">SHARE ARCHINZA NOW</span> and MAKE A
              DIFFERENCE!
            </h3>
            <div className="social_wrapper">
              <button onClick={shareOnWhatsApp} className="social_link">
                <img
                  src={shareWhatsappIcon}
                  alt="whatsapp"
                  className="social_icon"
                />
              </button>
              <button onClick={shareOnLinkedIn} className="social_link">
                {/* <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="social_link"
              > */}
                <img
                  src={shareLinkedInIcon}
                  alt="LinkedIn"
                  className="social_icon"
                />
              </button>
              {/* </a> */}
              <a href="#" className="social_link" onClick={handleCopyUrl}>
                <img src={shareBlackIcon} alt="share" className="social_icon" />
              </a>
            </div>

            <div className="start_wrapper">
              <h2 className="title">Get Started for Free</h2>
              <p className="desc">
                Archinza matches you with the right people and products in the
                industry—effortlessly.
              </p>
              <h3 className="sub_title">
                WHY WAIT? <span className="orange">TRY ARCHINZA NOW!</span>
              </h3>
              <div className="cta_wrapper">
                <Link className="solid_cta" to={accountCategoryURL}>
                  <div className="text">
                    Get Early Access -{" "}
                    <span className="linethrough">₹5999</span> FREE
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterV2 bgColor="#000000" />
    </>
  );
};

export default Home;
