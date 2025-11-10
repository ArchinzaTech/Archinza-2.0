import React, { useEffect, useState } from "react";
import "./resetpassword.scss";
import { checkiconWhite, otpicon, rightarrowwhite } from "../../images";
import FullWidthTextField from "../../components/TextField/FullWidthTextField";
import FooterV2 from "../../components/FooterV2/FooterV2";
import BlinkingDots from "../../Animations/BlinkingDots/BlinkingDots";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import {
  loginURL,
  privacypolicyURL,
} from "../../components/helpers/constant-words";
import Joi from "joi";
import config from "../../config/config";
import http from "../../helpers/http";
import helper from "../../helpers/helper";
import ToastMsg from "../../components/ToastMsg/ToastMsg";
import useTheme from "../../components/useTheme/useTheme";

const ResetPassword = () => {
  // const { theme } = useTheme();
  const theme = "dark"
  const [userState, setUserState] = useState("email");
  const [otpVal, setOtpVal] = useState("");
  const [resend, setResend] = useState(false);
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const joiOptions = config.joiOptions;
  const navigate = useNavigate();

  const handleotpChange = async (otp) => {
    setOtpVal(otp);
  };

  const validate = async (data) => {
    const schemaObj = {
      email: Joi.string()
        .trim()
        .email({ tlds: { allow: false } })
        .label("Email ID"),
      password: Joi.string().min(8).label("Password"),
    };
    const schema = Joi.object(schemaObj).options({ allowUnknown: true });

    const { error } = schema.validate(data, joiOptions);

    const errors = {};

    if (error) {
      error.details.map((field) => {
        errors[field.path[0]] = field.message;
        return true;
      });
    }

    return errors ? errors : null;
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

  const resendHandler = async () => {
    if (resend === false) {
      await http.post(`${config.api_url}/business/forgot-password/resend`, {
        email,
      });
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

  const handlePasswordChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = await validate({
      email: email,
    });
    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }

    const data = await http.post(config.api_url + "/business/forgot-password", {
      email,
    });
    if (data) {
      setUserState("otp");
    }
  };

  const handleOtpVerify = async (e) => {
    const data = await http.post(
      config.api_url + "/business/forgot-password/otp-verify",
      { otp: otpVal }
    );

    if (data) {
      setUserState("reset");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    let errors = await validate({
      password: formData.newPassword,
    });
    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setFormError({ confirm_password: "Password Not Matched" });
      helper.scroll(
        helper.getFirstError({ confirm_password: "Password Not Matched" })
      );
      return;
    }

    const data = await http.post(config.api_url + "/business/reset-password", {
      email: email,
      password: formData.newPassword,
    });

    if (data) {
      navigate(loginURL, {
        replace: true,
        state: { loginStep: "BusinessAccount" },
      });
      toast(
        <ToastMsg message="Password updated successfully" />,
        config.success_toast_config
      );
    }
  };

  useEffect(() => {
    const resetButton = setTimeout(() => {
      setResend(false);
    }, 1000);
    return () => clearTimeout(resetButton);
  }, [resend]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BlinkingDots />
      <main className="rpass_container">
        <section className="rpass_sec1">
          <div className="my_container">
            {userState === "email" && (
              <>
                <div className="text_container">
                  <h2 className="sub_title">Get Early Access</h2>
                  <h1 className={`title ${theme === "light" && "text-black"}`}>
                    Reset Your Password
                  </h1>
                  <p
                    className={`notice mail_notice ${
                      theme === "light" && "text-black"
                    }`}
                  >
                    Applicants should be founders, CEOs or President of their
                    respective companies.
                  </p>
                </div>
                <div className="login_field_wrapper">
                  <div className={`field_wrapper ${theme === "light" && "field_wrapper_light--mode"}`}>
                    <FullWidthTextField
                      label="Email ID*"
                      type="email"
                      name="business_email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div id="email_error">
                    {formError.email && (
                      <p className="error">{formError.email}</p>
                    )}
                  </div>
                  <p
                    className={`terms_text ${
                      theme === "light" && "text-black"
                    }`}
                  >
                    By continuing, you agree to the terms of{" "}
                    <Link
                      to={privacypolicyURL}
                      className="link orange_text"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Archinza Policy.
                    </Link>
                  </p>
                  <div className="cta_wrapper zero_margin">
                    <div className="btn_wrapper">
                      <button className="form_btn" onClick={handleSubmit}>
                        Sumbit
                        <img
                          src={rightarrowwhite}
                          alt="icon"
                          className="icon"
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {userState === "otp" && (
              <>
                <div className="text_container">
                  <h2 className="sub_title">Get Early Access</h2>
                  <h1 className="title">Enter OTP</h1>
                  <p className="notice otp_notice">
                    Please check your inbox for the OTP to validate your
                    account.
                    <br />
                    <br />
                    Do not close this page. Please check your inbox for the OTP
                    to validate your account. If you do not see it please check
                    your spam folder. Any issues? Please contact us at{" "}
                    <a href="mailto:applications@archinza.com">
                      applications@archinza.com
                    </a>
                  </p>
                </div>
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
                <div className="login_field_wrapper">
                  <div className="otp_wrapper">
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
                    <div className="btn_wrapper">
                      <button className="form_btn" onClick={handleOtpVerify}>
                        Verify
                        <img
                          src={rightarrowwhite}
                          alt="icon"
                          className="icon"
                          loading="lazy"
                        />
                      </button>
                      <button className="back_button" onClick={resendHandler}>
                        {resend === false ? "Resend OTP" : "Resending OTP"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {userState === "reset" && (
              <>
                <div className="text_container">
                  <h2 className="sub_title">Get Early Access</h2>
                  <h1 className="title">Reset Your Password</h1>
                </div>
                <div className="login_field_wrapper">
                  <div className="field_wrapper">
                    <FullWidthTextField
                      label="New password*"
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handlePasswordChange}
                    />
                    <div id="password_error">
                      {formError.password && (
                        <p className="error">{formError.password}</p>
                      )}
                    </div>
                  </div>
                  <div className="field_wrapper">
                    <FullWidthTextField
                      label="Re-enter password*"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    <div id="confirm_password_error">
                      {formError.confirm_password && (
                        <p className="error">{formError.confirm_password}</p>
                      )}
                    </div>
                    <p className="terms_text">
                      By continuing, you agree to the terms of{" "}
                      <Link
                        to={privacypolicyURL}
                        className="link orange_text"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Archinza Policy.
                      </Link>
                    </p>
                  </div>

                  <div className="cta_wrapper">
                    <div className="btn_wrapper zero_margin">
                      <button
                        className="form_btn"
                        onClick={handleResetPassword}
                      >
                        Reset Password
                        <img
                          src={rightarrowwhite}
                          alt="icon"
                          className="icon"
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        <FooterV2 />
      </main>
    </>
  );
};
export default ResetPassword;
