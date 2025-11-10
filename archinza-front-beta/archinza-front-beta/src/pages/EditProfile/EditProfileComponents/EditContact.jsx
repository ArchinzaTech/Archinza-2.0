import React, { useEffect, useState } from "react";
import { editiconorange, rightarrowwhite } from "../../../images";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import OtpInput from "react-otp-input";

import { useWindowSize } from "react-use";
import CountryCodeDropdown from "../../../components/CountryCodeDropdown/CountryCodeDropdown";

import Joi from "joi";
import http from "../../../helpers/http";
import { useAuth } from "../../../context/Auth/AuthState";
import config from "../../../config/config";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";
import _find from "lodash/find";
// import { parsePhoneNumber } from "libphonenumber-js";

const EditContact = ({ user, lightTheme }) => {
  // =============== VARIABLE & STATES  ===========================

  const [isEditClicked, setIsEditClicked] = useState(false);
  const [formError, setFormError] = useState({});
  const [otpVal, setOtpVal] = useState("");
  const [codes, setCodes] = useState([]);
  const [userCode, setUserCode] = useState({
    name: "India",
    iso3: "IND",
    phone_code: "91",
  });

  const [values, setValues] = useState({
    phone: "",
    country_code: "91",
  });
  const [visibility, setVisibility] = useState({
    form: true,
    otp: false,
  });

  const auth = useAuth();
  const { width } = useWindowSize();

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

  const handleotpChange = (otp) => {
    setOtpVal(otp);
  };

  const handleSelectChange = (value, fieldName) => {
    setValues((prevState) => {
      return {
        ...prevState,
        [fieldName]: value,
      };
    });
  };

  const validate = async (data) => {
    let schemaObj = {
      country_code: Joi.string().trim().required().label("Code"),
      phone: Joi.number().required().label("Mobile No"),
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

    // validating phone number
    // if (data.phone) {

    //   try {
    //     const phoneNumber = parsePhoneNumber(
    //       `+${values.country_code}${values.phone}`
    //     );

    //     if (phoneNumber.isValid() === false) {
    //       errors["phone"] = `Phone number must be valid `;
    //     }
    //   } catch (error) {

    //   }

    // }

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
      base_url + "/personal/edit-phone/" + auth?.user?._id,
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
      base_url + "/personal/edit-phone-verify/" + auth?.user?._id,
      { ...values, otp: otpVal }
    );

    if (data) {
      const updatedUserData = await http.get(
        base_url + "/personal/edit-profile/" + auth?.user?._id
      );
      if (updatedUserData) {
        auth.refresh(updatedUserData?.data?.data);
        localStorage.setItem(config.jwt_auth_key, updatedUserData?.data?.token);
        toast(
          <ToastMsg message="Your detail is updated" />,
          config.success_toast_config
        );
        setVisibility({
          form: false,
          otp: false,
        });
        setIsEditClicked(false);
      }
    }
  };

  const handlresendotp = async (e) => {
    const { data } = await http.post(
      base_url + "/personal/edit-phone/" + auth?.user?._id,
      values
    );

    if (data) {
      setOtpVal("");
      toast(<ToastMsg message="OTP reshared" />, config.success_toast_config);
    }
  };
  // =============== HTML RENDERING  ===========================
  // =============== DATA FETCHING  ===========================

  const fetchCodes = async () => {
    const { data } = await http.get(base_url + "/general/countries/codes");

    if (data) {
      setCodes(data);
    }
  };
  // =============== SIDE EFFECTS  ===========================

  useEffect(() => {
    fetchCodes();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (auth && codes.length) {
      const filteredCode = _find(codes, {
        phone_code: auth?.user?.country_code,
      });
      setUserCode(filteredCode);
    }
  }, [auth, codes]);

  return (
    <>
      <div className="field_wrapper padding_left">
        <div className="row">
          <div
            className={`col-12 col-sm-4 col-md-4 ps-0 ${
              width <= 575 && "pe-0"
            }`}
          >
            <div className="field_wrapper_1">
              <CountryCodeDropdown
                textLabel="Code*"
                readOnly
                data={codes}
                value={userCode}
                lightTheme={lightTheme}
              />
            </div>
          </div>
          <div
            className={`col-12 col-sm-8 col-md-8 ${
              width > 992 ? "pe-0" : "ps-0"
            } ${width <= 575 && "pe-0 mobile_stack"}`}
          >
            <div
              className="field_wrapper_1"
              onClick={() => {
                setIsEditClicked((prevCheck) => !prevCheck);
              }}
            >
              <TextFieldWithIcon
                label="Phone*"
                icon={editiconorange}
                disabled={isEditClicked}
                value={auth?.user?.phone || ""}
                InputProps={{
                  readOnly: true,
                }}
                lightTheme={lightTheme}
              />
            </div>
          </div>
        </div>
        {/* {!verify && !otpBox && (
          <div className="checkbox_wrapper">
            <label className="checkbox_label">
              <input type="checkbox" className="check_box" />
              My Whatsapp number is my contact number
            </label>
          </div>
        )} */}

        {isEditClicked && visibility?.form && (
          <>
            <form onSubmit={handleSubmit}>
              <div className="field_wrapper">
                <div className="row">
                  <div
                    className={`col-12 col-sm-4 col-md-4 ps-0 ${
                      width <= 575 && "pe-0"
                    }`}
                  >
                    <div className="field_wrapper_1">
                      <CountryCodeDropdown
                        textLabel="Code*"
                        data={codes}
                        onChange={(e, value) => {
                          handleSelectChange(value.phone_code, "country_code");
                        }}
                        defaultValue={{
                          name: "India",
                          iso3: "IND",
                          phone_code: "91",
                        }}
                        lightTheme={lightTheme}
                      />
                    </div>
                  </div>
                  <div
                    className={`col-12 col-sm-8 col-md-8 ${
                      width > 992 ? "pe-0" : "ps-0"
                    } ${width <= 575 && "pe-0 mobile_stack"}`}
                  >
                    <div className="field_wrapper_1">
                      <TextFieldWithIcon
                        label="Phone*"
                        // icon={editiconorange}
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        lightTheme={lightTheme}
                      />
                    </div>
                  </div>
                </div>
                {formError.country_code ||
                  (formError.phone && (
                    <p className="error">
                      {formError.country_code || formError.phone}
                    </p>
                  ))}
              </div>
              <p className="pass_notice">
                Please enter your new 10 digit mobile number.
                <br />
                An OTP verification will be sent to your new number.
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

export default EditContact;
