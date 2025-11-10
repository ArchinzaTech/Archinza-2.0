import React, { useState } from "react";
import "./FeaturesUser.scss";
import useTheme from "../../components/useTheme/useTheme";

const FeaturesUser = () => {
  const [activeTab, setActiveTab] = useState("search");
  const { theme, isDark, isLight } = useTheme();
  const tabs = [
    { id: "search", label: "Search" },
    { id: "ask", label: "Ask" },
    { id: "reach", label: "Save" },
    { id: "connect", label: "Explore" },
  ];

  const tabContent = {
    search: {
      id: "search",
      title: "Business Bot",
      heading: "Search, Made Smarter",
      items: [
        "• Find exactly what you’re looking for with Archinza’s intelligent text/ image based search. Whether it’s experts, products, services, or materials, our curated results simplify discovery.",
        "• Discover people and businesses near you",
        "• Search products, materials, and services instantly",
        "• Get results tailored to your needs",
      ],
      image: "/Business/Search_tabs.png",
    },
    ask: {
      id: "ask",
      title: "Easy Onboarding",
      heading: "Ask, and Get Answers",
      items: [
        "Archinza’s WhatsApp bot gives you instant access to knowledge and support. Ask anything from design questions to vendor details and get quick, accurate responses powered by our network and AI.",
        "• Ask queries anytime, anywhere",
        "• Get instant guidance and trusted answers",
        "• Stay connected without endless searching",
      ],
      image: "/Business/Ask_tabs.png",
    },
    reach: {
      id: "reach",
      title: "Archinza Gallery",
      heading: "Save, for Later",
      items: [
        "Keep track of what inspires you. Save your favorite people, products, or ideas into your personal space so they’re ready whenever you want to revisit or act on them.",
        "• Save experts, products, and materials",
        "• Organize your favorite finds easily",
        "• Access your list anytime on any device",
      ],
      image: "/Business/Save_tabs.png",
    },
    connect: {
      id: "connect",
      title: "Connect",
      heading: "Explore, Without Limits",
      items: [
        "Archinza opens up a world of opportunities. Go beyond search to explore curated jobs, courses, events, and industry updates everything you need to grow and stay inspired in design and build.",
        "• Find jobs, internships, and courses",
        "• Stay updated with events and news",
        "• Explore people, ideas, and innovations",
      ],
      image: "/Business/Explore_tabs.png",
    },
    recommend: {
      id: "recommend",
      title: "Connect",
      heading: "Connect with peers",
      items: [
        "Join our community of architects",
        "• Collaborate on projects",
        "• Share knowledge and experiences",
      ],
      image: "/Business/Recommendations.png",
    },
  };

  const currentContent = tabContent[activeTab];

  return (
    <div className="features-user-container">
      {/* Desktop Section */}
      <div
        className="desktop-section"
        style={{
          background: theme === "dark" ? "#ffffff1a" : "",
        }}
      >
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <div className="tab-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${
                  activeTab === tab.id ? "active" : "inactive"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Left Content */}
          <div className="left-content">
            <h2
              className={`content-heading  ${
                theme === "dark" ? "text-white" : ""
              }`}
            >
              {currentContent.heading}
            </h2>
            <div className="content-items">
              {currentContent.items.map((item, index) => (
                <p
                  key={index}
                  className={`content-item  ${
                    theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
                  }`}
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Right Mockup */}
          <div className="right-mockup">
            <div className="mockup-container">
              {currentContent.image && (
                <img
                  src={currentContent.image}
                  alt={currentContent.heading}
                  className="mockup-image"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Section (cards) */}
      <div className="mobile-section">
        {tabs.map((tab) => {
          const content = tabContent[tab.id];
          return (
            <div key={tab.id} className="mobile-card">
              {content.image && (
                <img
                  src={content.image}
                  alt={content.heading}
                  className="mobile-image"
                />
              )}
              <h2 className="mobile-heading">{content.heading}</h2>
              <div className="mobile-items">
                {content.items.map((item, i) => (
                  <p key={i} className="mobile-item">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesUser;
