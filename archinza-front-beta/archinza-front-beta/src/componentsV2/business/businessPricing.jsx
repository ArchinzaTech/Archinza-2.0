import React from "react";
import "./businessPricing.scss";
import { ArrowRight, Upload, Search, Eye, ChevronDown } from "lucide-react";

import { Disclosure } from "@headlessui/react";
import { Link } from "react-router-dom";
import { accountCategoryURL } from "../../components/helpers/constant-words";
import useTheme from "../../components/useTheme/useTheme";

const illustration = "/Business/founding_user.png";

const BusinessPricing = ({ openPopup }) => {
  const { theme } = useTheme();
  return (
    <section
      className="business_pricing_section"
      style={{
        backgroundColor: theme === "dark" ? "#ffffff1a" : "",
        color: theme === "dark" ? "#ffffffcc" : "",
      }}
    >
      <div
        className="pricing_container"
        style={{
          backgroundColor: theme === "dark" ? "#ffffff1a" : "",
          color: theme === "dark" ? "#ffffffcc" : "",
        }}
      >
        {/* Image on top (mobile), left (desktop) */}
        <div className="pricing_image_section">
          <img
            src={illustration}
            alt="Detailed Plans Illustration"
            className="pricing_illustration"
          />
        </div>

        {/* Spacer (10% desktop only) */}
        <div className="pricing_spacer" />

        {/* Text Section */}
        <div className="pricing_content_section">
          <h2
            className="pricing_title"
            style={{
              color: theme === "dark" ? "#ffffff" : "",
            }}
          >
            Become a{" "}
            {/* <br className="title_break" /> */}
            <span className="title_highlight">'Founding User'</span>
          </h2>
          <p
            className={`pricing_description ${
              theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
            }`}
          >
            Join Archinza during Beta to unlock exclusive features like more
            uploads, smart discovery and 1 year of FREE access at full launch.
          </p>

          {/* Features */}
          <div className="features_wrapper">
            {/* Desktop View */}
            <div className="features_desktop">
              <div className="feature_item">
                <Upload className="feature_icon" />
                <p className="feature_text">
                  <span className="feature_title">5x Upload Capacity:</span>{" "}
                  More storage. More auto-fetched data. More credibility minus
                  the manual effort.
                </p>
              </div>

              <div className="feature_item">
                <Search className="feature_icon" />
                <p className="feature_text">
                  <span className="feature_title">
                    Smarter Discovery. Wider Reach:
                  </span>{" "}
                  Get matched through intelligent text + image search. Be seen
                  by the right clients, faster.
                </p>
              </div>

              <div className="feature_item">
                <Eye className="feature_icon" />
                <p className="feature_text">
                  <span className="feature_title">
                    Control Your Visibility:
                  </span>{" "}
                  Want to stay public but hide from competitors? Share only with
                  audiences you choose.
                </p>
              </div>
            </div>

            {/* Mobile Accordion */}
            <div className="features_mobile">
              <Disclosure>
                {({ open }) => (
                  <div className="accordion_item">
                    <Disclosure.Button className="accordion_button">
                      <span className="accordion_button_content">
                        <Upload className="accordion_icon" />
                        <span
                          className={`accordion_title ${
                            theme === "dark"
                              ? "dark_mode_text_muted--theme-styles"
                              : ""
                          }`}
                        >
                          5x Upload Capacity
                        </span>
                      </span>
                      <ChevronDown
                        className={`accordion_chevron ${open ? "open" : ""}`}
                        style={{
                          filter: theme === "dark" ? "invert(1)" : "invert(0)",
                        }}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel
                      className={`accordion_panel ${
                        theme === "dark"
                          ? "dark_mode_text_muted--theme-styles"
                          : ""
                      }`}
                    >
                      More storage. More auto-fetched data. More credibility
                      minus the manual effort.
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure>
                {({ open }) => (
                  <div className="accordion_item">
                    <Disclosure.Button className="accordion_button">
                      <span className="accordion_button_content">
                        <Search className="accordion_icon" />
                        <span
                          className={`accordion_title ${
                            theme === "dark"
                              ? "dark_mode_text_muted--theme-styles"
                              : ""
                          }`}
                        >
                          Smarter Discovery. Wider Reach
                        </span>
                      </span>
                      <ChevronDown
                        className={`accordion_chevron ${open ? "open" : ""}`}
                        style={{
                          filter: theme === "dark" ? "invert(1)" : "invert(0)",
                        }}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel
                      className={`accordion_panel ${
                        theme === "dark"
                          ? "dark_mode_text_muted--theme-styles"
                          : ""
                      }`}
                    >
                      Get matched through intelligent text + image search. Be
                      seen by the right clients, faster.
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure>
                {({ open }) => (
                  <div className="accordion_item">
                    <Disclosure.Button className="accordion_button">
                      <span className="accordion_button_content">
                        <Eye className="accordion_icon" />
                        <span
                          className={`accordion_title ${
                            theme === "dark"
                              ? "dark_mode_text_muted--theme-styles"
                              : ""
                          }`}
                        >
                          Control Your Visibility
                        </span>
                      </span>
                      <ChevronDown
                        className={`accordion_chevron ${open ? "open" : ""}`}
                        style={{
                          filter: theme === "dark" ? "invert(1)" : "invert(0)",
                        }}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel
                      className={`accordion_panel ${
                        theme === "dark"
                          ? "dark_mode_text_muted--theme-styles"
                          : ""
                      }`}
                    >
                      Want to stay public but hide from competitors? Share only
                      with audiences you choose.
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
            </div>
          </div>

          {/* CTA */}
          <div className="cta_wrapper">
            <Link to={accountCategoryURL} className="primary_cta">
              <button
                className="primary_cta"
                // onClick={openPopup}
              >
                Get Early Access <ArrowRight size={18} className="cta_icon" />
              </button>
            </Link>
            {/* <button className="secondary_cta">
              See Plan details
              <ArrowRight className="secondary_icon" />
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessPricing;
