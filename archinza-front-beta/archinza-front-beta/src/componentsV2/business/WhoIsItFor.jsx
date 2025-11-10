import React from "react";
import "./WhoIsItFor.scss";
import { ArrowRight } from "lucide-react";
import useTheme from "../../components/useTheme/useTheme";

const sectionsData = [
  {
    id: 1,
    heading: "Businesses that Design & Consult",
    description:
      "Archinza helps Designers and Consultants exhibit their unique services, get discovered by clients, generate qualified leads, gain insights and easily find relevant people & products.",
    tags: [
      "Architecture Firms",
      "Interior Design Firms",
      "HVAC Consultants",
      "Vastu Consultants",
      "Structural Consultants",
    ],
    image: "/Business/Architects.png",
    buttonText: "Get Started on Archinza Web",
  },
  {
    id: 2,
    heading: "Businesses that  Build or Install",
    description:
      "Archinza helps execution-focused businesses present their work to a targeted industry audience, get discovered by clients and professionals, generate qualified leads and gain insights.",
    tags: [
      "Turnkey Contracting",
      "Furniture Manufacturing",
      "On-site Fabrication",
      "Execution",
      "Installation",
    ],
    image: "/Business/Build_Install.png",
    buttonText: "Explore Vendors",
  },
  {
    id: 3,
    heading: "Businesses that Sell Products or Materials",
    description:
      "Archinza helps vendors increase product visibility among buyers, attract professional interest, generate qualified leads, and gain insights.",
    tags: ["Showrooms", "Distributors", "Importers", "Vendors"],
    image: "/Business/Sell.png",
    buttonText: "Showcase Now",
  },
  {
    id: 4,
    heading: "Manufacturers/ Brands that sell via distributors",
    description:
      "Archinza links national and international brands to the design and construction ecosystem, expanding reach, attracting the right buyers and industry professionals, and providing insights.",
    tags: ["Furniture Manufacturer", "Lighting Fixtures", "Flooring Solutions"],
    image: "/Business/Manufactureres.png",
    buttonText: "Showcase Now",
  },
  {
    id: 5,
    heading: "Businesses that Support Design",
    description:
      "Archinza helps Design Support providers get noticed by industry professionals, showcase their expertise, generate leads, and gain insights.",
    tags: [
      "Events Organizer",
      "PR Agency",
      "Photographers",
      "3D Visualizer",
      "Marketing Agency",
    ],
    image: "/Business/SupportDesigns.png",
    buttonText: "Showcase Now",
  },
];

const WhoIsItFor = () => {
  const { theme } = useTheme();
  return (
    <section className="whoisitfor_section">
      {/* Header */}
      <div
        className="section_header"
        style={{
          backgroundColor: theme === "dark" ? "#ffffff1a" : "",
          color: theme === "dark" ? "#ffffffcc" : "",
        }}
      >
        <h2
          className="header_title"
          style={{
            color: theme === "dark" ? "#ffffff" : "",
          }}
        >
          Archinza for different businesses
        </h2>
        <p
          className={`header_description ${
            theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
          }`}
        >
          Archinza works for all kinds of businesses, from small firms to global
          brands. Onboarding is free and showcasing offerings is easy.
        </p>
      </div>

      <div className="sections_container">
        {sectionsData.map((section, index) => (
          <div
            key={section.id}
            className={`section_item ${index % 2 !== 0 ? "reverse" : ""}`}
          >
            {/* Text Section */}
            <div className="text_section">
              <h1
                className={`section_heading ${
                  theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
                }`}
              >
                {section.heading}
              </h1>
              <p
                className={`section_description ${
                  theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
                }`}
              >
                {section.description}
              </p>
              <div className="tags_wrapper">
                {section.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="tag"
                    style={{
                      backgroundColor: theme === "dark" ? "#ffffff1a" : "",
                      color: theme === "dark" ? "#ffffffcc" : "",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Image Section */}
            <div className="image_section">
              <img
                src={section.image}
                alt={section.heading}
                className="section_image"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhoIsItFor;
