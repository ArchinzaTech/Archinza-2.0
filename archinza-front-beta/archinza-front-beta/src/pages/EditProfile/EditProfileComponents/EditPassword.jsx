import React, { useState } from "react";
import { editiconorange } from "../../../images";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import Joi from "joi";
import http from "../../../helpers/http";
import { useAuth } from "../../../context/Auth/AuthState";
import config from "../../../config/config";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";
const EditPassword = ({ lightTheme }) => {
  // =============== VARIABLE & STATES  ===========================

  const [isEditClicked, setIsEditClicked] = useState(false);
  const [values, setValues] = useState({
    password: "",
    current_password: "",
    confirm_password: "",
  });
  const [formError, setFormError] = useState({});

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

  const validate = async (data) => {
    let schemaObj = {
      current_password: Joi.string().required().label("Current Password"),
      password: Joi.string().min(8).required().label("New Password"),
      confirm_password: Joi.any()
        .required()
        .equal(Joi.ref("password"))

        .label("Confirm Password")
        .messages({ "any.only": "password does not match" }),
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

    const data = await http.put(
      base_url + "/personal/edit-password/" + auth?.user?._id,
      values
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
        setValues({});
        setIsEditClicked(false);
      }
    }
  };
  // =============== HTML RENDERING  ===========================
  // =============== DATA FETCHING  ===========================
  // =============== SIDE EFFECTS  ===========================

  return (
    <>
      <div className="field_wrapper padding_right">
        <TextFieldWithIcon
          type="password"
          label="Password*"
          icon={editiconorange}
          disabled={isEditClicked}
          defaultValue="********"
          onClick={() => {
            setIsEditClicked((prevCheck) => !prevCheck);
          }}
          lightTheme={lightTheme}
        />
        {isEditClicked && (
          <>
            <form onSubmit={handleSubmit}>
              <div className="reset_fields">
                <FullWidthTextField
                  label="Enter current password*"
                  type="password"
                  name="current_password"
                  value={values.current_password}
                  onChange={handleChange}
                  lightTheme={lightTheme}
                />
                <p className="error">{formError.current_password}</p>
              </div>
              <div className="reset_fields">
                <FullWidthTextField
                  label="Enter new password*"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  lightTheme={lightTheme}
                />
                <p className="pass_notice">
                  your password should be at least 8 characters
                </p>
                <p className="error">{formError.password}</p>
              </div>
              <div className="reset_fields">
                <FullWidthTextField
                  label="Confirm new password*"
                  type="password"
                  name="confirm_password"
                  value={values.confirm_password}
                  onChange={handleChange}
                  lightTheme={lightTheme}
                />
              </div>
              <p className="error">{formError.confirm_password}</p>

              <div className="mobile_center">
                <div className="btn_wrapper">
                  <button className="submit_button">Submit</button>
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
      </div>
    </>
  );
};

export default EditPassword;
