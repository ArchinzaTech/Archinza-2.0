import React from "react";
import { ArrowRight } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import "./Offerings.scss";
import { Link } from "react-router-dom";
import { accountCategoryURL } from "../../components/helpers/constant-words";
import useTheme from "../../components/useTheme/useTheme";

const Bus_Offering = ({ openPopup }) => {
  const { theme } = useTheme();
  return (
    <section className="offerings">
      <div className="offerings__container">
        {/* Text Content - 40% */}
        <div className="offerings__text-content">
          <h2
            className={`offerings__title ${
              theme === "dark" ? "text-white" : ""
            }`}
          >
            {/* Archinza is where you{" "}
            <span className="offerings__highlight">discover</span> ideas,
            products, services and brands. */}
         Archinza is where you{ " "}
            <span className="offerings__highlight">discover</span> products, materials, services, experts and brands.
          </h2>
          <p className={`offerings__description ${
              theme === "dark" ? "text-white" : ""
            }`}>
            Think of something you're curious about, like a product or material,
            and see what you discover. The best part? Finding everything from
            the Design & Build world is easy with Archinza Web and WhatsApp.
          </p>
          <div className="offerings__button-container">
            <Link to={accountCategoryURL}>
              <button
                className="offerings__button"
                // onClick={openPopup}
              >
                Get Started as a Personal User
                <ArrowRight className="offerings__button-icon" />
              </button>
            </Link>
          </div>
        </div>

        {/* Image Section - 60% */}
        <div className="offerings__image-section">
          <picture>
            {/* Mobile first */}
            <source
              srcSet="/Personal/Personal_listing_Mobile.png"
              media="(max-width: 768px)"
            />
            {/* Default (desktop) */}
            <img
              src="/Personal/Personal_listing.png"
              alt="Personal Users collaborating"
              className="offerings__image"
            />
          </picture>
        </div>
      </div>
    </section>
  );
};

export default Bus_Offering;
