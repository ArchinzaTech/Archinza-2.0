import React from "react";
import "./Offerings.scss";
import { ArrowRight } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import { accountCategoryURL } from "../../components/helpers/constant-words";
import { Link } from "react-router-dom";
import useTheme from "../../components/useTheme/useTheme";

const Bus_Offering = ({ openPopup }) => {
  const { theme } = useTheme();
  return (
    <section className="offerings_section">
      <div className="offerings_container">
        {/* Text Content - 40% */}
        <div className="content_section">
          <div className="main_heading_wrapper">
            <h2
              className="main_heading"
              style={{
                color: theme === "dark" ? "white" : "",
              }}
            >
              Get found by{" "}
              <span className="typewriter_highlight">
                <Typewriter
                  words={["Clients", "Architects", "Students"]}
                  loop={true}
                  typeSpeed={100}
                  deleteSpeed={100}
                  delaySpeed={250}
                />
              </span>{" "}
            </h2>
          </div>

          <h2
            className={`sub_heading  ${
              theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
            }`}
          >
            It all starts with a
            <span className="business_highlight"> Business Account</span>
          </h2>

          <h4
            className="sub_para"
            style={{
              color: theme === "dark" ? "white" : "",
            }}
          >
            AI-led business development made <br /> automated, economical, and
            targeted.
          </h4>

          <div className="cta_wrapper">
            <Link to={accountCategoryURL}>
              <button
                className="cta_button"
                // onClick={openPopup}
              >
                Get Started as a Business
                <ArrowRight className="cta_icon" />
              </button>
            </Link>
          </div>
        </div>

        <div className="image_section">
          <picture>
            {/* Mobile first */}
            <source
              srcSet="/Business/Business_Listing_Mobile.png"
              media="(max-width: 768px)"
            />
            {/* Default (desktop) */}
            <img
              src="/Business/Business_Listing.png"
              alt="Business professionals collaborating"
              className="business_image"
            />
          </picture>
        </div>
      </div>
    </section>
  );
};

export default Bus_Offering;
