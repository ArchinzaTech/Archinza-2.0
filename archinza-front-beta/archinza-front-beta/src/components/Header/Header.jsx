import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate, matchPath } from "react-router-dom";
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
  blacklogoBusiness,
  archinzaBusinessDesk,
  setting,
  logoutBlackIcon,
  downarrow,
  verifiedBlueTick,
  userOrange,
  whitelogoBusinessNew,
  darklogoBusinessNew,
  xMark,
  archinzaBusinessDeskWhite,
  lightModeIcon,
  darkModeIcon,
  darkModeIconWhite,
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
  aboutUsURLV2,
  planDetails,
  chooseYourPlan,
  businessProfileViewURL3,
  businessPaymentSuccessURL,
  pricingPlansURL,
  clientBusiness,
  clientPersonal,
  editProfileBusiness,
  faqsURL,
} from "../helpers/constant-words";
import HeaderNavItem from "./HeaderNavItem";
import GlowCta from "../GlowCta/GlowCta";
import config from "../../config/config";

import { useAuth } from "../../context/Auth/AuthState";
import _filter from "lodash/filter";
import http from "../../helpers/http";
import SiteLoader from "../SiteLoader/SiteLoader";
import { useBusinessContext } from "../../context/BusinessAccount/BusinessAccountState";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ToastMsg from "../ToastMsg/ToastMsg";
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
  const [userProfiles, setUserProfiles] = useState([]);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showAllLogoutPopup, setShowAllLogoutPopup] = useState(false);
  const BusinessContext = useBusinessContext();
  const [isBlackLogo, setIsBlackLogo] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const auth = useAuth();
  const navigate = useNavigate();
  const base_url = config.api_url;

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme); // State update
    localStorage.setItem("theme", newTheme); // localStorage update
    window.dispatchEvent(new Event("themeChanged")); // 🔥 triggers update
  };

  const THEME_TOGGLE_ALLOWED_URLS = [
    homepageURL,
    aboutUsURL,
    clientBusiness,
    clientPersonal,
    contactUsURL,
    faqsURL,
    privacypolicyURL,
    termsandconditionURL,
    // loginURL,
    // resetPassURL,
    // loginOtpURL
  ];

  const isThemeToggleAllowed = THEME_TOGGLE_ALLOWED_URLS.includes(
    location.pathname
  );

  useEffect(() => {
    setIsLightTheme(theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme, isThemeToggleAllowed]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    setIsLightTheme(savedTheme === "light");
  }, [location.pathname, isThemeToggleAllowed]);

  const fetchEntry = async (id, user_type, auth_type) => {
    setLoading(true);
    try {
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
          setIsPro(false); // Ensure business accounts don't use pro logo
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user) {
     
      //get all the profiles
      const users = localStorage.getItem("userProfiles");
      const currentLoggedinProfileToken = localStorage.getItem(
        config.jwt_auth_key
      );
      const parsedUsers = JSON.parse(users);
      const currentLoggedinUser = jwtDecode(currentLoggedinProfileToken);
      setUserProfiles(
        Object.entries(parsedUsers)
          .filter(([key]) => key !== currentLoggedinUser._id)
          .map(([key, value]) => ({ ...value, _id: key }))
      );

      const id = auth?.user?._id;
      if (auth.user.auth_type === "personal") {
        const user_type = auth?.user?.user_type;
        setUsername(auth?.user?.name);
        setIsPro(user_type === "DE");
        fetchEntry(id, user_type, auth?.user?.auth_type);
      } else {
        fetchEntry(id, "", auth?.user?.auth_type);
        auth.user["name"] = auth?.user?.business_name;
        setIsPro(false);
      }

      // setCorrespondingAccount(null);
    } else {
      setIsPro(false);
      setUsername("");
      setUserProfiles([]);
      setLoading(false);
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
      id: 2,
      type: "text",
      mainTitle: "For Business",
      mainLink: clientBusiness,
    },
    {
      id: 3,
      type: "text",
      mainTitle: "For Personal Use",
      mainLink: clientPersonal,
    },
    {
      id: 4,
      type: "text",
      mainTitle: "Know",
      mainLink: aboutUsURL,
    },
    {
      id: 5,
      type: "text",
      mainTitle: "Contact",
      // mainTitle: "CONNECT",
      mainLink: contactUsURL,
    },
    // {
    //   id: 6,
    //   type: "text",
    //   mainTitle: "BLOGS",
    //   mainLink: BlogsListingURL,
    // },
    // {
    //   id: 7,
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
    // {
    //   id: 1,
    //   type: "text",
    //   mainTitle: "Dashboard",
    //   mainLink: dashboardURL,
    // },
    {
      id: 2,
      type: "text",
      mainTitle: "For Business",
      mainLink: clientBusiness,
    },
    {
      id: 3,
      type: "text",
      mainTitle: "For Personal Use",
      mainLink: clientPersonal,
    },
    {
      id: 4,
      type: "text",
      mainTitle: "Know",
      mainLink: aboutUsURL,
    },
    {
      id: 5,
      type: "text",
      mainTitle: "Contact",
      // mainTitle: "CONNECT",
      mainLink: contactUsURL,
    },
    // {
    //   id: 6,
    //   type: "text",
    //   mainTitle: "BLOG",
    //   mainLink: homepageURL,
    // },
  ]);

  // Check if current page is one of the specified pages for non sticky nav
  const isNonStickyPage =
    location.pathname === businessProfileEditURL2 ||
    location.pathname === businessProfileViewURL2 ||
    location.pathname.includes("/business/profile/");

  useEffect(() => {
    setHeaderWidth(headerRef.current.clientWidth);
    setHeaderHeight(headerRef.current.clientHeight);
  }, [width, height]);

  const handlelogout = async () => {
    // 1. Get current user ID
    const currentToken = localStorage.getItem(config.jwt_auth_key);
    const currentUser = jwtDecode(currentToken);

    // 2. Remove current user from userProfiles
    const userProfiles = JSON.parse(
      localStorage.getItem("userProfiles") || "{}"
    );
    delete userProfiles[currentUser._id];
    localStorage.setItem("userProfiles", JSON.stringify(userProfiles));

    // 3. Check for next user
    const remainingUsers = Object.values(userProfiles);
    if (remainingUsers.length > 0) {
      // Pick the first user
      const nextUser = remainingUsers[0];
      localStorage.setItem(config.jwt_auth_key, nextUser.token);

      // Decode to check type
      const decoded = jwtDecode(nextUser.token);
      if (decoded.auth_type === "personal") {
        await auth.login(nextUser.token);
        window.location.replace(dashboardURL);
      } else {
        await auth.businessLogin(nextUser.token, false, "logout");
        // businessLogin already navigates
      }
    } else {
      // No users left, clear token and go to login
      localStorage.removeItem(config.jwt_auth_key);
      auth.logout(); // This will also set user to null
      setIsPro(false); // Reset isPro state
      navigate(loginURL, { replace: true });
    }
  };

  const handleAllLogout = async () => {
    localStorage.removeItem("userProfiles");
    auth.logout();
    navigate(loginURL, { replace: true });
    toast(
      <ToastMsg message={`You have logged out of all accounts`} />,
      config.success_toast_config
    );
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

  const getDesktopLogo = () => {
    if (!auth.isLoggedIn()) {
      return isLightTheme ? blacklogo : whitelogo;
    }

    if (auth?.user?.auth_type === "personal") {
      // Personal accounts - check if DE user type (pro)
      return auth?.user?.user_type === "DE" ? prologo : whitelogo;
    }

    // Business accounts
    return isLightTheme ? archinzaBusinessDesk : archinzaBusinessDeskWhite;
  };

  const getMobileLogo = () => {
    const isDarkMenu = !isLightTheme || isMenuActive;

    if (!auth?.user) {
      return isDarkMenu ? whitelogo : blacklogo;
    }

    if (auth.user.auth_type === "personal") {
      if (auth?.user?.user_type === "DE") {
        return isDarkMenu ? prologo : prologoblack;
      }
      return isDarkMenu ? whitelogo : blacklogo;
    }

    // Business accounts
    return isDarkMenu ? whitelogoBusinessNew : darklogoBusinessNew;
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

  const handleShowUserDropDown = () => {
    setIsMenuActive(false);
    setDropdownActive(true);
  };

  const handleHideUserDropDown = () => {
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
          <Link to={homepageURL}>
            {/* {!loading && ( */}
            <img
              width={isLightTheme ? 426 : 292}
              className={nav.class}
              style={
                isBlackLogo
                  ? {}
                  : isLightTheme || (!isPro && !isLightTheme)
                  ? { maxWidth: "25em" }
                  : {}
              }
              src={`${
                // !auth.isLoggedIn()
                //   ? isLightTheme
                //     ? blacklogo
                //     : whitelogo
                //   : isPro
                //   ? isLightTheme
                //     ? prologoblack
                //     : prologo
                //   : isLightTheme
                //   ? blacklogoBusiness
                //   : archinzaBusinessDeskWhite
                // !auth.isLoggedIn()
                //   ? isLightTheme
                //     ? blacklogo
                //     : whitelogo
                //   : auth?.user?.auth_type === "personal"
                //   ? isPro
                //     ? prologo
                //     : whitelogo
                //   : isLightTheme
                //   ? archinzaBusinessDesk
                //   : archinzaBusinessDeskWhite
                getDesktopLogo()
              }`}
              alt="logo"
              onClick={scrollHandler}
              loading="eager"
            />
            {/* )}  */}
          </Link>
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
    const pathsToCheck = [
      businessFormFiveLTURL,
      businessProfileEditURL2,
      businessProfileEditURL,
      businessProfileEditURL2,
      businessProfileViewURL,
      businessProfileViewURL3, // pattern
      businessPaymentSuccessURL,
      businessConnectViwUrl,
      registrationBusinessURL,
      congratulationsLightURL,
      registrationBusinessOTPURL,
      privacypolicyURL,
      termsandconditionURL,
      businessConnectEditUrl,
      planDetails,
      chooseYourPlan,
      pricingPlansURL,
      clientBusiness,
      clientPersonal,
      // homepageURL,
      editProfileBusiness,
    ];
    const isMatch = pathsToCheck.some((path) =>
      matchPath({ path, end: true }, location.pathname)
    );

    if (isThemeToggleAllowed) {
      const savedTheme = localStorage.getItem("theme") || "light";
      setIsLightTheme(savedTheme === "light");
    } else {
      setIsLightTheme(isMatch);
    }
    // if (
    //   location.pathname === businessFormFiveLTURL ||
    //   location.pathname === businessProfileEditURL2 ||
    //   location.pathname === businessProfileEditURL ||
    //   location.pathname === businessProfileEditURL2 ||
    //   location.pathname === businessProfileViewURL ||
    //   location.pathname === businessProfileViewURL3 ||
    //   location.pathname === businessConnectViwUrl ||
    //   location.pathname === registrationBusinessURL ||
    //   location.pathname === congratulationsLightURL ||
    //   location.pathname === registrationBusinessOTPURL ||
    //   location.pathname === privacypolicyURL ||
    //   location.pathname === termsandconditionURL ||
    //   location.pathname === businessConnectEditUrl ||
    //   location.pathname === planDetails ||
    //   location.pathname === chooseYourPlan
    // ) {
    //   setIsLightTheme(true);
    // } else {
    //   setIsLightTheme(false);
    // }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname === clientBusiness ||
      location.pathname === clientPersonal ||
      location.pathname === homepageURL
    ) {
      setIsBlackLogo(true);
    } else {
      setIsBlackLogo(false);
    }
    // setIsBlackLogo(false);
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

  return (
    <>
      {/* {loading && <SiteLoader whiteTheme={isLightTheme ? false : false} />} */}
      <div
        className={`desktop_blank ${
          isLightTheme ? "desktop_blank_light" : "desktop_blank_dark"
        } ${
          isNonStickyPage && !dropdownActive && !isMenuActive && width <= 992
            ? "backdrop-mobile-none"
            : ""
        } `}
      ></div>

      {/* Mobile My Account SideBar When Logged In */}
      {auth.isLoggedIn() && (
        <div
          className={`my_account_bg_overlay_full ${
            dropdownActive ? "show" : ""
          } ${isLightTheme ? "" : "dark"}`}
        >
          <div className="my_container">
            <div className="dropdown_box">
              <div className="drop_content_box">
                <Link
                  to={
                    auth?.user?.auth_type === "personal"
                      ? dashboardURL
                      : auth?.user?.status === "completed"
                      ? businessProfileEditURL2
                      : businessFormFiveLTURL
                  }
                  onClick={() => {
                    handleHideUserDropDown();
                    if (correspondingAccount) {
                      if (auth?.user?.auth_type === "personal") {
                        if (auth.user.name !== userName) {
                          auth.updateUser(correspondingAccount.data);
                        }
                      } else {
                        if (auth.user.business_name !== userName) {
                          auth.updateUser(correspondingAccount.data);
                        }
                      }
                    }
                  }}
                  className="dropdown_list name"
                >
                  <div
                    className="name_circle"
                    style={{
                      background:
                        auth?.user?.auth_type === "personal"
                          ? auth?.user?.userType?.color
                          : "#ed008c",
                    }}
                  >
                    <p className="name">
                      {userName ? userName?.charAt(0) : ""}
                    </p>
                  </div>
                  <p className="full_name">
                    {userName}
                    {auth?.user?.auth_type !== "personal" &&
                    auth?.user?.isVerified ? (
                      <img src={verifiedBlueTick} alt="Blue Tick" />
                    ) : (
                      ""
                    )}
                  </p>
                </Link>

                <div className="user_actions">
                  <button
                    className="left"
                    onClick={() => {
                      if (auth?.user?.auth_type === "personal") {
                        if (isPro || auth?.user?.user_type === "DE") {
                          navigate(editProfile);
                        }
                      } else {
                        if (auth?.user?.status === "completed") {
                          navigate(planDetails);
                        }
                      }
                    }}
                  >
                    <img src={setting} alt="Setting Icon" />
                    Settings
                  </button>
                  <button
                    className="right"
                    onClick={() => setShowLogoutPopup(true)}
                  >
                    <img src={logoutBlackIcon} alt="LogoutIcon" />
                    Logout
                  </button>
                </div>

                {userProfiles?.length !== 0 && (
                  <div
                    className="dropdown_list profiles"
                    onClick={handleHideUserDropDown}
                  >
                    {userProfiles.map((profile) => (
                      <Link
                        key={profile._id}
                        // to={() => false}
                        onClick={async () => {
                          const decoded = jwtDecode(profile.token);
                          if (decoded.auth_type === "personal") {
                            await auth.login(profile.token);
                            navigate(dashboardURL, {
                              replace: true,
                              state: {
                                showSwitchToast: true,
                                switchedProfileName: profile.name,
                              },
                            });
                            // toast(
                            //   <ToastMsg
                            //     message={`Switched to ${profile.name}`}
                            //   />,
                            //   config.success_toast_config
                            // );
                          } else {
                            await auth.businessLogin(profile.token);
                            toast(
                              <ToastMsg
                                message={`Switched to ${profile?.name}`}
                              />,
                              config.success_toast_config
                            );
                          }
                        }}
                        className="profile"
                      >
                        <div className="circle">{profile?.name?.charAt(0)}</div>
                        <p className="name">{profile?.name}</p>
                        <p className="full_name">
                          {profile?.isVerified ? (
                            <img src={verifiedBlueTick} alt="Blue Tick" />
                          ) : (
                            ""
                          )}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="dropdown_list add_account">
                  <div
                    className="account_login add_acc"
                    onClick={() => setIsNewAccDropdown(!isNewAccDropdown)}
                  >
                    ADD ACCOUNT
                    <img
                      className="dropdown_arrow"
                      src={downarrow}
                      alt="down arrow"
                    />
                  </div>
                  {isNewAccDropdown && (
                    <div
                      className="login_wrapper"
                      onClick={handleHideUserDropDown}
                    >
                      <Link to={loginURL} className="login_link">
                        LOG INTO EXISTING ACCOUNT
                      </Link>
                      <Link to={accountCategoryURL} className="login_link">
                        CREATE NEW ACCOUNT
                      </Link>
                    </div>
                  )}
                </div>
                {localStorage.getItem("userProfiles") &&
                  Object.keys(JSON.parse(localStorage.getItem("userProfiles")))
                    .length > 1 && (
                    <button
                      className="dropdown_list account_logout"
                      // onClick={handlelogout}
                      onClick={() => setShowAllLogoutPopup(true)}
                    >
                      <img
                        className="logout_icon"
                        src={logoutBlackIcon}
                        alt="down arrow"
                      />
                      Log Out Of All Accounts
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile My Account SideBar When Not Logged In*/}
      {!auth.isLoggedIn() && (
        <div
          className={`my_account_bg_overlay_full ${
            dropdownActive ? "show" : ""
          } ${isLightTheme ? "" : "dark"}`}
        >
          <div className="my_container">
            <div className="dropdown_box">
              <div className="drop_content_box">
                <div className="dropdown_list add_account">
                  <div
                    className="account_login add_acc"
                    // onClick={() => setIsNewAccDropdown(!isNewAccDropdown)}
                  >
                    ADD ACCOUNT
                    <img
                      className="dropdown_arrow"
                      src={downarrow}
                      alt="down arrow"
                    />
                  </div>
                  {/* {isNewAccDropdown && ( */}
                  <div className="login_wrapper">
                    <Link
                      to={loginURL}
                      onClick={() => setDropdownActive(false)}
                      className="login_link"
                    >
                      LOG INTO EXISTING ACCOUNT
                    </Link>
                    <Link
                      to={accountCategoryURL}
                      onClick={() => setDropdownActive(false)}
                      className="login_link"
                    >
                      CREATE NEW ACCOUNT
                    </Link>
                  </div>
                  {/* )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Side Bar Hamburger */}
      {width <= 1080 && (
        <nav
          className={`mobile_nav_links ${isMenuActive ? "show" : ""} ${
            theme === "light" ? "light_mode_mobile_sidebar" : ""
          }`}
        >
          <div className="my_container">
            <ul>
              {mobNavLinksArr.map((navData, i) => (
                <HeaderNavItem
                  navData={navData}
                  key={parseInt(navData.id)}
                  arrIndex={i}
                  handleNavIndex={handleNavIndex}
                  navActiveIndex={navActiveIndex}
                />
              ))}
              {isThemeToggleAllowed && (
                <li
                  className="nav_item"
                  onClick={() => {
                    toggleTheme();
                    setIsMenuActive(false); // ✅ Sidebar close
                  }}
                >
                  <div className="nav_link">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    <img
                      src={theme === "dark" ? lightModeIcon : darkModeIconWhite}
                      alt="icon"
                      loading="lazy"
                      className="active_arrow"
                      style={{
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                </li>
              )}
            </ul>
            <div className="line"></div>
            {!auth.isLoggedIn() && (
              <div className="actions">
                <GlowCta link={accountCategoryURL} text="Get Early Access" />
                <Link className="login_link" to={loginURL}>
                  <img src={userOrange} alt="User Icon" />
                  <span>LOGIN </span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Logout Popup */}
      {auth.isLoggedIn() && showLogoutPopup && (
        <div className="popup_wrapper">
          <div className="popup">
            <p className="text">Logout of your account?</p>
            <div className="buttons">
              <button
                className="logout"
                onClick={() => {
                  handlelogout();
                  setShowLogoutPopup(false);
                  setDropdownActive(false);
                }}
              >
                <img src={logoutBlackIcon} alt="Logout Icon" />
                Logout
              </button>
              <button
                className="cancel"
                onClick={() => setShowLogoutPopup(false)}
              >
                <img src={xMark} alt="X Mark Icon" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {auth.isLoggedIn() && showAllLogoutPopup && (
        <div className="popup_wrapper">
          <div className="popup">
            <p className="text">Logout of all accounts?</p>
            <div className="buttons">
              <button
                className="logout"
                onClick={() => {
                  handleAllLogout();
                  setShowAllLogoutPopup(false);
                  setDropdownActive(false);
                }}
              >
                <img src={logoutBlackIcon} alt="Logout Icon" />
                Logout
              </button>
              <button
                className="cancel"
                onClick={() => setShowAllLogoutPopup(false)}
              >
                <img src={xMark} alt="X Mark Icon" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <header
        ref={headerRef}
        className={`header_sec ${
          isLightTheme ? "header_light" : "header_dark"
        } ${isMenuActive ? "menuactive" : ""} ${
          isNonStickyPage && !dropdownActive && !isMenuActive && width <= 992
            ? "non-sticky-mobile"
            : ""
        } `}
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
                  {/* {auth.isLoggedIn() === true && (
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
                  )} */}

                  {navlinkList}

                  {isThemeToggleAllowed && (
                    <li>
                      <button
                        className="theme-toggle-btn nav_tab"
                        onClick={toggleTheme}
                      >
                        <img
                          src={theme === "dark" ? lightModeIcon : darkModeIcon}
                          alt={theme === "dark" ? "Light Mode" : "Dark Mode"}
                          className="icon_theme_toggle"
                        />
                      </button>
                    </li>
                  )}

                  <li>
                    {auth.isLoggedIn() === true && (
                      <>
                        <div
                          className="nav_tab user_tab"
                          onClick={() => setDropdownActive(!dropdownActive)}
                          // onClick={userStatusHandler}
                          // onMouseOver={() => setDropdownActive(true)}
                          // onMouseOut={() => setDropdownActive(false)}
                        >
                          <Link
                            className={`user ${
                              !isLightTheme && "dark_cta_account"
                            }`}
                            to={() => false}
                            onClick={() => setDropdownActive(false)}
                          >
                            {/* <div className="title">
                            {usersArr[userCategory].users[0].name}
                          </div> */}
                            <p>MY ACCOUNT</p>
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
                                {userName ? userName?.charAt(0) : ""}
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
                        {dropdownActive === true && (
                          <>
                            <div
                              className={`dropdown_box ${
                                isLightTheme ? "" : "dark"
                              }`}
                              // onMouseOver={() => setDropdownActive(true)}
                              // onMouseOut={() => setDropdownActive(false)}
                            >
                              <div className="drop_content_box">
                                {/* <div className="dropdown_box_arrow">
                              <img
                                src={dropdownarrow}
                                alt="up arrow"
                                className="up_arrow"
                              />
                            </div> */}
                                <Link
                                  to={
                                    auth?.user?.auth_type === "personal"
                                      ? dashboardURL
                                      : auth?.user?.status === "completed"
                                      ? businessProfileEditURL2
                                      : businessFormFiveLTURL
                                  }
                                  onClick={() => {
                                    handleHideUserDropDown();
                                    if (correspondingAccount) {
                                      if (
                                        auth?.user?.auth_type === "personal"
                                      ) {
                                        if (auth.user.name !== userName) {
                                          auth.updateUser(
                                            correspondingAccount.data
                                          );
                                        }
                                      } else {
                                        if (
                                          auth.user.business_name !== userName
                                        ) {
                                          auth.updateUser(
                                            correspondingAccount.data
                                          );
                                        }
                                      }
                                    }
                                  }}
                                  className="dropdown_list name"
                                >
                                  <div
                                    className="name_circle"
                                    style={{
                                      background:
                                        auth?.user?.auth_type === "personal"
                                          ? auth?.user?.userType?.color
                                          : "#ed008c",
                                    }}
                                  >
                                    <p className="name">
                                      {userName ? userName?.charAt(0) : ""}
                                    </p>
                                  </div>
                                  <p className="full_name">
                                    {userName}
                                    {auth?.user?.auth_type !== "personal" &&
                                    auth?.user?.isVerified ? (
                                      <img
                                        src={verifiedBlueTick}
                                        alt="Blue Tick"
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                </Link>

                                <div className="user_actions">
                                  <button
                                    className="left"
                                    onClick={() => {
                                      if (
                                        auth?.user?.auth_type === "personal"
                                      ) {
                                        if (
                                          isPro ||
                                          auth?.user?.user_type === "DE"
                                        ) {
                                          navigate(editProfile);
                                        }
                                      } else {
                                        if (
                                          auth?.user?.status === "completed"
                                        ) {
                                          navigate(planDetails);
                                        }
                                      }
                                      setDropdownActive(false);
                                    }}
                                  >
                                    <img src={setting} alt="Setting Icon" />
                                    Settings
                                  </button>
                                  <button
                                    className="right"
                                    onClick={() => setShowLogoutPopup(true)}
                                  >
                                    <img
                                      src={logoutBlackIcon}
                                      alt="LogoutIcon"
                                    />
                                    Logout
                                  </button>
                                </div>

                                {userProfiles?.length !== 0 && (
                                  <div
                                    className="dropdown_list profiles"
                                    onClick={handleHideUserDropDown}
                                  >
                                    {userProfiles.map((profile) => (
                                      <Link
                                        key={profile._id}
                                        // to={() => false}
                                        onClick={async () => {
                                          const decoded = jwtDecode(
                                            profile.token
                                          );
                                          if (
                                            decoded.auth_type === "personal"
                                          ) {
                                            await auth.login(profile.token);
                                            navigate(dashboardURL, {
                                              replace: true,
                                              state: {
                                                showSwitchToast: true,
                                                switchedProfileName:
                                                  profile.name,
                                              },
                                            });
                                            // toast(
                                            //   <ToastMsg
                                            //     message={`Switched to ${profile.name}`}
                                            //   />,
                                            //   config.success_toast_config
                                            // );
                                          } else {
                                            await auth.businessLogin(
                                              profile.token
                                            );
                                            toast(
                                              <ToastMsg
                                                message={`Switched to ${profile.name}`}
                                              />,
                                              config.success_toast_config
                                            );
                                          }
                                        }}
                                        className="profile"
                                      >
                                        <div className="circle">
                                          {profile?.name?.charAt(0)}
                                        </div>
                                        <p className="name">{profile?.name}</p>
                                        <p className="full_name">
                                          {profile?.isVerified ? (
                                            <img
                                              src={verifiedBlueTick}
                                              alt="Blue Tick"
                                            />
                                          ) : (
                                            ""
                                          )}
                                        </p>
                                      </Link>
                                    ))}
                                  </div>
                                )}

                                {/* <div className="dropdown_list">
                          {usersArr[userCategory].users[0].company}
                        </div> */}
                                <div className="dropdown_list add_account">
                                  <div
                                    className="account_login add_acc"
                                    onClick={() =>
                                      setIsNewAccDropdown(!isNewAccDropdown)
                                    }
                                  >
                                    ADD ACCOUNT
                                    <img
                                      className="dropdown_arrow"
                                      src={downarrow}
                                      alt="down arrow"
                                    />
                                  </div>
                                  {isNewAccDropdown && (
                                    <div className="login_wrapper">
                                      <Link
                                        to={loginURL}
                                        className="login_link"
                                        onClick={handleHideUserDropDown}
                                      >
                                        LOG INTO EXISTING ACCOUNT
                                      </Link>
                                      <Link
                                        to={accountCategoryURL}
                                        className="login_link"
                                        onClick={handleHideUserDropDown}
                                      >
                                        CREATE NEW ACCOUNT
                                      </Link>
                                    </div>
                                  )}
                                </div>
                                {localStorage.getItem("userProfiles") &&
                                  Object.keys(
                                    JSON.parse(
                                      localStorage.getItem("userProfiles")
                                    )
                                  ).length > 1 && (
                                    <button
                                      className="dropdown_list account_logout"
                                      onClick={() =>
                                        setShowAllLogoutPopup(true)
                                      }
                                    >
                                      <img
                                        className="logout_icon"
                                        src={logoutBlackIcon}
                                        alt="down arrow"
                                      />
                                      Log Out Of All Accounts
                                    </button>
                                  )}
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                    {auth.isLoggedIn() === false && (
                      <div
                        className={`nav_tab login_tab login_tab--pill overflow-visible ${
                          isLightTheme ? "light_theme" : ""
                        }`}
                      >
                        <Link
                          className="login wrapper_login_icon_tooltp"
                          to={loginURL}
                        >
                          {/* <div className="title">LOGIN</div> */}
                          <div className="position-relative d-flex align-items-center">
                            <div
                              className={`login_txt ${
                                isLightTheme && "text-white"
                              }`}
                            >
                              LOGIN
                            </div>
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
                  </li>

                  {/* {auth.isLoggedIn() === false && (
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
                  )} */}

                  {auth.isLoggedIn() === false && (
                    <li>
                      {(location.pathname === homepageURL ||
                        location.pathname === accountCategoryURL ||
                        location.pathname === contactUsURL ||
                        location.pathname === BlogsListingURL ||
                        location.pathname === BlogsInnerURL ||
                        location.pathname === aboutUsURL ||
                        location.pathname === aboutUsURLV2 ||
                        location.pathname === loginURL ||
                        location.pathname === resetPassURL ||
                        location.pathname === clientBusiness ||
                        location.pathname === clientPersonal ||
                        location.pathname === privacypolicyURL ||
                        location.pathname === termsandconditionURL ||
                        location.pathname === faqsURL ||
                        location.pathname === loginOtpURL) && (
                        <div className={`nav_tab bg_cta `}>
                          <Link
                            className="multi_text multi_text_white"
                            to={accountCategoryURL}
                          >
                            <div className="title">Get Early Access</div>
                            <div>
                              <img
                                width={28.48}
                                src={rightarrowwhite}
                                // src={
                                //   isLightTheme
                                //     ? rightarrowblack
                                //     : rightarrowwhite
                                // }
                                alt="right arrow"
                                className="right_arrow"
                              />
                            </div>
                          </Link>
                        </div>
                      )}
                      {/* {(location.pathname === registrationFormURL ||
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
                      )} */}
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
                    } ${theme === "light" ? "menu_light_mode_sideBar" : ""}`}
                    onClick={handleHamburgerClick}
                  >
                    <div className="line line1"></div>
                    <div className="line line2"></div>
                    <div className="line line3"></div>
                  </div>
                  <div className="logo_wrapper">
                    <Link className="logo_link" to="/">
                      {/* <img
                        src={`${
                          isPro
                            ? isLightTheme
                              ? prologoblack
                              : prologo
                            : isLightTheme
                            ? // ? blacklogo
                              blacklogoBusiness
                            : whitelogo
                        }`}
                        style={isLightTheme ? { maxWidth: "21em" } : {}}
                        alt="atlas logo"
                        className="atlas_logo"
                        onClick={() => setIsPro(true)}
                      /> */}
                      <img
                        src={
                          // isLightTheme && !isMenuActive
                          //   ? auth?.user
                          //     ? auth.user.auth_type === "personal"
                          //       ? auth?.user?.user_type === "DE"
                          //         ? prologoblack
                          //         : blacklogo
                          //       : darklogoBusinessNew
                          //     : blacklogo
                          //   : auth?.user
                          //   ? auth.user.auth_type === "personal"
                          //     ? auth?.user?.user_type === "DE"
                          //       ? whitelogo
                          //       : prologo
                          //     : whitelogoBusinessNew
                          //   : whitelogo
                          getMobileLogo()
                        }
                        // style={
                        //   isBlackLogo
                        //     ? {}
                        //     : isLightTheme
                        //     ? { maxWidth: "21em" }
                        //     : {}
                        // }
                        alt="Archinza Logo"
                        className="atlas_logo"
                      />
                    </Link>
                  </div>
                  {auth.isLoggedIn() === true && (
                    <div className="mobile_my_account">
                      <div
                        onClick={
                          dropdownActive
                            ? handleHideUserDropDown
                            : handleShowUserDropDown
                        }
                        className="initial_circle"
                        style={{
                          background:
                            auth?.user?.auth_type === "personal"
                              ? auth?.user?.userType?.color
                              : "#ed008c",
                        }}
                      >
                        <div className="name">
                          {userName ? userName?.charAt(0) : ""}
                        </div>
                      </div>
                    </div>
                  )}
                  {auth.isLoggedIn() === false && (
                    <button
                      onClick={
                        dropdownActive
                          ? handleHideUserDropDown
                          : handleShowUserDropDown
                      }
                    >
                      <img src={userOrange} alt="User Icon" />
                    </button>
                  )}

                  {/* <nav className="nav_links_wrapper">
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
                              location.pathname === aboutUsURLV2 ||
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

                        <li>
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
                        </li>
                        <li>
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
                        </li>
                      </ul>
                    </div>
                  </nav> */}
                </div>
              </div>
            </header>
            {/* <div className="sidebar"></div> */}
          </>
        )}
        {auth.isLoggedIn() && dropdownActive && (
          <div
            className={`my_account_bg_overlay_half ${
              isLightTheme ? "" : "dark"
            }`}
          ></div>
        )}
      </header>
    </>
  );
};

export default Header;
