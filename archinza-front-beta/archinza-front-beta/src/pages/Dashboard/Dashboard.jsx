import React, { Fragment, useEffect, useRef, useState } from "react";
import "./dashboard.scss";
import {
  archinzaChatVideoNew,
  chatImg,
  dashedline,
  images,
  rightArrowBlue,
  rightarrowwhite,
} from "../../images";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import DashboardNoticeCard from "../../components/DashboardNoticeCard/DashboardNoticeCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import FooterV2 from "../../components/FooterV2/FooterV2";
import BlinkingDots from "../../Animations/BlinkingDots/BlinkingDots";
import RoleChangeModal from "../../components/RoleChangeCongrats/RoleChangeCongrats";
import UserState, { useAuth } from "../../context/Auth/AuthState";
import http from "../../helpers/http";
import config from "../../config/config";
import {
  accountCategoryURL,
  dashboardURL,
  loginURL,
  proAccessURL,
  registrationBusinessURL,
} from "../../components/helpers/constant-words";
import {
  bannerData,
  homeBmoAISteps,
  homeFaqData,
  noticeData,
  socialStatusIcons,
} from "../../components/Data/homeData";
import { bmoAISteps } from "../../components/Data/businessOwner";
import {
  BFOFAQData,
  DEFAQData,
  STFAQData,
  TMFAQData,
  busBenefitsData,
  businessData,
} from "../../components/Data/dashboardData";
import ReactTyped from "react-typed";
import AutoplayVideo from "../../components/AutoplayVideo/AutoplayVideo";
import { CustomAccordion } from "../../components/Accordion/Accordion";
import DashboardPerkCard from "../../components/DashboardPerkCard/DashboardPerkCard";
import BusinessBenefitsModal from "../../components/BusinessBenefitsModal/BusinessBenefitsModal";
import TypingTextAnimation from "../../components/TypingTextAnimation/TypingTextAnimation";
import RadioButton from "../../components/RadioButton/RadioButton";
import { toast } from "react-toastify";
import ToastMsg from "../../components/ToastMsg/ToastMsg";

const featuresData = {
  BO: [
    // "Instantly Connect on Demand within Industry ⚡️",
    // "Quick & Effortless Vendor Search 🔍",
    // "Hire for your Business/Firm 💼,
    // "HTaeget dfReachytuBClnsnt/🎯,
    "Get found by Clients looking for you",
    "Hire for your Business/ Firm",
    "Search for Products & Services by text/ image",
    "Showcase all that you do/ sell/ create",
    "Stay Updated about Design Events",
    "Instantly Connect On-Demand within the Industry",
  ],
  FL: [
    // "Instantly Connect on Demand within Industry ⚡️",
    // "Quick & Effortless Vendor Search 🔍",
    // "Hire for your Business/Firm 💼",
    // "Targeted Reach to Clients 🎯",
    "Get matchmade to Clients looking for you ",
    "Search for Products & Services by text/ image",
    "Showcase your work ",
    "Find collaborators",
    "Instantly Connect on Demand within the Industry",
  ],
  TM: [
    "Discover Industry-Specific Job Openings",
    "Upskill with Curated AI-Matched Courses & Resources",
    "Stay Updated about Design Events",
    "Search Smartly for Products/ Materials & Professionals",
    "Review and Rate Businesses in the Industry",
  ],
  ST: [
    "Discover Industry-Specific Job Openings",
    "Upskill with Curated Learning Resources",
    "Stay Updated about Design Events",
    "Search Smartly for Products/ Materials & Professionals",
  ],
};

const Dashboard = () => {
  // =============== VARIABLE & STATES  ===========================
  const { width } = useWindowSize();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const deadline = "Jun, 13, 2025 00:00:00";
  const [modalShow, setModalShow] = useState(false);
  const [randomFact, setRandomFact] = useState(null);
  const [businessBenefits, setBusinessBenefits] = useState(false);
  const [proEntry, setProEntry] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [updatedRoleData, setUpdatedRoleData] = useState({});
  const [userFAQ, setuserFAQ] = useState(homeFaqData);
  const [socialData, setSocialData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const base_url = config.api_url; // without trailing slash

  const navigationState = location.state || {};

  const { state } = useLocation();
  const count = bannerData.length;
  const intervalRef = useRef(null);

  // =============== DATA  ===========================
  const textsArray = ["Clients", "Architects", "Interior Designers"];

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

  // =============== FUNCTIONS  ===========================

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  const handleWhatsAppClick = () => {
    console.log("Clicked");
    const message = "Hi";
    const phoneNumber = "919871185558";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  // =============== HTML RENDERING  ===========================

  const BOFeatures = businessData.BO.proFeatures.map((data, i) => (
    <SwiperSlide id={`business-feature-${i}`}>
      <DashboardPerkCard icon={data.icon} desc={data.desc} />
    </SwiperSlide>
  ));

  const DEFeatures = businessData.DE.proFeatures.map((data, i) => (
    <SwiperSlide id={`de-feature-${i}`}>
      <DashboardPerkCard icon={data.icon} desc={data.desc} />
    </SwiperSlide>
  ));

  const STFeatures = businessData.ST.proFeatures.map((data, i) => (
    <SwiperSlide id={`st-feature-${i}`}>
      <DashboardPerkCard icon={data.icon} desc={data.desc} />
    </SwiperSlide>
  ));

  const TMFeatures = businessData.TM.proFeatures.map((data, i) => (
    <SwiperSlide id={`team-member-${i}`}>
      <DashboardPerkCard icon={data.icon} desc={data.desc} />
    </SwiperSlide>
  ));

  const avatarList = socialStatus.map((data, i) => (
    <SwiperSlide key={`social-status-${i}`}>
      <span className="signup-count">{data.count}</span> {data.desc}
    </SwiperSlide>
  ));

  // =============== DATA FETCHING  ===========================

  const fetchEntry = async (id, user_type) => {
    const { data } = await http.get(
      `${base_url}/pro-access/entries/${user_type}/${id}`
    );
    if (data) {
      setProEntry(data);
    }
    setLoading(false);
  };

  const fetchSocial = async () => {
    const { data } = await http.get(`${base_url}/stats`);

    if (data) {
      setSocialData(data);
    }
    setLoading(false);
  };

  const verifyUserToken = async () => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      const data = await http.get(`${base_url}/personal/verify-token/${token}`);
      if (data?.data?.token) {
        const token = data.data.token;
        await auth.login(token);
        if (data?.data?.user?.user_type === "DE") {
          navigate(dashboardURL, { replace: true });
        } else {
          //check the status
          if (data?.data?.user?.proAccessData?.status !== "completed") {
            navigate(proAccessURL, { replace: true });
          } else {
            navigate(dashboardURL, { replace: true });
          }
        }
      } else {
        navigate(loginURL);
      }
    }
  };

  // =============== SIDE EFFECTS  ===========================

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateIndex = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % count);
    };

    intervalRef.current = setInterval(updateIndex, 3500); // Cycle every 3.5 seconds

    return () => clearInterval(intervalRef.current);
  }, [count]);

  // useEffect(() => {
  //   if (navigationState) {
  //     console.log(navigationState.correspondingUserData);
  //   }
  // }, [location]);

  useEffect(() => {
    if (auth?.user) {
      const id = auth?.user?._id;
      const user_type = auth?.user?.user_type;
      Promise.all([fetchEntry(id, user_type), fetchSocial()]).finally(() => {
        setIsInitializing(false);
      });
      switch (user_type) {
        case "ST":
          setuserFAQ(STFAQData);
          break;
        case "TM":
          setuserFAQ(TMFAQData);
          break;
        case "BO":
          setuserFAQ(BFOFAQData);
          break;
        case "FL":
          setuserFAQ(BFOFAQData);
          break;
        case "DE":
          setuserFAQ(DEFAQData);
          break;

        default:
          setuserFAQ(homeFaqData);
          break;
      }
    } else {
      setIsInitializing(false);
    }
  }, [auth, state]);

  useEffect(() => {
    if (state?.isRoleUpdated) {
      setModalShow(true);
      setUpdatedRoleData(state);
    }
  }, [state]);

  useEffect(() => {
    verifyUserToken();
  }, [location]);

  useEffect(() => {
    const storedIndex = sessionStorage.getItem("noticeIndex");
    let newIndex = storedIndex ? parseInt(storedIndex) + 1 : 0;

    if (newIndex >= noticeData.length) {
      newIndex = 0;
    }

    sessionStorage.setItem("noticeIndex", newIndex);
    setRandomFact(noticeData[newIndex]);
  }, []);

  // Show toast after profile switch (only on navigation, not reload)
  useEffect(() => {
    if (state?.showSwitchToast && !isInitializing && auth?.user) {
      toast(
        <ToastMsg message={`Switched to ${state.switchedProfileName}`} />,
        config.success_toast_config
      );

      // Clear the state to prevent toast on refresh
      window.history.replaceState({}, "");
    }
  }, [state?.showSwitchToast, !isInitializing, auth?.user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isInitializing) {
    return;
  }

  return (
    <>
      <BlinkingDots />
      <main className="dashboard_container">
        <section className="dashboard_sec1" data-aos="fade">
          <div className="my_container">
            <div className="row dashboard_row">
              <div className="col-lg-8 dashboard_col">
                <ProfileCard
                  name={auth?.user?.name}
                  ctaTextColor={auth?.user?.userType?.color}
                  userType={auth?.user?.userType?.name}
                  contactNo={`+${auth?.user?.country_code} ${auth?.user?.phone}`}
                  emailId={auth?.user?.email}
                  address={`${auth?.user?.city}${auth?.user?.city && ", "}${
                    auth?.user?.country
                  }`}
                  isUserDE={auth?.user?.user_type === "DE" ? true : false}
                />
              </div>
              <div
                className="col-lg-4 dashboard_col notice_col"
                style={{ cursor: "default" }}
              >
                <h2 className="heading">Did you know?</h2>
                <Swiper
                  spaceBetween={20}
                  speed={500}
                  loop
                  modules={[Pagination, Autoplay]}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                >
                  {randomFact && (
                    <Fragment>
                      <SwiperSlide key={`desktop-${randomFact.id}`}>
                        <DashboardNoticeCard
                          // title={notice.heading}
                          notice={randomFact.desc}
                        />
                      </SwiperSlide>
                    </Fragment>
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard_sec2" data-aos="fade-up">
          <div className="my_container">
            {auth?.user?.user_type === "DE" && (
              <>
                <h2 className="title">
                  Welcome aboard
                  <span className="orange_text"> Archinza!</span>
                </h2>
                <h4 className="subtitle">
                  Enjoy these features with Archinza!
                </h4>
                <div className="perks_container de_perks_container">
                  <Swiper
                    slidesPerView={3}
                    spaceBetween={30}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                      },
                      600: {
                        slidesPerView: 2,
                      },
                      992: {
                        slidesPerView: 3,
                      },
                    }}
                  >
                    {DEFeatures}
                  </Swiper>
                </div>
                <div className="cta_wrapper">
                  <Link className="solid_cta" onClick={handleWhatsAppClick}>
                    <div className="text">Chat Now!</div>
                    <img
                      src={rightarrowwhite}
                      alt="icon"
                      className="icon"
                      loading="lazy"
                    />
                  </Link>
                </div>
              </>
            )}
            {auth?.user?.user_type !== "DE" && (
              <>
                {proEntry?.status !== "completed" ? (
                  <>
                    <h2 className="title congrats_title">
                      Congratulations, you’re eligible to claim{" "}
                      <br className="desktop_break" />
                      free access to the
                      <span className="orange_text">
                        {" "}
                        Archinza Pro Network!
                      </span>
                    </h2>
                    <div className="cta_wrapper pro_cta_wrapper">
                      <Link className="solid_cta" to={proAccessURL}>
                        <div className="text">Claim Pro Access Now</div>
                        <img
                          src={rightarrowwhite}
                          alt="icon"
                          className="icon"
                          loading="lazy"
                        />
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="title">
                      Welcome aboard{" "}
                      {auth?.user?.user_type === "DE" ? "" : "the"}{" "}
                      <span className="orange_text">
                        Archinza{auth?.user?.user_type === "DE" && "!"}{" "}
                        {auth?.user?.user_type === "DE" ? "" : "Pro Network"}
                      </span>
                    </h2>
                    <h4 className="subtitle">
                      Exciting features coming soon with Archinza AI™!
                    </h4>
                    <div className="perks_container">
                      <Swiper
                        slidesPerView={4}
                        spaceBetween={30}
                        breakpoints={{
                          0: {
                            slidesPerView: 1,
                          },
                          600: {
                            slidesPerView: 2,
                          },
                          992: {
                            slidesPerView: 4,
                          },
                        }}
                      >
                        {auth?.user?.user_type === "BO" && BOFeatures}
                        {auth?.user?.user_type === "ST" && STFeatures}
                        {auth?.user?.user_type === "TM" && TMFeatures}
                      </Swiper>
                    </div>
                    {/* {auth?.user?.user_type === "ST" && (
                      <div className="cta_wrapper">
                        <Link
                          className="solid_cta"
                          onClick={handleWhatsAppClick}
                        >
                          <div className="text">Chat Now</div>
                          <img
                            src={rightarrowwhite}
                            alt="icon"
                            className="icon"
                            loading="lazy"
                          />
                        </Link>
                      </div>
                    )} */}
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {(proEntry?.status === "completed" ||
          auth?.user?.user_type === "DE") && (
          <section className="dashboard_sec3">
            <img
              width={1920}
              height={1080}
              src={images.dashboardcountbg.image}
              alt={images.dashboardcountbg.alt}
              className="home_background"
              loading="lazy"
            />

            <div className="my_container">
              <section className="register_business_wrapper" data-aos="fade-up">
                <div className="multi-avatar">
                  <div className="avatar-group">
                    {socialStatusIcons.slice(0, 4).map((avatar, index) => (
                      <img
                        width={72}
                        height={72}
                        key={index}
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        className="avatar"
                        loading="lazy"
                      />
                    ))}
                  </div>
                  <p className="signup-text">
                    <Swiper
                      modules={[Autoplay]}
                      spaceBetween={50}
                      loop={true}
                      speed={1000}
                      slidesPerView={1}
                      autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                      }}
                    >
                      {avatarList}
                    </Swiper>
                  </p>
                </div>

                <p className="banner-tagline">
                  Ask <span className="orange_text">Archinza</span> anything to{" "}
                  <span className="orange_text">Design & Build</span> projects.
                </p>

                <div className="banner_slider">
                  <div className="banner_wrap">
                    {auth?.user?.user_type === "DE" ||
                    auth?.user?.user_type === "ST" ? (
                      <h2 className="banner_title banner_title7">
                        <span>Find</span> <br className="mobile_break" />
                        <span className="typing_text_wrap">
                          <TypingTextAnimation texts={textsArray} />
                        </span>
                        {/* <span>Find</span> <br className="mobile_break" /> */}
                        {/* <ReactTyped
                          strings={[
                            "Architects",
                            "Interior Designers",
                            "Consultants",
                            "Contractors",
                            "Products &amp; Materials",
                          ]}
                          typeSpeed={80}
                          loop={true}
                          style={{ color: "#EF7B13" }}
                        /> */}
                        <br />
                        with Archinza AI
                        <sup className="sup">TM</sup>
                        {/* <p>
                      searching for you with Archinza AI
                      <sup className="sup">TM</sup>
                    </p> */}
                      </h2>
                    ) : (
                      <h2 className="banner_title banner_title7">
                        <span>Get found by</span>{" "}
                        <span className="typing_text_wrap">
                          <TypingTextAnimation texts={textsArray} />
                        </span>
                        {/* <span>Get found by</span>{" "} */}
                        {/* <br className="mobile_break" /> */}
                        {/* <ReactTyped
                          strings={["Architects", "Interior Designers"]}
                          typeSpeed={80}
                          loop={true}
                          style={{ color: "#EF7B13" }}
                        /> */}
                        <br />
                        searching for you with Archinza AI
                        <sup className="sup">TM</sup>
                        {/* <p>
                      searching for you with Archinza AI
                      <sup className="sup">TM</sup>
                    </p> */}
                      </h2>
                    )}
                  </div>
                </div>
                {(auth?.user?.user_type === "BO" ||
                  auth?.user?.user_type === "TM" ||
                  auth?.user?.user_type === "FL") && (
                  <div className="cta_wrapper">
                    <div
                      className="know_more"
                      onClick={() => setBusinessBenefits(true)}
                    >
                      Know More
                    </div>
                    <Link className="common_cta" to={registrationBusinessURL}>
                      <div className="text">Create Business Account</div>
                      <img
                        src={rightarrowwhite}
                        alt="icon"
                        className="icon"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                )}

                <div className="launch_container">
                  <p className="title">
                    Archinza AI<sup className="sup">TM</sup> <br />
                    Launching Soon...
                  </p>
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
              </section>
            </div>
          </section>
        )}

        <section className="dashboard_sec4">
          <div className="my_container">
            <div className="row video_row" data-aos="fade-up">
              <div className="col-md-6 order-md-2">
                <div className="text_container">
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
                          key={`AIStep-${i}`}
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
                      ))}
                    </>
                  ) : (
                    <p className="desc">Chat, Ask and Get Answers!</p>
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
                    classProp="video_box"
                    videoSource={archinzaChatVideoNew}
                    fallbackImg={chatImg}
                    width="100%"
                    height="50.188em"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard_sec5">
          <div className="my_container">
            <div className="row" data-aos="fade-up">
              <div className="col-lg-6">
                <div className="text_container">
                  <h2 className="title">
                    Frequently <br />
                    asked
                  </h2>
                  <p className="desc">Answers to most common Questions</p>
                </div>
              </div>
              <div className="col-lg-6">
                <div data-aos-delay="100">
                  <CustomAccordion items={userFAQ} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {updatedRoleData && (
          <RoleChangeModal
            show={modalShow}
            onHide={() => {
              window.history.replaceState({}, "");
              setModalShow(false);
            }}
            updatedRole={updatedRoleData?.updatedRole}
            features={featuresData[updatedRoleData?.updatedRole]}
            roleColor={auth?.user?.userType?.color}
          />
        )}
        <BusinessBenefitsModal
          show={businessBenefits}
          onHide={() => {
            setBusinessBenefits(false);
          }}
          features={busBenefitsData}
          roleColor={auth?.user?.userType?.color}
        />

        <FooterV2 />
      </main>
    </>
  );
};

export default Dashboard;
