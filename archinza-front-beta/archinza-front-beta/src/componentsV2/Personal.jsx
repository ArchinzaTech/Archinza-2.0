import { useEffect, useState } from "react";
import "./personal.scss";
import Bus_Offering from "./personal/Offerings";
import SectionToggle from "./personal/Toggle";
import Features from "./personal/features";
import WhoIsItFor from "./personal/WhoIsItFor";
import Benefits from "./personal/benefits";
import FooterV2 from "../components/FooterV2/FooterV2";
import PromotePopup from "../components/PromotePopup/PromotePopup";
import useTheme from "../components/useTheme/useTheme";

const Personal = () => {
  const [isPromotePopupModal, setIsPromotePopupModal] = useState(false);
  const { theme } = useTheme();
  const handleShow = () => setIsPromotePopupModal(true);
  const handleHide = () => setIsPromotePopupModal(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section
        className={`personal_main_sec ${
          theme === "dark" ? "dark_mode--theme-styles" : ""
        }`}
      >
        <Bus_Offering
        // openPopup={handleShow}
        />
        <SectionToggle />
        <section id="who-is-it-for">
          <WhoIsItFor />
        </section>
        <section id="features">
          <Features />
        </section>

        {/* <section id="benefits">
          <Benefits />
        </section> */}

        {/* <FeaturesUser /> */}
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

export default Personal;
