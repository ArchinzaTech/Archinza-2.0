import React, { Fragment, useEffect, useRef, useState } from "react";
import "./designEnthusiast.scss";
import {
    archinzaChatVideoNew,
    chatImg,
    images,
    rightArrowBlue,
    rightarrowwhite,
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
    homeFaqData,
    noticeData,
    perksData,
} from "../../components/Data/homeData";
import { useWindowSize } from "react-use";
import { CustomAccordion } from "../../components/Accordion/Accordion";
import { Link } from "react-router-dom";
import AutoplayVideo from "../../components/AutoplayVideo/AutoplayVideo";
import ReactTyped from "react-typed";
import FooterV2 from "../../components/FooterV2/FooterV2";
import { accountCategoryURL } from "../../components/helpers/constant-words";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import DashboardNoticeCard from "../../components/DashboardNoticeCard/DashboardNoticeCard";
import { bmoAISteps, bmoData } from "../../components/Data/businessOwner";

const DesignEnthusiast = () => {
    const { width } = useWindowSize();
    const bannerSwiperRef = useRef(null);
    const typedRef = useRef([]);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const deadline = "August, 18, 2024 00:00:00";
    const videoSource = archinzaChatVideoNew;
    const posterImage = chatImg;

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

    const bmoList = bmoData.map((data, i) => (
        <SwiperSlide key={`perk-${i}`}>
            <div className="perk_card" data-aos="fade-up" data-aos-delay={i * 100}>
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

    const dummyAvatars = [
        'https://i.pravatar.cc/150?img=1',
        'https://i.pravatar.cc/150?img=2',
        'https://i.pravatar.cc/150?img=3',
        'https://i.pravatar.cc/150?img=4',
        'https://i.pravatar.cc/150?img=5',
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <section className="de_sec1">
                <div className="de-cards">
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
            </section>

            <section className="de_sec2">
                <div className="my_container">
                    <h2 className="title" data-aos="fade-up">
                        Welcome aboard Archinza!
                    </h2>
                    <h4 className="subtitle">
                        You will soon have access to these features!
                    </h4>
                    <div className="perks_container">
                        <Swiper
                            modules={[Autoplay, EffectCoverflow]}
                            // spaceBetween={70}
                            centeredSlides={false}
                            slidesPerView={2}
                            autoplay={true}
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
                                    slidesPerView: 2,
                                    spaceBetween: 0,
                                },
                            }}
                        >
                            {bmoList}
                        </Swiper>
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


            <section className="de_sec3">
                <img
                    src={images.homeBg.image}
                    alt={images.homeBg.alt}
                    className="home_background"
                />

                <div className="my_container">
                    <section>
                        <div className="multi-avatar">
                            <div className="avatar-group">
                                {dummyAvatars.slice(0, 4).map((avatar, index) => (
                                    <img key={index} src={avatar} alt={`Avatar ${index + 1}`} className="avatar" />
                                ))}
                            </div>
                            <p className="signup-text">
                                <span className="signup-count">{4000}+</span> people signed up!
                            </p>

                            {/* <Swiper
                                modules={[Pagination, Autoplay, Navigation, EffectFade]}
                                loop={true}
                                speed={1000}
                                effect="slide"
                                slidesPerView={1}
                                pagination={width < 768 ? true : false}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                            >
                                {Array(3).fill(0).map((el) => <SwiperSlide>
                                    <p className="signup-text">
                                        <span className="signup-count">{1599}</span> architects and interior designer trust Archinza
                                    </p>
                                </SwiperSlide>)}
                            </Swiper> */}

                        </div>

                        <p className="banner-tagline">
                            SEARCH & REACH <span className="orange_text">PEOPLE & PRODUCTS</span>  IN THE DESIGN & BUILD INDUSTRY
                        </p>
                    </section>

                    <div className="banner_slider" data-aos="fade">
                        <Swiper
                            ref={bannerSwiperRef}
                            modules={[Pagination, Autoplay, Navigation, EffectFade]}
                            effect="fade"
                            spaceBetween={20}
                            pagination={{
                                clickable: true,
                            }}
                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                            }}
                            // autoHeight={true}
                            speed={1500}
                            loop={true}
                        >
                            {/* {bannerList} */}


                            <SwiperSlide>
                                <div className="banner_wrap banner_wrap1">
                                    <h2 className="banner_title banner_title1">
                                        <span
                                            dangerouslySetInnerHTML={{ __html: bannerData[0].title }}
                                        />

                                        <ReactTyped
                                            ref={(el) => (typedRef.current[0] = el)}
                                            strings={[bannerData[0].animTitle]}
                                            typeSpeed={80}
                                        />
                                    </h2>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="banner_wrap">
                                    <h2 className="banner_title banner_title2">
                                        <span
                                            dangerouslySetInnerHTML={{ __html: bannerData[1].title }}
                                        />

                                        <ReactTyped
                                            ref={(el) => (typedRef.current[1] = el)}
                                            strings={[bannerData[1].animTitle]}
                                            typeSpeed={80}
                                        />
                                    </h2>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="banner_wrap">
                                    <h2 className="banner_title banner_title3">
                                        <span
                                            dangerouslySetInnerHTML={{ __html: bannerData[2].title }}
                                        />

                                        <ReactTyped
                                            ref={(el) => (typedRef.current[2] = el)}
                                            strings={[bannerData[2].animTitle]}
                                            typeSpeed={80}
                                        />
                                    </h2>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="banner_wrap">
                                    <h2 className="banner_title banner_title4">
                                        <span
                                            dangerouslySetInnerHTML={{ __html: bannerData[3].title }}
                                        />

                                        <ReactTyped
                                            ref={(el) => (typedRef.current[3] = el)}
                                            strings={[bannerData[3].animTitle]}
                                            typeSpeed={80}
                                        />
                                    </h2>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="banner_wrap">
                                    <h2 className="banner_title banner_title5">
                                        <span
                                            dangerouslySetInnerHTML={{ __html: bannerData[4].title }}
                                        />

                                        <ReactTyped
                                            ref={(el) => (typedRef.current[4] = el)}
                                            strings={[bannerData[4].animTitle]}
                                            typeSpeed={80}
                                        />
                                    </h2>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="banner_wrap">
                                    <h2 className="banner_title banner_title6">
                                        <span
                                            dangerouslySetInnerHTML={{ __html: bannerData[5].title }}
                                        />

                                        <ReactTyped
                                            ref={(el) => (typedRef.current[5] = el)}
                                            strings={[bannerData[5].animTitle]}
                                            typeSpeed={80}
                                        />
                                    </h2>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="banner_wrap">
                                    <h2 className="banner_title banner_title7">
                                        <span
                                            dangerouslySetInnerHTML={{ __html: bannerData[6].title }}
                                        />

                                        <ReactTyped
                                            ref={(el) => (typedRef.current[6] = el)}
                                            strings={[bannerData[6].animTitle]}
                                            typeSpeed={80}
                                        />
                                    </h2>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                    <div className="cta_wrapper">
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

            <section className="de_sec4">
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

            <section className="de_sec5">
                <div className="my_container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="text_container" data-aos="fade-up">
                                <h2 className="title">
                                    Frequently <br />
                                    asked
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

export default DesignEnthusiast;
