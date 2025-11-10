import React, { useState, useEffect, useRef } from "react";
import "./typingTextAnimation.scss";
import gsap from "gsap";

const TypingTextAnimation = ({
  texts = [],
  typingSpeed = 1.5,
  deletingSpeed = 1.5,
  delayBeforeDelete = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef(null);
  const timeoutRef = useRef(null);
  const animationInProgress = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Main animation logic
  useEffect(() => {
    if (!texts.length || !wrapperRef.current) return;

    const animateTyping = () => {
      if (animationInProgress.current) return;

      animationInProgress.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          animationInProgress.current = false;
          timeoutRef.current = setTimeout(
            animateTyping,
            delayBeforeDelete * 1000
          );
        },
      });

      // Ensure the wrapper starts at full width before deleting
      gsap.set(wrapperRef.current, { width: "100%", maxWidth: "fit-content" });

      tl.to(wrapperRef.current, {
        width: 0,
        duration: deletingSpeed,
        ease: "power2.inOut",
      })
        .call(() => {
          setActiveIndex((prev) => (prev + 1) % texts.length);
        })
        .set(wrapperRef.current, { width: 0 }) // Reset width before typing
        .to(wrapperRef.current, {
          width: "100%",
          maxWidth: "fit-content",
          duration: typingSpeed,
          ease: "power2.inOut",
        });
    };

    // Start the animation immediately on mount, then loop
    animateTyping();

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [texts, typingSpeed, deletingSpeed, delayBeforeDelete]);

  return (
    <div className="type_wrapper">
      <div ref={wrapperRef} className="typing_text">
        {texts[activeIndex]}
      </div>
    </div>
  );
};

export default TypingTextAnimation;
