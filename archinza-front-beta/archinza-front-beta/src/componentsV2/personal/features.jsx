import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./features.scss";
import useTheme from "../../components/useTheme/useTheme";

const sectionsData = [
  {
    id: 1,
    heading: "Search made simple",
    description:
      "From flooring to furniture. Lighting to landscapers. Get AI-powered recommendations in seconds.",
    image: "/Personal/Personal_Assisstant.png",
    buttonText: "Explore",
  },
  {
    id: 2,
    heading: "Ask anything from design to technical",
    description:
      '"How do I style a small room?" "What\'s the ideal lighting for a workspace?" Get instant answers in one chat.',
    tags: ["Design & Consult", "Manufacture & Resell", "Support Design"],
    image: "/Personal/Design_Idea.png",
    buttonText: "Get Started on Archinza Web",
  },
  {
    id: 3,
    heading: "Save it for later",
    description:
      "Bookmark products, businesses and ideas so they're ready when you are.",
    tags: ["Verified Vendors", "Transparent Pricing", "Quick Connect"],
    image: "/Personal/Material_Selection.png",
    buttonText: "Explore Vendors",
  },
  // {
  //   id: 4,
  //   heading: "Search made simple",
  //   description: "Some description for feature 4.",
  //   image: "/Personal/Visual_Discovery.png",
  //   buttonText: "Explore",
  // },
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
    <section className="features">
      {/* Header */}
      <div
        className="features__header"
        style={{
          backgroundColor: theme === "dark" ? "#ffffff1a" : "",
          color: theme === "dark" ? "#ffffffcc" : "",
        }}
      >
        <h2
          className="features__title"
          style={{
            color: theme === "dark" ? "#ffffff" : "",
          }}
        >
          How we help you
        </h2>
      </div>

      <div className="features__container">
        {sectionsData.map((section, index) => (
          <div
            key={section.id}
            className={`features__section ${
              index % 2 !== 0 ? "features__section--reverse" : ""
            }`}
          >
            {/* Text Section */}
            <div className="features__text-section">
              <div className="features__text-content">
                <h1
                  className="features__section-title"
                  style={{
                    color: theme === "dark" ? "#ffffff" : "",
                  }}
                >
                  {section.heading}
                </h1>
                <p
                  className="features__section-description"
                  style={{
                    color: theme === "dark" ? "#ffffff" : "",
                  }}
                >
                  {section.description}
                </p>
              </div>
            </div>

            {/* Image Section */}
            {section.video ? (
              <video
                src={section.video}
                autoPlay
                loop
                muted
                playsInline
                className="features__media features__media--video"
              />
            ) : (
              <img
                src={section.image}
                alt={section.heading}
                className="features__media"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
