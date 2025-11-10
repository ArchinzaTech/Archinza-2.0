import React, { useState, useEffect } from "react";
import { blacklogo, whitelogo } from "../../images";

const SiteLoader = ({ whiteTheme }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (!loading) return null;

  return (
    <section
      id="loader"
      className="site_loader"
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        pointerEvents: "none",
        position: "absolute",
        zIndex: "99",
        top: 0,
        left: 0,
        background: whiteTheme ? "#000" : "#fff",
      }}
    >
      <img
        src={whiteTheme ? blacklogo : whitelogo}
        alt="loader"
        className="loader_logo"
      />
    </section>
  );
};

export default SiteLoader;
