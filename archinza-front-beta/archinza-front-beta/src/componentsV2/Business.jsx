import { useEffect, useState } from "react";
import "./business.scss";
import Bus_Offering from "./business/Offerings";
import SectionToggle from "./business/Toggle";
import Features from "./business/features";
import WhoIsItFor from "./business/WhoIsItFor";
import Benefits from "./business/benefits";
import NetworkSection from "./business/Network";
import BusinessPricing from "./business/businessPricing";
import FooterV2 from "../components/FooterV2/FooterV2";
import PromotePopup from "../components/PromotePopup/PromotePopup";
import useTheme from "../components/useTheme/useTheme";

const Business = () => {
  const [isPromotePopupModal, setIsPromotePopupModal] = useState(false);
  const handleShow = () => setIsPromotePopupModal(true);
  const { theme } = useTheme();
  const handleHide = () => setIsPromotePopupModal(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section
        className={`business_main_sec  ${
          theme === "dark" ? "dark_mode--theme-styles" : ""
        }`}
      >
        <Bus_Offering
        // openPopup={handleShow}
        />
        {/* <NetworkSection /> */}
        <SectionToggle />
        <section id="who-is-it-for">
          <WhoIsItFor />
        </section>
        <section id="features">
          <Features />
        </section>

        <section id="benefits">
          <Benefits />
        </section>

        {/* <FeaturesBus /> */}
        <br />
        <br />
        <section>
          <BusinessPricing
          // openPopup={handleShow}
          />
        </section>
      </section>
      <PromotePopup
        show={isPromotePopupModal}
        onHide={() => setIsPromotePopupModal(false)}
        handleClose={handleHide}
        title="Under Construction"
        desc="Coming Soon to help you design & build!"
      />
      {theme === "dark" ? <FooterV2 /> : <FooterV2 lightTheme />}
    </>
  );
};

export default Business;
