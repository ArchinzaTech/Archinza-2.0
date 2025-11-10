import React, { useEffect, useState } from "react";
import "./Toggle.scss";
import useTheme from "../../components/useTheme/useTheme";

const SectionToggle = () => {
  const [activeId, setActiveId] = useState("who-is-it-for");
  const { theme } = useTheme();
  const tabs = [
    { id: "who-is-it-for", label: "Who is it for" },
   { id: "features", label: "How we help you" },
    // { id: "benefits", label: "Benefits" },
  ];

  // Smooth scroll handler
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveId(id); // update active section
    }
  };

  // Track which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 100; // Add offset for top bar
      let currentId = activeId;

      for (const tab of tabs) {
        const section = document.getElementById(tab.id);
        if (section) {
          const offsetTop = section.offsetTop;
          const offsetHeight = section.offsetHeight;

          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            currentId = tab.id;
            break;
          }
        }
      }

      if (currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeId]);

  return (
    <div className={`section_toggle ${theme === "dark" ? "section_tg_drk" : ""}`}>
      <div className="toggle_wrapper">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            className={` 
              ${activeId === tab.id ? "active" : ""} 
            ${theme === "dark" ? "white_text" : ""}
            ${theme === "light" ? "toggle_button" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectionToggle;
