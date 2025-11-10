import React, { useRef, useState, useEffect } from "react";
import styles from "./plan.module.scss";
import "./plan.scss";
import {
  dropdownOrangeIcon,
  logoutIconBlack,
  phonepe,
  settingIcon,
  upiLogo,
  // Blue strip start here
  CopyLinkCircleOrange,
  editicon,
  faceBookCircleOrange,
  linkedInLinkCircleOrange,
  shareBlackInside,
  verifiedBlueIcon,
  whatsappCircleOrange,
  XCircleOrange,
  logoutBlackIcon,
  xMark,
  // Blue strip end here
} from "../../../../images";
import { Link, useNavigate } from "react-router-dom";
import FooterV2 from "../../../../components/FooterV2/FooterV2";
import {
  chooseYourPlan,
  dashboardURL,
  editProfile,
  invoiceUrl,
  loginURL,
} from "../../../../components/helpers/constant-words";
import { useWindowSize } from "react-use";

// <========================== Blue strip start here ===============================>
import { useBusinessContext } from "../../../../context/BusinessAccount/BusinessAccountState";
import { businessProfileViewURL2 } from "../../../../components/helpers/constant-words";
import http from "../../../../helpers/http";
import config from "../../../../config/config";
import { toast } from "react-toastify";
import ToastMsg from "../../../../components/ToastMsg/ToastMsg";
import helper from "../../../../helpers/helper";
import { Events, Link as ScrollLink } from "react-scroll";
import EditFirmNamePopup from "./../PopUpComponents/EditFirmNamePopup/EditFirmNamePopup";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../../context/Auth/AuthState";
// <========================== Blue strip start end ===============================>

const planList = ["PLAN DETAILS", "PAYMENT METHOD", "PAYMENT HISTORY"];

const Plan = () => {
  const [isHide, setIsHide] = useState(true);
  const [isPlan, setIsPlan] = useState(0);
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  // <========================== Blue strip start here ===============================>
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const headerRef = useRef(null); // Ref for header section
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
  const [showEditFirmNamePopup, setShowEditFirmNamePopup] = useState(false);
  const [plans, setPlans] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const stickyTabsRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0); // State for header height
  const [stickyTabsHeight, setStickyTabsHeight] = useState(0);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const handleOptionsPopupOpen = () => setShowOptionsPopup(true);
  const { data, update, fetchData } = useBusinessContext();
  const auth = useAuth();

  const paymentMethodMap = {
    card: "Card",
    vpa: "UPI",
    netbanking: "Netbanking",
    wallet: "Wallet",
    upi: "UPI",
    nb: "Netbanking",
    unknown: "Other",
  };
  // Calculate header and sticky tabs height dynamically
  useEffect(() => {
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      const height = rect.height; // This gives fractional pixels
      setHeaderHeight(height);
    }
    if (stickyTabsRef.current) {
      const rect = stickyTabsRef.current.getBoundingClientRect();
      const height = rect.height;
      setStickyTabsHeight(height);
    }
    setCurrentPlan(data?.subscription);
  }, [width, data?.business_name, data?.brand_logo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsHovered(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditFirmNamePopupOpen = () => setShowEditFirmNamePopup(true);
  const handleEditFirmNamePopupClose = () => setShowEditFirmNamePopup(false);

  const shareUrl = window.location.host + `${businessProfileViewURL2}`;
  // const shareUrl = window.location.host + `/${data?.username}`;
  const shareTitle = data?.business_name || "Check out this business profile!";

  useEffect(() => {
    const fetchPlans = async () => {
      const plansData = await http.get(`${config.api_url}/business-plans`);
      setPlans(plansData?.data || []);
    };
    if (data?._id) {
      fetchPaymentHistory(data);
    }
    console.log(window.location.pathname);
    fetchPlans();
  }, [data?._id]);

  useEffect(() => {
    if (isPlan === 1) {
      fetchCurrentPaymentMethod();
    }
  }, [isPlan, paymentHistory]);

  const fetchPaymentHistory = async (data) => {
    const payments = await http.get(
      `${config.api_url}/business-plans/${data?._id}/payments`
    );

    if (payments?.data) {
      setPaymentHistory(payments.data || []);
    }
  };

  const checkPaymentMethodUpdate = async (subscriptionId, intervalId) => {
    if (intervalId) clearInterval(intervalId);
    const response = await http.get(
      `${config.api_url}/business-plans/latest/${subscriptionId}`
    );
    if (response?.data?.isPaymentMethodUpdating === false) {
      await fetchData(data._id);
      setIsUpdatingPayment(false);
      fetchCurrentPaymentMethod(); // Refresh payment method
    } else {
      // Continue polling if not updated
      setTimeout(
        () => checkPaymentMethodUpdate(subscriptionId, intervalId),
        5000
      );
    }
  };

  const fetchCurrentPaymentMethod = async () => {
    const latestSubscriptionId = paymentHistory?.[0]?.subscriptionId;
    if (latestSubscriptionId) {
      const paymentMethod = await http.get(
        `${config.api_url}/business-plans/payment-method/${latestSubscriptionId}`
        // `${config.api_url}/business-plans/payment-method/sub_RIy2gm2Ca7H6M8`
      );
      setCurrentPaymentMethod(paymentMethod?.data || null);
      setIsUpdatingPayment(false);
    } else {
      setCurrentPaymentMethod(false);
    }
  };

  const handleInvoiceView = async (paymentId) => {
    const response = await http.get(
      `${config.api_url}/business-plans/invoice/${paymentId}`
    );
    if (response?.data?.status && response?.data?.invoice) {
      const invoiceId = response.data.invoice.invoiceId;
      window.open(`/invoice/print/${invoiceId}`, "_blank");
    } else {
      toast(
        <ToastMsg message="Invoice not found" danger={true} />,
        config.error_toast_config
      );
    }
  };

  const fetchPaymentMethodShortUrl = async () => {
    const latestSubscriptionId = paymentHistory?.[0]?.subscriptionId;
    if (latestSubscriptionId) {
      const response = await http.get(
        `${config.api_url}/business-plans/subscription/${latestSubscriptionId}/change-method`
      );
      if (response?.data?.shortUrl) {
        window.open(response.data.shortUrl, "_blank");
        http.put(
          `${config.api_url}/business-plans/subscription/${latestSubscriptionId}`,
          { isPaymentMethodUpdating: true }
        );
        setIsUpdatingPayment(true);
        const intervalId = setInterval(() => {
          checkPaymentMethodUpdate(latestSubscriptionId);
        }, 5000);
      }
    }
  };

  const handlePlanChange = (e) => {
    e.preventDefault(); // prevent <Link> default navigation

    if (data?.isVerified) {
      navigate(chooseYourPlan);
    } else {
      toast(
        <ToastMsg
          message="You need to be verified in order to change the plan."
          danger={true}
        />,
        config.error_toast_config
      );
    }
  };

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
        await auth.businessLogin(nextUser.token, "logout");
        // businessLogin already navigates
      }
    } else {
      // No users left, clear token and go to login
      localStorage.removeItem(config.jwt_auth_key);
      auth.logout(); // This will also set user to null
      navigate(loginURL, { replace: true });
    }
  };

  const handleUpdatePayment = async () => {
    // e.preventDefault();
    const latestSubscriptionId = paymentHistory?.[0]?.subscriptionId;
    if (!latestSubscriptionId) return;

    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = async () => {
        try {
          const options = {
            key: config.razorpay_key_id, // Your public key
            subscription_id: latestSubscriptionId,
            subscription_card_change: true,
            // amount, // e.g., 100 (in paise)
            // currency,
            name: "Update Payment Method",
            description: "Securely update your payment details",
            // order_id: orderId,
            payment_methods: {
              card: 1,
              upi: 1,
              netbanking: 1,
            },
            handler: async (response) => {
              // Backend: Verify & save new method to subscription
              await http.post(
                `${config.api_url}/business-plans/verify-update-method`,
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id,
                  razorpay_signature: response.razorpay_signature,
                }
              );
              setIsUpdatingPayment(true);
              // Start polling (reuse your checkPaymentMethodUpdate)
              fetchCurrentPaymentMethod();
              toast(
                <ToastMsg message="Payment method updated successfully!" />,
                config.success_toast_config
              );
            },
            prefill: {
              name: data?.business_name,
              email: data?.email || "", // From context/user data
              contact: data?.phone || "",
            },
            theme: { color: "#F37254" }, // Optional
            modal: { ondismiss: () => console.log("Dismissed") },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (err) {
          console.log(err.message);
          toast(
            <ToastMsg message="Failed to initiate update" danger={true} />,
            config.error_toast_config
          );
        }
      };
    } catch (err) {
      toast(
        <ToastMsg message="Failed to initiate update" danger={true} />,
        config.error_toast_config
      );
    }
  };

  const handleSaveBusinessDetails = async (businessData) => {
    const formData = new FormData();
    businessData.logoFile && formData.append("file", businessData.logoFile);
    businessData.businessName &&
      formData.append("business_name", businessData.businessName);
    const response = await http.post(
      `${config.api_url}/business/business-details/${data._id}`,
      formData
    );

    if (response?.data) {
      await update({
        ...data,
        business_name: businessData.businessName,
        ...(response?.data?.brand_logo && {
          brand_logo: response.data.brand_logo,
        }),
      });
      toast(
        <ToastMsg message={`Changes saved successfully`} />,
        config.success_toast_config
      );
      // setShowEditFirmNamePopup(false);
    }
  };

  // <========================== Blue strip start end ===============================>

  return (
    <>
      <main className={`plan_mainsec ${styles.plan_main}`}>
        {/* <========================== Blue strip start here ===============================> */}
        <section
          className="bedit_sec0 bedit_sec1 bdt_1_sect"
          ref={headerRef}
          style={{
            zIndex: "1",
          }}
        >
          <div className="heading_container wrap_fm_strip">
            <div className="my_container d-flex">
              <div className="head_container flex-grow-1">
                <h1 className="title firm_name_title position-relative">
                  <div
                    className="FirmName_image_wrapper firm_nm_strip"
                    style={{
                      backgroundColor: data?.brand_logo && "transparent",
                    }}
                  >
                    {data?.brand_logo ? (
                      <img
                        src={`${config.aws_object_url}business/${data?.brand_logo}`}
                        alt="Firm-image"
                        className="firm_image_edit"
                      />
                    ) : (
                      helper.generateInitials(data?.business_name)
                    )}
                  </div>

                  {data?.business_name?.toUpperCase()}
                  {data?.isVerified && (
                    <img
                      src={verifiedBlueIcon}
                      alt="verified icon"
                      className="verified_icon_top_header"
                    />
                  )}
                </h1>

                <div className="social_icon_container">
                  <>
                    <Link
                      to={() => false}
                      className="social_icon_wrapper"
                      onClick={handleEditFirmNamePopupOpen}
                    >
                      <img
                        src={editicon}
                        alt="Edit icon"
                        className="heart_icon"
                      />
                    </Link>

                    <Link
                      to={() => false}
                      className="social_icon_wrapper position-relative"
                      ref={menuRef}
                      onClick={
                        width <= 768
                          ? handleOptionsPopupOpen
                          : () => setIsHovered(!isHovered)
                      }
                    >
                      <img
                        src={shareBlackInside}
                        alt="share icon"
                        className="share_icon"
                      />

                      <div
                        className={`hover-menu hover-menu-share ${
                          isHovered ? "show" : "hide"
                        }`}
                      >
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            shareTitle + " " + shareUrl
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="share_top_header_menu_item"
                          onClick={() => {
                            window.open(
                              `https://api.whatsapp.com/send?text=${encodeURIComponent(
                                shareTitle + " " + shareUrl
                              )}`
                            );
                          }}
                        >
                          <img
                            src={whatsappCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />
                          WhatsApp
                        </a>

                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                            shareUrl
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            window.open(
                              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                shareUrl
                              )}`
                            );
                          }}
                          className="share_top_header_menu_item"
                        >
                          <img
                            src={linkedInLinkCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />{" "}
                          LinkedIn
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            shareTitle
                          )}&url=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            window.open(
                              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                shareTitle
                              )}&url=${encodeURIComponent(shareUrl)}`
                            );
                          }}
                          className="share_top_header_menu_item"
                        >
                          <img
                            src={XCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />{" "}
                          X
                        </a>

                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            shareUrl
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            window.open(
                              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                shareUrl
                              )}`
                            );
                          }}
                          className="share_top_header_menu_item"
                        >
                          <img
                            src={faceBookCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />{" "}
                          Facebook
                        </a>
                        <div
                          onClick={() => {
                            if (navigator.clipboard && window.isSecureContext) {
                              navigator.clipboard
                                .writeText(shareUrl)
                                .then(() => {
                                  toast(
                                    <ToastMsg message="Link copied to clipboard" />,
                                    config.success_toast_config
                                  );
                                });
                            } else {
                              const textArea =
                                document.createElement("textarea");
                              textArea.value = shareUrl;
                              textArea.style.position = "fixed";
                              textArea.style.left = "-999999px";
                              document.body.appendChild(textArea);
                              textArea.focus();
                              textArea.select();
                              document.execCommand("copy");
                              textArea.remove();

                              toast(
                                <ToastMsg message="Link copied to clipboard" />,
                                config.success_toast_config
                              );
                            }
                          }}
                          className="share_top_header_menu_item border-0"
                        >
                          <img
                            src={CopyLinkCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />{" "}
                          Copy Link
                        </div>
                      </div>
                    </Link>
                  </>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <========================== Blue strip start end ===============================> */}

        <section className={styles.plan_sec1}>
          <div className="my_container">
            <div className={styles.plan_row}>
              <div className={styles.plan_col}>
                {width > 767 ? (
                  <>
                    <div className={styles.set_wrapper}>
                      <img
                        src={settingIcon}
                        alt="setting"
                        className={styles.set_icon}
                      />
                      <h2 className={styles.main_title}>My Settings</h2>
                    </div>

                    <h3 className={`${styles.title} ${styles.edit_title}`}>
                      <Link to={editProfile}>EDIT PROFILE</Link>
                    </h3>

                    <div className={styles.sub_wrapper}>
                      <div
                        className={styles.drop_wrapper}
                        onClick={() => setIsHide(!isHide)}
                      >
                        <h3 className={`${styles.title}`}>MY SUBSCRIPTION</h3>
                        <img
                          src={dropdownOrangeIcon}
                          alt="down arrow"
                          className={styles.drop_arrow}
                        />
                      </div>

                      {isHide && (
                        <div className={styles.list_wrapper}>
                          {planList?.map((list, i) => (
                            <p
                              className={`${styles.plan_lists} ${
                                isPlan === i ? styles.active : ""
                              }`}
                              key={`plan-${i}`}
                              onClick={() => {
                                setIsPlan(i);
                              }}
                            >
                              {list}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    <h3 className={styles.title}>HELP CENTRE</h3>

                    <div
                      onClick={() => setShowLogoutPopup(true)}
                      className={styles.logout_cta}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={logoutIconBlack}
                        alt="logout"
                        className={styles.logout_icon}
                      />
                      <span className={styles.cta_text}>Logout</span>
                    </div>
                  </>
                ) : (
                  <div className={styles.list_wrapper}>
                    {planList?.map((list, i) => (
                      <p
                        className={`${styles.plan_lists} ${
                          isPlan === i ? styles.active : ""
                        }`}
                        key={`plan-${i}`}
                        onClick={() => {
                          setIsPlan(i);
                        }}
                      >
                        {list}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.plan_col}>
                {isPlan === 0 && (
                  <div className={styles.planDetails_container}>
                    {width > 767 && (
                      <h2 className={styles.main_title}>Plan Details</h2>
                    )}

                    <div className={styles.plan_details}>
                      <div className={styles.plan_data}>
                        <div className={styles.text_container}>
                          <h3 className={styles.plan_text}>
                            {currentPlan?.plan?.name?.toUpperCase() || ""}
                          </h3>
                          {currentPlan?.plan?.price === 0 ? (
                            <p className={styles.plan_price}>
                              <span>₹10,000</span> FREE
                            </p>
                          ) : (
                            <p className={styles.plan_price}>
                              <span>₹10,000 </span>₹{currentPlan?.plan?.price}
                            </p>
                          )}
                        </div>
                        <p className={styles.desc}>
                          {currentPlan?.plan?.description || ""}
                        </p>
                      </div>

                      {currentPlan?.plan?.name === "Starter Plan" && (
                        <div className={styles.planChange_wrapper}>
                          <Link
                            to="#"
                            onClick={handlePlanChange}
                            className={styles.planChange_drop_wrapper}
                          >
                            <h3 className={`${styles.title}`}>Change Plan</h3>
                            <img
                              src={dropdownOrangeIcon}
                              alt="right arrow"
                              className={styles.right_arrow}
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isPlan === 1 && (
                  <div className={styles.paymentMeth_container}>
                    {width > 767 && (
                      <h2 className={styles.main_title}>Payment Method</h2>
                    )}
                    <p className={styles.desc}>
                      Control how you pay for your membership
                    </p>
                    <div className={styles.update_wrapper}>
                      <div className={styles.img_wrapper}>
                        {/* <img
                          src={upiLogo}
                          alt="upi logo"
                          className={styles.pay_logo}
                        /> */}
                        {currentPaymentMethod ? (
                          <p
                            className={`${styles.method_text} ${styles.update}`}
                          >
                            {currentPaymentMethod?.type} -{" "}
                            {currentPaymentMethod?.info || ""}
                          </p>
                        ) : currentPlan?.plan?.isDefault ? (
                          <p
                            className={`${styles.method_text} ${styles.update}`}
                          >
                            Upgrade to change payment method.
                          </p>
                        ) : (
                          <p
                            className={`${styles.method_text} ${styles.update}`}
                          >
                            Loading payment method, please wait...
                          </p>
                        )}

                        {/* <p className={`${styles.method_text} ${styles.update}`}>
                          h***@1102
                        </p> */}
                      </div>
                      {currentPaymentMethod && !currentPlan?.plan?.isDefault}
                      {!currentPlan?.plan?.isDefault && (
                        <a
                          href="#"
                          className={styles.update}
                          onClick={async (e) => {
                            e.preventDefault();
                            await handleUpdatePayment();
                          }}
                        >
                          {isUpdatingPayment
                            ? "Fetching, Please wait..."
                            : "Update"}
                        </a>
                      )}
                    </div>
                    {/* <h3 className={styles.sub_title}>Change Payment Method</h3> */}
                  </div>
                )}

                {isPlan === 2 && (
                  <div className={styles.history_container}>
                    {width > 767 && (
                      <h2 className={styles.main_title}>Payment History</h2>
                    )}
                    {/* <h3 className={styles.title}>Your Monthly Payment</h3> */}

                    <div className={styles.plan_data}>
                      <div className={styles.text_container}>
                        <h3 className={styles.plan_text}>
                          {currentPlan?.plan?.name?.toUpperCase()}
                        </h3>
                        {currentPlan?.plan?.name === "Starter Plan" ? (
                          <p className={styles.plan_price}>
                            <span>₹10,000</span> FREE
                          </p>
                        ) : (
                          <p className={styles.plan_price}>
                            <span>₹15,000</span> {currentPlan?.plan?.price}
                          </p>
                        )}
                      </div>
                      {currentPlan?.nextBillingDate ? (
                        <p className={styles.desc}>
                          Your next billing date is{" "}
                          {moment(currentPlan?.nextBillingDate).format(
                            "DD MMMM, YYYY"
                          )}
                        </p>
                      ) : (
                        <p className={styles.desc}>
                          Your FREE trial ends on{" "}
                          {moment(currentPlan?.endDate).format("DD MMMM, YYYY")}
                        </p>
                      )}
                    </div>

                    {paymentHistory?.length > 0 && (
                      <>
                        <h3 className={styles.title}>Payment History</h3>
                        <div className={styles.table_wrapper}>
                          <table className={styles.hist_table}>
                            <thead>
                              <tr>
                                <th>DATE</th>
                                <th>DESCRIPTION</th>
                                <th>PAYMENT METHOD</th>
                                <th>PAYMENT DETAIL</th>
                                <th>INVOICE</th>
                                <th>TOTAL</th>
                              </tr>
                            </thead>

                            <tbody>
                              {paymentHistory?.map((hist, i) => (
                                <tr key={`table-${i}`}>
                                  <td>
                                    {moment(hist.date).format("DD.MM.YY")}
                                  </td>
                                  <td>{hist.description}</td>
                                  <td>
                                    {
                                      paymentMethodMap[
                                        hist.paymentMethod || "unknown"
                                      ]
                                    }
                                  </td>
                                  <td>
                                    {hist.paymentMethod === "card" && hist.card
                                      ? `**** **** **** ${hist.card.last4}`
                                      : (hist.paymentMethod === "vpa" ||
                                          hist.paymentMethod === "upi") &&
                                        hist.vpa
                                      ? hist.vpa
                                      : hist.paymentMethod === "bank" &&
                                        hist.bank
                                      ? hist.bank
                                      : ""}
                                  </td>
                                  <td
                                    style={{
                                      cursor: "pointer",
                                      color: "#014FDF",
                                    }}
                                    onClick={() =>
                                      handleInvoiceView(hist?.razorpayPaymentId)
                                    }
                                  >
                                    View
                                  </td>
                                  <td>
                                    <span></span>₹{hist.amount}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <FooterV2 lightTheme />
        {showLogoutPopup && (
          <div className="popup_wrapper">
            <div className="popup">
              <p className="text">Logout of your account?</p>
              <div className="buttons">
                <button
                  className="logout"
                  onClick={() => {
                    handlelogout();
                    setShowLogoutPopup(false);
                  }}
                >
                  <img src={logoutBlackIcon} alt="Logout Icon" />
                  Logout
                </button>
                <button
                  className="cancel"
                  // onClick={() => setShowLogoutPopup(false)}
                >
                  <img src={xMark} alt="X Mark Icon" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <EditFirmNamePopup
          show={showEditFirmNamePopup}
          handleClose={handleEditFirmNamePopupClose}
          OpenEditFirmNamePopup={handleEditFirmNamePopupOpen}
          data={{
            business_name: data?.business_name,
            brand_logo: data?.brand_logo,
          }}
          onSaveChanges={handleSaveBusinessDetails}
        />
      </main>
    </>
  );
};

export default Plan;
