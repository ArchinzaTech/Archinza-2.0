import { Link, useNavigate } from "react-router-dom";
import style from "./logout.module.scss";
import { loginURL } from "../helpers/constant-words";
import { useAuth } from "../../context/Auth/AuthState";

const LogoutText = () => {

  const auth = useAuth();
  const navigate = useNavigate();

  const handlelogout = () => {
    auth.logout();

    navigate(loginURL, { replace: true });
  };




  return (
    <div className={style.notice}>
      <div className={style.anchor} onClick={handlelogout}>Click here</div> to save & exit
    </div>
  );
};

export default LogoutText;
