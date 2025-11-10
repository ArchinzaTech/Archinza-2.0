import React from "react";
import "./breadcrumb.scss";
import { Link } from "react-router-dom";
import { facebook, insta, linkedIn } from "../../images";

const BreadCrumb = ({
  link,
  link1,
  text,
  text1,
  linkDisabled,
  linkDisabled1,
  title,
  socialIcon,
  facebookLink,
  instaLink,
  linkedInLink,
}) => {
  return (
    <>
      <div className="breadcrumb_wrapper">
        <div>
          <Link to="/" className="breadcrumb_link">
            Home
          </Link>{" "}
          <Link
            to={link}
            className={`breadcrumb_link ${linkDisabled ? "disabled" : ""}`}
          >
            {text ? "| " + text : ""}
          </Link>
          {text1 ? (
            <Link
              to={link1}
              className={`breadcrumb_link ${linkDisabled1 ? "disabled" : ""}`}
            >
              {text1 ? " | " + text1 : ""}
            </Link>
          ) : null}
        </div>
        <h1 className="title" dangerouslySetInnerHTML={{ __html: title }}></h1>
        {socialIcon ? (
          <div className="social_media_wrapper">
            <a href={facebookLink} target="_blank" rel="noreferrer">
              <img
                src={facebook}
                alt="facebook"
                className="socila_media_icon"
              />
            </a>
            <a href={instaLink} target="_blank" rel="noreferrer">
              <img src={insta} alt="instagram" className="socila_media_icon" />
            </a>
            <a href={linkedInLink} target="_blank" rel="noreferrer">
              <img
                src={linkedIn}
                alt="linkedIn"
                className="socila_media_icon"
              />
            </a>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default BreadCrumb;
