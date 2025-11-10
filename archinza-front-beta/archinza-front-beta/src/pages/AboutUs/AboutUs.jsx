import React, { useState } from "react";
import "./aboutUs.scss";
import {
  aboutBanner,
  natashaKochhar,
  whoLinkedIn,
  colaboratoImg,
  dummy,
  dummy2,
  sliderBlurLeft,
  sliderBlurRight,
  insta,
  perkLeftArrow,
  perkRightArrow,
} from "../../images";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import BreadCrumb from "../../components/Breadcrumb/Breadcrumb";
import FooterV2 from "../../components/FooterV2/FooterV2";

const AboutUs = () => {
  const BelieversData = [
    {
      id: 1,
      img: colaboratoImg,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
    {
      id: 2,
      img: colaboratoImg,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
    {
      id: 3,
      img: colaboratoImg,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
    {
      id: 4,
      img: colaboratoImg,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
    {
      id: 5,
      img: colaboratoImg,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
    {
      id: 6,
      img: colaboratoImg,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
    {
      id: 7,
      img: colaboratoImg,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
    {
      id: 8,
      img: colaboratoImg,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
    {
      id: 9,
      img: colaboratoImg,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
  ];
  const HustlersData = [
    {
      id: 1,
      img: dummy2,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
    {
      id: 2,
      img: colaboratoImg,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
    {
      id: 3,
      img: dummy,
      heading: "Arindam Paul",
      title: "Chief Business Officer : Atomberg",
    },
    {
      id: 4,
      img: dummy2,
      heading: "Swati Bhargava",
      title: "Chief Business Officer : Atomberg",
    },
    {
      id: 5,
      img: dummy,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
    {
      id: 6,
      img: colaboratoImg,
      heading: "Swati Bhargava",
      title: "Cofounder : CashKaro & EarnKaro",
    },
    {
      id: 7,
      img: dummy,
      heading: "Arindam Paul",
      title: "Chief Business Officer : Atomberg",
    },
    {
      id: 8,
      img: dummy2,
      heading: "Swati Bhargava",
      title: "Chief Business Officer : Atomberg",
    },
    {
      id: 9,
      img: colaboratoImg,
      heading: "Swati Bhargava",
      title: "Chief Business Officer : Atomberg",
    },
  ];
  return (
    <>
      <main className="about_main">
        <section className="about_sec1">
          <img src={aboutBanner} alt="background" className="about_bg" />
          <div className="my_container">
            <div className="Breadcrumb_container">
              <BreadCrumb
                link="/about-us"
                text="Know"
                title="About us"
                linkDisabled
              />
            </div>
            <div className="content_box">
              <p className="description">
                Archinza is an AI-Powered Design Assistant for stakeholders in
                the Design and Build Industry that enables them to search and
                access information effortlessly. Whether you're looking for
                materials, services, or new opportunities, Archinza helps you
                search, reach and connect with others in the industry.
              </p>
            </div>
          </div>
        </section>
        <section className="about_sec2">
          <div className="my_container">
            <div className="content_wrapper">
              <h2 className="title">Who Are We?</h2>
              <p className="desc desc_top_who">
                A diverse team working together on a mission to simplify ‘reach
                and search’ within the Design and Build industry. With our
                combined skills and expertise, we aim to simplify and
                revolutionise how people connect and collaborate in the design
                and build industry.
              </p>
            </div>
            <div className="row who_row">
              <div className="col-lg-6 who_col">
                <div className="img_wrapper">
                  <div className="section2_behind__img_border"></div>
                  <img
                    src={natashaKochhar}
                    alt="Natasha Kochhar"
                    className="who_img"
                  />
                </div>
              </div>
              <div className="col-lg-6 who_col">
                <div className="content_wrapper">
                  <div className="name_wrapper">
                    <h2 className="name">Natasha Kochhar</h2>
                    <a href="/about-us">
                      <img
                        src={whoLinkedIn}
                        alt="linkedIn"
                        className="linkedin_icon"
                      />
                    </a>
                  </div>
                  <p className="desg">Architect I Founder-Archinza</p>
                  <p className="desc">
                    Natasha Kochhar, the driving force behind Archinza, brings
                    over two decades of experience and a passion for innovation
                    to the architecture and design industry. Across her career
                    spans, Natasha observed a gap between user needs and
                    solutions across all levels of the design and build
                    industry. Leveraging her extensive network of professional
                    connections, unwavering research and market expertise, she
                    was inspired to develop Archinza – an AI-Powered Design
                    Assistant that connects all sectors and tiers of industry
                    experts with equal & easy access.
                    <br />
                    Natasha's vision for Archinza is rooted in her belief that
                    effortless collaborations and knowledge-sharing are
                    essential for driving positive change in the Design and
                    Build community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about_sec3">
          <div className="my_container">
            <div className="content_wrapper">
              <h2 className="title">Collaborators</h2>
            </div>
            <div className="row grids_cards_row">
              <div className="col-lg-6 col_collaborator">
                <div className="collaborator_wrapper">
                  <div className="image_collaborator_wrapper">
                    <div className="image_circle"></div>
                    <img
                      src={colaboratoImg}
                      alt=""
                      className="colaborator_Img"
                    />
                  </div>
                  <div className="heading_collaborator">Togglehead</div>
                  <div className="title_collaborator">
                    Tech and Innovation | Founder - Krish Ramnani
                  </div>
                  <div className="desc_collaborator">
                    Word 1 Lorem | Word 2 Ipsum | Word 3 Dummy
                  </div>
                  <a href="/about-us" className="d-flex justify-content-center">
                    <img
                      src={whoLinkedIn}
                      alt="linkedIn"
                      className="linkedin_icon"
                    />
                  </a>
                </div>
              </div>
              <div className="col-lg-6 col_collaborator">
                <div className="collaborator_wrapper ms-auto">
                  <div className="image_collaborator_wrapper">
                    <div className="image_circle"></div>
                    <img
                      src={colaboratoImg}
                      alt=""
                      className="colaborator_Img"
                    />
                  </div>
                  <div className="heading_collaborator">
                    One Digital I Marketing
                  </div>
                  <div className="title_collaborator">
                    Cofounder : CashKaro & EarnKaro
                  </div>
                  <div className="desc_collaborator">
                    Word 1 Lorem | Word 2 Ipsum | Word 3 Dummy
                  </div>
                  <a href="/about-us" className="d-flex justify-content-center">
                    <img
                      src={whoLinkedIn}
                      alt="linkedIn"
                      className="linkedin_icon"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* section 4 for desktop */}
        <section className="about_sec4 sec4_desk">
          <div className="my_container">
            <div className="content_wrapper_sm_card">
              <h2 className="title_sm_card">First Believers</h2>
            </div>
            <div className="row grids_sm_cards_row">
              {BelieversData.map((data) => {
                return (
                  <div className="col-md-6 col-lg-4 sm_card_col" key={data.id}>
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
            </div>
          </div>
        </section>

        {/* section 4 for mobile, replica from section 5*/}
        <section className="about_sec5 sec4_mob d-none">
          <div className="my_container">
            <div className="content_wrapper_slider mob_title_slider_container">
              <h2 className="title_slider_card mob_title_slider">
                First Believers
              </h2>
            </div>
            <img
              src={sliderBlurLeft}
              alt="blur"
              className="blur_img_left_slider"
            />

            <Swiper
              spaceBetween={63}
              speed={500}
              loop
              modules={[Navigation]}
              navigation={{
                nextEl: ".custom-next-mob",
                prevEl: ".custom-prev-mob",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              slidesPerView={4}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                590: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                850: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1190: {
                  slidesPerView: 4,
                  spaceBetween: 40,
                },
                1440: {
                  slidesPerView: 4,
                  spaceBetween: 63,
                },
              }}
            >
              {BelieversData.map((data) => {
                return (
                  <SwiperSlide key={data.id}>
                    <div className="swiper_card_single">
                      <div className="swiper_card__img_wrapper mob_img_wrapper">
                        <div className="swiper_card_circle_behind mob_cicle"></div>
                        <img
                          src={data.img}
                          alt=""
                          className="swiper_card_Img"
                        />
                      </div>
                      <div className="swiper_card_contet_wrapper mob_slider_content_wrapper">
                        <div className="swiper_card_heading">
                          {data.heading}
                        </div>
                        <div className="swiper_card_title">{data.title}</div>
                        <div className="sm_card_icon_wrapper_mob">
                          <a href="/about-us">
                            <img
                              src={insta}
                              alt="instagram"
                              className="sm_card_linkedin_icon_mob"
                            />
                          </a>
                          <a href="/about-us">
                            <img
                              src={whoLinkedIn}
                              alt="linkedIn"
                              className="sm_card_linkedin_icon_mob"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
              <div className="custom_about_slider_buttons btn_mob_container">
                <button className="custom-prev-mob custom_btn custom_btn_mob">
                  <img
                    src={perkLeftArrow}
                    alt="Previous"
                    className="previous_icon_nav nav_img"
                  />
                </button>
                <button className="custom-next-mob custom_btn custom_btn_mob">
                  <img
                    src={perkRightArrow}
                    alt="Next"
                    className="next_icon_nav nav_img"
                  />
                </button>
              </div>
            </Swiper>

            <img
              src={sliderBlurRight}
              alt="blur"
              className="blur_img_right_slider"
            />
          </div>
        </section>

        <section className="about_sec5 secton_5_slider_hustlers">
          <div className="my_container sec5_container">
            <div className="content_wrapper_slider">
              <h2 className="title_slider_card">Our Hustlers</h2>
            </div>
            <img
              src={sliderBlurLeft}
              alt="blur"
              className="blur_img_left_slider"
            />

            <Swiper
              spaceBetween={63}
              speed={500}
              loop
              centeredSlides={window.innerWidth <= 1200 ? true : false}
              modules={[ Navigation]}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              slidesPerView={4}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                310: {
                  slidesPerView: 1.5,
                },
                340: {
                  slidesPerView: 1.6,
                },
                360: {
                  slidesPerView: 1.7,
                },
                410: {
                  slidesPerView: 1.9,
                },
                490: {
                  slidesPerView: 2.2,
                },
                575: {
                  slidesPerView: 2.4,
                },
                870: {
                  slidesPerView: 3.5,
                  spaceBetween: 60,
                },
                992: {
                  slidesPerView: 4,
                  spaceBetween: 80,
                },
                1190: {
                  slidesPerView: 4,
                  spaceBetween: 40,
                },
                1440: {
                  slidesPerView: 4,
                  spaceBetween: 63,
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
            <div className="custom_about_slider_buttons slider_mission_buttons">
              <button className="custom-prev custom_btn">
                <img
                  src={perkLeftArrow}
                  alt="Previous"
                  className="previous_icon_nav nav_img"
                />
              </button>
              <button className="custom-next custom_btn">
                <img
                  src={perkRightArrow}
                  alt="Next"
                  className="next_icon_nav nav_img"
                />
              </button>
            </div>
            <img
              src={sliderBlurRight}
              alt="blur"
              className="blur_img_right_slider"
            />
          </div>
        </section>
        <section className="about_sec6">
          <div className="my_container">
            <div className="content_wrapper_missoin">
              <h2 className="title_missoin_card">Our Mission</h2>
            </div>
            <div className="bottom_box">
              <div className="bottom_box_content">
                Whether you're a designer, consultant, contractor, supplier, or
                brand, Archinza is here to support you in the world of design
                and construction.
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterV2 bgColor="#000000" />
    </>
  );
};

export default AboutUs;
