import React from "react";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import FeaturesBus from "./features.jsx";
import FeaturesUser from "./FeaturesUser.jsx";
import "./get-started.scss";
import useTheme from "../../components/useTheme/useTheme.js";

const GetStarted = () => {
  const [userType, setUserType] = useState("business");
  const { theme } = useTheme();

  return (
    <section className="get-started">
      <div
        className={`get-started__container  ${
          theme === "dark" ? "dark_mode--theme-styles" : ""
        }`}
      >
        {/* Heading + Dropdown */}
        <div className="get-started__header">
          <div className="get-started__title-section">
            {/* Line 1: Heading */}
            <span
              className={`get-started__title-text  ${
                theme === "dark" ? "text-white" : ""
              }`}
            >
              Get started as a
            </span>

            {/* Line 2: Buttons */}
            <div className="get-started__toggle-container">
              <button
                onClick={() => setUserType("business")}
                className={`get-started__toggle-button ${
                  userType === "business"
                    ? "get-started__toggle-button--active"
                    : "get-started__toggle-button--inactive"
                }`}
              >
                Business
              </button>
              <button
                onClick={() => setUserType("individual")}
                className={`get-started__toggle-button ${
                  userType === "individual"
                    ? "get-started__toggle-button--active"
                    : "get-started__toggle-button--inactive"
                }`}
              >
                Personal User
              </button>
            </div>
          </div>
        </div>

        {/* Conditional Component */}
        {userType === "business" ? <FeaturesBus /> : <FeaturesUser />}
      </div>
    </section>
  );
};

export default GetStarted;
