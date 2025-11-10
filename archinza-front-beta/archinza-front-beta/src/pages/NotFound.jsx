import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { homepageURL } from "../components/helpers/constant-words";

const NotFound = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <h1
        style={{
          height: "100%",
          minHeight: "85vh",
          color: "#fff",
          fontSize: "7.5em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        404
        <br />
        <Link
          to={homepageURL}
          style={{
            display: "block",
            fontSize: ".5em",
            textDecoration: "underline",
          }}
        >
          Home
        </Link>
      </h1>
    </>
  );
};

export default NotFound;
