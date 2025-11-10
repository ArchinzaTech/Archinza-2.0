import React from "react";
import "./loadingStateComp.scss";
import { loadingState } from "../../../../images";
import { useWindowSize } from "react-use";

const LoadingStateComp = ({ message, isError = false }) => {
  const { width } = useWindowSize();
  return (
    <div className="loading_state_container">
      <div className="img_loading_state_wrapper">
        <img src={loadingState} alt="loading" className="img_loading_state" />
      </div>
      <h3 className="heading_main_loading_state">
        {isError ? "Oops! Something went wrong" : "Please Wait..."}
      </h3>
      <h5 className="title_main_loading_state">{message}</h5>
    </div>
  );
};

export default LoadingStateComp;
