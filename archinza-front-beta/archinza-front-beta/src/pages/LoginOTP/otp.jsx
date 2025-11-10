import React, { useEffect, useState } from "react";
import { checkiconWhite, otpicon, rightarrowwhite } from "../../images";
import "./otp.scss";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
import BlinkingDots from "../../Animations/BlinkingDots/BlinkingDots";
import FooterV2 from "../../components/FooterV2/FooterV2";
import { useLocation, useNavigate } from "react-router";
import config from "../../config/config";

import Joi from "joi";
import http from "../../helpers/http";
import helper from "../../helpers/helper";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

import {
  dashboardURL,
  proAccessURL,
} from "../../components/helpers/constant-words";
import { useAuth } from "../../context/Auth/AuthState";
import useTheme from "../../components/useTheme/useTheme";
const LoginOTP = () => {
  // const { theme } = useTheme();
  const theme = "dark"
  const { state: values } = useLocation();
  const [otpVal, setOtpVal] = useState("");
  const [resend, setResend] = useState(false);
  const [otploading, setotpLoading] = useState(false);
  const [otpresend, setotpresend] = useState(false);
  const [timer, setTimer] = useState(30);
  const [deviceId, setDeviceId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const auth = useAuth();
  const base_url = config.api_url; //without trailing slash

  const handleotpChange = (otp) => {
    setOtpVal(otp);
  };

  const handleotpverify = async (e) => {
    values["deviceId"] = deviceId;
    const data = await http.post(base_url + "/personal/login/otp-verify", {
      ...values,
      otp: otpVal,
      // status: "registered",
    });

    if (data) {
      const token = data.data.token;

      console.log(values._id);
      auth.login(token);

      // localStorage.setItem(config.jwt_auth_key, token);

      navigate(proAccessURL, { replace: true });
      window.scrollTo(0, 0);
    }
  };

  const handlresendotp = async (e) => {
    setotpLoading(true);

    const { data } = await http.post(base_url + "/personal/login", values);

    if (data) {
      setOtpVal("");
      toast(<Msg />, {
        className: "otp_toast",
        position: toast.POSITION.TOP_CENTER,
        hideProgressBar: true,
        closeButton: false,
        autoClose: 1500,
      });
    }
    setotpLoading(false);
  };

  const Msg = () => (
    <div className="otp_box">
      <img
        width={39}
        height={39}
        src={checkiconWhite}
        className="otp_resend_icon"
        loading="lazy"
        alt="icon"
      />
      <p className="title">OTP reshared</p>
    </div>
  );
  const resendHandler = () => {
    if (resend === false) {
      setResend(true);
      toast(<Msg />, {
        className: "otp_toast",
        position: toast.POSITION.TOP_CENTER,
        hideProgressBar: true,
        closeButton: false,
      });
    } else {
      setResend(false);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // useEffect(() => {
  //   const resetButton = setTimeout(() => {
  //     setResend(false);
  //   }, 1000);
  //   return () => clearTimeout(resetButton);
  // }, [resend]);

  useEffect(() => {
    const canAccessOtp = sessionStorage.getItem("canAccessOtp");
    if (!canAccessOtp || !state || !state.phone || !state.country_code) {
      navigate("/login", { replace: true });
    }

    sessionStorage.removeItem("canAccessOtp");
  }, [state, navigate]);

  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId); // unique device/browser ID
    };

    getFingerprint();
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <BlinkingDots />
      <section className="otp_sec1">
        <div className="my_container">
          <div className="otp_main_box">
            <div className="text_container">
              <p className="head_text">OTP Verification</p>
              <h1
                className="title"
                style={{
                  color: theme === "light" ? "#000" : "#fff",
                }}
              >
                Verify your OTP sent via SMS
              </h1>
              <div className="icon_notice_wrapper">
                <div className="icon_wrapper">
                  <img
                    width={81}
                    height={81}
                    src={otpicon}
                    alt="icon"
                    className="icon"
                    loading="lazy"
                  />
                </div>
                <p
                  className="description mb-0"
                  style={{
                    color: theme === "light" ? "#000" : "inherit",
                  }}
                >
                  Enter OTP
                </p>
              </div>
            </div>

            <div className="otp_box_wrapper">
              <OtpInput
                value={otpVal}
                onChange={handleotpChange}
                numInputs={6}
                containerStyle="otp_input_wrapper"
                inputStyle={
                  theme === "dark" ? "otp_input" : "otp_input text-black"
                }
                isInputNum={true}
                focusStyle={
                  theme === "dark" ? "otp_focused" : "otp_focused_light_mode"
                }
                shouldAutoFocus
              />
            </div>
            <div className="next_logout">
              <div className="cta_wrapper">
                <button
                  className="next_button"
                  style={{
                    opacity: otpVal.length < 6 ? 0.5 : 1,
                    cursor: otpVal.length < 6 ? "no-drop" : "pointer",
                  }}
                  disabled={otpVal.length >= 6 ? false : true}
                  onClick={handleotpverify}
                >
                  <div className="text">Verify</div>
                  <img
                    src={rightarrowwhite}
                    alt="icon"
                    className="icon"
                    loading="lazy"
                  />
                </button>
                <button
                  className="back_button"
                  onClick={handlresendotp}
                  disabled={timer > 0 || otploading}
                  style={{
                    opacity: timer > 0 || otploading ? 0.75 : 1,
                    cursor: timer > 0 || otploading ? "not-allowed" : "pointer",
                    color: theme === "light" ? "#000" : "#fff",
                  }}
                >
                  {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
        <FooterV2 whatsappBotIcon={false} />
      </section>
    </>
  );
};

export default LoginOTP;
