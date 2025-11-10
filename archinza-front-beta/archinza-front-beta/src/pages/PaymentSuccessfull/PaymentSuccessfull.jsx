import React, { useEffect, useState } from "react";
import "./paymentSuccessfull.scss";
import { congratCupWhite, instaIcon, shareIcon } from "../../images";
import { useWindowSize } from "react-use";
import FooterV2 from "../../components/FooterV2/FooterV2";
import ReactConfetti from "react-confetti";
import { Link, useNavigate } from "react-router-dom";
import {
  businessProfileEditURL,
  businessProfileEditURL2,
  businessProfileURL,
} from "../../components/helpers/constant-words";
import { toast } from "react-toastify";
import ToastMsg from "../../components/ToastMsg/ToastMsg";
import config from "../../config/config";
import { jwtDecode } from "jwt-decode";

const PaymentSuccessfull = () => {
  const { width, height } = useWindowSize();
  const [gravity, setGravity] = useState(1);
  const navigate = useNavigate();
  const decodedData = jwtDecode(localStorage.getItem(config.jwt_auth_key));

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

  const handleCopyUrl = async (e) => {
    e.preventDefault();
    try {
      const currentUrl = `http://174.138.123.146:9028/business/profile/${decodedData?.username}`;

      // Fallback method for older browsers
      if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();

        try {
          document.execCommand("copy");
          toast(
            <ToastMsg message={`URL copied to clipboard`} />,
            config.success_toast_config
          );
        } catch (err) {
          console.error("Unable to copy", err);
          toast(
            <ToastMsg message={`Failed to copy URL`} />,
            config.error_toast_config
          );
        }

        document.body.removeChild(textArea);
        return;
      }

      // Modern Clipboard API method
      await navigator.clipboard.writeText(currentUrl);
      toast(
        <ToastMsg message={`URL copied to clipboard`} />,
        config.success_toast_config
      );
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast(
        <ToastMsg message={`Failed to copy URL`} />,
        config.error_toast_config
      );
    }
  };

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
              {/* <p className="sub_title">on completing your registration.</p> */}
              <p className="desc">
                {decodedData?.business_name || "Your Business"}
                {width > 992 && <br />}{" "}
                <span className="col_black">
                  is now on the Archinza Network!
                </span>
              </p>
              <div className="cta_wrapper cta_wrapper--Payment-Success">
                <div className="next_button">
                  <Link to={businessProfileEditURL2} className="text">
                    View Dashboard
                  </Link>
                </div>
              </div>

              <p className="share--payment-success sub_title">
                <span
                  className="copy_link--payment-success"
                  onClick={handleCopyUrl}
                >
                  <img src={shareIcon} alt="" />
                  <span
                    style={{
                      color: "#014fe0",
                    }}
                  >
                    Copy Profile Link
                  </span>{" "}
                  to share on{" "}
                </span>
                <div>
                  <img src={instaIcon} alt="" /> Instagram & don't forget to tag
                  @archin.za when you share!
                </div>
              </p>
            </div>
          </div>
        </section>

        <FooterV2 whatsappBotIcon={false} lightTheme />
      </main>
    </>
  );
};

export default PaymentSuccessfull;
