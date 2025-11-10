import React, { useEffect, useState, useRef } from "react";
import "./Hero.scss";
import useTheme from "../../components/useTheme/useTheme";

const data = [
  { image: "/HomeGrid/Worker.png", label: "" },
  { image: "/HomeGrid/wardrobe.png", label: "Wardrobe" },
  { image: "/HomeGrid/PR.png", label: "Support Design" },
  { image: "/HomeGrid/skyscraper.png", label: "" },
  { image: "/HomeGrid/site.png", label: "" },
  { image: "/HomeGrid/farmhouse.png", label: "Farm House" },
  { image: "/HomeGrid/white_interior.png", label: "White Interior" },
  { image: "/HomeGrid/siteworker.png", label: "Site Worker" },
  { image: "/HomeGrid/Course.png", label: "Course" },
  { image: "/HomeGrid/job.png", label: "Job" },
  { image: "/HomeGrid/kitchen.png", label: "Kitchen" },
  { image: "/HomeGrid/camera.png", label: "" },
  { image: "/HomeGrid/Wall.png", label: "" },
  { image: "/HomeGrid/washroom.png", label: "Washroom" },
  {
    image: "/HomeGrid/sofa.png",
    label: "Search Product and Materials",
    labelIcon: "/HomeGrid/sofa.png",
  },
  { image: "/HomeGrid/Material.png", label: "" },
];

const imagePairs = [
  [0, 15],
  [1, 14],
  [2, 13],
  [3, 12],
  [4, 11],
  [5, 10],
  [6, 9],
  [7, 8],
];

const intervals = [3000, 4000, 5000, 7000, 8000, 5000, 4000, 6000];
const TRANSITION_MS = 700; // matches duration-700

const ImageCard = ({ image, label, labelIcon, showLabel }) => {
  const containerRef = useRef(null);
  const timeoutsRef = useRef([]);
  const mountedRef = useRef(true);

  const [layers, setLayers] = useState(() => [
    { image, label, labelIcon, pos: { top: "10px", left: "10px" } },
    {
      image: "",
      label: "",
      labelIcon: undefined,
      pos: { top: "10px", left: "10px" },
    },
  ]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [visibleIdx, setVisibleIdx] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  const getRandomPosition = () => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const labelWidth = 140;
      const labelHeight = 40;
      const maxLeft = Math.max(0, containerWidth - labelWidth);
      const maxTop = Math.max(0, containerHeight - labelHeight);
      const left = Math.random() * maxLeft;
      const top = Math.random() * maxTop;
      return { top: `${top}px`, left: `${left}px` };
    }
    return { top: "10px", left: "10px" };
  };

  useEffect(() => {
    const current = layers[activeIdx];
    if (image === current.image && label === current.label) {
      setLayers((prev) => {
        const next = [...prev];
        next[activeIdx] = { ...next[activeIdx], pos: getRandomPosition() };
        return next;
      });
      return;
    }

    const incomingIdx = 1 - activeIdx;
    const pos = getRandomPosition();
    let cancelled = false;
    const loader = new Image();
    loader.src = image;

    loader.onload = () => {
      if (!mountedRef.current || cancelled) return;
      setLayers((prev) => {
        const cp = [...prev];
        cp[incomingIdx] = { image, label, labelIcon, pos };
        return cp;
      });
      window.requestAnimationFrame(() => {
        if (!mountedRef.current) return;
        setVisibleIdx(incomingIdx);
      });

      const tid = window.setTimeout(() => {
        if (!mountedRef.current) return;
        setActiveIdx(incomingIdx);
      }, TRANSITION_MS + 10);

      timeoutsRef.current.push(tid);
    };

    loader.onerror = () => {
      if (!mountedRef.current || cancelled) return;
      setLayers((prev) => {
        const cp = [...prev];
        cp[incomingIdx] = { image, label, labelIcon, pos };
        return cp;
      });
      window.requestAnimationFrame(() => {
        if (!mountedRef.current) return;
        setVisibleIdx(incomingIdx);
      });
      const tid = window.setTimeout(() => {
        if (!mountedRef.current) return;
        setActiveIdx(incomingIdx);
      }, TRANSITION_MS + 10);
      timeoutsRef.current.push(tid);
    };

    return () => {
      cancelled = true;
      loader.onload = null;
      loader.onerror = null;
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, [image, label, labelIcon]);

  return (
    <div ref={containerRef} className="image-card">
      {[0, 1].map((idx) => {
        const layer = layers[idx];
        const isVisible = visibleIdx === idx;
        return (
          <div
            key={idx}
            className={`card-layer ${isVisible ? "visible" : ""}`}
            aria-hidden={!isVisible}
          >
            {layer.image ? (
              <img
                src={layer.image}
                alt={layer.label || "image"}
                className="card-image"
                draggable={false}
              />
            ) : (
              <div className="card-image placeholder" />
            )}

            {showLabel && layer.label && (
              <span
                className="image-label"
                style={{ top: layer.pos.top, left: layer.pos.left }}
              >
                {layer.labelIcon && (
                  <img
                    src={layer.labelIcon}
                    className="label-icon"
                    alt="icon"
                  />
                )}
                <span className="label-text">{layer.label}</span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const HeroSection = () => {
  const { theme} = useTheme();
  const [activeIndexes, setActiveIndexes] = useState(
    imagePairs.map(([indexA]) => indexA)
  );

  useEffect(() => {
    const intervalIds = imagePairs.map((pair, i) =>
      window.setInterval(() => {
        setActiveIndexes((prev) => {
          const next = [...prev];
          const [a, b] = pair;
          next[i] = prev[i] === a ? b : a;
          return next;
        });
      }, intervals[i])
    );

    return () => {
      intervalIds.forEach(clearInterval);
    };
  }, []);

  return (
    <section
      className={`hero-section  ${
        theme === "dark" ? "dark_mode--theme-styles" : ""
      }`}
    >
      <div className="hero-container">
        <div className="hero-header">
          <h2>
            <span className="highlight">Find</span>
            <span
              className={`and-text  ${theme === "dark" ? "text-white" : ""}`}
            >
              and
            </span>
            <span className={`highlight `}>be found</span>
            <span
              className={`subtitle  ${theme === "dark" ? "text-white" : ""}`}
            >
              at every step of your Design & Build journey.
            </span>
          </h2>
          <p
            className={`description  ${
              theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
            }`}
          >
            <b>Discovery</b> made easy using{" "}
            <b>Archinza’s intelligent AI solutions</b>.
          </p>
        </div>
      </div>

      <div className="hero-grid">
        <div className="column col-1">
          <ImageCard {...data[activeIndexes[0]]} showLabel={true} />
        </div>

        <div className="column col-2">
          <ImageCard {...data[activeIndexes[1]]} showLabel={true} />
          <ImageCard {...data[activeIndexes[2]]} showLabel={true} />
        </div>

        <div className="column col-3">
          <ImageCard {...data[activeIndexes[3]]} showLabel={true} />
          <ImageCard {...data[activeIndexes[4]]} showLabel={true} />
        </div>

        <div className="column col-4">
          <ImageCard {...data[activeIndexes[5]]} showLabel={true} />
          <ImageCard {...data[activeIndexes[6]]} showLabel={true} />
        </div>

        <div className="column col-5">
          <ImageCard {...data[activeIndexes[7]]} showLabel={true} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
