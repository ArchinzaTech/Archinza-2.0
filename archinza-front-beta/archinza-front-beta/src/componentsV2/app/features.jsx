import React, { useState } from "react";
import "./FeaturesBus.scss";
import useTheme from "../../components/useTheme/useTheme";

const FeaturesBus = () => {
  const [activeTab, setActiveTab] = useState("ask");
  const { theme } = useTheme();
  const tabs = [
    { id: "ask", label: "Brand Page" },
    { id: "search", label: "Business Bot" },
    { id: "reach", label: "Archinza Gallery" },
    { id: "connect", label: "Business Insights" },
    { id: "recommend", label: "AI Matchmaking" },
  ];

  const tabContent = {
    ask: {
      id: "ask",
      title: "Easy Onboarding",
      heading: "Your intelligent business page, built in minutes",
      items: [
        "We use AI and automation to turn your PDFs, catalogues, and social profiles into a visually rich, structured, and searchable business page — all in a few simple steps.",
        "• Architecture Firms",
        "• Interior Design Firms",
        "• Material Vendors",
        "• Product Vendors",
      ],
      image: "/Business/BusinessDBRen.png",
    },
    search: {
      id: "search",
      title: "Business Bot",
      heading: "Automate Conversations with Archinza AI",
      items: [
        "Archinza's Business Bot brings AI support to your business, automating customer conversations and routing queries intelligently.",
        "• Your clients can chat directly with your Business AI.",
        "• Answers come from your past work & process",
        "• Be available 24/7 — even when you're not",
      ],
      image: "/Business/Business_Bot.png",
    },
    reach: {
      id: "reach",
      title: "Archinza Gallery",
      heading: "Your Best Work, Showcased Automatically",
      items: [
        "A curated space that collects and showcases your best work, making your offerings easy to discover. Highlight your design vision, craftsmanship, and product applications with Archinza Gallery.",
      ],
      image: "/Business/Archinza_Gallery.png",
    },
    connect: {
      id: "connect",
      title: "Business Insights",
      heading: "Know What's Getting You Noticed",
      items: [
        "Get real-time insights on reach, discovery, and interest. See what's drawing attention, where you're being viewed, and how people are finding you so you can stay one step ahead.",
      ],
      image: "/Business/Business_INsights.png",
    },
    recommend: {
      id: "recommend",
      title: "AI Matchmaking",
      heading: "Designed to Be Found",
      items: [
        "Be discoverable to people actively searching for what you offer. Archinza's AI Matchmaking pairs your business with relevant searches and interests thus expanding your visibility.",
      ],
      image: "/Business/Recommendations.png",
    },
  };

  const currentContent = tabContent[activeTab];

  return (
    <div className="features-bus-container">
      <div
        className="features-bus-wrapper"
        style={{
          background: theme === "dark" ? "#ffffff1a" : "",
        }}
      >
        {/* Desktop Tabs */}
        <div className="desktop-tabs">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <div
              className="tab-container"
              // style={{
              //   backgroundColor: theme === "dark" ? "#ffffff1a" : "",
              //   color: theme === "dark" ? "#ffffffcc" : "",
              // }}
            >
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

          {/* Active Tab Content */}
          <div className="tab-content">
            <div className="content-section">
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
                      theme === "dark"
                        ? "dark_mode_text_muted--theme-styles"
                        : ""
                    }`}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="image-section">
              <div className="image-container">
                <img
                  src={currentContent.image}
                  alt={currentContent.heading}
                  className="content-image"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="mobile-cards">
          {tabs.map((tab) => {
            const content = tabContent[tab.id];
            return (
              <div
                key={tab.id}
                className="mobile-card"
                style={{
                  backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                }}
              >
                {content.image && (
                  <img
                    src={content.image}
                    alt={content.heading}
                    className="mobile-image"
                  />
                )}
                <h2
                  className="mobile-heading"
                  style={{
                    color: theme === "dark" ? "#ffffff" : "",
                  }}
                >
                  {content.heading}
                </h2>
                <div className="mobile-items">
                  {content.items.map((item, i) => (
                    <p
                      key={i}
                      className={`mobile-item  ${
                        theme === "dark"
                          ? "dark_mode_text_muted--theme-styles"
                          : ""
                      }`}
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturesBus;
