import React, { useEffect, useState } from "react";
import { checkiconWhite, otpicon, rightarrowwhite } from "../../../images";
import "./businessregisterotp.scss";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
import FooterV2 from "../../../components/FooterV2/FooterV2";
import BlinkingDots from "../../../Animations/BlinkingDots/BlinkingDots";

import { useLocation, useNavigate } from "react-router";

import config from "../../../config/config";

import Joi from "joi";
import http from "../../../helpers/http";
import helper from "../../../helpers/helper";

import { businessFormFiveLTURL } from "../../../components/helpers/constant-words";
import { useAuth } from "../../../context/Auth/AuthState";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";
const BusinessRegisterOTP = () => {
  const { state: values } = useLocation();
  const [otpVal, setOtpVal] = useState("");
  const [resend, setResend] = useState(false);
  const [otploading, setotpLoading] = useState(false);
  const [otpresend, setotpresend] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const base_url = config.api_url; //without trailing slash

  const handleotpChange = (otp) => {
    setOtpVal(otp);
  };

  const handleotpverify = async (e) => {
    const data = await http.post(base_url + "/business/signup/otp-verify", {
      ...values,
      otp: otpVal,
      status: "registered",
    });

    if (!data) {
      setOtpVal("");
    }

    if (data) {
      const token = data.data.token;
      // localStorage.setItem(config.jwt_auth_key, token);
      // setvisibility({
      //   form: false,
      //   otp: false,
      //   thank_you: true,
      // });
      // navigate("/design-enthusiast");

      auth.login(token);
      navigate(businessFormFiveLTURL, { replace: true });
      window.scrollTo(0, 0);
    }
  };

  const handlresendotp = async (e) => {
    setotpLoading(true);
    const { data } = await http.post(base_url + "/business/signup", values);

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
        autoClose: 1500,
      });
    } else {
      setResend(false);
    }
  };

  useEffect(() => {
    const resetButton = setTimeout(() => {
      setResend(false);
    }, 1000);
    return () => clearTimeout(resetButton);
  }, [resend]);

  useEffect(() => {
    if (!values) {
      navigate("/register");
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <LightThemeBackground />

      {/* <BlinkingDots /> */}
      <section className="otp_sec1">
        <div className="my_container">
          <div className="text_container">
            <p className="head_text">OTP Verification</p>
            <h1 className="title">Verify OTP on SMS/Email ID</h1>
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
              <p className="description">Enter OTP</p>
            </div>
          </div>

          <div className="otp_box_wrapper">
            <OtpInput
              value={otpVal}
              onChange={handleotpChange}
              numInputs={6}
              containerStyle="otp_input_wrapper"
              inputStyle="otp_input"
              isInputNum={true}
              focusStyle="otp_focused"
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
              <div className="back_button" onClick={handlresendotp}>
                {"Resend OTP"}
              </div>
            </div>
          </div>
        </div>
        <FooterV2 />
      </section>
    </>
  );
};

export default BusinessRegisterOTP;
