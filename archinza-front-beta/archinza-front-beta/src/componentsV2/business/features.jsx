import React, { useRef, useState, useEffect } from "react";
import "./features.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useTheme from "../../components/useTheme/useTheme";

const sectionsData = [
  {
    id: 1,
    heading: "Get found by people searching for services like yours",
    description:
      "Help clients and industry professionals discover verified, relevant businesses, explore portfolios or catalogues, access key information, and connect with your services on demand.",
    tags: ["Design & Consult", "Manufacture & Resell", "Support Design"],
    video: "/Business/Search.mp4",
    buttonText: "Get Started on Archinza Web",
  },
  {
    id: 2,
    heading: "AI that answers for your Business, to anyone, anytime",
    description:
      "Archinza’s Business Bot, an AI-powered assistant, is trained on every businesses Q&As and information, it answers client queries instantly, and provide personalized guidance that drives engagement and conversions.",
    tags: ["Verified Vendors", "Transparent Pricing", "Quick Connect"],
    image: "/Business/AIBusinessBot.png",
    buttonText: "Explore Vendors",
  },
  {
    id: 3,
    heading: "From Your Info to a Smart Business Page",
    description:
      "Provide your company profile/ catalogue and one social link, and Archinza instantly turns them into a structured, visually rich, searchable business page effortlessly.",
    video: "/Business/Scraper_Illustration.mp4",
    buttonText: "Explore",
  },
];

const Features = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { theme } = useTheme();
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.offsetWidth * 0.8;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft + container.offsetWidth < container.scrollWidth - 5
      );
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollButtons);
    return () => container.removeEventListener("scroll", updateScrollButtons);
  }, []);

  return (
    <section className="features_section">
      {/* Header */}
      <div
        className="features_header"
        style={{
          backgroundColor: theme === "dark" ? "#ffffff1a" : "",
          color: theme === "dark" ? "#ffffffcc" : "",
        }}
      >
        <h2
          className="features_title"
          style={{
            color: theme === "dark" ? "#ffffff" : "",
          }}
        >
          How we help you
        </h2>
      </div>

      <div className="features_container">
        {sectionsData.map((section, index) => (
          <div
            key={section.id}
            className={`feature_item ${index % 2 !== 0 ? "reverse" : ""}`}
          >
            {/* Text Section */}
            <div className="feature_text_section">
              <h1
                className="feature_heading"
                style={{
                  color: theme === "dark" ? "white" : "",
                }}
              >
                {section.heading}
              </h1>
              <p
                className={`feature_description ${
                  theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
                }`}
              >
                {section.description}
              </p>
            </div>

            {/* Image/Video Section */}
            {section.video ? (
              <video
                src={section.video}
                autoPlay
                loop
                muted
                playsInline
                className="feature_media"
              />
            ) : (
              <img
                src={section.image}
                alt={section.heading}
                className="feature_media"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
