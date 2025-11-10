import React, { useState } from "react";
import { editiconorange, rightarrowwhite } from "../../../images";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import OtpInput from "react-otp-input";
import CountryCodeDropdown from "../../../components/CountryCodeDropdown/CountryCodeDropdown";
import { useWindowSize } from "react-use";

import Joi from "joi";
import http from "../../../helpers/http";
import { useAuth } from "../../../context/Auth/AuthState";
import config from "../../../config/config";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";

const EditWhatsapp = ({ lightTheme }) => {
  // =============== VARIABLE & STATES  ===========================
  const { width } = useWindowSize();
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [formError, setFormError] = useState({});
  const [otpVal, setOtpVal] = useState("");
  const [isWASame, setIsWASame] = useState(false);
  const [codes, setCodes] = useState([]);
  const [waCountryCode, setWaCountryCode] = useState({
    name: "India",
    iso3: "IND",
    phone_code: "91",
  });
  const [values, setValues] = useState({
    whatsapp_no: "",
    whatsapp_country_code: "91",
  });
  const [visibility, setVisibility] = useState({
    form: true,
    otp: false,
  });

  const auth = useAuth();
  const joiOptions = config.joiOptions;
  const base_url = config.api_url; //without trailing slash

  // =============== FUNCTIONS  ===========================

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

  const handleWAChange = (e) => {
    const { checked } = e.target;

    if (checked) {
      setValues((prevState) => {
        return {
          ...prevState,
          whatsapp_no: auth?.user?.phone || "",
          whatsapp_country_code: auth?.user?.country_code || "91",
        };
      });

      setWaCountryCode({
        name: "India",
        iso3: "IND",
        phone_code: auth?.user?.country_code || "91",
      });

      setIsWASame(true);
    } else {
      setValues((prevState) => {
        return {
          ...prevState,
          whatsapp_no: "",
          whatsapp_country_code: "91",
        };
      });
      setWaCountryCode({
        name: "India",
        iso3: "IND",
        phone_code: "91",
      });

      setIsWASame(false);
    }
  };

  const handleotpChange = (otp) => {
    setOtpVal(otp);
  };

  const validate = async (data) => {
    let schemaObj = {
      whatsapp_no: Joi.string().trim().required().label("Whatsapp Number"),
      whatsapp_country_code: Joi.string().trim().required().label("Code"),
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = await validate(values);

    setFormError(errors);
    if (Object.keys(errors).length) {
      return;
    }

    const data = await http.post(
      base_url + "/personal/edit-whatsapp/" + auth?.user?._id,
      values
    );

    if (data) {
      setVisibility({
        form: false,
        otp: true,
      });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    let errors = await validate(values);

    setFormError(errors);
    if (Object.keys(errors).length) {
      return;
    }

    const data = await http.post(
      base_url + "/personal/edit-whatsapp-verify/" + auth?.user?._id,
      { ...values, otp: otpVal }
    );

    if (data) {
      const updatedUserData = await http.get(
        base_url + "/personal/edit-profile/" + auth?.user?._id
      );
      if (updatedUserData) {
        auth.refresh(updatedUserData?.data?.data);
        localStorage.setItem(config.jwt_auth_key, updatedUserData?.data?.token);
        setVisibility({
          form: false,
          otp: false,
        });
        setIsEditClicked(false);
        toast(
          <ToastMsg message="Your detail is updated" />,
          config.success_toast_config
        );
      }
    }
  };

  const handlresendotp = async (e) => {
    const { data } = await http.post(
      base_url + "/personal/edit-whatsapp/" + auth?.user?._id,
      values
    );

    if (data) {
      setOtpVal("");
      toast(<ToastMsg message="OTP reshared" />, config.success_toast_config);
    }
  };

  // =============== DATA FETCHING  ===========================
  const fetchCodes = async () => {
    const { data } = await http.get(base_url + "/general/countries/codes");

    if (data) {
      setCodes(data);
    }
  };

  // =============== SIDE EFFECTS  ===========================
  React.useEffect(() => {
    fetchCodes();
  }, []);

  return (
    <>
      <div className="field_wrapper padding_left">
        <div className="row">
          <div className="col-4 col-sm-4 col-md-4 ps-0">
            <div className="field_wrapper_1">
              <CountryCodeDropdown
                textLabel="Code*"
                readOnly
                data={codes}
                value={{
                  name: "India",
                  iso3: "IND",
                  phone_code: auth?.user?.whatsapp_country_code || "91",
                }}
                lightTheme={lightTheme}
              />
            </div>
          </div>
          <div
            className={`col-8 col-sm-8 col-md-8 ${
              width > 992 ? "pe-0" : "p-0"
            }`}
          >
            <div className="field_wrapper_1">
              <TextFieldWithIcon
                label="WhatsApp number*"
                icon={editiconorange}
                disabled={isEditClicked}
                onClick={() => {
                  setIsEditClicked((prevCheck) => !prevCheck);
                }}
                value={auth?.user?.whatsapp_no || ""}
                InputProps={{
                  readOnly: true,
                }}
                lightTheme={lightTheme}
              />
            </div>
          </div>
        </div>

        {isEditClicked && visibility?.form && (
          <>
            <form onSubmit={handleSubmit}>
              <div className="field_wrapper">
                <div className="row">
                  <div className="col-4 col-sm-4 col-md-4 ps-0">
                    <div className="field_wrapper_1">
                      <CountryCodeDropdown
                        textLabel="Code*"
                        data={codes}
                        onChange={(e, value) => {
                          handleSelectChange(
                            value.phone_code,
                            "whatsapp_country_code"
                          );
                          setWaCountryCode(value);
                        }}
                        value={waCountryCode}
                        lightTheme={lightTheme}
                      />
                    </div>
                  </div>
                  <div
                    className={`col-8 col-sm-8 col-md-8 ${
                      width > 992 ? "pe-0" : "p-0"
                    }`}
                  >
                    <div className="field_wrapper_1">
                      <TextFieldWithIcon
                        label="WhatsApp number*"
                        // icon={editiconorange}
                        name="whatsapp_no"
                        value={values.whatsapp_no}
                        onChange={handleChange}
                        lightTheme={lightTheme}
                      />
                    </div>
                  </div>
                </div>
                <p className="error">{formError.whatsapp_no}</p>
              </div>

              <div className="checkbox_wrapper">
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

              <p className="pass_notice">
                Please enter your new 10 digit WhatsApp number.
                <br />
                An OTP verification will be sent to your new WhatsApp number.
              </p>

              <div className="mobile_center">
                <div className="btn_wrapper">
                  <button className="form_btn">
                    Verify with OTP
                    <img
                      src={rightarrowwhite}
                      alt="icon"
                      className="icon"
                      loading="lazy"
                    />
                  </button>
                  <button
                    type="button"
                    className="back_button"
                    onClick={() => setIsEditClicked(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
        {isEditClicked && visibility?.otp && (
          <>
            <div className="otp_wrapper">
              <div className="otp_title">Enter OTP</div>
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
                  lightTheme={lightTheme}
                />
              </div>
              <div className="mobile_center">
                <div className="btn_wrapper">
                  <button className="form_btn" onClick={handleOtpSubmit}>
                    Verify
                    <img
                      src={rightarrowwhite}
                      alt="icon"
                      className="icon"
                      loading="lazy"
                    />
                  </button>
                  <button className="back_button" onClick={handlresendotp}>
                    Resend OTP
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EditWhatsapp;
