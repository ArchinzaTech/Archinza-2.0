import React, { useContext, useEffect, useState } from "react";
import "./registrationform.scss";
import RadioButton from "../../components/RadioButton/RadioButton";
import FullWidthTextField from "../../components/TextField/FullWidthTextField";
import CountryCodeDropdown from "../../components/CountryCodeDropdown/CountryCodeDropdown";
import { Link, useNavigate } from "react-router-dom";
import { rightarrowwhite } from "../../images";
import { useWindowSize } from "react-use";
import FooterV2 from "../../components/FooterV2/FooterV2";
import AutoCompleteField from "../../components/AutoCompleteField/AutoCompleteField";
import { countries2 } from "../../db/dataTypesData";
import BlinkingDots from "../../Animations/BlinkingDots/BlinkingDots";
import {
  privacypolicyURL,
  regiserOTPURL,
} from "../../components/helpers/constant-words";
import config from "../../config/config";

import Joi from "joi";
import http from "../../helpers/http";
import helper from "../../helpers/helper";
import { parsePhoneNumber, validatePhoneNumberLength } from "libphonenumber-js";
import { DeContext } from "../../App";
import { useAuth } from "../../context/Auth/AuthState";
import RoleChangeCongrats from "../../components/RoleChangeCongrats/RoleChangeCongrats";
const RegistrationForm = () => {
  const { width } = useWindowSize();

  const navigate = useNavigate();

  const [values, setValues] = useState({
    user_type: "",
    name: "",
    email: "",
    password: "",
    country_code: "91",
    whatsapp_country_code: "91",
    phone: "",
    whatsapp_no: "",
    country: "India",
    city: "",
    pincode: "",
  });

  const [formError, setFormError] = useState({});
  const [pincodeError, setPincodeError] = useState(null);
  const [codes, setCodes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isWASame, setIsWASame] = useState(false);
  const [isDesignBuild, setIsDesignBuild] = useState({
    designIndustry: false,
    formActive: false,
  });
  const [waCountryCode, setWaCountryCode] = useState({
    name: "India",
    iso3: "IND",
    phone_code: "91",
  });
  const [countryCode, setCountryCode] = useState({
    name: "India",
    iso3: "IND",
    phone_code: "91",
  });
  const [designIndustrySelection, setDesignIndustrySelection] = useState(null);
  const [designIndustryError, setDesignIndustryError] = useState(null);

  const joiOptions = config.joiOptions;

  const base_url = config.api_url; //without trailing slash

  const validatePhoneNumber = async (
    countryCode,
    phoneNumber,
    type = "phone"
  ) => {
    try {
      const fullNumber = parsePhoneNumber(`+${countryCode}${phoneNumber}`);
      if (!fullNumber.isValid()) {
        return `Please enter a valid ${type} number`;
      }
      const isUnique = await helper.isPhoneUnique(
        countryCode,
        phoneNumber,
        "PersonalAccount"
      );
      if (!isUnique && type === "phone") {
        return "This phone number is already in use";
      }
    } catch (err) {
      return `Please enter a valid ${type} number`;
    }
    return null;
  };

  const handleDesignIndustry = () => {
    if (!designIndustrySelection) {
      setDesignIndustryError("Please select an option");
      return;
    }

    if (designIndustrySelection === "DN") {
      setValues((prevValues) => ({
        ...prevValues,
        user_type: "DE",
      }));
    }

    setIsDesignBuild({
      designIndustry: designIndustrySelection,
      formActive: true,
    });
  };

  const handleDesignIndustrySelection = (selection) => {
    setDesignIndustrySelection(selection);
    // setIsDesignBuild({
    //   designIndustry: true,
    //   formActive: true,
    // });
    setDesignIndustryError(null);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setValues((prevState) => {
      let newState = {
        ...prevState,
        [name]: value,
      };

      // If "Same as phone number" is checked and phone number is changing
      if (isWASame && name === "phone") {
        newState.whatsapp_no = value;
        // setIsWASame(false);
      }

      // If WhatsApp number is changing, check if it's still the same as phone
      if (name === "whatsapp_no") {
        if (value !== prevState.phone) {
          setIsWASame(false);
        } else {
          setIsWASame(true);
        }
      }

      return newState;
    });

    // Real-time validation
    let error = null;

    switch (name) {
      case "name":
        if (value.trim() === "") {
          error = "Name cannot be empty";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const result = await helper.isEmailUnique(value, "PersonalAccount");
        if (!emailRegex.test(value)) {
          error = "Please enter a valid email address";
        } else if (result === false) {
          error = `This email is already in use.`;
        }
        break;

      case "password":
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,}$/;
        if (!passwordRegex.test(value)) {
          error =
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
        }
        break;

      case "phone":
        const phoneError = await validatePhoneNumber(
          values.country_code,
          value,
          "phone"
        );

        error = phoneError;
        break;

      case "whatsapp_no":
        const whatsappError = await validatePhoneNumber(
          values.whatsapp_country_code,
          value,
          "whatsapp"
        );
        error = whatsappError;
        break;
      case "pincode":
        const numericPincode = value.replace(/\D/g, "");
        setValues((prevState) => ({
          ...prevState,
          [name]: numericPincode,
        }));

        if (numericPincode.length === 6 && values.city) {
          await validatePincode(numericPincode, values.city);
          return;
        } else if (numericPincode.length !== 6) {
          error = "Pincode must be 6 digits";
        } else {
          setPincodeError(null);
        }
        break;

      default:
        break;
    }

    setFormError((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    // Check if phone and WhatsApp number are the same
    // if (name === "phone") {
    //   if (value === values.whatsapp_no) {
    //     setIsWASame(true);
    //   } else {
    //     setIsWASame(false);
    //   }
    // } else if (name === "whatsapp_no") {
    //   if (value === values.phone) {
    //     setIsWASame(true);
    //   } else {
    //     setIsWASame(false);
    //   }
    // }

    // Update WhatsApp number if the checkbox is checked
    if (isWASame && name === "phone") {
      setValues((prevState) => ({
        ...prevState,
        whatsapp_no: value,
      }));
    }
  };

  const handleSelectChange = async (value, fieldName) => {
    if (fieldName === "city" && values.pincode) {
      await validatePincode(values.pincode, value);
    }
    setValues((prevState) => {
      let newState = {
        ...prevState,
        [fieldName]: value,
      };

      if (fieldName === "country") {
        newState.city = "";
        newState.pincode = "";
      }

      return newState;
    });

    if (value.length) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        [fieldName]: "",
      }));
    }

    if (fieldName === "country_code") {
      setCountryCode(value);
      if (values.phone) {
        const phoneError = await validatePhoneNumber(
          value,
          values.phone,
          "phone"
        );
        setFormError((prevErrors) => ({
          ...prevErrors,
          phone: phoneError,
        }));
      }

      // If "Same as phone number" is checked, also update WhatsApp number
      if (isWASame) {
        setWaCountryCode(value);
        setValues((prevState) => ({
          ...prevState,
          whatsapp_country_code: value,
        }));
        const whatsappError = await validatePhoneNumber(
          value,
          values.whatsapp_no,
          "whatsapp"
        );
        setFormError((prevErrors) => ({
          ...prevErrors,
          whatsapp_no: whatsappError,
        }));
      }
    }

    if (fieldName === "whatsapp_country_code") {
      setWaCountryCode(value);
      if (values.whatsapp_no) {
        const phoneError = await validatePhoneNumber(
          value,
          values.whatsapp_no,
          "whatsapp"
        );
        setFormError((prevErrors) => ({
          ...prevErrors,
          whatsapp_no: phoneError,
        }));
      }

      // If "Same as phone number" is checked, also update WhatsApp number
      // if (isWASame) {
      //   setWaCountryCode(value);
      //   setValues((prevState) => ({
      //     ...prevState,
      //     whatsapp_country_code: value,
      //   }));
      //   const whatsappError = await validatePhoneNumber(
      //     value,
      //     values.whatsapp_no
      //   );
      //   setFormError((prevErrors) => ({
      //     ...prevErrors,
      //     whatsapp_no: whatsappError,
      //   }));
      // }
    }
  };

  const handleWAChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setValues((prevState) => {
        return {
          ...prevState,
          ["whatsapp_no"]: values.phone,
          ["whatsapp_country_code"]: values.country_code,
        };
      });

      setWaCountryCode(countryCode);

      setIsWASame(true);
      if (values.phone.length == 10) {
        setFormError((prevErrors) => ({
          ...prevErrors,
          ["whatsapp_no"]: "",
        }));
      }
    } else {
      setValues((prevState) => {
        return {
          ...prevState,
          ["whatsapp_no"]: "",
          ["whatsapp_country_code"]: "",
        };
      });
      setWaCountryCode(null);

      setIsWASame(false);
    }
  };

  const validate = async (data) => {
    let schemaObj = {
      user_type: Joi.string().trim().required().messages({
        "string.empty": `Please choose your role to proceed`,
      }),
      name: Joi.string().trim().required().label("Full Name"),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email"),
      password: Joi.string().min(8).required().label("Password"),
      country_code: Joi.string().trim().required().label("Code"),
      whatsapp_country_code: Joi.string().trim().required().label("Code"),
      phone: Joi.number()
        .required()
        .messages({
          "number.base": "Phone number is required",
          "number.empty": "Phone number is required",
        })
        .label("Phone"),
      whatsapp_no: Joi.number()
        .required()
        .messages({
          "number.base": "WhatsApp number is required",
          "number.empty": "WhatsApp number is required",
        })
        .label("WhatsApp number"),
      country: Joi.string().trim().required().label("Country"),
      design_industry: Joi.string().valid("DY", "DN").required().messages({
        "any.only":
          "Please select your involvement in the design & build industry",
      }),
    };

    if (data.design_industry === "DY") {
      schemaObj.user_type = Joi.string().required().messages({
        "string.empty":
          "Please choose your role in the design & build industry",
      });
    }

    if (data.country == "India") {
      schemaObj.city = Joi.string().trim().required().label("City");

      schemaObj.pincode = Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .label("Pincode")
        .messages({
          "string.length": "Pincode must be 6 digits",
          "string.pattern.base": "Pincode must contain only numbers",
          "string.empty": "Pincode is required",
        });
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

    // validating unique email
    if (data.email) {
      const result = await helper.isEmailUnique(data.email, "PersonalAccount");

      if (result === false) {
        errors["email"] = `This email is already in use.`;
      }
    }

    if (data.password) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,}$/;
      if (!passwordRegex.test(data.password)) {
        errors["password"] =
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
      }
    }
    // validating unique phone
    if (data.phone) {
      const result = await helper.isPhoneUnique(
        data.country_code,
        data.phone,
        "PersonalAccount"
      );

      if (result === false) {
        errors["phone"] = `This phone number is already in use.`;
      }
    }
    // validating phone number
    // validating phone number
    if (data.phone) {
      const phoneError = await validatePhoneNumber(
        data.country_code,
        data.phone,
        "phone"
      );
      if (phoneError) {
        errors["phone"] = phoneError;
      }
    }

    // validating whatsApp number
    if (data.whatsapp_no) {
      const whatsappError = await validatePhoneNumber(
        data.whatsapp_country_code,
        data.whatsapp_no,
        "whatsapp"
      );
      if (whatsappError) {
        errors["whatsapp_no"] = whatsappError;
      }
    }

    //validating pincode
    if (pincodeError) {
      errors["pincode"] = pincodeError;
    }

    return errors ? errors : null;
  };

  const validatePincode = async (pincode, city) => {
    setLoading(true);
    if (pincode.length === 6) {
      const response = await http.get(
        `${base_url}/personal/check-pincode/${pincode}?city=${city}`
      );

      if (response?.data === null) {
        setPincodeError("Invalid pincode for the selected city");
        setFormError((prevErrors) => ({
          ...prevErrors,
          pincode: "Invalid pincode for the selected city",
        }));

        setLoading(false);
        return false;
      } else {
        setPincodeError(null);
        setFormError((prevErrors) => ({
          ...prevErrors,
          pincode: null,
        }));
        setLoading(false);
        return true;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const phoneNumber = parsePhoneNumber(`+${values.country_code}${values.phone}`)
    // // console.log({phoneValidation: validatePhoneNumberLength(`+${values.country_code}${values.phone}`,"IN")});
    // console.log({phoneNumber:phoneNumber.isValid()});
    values["design_industry"] = designIndustrySelection;
    let errors = await validate(values);
    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }

    let formData = {
      ...values,
      phone: values.phone.trim(),
      whatsapp_no: values.whatsapp_no.trim(),
    };

    if (!loading) {
      const data = await http.post(base_url + "/personal/signup", formData);
      if (data) {
        navigate(regiserOTPURL, {
          state: formData,
        });

        // window.scrollTo(0, 0);
        // redirect
        // setValues({ email: "" });
        // setisMsgVisible(true);
      }
    }
  };

  const fetchCodes = async () => {
    const { data } = await http.get(base_url + "/general/countries/codes");

    if (data) {
      setCodes(data);
    }
  };

  const fetchCountires = async () => {
    const { data } = await http.get(base_url + "/general/countries");

    if (data) {
      setCountries(data);
    }
  };

  const fetchCities = async () => {
    const country_id = 101;
    const { data } = await http.get(
      base_url + "/general/cities-by-country/" + country_id
    );

    if (data) {
      setCities(data);
    }
  };

  useEffect(() => {
    if (!isDesignBuild.formActive && window.history.state?.step !== "initial") {
      window.history.replaceState({ step: "initial" }, null);
    }

    if (isDesignBuild.formActive && window.history.state?.step !== "form") {
      window.history.pushState({ step: "form" }, null);
    }

    const handlePopState = (event) => {
      if (event.state?.step === "initial" && isDesignBuild.formActive) {
        setIsDesignBuild({
          designIndustry: false,
          formActive: false,
        });
        setValues((prevValues) => ({
          ...prevValues,
          user_type: "",
        }));
        window.history.replaceState({ step: "initial" }, null);
      } else if (!event.state || event.state?.step !== "form") {
        navigate("/register", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDesignBuild.formActive, navigate]);
  useEffect(() => {
    fetchCodes();
    fetchCountires();
    fetchCities();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { deChangRole } = useContext(DeContext);
  const auth = useAuth();
  const [modalShow, setModalShow] = useState(false);
  const handlemodalShowOpen = () => setModalShow(true);
  const handlemodalShowClose = () => setModalShow(false);

  return (
    <>
     <RoleChangeCongrats
        show={modalShow}
        onHide={() => {
          window.history.replaceState({}, "");
          setModalShow(false);
        }}
        showConfetti={false}
        isItConfirmationPopup={auth?.user?.user_type === "DE"}
        modelCloseEvent={handlemodalShowClose}
      />
      <BlinkingDots />
      <main className="reg_main">
        <section className="reg_sec1">
          <div className="my_container">
            <div className="text_container">
              <p className="head_text">Get Early Access</p>
              <h1 className="heading">Tell us about yourself</h1>
              {
                isDesignBuild.designIndustry ? (
                  <>
                    <h2 className="sub_heading">
                      Your role in the design & build industry
                    </h2>
                    <p className="choose_text">
                      {designIndustrySelection === "DY" ? "Choose one" : ""}
                    </p>
                    <div id="user_type_error">
                      {formError.user_type && (
                        <p className="error top_error">{formError.user_type}</p>
                      )}
                    </div>
                  </>
                ) : auth?.user && deChangRole === true ? (
                  <>
                    <h2 className="sub_heading">
                      Are you from the design & build industry?
                    </h2>
                    <p className="choose_text">Choose one</p>
                    <div id="user_type_error">
                      {designIndustryError && (
                        <p className="error top_error">{designIndustryError}</p>
                      )}
                    </div>
                    <div className="design_wrapper">
                      <form action="">
                        <ul className="radio_container radio_container_form">
                          <RadioButton
                            label="Yes"
                            labelId="designYes"
                            name="design_industry"
                            value="DY"
                            checked={designIndustrySelection === "DY"}
                            onChange={() => handleDesignIndustrySelection("DY")}
                          />
                          <RadioButton
                            label="No"
                            labelId="designNo"
                            name="design_industry"
                            value="DN"
                            checked={designIndustrySelection === "DN"}
                            onChange={() => handleDesignIndustrySelection("DN")}
                          />
                        </ul>
                      </form>
                      <div className="cta_wrapper">
                        <div
                          className="common_cta"
                          onClick={() => {
                            designIndustrySelection === "DY"
                              ? navigate("/change-role")
                              // : navigate("/dashboard");
                             : handlemodalShowOpen()
                          }}
                          
                        >
                          Next
                          <img
                            src={rightarrowwhite}
                            alt="icon"
                            className="icon"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="sub_heading">
                      Are you from the design & build industry?
                    </h2>
                    <p className="choose_text">Choose one</p>
                    <div id="user_type_error">
                      {designIndustryError && (
                        <p className="error top_error">{designIndustryError}</p>
                      )}
                    </div>
                    <div className="design_wrapper">
                      <form action="">
                        <ul className="radio_container radio_container_form">
                          <RadioButton
                            label="Yes"
                            labelId="designYes"
                            name="design_industry"
                            value="DY"
                            checked={designIndustrySelection === "DY"}
                            onChange={() => handleDesignIndustrySelection("DY")}
                          />
                          <RadioButton
                            label="No"
                            labelId="designNo"
                            name="design_industry"
                            value="DN"
                            checked={designIndustrySelection === "DN"}
                            onChange={() => handleDesignIndustrySelection("DN")}
                          />
                        </ul>
                      </form>
                      <div className="cta_wrapper">
                        <div
                          className="common_cta"
                          onClick={handleDesignIndustry}
                        >
                          Next
                          <img
                            src={rightarrowwhite}
                            alt="icon"
                            className="icon"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )

                // <>
                //   <h2 className="sub_heading">
                //     Are you from the design & build industry?
                //   </h2>
                //   <p className="choose_text">Choose one</p>
                //   <div id="user_type_error">
                //     {designIndustryError && (
                //       <p className="error top_error">{designIndustryError}</p>
                //     )}
                //   </div>
                //   <div className="design_wrapper">
                //     <form action="">
                //       <ul className="radio_container radio_container_form">
                //         <RadioButton
                //           label="Yes"
                //           labelId="designYes"
                //           name="design_industry"
                //           value="DY"
                //           checked={designIndustrySelection === "DY"}
                //           onChange={() => handleDesignIndustrySelection("DY")}
                //         />
                //         <RadioButton
                //           label="No"
                //           labelId="designNo"
                //           name="design_industry"
                //           value="DN"
                //           checked={designIndustrySelection === "DN"}
                //           onChange={() => handleDesignIndustrySelection("DN")}
                //         />
                //       </ul>
                //     </form>
                //     <div className="cta_wrapper">
                //       <div
                //         className="common_cta"
                //         onClick={handleDesignIndustry}
                //       >
                //         Next
                //         <img
                //           src={rightarrowwhite}
                //           alt="icon"
                //           className="icon"
                //           loading="lazy"
                //         />
                //       </div>
                //     </div>
                //   </div>
                // </>
              }
            </div>
            {isDesignBuild.formActive && (
              <form
                className="form_container"
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
              >
                {designIndustrySelection === "DY" && (
                  <ul className="radio_container radio_container_form">
                    <RadioButton
                      label="Business/Firm Owner"
                      labelId="business-firm-owner"
                      name="user_type"
                      value="BO"
                      checked={values.user_type === "BO"}
                      onChange={handleChange}
                    />
                    {/* <RadioButton
                  label="Design Enthusiast"
                  labelId="design-enthusiast"
                  name="user_type"
                  value="DE"
                  checked={values.user_type === "DE"}
                  onChange={handleChange}
                /> */}
                    <RadioButton
                      label="Student"
                      labelId="student"
                      name="user_type"
                      value="ST"
                      checked={values.user_type === "ST"}
                      onChange={handleChange}
                    />
                    <RadioButton
                      label="Working Professional"
                      labelId="team-member"
                      name="user_type"
                      value="TM"
                      checked={values.user_type === "TM"}
                      onChange={handleChange}
                    />
                    <RadioButton
                      label="Freelancer/Artist"
                      labelId="freelancer"
                      name="user_type"
                      value="FL"
                      checked={values.user_type === "FL"}
                      onChange={handleChange}
                    />
                  </ul>
                )}
                <div className="row form_row">
                  <div className={`col-md-6 form_col ${width > 992 && "ps-0"}`}>
                    <div className="field_wrapper field_wrapper_mobile">
                      <FullWidthTextField
                        label="Your Full Name*"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                      />
                      <div id="name_error">
                        {formError.name && (
                          <p className="error">{formError.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`col-md-6 form_col ${width > 992 && "pe-0"}`}>
                    <div className="field_wrapper">
                      <FullWidthTextField
                        label="E-mail*"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        autoComplete="personal-email"
                      />
                      <div id="email_error">
                        {formError.email && (
                          <p className="error">{formError.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`col-md-6 form_col ${width > 992 && "ps-0"}`}>
                    <div className="field_wrapper">
                      <FullWidthTextField
                        label="Set Password*"
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        autoComplete="personal-password"
                      />
                      <p className="pass_help">
                        Your password should be at least 8 characters
                      </p>
                      <div id="password_error">
                        {formError.password && (
                          <p className="error">{formError.password}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 form_col pe-0">
                    <div className="field_wrapper">
                      <div className="row">
                        <div className="col-4 col-sm-4 col-md-4 ps-0">
                          <div className="field_wrapper_1">
                            <CountryCodeDropdown
                              key="country_code"
                              textLabel="Code*"
                              data={codes}
                              onChange={(e, value) => {
                                handleSelectChange(
                                  value.phone_code,
                                  "country_code"
                                );
                                setCountryCode(value);

                                if (isWASame) {
                                  setWaCountryCode(value);
                                  handleSelectChange(
                                    value.phone_code,
                                    "whatsapp_country_code"
                                  );
                                }
                              }}
                              // defaultValue={{
                              //   name: "India",
                              //   iso3: "IND",
                              //   phone_code: "91",
                              // }}
                              value={countryCode}
                            />
                          </div>
                        </div>
                        <div
                          // className={`col-8 col-sm-8 col-md-8 ${
                          //   width > 992 ? "pe-0" : "ps-0"
                          // } ${width <= 575 && "mobile_stack"}`}
                          className={`col-8 col-sm-8 col-md-8 ${
                            width > 992 ? "pe-0" : "ps-0"
                          }`}
                        >
                          <div className="field_wrapper_1">
                            <FullWidthTextField
                              label="Phone*"
                              type="tel"
                              name="phone"
                              value={values.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div id="phone_error">
                        {formError.country_code ||
                          (formError.phone && (
                            <p className="error">
                              {formError.country_code || formError.phone}
                            </p>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className={`col-md-6 form_col ${width > 992 && "ps-0"}`}>
                    <div className="field_wrapper">
                      <div className="row">
                        <div className="col-4 col-sm-4 col-md-4 ps-0">
                          <div className="field_wrapper_1">
                            <CountryCodeDropdown
                              key="whatsapp_country_code"
                              textLabel="Code*"
                              data={codes}
                              onChange={(e, value) => {
                                handleSelectChange(
                                  value.phone_code,
                                  "whatsapp_country_code"
                                );
                                setWaCountryCode(value);

                                if (isWASame) {
                                  if (value.phone != values.country_code) {
                                    setIsWASame(false);
                                  }
                                }
                              }}
                              // defaultValue={{
                              //   name: "India",
                              //   iso3: "IND",
                              //   phone_code: "91",
                              // }}
                              value={waCountryCode}
                            />
                          </div>
                        </div>
                        <div
                          className={`col-8 col-sm-8 col-md-8 ${
                            width > 992 ? "pe-0" : "ps-0"
                          }`}
                        >
                          <div className="field_wrapper_1">
                            <FullWidthTextField
                              label="WhatsApp Number*"
                              type="tel"
                              name="whatsapp_no"
                              value={values.whatsapp_no}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div id="whatsapp_no_error">
                        {formError.whatsapp_no && (
                          <p className="error">
                            {formError.whatsapp_country_code ||
                              formError.whatsapp_no}
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={`checkbox_wrapper ${
                        formError.whatsapp_no && "error"
                      }`}
                    >
                      <label className="checkbox_label">
                        <input
                          type="checkbox"
                          className="check_box"
                          checked={isWASame}
                          onChange={handleWAChange}
                        />
                        Same as phone number
                      </label>
                    </div>
                  </div>
                  <div className={`col-md-6 form_col ${width > 992 && "pe-0"}`}>
                    <div className="field_wrapper">
                      <AutoCompleteField
                        key="country"
                        textLabel="Country*"
                        data={countries}
                        onChange={(e, option) => {
                          handleSelectChange(option.value, "country");
                        }}
                        defaultValue={{
                          value: "India",
                          label: "India",
                        }}
                      />
                      <div id="country_error">
                        {formError.country && (
                          <p className="error">{formError.country}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {values?.country === "India" && (
                    <>
                      <div
                        className={`col-md-6 form_col ${width > 992 && "ps-0"}`}
                      >
                        <div className="field_wrapper">
                          <AutoCompleteField
                            key="city"
                            textLabel="City*"
                            data={cities}
                            getOptionLabel={(option) => option.name}
                            onChange={(e, value) => {
                              handleSelectChange(value.name, "city");
                            }}
                          />
                          <div id="city_error">
                            {formError.city && (
                              <p className="error">{formError.city}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`col-md-6 form_col ${width > 992 && "pe-0"}`}
                      >
                        <div className="field_wrapper">
                          <FullWidthTextField
                            type="tel"
                            label="Pincode*"
                            name="pincode"
                            value={values.pincode}
                            onChange={handleChange}
                          />
                          <div id="pincode_error">
                            {formError.pincode && (
                              <p className="error">{formError.pincode}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className={`col-md-12 form_col ${width > 992 && "p-0"}`}>
                    <div className="privacy_checbox">
                      By continuing, you agree to <br />
                      the terms of&nbsp;
                      <Link
                        to={privacypolicyURL}
                        className="policy_link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Archinza Policy
                      </Link>
                      .
                    </div>
                  </div>
                  <div className={`col-md-12 form_col ${width > 992 && "p-0"}`}>
                    <div className="btn_wrapper">
                      <button className="form_btn" disabled={loading}>
                        Get OTP To Connect
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
              </form>
            )}
          </div>
        </section>
        <FooterV2 whatsappBotIcon={false} />
      </main>
    </>
  );
};

export default RegistrationForm;
