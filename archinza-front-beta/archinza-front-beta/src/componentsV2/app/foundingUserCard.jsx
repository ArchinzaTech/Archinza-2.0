import React from "react";
import { ArrowRight } from "lucide-react";
// import illustration from "/images/Founding_User.png";
import "./foundingUserCard.scss";
import { accountCategoryURL } from "../../components/helpers/constant-words";
import { Link } from "react-router-dom";
import useTheme from "../../components/useTheme/useTheme";

const FoundingUserCard = ({ openPopup }) => {
  const { theme } = useTheme();
  return (
    <section className="founding-user-section">
      <div className="founding-user-container">
        {/* Mobile Image (hidden on desktop) */}
        <div className="mobile-image">
          {/* <img src={illustration} alt="Illustration" /> */}
        </div>

        {/* Text Section */}
        <div className="text-section">
          <h2
            className="heading"
            style={{
              color: theme === "dark" ? "#000" : "",
            }}
          >
            Become a Founding User.
          </h2>
          <p className="description">
            As a business, you have the chance to join Archinza during the beta
            stage and get early access to powerful features designed to connect
            you with the right clients, faster.
          </p>

          <Link to={accountCategoryURL} className="cta-button">
            {/* <button className="cta-button" onClick={openPopup}> */}
            Get Early Access <ArrowRight size={18} />
            {/* </button> */}
          </Link>
        </div>

        {/* Desktop image */}
      </div>
    </section>
  );
};

export default FoundingUserCard;
