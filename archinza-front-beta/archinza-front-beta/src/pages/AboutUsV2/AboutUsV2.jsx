import React, { useEffect, useRef } from "react";
import FooterV2 from "../../components/FooterV2/FooterV2";
import {
  aboutBannerV2,
  aboutBgDesk,
  aboutBgMob,
  aboutBuildingStructure,
  archeryLogo,
  archeryLogoMob,
  colaboratoImg,
  collaborator1,
  collaborator2,
  collaborator3,
  collaborator4,
  collaborator5,
  collaborator6,
  Hustlers1,
  Hustlers2,
  Hustlers3,
  Hustlers4,
  Hustlers5,
  Hustlers6,
  Hustlers7,
  rightarrowwhite,
  SwapanFB,
  NishitFB,
  KrishFB,
  PrashaantKochharFB,
  UpharChibberFB,
  aboutWhiteBanner,
  collaborator2Black,
  collaborator3Black,
} from "../../images";
import BreadCrumb from "../../components/Breadcrumb/Breadcrumb";
import "./aboutUsV2.scss";
import { useWindowSize } from "react-use";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { accountCategoryURL } from "../../components/helpers/constant-words";
import { useInView } from "react-intersection-observer";
import useTheme from "../../components/useTheme/useTheme";

const AboutUsV2 = () => {
  const { width } = useWindowSize();
  const hustlerRef = useRef(null);

  const { ref: hustlerInViewRef, inView } = useInView({
    threshold: 1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (hustlerRef.current && inView) {
      return hustlerRef.current?.autoplay.start();
    }
    hustlerRef.current?.autoplay.stop();
  }, [inView]);
  const { theme } = useTheme();
  // const theme = "dark";
  const HustlersDatapart1 = [
    {
      id: 1,
      img: Hustlers4,
      heading: "Natasha N Kochhar",
      title: "Founder",
    },
    {
      id: 2,
      img: Hustlers6,
      heading: "Rohit Kakkar",
      title: "Product Lead and Strategy",
    },
    {
      id: 3,
      img: Hustlers2,
      heading: "Megha Dixit",
      title: "Content Strategy",
    },
    {
      id: 4,
      img: Hustlers3,
      heading: "Souvik Sahu",
      title: "Web Development",
    },
    {
      id: 5,
      img: Hustlers1,
      heading: "Kalyan Gianchandani",
      title: "Content Strategy",
    },
    {
      id: 6,
      img: Hustlers7,
      heading: "Arpit Bhatia",
      title: "UI/UX Advisor",
    },

    // {
    //   id: 6,
    //   img: Hustlers3,
    //   heading: "Swati Bhargava",
    //   title: "Cofounder : CashKaro & EarnKaro",
    // },
    // {
    //   id: 7,
    //   img: Hustlers3,
    //   heading: "Swati Bhargava",
    //   title: "Cofounder : CashKaro & EarnKaro",
    // },
  ];
  const HustlersData = [...HustlersDatapart1, ...HustlersDatapart1];
  const AmbassadorsDatapart1 = [
    {
      id: 1,
      img: Hustlers4,
      heading: "Name Here",
      title: "Designation",
    },
    {
      id: 2,
      img: Hustlers2,
      heading: "Name Here",
      title: "Designation",
    },
    {
      id: 3,
      img: Hustlers1,
      heading: "Name Here",
      title: "Designation",
    },
    {
      id: 4,
      img: Hustlers2,
      heading: "Name Here",
      title: "Designation",
    },
    {
      id: 5,
      img: Hustlers3,
      heading: "Name Here",
      title: "Designation",
    },

    // {
    //   id: 6,
    //   img: Hustlers3,
    //   heading: "Swati Bhargava",
    //   title: "Cofounder : CashKaro & EarnKaro",
    // },
    // {
    //   id: 7,
    //   img: Hustlers3,
    //   heading: "Swati Bhargava",
    //   title: "Cofounder : CashKaro & EarnKaro",
    // },
  ];
  const AmbassadorsData = [...AmbassadorsDatapart1, ...AmbassadorsDatapart1];
  const BelieversData1 = [
    {
      id: 1,
      img: PrashaantKochharFB,
      heading: "Prashaant Kochhar",
      title: "Architect LTDF",
    },
    {
      id: 2,
      img: UpharChibberFB,
      heading: "Uphar Chibber",
      title: "Architect LTDF",
    },
    {
      id: 3,
      img: SwapanFB,
      heading: "Swapan",
      title: "Co-Founder Haptik",
    },
    {
      id: 4,
      img: NishitFB,
      heading: "Nishit Gurunani",
      title: "Co-Founder Onedigital",
    },
    {
      id: 5,
      img: KrishFB,
      heading: "Krish Ramnani",
      title: "Co-Founder Togglehead",
    },
  ];
  const BelieversData = [...BelieversData1, ...BelieversData1];

  const fullDataCollaborators = [
    {
      id: 1,
      logo: collaborator1,
    },
    {
      id: 2,
      logo: theme === "light" ? collaborator2Black : collaborator2,
    },
    {
      id: 3,
      logo: theme === "light" ? collaborator3Black : collaborator3,
    },
    {
      id: 4,
      logo: collaborator4,
    },
    {
      id: 5,
      logo: collaborator5,
    },
    {
      id: 6,
      logo: collaborator6,
    },
    {
      id: 7,
      logo: collaborator1,
    },
    {
      id: 8,
      logo: theme === "light" ? collaborator2Black : collaborator2,
    },
    {
      id: 9,
      logo: theme === "light" ? collaborator3Black : collaborator3,
    },
    {
      id: 10,
      logo: collaborator4,
    },
    {
      id: 11,
      logo: collaborator5,
    },
  ];
  const fullDataInvestors =
    width > 1250
      ? [
          {
            id: 1,
            logo: collaborator1,
          },
          {
            id: 2,
            logo: theme === "light" ? collaborator2Black : collaborator3,
          },
          {
            id: 3,
            logo: theme === "light" ? collaborator3Black : collaborator3,
          },
          {
            id: 4,
            logo: collaborator4,
          },
        ]
      : [
          {
            id: 1,
            logo: collaborator1,
          },
          {
            id: 2,
            logo: theme === "light" ? collaborator2Black : collaborator3,
          },
          {
            id: 3,
            logo: theme === "light" ? collaborator3Black : collaborator3,
          },
          {
            id: 4,
            logo: collaborator4,
          },
          {
            id: 5,
            logo: collaborator1,
          },
          {
            id: 6,
            logo: theme === "light" ? collaborator2Black : collaborator3,
          },
          {
            id: 7,
            logo: theme === "light" ? collaborator3Black : collaborator3,
          },
          {
            id: 8,
            logo: collaborator4,
          },
        ];
  // const fullData = [...CollaboratorsData, ...CollaboratorsData];

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <main className="about_main">
        <section className="about_sec1">
          <img
            src={theme === "light" ? aboutWhiteBanner : aboutBannerV2}
            alt="background"
            className="about_bg"
          />
          <div
            className={`${
              theme === "light"
                ? "light_overlay_about_banner"
                : "dark_overlay_about_banner"
            } `}
          ></div>
          <div
            className="my_container position-relative"
            style={{
              zIndex: "2",
            }}
          >
            <div
              className={`Breadcrumb_container about_v2_Breadcrumb_container ${
                theme === "light" ? "light_mode_txt_clr" : ""
              }`}
            >
              <BreadCrumb
                link="/about-us"
                text="Know"
                title="About us"
                linkDisabled
              />
            </div>
          </div>
          <div
            className="about_v2_heading_main"
            style={{
              color: theme === "light" ? "#000000" : "",
            }}
          >
            Simplifying discovery through AI-powered {width > 992 && <br />}{" "}
            <span className="next_step_about_v2_heading_main">
              matchmaking.{" "}
              <span style={{ color: "#EF7B13", fontStyle: "italic" }}>
                Ask, Search, Reach.{" "}
              </span>
              <span
                className="about_v2_main_heading_Glow"
                style={{
                  backgroundColor: theme === "light" ? "#ffffff" : "",
                }}
              >
                Connect.
              </span>
            </span>
          </div>
        </section>
        <section className="aboutV2_sec2">
          <div className="my_container">
            <div className="mission_Wrapper_about_v2">
              <img
                src={width > 767 ? aboutBgDesk : aboutBgMob}
                alt="gradient"
                className="gradient_bg_mission"
              />
              <img
                src={width > 767 ? archeryLogo : archeryLogoMob}
                alt="our mission"
                className="archery_logo_mission"
                style={{
                  filter: theme === "light" ? "invert(1)" : "",
                  opacity: theme === "light" ? "0.4" : "",
                }}
              />
              <div
                className="text_content_mission_about_v2"
                style={{
                  backgroundColor: theme === "light" ? "white" : "",
                  color: theme === "light" ? "black" : "",
                }}
              >
                <div className="content_wrapper_mission">
                  On a mission to unify the{" "}
                  <span
                    style={{
                      color: "#EF7B13",
                    }}
                  >
                    Design & Build community
                  </span>
                  , Archinza offers{" "}
                  <span
                    style={{
                      color: "#EF7B13",
                    }}
                  >
                    intelligent
                  </span>{" "}
                  <span
                    style={{
                      color: "#EF7B13",
                    }}
                  >
                    matchmaking
                  </span>{" "}
                  to streamline access to people, products and{" "}
                  <span
                    style={{
                      color: "#EF7B13",
                    }}
                  >
                    service on
                  </span>{" "}
                  {/* <br /> */}
                  <span
                    style={{
                      color: "#EF7B13",
                    }}
                  >
                    demand
                  </span>
                  , without the hassle of switching tools or starting from
                  scratch.
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="aboutV2_sec3">
          <div className="my_container">
            <div className="row">
              <div className="col-lg-6 aboutV2_sec3_left">
                <div
                  className="about_v2_heading_common"
                  style={{
                    color: theme === "light" ? "black" : "",
                  }}
                >
                  Our Purpose
                </div>
                <div
                  className="about_v2_title_common"
                  style={{
                    color: theme === "light" ? "black" : "",
                  }}
                >
                  The Design & Build industry wasn’t broken;
                  {width > 576 ? <br /> : ""} it was disconnected.
                </div>
                {width <= 991 && (
                  <img
                    src={aboutBuildingStructure}
                    alt=""
                    className="about_building_structure"
                  />
                )}

                <div className="purpose_list_about_v2">
                  <span className="list_number_about_v2">01</span>
                  <div
                    className="list_data_about_v2"
                    style={{
                      color: theme === "light" ? "black" : "",
                    }}
                  >
                    Archinza is your AI-powered design assistant, built to
                    search, connect, and answer in real-time. Archinza brings
                    together people, products and services in one seamless
                    platform.
                  </div>
                </div>
                <div className="purpose_list_about_v2">
                  <span className="list_number_about_v2">02</span>
                  <div
                    className="list_data_about_v2"
                    style={{
                      color: theme === "light" ? "black" : "",
                    }}
                  >
                    Whether you’re sourcing materials, finding professionals, or
                    tackling a design-related query, you don’t need multiple
                    tabs and platforms. You just need to Ask or upload, and
                    we’ll match you with the best person or product for your
                    project.
                  </div>
                </div>
                <div className="purpose_list_about_v2">
                  <span className="list_number_about_v2">03</span>
                  <div
                    className="list_data_about_v2"
                    style={{
                      color: theme === "light" ? "black" : "",
                    }}
                  >
                    We exist to simplify how the industry works by ensuring it
                    finally works together, giving you faster, smarter
                    connections with the resources that you need, when you need
                    it.
                  </div>
                </div>
              </div>
              {width > 991 && (
                <div className="col-lg-6 aboutV2_sec3_right">
                  <img
                    src={aboutBuildingStructure}
                    alt=""
                    className="about_building_structure"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="aboutV2_sec4">
          <div className="my_container">
            <div
              className="about_v2_heading_common text-center fw-5"
              style={{
                color: theme === "light" ? "black" : "",
              }}
            >
              Our Hustlers
            </div>
            <div
              className="about_v2_title_common text-center op-80"
              style={{
                color: theme === "light" ? "black" : "",
              }}
            >
              A cross-disciplinary team of thinkers and believers working to
              connect {width > 576 ? <br /> : ""} everything that moves design
              forward.
            </div>
          </div>
          <div
            ref={hustlerInViewRef}
            className="slider_hustler_wrapper_about_b2"
          >
            <Swiper
              onSwiper={(swiper) => (hustlerRef.current = swiper)}
              spaceBetween={80}
              speed={1000}
              loop={true}
              // modules={width < 767 ? [Autoplay] : []}
              modules={[Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              slidesPerView={3.5}
              freeMode={false}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  centeredSlides: true,
                  spaceBetween: 0,
                  loop: true,
                },
                340: {
                  slidesPerView: 1.3,
                  centeredSlides: true,
                  spaceBetween: 40,
                  loop: true,
                },
                420: {
                  slidesPerView: 1.4,
                  centeredSlides: true,
                  spaceBetween: 40,
                  loop: true,
                },
                600: {
                  slidesPerView: 2.3,
                  centeredSlides: true,
                  spaceBetween: 40,
                  loop: true,
                },
                767: {
                  slidesPerView: 2.5,
                  centeredSlides: false,
                  spaceBetween: 60,
                  loop: true,
                },
                992: {
                  slidesPerView: 3.2,
                  spaceBetween: 50,
                  centeredSlides: false,
                  loop: true,
                },
                1190: {
                  slidesPerView: 4,
                  spaceBetween: 0,
                  centeredSlides: false,
                },
                1700: {
                  slidesPerView: 3.5,
                  spaceBetween: 80,
                  centeredSlides: false,
                },
                2500: {
                  slidesPerView: 3.7,
                  spaceBetween: 80,
                  centeredSlides: false,
                },
              }}
            >
              {HustlersData.map((data) => {
                return (
                  <SwiperSlide key={data.id}>
                    <div className="swiper_card_single">
                      <div className="swiper_card__img_wrapper">
                        <div className="swiper_card_circle_behind"></div>
                        <img
                          src={data.img}
                          alt={data.heading}
                          className="swiper_card_Img"
                        />
                      </div>
                      <div className="swiper_card_contet_wrapper">
                        <div
                          className="swiper_card_heading"
                          style={{
                            color: theme === "light" ? "black" : "",
                          }}
                        >
                          {data.heading}
                        </div>
                        <div
                          className="swiper_card_title"
                          style={{
                            color: theme === "light" ? "black" : "",
                          }}
                        >
                          {data.title}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>

        <section className="aboutV2_sec5">
          <div className="my_container">
            <div
              className="about_v2_heading_common text-center fw-5"
              style={{
                color: theme === "light" ? "black" : "",
              }}
            >
              Collaborators
            </div>
            <div
              className="about_v2_title_common text-center op-80"
              style={{
                color: theme === "light" ? "black" : "",
              }}
            >
              Powered by the partners who share our vision and work alongside
              us, {width > 576 ? <br /> : ""} bringing invaluable expertise to
              revolutionise the industry.
            </div>
          </div>

          <div className="slider_logo_wrapper_about_v2">
            <Swiper
              slidesPerView={5}
              spaceBetween={120}
              allowTouchMove={false}
              loop={true}
              speed={3000}
              modules={[Autoplay]}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              breakpoints={{
                // 0: {
                //   slidesPerView: 2,
                // },
                320: {
                  slidesPerView: 2,
                  spaceBetween: 0,
                },
                450: {
                  slidesPerView: 2.4,
                  spaceBetween: 46,
                },
                600: {
                  slidesPerView: 3,
                  spaceBetween: 46,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
                940: {
                  slidesPerView: 3,

                  spaceBetween: 40,
                },
                1100: {
                  slidesPerView: 4,
                },
                1400: {
                  slidesPerView: 5,
                },
              }}
            >
              {fullDataCollaborators?.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="img_wrapper">
                    <img src={item.logo} alt="logo" className="logo_about_v2" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        <section className="aboutV2_sec6">
          <div className="my_container">
            <div
              className="about_v2_heading_common text-center fw-5"
              style={{
                color: theme === "light" ? "black" : "",
              }}
            >
              First Believers
            </div>
            <div
              className="about_v2_title_common text-center op-80"
              style={{
                color: theme === "light" ? "black" : "",
              }}
            >
              Guided by the insights of an exceptional group of entrepreneurs
              and industry{width > 992 ? <br /> : ""} professionals, whose early
              commitment to our vision has been the catalyst
              {width > 992 ? <br /> : ""} for everything we are building today.
            </div>

            {/* <div className="row grids_sm_cards_row">
              {BelieversData.map((data) => {
                return (
                  <div
                    className="col-6 col-sm-4 col-md-6 col-lg-4 col-xl-3 sm_card_col"
                    key={data.id}
                  >
                    <div className="sm_card_wrpper_box">
                      <div className="sm_card__img_wrapper">
                        <div className="sm_card_circle_behind"></div>
                        <img src={data.img} alt="" className="sm_card_Img" />
                      </div>
                      <div className="sm_card_contet_wrapper">
                        <div className="sm_card_heading">{data.heading}</div>
                        <div className="sm_card_title">{data.title}</div>
                      </div>
                      <div className="sm_card_icon_wrapper">
                        <a href="/about-us">
                          <img
                            src={insta}
                            alt="instagram"
                            className="sm_card_linkedin_icon"
                          />
                        </a>
                        <a href="/about-us">
                          <img
                            src={whoLinkedIn}
                            alt="linkedIn"
                            className="sm_card_linkedin_icon"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div> */}
          </div>
          <div className="slider_hustler_wrapper_about_b2">
            <Swiper
              spaceBetween={80}
              speed={1000}
              loop={true}
              modules={[Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              slidesPerView={3.5}
              freeMode={false}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  centeredSlides: true,
                  spaceBetween: 0,
                  loop: true,
                },
                340: {
                  slidesPerView: 1.3,
                  centeredSlides: true,
                  spaceBetween: 40,
                  loop: true,
                },
                420: {
                  slidesPerView: 1.4,
                  centeredSlides: true,
                  spaceBetween: 40,
                  loop: true,
                },
                600: {
                  slidesPerView: 2.3,
                  centeredSlides: true,
                  spaceBetween: 40,
                  loop: true,
                },
                767: {
                  slidesPerView: 2.5,
                  centeredSlides: false,
                  spaceBetween: 60,
                  loop: true,
                },
                992: {
                  slidesPerView: 3.2,
                  spaceBetween: 50,
                  centeredSlides: false,
                  loop: true,
                },
                1190: {
                  slidesPerView: 4,
                  spaceBetween: 0,
                  centeredSlides: false,
                },
                1700: {
                  slidesPerView: 3.5,
                  spaceBetween: 80,
                  centeredSlides: false,
                },
                2500: {
                  slidesPerView: 3.7,
                  spaceBetween: 80,
                  centeredSlides: false,
                },
              }}
            >
              {BelieversData.map((data) => {
                return (
                  <SwiperSlide key={data.id}>
                    <div className="swiper_card_single">
                      <div className="swiper_card__img_wrapper">
                        <div className="swiper_card_circle_behind"></div>
                        <img
                          src={data.img}
                          alt={data.heading}
                          className="swiper_card_Img"
                        />
                      </div>
                      <div className="swiper_card_contet_wrapper">
                        <div
                          className="swiper_card_heading"
                          style={{
                            color: theme === "light" ? "black" : "",
                          }}
                        >
                          {data.heading}
                        </div>
                        <div
                          className="swiper_card_title"
                          style={{
                            color: theme === "light" ? "black" : "",
                          }}
                        >
                          {data.title}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>

        {/* <section className="aboutV2_sec4 aboutV2_sec7">
          <div className="my_container">
            <div className="about_v2_heading_common text-center fw-5">
              Brand Ambassadors
            </div>
            <div className="about_v2_title_common text-center op-80">
              Anchored at the intersection of ideas and communities, they
              translate our{width > 992 ? <br /> : ""} vision into real-world
              presence.
            </div>
          </div>
          <div className="slider_hustler_wrapper_about_b2">
            <Swiper
              spaceBetween={40}
              speed={1000}
              loop={true}
              // modules={width < 767 ? [Autoplay] : []}
              modules={[Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              slidesPerView={3.5}
              freeMode={false}
              breakpoints={{
                0: {
                  slidesPerView: 1.8,
                  centeredSlides: true,
                  spaceBetween: 0,
                  loop: true,
                },
                365: {
                  slidesPerView: 2,
                  centeredSlides: true,
                  spaceBetween: 0,
                  loop: true,
                },
                470: {
                  slidesPerView: 2.8,
                  centeredSlides: true,
                  spaceBetween: 20,
                  loop: true,
                },
                536: {
                  slidesPerView: 3.2,
                  centeredSlides: true,
                  spaceBetween: 20,
                  loop: true,
                },
                630: {
                  slidesPerView: 3.8,
                  centeredSlides: true,
                  spaceBetween: 40,
                  loop: true,
                },
                767: {
                  slidesPerView: 3.2,
                  centeredSlides: false,
                  spaceBetween: 40,
                  loop: true,
                },
                880: {
                  slidesPerView: 3.5,
                  spaceBetween: 40,
                  centeredSlides: false,
                  loop: true,
                },
                1000: {
                  slidesPerView: 4.2,
                  spaceBetween: 40,
                  centeredSlides: false,
                  loop: true,
                },
                1190: {
                  slidesPerView: 4.5,
                  spaceBetween: 30,
                  centeredSlides: false,
                },
                1700: {
                  slidesPerView: 4.2,
                  spaceBetween: 40,
                  centeredSlides: false,
                },
                2500: {
                  slidesPerView: 4.5,
                  spaceBetween: 40,
                  centeredSlides: false,
                },
              }}
            >
              {AmbassadorsData.map((data) => {
                return (
                  <SwiperSlide key={data.id}>
                    <div className="swiper_card_single">
                      <div className="swiper_card__img_wrapper">
                        <div className="swiper_card_circle_behind"></div>
                        <img
                          src={data.img}
                          alt=""
                          className="swiper_card_Img"
                        />
                      </div>
                      <div className="swiper_card_contet_wrapper">
                        <div className="swiper_card_heading">
                          {data.heading}
                        </div>
                        <div className="swiper_card_title">{data.title}</div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section> */}

        {/* <section className="aboutV2_sec5 aboutV2_sec8">
          <div className="my_container">
            <div
              className="about_v2_heading_common text-center fw-5"
              style={{
                paddingTop: "4px",
                color: theme === "light" ? "black" : "",
              }}
            >
              Backed by Investors
            </div>
            <div
              className="about_v2_title_common text-center op-80"
              style={{
                color: theme === "light" ? "black" : "",
              }}
            >
              Driven by foresight and faith, they invested in possibility when
              it was just an{width > 576 ? <br /> : ""} idea.
            </div>
          </div>

          <div
            className={`slider_logo_wrapper_about_v2 ${
              width > 1250 && "slider_logo_Investors_aboutv2"
            }`}
          >
            <Swiper
              slidesPerView={5}
              spaceBetween={120}
              allowTouchMove={false}
              loop={width <= 1250 && true}
              speed={3000}
              modules={width <= 1250 ? [Autoplay] : []}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              breakpoints={{
                // 0: {
                //   slidesPerView: 2,
                // },
                320: {
                  slidesPerView: 2,
                  spaceBetween: 0,
                },
                450: {
                  slidesPerView: 2.4,
                  spaceBetween: 46,
                },
                600: {
                  slidesPerView: 3,
                  spaceBetween: 46,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
                940: {
                  slidesPerView: 3,

                  spaceBetween: 40,
                },
                1100: {
                  slidesPerView: 4,
                },
                1250: {
                  slidesPerView: 5,
                },
              }}
            >
              {fullDataInvestors?.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="img_wrapper">
                    <img src={item.logo} alt="logo" className="logo_about_v2" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section> */}
        <section className="aboutV2_sec8 aboutV2_sec9">
          <div className="my_container">
            <div
              className="about_v2_heading_common fw-5"
              style={{
                paddingTop: "3px",
                color: theme === "light" ? "black" : "",
              }}
            >
              How It All Began
            </div>
            <div className="row wrapper_sec_9_gardients">
              <div className="col-12 col-md-4 tiltle_warpper_about_sec_8">
                <div
                  className="about_v2_title_common "
                  style={{
                    color: theme === "light" ? "black" : "",
                  }}
                >
                  “We believe the next era of innovation won’t be built by
                  working harder, but by working together.”
                </div>
              </div>
              <div
                className="col-12 col-md-8 sec_8_last_desc_col"
                style={{
                  color: theme === "light" ? "black" : "",
                }}
              >
                With over two decades of experience in Architecture and Interior
                Design, Ar. Natasha N Kochhar recognized the need for a more
                seamless, integrated approach to how professionals and end users
                tap into the services and resources required to Design & Build.
                While innovation existed, the systems and processes in place
                didn’t always support the industry’s need for faster, smarter
                connections. <br /> This led to the creation of Archinza: a
                platform designed to streamline the process by integrating
                everything into one cohesive space. By connecting users in
                meaningful ways and removing the roadblocks, Archinza empowers
                users to{" "}
                <span
                  style={{
                    color: "#EF7B13",
                  }}
                >
                  work smarter
                </span>
                ,{" "}
                <span
                  style={{
                    color: "#EF7B13",
                  }}
                >
                  faster
                </span>
                , and{" "}
                <span
                  style={{
                    color: "#EF7B13",
                  }}
                >
                  more collaboratively.
                </span>
              </div>
            </div>
            <div
              className="last_heading_sec_8"
              style={{
                color: theme === "light" ? "#EF7B13" : "",
              }}
            >
              We believe in access that’s equal, not exclusive.
            </div>
            {/* <div className="btn_wrapper_know">
              <Link to={accountCategoryURL} className="get_access_btn">
                Get Early Acsess
                <img
                  src={rightarrowwhite}
                  alt="icon"
                  className="icon_know_cta"
                  loading="lazy"
                />
              </Link>
            </div> */}
          </div>
        </section>
      </main>

      {/* <FooterV2  bgColor="#000000" /> */}
      {theme === "dark" ? <FooterV2 /> : <FooterV2 lightTheme />}
    </>
  );
};

export default AboutUsV2;
