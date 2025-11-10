import React, { useEffect, useState } from "react";
import "./congratulations.scss";
import { congratCup } from "../../images";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import FooterV2 from "../../components/FooterV2/FooterV2";
import ReactConfetti from "react-confetti";
import {
  dashboardURL,
  proAccessURL,
} from "../../components/helpers/constant-words";
import BlinkingDots from "../../Animations/BlinkingDots/BlinkingDots";
import { useAuth } from "../../context/Auth/AuthState";

const Congratulations = () => {
  const { width, height } = useWindowSize();
  const [gravity, setGravity] = useState(1);
  const navigate = useNavigate();

  const auth = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth?.user?.user_type === "DE") {
        navigate(dashboardURL);
      } else {
        navigate(proAccessURL);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, auth]);

  useEffect(() => {
    const confettiGravity = setTimeout(() => {
      setGravity(0.05);
    }, 750);

    return () => clearTimeout(confettiGravity);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BlinkingDots />
      <main className="congrat_main">
        {/* <img
          src={width > 767 ? congraDesktopBanner : congraMobileBanner}
          alt="background"
          className="blogslisting_background"
        /> */}
        <div className="confetti_wrapper">
          <ReactConfetti
            width={width}
            height={height}
            colors={["#a67c00", "#bf9b30", "#ffbf00"]}
            gravity={gravity}
          />
        </div>

        <section className="congrat_sec1">
          <div className="my_container">
            <div className="content_wrapper">
              <img src={congratCup} alt="cup" className="cup" loading="lazy" />
              <h2 className="title">Congratulations!</h2>
              {(auth?.user?.user_type === "DE" ||
                auth?.user?.user_type === "ST") && (
                <p className="desc">
                  You have unlocked free access to <br />
                  the{" "}
                  <span className="orange_text">
                    Archinza{" "}
                    <span className="ai_span">
                      AI<sup className="sup">TM</sup>
                    </span>
                    &nbsp;&nbsp;Design Assistant.
                  </span>
                </p>
              )}
              {(auth?.user?.user_type === "TM" ||
                auth?.user?.user_type === "BO" ||
                auth?.user?.user_type === "FL") && (
                <p className="desc">
                  You’re now eligible to claim free access <br />
                  to the{" "}
                  <span className="orange_text">Archinza Pro Network!</span>
                </p>
              )}
              {/* <div className="cta_wrapper">
                <GlowCta
                  link={
                    auth?.user?.user_type == "DE" ? dashboardURL : proAccessURL
                  }
                  text={
                    auth?.user?.user_type == "DE"
                      ? `View your Archinza Dashboard`
                      : `Claim For Free Access Now`
                  }
                />
              </div> */}
              {/* <p className="text">
                <Link to={() => false} className="link">
                  Click here
                </Link>{" "}
                to Save & Exit
              </p> */}
            </div>
          </div>
        </section>

        <FooterV2 whatsappBotIcon={false} />
      </main>
    </>
  );
};

export default Congratulations;
