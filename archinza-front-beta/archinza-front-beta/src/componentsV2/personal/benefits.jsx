import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./benefits.scss";

const sectionsData = [
  {
    id: 1,
    heading: "Get found by people searching for services like yours",
    description:
      "Archinza Web helps businesses and individuals discover the right materials, connect with trusted vendors, and showcase their work.",
    tags: ["Design & Consult", "Manufacture & Resell", "Support Design"],
    image: "/Business/Search.png",
    buttonText: "Get Started on Archinza Web",
  },
  {
    id: 2,
    heading: "AI that answers for your Business, to anyone, anytime",
    description:
      "Connect with verified vendors, browse materials with transparency, and save time on procurement.",
    tags: ["Verified Vendors", "Transparent Pricing", "Quick Connect"],
    image: "/Business/AIBusinessBot.png",
    buttonText: "Explore Vendors",
  },
  {
    id: 3,
    heading: "Receive Business enquires from Clients",
    description: "Some description for feature 3.",
    image: "/Business/AIBusinessBot.png",
    buttonText: "Explore",
  },
  {
    id: 4,
    heading: "Feature 4 Title",
    description: "Some description for feature 4.",
    image: "/Business/AIBusinessBot.png",
    buttonText: "Explore",
  },
];

const Benefits = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    <section className="benefits">
      <div className="benefits__header">
        <h2 className="benefits__title">What all we offer</h2>
      </div>

      <div className="benefits__container">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll("left")}
            className="benefits__arrow benefits__arrow--left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Scrollable Container */}
        <div ref={scrollRef} className="benefits__scroll-container">
          {sectionsData.map((section) => (
            <div key={section.id} className="benefits__card">
              <div className="benefits__card-content">
                <img
                  src={section.image}
                  alt={section.heading}
                  className="benefits__card-image"
                />
                <h3 className="benefits__card-title">{section.heading}</h3>
                <p className="benefits__card-description">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll("right")}
            className="benefits__arrow benefits__arrow--right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </section>
  );
};

export default Benefits;
