import React from "react";
import { ArrowRight } from "lucide-react";
import "./WhoIsItFor.scss";
import useTheme from "../../components/useTheme/useTheme";

const sectionsData = [
  {
    id: 1,
    heading: "Business/ Firm Owners",
    description:
      "Find professionals, products, materials and services for your projects, all in one place. Connect with businesses on demand, use the Ask Anything WhatsApp bot for quick answers, and explore more on Archinza Web.",
    tags: ["Design & Consult", "Manufacture & Resell", "Support Design"],
    image: "/Personal/Owner.png",
    buttonText: "Get Started on Archinza Web",
  },
  {
    id: 2,
    heading: "Working Professionals",
    description:
      "Save time with AI-powered search for curated products and project needs. For quick design questions, use instant queries on WhatsApp. Explore jobs and upskill all without endless browsing.",
    tags: ["Verified Vendors", "Transparent Pricing", "Quick Connect"],
    image: "/Personal/Working.png",
    buttonText: "Explore Vendors",
  },
  {
    id: 3,
    heading: "Freelancer/ Artists",
    description:
      "Looking to bring your projects to life? Reach the right businesses, search products and materials, find inspiration, and get quick answers, all on Archinza Web and the Ask Anything WhatsApp bot.",
    tags: ["Beautiful Profiles", "Easy Updates", "SEO Ready"],
    image: "/Personal/Artist.png",
    buttonText: "Showcase Now",
  },
  {
    id: 4,
    heading: "Students",
    description:
      "Find courses, resources, materials, products and projects to explore, all in one place. Get quick answers with the Ask Anything WhatsApp bot, and explore more on Archinza Web.",
    tags: ["Beautiful Profiles", "Easy Updates", "SEO Ready"],
    image: "/Personal/Students.png",
    buttonText: "Showcase Now",
  },
  {
    id: 5,
    heading: "Homeowners / DIY Enthusiast",
    description:
      "Looking to upgrade your space or get inspired? Discover businesses, products, and materials, get quick answers with the Ask Anything WhatsApp bot, and explore more on Archinza Web.",
    tags: ["Beautiful Profiles", "Easy Updates", "SEO Ready"],
    image: "/Personal/Home.png",
    buttonText: "Showcase Now",
  },
];

const WhoIsItFor = () => {
  const { theme } = useTheme();
  return (
    <section className="who-is-it-for">
      {/* Header */}
      <div
        className="who-is-it-for__header"
        style={{
          backgroundColor: theme === "dark" ? "#ffffff1a" : "",
          color: theme === "dark" ? "#ffffffcc" : "",
        }}
      >
        <h2
          className="who-is-it-for__title"
          style={{
            color: theme === "dark" ? "#ffffff" : "",
          }}
        >
          Archinza for Personal Use
        </h2>
        <p
          className="who-is-it-for__subtitle"
          style={{
            color: theme === "dark" ? "#ffffff" : "",
          }}
        >
          Dive in for free and explore the world of design, ideas, products, and
          inspiration with Archinza.
        </p>
      </div>

      <div className="who-is-it-for__container">
        {sectionsData.map((section, index) => (
          <div
            key={section.id}
            className={`who-is-it-for__section ${
              index % 2 !== 0 ? "who-is-it-for__section--reverse" : ""
            }`}
          >
            {/* Text Section */}
            <div className="who-is-it-for__text-section">
              <div className="who-is-it-for__text-content">
                <h1
                  className="who-is-it-for__section-title"
                  style={{
                    color: theme === "dark" ? "#ffffff" : "",
                  }}
                >
                  {section.heading}
                </h1>
                <p
                  className="who-is-it-for__section-description"
                  style={{
                    color: theme === "dark" ? "#ffffff" : "",
                  }}
                >
                  {section.description}
                </p>
              </div>
            </div>

            {/* Image Section */}
            <div className="who-is-it-for__image-section">
              <img
                src={section.image}
                alt={section.heading}
                className="who-is-it-for__image"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhoIsItFor;
