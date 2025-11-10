import React, { useState } from "react";
import { editiconorange, rightarrowwhite } from "../../../images";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import OtpInput from "react-otp-input";

import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import Joi from "joi";
import http from "../../../helpers/http";
import { useAuth } from "../../../context/Auth/AuthState";
import config from "../../../config/config";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";

const EditOwnerEmailId = ({ lightTheme }) => {
  // =============== VARIABLE & STATES  ===========================

  const [isEditClicked, setIsEditClicked] = useState(false);
  const [formError, setFormError] = useState({});
  const [otpVal, setOtpVal] = useState("");
  const [values, setValues] = useState({
    email: "",
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

  const handleotpChange = (otp) => {
    setOtpVal(otp);
  };

  const validate = async (data) => {
    let schemaObj = {
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email"),
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
      base_url + "/personal/edit-email/" + auth?.user?._id,
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
      base_url + "/personal/edit-email-verify/" + auth?.user?._id,
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
      base_url + "/personal/edit-email/" + auth?.user?._id,
      values
    );

    if (data) {
      setOtpVal("");
      toast(<ToastMsg message="OTP reshared" />, config.success_toast_config);
    }
  };
  // =============== HTML RENDERING  ===========================
  // =============== DATA FETCHING  ===========================
  // =============== SIDE EFFECTS  ===========================

  return (
    <>
      <div className="field_wrapper padding_left">
        <TextFieldWithIcon
          label="Edit Owner/Founder Email Id*"
          icon={editiconorange}
          disabled={isEditClicked}
          onClick={() => {
            setIsEditClicked((prevCheck) => !prevCheck);
          }}
          value={auth?.user?.email || ""}
          InputProps={{
            readOnly: true,
          }}
          lightTheme={lightTheme}
        />
        {isEditClicked && visibility?.form && (
          <>
            <form onSubmit={handleSubmit}>
              <div className="field_wrapper">
                <FullWidthTextField
                  label="New Owner/Founder Email Id*"
                  icon={editiconorange}
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  lightTheme={lightTheme}
                />
              </div>
              <p className="error">{formError.email}</p>

              <p className="pass_notice">
                Please enter your new Email ID. <br />
                An OTP verification will be sent to your new email.
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

export default EditOwnerEmailId;
