import React, { useEffect, useState } from "react";
import "./login.scss";
import { checkiconWhite, rightarrowwhite } from "../../images";
import CountryCodeDropdown from "../../components/CountryCodeDropdown/CountryCodeDropdown";
import FullWidthTextField from "../../components/TextField/FullWidthTextField";
import FooterV2 from "../../components/FooterV2/FooterV2";
import RadioButton from "../../components/RadioButton/RadioButton";
import BlinkingDots from "../../Animations/BlinkingDots/BlinkingDots";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import { toast } from "react-toastify";
import {
  businessFormFiveLTURL,
  loginOtpURL,
  privacypolicyURL,
  resetPassURL,
} from "../../components/helpers/constant-words";
import config from "../../config/config";

import Joi from "joi";
import http from "../../helpers/http";
import { useLocation, useWindowSize } from "react-use";
import { useAuth } from "../../context/Auth/AuthState";
import { parsePhoneNumber, validatePhoneNumberLength } from "libphonenumber-js";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import useTheme from "../../components/useTheme/useTheme";

const Login = () => {
  const { width } = useWindowSize();
  // const { theme } = useTheme();
  const  theme  = "dark";
  const [resend, setResend] = useState(false);
  const [loginStep, setLoginStep] = useState("PersonalAccount");
  const [activeTab, setActiveTab] = useState("PersonalAccount");
  const [selectedRadioButton, setSelectedRadioButton] =
    useState("PersonalAccount");
  const [deviceId, setDeviceId] = useState(null);
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const currentLoginStep = location.state?.loginStep;
  const [codes, setCodes] = useState([]);
  const [values, setValues] = useState({
    country_code: "91",
    phone: "",
    username: "",
    password: "",
  });

  const [formError, setFormError] = useState({});
  const joiOptions = config.joiOptions;

  const handlePasswordChange = (event) => {
    values.password = event.target.value;
  };

  const base_url = config.api_url; //without trailing slash

  const handleChange = (e) => {
    setValues((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleSelectChange = (value, fieldName) => {
    setValues((prevState) => {
      return {
        ...prevState,
        [fieldName]: value,
      };
    });
  };

  const handleRadioButtonClick = (tab) => {
    setLoginStep(tab);
    setSelectedRadioButton(tab);
    setActiveTab(tab);
  };

  const validate = async (data) => {
    let schemaObj;

    if (loginStep === "PersonalAccount") {
      schemaObj = {
        country_code: Joi.string().trim().required().label("Code"),
        phone: Joi.string().trim().required().label("Mobile No"),
      };
    } else {
      schemaObj = {
        username: Joi.string().trim().required().label("Username"),
        password: Joi.string().trim().required().label("Password"),
      };
    }

    const schema = Joi.object(schemaObj).options({ allowUnknown: true });

    const { error } = schema.validate(data, joiOptions);

    const errors = {};

    if (error) {
      error.details.map((field) => {
        errors[field.path[0]] = field.message;
        return true;
      });
    }

    // validating phone number
    if (data.phone) {
      try {
        const phoneNumber = parsePhoneNumber(
          `+${values.country_code}${values.phone}`
        );

        if (phoneNumber.isValid() === false) {
          errors["phone"] = `Phone number must be valid `;
        }
      } catch (error) {}
    }

    return errors ? errors : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = await validate(values);
    console.log(errors);
    setFormError(errors);
    if (Object.keys(errors).length) {
      return;
    }

    const userProfiles = JSON.parse(
      localStorage.getItem("userProfiles") || "[]"
    );

    const profilesArray = Object.values(userProfiles);

    const businessAccounts = profilesArray.filter(
      (profile) => "isVerified" in profile
    ).length;
    const personalAccounts = profilesArray.filter(
      (profile) => !("isVerified" in profile)
    ).length;
    if (loginStep === "PersonalAccount" && personalAccounts >= 1) {
      setFormError({ country_code: "Only 1 personal account is allowed." });
      return;
    }
    if (loginStep === "BusinessAccount" && businessAccounts >= 4) {
      setFormError({ password: "Only 4 business accounts are allowed." });
      return;
    }

    let api_url =
      loginStep === "PersonalAccount" ? "/personal/login" : "/business/login";
    values["deviceId"] = deviceId;
    const data = await http.post(base_url + api_url, values);
    if (data) {
      if (loginStep === "PersonalAccount") {
        sessionStorage.setItem("canAccessOtp", "true");
        navigate(loginOtpURL, {
          state: values,
        });
      } else {
        if (data?.data?.error) {
          setFormError({ password: data?.data?.error });
          return;
        }
        auth.businessLogin(data.data);
        // auth.login(data.data);
      }
    }
  };

  const fetchCodes = async () => {
    const { data } = await http.get(base_url + "/general/countries/codes");

    if (data) {
      setCodes(data);
    }
  };

  // const accountList = accounts.map((option) => (
  //   <React.Fragment key={option}>
  //     <RadioButton label={option} labelId={option} />
  //   </React.Fragment>
  // ));

  // const OTPMsg = () => (
  //   <div className="otp_box">
  //     <img
  //       width={39}
  //       height={39}
  //       src={checkiconWhite}
  //       className="otp_resend_icon"
  //       loading="lazy"
  //       alt="icon"
  //     />
  //     <p className="title">OTP reshared</p>
  //   </div>
  // );

  const EmailMsg = () => (
    <div className="otp_box">
      <img
        width={39}
        height={39}
        src={checkiconWhite}
        className="otp_resend_icon"
        loading="lazy"
        alt="icon"
      />
      <p className="title">
        New password shared on <br />
        your registered E-mail ID
      </p>
    </div>
  );

  // const resendHandler = () => {
  //   if (resend === false) {
  //     setResend(true);
  //     toast(<OTPMsg />, {
  //       className: "otp_toast",
  //       position: toast.POSITION.TOP_CENTER,
  //       hideProgressBar: true,
  //       closeButton: false,
  //     });
  //   } else {
  //     setResend(false);
  //   }
  // };

  const mailHandler = () => {
    toast(<EmailMsg />, {
      className: "mail_toast",
      position: toast.POSITION.TOP_CENTER,
      hideProgressBar: true,
      closeButton: false,
      autoClose: 1500,
    });
  };

  useEffect(() => {
    const resetButton = setTimeout(() => {
      setResend(false);
    }, 1000);
    return () => clearTimeout(resetButton);
  }, [resend]);

  useEffect(() => {
    if (location.state?.usr?.loginStep) {
      setSelectedRadioButton(location.state.usr.loginStep);
      setLoginStep(location.state.usr.loginStep);
      setActiveTab(location.state.usr.loginStep);
    }
  }, [location.state]);

  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId); // unique device/browser ID
    };

    getFingerprint();
    fetchCodes();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BlinkingDots />
      <main className="user_login_container">
        <section className="login_sec1">
          <div className="my_container">
            <div className="text_container">
              <h2 className="sub_title">Login</h2>
              {/* <h3 className="title">Account type</h3> */}
              <h3 className={`title ${theme === "light" ? "text-black" : ""}`}>
                Which account would you like to log in to?
              </h3>
            </div>

            <div className="cateogories_wrapper">
              <div className="cateogory_box">
                <ul
                  className={`radio_container ${
                    theme === "light" && "radio_conatiner_lightMode"
                  }`}
                  // onClick={() => setLoginStep("PersonalAccount")}
                >
                  <RadioButton
                    label="Personal Account"
                    labelId="personal-account"
                    // value="PersonalAccount"
                    labelClass={`login_label ${
                      theme === "light" ? "text-black--dark-theme" : ""
                    }`}
                    checked={selectedRadioButton === "PersonalAccount"}
                    onChange={() => handleRadioButtonClick("PersonalAccount")}
                  />
                </ul>
              </div>
              <div className="cateogory_box">
                <ul
                  className={`radio_container ${
                    theme === "light" && "radio_conatiner_lightMode"
                  }`}
                  // onClick={() => setLoginStep("BusinessAccount")}
                >
                  <RadioButton
                    label="Business Account"
                    labelId="business-account"
                    labelClass={`login_label ${
                      theme === "light" ? "text-black--dark-theme" : ""
                    }`}
                    // value="BusinessAccount"
                    checked={selectedRadioButton === "BusinessAccount"}
                    onClick={(e) => handleRadioButtonClick("BusinessAccount")}
                  />
                </ul>
              </div>
            </div>
            {activeTab === "PersonalAccount" && (
              <div className="contact_wrapper">
                <form onSubmit={handleSubmit} noValidate autoComplete="on">
                  <div className="row field_row">
                    <div className="col-md-12 field_col">
                      <div className="row">
                        <div className="col-4 ps-0">
                          <div
                            className={`field_wrapper ${
                              theme === "light" && "field_wrapper_light_mode"
                            }`}
                          >
                            <CountryCodeDropdown
                              textLabel="Code"
                              data={codes}
                              onChange={(e, value) => {
                                handleSelectChange(
                                  value.phone_code,
                                  "country_code"
                                );
                              }}
                              defaultValue={{
                                name: "India",
                                iso3: "IND",
                                phone_code: "91",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-8 pe-0">
                          <div
                            className={`field_wrapper ${
                              theme === "light" && "field_wrapper_light_mode"
                            }`}
                          >
                            <FullWidthTextField
                              label="Mobile No.*"
                              type="tel"
                              name="phone"
                              value={values.phone}
                              onChange={handleChange}
                              autoComplete="phone"
                            />
                            <p className="error">
                              {formError.country_code || formError.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p
                    className={`terms_text ${
                      theme === "light" ? "text-black" : ""
                    }`}
                  >
                    By continuing, you agree to {width < 600 && <br />}the terms
                    of{" "}
                    <Link
                      to={privacypolicyURL}
                      className="link clr_orange"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Archinza Policy.
                    </Link>
                  </p>
                  <div className="cta_wrapper">
                    <div className="btn_wrapper">
                      <button className="form_btn">
                        Login with OTP
                        <img
                          src={rightarrowwhite}
                          alt="icon"
                          className="icon"
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            {activeTab === "BusinessAccount" && (
              <div className="contact_wrapper">
                <form onSubmit={handleSubmit} noValidate autoComplete="on">
                  <div className="row field_row">
                    <div className="col-md-12 field_col">
                      <div
                        className={`field_wrapper ${
                          theme === "light" && "field_wrapper_light_mode"
                        }`}
                      >
                        <FullWidthTextField
                          label="Username*"
                          type="text"
                          name="username"
                          onChange={handleChange}
                          value={values.username}
                          autoComplete="login-username"
                        />
                        {formError && (
                          <p className="error">{formError.username}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12 field_col">
                      <div
                        className={`field_wrapper ${
                          theme === "light" && "field_wrapper_light_mode"
                        }`}
                      >
                        <PasswordInput
                          label="Password*"
                          hideIcon={false}
                          name="password"
                          value={values.password}
                          onChange={handlePasswordChange}
                          autoComplete="current-password"
                        />

                        {formError && (
                          <p className="error">{formError.password}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={resetPassURL}
                    className={`reset_notice ${
                      theme === "light" && "text-black"
                    }`}
                  >
                    Forgot password?
                  </Link>
                  <p className={`terms_text ${
                      theme === "light" && "text-black"
                    }`}>
                    By continuing, you agree to {width < 600 && <br />}the terms
                    of{" "}
                    <Link
                      to={privacypolicyURL}
                      className="link clr_orange"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Archinza Policy.
                    </Link>
                  </p>
                  <div className="cta_wrapper">
                    <div className="btn_wrapper">
                      <button className="form_btn" onClick={handleSubmit}>
                        Login
                        <img
                          src={rightarrowwhite}
                          alt="icon"
                          className="icon"
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* <FooterV2 whatsappBotIcon={false} /> */}
        {theme === "dark" ? (
          <FooterV2 whatsappBotIcon={false} />
        ) : (
          <FooterV2 lightTheme whatsappBotIcon={false} />
        )}
      </main>
    </>
  );
};
export default Login;
