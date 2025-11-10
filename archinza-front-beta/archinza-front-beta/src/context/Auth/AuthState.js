import React, { useState, useContext, useEffect } from "react";

import AuthContext from "./AuthContext";
import config from "../../config/config";

import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// import { isExpired, decodeToken } from "react-jwt";
import helper from "../../helpers/helper";
import http from "../../helpers/http";
import {
  businessFormFiveLTURL,
  loginURL,
} from "../../components/helpers/constant-words";
import { toast } from "react-toastify";
import ToastMsg from "../../components/ToastMsg/ToastMsg";

const UserState = ({ children, skipInitialGetUser }) => {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  const base_url = config.api_url; //without trailing slash

  const update = (data) => {
    setUser(data);
  };

  const updateUser = (newUserData) => {
    const processedUserData = {
      ...newUserData,
      userType:
        newUserData.auth_type === "personal"
          ? helper.getUserType(newUserData.user_type)
          : null,
    };

    setUser(processedUserData);

    if (newUserData.token) {
      localStorage.setItem(config.jwt_auth_key, newUserData.token);
    }
  };

  const refresh = (updatedValues = null) => {
    if (updatedValues) {
      setUser((prevUser) => {
        return {
          ...prevUser,
          ...updatedValues,
        };
      });
      return;
    }
    getUser();
  };

  const logout = () => {
    localStorage.removeItem(config.jwt_auth_key);
    setUser(null);
  };

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem(config.jwt_auth_key);
    if (!token) return false;
    // Check if token is expired
    if (isTokenExpired(token)) {
      logout(); // Clear the expired token
      // toast(
      //   <ToastMsg
      //     message={`Session Expired. Please login to continue`}
      //     danger={true}
      //   />,
      //   config.error_toast_config
      // );
      navigate(loginURL); // Redirect to login
      return false;
    }

    return true;
  };

  const login = async (token) => {
    const userData = jwtDecode(token);
    const userId = userData._id;
    const userProfiles = JSON.parse(localStorage.getItem("userProfiles")) || {};

    // Save or update token for this user
    userProfiles[userId] = { name: userData.name, token };
    localStorage.setItem("userProfiles", JSON.stringify(userProfiles));
    localStorage.setItem(config.jwt_auth_key, token);

    if (token) {
      const userType = helper.getUserType(userData?.user_type);
      userData.userType = userType;
      setUser(userData);
    }
    return userData;
  };

  const businessLogin = async (token, redirect = true, source) => {
    // const token = localStorage.getItem(config.jwt_auth_key);
    if (!token) {
      throw new Error("Token not found");
    }

    const userData = jwtDecode(token);

    const response = await http.get(
      `${base_url}/business/business-details/${userData._id}`
    );
    console.log({fetchedUser : response?.data});
    if (response?.data) {
      setUser({...response?.data,auth_type:userData.auth_type});
      const userId = userData._id;
      const userProfiles =
        JSON.parse(localStorage.getItem("userProfiles")) || {};
      userProfiles[userId] = {
        name: response.data.business_name,
        token,
        isVerified: response.data.isVerified,
      };
      localStorage.setItem("userProfiles", JSON.stringify(userProfiles));
      localStorage.setItem(config.jwt_auth_key, token);
      if (source === "logout") {
        toast(
          <ToastMsg message={`Switched to ${response?.data?.business_name}`} />,
          config.success_toast_config
        );
      }
      if (redirect) {
        navigate(businessFormFiveLTURL, { replace: true });
      }
      return;
    } else {
      // toast(
      //   <ToastMsg message={`Invalid token passed`} danger={true} />,
      //   config.error_toast_config
      // );
      // localStorage.removeItem(config.jwt_auth_key);
      navigate(loginURL);
      // return null;
    }
  };

  const getUser = async () => {
    const token = localStorage.getItem(config.jwt_auth_key);
    let userData;
    if (token) {
      // Check if token is expired before decoding
      if (isTokenExpired(token)) {
        logout();
        // toast(
        //   <ToastMsg
        //     message={`Session Expired. Please login to continue`}
        //     danger={true}
        //   />,
        //   config.error_toast_config
        // );
        navigate(loginURL);
        return;
      }
      userData = jwtDecode(token);
      console.log({userData});
      if (userData.auth_type == "personal") {
        const userType = helper.getUserType(userData?.user_type);
        userData.userType = userType;
        setUser(userData);
      } else {
        await businessLogin(token, false);
        // setUser(userData);
      }
    }
  };

  useEffect(() => {
    if (!skipInitialGetUser) {
      getUser();
    }
  }, [skipInitialGetUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        update,
        refresh,
        login,
        logout,
        isLoggedIn,
        businessLogin,
        account,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default UserState;
