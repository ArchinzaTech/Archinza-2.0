import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./header.scss";
import { useWindowSize } from "react-use";
import {
  addIcon,
  blacklogo,
  dropdownarrow,
  loginicon,
  logoutIcon,
  prologo,
  prologoblack,
  rightarrowblack,
  rightarrowwhite,
  trashIconCircleOrange,
  userIconDark,
  userIconLight,
  whitelogo,
  switchProfileIcon,
} from "../../images";
import {
  accountCategoryURL,
  businessFormFiveLTURL,
  congratulationsLightURL,
  dashboardURL,
  contactUsURL,
  editProfile,
  homepageURL,
  loginURL,
  registrationBusinessURL,
  registrationFormURL,
  registrationBusinessOTPURL,
  BlogsInnerURL,
  BlogsListingURL,
  aboutUsURL,
  proAccessURL,
  businessProfileEditURL,
  businessProfileViewURL,
  businessProfileEditURL2,
  businessProfileViewURL2,
  businessConnectViwUrl,
  privacypolicyURL,
  termsandconditionURL,
  businessConnectEditUrl,
  regiserOTPURL,
  loginOtpURL,
  resetPassURL,
  chooseYourPlan,
  pricingPlansURL,
} from "../helpers/constant-words";
import HeaderNavItem from "./HeaderNavItem";
import GlowCta from "../GlowCta/GlowCta";
import config from "../../config/config";

import { useAuth } from "../../context/Auth/AuthState";
import _filter from "lodash/filter";
import http from "../../helpers/http";
import SiteLoader from "../SiteLoader/SiteLoader";
import { useBusinessContext } from "../../context/BusinessAccount/BusinessAccountState";
// const body = document.querySelector("body");

const Header = () => {
  const [loading, setLoading] = useState(true);
  const [navlinkIndex, setNavlinkIndex] = useState(null);
  const { width } = useWindowSize();
  const { height } = useWindowSize();
  const [navActiveIndex, setNavActiveIndex] = useState(null);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [userName, setUsername] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [userState, setUserState] = useState(0);
  const [userCategory, setUserCategory] = useState(1);
  const [dropdownActive, setDropdownActive] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();
  const [isNewAccDropdown, setIsNewAccDropdown] = useState(false);
  const [headerWidth, setHeaderWidth] = useState();
  const [headerHeight, setHeaderHeight] = useState();
  const [correspondingAccount, setCorrespondingAccount] = useState(null);
  const BusinessContext = useBusinessContext();

  const auth = useAuth();
  const navigate = useNavigate();
  const base_url = config.api_url;

  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);

  const fetchEntry = async (id, user_type, auth_type) => {
    if (auth_type === "personal") {
      const { data } = await http.get(
        `${base_url}/pro-access/entries/${user_type}/${id}`
      );

      if (data) {
        setUsername(auth?.user?.name);
        setIsPro(data?.status === "completed");
      }
    } else {
      const { data } = await http.get(
        `${base_url}/business/business-details/${id}`
      );

      if (data) {
        setUsername(data?.business_name);
        BusinessContext.update(data);
      }
    }
  };

  useEffect(() => {
    if (auth.user) {
      const id = auth?.user?._id;
      if (auth.user.auth_type === "personal") {
        const user_type = auth?.user?.user_type;
        setUsername(auth?.user?.name);
        fetchEntry(id, user_type, auth?.user?.auth_type);
      } else {
        fetchEntry(id, "", auth?.user?.auth_type);
        auth.user["name"] = auth?.user?.business_name;
      }
      setIsPro(false);
      // setCorrespondingAccount(null);
    }
  }, [auth, auth?.user?.name]);

  const navLinksArr = [
    {
      id: 1,
      type: "img",
      img: whitelogo,
      mainLink: "/",
      class: "logo_img",
    },
    {
      id: 3,
      type: "text",
      mainTitle: "KNOW",
      mainLink: aboutUsURL,
    },
    {
      id: 4,
      type: "text",
      mainTitle: "CONNECT",
      mainLink: contactUsURL,
    },
    {
      id: 5,
      type: "text",
      mainTitle: "BLOGS",
      mainLink: BlogsListingURL,
    },
    // {
    //   id: 6,
    //   type: "social",
    //   links: [
    //     { img: isLightTheme ? fbHeaderB : fbHeader, url: facebookURL },
    //     { img: isLightTheme ? instaHeaderB : instaHeader, url: instagramURL },
    //     {
    //       img: isLightTheme ? linkedinHeaderB : linkedinHeader,
    //       url: linkedinURL,
    //     },
    //   ],
    // },
  ];

  const usersArr = [
    {
      categoryId: 0,
      category: "student",
      background: "#FF4A68",
      users: [
        {
          name: "Habib",
          age: "",
          company: "TOGGLEHEAD",
        },
      ],
    },
    {
      categoryId: 1,
      category: "team-member",
      background: "#12CC50",
      users: [
        {
          name: "Talha",
          age: "",
          company: "TOGGLEHEAD",
        },
      ],
    },
    {
      categoryId: 2,
      category: "design-enthusiast",
      background: "#014FE0",
      users: [
        {
          name: "Ayushi",
          age: "",
          company: "Facebook",
        },
      ],
    },
    {
      categoryId: 3,
      category: "business-firm-owner",
      background: "#CC9921",
      users: [
        {
          name: "Elon",
          age: "",
          company: "Tesla",
        },
      ],
    },
  ];

  const [mobNavLinksArr, setmobNavLinksArr] = useState([
    {
      id: 1,
      type: "text",
      mainTitle: "Dashboard",
      mainLink: dashboardURL,
    },
    {
      id: 2,
      type: "text",
      mainTitle: "KNOW",
      mainLink: aboutUsURL,
    },
    {
      id: 3,
      type: "text",
      mainTitle: "CONNECT",
      mainLink: contactUsURL,
    },
    {
      id: 4,
      type: "text",
      mainTitle: "BLOG",
      mainLink: homepageURL,
    },
  ]);

  useEffect(() => {
    setHeaderWidth(headerRef.current.clientWidth);
    setHeaderHeight(headerRef.current.clientHeight);
  }, [width, height]);

  const handlelogout = () => {
    auth.logout();
    setIsPro(false);
    navigate(loginURL, { replace: true });
  };

  function userStatusHandler(e) {
    if (userCategory !== usersArr.length - 1) {
      setUserCategory(userCategory + 1);
    } else {
      setUserCategory(0);
    }
  }

  const scrollHandler = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleHamburgerClick = () => {
    setIsMenuActive(!isMenuActive);
    // if (!isMenuActive) {
    //   // Disable scroll
    //   body.style.overflow = "hidden";
    // } else {
    //   // Enable scroll
    //   body.style.overflow = "auto";
    // }
    setDropdownActive(false);
  };

  const handleNavIndex = (i) => {
    if (navActiveIndex === i) {
      setNavActiveIndex(null);
    } else {
      setNavActiveIndex(i);
    }
  };

  const navlinkList = navLinksArr.map((nav, i) => (
    <li key={navLinksArr[i].id}>
      {nav.type === "img" && (
        <div
          onClick={() => setNavlinkIndex(i)}
          className={`logo_wrapper ${navlinkIndex === i ? "" : ""} `}
        >
          <a href="#">
            <img
              width={292}
              className={nav.class}
              src={`${
                isPro
                  ? isLightTheme
                    ? prologoblack
                    : prologo
                  : isLightTheme
                  ? blacklogo
                  : whitelogo
              }`}
              alt="atlas img"
              onClick={scrollHandler}
              loading="eager"
            />
          </a>
        </div>
      )}
      {nav.type === "text" && (
        <div
          onClick={() => setNavlinkIndex(i)}
          className={`nav_tab ${navlinkIndex === i ? "active" : ""} `}
        >
          {nav.linktype === "external" ? (
            <a
              className={nav.class}
              href={nav.mainLink}
              target="_blank"
              rel="noreferrer"
            >
              {nav.mainTitle}
            </a>
          ) : (
            // <Link className={nav.class} to={nav.mainLink}>
            <Link
              className={`${
                nav.linkVariant === "dashboard" && isDashboard === true
                  ? ""
                  : nav.class
              }`}
              to={nav.mainLink}
            >
              {nav.mainTitle}
            </Link>
          )}
        </div>
      )}

      {isDashboard === true
        ? nav.type === "search" && (
            <div className="nav_tab">
              <img src={nav.img} alt="search" className={nav.class} />
            </div>
          )
        : null}
      {/* 
      {nav.type === "social" && (
        <div
          onClick={() => setNavlinkIndex(i)}
          className={`nav_tab social_links ${
            navlinkIndex === i ? "active" : ""
          } `}
        >
          {nav.links.map((item) => (
            <a
              className={nav.class}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              key={item.url}
            >
              <img
                width={30}
                height={30}
                src={item.img}
                alt={item.url}
                className="social_img"
              />
            </a>
          ))}
        </div>
      )} */}

      {isDashboard === false
        ? nav.type === "form" && (
            <div
              //   onClick={userStateHandler}
              className={`nav_tab bg_cta ${
                navlinkIndex === i ? "active" : ""
              } `}
            >
              <Link
                className="multi_text"
                to={nav.userStates[userState].slug}
                // style={{ pointerEvents: "none" }}
              >
                <div className="title">{nav.userStates[userState].title}</div>
                <div>
                  <img
                    width={28.48}
                    src={isLightTheme ? rightarrowblack : rightarrowwhite}
                    alt="right arrow"
                    className="right_arrow"
                  />
                  {/* <img
                width={15.5}
                src={blackright}
                alt="right arrow"
                className="right_arrow"
              /> */}
                </div>
              </Link>
            </div>
          )
        : null}
    </li>
  ));

  useEffect(() => {
    if (location.pathname === dashboardURL) {
      setIsDashboard(true);
    } else {
      setIsDashboard(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname === businessFormFiveLTURL ||
      location.pathname === businessProfileEditURL2 ||
      location.pathname === businessProfileEditURL ||
      location.pathname === businessProfileEditURL2 ||
      location.pathname === businessProfileViewURL ||
      location.pathname === businessProfileViewURL2 ||
      location.pathname === businessConnectViwUrl ||
      location.pathname === registrationBusinessURL ||
      location.pathname === congratulationsLightURL ||
      location.pathname === registrationBusinessOTPURL ||
      location.pathname === privacypolicyURL ||
      location.pathname === termsandconditionURL ||
      location.pathname === businessConnectEditUrl ||
      location.pathname === pricingPlansURL
    ) {
      setIsLightTheme(true);
    } else {
      setIsLightTheme(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    setIsMenuActive(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.backgroundColor = isLightTheme ? "#f6f6f6" : "#000000";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [isLightTheme]);

  const handleProfileSwitch = async (profile) => {
    setLoading(true);
    const success = await auth.switchProfile(profile._id);
    if (success) {
      setDropdownActive(false);
      // Navigate based on profile type and status
      if (profile.auth_type === "business") {
        navigate(
          profile.status !== "completed"
            ? businessFormFiveLTURL
            : businessProfileEditURL2
        );
      } else {
        navigate(
          profile.status !== "completed" ? registrationFormURL : dashboardURL
        );
      }
    }
    setLoading(false);
  };

  const getProfileTypeLabel = (profile) => {
    return profile.auth_type === "business" ? "Business" : "Personal";
  };

  const ProfileSwitcherDropdown = () => {
    if (!isProfileSwitcherOpen) return null;

    return (
      <div className="profile-switcher-dropdown">
        <div className="profile-switcher-header">
          <h4>Switch Profile</h4>
        </div>
        <div className="profile-list">
          {auth.profiles
            .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))
            .map((profile) => (
              <div
                key={profile._id}
                className={`profile-item ${
                  profile._id === auth.user?._id ? "active" : ""
                }`}
                onClick={() => handleProfileSwitch(profile)}
              >
                <div className="profile-info">
                  <div className="profile-name">
                    {profile.name || profile.business_name}
                  </div>
                  <div className="profile-type">
                    {getProfileTypeLabel(profile)}
                  </div>
                </div>
                {profile._id === auth.user?._id && (
                  <div className="current-profile-indicator"></div>
                )}
              </div>
            ))}
        </div>
        <div className="profile-switcher-footer">
          <Link to={registrationFormURL} className="add-profile-btn">
            <img src={addIcon} alt="Add Profile" />
            Add Personal Account
          </Link>
          <Link to={registrationBusinessURL} className="add-profile-btn">
            <img src={addIcon} alt="Add Business" />
            Add Business Account
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      {loading && <SiteLoader whiteTheme={isLightTheme ? false : false} />}
      <div
        className={`desktop_blank ${
          isLightTheme ? "desktop_blank_light" : "desktop_blank_dark"
        }`}
      ></div>
      <header
        ref={headerRef}
        className={`header_sec ${
          isLightTheme ? "header_light" : "header_dark"
        } ${isMenuActive ? "menuactive" : ""}   `}
      >
        <div
          className="backdrop_header"
          style={{ width: `${headerWidth}px`, height: `${headerHeight}px` }}
        ></div>
        {width > 1080 ? (
          <>
            {/* <div className="desktop_blank"></div> */}
            <div className="my_container">
              <div className="navlinks">
                <ul>
                  {auth.isLoggedIn() === true && (
                    <li>
                      <div className="nav_tab">
                        <Link
                          to={
                            auth?.user?.auth_type === "business"
                              ? auth?.user?.status !== "completed"
                                ? businessFormFiveLTURL
                                : businessProfileEditURL2
                              : dashboardURL
                          }
                        >
                          DASHBOARD
                        </Link>
                      </div>
                    </li>
                  )}

                  {navlinkList}

                  <li>
                    {auth.isLoggedIn() === true && (
                      <div
                        className="nav_tab user_tab"
                        // onClick={userStatusHandler}
                        onMouseOver={() => setDropdownActive(true)}
                        onMouseOut={() => setDropdownActive(false)}
                      >
                        <Link className="user" to={() => false}>
                          {/* <div className="title">
                            {usersArr[userCategory].users[0].name}
                          </div> */}
                          <div
                            className="initial_circle"
                            style={{
                              background:
                                auth?.user?.auth_type === "personal"
                                  ? auth?.user?.userType?.color
                                  : "#ed008c",
                            }}
                          >
                            <div className="name">
                              {userName ? userName.charAt(0) : ""}
                            </div>
                          </div>
                          {/* <div className="dropdown_arrow_wrap">
                            <img
                              width={9}
                              src={dropdownarrow}
                              alt="dropdown arrow"
                              className="dropdown_arrow"
                            />
                          </div> */}
                        </Link>
                      </div>
                    )}
                    {auth.isLoggedIn() === false && (
                      <div className="nav_tab login_tab overflow-visible">
                        <Link
                          className="login wrapper_login_icon_tooltp"
                          to={loginURL}
                        >
                          {/* <div className="title">LOGIN</div> */}
                          <div className="position-relative">
                            <img
                              width={30}
                              height={30}
                              src={isLightTheme ? userIconLight : userIconDark}
                              alt="login icon"
                              className="login_icon"
                            />
                            <div className="tootlip_user_info">My Account</div>
                          </div>
                        </Link>
                      </div>
                    )}
                    {dropdownActive === true && (
                      <>
                        <div
                          className="dropdown_box"
                          onMouseOver={() => setDropdownActive(true)}
                          onMouseOut={() => setDropdownActive(false)}
                        >
                          <div className="drop_content_box">
                            <div className="dropdown_box_arrow">
                              <img
                                src={dropdownarrow}
                                alt="up arrow"
                                className="up_arrow"
                              />
                            </div>

                            {/* Current Profile First */}
                            <Link
                              to={
                                auth?.user?.auth_type === "business"
                                  ? auth?.user?.status !== "completed"
                                    ? businessFormFiveLTURL
                                    : businessConnectEditUrl
                                  : auth?.user?.status !== "completed"
                                  ? registrationFormURL
                                  : dashboardURL
                              }
                              className="dropdown_list name"
                            >
                              {userName}
                            </Link>

                            {/* Other Profiles */}
                            {auth.profiles
                              .filter(
                                (profile) => profile._id !== auth.user?._id
                              )
                              .map((profile) => (
                                <div
                                  key={profile._id}
                                  className="dropdown_list name"
                                  onClick={() => handleProfileSwitch(profile)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {profile.auth_type === "personal"
                                    ? profile.name
                                    : profile.business_name}
                                </div>
                              ))}

                            <div className="dropdown_list">
                              <div
                                className="account_login add_acc"
                                onClick={() =>
                                  setIsNewAccDropdown(!isNewAccDropdown)
                                }
                              >
                                ADD ACCOUNT
                                <img
                                  className="dropdown_arrow"
                                  src={dropdownarrow}
                                  alt="down arrow"
                                />
                              </div>
                              {isNewAccDropdown && (
                                <div className="login_wrapper">
                                  <Link to={loginURL} className="login_link">
                                    LOG INTO EXISTING ACCOUNT
                                  </Link>
                                  <br />
                                  <Link
                                    to={accountCategoryURL}
                                    className="login_link"
                                  >
                                    CREATE NEW ACCOUNT
                                  </Link>
                                </div>
                              )}
                            </div>
                            <div
                              className="dropdown_list account_login"
                              onClick={handlelogout}
                            >
                              LOG OUT
                              <img
                                className="logout_icon"
                                src={logoutIcon}
                                // src={download_icon}
                                alt="down arrow"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </li>
                  {auth.isLoggedIn() === false && (
                    <li>
                      {(location.pathname === registrationBusinessURL ||
                        location.pathname === registrationBusinessOTPURL) && (
                        <div className={`nav_tab bg_cta `}>
                          <Link className="multi_text" to={registrationFormURL}>
                            <div className="title" style={{ color: "#fff" }}>
                              Create Personal Account
                            </div>
                            <div>
                              <img
                                width={28.48}
                                src={
                                  isLightTheme
                                    ? rightarrowwhite
                                    : rightarrowblack
                                }
                                alt="right arrow"
                                className="right_arrow"
                              />
                            </div>
                          </Link>
                        </div>
                      )}
                    </li>
                  )}

                  {auth.isLoggedIn() === false && (
                    <li>
                      {(location.pathname === homepageURL ||
                        location.pathname === accountCategoryURL ||
                        location.pathname === contactUsURL ||
                        location.pathname === BlogsListingURL ||
                        location.pathname === BlogsInnerURL ||
                        location.pathname === aboutUsURL ||
                        location.pathname === loginURL ||
                        location.pathname === resetPassURL ||
                        location.pathname === loginOtpURL) && (
                        <div className={`nav_tab bg_cta `}>
                          <Link className="multi_text" to={accountCategoryURL}>
                            <div className="title">Get Early Access</div>
                            <div>
                              <img
                                width={28.48}
                                src={
                                  isLightTheme
                                    ? rightarrowblack
                                    : rightarrowwhite
                                }
                                alt="right arrow"
                                className="right_arrow"
                              />
                            </div>
                          </Link>
                        </div>
                      )}
                      {(location.pathname === registrationFormURL ||
                        location.pathname === regiserOTPURL) && (
                        <div className={`nav_tab bg_cta `}>
                          <Link
                            className="multi_text"
                            to={registrationBusinessURL}
                          >
                            <div className="title">Create Business Account</div>
                            <div>
                              <img
                                width={28.48}
                                src={
                                  isLightTheme
                                    ? rightarrowblack
                                    : rightarrowwhite
                                }
                                alt="right arrow"
                                className="right_arrow"
                              />
                            </div>
                          </Link>
                        </div>
                      )}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <header className="header">
              <div className="my_container">
                <div className="login_container">
                  {/* mobile UI start */}
                  <div
                    className={`hamburger_lines ${
                      isMenuActive ? "active" : ""
                    }`}
                    onClick={handleHamburgerClick}
                  >
                    <div className="line line1"></div>
                    <div className="line line2"></div>
                    <div className="line line3"></div>
                  </div>
                  <div className="logo_wrapper">
                    <Link className="logo_link" to="/">
                      <img
                        src={`${
                          isPro
                            ? isLightTheme
                              ? prologoblack
                              : prologo
                            : isLightTheme
                            ? blacklogo
                            : whitelogo
                        }`}
                        alt="atlas logo"
                        className="atlas_logo"
                        onClick={() => setIsPro(true)}
                      />
                    </Link>
                  </div>
                  <div>
                    {auth.isLoggedIn() === true && (
                      <div
                        className="nav_tab user_tab"
                        // onClick={userStatusHandler}
                        onMouseOver={() => setDropdownActive(true)}
                        onMouseOut={() => setDropdownActive(false)}
                      >
                        <Link
                          className="user"
                          to={() => false}
                          onClick={userStatusHandler}
                        >
                          <div
                            className="initial_circle"
                            style={{
                              background:
                                auth?.user?.auth_type === "personal"
                                  ? auth?.user?.userType?.color
                                  : "#ef7b13",
                            }}
                          >
                            <div className="name">
                              {userName ? userName.charAt(0) : ""}
                            </div>
                          </div>
                          {/* <div className="dropdown_arrow_wrap">
                            <img
                              width={9}
                              src={dropdownarrow}
                              alt="dropdown arrow"
                              className="dropdown_arrow"
                            />
                          </div> */}
                        </Link>
                        {dropdownActive === true && (
                          <>
                            <div
                              className="dropdown_wrapper"
                              onClick={() => setDropdownActive(false)}
                            ></div>
                            <div
                              className="dropdown_box"
                              onMouseOver={() => setDropdownActive(true)}
                              onMouseOut={() => setDropdownActive(false)}
                            >
                              <div className="drop_content_box">
                                <div className="dropdown_box_arrow">
                                  <img
                                    src={dropdownarrow}
                                    alt="up arrow"
                                    className="up_arrow"
                                  />
                                </div>

                                {/* Current Profile First */}
                                <Link
                                  to={
                                    auth?.user?.auth_type === "business"
                                      ? auth?.user?.status !== "completed"
                                        ? businessFormFiveLTURL
                                        : businessConnectEditUrl
                                      : auth?.user?.status !== "completed"
                                      ? registrationFormURL
                                      : dashboardURL
                                  }
                                  className="dropdown_list name"
                                >
                                  {userName}
                                </Link>

                                {/* Other Profiles */}
                                {auth.profiles
                                  .filter(
                                    (profile) => profile._id !== auth.user?._id
                                  )
                                  .map((profile) => (
                                    <div
                                      key={profile._id}
                                      className="dropdown_list name"
                                      onClick={() =>
                                        handleProfileSwitch(profile)
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      {profile.auth_type === "personal"
                                        ? profile.name
                                        : profile.business_name}
                                    </div>
                                  ))}

                                <div className="dropdown_list">
                                  <div
                                    className="account_login add_acc"
                                    onClick={() =>
                                      setIsNewAccDropdown(!isNewAccDropdown)
                                    }
                                  >
                                    ADD ACCOUNT
                                    <img
                                      className="dropdown_arrow"
                                      src={dropdownarrow}
                                      alt="down arrow"
                                    />
                                  </div>
                                  {isNewAccDropdown && (
                                    <div className="login_wrapper">
                                      <Link
                                        to={loginURL}
                                        className="login_link"
                                      >
                                        LOG INTO EXISTING ACCOUNT
                                      </Link>
                                      <br />
                                      <Link
                                        to={accountCategoryURL}
                                        className="login_link"
                                      >
                                        CREATE NEW ACCOUNT
                                      </Link>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className="dropdown_list account_login"
                                  onClick={handlelogout}
                                >
                                  LOG OUT
                                  <img
                                    className="logout_icon"
                                    src={logoutIcon}
                                    // src={download_icon}
                                    alt="down arrow"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {auth.isLoggedIn() === false && (
                      <div
                        className="nav_tab login_tab"
                        // onClick={() => setLoggedIn(true)}
                      >
                        <Link className="login" to={loginURL}>
                          {/* <div className="title">LOGIN</div> */}
                          <div>
                            <img
                              width={30}
                              height={30}
                              src={loginicon}
                              alt="login icon"
                              className="login_icon"
                            />
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <nav className="nav_links_wrapper">
                <div
                  className={`nav_line2_wrapper_flex_wrapper ${
                    isMenuActive ? "active" : ""
                  }`}
                >
                  <div className="blank"></div>
                  <div className="logo_wrapper">
                    <Link className="logo_link" to="/">
                      <img
                        src={`${isPro ? prologo : whitelogo}`}
                        alt="atlas logo"
                        className="atlas_logo"
                      />
                    </Link>
                    <div
                      className={`hamburger_lines ${
                        isMenuActive ? "active" : ""
                      }`}
                      onClick={handleHamburgerClick}
                    >
                      <div className="line line1"></div>
                      <div className="line line2"></div>
                      <div className="line line3"></div>
                    </div>
                  </div>
                  <ul className="nav_line2_wrapper_flex">
                    {mobNavLinksArr.map((navData, i) => (
                      <HeaderNavItem
                        navData={navData}
                        key={parseInt(navData.id)}
                        arrIndex={i}
                        handleNavIndex={handleNavIndex}
                        navActiveIndex={navActiveIndex}
                      />
                    ))}

                    {auth.isLoggedIn() === false && (
                      <>
                        {(location.pathname === homepageURL ||
                          location.pathname === accountCategoryURL ||
                          location.pathname === contactUsURL ||
                          location.pathname === BlogsListingURL ||
                          location.pathname === BlogsInnerURL ||
                          location.pathname === aboutUsURL ||
                          location.pathname === loginURL) && (
                          <div className="cta_wrapper">
                            <GlowCta
                              link={accountCategoryURL}
                              text="Get Early Access"
                            />
                          </div>
                        )}
                        {location.pathname === registrationFormURL && (
                          <div className="cta_wrapper">
                            <GlowCta
                              link={registrationBusinessURL}
                              text="Create Business Account"
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* <li>
                      {width <= 1023 && (
                        <div className="nav_social_media_icons">
                          <p className="social_title">FOLLOW US ON :</p>
                          <a
                            href="https://www.facebook.com/profile.php?id=100091559990889&mibextid=LQQJ4d"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={facebook}
                              alt="facebook"
                              className="nav_social_icons"
                            />
                          </a>
                          <a
                            href="https://instagram.com/archin.za?igshid=MzRlODBiNWFlZA"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={insta}
                              alt="instagram"
                              className="nav_social_icons"
                            />
                          </a>
                          <a
                            href="https://www.linkedin.com/company/92807055/admin/feed/posts/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={linkedIn}
                              alt="linkedIn"
                              className="nav_social_icons"
                            />
                          </a>
                        </div>
                      )}
                    </li> */}
                    {/* <li>
                      {width <= 1023 && (
                        <div className="nav_social_media_icons">
                          <a
                            href={() => false}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Fbgrey className="nav_social_icons" />
                          </a>
                          <a
                            href={() => false}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Instagrey className="nav_social_icons" />
                          </a>
                          <a
                            href={() => false}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Linkgrey className="nav_social_icons" />
                          </a>
                        </div>
                      )}
                    </li> */}
                  </ul>
                </div>
              </nav>
            </header>
          </>
        )}
      </header>
    </>
  );
};

export default Header;
