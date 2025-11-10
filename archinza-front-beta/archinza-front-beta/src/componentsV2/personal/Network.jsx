import React from "react";
import { MessageCircle, Car, Utensils, Calendar } from "lucide-react";
import "./Network.scss";

const NetworkSection = () => {
  return (
    <section className="network">
      {/* Background grid pattern */}
      <div className="network__background">
        <div className="network__background-pattern"></div>
      </div>

      <div className="network__container">
        <div className="network__content">
          {/* Globe Section - Mobile: Top, Desktop: Left */}
          <div className="network__globe-section">
            <div className="network__globe-container">
              {/* Main Globe */}
              <img
                src="/Business/main-2.svg"
                alt="Globe"
                className="network__globe-image"
              />
            </div>
          </div>

          {/* Content Section - Mobile: Bottom, Desktop: Right */}
          <div className="network__text-section">
            <div className="network__text-content">
              {/* Header */}
              <div className="network__header">
                <p className="network__eyebrow">Archinza Community</p>

                <h1 className="network__title">
                  Meet the platform that powers the built environment.
                </h1>

                <p className="network__description">
                  Discover projects, people, and possibilities—all in one place.
                  Archinza connects architects, material experts, and design
                  professionals through one intelligent ecosystem.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="network__stats">
                <div className="network__stat-item">
                  <div className="network__stat-number">
                    300<span className="network__stat-plus">+</span>
                  </div>
                  <p className="network__stat-label">Business/ Firm Owners</p>
                </div>

                <div className="network__stat-item">
                  <div className="network__stat-number">
                    100<span className="network__stat-plus">+</span>
                  </div>
                  <p className="network__stat-label">Working Professionals</p>
                </div>

                <div className="network__stat-item">
                  <div className="network__stat-number">
                    600<span className="network__stat-plus">+</span>
                  </div>
                  <p className="network__stat-label">Students</p>
                </div>

                <div className="network__stat-item">
                  <div className="network__stat-number">
                    100<span className="network__stat-plus">+</span>
                  </div>
                  <p className="network__stat-label">Freelancers/ Artists</p>
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
