import React, { useEffect, useRef } from "react";
import "./MobileHeroSection.scss";
import useTheme from "../../components/useTheme/useTheme";

const data = [
  { image: "/HomeGrid/Worker.png", label: "Manufacturers" },
  { image: "/HomeGrid/wardrobe.png", label: "Wardrobe" },
  { image: "/HomeGrid/PR.png", label: "Support Design" },
  { image: "/HomeGrid/skyscraper.png", label: "Insights" },
  { image: "/HomeGrid/site.png", label: "Site Visit" },
  { image: "/HomeGrid/farmhouse.png", label: "Farmhouse" },
  { image: "/HomeGrid/white_interior.png", label: "Interior" },
  { image: "/HomeGrid/siteworker.png", label: "Contractors" },
  { image: "/HomeGrid/Course.png", label: "Courses" },
  { image: "/HomeGrid/job.png", label: "Job" },
  { image: "/HomeGrid/kitchen.png", label: "Kitchen" },
  { image: "/HomeGrid/camera.png", label: "" },
  { image: "/HomeGrid/Wall.png", label: "Walls" },
  { image: "/HomeGrid/washroom.png", label: "Washroom" },
  { image: "/HomeGrid/sofa.png", label: "Products" },
  { image: "/HomeGrid/Material.png", label: "Materials" },
];

const MobileHeroSection = () => {
  const { theme } = useTheme();
  const trackRef = useRef(null);

  const columns = Array.from({ length: 5 }).map((_, colIdx) => {
    const top = data[(colIdx * 2) % data.length];
    const bottom = data[(colIdx * 2 + 1) % data.length];
    return [top, bottom];
  });

  const allColumns = [...columns, ...columns]; // duplicate for loop

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let offset = 0;
    const speed = 1.3; // tweak for smoothness
    let frameId;

    const animate = () => {
      offset -= speed;
      const width = track.scrollWidth / 2;

      if (Math.abs(offset) >= width) {
        offset = 0;
      }

      track.style.transform = `translateX(${offset}px)`;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section
      className={`mobile-hero  ${
        theme === "dark" ? "dark_mode--theme-styles" : ""
      }`}
    >
      <div className="hero-header">
        <h2>
          <span className="highlight">Find</span>
          <span className={`and  ${theme === "dark" ? "text-white" : ""}`}>
            and
          </span>
          <span className="highlight">be found</span>
          <span className={`subtitle  ${theme === "dark" ? "text-white" : ""}`}>
            at every step of your Design & Build journey.
          </span>
        </h2>
        <p  className={`description  ${
              theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
            }`}>
          <b>Discovery</b> made easy using <br />
          <b>Archinza’s intelligent AI solutions.</b>
        </p>
      </div>

      <div className="scroll-wrapper">
        <div className="scroll-track" ref={trackRef}>
          {allColumns.map((pair, index) => (
            <div
              key={index}
              className={`column col-${index % 5}`}
              style={{
                marginTop:
                  index % 5 === 0 ? "64px" : index % 5 === 2 ? "36px" : "0px",
              }}
            >
              {pair.map((item, idx) => (
                <div key={idx} className="card">
                  <img src={item.image} alt={item.label} className="card-img" />
                  {item.label && (
                    <span className="card-label">{item.label}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobileHeroSection;
