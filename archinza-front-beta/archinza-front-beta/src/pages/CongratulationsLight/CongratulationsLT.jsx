import React, { useEffect, useState } from "react";
import "./congratulationsLT.scss";
import { congratCupWhite } from "../../images";
import { useWindowSize } from "react-use";
import FooterV2 from "../../components/FooterV2/FooterV2";
import ReactConfetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import {
  businessProfileEditURL2,
  businessProfileURL,
} from "../../components/helpers/constant-words";

const CongratulationsLT = () => {
  const { width, height } = useWindowSize();
  const [gravity, setGravity] = useState(1);
  const navigate = useNavigate();

  // const handleSubmit = () => {
  //   navigate(businessProfileURL);
  // };

  useEffect(() => {
    navigate(window.location.pathname, { replace: true });
  }, [navigate]);
  useEffect(() => {
    const timer = setTimeout(() => {
      // navigate(businessProfileURL);
      navigate(businessProfileEditURL2);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    const confettiGravity = setTimeout(() => {
      setGravity(0.1);
    }, 1000);

    return () => clearTimeout(confettiGravity);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="congrat_lt__main">
        <div className="confetti_wrapper">
          <ReactConfetti
            width={width}
            height={height}
            colors={["#a67c00", "#bf9b30", "#ffbf00"]}
            gravity={gravity}
          />
        </div>

        <section className="congrat_lt_sec1">
          <div className="my_container">
            <div className="content_wrapper">
              <img
                src={congratCupWhite}
                alt="cup"
                className="cup"
                loading="lazy"
              />
              <h2 className="title">Congratulations!</h2>
              <p className="sub_title">on completing your registration.</p>
              <p className="desc">
                Get Ready To Unlock A World Of Opportunities For Your Business
                With {""}
                <span className="col_black">Archinza</span>!
              </p>
              {/* <div className="cta_wrapper" onClick={handleSubmit}>
                <div className="next_button">
                  <div className="text">Edit Your Business Page</div>
                  <img
                    src={rightarrowwhite}
                    alt="icon"
                    className="icon"
                    loading="lazy"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </section>

        <FooterV2 whatsappBotIcon={false} lightTheme />
      </main>
    </>
  );
};

export default CongratulationsLT;
