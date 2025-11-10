import React, { useState, useRef, useEffect } from "react";
import "./subscriptionPlans.scss";
import {
  backArrow,
  checkMarkGreen,
  crossMarkRed,
  leftarrowBlack,
  starterPlan,
  supporterPlan,
  // Blue strip start here
  CopyLinkCircleOrange,
  editicon,
  faceBookCircleOrange,
  linkedInLinkCircleOrange,
  shareBlackInside,
  verifiedBlueIcon,
  whatsappCircleOrange,
  XCircleOrange,
  // Blue strip end here
} from "../../../../images";
import { useWindowSize } from "react-use";
import FooterV2 from "../../../../components/FooterV2/FooterV2";
import {
  businessPaymentSuccessURL,
  businessProfileEditURL2,
  planDetails,
} from "../../../../components/helpers/constant-words";
import { Link, useNavigate } from "react-router-dom";

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
// <========================== Blue strip start end ===============================>

const tabList = ["Starter", "Supporter"];

const SubscriptionPlans = () => {
  const { width } = useWindowSize();

  // <========================== Blue strip start here ===============================>
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const headerRef = useRef(null); // Ref for header section
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showEditFirmNamePopup, setShowEditFirmNamePopup] = useState(false);
  const [plans, setPlans] = useState([]);
  const stickyTabsRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0); // State for header height
  const [stickyTabsHeight, setStickyTabsHeight] = useState(0);
  const handleOptionsPopupOpen = () => setShowOptionsPopup(true);
  const { data, update, fetchData } = useBusinessContext();
  const [isTab, setIsTab] = useState(
    data?.subscription?.plan?.name === "Supporter Plan" ? 1 : 0
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const [currentActivePlan, setCurrentActivePlan] = useState();

  useEffect(() => {
    if (data?.subscription?.plan?.name) {
      setCurrentActivePlan(data.subscription.plan.name);
    }
  }, [data]);

  useEffect(() => {
    setIsTab(data?.subscription?.plan?.name === "Supporter Plan" ? 1 : 0);
  }, [data?.subscription?.plan?.name]);

  const images = [
    { name: "Starter Plan", image: starterPlan },
    { name: "Supporter Plan", image: supporterPlan },
  ];

  const hasActiveSubscription = () => {
    return (
      data?.subscription?.isActive === true &&
      data?.subscription?.razorpaySubscriptionId &&
      (data?.subscription?.paymentStatus === "activated" ||
        data?.subscription?.paymentStatus === "pending_activation")
    );
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

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const handleEditFirmNamePopupOpen = () => setShowEditFirmNamePopup(true);
  const handleEditFirmNamePopupClose = () => setShowEditFirmNamePopup(false);

  const shareUrl = window.location.host + `${businessProfileViewURL2}`;
  // const shareUrl = window.location.host + `/${data?.username}`;
  const shareTitle = data?.business_name || "Check out this business profile!";

  const createSubscription = async (planIndex) => {
    if (!plans[planIndex]) return;

    setIsProcessingPayment(true);
    try {
      const response = await http.post(
        `${config.api_url}/business-plans/subscribe`,
        {
          data: {
            id: data._id,
            business_name: data.business_name,
            email: data.email,
            phone: `${data.country_code}${data.phone}`,
          },
          plan: plans[planIndex],
        }
      );

      if (response?.data) {
        console.log(response.data);
        setSelectedPlan({
          ...plans[planIndex],
          subscriptionId: response.data.id,
        });
        initiatePayment(plans[planIndex], response.data.subscriptionId);
      } else {
        throw new Error("Failed to create subscription");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast(
        <ToastMsg
          message="Failed to initiate payment. Please try again."
          danger={true}
        />,
        config.error_toast_config
      );
      setIsProcessingPayment(false);
    }
  };

  const initiatePayment = async (plan, subscriptionId) => {
    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: config.razorpay_key_id,
          subscription_id: subscriptionId,
          payment_methods: {
            card: 1,
            upi: 1,
            netbanking: 1,
          },
          name: "Archinza",
          description: `Subscription for ${plan.name}`,
          handler: async (response) => {
            try {
              const verifyResponse = await http.post(
                `${config.api_url}/business-plans/verify-payment`,
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id,
                  razorpay_signature: response.razorpay_signature,
                  user_id: data._id,
                  plan_id: plan._id,
                }
              );

              if (verifyResponse.data.success) {
                // Refresh user data
                const updatedData = await fetchData(data?._id);
                if (updatedData) {
                  update(updatedData);
                }

                // toast(
                //   <ToastMsg message="Payment successful! Redirecting..." />,
                //   config.success_toast_config
                // );

                // // Redirect to business profile edit page
                navigate(businessPaymentSuccessURL);
                window.scrollTo(0, 0);
                // setTimeout(() => {
                // }, 2000);
              } else {
                throw new Error("Payment verification failed");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              toast(
                <ToastMsg message="Payment verification failed. Please contact support." />,
                config.error_toast_config
              );
            } finally {
              setIsProcessingPayment(false);
            }
          },
          prefill: {
            name: data.business_name || data.name,
            email: data.email,
            contact: data.phone,
          },
          notes: {
            businessAccountId: data?._id,
            plan: plan.name,
            plan_duration: plan.durationInMonths,
            subscriptionId: subscriptionId,
            customer_name: data?.business_name,
            customer_email: data?.email,
            customer_contact: data?.country_code + data?.phone,
          },
          theme: {
            color: "#F37254",
          },
          modal: {
            ondismiss: () => {
              setIsProcessingPayment(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response) => {
          console.error("Payment failed:", response);
          toast(
            <ToastMsg message="Payment failed. Please try again." />,
            config.error_toast_config
          );
          setIsProcessingPayment(false);
        });

        rzp.open();
      };

      script.onerror = () => {
        toast(
          <ToastMsg message="Failed to load payment gateway." />,
          config.error_toast_config
        );
        setIsProcessingPayment(false);
      };
    } catch (error) {
      console.error("Error loading payment gateway:", error);
      toast(
        <ToastMsg message="Payment initialization failed." />,
        config.error_toast_config
      );
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      const plansData = await http.get(`${config.api_url}/business-plans`);
      setPlans(plansData?.data || []);
    };
    fetchPlans();
  }, []);

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

  // const initiatePayment = async () => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // Load Razorpay script
  //     const script = document.createElement("script");
  //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //     script.async = true;
  //     document.body.appendChild(script);

  //     script.onload = async () => {
  //       try {
  //         // Use the subscription ID that was already created from your backend
  //         if (!subscription) {
  //           throw new Error("Subscription ID not found. Please try again.");
  //         }

  //         const options = {
  //           key: config.razorpay_key_id, // Only public key is safe to use on frontend
  //           subscription_id: subscription.subscriptionId, // This comes from your backend
  //           payment_methods: {
  //             card: 1,
  //             upi: 1,
  //             netbanking: 1,
  //           },
  //           name: "Archinza",
  //           description: `Subscription for ${plan.name}`,
  //           image: "/logo.png", // Add your logo
  //           handler: async (response) => {
  //             try {
  //               // Verify payment on your backend
  //               const verifyResponse = await http.post(
  //                 `${config.api_url}/business-plans/verify-payment`, // Update this endpoint
  //                 {
  //                   razorpay_payment_id: response.razorpay_payment_id,
  //                   razorpay_subscription_id: response.razorpay_subscription_id,
  //                   razorpay_signature: response.razorpay_signature,
  //                   user_id: user._id,
  //                   plan_id: plan._id,
  //                 }
  //               );

  //               if (verifyResponse.data.success) {
  //                 onPaymentSuccess(response);
  //                 onClose();
  //               } else {
  //                 throw new Error("Payment verification failed");
  //               }
  //             } catch (verifyError) {
  //               console.error("Payment verification error:", verifyError);
  //               onPaymentFailure(verifyError.message);
  //             }
  //           },
  //           prefill: {
  //             name: user.business_name || user.name,
  //             email: user.email,
  //             contact: `${user?.country_code}${user.phone}`,
  //           },
  //           notes: {
  //             businessAccountId: user?._id,
  //             plan: plan?._id,
  //           },
  //           theme: {
  //             color: "#F37254",
  //           },
  //           modal: {
  //             ondismiss: () => {
  //               setLoading(false);
  //               onClose();
  //             },
  //           },
  //         };

  //         const rzp = new window.Razorpay(options);
  //         rzp.on("payment.failed", (response) => {
  //           console.error("Payment failed:", response);
  //           onPaymentFailure("Payment failed. Please try again.");
  //           onClose();
  //         });

  //         rzp.open();
  //         setLoading(false);
  //       } catch (error) {
  //         console.error("Error in payment initialization:", error);
  //         setError(error.message);
  //         setLoading(false);
  //       }
  //     };

  //     script.onerror = () => {
  //       setError(
  //         "Failed to load payment gateway. Please check your internet connection."
  //       );
  //       setLoading(false);
  //     };
  //   } catch (error) {
  //     console.error("Error loading payment gateway:", error);
  //     setError(error.message);
  //     setLoading(false);
  //   }
  // };

  // <========================== Blue strip start end ===============================>

  return (
    <>
      <div className="verify_main_sec">
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
        <div className="my_container">
          <div className="pricing-container">
            <div className="pricing-wrapper">
              {/* Header */}
              <div className="pricing-header">
                <div onClick={() => navigate(-1)}>
                  <button className="back-btn">
                    <img src={backArrow} alt="back arrow" className="icon" />
                    <span className="back-text">Back</span>
                  </button>
                </div>
                <h2 className="title">Choose Your Plan</h2>
              </div>

              {/* Plan Toggle */}
              {width <= 767 && (
                <div className="plan-toggle">
                  {tabList?.map((tab, i) => (
                    <button
                      className={`plan-btn ${isTab === i ? "active" : ""}`}
                      key={i}
                      onClick={() => setIsTab(i)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="content_wrapper">
                {(width > 767 || (width <= 767 && isTab === 0)) && (
                  <div
                    className={`content ${isTab === 0 ? "active" : ""} ${
                      currentActivePlan == "Starter Plan" ||
                      currentActivePlan == "Supporter Plan"
                        ? "currentActivePlan"
                        : ""
                    }`}
                    onClick={() => {}}
                  >
                    {width > 767 && (
                      <div className="plan-toggle-desk">
                        <button
                          className={`plan-btn ${isTab === 0 ? "active" : ""}`}
                          // onClick={() => setIsTab(0)}
                        >
                          Starter
                        </button>
                      </div>
                    )}
                    <div className="image-box">
                      <img
                        src={starterPlan}
                        alt="Detailed Plans Illustration"
                        width="780"
                        height="387"
                        loading="eager"
                        className="plan-image"
                      />
                    </div>

                    <div className="text-box">
                      <h2 className="heading">
                        Just Getting <span className="highlight">Started?</span>
                      </h2>
                      <p className="description">
                        Get onboarded for free today and enjoy 3 months of
                        full-feature access post-launch.
                      </p>

                      <div className="benefits-box">
                        <h3 className="benefits-title">Plan Benefits</h3>
                        <ul className="benefits-list">
                          {plans[0] && (
                            <>
                              <li className="benefit-item">
                                <img
                                  src={checkMarkGreen}
                                  alt="check mark"
                                  className="check-icon"
                                />
                                Upload{" "}
                                <span>
                                  &nbsp;{plans[0].features.fileUploadLimit}{" "}
                                  PDFs&nbsp;
                                </span>{" "}
                                Per Year
                              </li>
                              <li className="benefit-item">
                                <img
                                  src={checkMarkGreen}
                                  alt="check mark"
                                  className="check-icon"
                                />
                                <span>
                                  {plans[0].features.imagesLimit} Photos&nbsp;
                                </span>{" "}
                                Gallery Limit
                              </li>
                              <li className="benefit-item">
                                <img
                                  src={checkMarkGreen}
                                  alt="check mark"
                                  className="check-icon"
                                />
                                Autofetch Images from synced Links and PDFs
                              </li>
                              <li className="benefit-item">
                                <img
                                  src={
                                    plans[0].features.privateContentToggle
                                      ? checkMarkGreen
                                      : crossMarkRed
                                  }
                                  alt="check mark"
                                  className={
                                    plans[0].features.privateContentToggle
                                      ? "check-icon"
                                      : "cross-icon"
                                  }
                                />
                                <span>Hide&nbsp;</span> content from competitors
                              </li>
                              <li className="benefit-item">
                                <img
                                  src={
                                    plans[0].features.communityAccess
                                      ? checkMarkGreen
                                      : crossMarkRed
                                  }
                                  alt="check mark"
                                  className={
                                    plans[0].features.communityAccess
                                      ? "check-icon"
                                      : "cross-icon"
                                  }
                                />
                                Access to WhatsApp Communities
                              </li>
                            </>
                          )}
                        </ul>

                        <div className="cta">
                          <button
                            className="buy-btn"
                            disabled={
                              data?.subscription?.plan?.name === "Starter Plan"
                            }
                            onClick={() => console.log("Starter Plan clicked")}
                          >
                            FREE for Limited Period{" "}
                            <span className="old-price">₹10,000</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(width > 767 || (width <= 767 && isTab === 1)) && (
                  <div
                    className={`content ${isTab === 0 ? "active" : ""} ${
                      currentActivePlan == "Supporter Plan"
                        ? "currentActivePlan"
                        : ""
                    }`}
                    onClick={() => {
                      if (currentActivePlan === "Starter Plan") {
                        setIsTab(1);
                      }
                      // else do nothing
                    }}
                  >
                    {width > 767 && (
                      <div className="plan-toggle-desk">
                        <button
                          className={`plan-btn ${
                            (isTab === 1 ||
                              currentActivePlan === "Starter Plan") &&
                            currentActivePlan !== "Supporter Plan"
                              ? "active"
                              : ""
                          }`}
                          // onClick={() => setIsTab(1)}
                        >
                          Supporter
                        </button>
                      </div>
                    )}
                    <div className="image-box">
                      <img
                        src={supporterPlan}
                        alt="Detailed Plans Illustration"
                        width="780"
                        height="387"
                        loading="eager"
                        className="plan-image"
                      />
                    </div>
                    <div className="text-box">
                      <h2 className="heading">
                        Be a <span className="highlight">‘Founding User’</span>
                      </h2>
                      <p className="description">
                        Unlock exclusive Beta access to Archinza and enjoy all
                        benefits when the full product launches.
                      </p>

                      {/* Benefits */}
                      <div className="benefits-box">
                        <h3 className="benefits-title">Plan Benefits</h3>
                        <ul className="benefits-list">
                          {plans[1] && (
                            <>
                              <li className="benefit-item">
                                <img
                                  src={checkMarkGreen}
                                  alt="check mark"
                                  className="check-icon"
                                />
                                Upload{" "}
                                <span>
                                  &nbsp;{plans[1].features.fileUploadLimit}{" "}
                                  PDFs&nbsp;
                                </span>{" "}
                                Per Year
                              </li>
                              <li className="benefit-item">
                                <img
                                  src={checkMarkGreen}
                                  alt="check mark"
                                  className="check-icon"
                                />
                                <span>
                                  {plans[1].features.imagesLimit} Photos&nbsp;
                                </span>{" "}
                                Gallery Limit
                              </li>
                              <li className="benefit-item">
                                <img
                                  src={checkMarkGreen}
                                  alt="check mark"
                                  className="check-icon"
                                />
                                Autofetch Images from synced Links and PDFs
                              </li>
                              <li className="benefit-item">
                                <img
                                  src={
                                    plans[1].features.privateContentToggle
                                      ? checkMarkGreen
                                      : crossMarkRed
                                  }
                                  alt="check mark"
                                  className={
                                    plans[1].features.privateContentToggle
                                      ? "check-icon"
                                      : "cross-icon"
                                  }
                                />
                                <span>Hide&nbsp;</span> content from competitors
                              </li>
                              <li className="benefit-item">
                                <img
                                  src={
                                    plans[1].features.communityAccess
                                      ? checkMarkGreen
                                      : crossMarkRed
                                  }
                                  alt="check mark"
                                  className={
                                    plans[1].features.communityAccess
                                      ? "check-icon"
                                      : "cross-icon"
                                  }
                                />
                                Access to WhatsApp Communities
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                      <div className="cta">
                        <button
                          className="buy-btn"
                          disabled={
                            data?.subscription?.plan?.name ===
                              "Supporter Plan" || isProcessingPayment
                          }
                          onClick={() => createSubscription(1)}
                        >
                          {isProcessingPayment ? (
                            <>Processing...</>
                          ) : (
                            <>
                              <span className="old-price">₹15,000</span> ₹
                              {plans[1]?.price || "999"}
                            </>
                          )}
                          {/* {isProcessingPayment ? "Processing..." : "Buy Now at"}{" "} */}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterV2 lightTheme />
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
    </>
  );
};

export default SubscriptionPlans;
