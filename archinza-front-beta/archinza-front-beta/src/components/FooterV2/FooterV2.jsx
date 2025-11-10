import React, { useEffect, useState } from "react";
import "./footerv2.scss";
import "./footerv3.scss";
import {
  blacklogo,
  facebook,
  fbHeaderB,
  insta,
  instaHeaderB,
  linkedIn,
  linkedinHeaderB,
  orangeRightArrow,
  prologo,
  prologoblack,
  shareIcon,
  shareIconWhite,
  whitelogo,
} from "../../images";
import {
  BlogsListingURL,
  businessFormFiveLTURL,
  businessProfileURL,
  facebookURL,
  faqsURL,
  instagramURL,
  linkedinURL,
  privacypolicyURL,
  termsandconditionURL,
} from "../helpers/constant-words";
import { Link } from "react-router-dom";
import { useWindowSize } from "react-use";
import FloatingIcon from "../FloatingIcon/FloatingIcon";
import Joi from "joi";
import http from "../../helpers/http";
import config from "../../config/config";
import { useAuth } from "../../context/Auth/AuthState";

const FooterV2 = ({
  bgColor = "transparent",
  lightTheme = false,
  whatsappBotIcon = true,
}) => {
  // const [lightTheme] = useState(lightTheme);
  const { width } = useWindowSize();
  const current_year = new Date();
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [proState, setProState] = useState(false);
  const auth = useAuth();
  const personalUserTypes = ["BO", "ST", "TM", "WP"];
  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = schema.validate({ email });
    if (error) {
      setErrorMessage("Please enter a valid email address.");
      setSuccessMessage("");
    } else {
      const { data } = await http.post(`${config.api_url}/forms/newsletter`, {
        email: email,
      });
      if (data) {
        setSuccessMessage(
          "Thank you for subscribing! You’ll start receiving updates soon."
        );
        setErrorMessage("");
        setEmail("");
      }
    }
  };

  useEffect(() => {
    if (auth?.user) {
      // console.log(auth?.user);
      if (auth?.user?.auth_type === "personal") {
        if (personalUserTypes.includes(auth?.user?.user_type)) {
          console.log("Pro State12");
          setProState(true);
          return;
        } else {
          setProState(false);
        }
      }
    }
    setProState(false);
  }, [auth]);

  return (
    <>
      <div className="horizontal_line" />
      <footer
        className={lightTheme ? "footerv3_sec1" : "footerv2_sec1"}
        style={{ background: bgColor }}
      >
        <div className="my_container">
          <div className="footer_wrapper">
            <div className="row footer_row">
              <div className="col-md-4 footer_col">
                <div className="logo_wrapper">
                  {lightTheme && (
                    <img
                      src={proState ? prologoblack : blacklogo}
                      alt="logo"
                      className="footer_logo"
                    />
                  )}
                  {!lightTheme && (
                    <img
                      src={proState ? prologo : whitelogo}
                      alt="logo"
                      className="footer_logo"
                    />
                  )}
                  {/* <p className="logo_desc">Empowering the design ecosystem.</p> */}
                  <div className="social_wrapper">
                    <img
                      src={lightTheme ? shareIconWhite : shareIcon}
                      alt="facebook"
                      className="social_icon"
                    />
                    <a href={facebookURL} target="_blank" rel="noreferrer">
                      <img
                        src={lightTheme ? fbHeaderB : facebook}
                        alt="facebook"
                        className="social_icon"
                      />
                    </a>
                    <a href={instagramURL} target="_blank" rel="noreferrer">
                      <img
                        src={lightTheme ? instaHeaderB : insta}
                        alt="instagram"
                        className="social_icon"
                      />
                    </a>
                    <a href={linkedinURL} target="_blank" rel="noreferrer">
                      <img
                        src={lightTheme ? linkedinHeaderB : linkedIn}
                        alt="linkedIn"
                        className="social_icon"
                      />
                    </a>
                  </div>
                </div>
              </div>
              {/* {width > 767 ? (
                <div className="col-md-5 footer_col">
                  <form className="input_wrapper" onSubmit={handleSubmit}>
                    <p className="input_desc">
                      To get regular updates, subscribe to our newsletter!
                    </p>
                    <div className="input_field_wrapper">
                      <input
                        type="text"
                        placeholder="Enter your email"
                        className="input_details"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <p className="error"></p>
                      <button className="submit_btn">
                        <img
                          src={orangeRightArrow}
                          alt="right arrow"
                          className="arrow_img"
                        />
                      </button>
                    </div>
                    {successMessage && (
                      <p
                        className="success_message"
                        style={{
                          color: "green",
                          textAlign: "center",
                          marginTop: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {successMessage}
                      </p>
                    )}
                    {errorMessage && (
                      <p
                        className="error_message"
                        style={{
                          color: "red",
                          textAlign: "center",
                          marginTop: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {errorMessage}
                      </p>
                    )}
                  </form>
                </div>
              ) : null} */}
              <div className="col-md-4 footer_col middle_links_wrapper">
                <p className="middle_links">
                  <Link to={termsandconditionURL}>Terms & Conditions</Link>
                  <Link to={privacypolicyURL}>Privacy Policy</Link>
                  <Link to={faqsURL}>FAQs</Link>
                </p>
              </div>
              <div className="col-md-4 footer_col">
                <div className="contact_wrapper">
                  {/* <div className="details_wrapper">
                    <h4 className="detail_title">FOR MARKETING QUERIES:</h4>
                    <a href="mailto:reach@archinza.com" className="detail_desc">
                      reach@archinza.com
                    </a>
                  </div> */}
                  <div className="details_wrapper">
                    <h4 className="detail_title">FOR ONBOARDING SUPPORT:</h4>
                    <a href="mailto:help@archinza.com" className="detail_desc">
                      help@archinza.com
                    </a>
                  </div>
                  <div className="details_wrapper">
                    <h4 className="detail_title">FOR GENERAL QUERIES:</h4>
                    <a href="mailto:hello@archinza.com" className="detail_desc">
                      hello@archinza.com
                    </a>
                  </div>
                  {/* <div className="details_wrapper">
                    <Link to={BlogsListingURL} className="detail_title">
                      BLOGS
                    </Link>
                  </div> */}
                </div>
              </div>
              {/* {width <= 767 ? (
                <div className="col-md-5 footer_col">
                  <form className="input_wrapper">
                    <p className="input_desc">
                      To get regular updates, subscribe to our newsletter!
                    </p>
                    <div className="input_field_wrapper">
                      <input
                        type="text"
                        placeholder="Enter your email"
                        className="input_details"
                      />
                      <button className="submit_btn">
                        <img
                          src={orangeRightArrow}
                          alt="right arrow"
                          className="arrow_img"
                        />
                      </button>
                    </div>
                  </form>
                </div>
              ) : null} */}
            </div>
            <div className="copy_right_wrapper">
              <p className="copy_right">
                Copyright © {current_year.getFullYear()} Archinza Connect Pvt
                Ltd.
                {/* | <Link to={termsandconditionURL}>Terms & Conditions</Link>
                | <Link to={privacypolicyURL}>Privacy Policy</Link> |{" "}
                <Link to={faqsURL}>FAQs</Link> */}
              </p>
            </div>
          </div>
        </div>
      </footer>
      <FloatingIcon isEnabled={whatsappBotIcon} lightTheme={lightTheme} />
    </>
  );
};

export default FooterV2;
