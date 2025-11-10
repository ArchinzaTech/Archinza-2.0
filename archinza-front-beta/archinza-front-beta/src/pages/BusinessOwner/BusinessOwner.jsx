import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useWindowSize } from "react-use";
import { CustomAccordion } from "../../components/Accordion/Accordion";
import AutoplayVideo from "../../components/AutoplayVideo/AutoplayVideo";
import DashboardNoticeCard from "../../components/DashboardNoticeCard/DashboardNoticeCard";
import { bmoAISteps } from "../../components/Data/businessOwner";
import {
    homeFaqData,
    noticeData
} from "../../components/Data/homeData";
import FooterV2 from "../../components/FooterV2/FooterV2";
import { accountCategoryURL } from "../../components/helpers/constant-words";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import {
    archinzaChatVideoNew,
    chatImg,
    rightArrowBlue,
    rightarrowwhite
} from "../../images";
import "./businessOwner.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

const BusinessOwner = () => {
    const videoSource = archinzaChatVideoNew;
    const posterImage = chatImg;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <section className="bmo_sec1">
                <div className="bmo_cards">
                    <ProfileCard
                        name={"Tanvi!"}
                        userType={"Design Enthusiast"}
                        contactNo={"+91 7874547547"}
                        emailId={"tanvi.shah123@gmail.com"}
                        address={"Mumbai, India"}
                    />
                    <div className="col-lg-4 dashboard_col notice_col">
                        {/* <h2 className="heading">Did you know?</h2> */}
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
                            {noticeData.map((notice) => (
                                <Fragment>
                                    <SwiperSlide key={`desktop-${notice.id}`}>
                                        <DashboardNoticeCard
                                            title={notice.heading}
                                            notice={notice.desc}
                                        />
                                    </SwiperSlide>
                                </Fragment>
                            ))}
                        </Swiper>
                    </div>
                </div>

                <h2 className="banner_title">
                    Congratulations, you’re eligible to claim free access to the <span className="orange_text">Archinza Pro Network!</span>
                </h2>

                <div className="cta_wrapper" data-aos="fade-up">
                    <Link className="common_cta" to={accountCategoryURL}>
                        <div className="text">Get Early Acess Now</div>
                        <img
                            src={rightArrowBlue}
                            alt="icon"
                            className="icon"
                            loading="lazy"
                        />
                    </Link>
                </div>
            </section>

            <section className="bmo_sec2">
                <div className="my_container">
                    <div className="row video_row">
                        <div className="col-md-6 order-md-2">
                            <div className="text_container" data-aos="fade-up">
                                <h2 className="title">Your AI led design assistant</h2>
                                {/* <p className="desc">
                                    Redesigning <br />
                                    the business of design
                                </p> */}
                                {bmoAISteps.map((item) => <div className="ai-step">
                                    <div className="ai-img">
                                        {/* <img src={item.icon} alt="" /> */}
                                    </div>
                                    <div>
                                        <p className="ai-title">{item.title}</p>
                                        <p className="ai-subtitle">{item.desc}</p>
                                    </div>
                                </div>)}
                                <div className="cta_wrapper" data-aos="fade-up">
                                    <Link className="common_cta" to={accountCategoryURL}>
                                        <div className="text">Chat Now</div>
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

            <section className="bmo_sec3">
                <div className="my_container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="text_container" data-aos="fade-up">
                                <h2 className="title">
                                    Frequently asked <br />
                                    questions
                                </h2>
                                <p className="desc">Answers to most common Questions</p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div data-aos="fade-up" data-aos-delay="100">
                                <CustomAccordion items={homeFaqData} />
                            </div>
                        </div>
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
            </section>

            <FooterV2 bgColor="#000000" />
        </>
    );
};

export default BusinessOwner;
