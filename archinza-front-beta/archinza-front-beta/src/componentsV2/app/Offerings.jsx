import React from "react";
import { ArrowRight } from "lucide-react";
import "./web-offerings.scss";
import { accountCategoryURL } from "../../components/helpers/constant-words";
import { Link } from "react-router-dom";
import useTheme from "../../components/useTheme/useTheme";

const WebOffering = ({ openPopup }) => {
  const { theme} = useTheme();
  return (
    <section className="web-offerings">
      <div className="web-offerings__container">
        {/* Header */}
        <div className="web-offerings__header">
          <h2 className="web-offerings__title">Our Offerings</h2>
          <p
            className={`web-offerings__subtitle  ${
              theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
            }`}
          >
            <b>Search, Reach, Ask, Connect</b>
            <br />
      On the web or WhatsApp, Archinza helps you discover relevant products, materials, and services, ask design or technical questions, reach experts and connect instantly on demand.
          </p>
        </div>

        <div className="web-offerings__content">
          {/* Visual Section */}
          <div className="web-offerings__visual-section">
            {/* Desktop Image */}
            <img
              src="/images/Web_offering.png"
              alt="Business professionals collaborating"
              className="web-offerings__image web-offerings__image--desktop"
            />
            {/* Mobile Image */}
            <img
              src="/images/Web_offering.png"
              alt="Business team meeting"
              className="web-offerings__image web-offerings__image--mobile"
            />
          </div>

          {/* Content Section */}
          <div className="web-offerings__text-section">
            <h1
              className={`web-offerings__section-title ${
                theme === "dark" ? "text-white" : ""
              }`}
            >
              Archinza AI Web
            </h1>

            <p
              className={`web-offerings__description  ${
                theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
              }`}
            >
              Browse curated businesses, explore products, materials, expertise,
              save inspirations, all through an AI-powered platform.
            </p>

            <div className="web-offerings__button-container">
              <Link to={accountCategoryURL}>
                <button
                  className="web-offerings__button web-offerings__button--primary"
                  // onClick={openPopup}
                >
                  Get Started on Archinza Web
                  <ArrowRight className="web-offerings__button-icon" />
                </button>
              </Link>

              {/* <button className="web-offerings__button web-offerings__button--secondary">
                Know More
                <ArrowRight className="web-offerings__button-icon" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebOffering;
