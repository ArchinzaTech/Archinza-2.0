import React from "react";
import "./footer.scss";
import { facebook, insta, linkedIn } from "../../images";
import {
  privacypolicyURL,
  termsandconditionURL,
} from "../helpers/constant-words";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="common_footer_sec1">
        <div className="my_container">
          <div className="footer_wrapper">
            <div className="row">
              <div className="col-md-4 order-md-1 footer_col">
                <p className="footer_copyright">
                  Copyright © 2023 Archinza Connect Pvt Ltd.
                </p>
              </div>
              <div className="col-md-4 order-md-3 footer_col">
                <p className="footer_terms">
                  <Link to={termsandconditionURL}> Terms & conditions</Link> |{" "}
                  <Link to={privacypolicyURL}>Privacy policy</Link>
                </p>
              </div>
              <div className="col-md-4 order-md-2 footer_col">
                <div className="footer_social_icon">
                  <a
                    href="https://www.facebook.com/profile.php?id=100091559990889&mibextid=LQQJ4d"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={facebook}
                      alt="facebook"
                      className="social_icon facebook_icon"
                    />
                  </a>
                  <a
                    href="https://instagram.com/archin.za?igshid=MzRlODBiNWFlZA"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={insta} alt="facebook" className="social_icon" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/92807055/admin/feed/posts/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={linkedIn}
                      alt="facebook"
                      className="social_icon"
                    />
                  </a>
                  {/* <a
                    href="https://www.linkedin.com/in/natasha-nk9999"
                    target="_blank"
                  >
                    <img
                      src={linkedIn}
                      alt="facebook"
                      className="social_icon"
                    />
                  </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
