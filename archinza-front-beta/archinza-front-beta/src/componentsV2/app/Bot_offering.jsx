import React from "react";

const Bot = () => {
  return (
    <div className="flex-shrink-0 w-full lg:w-auto">
      {/* Desktop Image */}
      <img
        src="/images/bot.png"
        alt="Business professionals collaborating"
        className="hidden lg:block w-full h-auto"
      />
      {/* Mobile Image */}
      <img
  src="/images/Bot_Mobile.png"
  alt="Business team meeting"
  className="lg:hidden w-full max-w-none"
/>
    </div>
  );
};

export default Bot;
