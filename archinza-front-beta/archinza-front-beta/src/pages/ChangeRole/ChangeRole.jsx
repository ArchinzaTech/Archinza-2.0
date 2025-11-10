import React, { useEffect, useState } from "react";
import "./changerole.scss";
import { rightarrowwhite } from "../../images";
import RadioButton from "../../components/RadioButton/RadioButton";
import FooterV2 from "../../components/FooterV2/FooterV2";
import BlinkingDots from "../../Animations/BlinkingDots/BlinkingDots";
import config from "../../config/config";
import { Link, useNavigate } from "react-router-dom";

import Joi from "joi";
import http from "../../helpers/http";
import helper from "../../helpers/helper";
import {
  dashboardURL,
  regiserOTPURL,
} from "../../components/helpers/constant-words";
import { useAuth } from "../../context/Auth/AuthState";
const ChangeRole = () => {
  // =============== VARIABLE & STATES  ===========================

  const [values, setValues] = useState({
    user_type: "",
  });
  const [formError, setFormError] = useState({});

  const navigate = useNavigate();
  const auth = useAuth();

  const joiOptions = config.joiOptions;

  const base_url = config.api_url; //without trailing slash

  const allowedRoles = {
    ST: ["BO", "FL", "TM"],
    TM: ["ST", "FL", "BO"],
    BO: ["ST", "FL", "TM"],
    FL: ["ST", "BO", "TM"],
    DE: ["ST", "BO", "TM", "FL"],
  };
  const roles = {
    ST: "Student",
    TM: "Working Professional",
    BO: "Business/Firm Owner",
    FL: "Freelancer/Artist",
    DE: "Design Enthusiast",
  };
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
      user_type: Joi.string().trim().required().label("Role"),
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
  const shouldShowRole = (roleType) => {
    return (
      auth?.user?.user_type === "DE" ||
      allowedRoles[auth?.user?.user_type]?.includes(roleType)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = await validate(values);

    setFormError(errors);
    if (Object.keys(errors).length) {
      return;
    }

    const data = await http.post(base_url + "/personal/change-role", {
      ...values,
      user_id: auth?.user?._id,
    });

    if (data) {
      localStorage.setItem(config.jwt_auth_key, data.data.token);
      auth.updateUser({ ...data.data.updatedUser, auth_type: "personal" });
      navigate(dashboardURL, {
        state: {
          isRoleUpdated: true,
          updatedRole: values.user_type,
          data: data.data.updatedUser,
          token: data.data.token,
        },
      });

      // window.scrollTo(0, 0);
      // redirect
      // setValues({ email: "" });
      // setisMsgVisible(true);
    }
  };
  // =============== HTML RENDERING  ===========================
  // =============== DATA FETCHING  ===========================
  // =============== SIDE EFFECTS  ===========================

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BlinkingDots />
      <section className="change_sec1"></section>
      <section className="change_sec2">
        <form onSubmit={handleSubmit}>
          <div className="my_container">
            <div className="text-container">
              <h1 className="title">
                Your current role in the Design & Build Industry is
              </h1>{" "}
              <p className="desc">{roles[auth?.user?.user_type]}</p>
              <h2 className="sub_heading">
             Tell us what you’re up to now, if your role in the industry has changed.

              </h2>
              {/* <p className="choose_text" style={{ marginBottom: "2em" }}>
               Tell us what you’re up to now, if your role in the industry has changed.
              </p> */}
              <p className="choose_text">Choose one</p>
              <p className="error top_error">{formError.user_type}</p>
            </div>
            <ul className="radio_container">
              {shouldShowRole("BO") && (
                <RadioButton
                  label="Business/Firm Owner"
                  labelId="Business/Firm Owner"
                  isPro
                  name="user_type"
                  value="BO"
                  checked={values.user_type === "BO"}
                  onChange={handleChange}
                />
              )}
              {shouldShowRole("FL") && (
                <RadioButton
                  label="Freelancer/Artist"
                  labelId="Freelancer/Artist"
                  isPro
                  name="user_type"
                  value="FL"
                  checked={values.user_type === "FL"}
                  onChange={handleChange}
                />
              )}
              {shouldShowRole("TM") && (
                <RadioButton
                  label="Working Professional"
                  labelId="Working Professional"
                  isPro
                  extraSpace={true}
                  name="user_type"
                  value="TM"
                  checked={values.user_type === "TM"}
                  onChange={handleChange}
                />
              )}
              {shouldShowRole("ST") && (
                <RadioButton
                  label="Student"
                  labelId="Student"
                  isPro
                  extraSpace={true}
                  name="user_type"
                  value="ST"
                  checked={values.user_type === "ST"}
                  onChange={handleChange}
                />
              )}

              {/* <RadioButton
                label="Design Enthusiast"
                labelId="Design Enthusiast"
                extraSpace={true}
                name="user_type"
                value="DE"
                checked={values.user_type === "DE"}
                onChange={handleChange}
              /> */}
            </ul>
            <div className="next_logout">
              <div className="cta_wrapper">
                <button className="next_button">
                  <div className="text">Change My Role</div>
                  <img
                    src={rightarrowwhite}
                    alt="icon"
                    className="icon"
                    loading="lazy"
                  />
                </button>
                <div
                  className="back_button"
                  onClick={() => navigate(dashboardURL)}
                >
                  Back
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
      <FooterV2 />
    </>
  );
};

export default ChangeRole;
