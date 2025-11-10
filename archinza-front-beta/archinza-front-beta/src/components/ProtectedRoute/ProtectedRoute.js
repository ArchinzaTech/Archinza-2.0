import { Navigate, useLocation } from "react-router-dom";
import {
  businessFormFiveLTURL,
  businessProfileURL,
  dashboardURL,
  homepageURL,
  loginURL,
  registrationBusinessOTPURL,
  registrationBusinessURL,
} from "../helpers/constant-words";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "../../context/Auth/AuthState";
import { useEffect, useState } from "react";
import http from "../../helpers/http";
import config from "../../config/config";

export const ProtectedRoute = ({
  children,
  guard = null,
  requireState = null,
}) => {
  const auth = useAuth();

  console.log({auth})
  const location = useLocation();
  const [isProfileValid, setIsProfileValid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const isPublicProfileRoute =
    location.pathname.startsWith("/business/profile/");

  useEffect(() => {
    if (isPublicProfileRoute) {
      setIsLoading(true);
      const username = location.pathname.split("/")[3];
      http
        .get(`${config.api_url}/business/profile/${username}`)
        .then((response) => {
          console.log(response?.data);
          setIsProfileValid(!!response.data);
        })
        .catch(() => {
          setIsProfileValid(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [location.pathname]);


  if (!auth || auth.user === undefined) {
    return <h1>Loading...</h1>;
  }






  if (isPublicProfileRoute) {
    if (isLoading) return <div>Loading...</div>;
    if (isProfileValid === false) return <Navigate to="/404" replace />;
  }

  if (
    requireState == "fromRegister" &&
    (!location.state || !location.state[requireState])
  ) {
    return <Navigate to={registrationBusinessURL} />;
  }

  if (
    !auth.isLoggedIn() &&
    !token &&
    location.pathname !== registrationBusinessOTPURL
  ) {
    // user is not authenticated
    return <Navigate to={loginURL} />;
  }

  if (!auth.isLoggedIn() && location.pathname === loginURL) {
    // user is not authenticated
    return <Navigate to={homepageURL} />;
  }

  // if (auth.isLoggedIn() && auth.user) {
  //   // If personal user tries to access business-only route
  //   if (
  //     auth.user.auth_type === "personal" &&
  //     location.pathname.startsWith("/business")
  //   ) {
  //     return <Navigate to={dashboardURL} replace />;
  //   }
  //   // If business user tries to access personal-only route
  //   if (
  //     auth.user.auth_type === "business" &&
  //     (location.pathname === dashboardURL || location.pathname === "/dashboard")
  //   ) {
  //     return <Navigate to={businessFormFiveLTURL} replace />;
  //   }
  // }
  if (auth.isLoggedIn() && auth.user) {
    console.log("Auth Checked");
    console.log({ authType: auth.user.auth_type, guard });
    // If personal user tries to access business-only route
    if (auth.user.auth_type === "personal" && guard != "personal") {
      return <Navigate to={dashboardURL} replace />;
    }
    // If business user tries to access personal-only route
    if (auth.user.auth_type === "business" && guard != "business") {
      return <Navigate to={businessFormFiveLTURL} replace />;
    }
  }
  if(auth.user){
    return children;

  }
  
};

export const PublicRoute = ({ children }) => {
  const auth = useAuth();
  if (auth.isLoggedIn()) {
    //check if user is from business or personal
    if (auth?.user) {
      if (auth?.user?.auth_type === "business") {
        return <Navigate to={businessProfileURL} />;
      } else {
        return <Navigate to={dashboardURL} />;
      }
    }
  }

  return children;
};
