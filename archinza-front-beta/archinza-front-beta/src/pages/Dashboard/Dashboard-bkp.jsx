import React, { Fragment, useEffect, useState } from "react";
import "./dashboard.scss";
import { rightarrowwhite } from "../../images";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import DashboardNoticeCard from "../../components/DashboardNoticeCard/DashboardNoticeCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import FooterV2 from "../../components/FooterV2/FooterV2";
import BlinkingDots from "../../Animations/BlinkingDots/BlinkingDots";
import RoleChangeModal from "../../components/RoleChangeCongrats/RoleChangeCongrats";

import { useAuth } from "../../context/Auth/AuthState";
import http from "../../helpers/http";
import config from "../../config/config";
import {
  dashboardURL,
  loginURL,
  proAccessURL,
  registrationBusinessURL,
} from "../../components/helpers/constant-words";
import { noticeData } from "../../components/Data/homeData";

const featuresData = {
  BO: [
    "Instantly Connect on Demand within Industry ⚡️",
    "Quick & Effortless Vendor Search 🔍",
    "Hire for your Business/Firm 💼",
    "Targeted Reach to Clients 🎯",
  ],
  TM: [
    "Search for Job Opportunities",
    "Access to Learning Resources",
    "Access to Design Events",
    "Search for Products and People",
  ],
  ST: [
    "Search for Jobs & Internships",
    "Access to Learning Resources",
    "Access to Design Events",
    "Search for Products and People",
  ],
};

const Dashboard = () => {
  // =============== VARIABLE & STATES  ===========================

  const { width } = useWindowSize();
  // const [user, setUser] = useState({});
  // const [userStatus, setUserStatus] = useState({
  //   status: "registered",
  // });

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const deadline = "November, 15, 2024 00:00:00";
  const [modalShow, setModalShow] = useState(false);
  const [proEntry, setProEntry] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatedRoleData, setUpdatedRoleData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const base_url = config.api_url; //without trailing slash

  const { state } = useLocation();

  // =============== FUNCTIONS  ===========================

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  // =============== HTML RENDERING  ===========================

  const featuresList = featuresData["BO"].map((list, i) => (
    <React.Fragment key={`feature-list-${i}`}>
      <li>{list}</li>
    </React.Fragment>
  ));

  // =============== DATA FETCHING  ===========================

  // const fetchUser = async () => {
  //   const user_id = auth?.user?._id;
  //   const { data } = await http.get(base_url + "/personal/details/" + user_id);

  //   if (data) {
  //     const userType = helper.getUserType(data?.user_type);
  //     data.userType = userType;
  //     setUser(data);
  //   }
  //   setLoading(false);
  // };

  const fetchEntry = async (id, user_type) => {
    const { data } = await http.get(
      `${base_url}/pro-access/entries/${user_type}/${id}`
    );

    if (data) {
      setProEntry(data);
    }
    setLoading(false);
  };

  const verifyUserToken = async () => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    if (token) {
      const data = await http.get(`${base_url}/bot/user/verify-token/${token}`);

      if (data.data.token) {
        const token = data.data.token;
        auth.login(token);

        // const id = auth?.user?._id;
        // const user_type = auth?.user?.user_type;
        // console.log(id, user_type);

        // fetchEntry();
        navigate(dashboardURL, { replace: true });
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
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (auth?.user) {
      const id = auth?.user?._id;
      const user_type = auth?.user?.user_type;
      fetchEntry(id, user_type);
      // fetchUser();
    }
  }, [auth]);

  useEffect(() => {
    if (state?.isRoleUpdated) {
      setModalShow(true);
      setUpdatedRoleData(state);
    }
  }, [state]);

  useEffect(() => {
    verifyUserToken();
  }, [location]);

  // if (loading) {
  //   return null;
  // }
  return (
    <>
      <BlinkingDots />
      <main className="dashboard_container">
        <section className="dashboard_sec1">
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
                />
              </div>
              <div className="col-lg-4 dashboard_col notice_col">
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
          </div>
        </section>

        <section className="dashboard_sec2">
          <div className="my_container">
            <div
              className={`row intro_row ${
                auth?.user?.userType?.code + "_row1"
              }`}
            >
              <div className="col-lg-8 intro_col">
                <div className="text_container">
                  <h2 className="heading">
                    Welcome to the {width < 600 && <br />}Archinza Design
                    Network!
                  </h2>
                  <div className="intro_wrapper">
                    <p className="desc">For The Design & Build Community</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 intro_col">
                <div className="button_container">
                  <Link
                    to={registrationBusinessURL}
                    className={`cta_wrapper brand_cta ${auth?.user?.userType?.code}-cta`}
                    style={{
                      border: `1px solid ${auth?.user?.userType?.color}`,
                      webkitBoxShadow: `0px 0px 20px 0px ${auth?.user?.userType?.color}`,
                      mozBoxShadow: `0px 0px 20px 0px ${auth?.user?.userType?.color}`,
                      boxShadow: `0px 0px 20px 0px ${auth?.user?.userType?.color}`,
                    }}
                  >
                    <p className="cta_text">
                      Create Business Account
                      {width <= 600 && (
                        <img
                          src={rightarrowwhite}
                          alt="arrow"
                          className="arrow_img"
                        />
                      )}
                    </p>
                    {width > 600 && (
                      <img
                        src={rightarrowwhite}
                        alt="arrow"
                        className="arrow_img"
                      />
                    )}
                  </Link>
                </div>
              </div>
            </div>
            {proEntry?.status === "registered" &&
              auth?.user?.userType?.code != "DE" && (
                <div className="row intro_row intro_row2">
                  <div className="col-lg-8 intro_col">
                    <h2 className="subheading">Congratulations!</h2>
                    <p className="subdesc">
                      <span className="orange_text">
                        You are eligible for free early access to{" "}
                      </span>
                      Archinza PRO!
                    </p>
                  </div>
                  <div className="col-lg-4 intro_col">
                    <div className="button_container congrats_button_container">
                      <Link to={proAccessURL} className="cta_wrapper">
                        <p className="cta_text">
                          Claim Access Now
                          {width < 600 && (
                            <img
                              src={rightarrowwhite}
                              alt="arrow"
                              className="arrow_img"
                            />
                          )}
                        </p>
                        {width > 600 && (
                          <img
                            src={rightarrowwhite}
                            alt="arrow"
                            className="arrow_img"
                          />
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            {proEntry.status != "registered" &&
              proEntry.status != "completed" && (
                <div className="row intro_row intro_row2">
                  <div className="col-lg-8 intro_col">
                    <h2 className="subheading">Complete Soon!</h2>
                    <p className="subdesc">
                      <span className="orange_text">
                        Complete claiming your Free Access to{" "}
                      </span>
                      Archinza PRO!
                    </p>
                  </div>
                  <div className="col-lg-4 intro_col">
                    <div className="button_container congrats_button_container">
                      <Link to={proAccessURL} className="cta_wrapper">
                        <p className="cta_text">
                          Complete Now
                          {width < 600 && (
                            <img
                              src={rightarrowwhite}
                              alt="arrow"
                              className="arrow_img"
                            />
                          )}
                        </p>
                        {width > 600 && (
                          <img
                            src={rightarrowwhite}
                            alt="arrow"
                            className="arrow_img"
                          />
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            {proEntry?.status === "completed" && (
              <div className="row intro_row intro_row3">
                <div className="col-lg-8 intro_col">
                  <h2 className="subheading">Coming Soon!</h2>
                  <p className="subdesc">
                    <span className="orange_text">
                      Stay Tuned! We’ll notify you when we are live with{" "}
                    </span>
                    Archinza PRO!
                  </p>
                </div>
                <div className="col-lg-4 intro_col">
                  <div className="button_container congrats_button_container">
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
                          {hours >= 0
                            ? hours < 10
                              ? "0" + hours
                              : hours
                            : "00"}
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
              </div>
            )}
            <div className="mobile_notice">
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
                {noticeData.map((notice) => (
                  <Fragment>
                    <SwiperSlide key={`mobile-${notice.id}`}>
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

        <FooterV2 />
      </main>
    </>
  );
};

export default Dashboard;
