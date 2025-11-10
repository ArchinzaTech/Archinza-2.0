import React from "react";
import "./Network.scss";
import { MessageCircle, Car, Utensils, Calendar } from "lucide-react";
const GlobeSVG = "/Business/main-2.svg";

const NetworkSection = () => {
  return (
    <section className="network_section">
      {/* Background grid pattern */}
      <div className="background_grid">
        <div className="grid_pattern"></div>
      </div>

      <div className="network_container">
        <div className="network_wrapper">
          {/* Globe Section - Mobile: Top, Desktop: Left */}
          <div className="globe_section">
            <div className="globe_container">
              {/* Main Globe */}
              <img src={GlobeSVG} alt="Globe" className="globe_image" />
            </div>
          </div>

          {/* Content Section - Mobile: Bottom, Desktop: Right */}
          <div className="content_section">
            <div className="content_wrapper">
              {/* Header */}
              <div className="header_section">
                <p className="community_label">Archinza Community</p>

                <h1 className="main_heading">
                  Meet the platform that powers the built environment.
                </h1>

                <p className="main_description">
                  Discover projects, people, and possibilities—all in one place.
                  Archinza connects architects, material experts, and design
                  professionals through one intelligent ecosystem.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="stats_grid">
                <div className="stat_item">
                  <div className="stat_number">
                    300<span className="stat_plus">+</span>
                  </div>
                  <p className="stat_label">Design & Build Businesses</p>
                </div>

                <div className="stat_item">
                  <div className="stat_number">
                    100<span className="stat_plus">+</span>
                  </div>
                  <p className="stat_label">Brands & Manufactureres</p>
                </div>

                <div className="stat_item">
                  <div className="stat_number">
                    600<span className="stat_plus">+</span>
                  </div>
                  <p className="stat_label">Sellers & Distributers</p>
                </div>

                <div className="stat_item">
                  <div className="stat_number">
                    100<span className="stat_plus">+</span>
                  </div>
                  <p className="stat_label">Design Support Services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkSection;
