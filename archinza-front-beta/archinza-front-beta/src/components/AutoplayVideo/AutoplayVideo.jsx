import React, { useState, useRef } from "react";

const AutoplayVideo = ({
  classProp,
  videoSource,
  fallbackImg,
  width,
  height,
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    videoRef.current.play();
  };

  const handleToggleMute = () => {
    setMuted((current) => !current);
  };

  return (
    <div style={{ position: "relative", width, height }}>
      {!isVideoLoaded && (
        <img
          src={fallbackImg}
          alt="video fallback"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
      <video
        className={classProp}
        ref={videoRef}
        controls={!isVideoLoaded}
        autoPlay
        muted={muted}
        loop
        playsInline
        style={{
          display: isVideoLoaded ? "block" : "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          cursor: "pointer",
          objectPosition: "bottom",
        }}
        onLoadedData={handleVideoLoaded}
        onClick={handleToggleMute}
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default AutoplayVideo;
