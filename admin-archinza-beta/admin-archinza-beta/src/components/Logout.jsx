import config from "../config/config";

const Logout = (props) => {
  localStorage.removeItem(config.jwt_store_key);
  window.location = "/login";
};

export default Logout;
