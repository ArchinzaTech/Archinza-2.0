import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./WhosItFor.scss";
import { accountCategoryURL } from "../../components/helpers/constant-words";
import useTheme from "../../components/useTheme/useTheme";

const WhosItFor = ({ openPopup }) => {
  const { theme } = useTheme();
  return (
    <section className="whos-it-for-section">
      <div className="whos-it-for-container">
        {/* Header */}
        <div className="header-section">
          <h2 className="header-title">Who is it for</h2>
          <p
            className={`header-description  ${
              theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
            }`}
          >
            Archinza is a{" "}
            <span className="orange-text">discovery platform</span> for everyone
            in the AECD ecosystem from{" "}
            <span className="semibold-text">
              professionals and businesses to students and design-curious users.
            </span>
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="two-column-grid">
          {/* Archinza for Businesses */}
          <div
            className="card"
            style={{
              backgroundColor: theme === "dark" ? "#ffffff1a" : "",
            }}
          >
            {/* Image Container */}
            <div className="image-container">
              {/* Desktop Image */}
              <img
                src="/images/Business_homepage.png"
                alt="Business professionals collaborating"
                className="desktop-image"
              />
              {/* Mobile Image */}
              <img
                src="/images/Business_homepage.png"
                alt="Business team meeting"
                className="mobile-image"
              />
            </div>

            {/* Content */}
            <div className="content-section">
              <h3 className="content-title">Archinza for Businesses / Firms</h3>

              {/* Tags */}
              <div className="tags-container">
                {/* Mobile: Scrolling tags */}
                <div className="mobile-scrolling-tags">
                  {/* First set */}
                  <div className="tag-set">
                    {[
                      "Design & Consult",
                      "Build or Install",
                      "Sell products or Materials",
                      "Manufacture & Distribute",
                      "PR Agency",
                      "Events",
                    ].map((tag, idx) => (
                      <span
                        key={idx}
                        className="tag"
                        style={{
                          backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                          color: theme === "dark" ? "#ffffffcc" : "",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Duplicate set */}
                  <div className="tag-set">
                    {[
                      "Design & Consult",
                      "Build or Install",
                      "Sell products or Materials",
                      "Manufacture & Distribute",
                      "PR Agency",
                      "Events",
                    ].map((tag, idx) => (
                      <span key={idx + "dup"} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Desktop: Static wrapped layout */}
                <div className="desktop-static-tags">
                  <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Design & Consult
                  </span>
                  <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Build or Install
                  </span>
                  <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Sell products or Materials
                  </span>
                  <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Manufacture & Distribute
                  </span>
                  {/* <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    PR Agency
                  </span> */}
                  {/* <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Events
                  </span> */}
                  <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Support design & communication
                  </span>
                </div>
              </div>

              <p
                className={`content-description  ${
                  theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
                }`}
              >
                Showcase offerings, reach clients, professionals, and grow
                visibility.
              </p>

              {/* Buttons */}
              <div className="buttons-container">
                <Link
                  // to={() => false}
                  to={accountCategoryURL}
                  // target="_blank"
                  // rel="noopener noreferrer"
                >
                  <button
                    className="primary-button"
                    // onClick={openPopup}
                  >
                    Get Started as a Business/ Firm
                    <ArrowRight className="arrow-icon" />
                  </button>
                </Link>
                <NavLink to="/business" className="nav-link-wrapper">
                  <button
                    className="secondary-button"
                    style={{
                      backgroundColor: theme === "dark" ? "#1a1a1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Know More
                    <ArrowRight className="arrow-icon" />
                  </button>
                </NavLink>
              </div>
            </div>
          </div>

          {/* Archinza for Personal Use */}
          <div
            className="card"
            style={{
              backgroundColor: theme === "dark" ? "#ffffff1a" : "",
            }}
          >
            {/* Image Container */}
            <div className="image-container">
              {/* Desktop Image */}
              <img
                src="/images/Personal_homepage.png"
                alt="Person working on home design"
                className="desktop-image"
              />
              {/* Mobile Image */}
              <img
                src="/images/Personal_homepage.png"
                alt="Home interior design planning"
                className="mobile-image"
              />
            </div>

            {/* Content */}
            <div className="content-section">
              <h3 className="content-title">Archinza for Personal Use</h3>

              {/* Tags */}
              <div className="tags-container">
                {/* Mobile: Scrolling tags */}
                <div className="mobile-scrolling-tags">
                  {/* First set */}
                  <div className="tag-set">
                    {[
                      "Business Owner",
                      "Firm Owner",
                      "Working Professional",
                      "Student",
                      "Freelancer",
                      "Artist",
                      "Home Owner",
                    ].map((tag, idx) => (
                      <span
                        key={idx}
                        className="tag"
                        style={{
                          backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                          color: theme === "dark" ? "#ffffffcc" : "",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Duplicate set */}
                  <div className="tag-set">
                    {[
                      "Business Owner",
                      "Firm Owner",
                      "Working Professional",
                      "Student",
                      "Freelancer",
                      "Artist",
                      "Home Owner",
                    ].map((tag, idx) => (
                      <span key={idx + "dup"} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Desktop: Static wrapped layout */}
                <div className="desktop-static-tags">
                  <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Business Owner
                  </span>
                  <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Firm Owner
                  </span>
                  <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Working Professional
                  </span>
                  <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Student
                  </span>
                  <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Freelancer
                  </span>
                  <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Artist
                  </span>
                  <span
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Home Owner
                  </span>
                </div>
              </div>

              <p
                className={`content-description  ${
                  theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
                }`}
              >
                Discover the right people, products and materials for your
                projects.
              </p>

              {/* Buttons */}
              <div className="buttons-container">
                <Link
                  // to={() => false}
                  to={accountCategoryURL}
                  // target="_blank"
                  // rel="noopener noreferrer"
                >
                  <button
                    className="primary-button"
                    // onClick={openPopup}
                  >
                    Get Started as a Personal User
                    <ArrowRight className="arrow-icon" />
                  </button>
                </Link>
                <NavLink to="/personal" className="nav-link-wrapper">
                  <button
                    className="secondary-button"
                    style={{
                      backgroundColor: theme === "dark" ? "#1a1a1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    Know More
                    <ArrowRight className="arrow-icon" />
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhosItFor;
