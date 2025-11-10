import React, { useEffect } from "react";
import "./contactus.scss";
import BreadCrumb from "../../components/Breadcrumb/Breadcrumb";
import {
  contactBanner,
  contactBannerWhite,
  rightarrowwhite,
} from "../../images";
import FooterV2 from "../../components/FooterV2/FooterV2";
import { Link } from "react-router-dom";
import useTheme from "../../components/useTheme/useTheme";

const ContactUs = () => {
  const { theme } = useTheme();
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <main className="contact_main">
        <img
          src={theme === "light" ? contactBannerWhite : contactBanner}
          alt="background"
          className="contact_background"
        />
        <section className="contact_sec1">
          <div className="my_container">
            <div
              className={`Breadcrumb_container ${
                theme === "light"
                  ? "breadcrumb_conatiner_contact_light_mode"
                  : ""
              }`}
            >
              <BreadCrumb
                link="/contact-us"
                text="Contact Us"
                title="Contact us"
                linkDisabled
                // socialIcon
                // facebookLink="https://www.facebook.com/people/Archinza/100091559990889/?mibextid=LQQJ4d"
                // instaLink="https://www.instagram.com/accounts/suspended/?next=https%3A%2F%2Finstagram.com%2Farchin.za%3Figshid%3DMzRlODBiNWFlZA%26__coig_ufac%3D1"
                // linkedInLink="https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2F92807055%2Fadmin%2Ffeed%2Fposts%2F"
              />
            </div>
            {/* <div className="cta_wrapper">
              <Link className="common_cta">
                <div className="text">Get Early Access</div>
                <img
                  src={rightarrowwhite}
                  alt="icon"
                  className="icon"
                  loading="lazy"
                />
              </Link>
            </div> */}
          </div>
        </section>

        <section className="contact_sec2">
          <div className="my_container">
            <div className="contact_row">
              <a href="mailto:hello@archinza.com" className="contact_col">
                <div className="contact_details_wrapper">
                  <h3 className="heading">Have a question?</h3>
                  <div
                    className="desc"
                    style={{
                      color: theme === "light" ? "#000" : "",
                    }}
                  >
                    hello@archinza.com
                  </div>
                </div>
              </a>
              <a href="mailto:reach@archinza.com" className="contact_col">
                <div className="contact_details_wrapper">
                  <h3 className="heading">Want to market?</h3>
                  <div
                    className="desc"
                    style={{
                      color: theme === "light" ? "#000" : "",
                    }}
                  >
                    reach@archinza.com
                  </div>
                </div>
              </a>
              <a href="mailto:careers@archinza.com" className="contact_col">
                <div className="contact_details_wrapper">
                  <h3 className="heading">For careers</h3>
                  <div
                    className="desc"
                    style={{
                      color: theme === "light" ? "#000" : "",
                    }}
                  >
                    careers@archinza.com
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="cta_wrapper justify-content-center mt-4 d-none">
            <Link className="common_cta">
              <div className="text">Get Early Access</div>
              <img
                src={rightarrowwhite}
                alt="icon"
                className="icon"
                loading="lazy"
              />
            </Link>
          </div>
        </section>
      </main>
      {/* <div
        style={{
          zIndex: "999",
        }}
      >
        {theme === "dark" ? <FooterV2 /> : <FooterV2 lightTheme />}
      </div> */}
       {theme === "dark" ? <FooterV2 bgColor="#000000"/> : <FooterV2 lightTheme bgColor="#ffffff"/>}
      {/* <FooterV2 bgColor="#000000" /> */}
    </>
  );
};

export default ContactUs;
