import { Link } from "react-router-dom";
import style from "./storesettings.module.scss";
import { useState, useEffect } from "react";
import { businessFormFiveLTURL } from "../helpers/constant-words";

const StoreSettings = ({ color }) => {
  const [isBlack, setIsBlack] = useState(false);

  useEffect(() => {
    if (window.location.pathname === businessFormFiveLTURL) {
      setIsBlack(true);
    } else {
      setIsBlack(false);
    }
  }, []);

  return (
    <div className={`${style.notice} ${isBlack && style.black}`}>
      Need help setting up your store?{" "}
      <Link className={style.anchor}>Get help!</Link>
    </div>
  );
};

export default StoreSettings;
