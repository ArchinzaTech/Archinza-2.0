import React, { useCallback, useEffect, useState } from "react";
import style from "./businessAccountDetails.module.scss";
import { errorFailed, errorSuccess, rightarrowwhite } from "../../images";
import { countries } from "../../db/dataTypesData";
import FullWidthTextField from "../../components/TextField/FullWidthTextField";
import AutoCompleteField from "../../components/AutoCompleteField/AutoCompleteField";
import CountryCodeDropdown from "../../components/CountryCodeDropdown/CountryCodeDropdown";
import FooterV2 from "../../components/FooterV2/FooterV2";
import { Link, useNavigate } from "react-router-dom";
import LightThemeBackground from "../../Animations/LightThemeBackground/LightThemeBackground";
import {
  loginURL,
  privacypolicyURL,
  regiserOTPURL,
  registrationBusinessOTPURL,
} from "../../components/helpers/constant-words";
import config from "../../config/config";
import http from "../../helpers/http";
import axios from "axios";
import { debounce } from "lodash";
import Joi from "joi";
import helper from "../../helpers/helper";
import { parsePhoneNumber } from "libphonenumber-js";

const BusinessAccountDetails = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    business_name: "",
    email: "",
    password: "",
    country_code: "91",
    phone: "",
    whatsapp_country_code: "91",
    whatsapp_no: "",
    username: "",
    contact_person: "",
  });

  const [formError, setFormError] = useState({});
  const [codes, setCodes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [isWASame, setIsWASame] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [usernameMsg, setUsernameMsg] = useState("");
  const [hideCityPincode, setHideCityPincode] = useState(false);

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
    } catch (err) {
      return `Please enter a valid ${type} number`;
    }
    return null;
  };

  const validateField = (name, value) => {
    let error = null;
    switch (name) {
      case "business_name":
        if (!value.trim()) error = "Business name is required";
        break;
      case "contact_person":
        if (!value.trim()) error = "Contact person name is required";
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,}$/;
        if (!value) {
          error = "Password is required";
        } else if (!passwordRegex.test(value)) {
          error =
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else {
          try {
            const phoneNumber = parsePhoneNumber(
              `+${values.country_code}${value}`
            );
            if (!phoneNumber.isValid()) {
              error = "Please enter a valid phone number";
            }
          } catch (err) {
            error = "Please enter a valid phone number";
          }
        }
        break;
      case "whatsapp_no":
        if (!value.trim()) {
          error = "WhatsApp number is required";
        } else {
          try {
            const whatsappNumber = parsePhoneNumber(
              `+${values.whatsapp_country_code}${value}`
            );
            if (!whatsappNumber.isValid()) {
              error = "Please enter a valid WhatsApp number";
            }
          } catch (err) {
            error = "Please enter a valid WhatsApp number";
          }
        }
        break;
      case "country":
        if (!value?.trim()) error = "Country is required";
        break;
      case "city":
        if (values.country === "India" && !value.trim())
          error = "City is required";
        break;
      case "pincode":
        if (values.country === "India") {
          if (!value?.trim()) {
            error = "Pincode is required";
          } else if (!/^\d{6}$/.test(value)) {
            error = "Please enter a valid 6-digit pincode";
          }
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Real-time validation
    let error = validateField(name, value);

    if (name === "phone" || name === "whatsapp_no") {
      const countryCode =
        name === "phone" ? values.country_code : values.whatsapp_country_code;
      const type = name === "phone" ? "phone" : "whatsapp";
      error = await validatePhoneNumber(countryCode, value, type);
    }

    setFormError((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    if (name === "phone") {
      if (isWASame) {
        setValues((prevState) => ({
          ...prevState,
          whatsapp_no: value,
          whatsapp_country_code: prevState.country_code,
        }));

        // Synchronize WhatsApp error with phone error
        setFormError((prevErrors) => ({
          ...prevErrors,
          whatsapp_no: error
            ? error.replace("Phone number", "WhatsApp number")
            : null,
        }));
      }

      // Check if phone and WhatsApp numbers are the same
      if (
        value === values.whatsapp_no &&
        values.country_code === values.whatsapp_country_code
      ) {
        setIsWASame(true);
      } else {
        setIsWASame(false);
      }
    } else if (name === "whatsapp_no") {
      // Check if phone and WhatsApp numbers are the same
      if (
        value === values.phone &&
        values.country_code === values.whatsapp_country_code
      ) {
        setIsWASame(true);
      } else {
        setIsWASame(false);
      }
    } else if (name === "username") {
      debouncedCheckUsername(value);
    }
  };

  // const handleWAChange = (e) => {
  //   const { value, checked } = e.target;

  //   if (checked) {
  //     setValues((prevState) => ({
  //       ...prevState,
  //       whatsapp_no: prevState.phone,
  //       whatsapp_country_code: prevState.country_code,
  //     }));

  //     setAutocompleteValue(
  //       codes.find((code) => code.phone_code == values.country_code)
  //     );
  //   } else {
  //     setValues((prevState) => ({
  //       ...prevState,
  //       whatsapp_no: "",
  //       whatsapp_country_code: "",
  //     }));

  //     setAutocompleteValue(null);
  //   }
  //   // setValues((prevState) => {
  //   //   return {
  //   //     ...prevState,
  //   //     ["whatsapp_no"]: checked ? prevState.phone : "",
  //   //     ["whatsapp_country_code"]: checked ? prevState.country_code : "",
  //   //   };
  //   // });
  //   setIsWASame(checked);
  //   // if (checked) {
  //   // }
  //   // else {
  //   //   setValues((prevState) => {
  //   //     return {
  //   //       ...prevState,
  //   //       ["whatsapp_no"]: "",
  //   //       ["whatsapp_country_code"]: "",
  //   //     };
  //   //   });

  //   //   setIsWASame(false);
  //   // }
  // };
  const handleWAChange = (e) => {
    const { checked } = e.target;

    if (checked) {
      setValues((prevState) => ({
        ...prevState,
        whatsapp_no: values.phone,
        whatsapp_country_code: values.country_code,
      }));

      setWaCountryCode(countryCode);

      // Sync WhatsApp error with phone error
      setFormError((prevErrors) => ({
        ...prevErrors,
        whatsapp_no: prevErrors.phone
          ? prevErrors.phone.replace("Phone number", "WhatsApp number")
          : null,
      }));

      setIsWASame(true);
    } else {
      setValues((prevState) => ({
        ...prevState,
        whatsapp_no: "",
        whatsapp_country_code: "",
      }));
      setWaCountryCode(null);

      // Clear WhatsApp error when unchecked
      setFormError((prevErrors) => ({
        ...prevErrors,
        whatsapp_no: null,
      }));

      setIsWASame(false);
    }
  };

  const validate = async (data) => {
    let schemaObj = {
      business_name: Joi.string()
        .trim()
        .required()
        .label("Name of Business")
        .messages({
          "string.empty": "Business name is required",
        }),
      contact_person: Joi.string()
        .trim()
        .required()
        .label("Name of Contact Person")
        .messages({
          "string.empty": "Contact person name is required",
        }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email")
        .messages({
          "string.email": "Please enter a valid email address",
          "string.empty": "Email is required",
        }),
      country: Joi.string().trim().required().label("Country"),
      password: Joi.string()
        .min(8)
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]*$/
        )
        .required()
        .label("Password")
        .messages({
          "string.min": "Password must be at least 8 characters long",
          "string.pattern.base":
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*.)",
          "string.empty": "Password is required",
        }),
      country_code: Joi.string().trim().required().label("Code"),
      phone: Joi.string().trim().required().label("Phone No").messages({
        "string.pattern.base": "Please enter a valid 10-digit phone number",
        "string.empty": "Phone number is required",
      }),
      whatsapp_no: Joi.string()
        .trim()
        .required()
        .label("WhatsApp number")
        .messages({
          "string.pattern.base":
            "Please enter a valid 10-digit WhatsApp number",
          "string.empty": "WhatsApp number is required",
        }),
      whatsapp_country_code: Joi.string()
        .trim()
        .required()
        .label("Whatsapp Country Code"),
      username: Joi.string()
        .trim()
        .required()
        .label("Username")
        .messages({ "string.empty": "Username is required" }),
    };

    if (data.country == "India" || data.country == "") {
      schemaObj = {
        ...schemaObj,
        city: Joi.string().trim().required().label("City"),
        pincode: Joi.number().required().label("Pincode"),
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

    return errors ? errors : null;
  };

  const handleSelectChange = (value, fieldName) => {
    if (fieldName === "country") {
      if (value !== "India") {
        setHideCityPincode(true);
        // Clear city and pincode values when country is not India
        setValues((prevState) => ({
          ...prevState,
          [fieldName]: value,
          city: "",
          pincode: "",
        }));
        // Clear city and pincode errors
        setFormError((prevErrors) => ({
          ...prevErrors,
          city: null,
          pincode: null,
        }));
      } else {
        setHideCityPincode(false);
      }
    }

    setValues((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));

    // Validate the field after change
    const error = validateField(fieldName, value);
    setFormError((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));

    setValues((prevState) => {
      const newState = {
        ...prevState,
        [fieldName]: value,
      };

      // Check if phone and WhatsApp numbers are the same after country code change
      if (fieldName === "country_code") {
        if (
          newState.phone === newState.whatsapp_no &&
          value === newState.whatsapp_country_code
        ) {
          setIsWASame(true);
        } else {
          setIsWASame(false);
        }
      }

      return newState;
    });
  };

  const handleSelectChangeWA = async (value, fieldName) => {
    setValues((prevState) => {
      const newState = {
        ...prevState,
        [fieldName]: value,
      };

      // Check if phone and WhatsApp numbers are the same after WhatsApp country code change
      if (fieldName === "whatsapp_country_code") {
        if (
          newState.phone === newState.whatsapp_no &&
          newState.country_code === value
        ) {
          setIsWASame(true);
        } else {
          setIsWASame(false);
        }
      }

      return newState;
    });

    // Validate WhatsApp number when country code changes
    if (fieldName === "whatsapp_country_code" && values.whatsapp_no) {
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
  };

  // const handleCountryCodeChange = (e, value) => {
  //   handleSelectChange(value.phone_code?.toString(), "whatsapp_country_code");
  //   setIsWASame(false);
  //   setAutocompleteValue(value);
  // };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let joiErrors = await validate(values);
    let runtimeErrors = { ...formError };

    // Check username status
    if (values.username && usernameStatus !== "success") {
      runtimeErrors.username = "This username already exists";
    }

    // Validate country, city, and pincode
    runtimeErrors.country = validateField("country", values.country);
    if (values.country === "India") {
      runtimeErrors.city = validateField("city", values.city);
      runtimeErrors.pincode = validateField("pincode", values.pincode);
    }

    // Combine Joi and runtime errors
    let combinedErrors = { ...joiErrors, ...runtimeErrors };

    // Remove any null or undefined errors
    combinedErrors = Object.fromEntries(
      Object.entries(combinedErrors).filter(([_, v]) => v != null)
    );

    setFormError(combinedErrors);

    if (Object.keys(combinedErrors).length) {
      helper.scroll(helper.getFirstError(combinedErrors));
      return;
    }

    // If there are no errors, proceed with the API call
    const data = await http.post(base_url + "/business/signup", values);
    if (data) {
      navigate(registrationBusinessOTPURL, {
        state: { values: values, fromRegister: true },
      });

      window.scrollTo(0, 0);
    }
  };

  const debouncedCheckUsername = useCallback(
    debounce((username) => handleUsernameAvailability(username), 1000),
    []
  );

  const handleUsernameAvailability = async (username) => {
    const data = await http.post(base_url + "/business/check-username", {
      username: username,
    });
    if (data.data.available) {
      setUsernameStatus("success");
      setUsernameMsg("Valid username");
    } else {
      setUsernameStatus("failure");
      setUsernameMsg("This username already exists");
    }
  };

  useEffect(() => {
    fetchCodes();
    fetchCountires();
    fetchCities();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <LightThemeBackground />
      <section className={style.bus_sec1}>
        <div className="my_container">
          <div className={style.text_container}>
            <p className={style.head_text}>Tell Us About Your Firm/Business</p>
            {/* <h1 className={style.title}>Your Business Account Details</h1> */}
            {/* <p className={style.title}>
              Providing accurate details will help you connect effectively with
              <br style={{ display: "block" }} />
              the right clients & customers!
            </p> */}
            <p className={style.title}>
              Your future clients are searching. Make sure they find you!
            </p>
            <h2
              className={`${style.description} ${style.desc_renovation}`}
              style={{
                fontWeight: "500",
                fontStyle: "normal",
                marginTop: "1em",
              }}
            >
              Providing accurate details will help you connect effectively with
              the right clients & customers!
            </h2>
            <p className={`${style.description} ${style.select_notice}`}>
              <span
                style={{
                  fontWeight: "400",
                }}
              >
                Mandatory section for sign up
              </span>
            </p>
          </div>
          <div className={`${style.steps} ${style.rstep1}`}>
            <div className={style.brand_box}>
              <div className={style.business_details}>
                <div className={`row`}>
                  {/* //Business Name */}
                  <div className={`col-md-6 ${style.rstep01_col}`}>
                    <div className={style.field_wrapper}>
                      <FullWidthTextField
                        lightTheme
                        key="Name of Business*"
                        label="Name of Firm/Business*"
                        name="business_name"
                        value={values.business_name}
                        onChange={handleChange}
                      />
                      <div id="business_name_error">
                        {formError.business_name && (
                          <p className="error">{formError.business_name}</p>
                        )}
                      </div>

                      {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                    </div>
                  </div>

                  <div className={`col-md-6 ${style.rstep01_col}`}>
                    <div className={style.field_wrapper}>
                      <FullWidthTextField
                        lightTheme
                        key="Contact Person*"
                        label="Name of Business Contact Person*"
                        name="contact_person"
                        value={values.contact_person}
                        onChange={handleChange}
                      />
                      <p className={style.field_support_text}>
                        <i>
                          The contact person will recieve all the business
                          queries
                        </i>
                      </p>
                      <div id="contact_person_error">
                        {formError.contact_person && (
                          <p className="error">{formError.contact_person}</p>
                        )}
                      </div>

                      {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                    </div>
                  </div>

                  {/* //Phone Num */}
                  <div className={`col-md-6 ${style.rstep01_col}`}>
                    <div className={style.field_wrapper}>
                      <div className="row">
                        <div className="col-4 col-sm-4 col-md-4 ps-0">
                          <div className={style.country_code}>
                            <CountryCodeDropdown
                              lightTheme
                              // key="country_code"
                              textLabel="Code*"
                              data={codes}
                              onChange={(e, value) => {
                                handleSelectChangeWA(
                                  value.phone_code?.toString(),
                                  "country_code"
                                );
                                setCountryCode(value);
                                if (isWASame) {
                                  setWaCountryCode(value);
                                  handleSelectChangeWA(
                                    value.phone_code,
                                    "whatsapp_country_code"
                                  );
                                }
                              }}
                              value={countryCode}
                              // defaultValue={{
                              //   name: "India",
                              //   iso3: "IND",
                              //   phone_code: "91",
                              // }}
                            />
                          </div>
                        </div>
                        <div className="col-8 col-sm-8 col-md-8 pe-0">
                          <div className={style.country_code}>
                            <FullWidthTextField
                              lightTheme
                              key="phone"
                              label="Phone Number*"
                              name="phone"
                              type="number"
                              value={values.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      {/* <p className={style.field_support_text}>
                        Phone No of Business Contact person
                      </p> */}
                      <div id="phone_error">
                        <p className="error">{formError.phone}</p>
                      </div>
                      <div id="country_code_error">
                        <p className="error">{formError.country_code}</p>
                      </div>
                      {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                    </div>
                  </div>
                  <div className={`col-md-6 ${style.rstep01_col}`}>
                    <div className={style.field_wrapper}>
                      <div className="row">
                        <div className="col-4 col-sm-4 col-md-4 ps-0">
                          <div className={style.country_code}>
                            <CountryCodeDropdown
                              lightTheme
                              // key="whatsapp_country_code"
                              textLabel="Code*"
                              data={codes}
                              onChange={(e, value) => {
                                handleSelectChangeWA(
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
                              value={waCountryCode}
                              // defaultValue={{
                              //   name: "India",
                              //   iso3: "IND",
                              //   phone_code: "91",
                              // }}
                            />
                          </div>
                        </div>
                        <div className="col-8 col-sm-8 col-md-8 pe-0">
                          <div className={style.country_code}>
                            <FullWidthTextField
                              lightTheme
                              key="WhatsApp number"
                              label="WhatsApp Number*"
                              type="number"
                              name="whatsapp_no"
                              value={values.whatsapp_no}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div id="whatsapp_no_error">
                        <p className="error">{formError.whatsapp_no}</p>
                      </div>
                      <div id="whatsapp_country_code_error">
                        <p className="error">
                          {formError.whatsapp_country_code}
                        </p>
                      </div>
                      {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                    </div>
                    <div className={style.checkbox_wrapper}>
                      <label className={style.checkbox_label} htmlFor="sameas">
                        <input
                          type="checkbox"
                          className={style.check_box}
                          checked={isWASame}
                          onChange={handleWAChange}
                          id="sameas"
                        />
                        Same as phone number
                      </label>
                    </div>
                  </div>

                  <div className={`col-md-6 ${style.rstep01_col}`}>
                    <div className={style.field_wrapper}>
                      <FullWidthTextField
                        lightTheme
                        key="Email ID"
                        label="Firm/Business Email ID*"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                      />
                      <div id="email_error">
                        {formError.email && (
                          <p className="error">{formError.email}</p>
                        )}
                      </div>

                      {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                    </div>
                  </div>

                  <div className={`col-md-6  ${style.rstep01_col}`}>
                    <div className={style.field_wrapper}>
                      <AutoCompleteField
                        lightTheme
                        key="country"
                        textLabel="Country*"
                        data={countries}
                        onChange={(e, option) => {
                          handleSelectChange(option.value, "country");
                        }}
                      />
                      <div id="country_error">
                        {formError.country && (
                          <p className="error">{formError.country}</p>
                        )}
                      </div>

                      {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                    </div>
                  </div>

                  <div
                    className={`col-md-6  ${style.rstep01_col} ${
                      hideCityPincode ? style.hidden : ""
                    }`}
                  >
                    <div className={style.field_wrapper}>
                      <AutoCompleteField
                        lightTheme
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

                      {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                    </div>
                  </div>
                  <div
                    className={`col-md-6  ${style.rstep01_col} ${
                      hideCityPincode ? style.hidden : ""
                    }`}
                  >
                    <div className={style.field_wrapper}>
                      <FullWidthTextField
                        lightTheme
                        type="number"
                        name="pincode"
                        label="Pincode*"
                        value={values.pincode}
                        onChange={handleChange}
                      />
                      <div id="pincode_error">
                        {formError.pincode && (
                          <p className="error">{formError.pincode}</p>
                        )}
                      </div>

                      {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                    </div>
                  </div>
                  {/* <div className={`col-md-6 ${style.rstep01_col}`}>
                    <div className={style.field_wrapper}>
                      <FullWidthTextField
                        lightTheme
                        key="Name of POC For Business / Firm*"
                        label="Name of POC For Business / Firm*"
                      />
                      <p className={style.error}>
                        Error messsage here error messsage
                      </p>
                    </div>
                  </div> */}

                  <div className={`col-md-6  ${style.rstep01_col}`}>
                    <div className={style.field_wrapper}>
                      <div className={style.input_wrapper}>
                        <FullWidthTextField
                          lightTheme
                          name="username"
                          type="text"
                          value={values.username}
                          label="Create Username*"
                          onChange={handleChange}
                        />
                        <img
                          className={style.val_icon}
                          src={errorFailed}
                          alt="failed"
                          style={{
                            display:
                              usernameStatus === "failure" ? "block" : "none",
                          }}
                        />
                        <img
                          className={style.val_icon}
                          src={errorSuccess}
                          alt="success"
                          style={{
                            display:
                              usernameStatus === "success" ? "block" : "none",
                          }}
                        />
                      </div>
                      <p
                        className={`${
                          usernameStatus === "success"
                            ? style.success_text
                            : style.error_text
                        }`}
                      >
                        {usernameMsg}
                      </p>
                      <div id="username_error">
                        {formError.username && !usernameStatus && (
                          <p className="error">{formError.username}</p>
                        )}
                      </div>

                      {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                    </div>
                  </div>
                  <div className={`col-md-6  ${style.rstep01_col}`}>
                    <div className={style.field_wrapper}>
                      <FullWidthTextField
                        lightTheme
                        type="password"
                        label="Create Password*"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                      />
                      {!formError.password && (
                        <p className={style.field_support_text}>
                          <i>Your password should be at least 8 characters</i>
                        </p>
                      )}
                      <div id="password_error">
                        {formError.password && (
                          <p className="error">{formError.password}</p>
                        )}
                      </div>

                      {/* <p className={`${style.error_text}`}>
                        Your username should be at least 4 characters
                      </p> */}
                      {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                    </div>
                  </div>
                </div>

                <div className={style.next_logout}>
                  <div className={style.cta_wrapper}>
                    <div className={style.next_button} onClick={handleSubmit}>
                      <div className={style.text}>Send OTP</div>
                      <img
                        src={rightarrowwhite}
                        alt="icon"
                        className={style.icon}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                <p className={style.terms_text}>
                  By continuing, you agree to the terms of{" "}
                  <Link
                    to={privacypolicyURL}
                    className={style.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Archinza Policy.
                  </Link>
                </p>
                <p className={style.terms_text}>
                  Already have an account?{" "}
                  <Link
                    to={loginURL}
                    className={style.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#014fe0",
                      textDecorationColor: "#014fe0",
                    }}
                  >
                    <span
                      style={{
                        color: "#014fe0",
                        textDecorationColor: "#014fe0",
                      }}
                    >
                      Log in here.
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterV2 whatsappBotIcon={false} lightTheme />
    </>
  );
};

export default BusinessAccountDetails;
