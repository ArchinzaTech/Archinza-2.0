import React, { useState, useRef, useEffect } from "react";
import "./pricingPlans.scss";
import {
  checkMarkGreen,
  crossMarkRed,
  starterPlan,
  supporterPlan,
} from "../../images";
import { useWindowSize } from "react-use";
import FooterV2 from "../../components/FooterV2/FooterV2";
import { useBusinessContext } from "../../context/BusinessAccount/BusinessAccountState";
import http from "../../helpers/http";
import config from "../../config/config";

const tabList = ["Starter", "Supporter"];

const PricingPlans = () => {
  const { width } = useWindowSize();

  // <========================== Blue strip start here ===============================>
  const menuRef = useRef(null);
  const headerRef = useRef(null); // Ref for header section
  const [plans, setPlans] = useState([]);
  const stickyTabsRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0); // State for header height
  const [stickyTabsHeight, setStickyTabsHeight] = useState(0);
  const { data, update, fetchData } = useBusinessContext();
  const [isTab, setIsTab] = useState(1);
  const [currentActivePlan, setCurrentActivePlan] = useState();

  useEffect(() => {
    if (data?.subscription?.plan?.name) {
      setCurrentActivePlan(data.subscription.plan.name);
    }
  }, [data]);

  useEffect(() => {
    setIsTab(data?.subscription?.plan?.name === "Supporter Plan" ? 1 : 0);
  }, [data?.subscription?.plan?.name]);

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

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setIsHovered(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      const plansData = await http.get(`${config.api_url}/business-plans`);
      setPlans(plansData?.data || []);
    };
    fetchPlans();
  }, []);

  // <========================== Blue strip start end ===============================>

  return (
    <>
      <div className="pricing_plans">
        <div className="my_container">
          <div className="pricing-container">
            <div className="pricing-wrapper">
              {/* Header */}
              {/* <div className="pricing-header">
                <div onClick={() => navigate(-1)}>
                  <button className="back-btn">
                    <img src={backArrow} alt="back arrow" className="icon" />
                    <span className="back-text">Back</span>
                  </button>
                </div>
                <h2 className="title">Choose Your Plan</h2>
              </div> */}

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
                  <div className={`content`} onClick={() => {}}>
                    {width > 767 && (
                      <div className="plan-toggle-desk">
                        <button className={`plan-btn`}>Starter</button>
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
                      </div>
                    </div>
                  </div>
                )}

                {(width > 767 || (width <= 767 && isTab === 1)) && (
                  <div className={`content`}>
                    {width > 767 && (
                      <div className="plan-toggle-desk">
                        <button
                          className={`plan-btn`}
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterV2 lightTheme />
    </>
  );
};

export default PricingPlans;
