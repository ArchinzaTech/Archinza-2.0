import React, { useEffect, useState } from "react";
import "./accountcategory.scss";
import RadioButton from "../../../components/RadioButton/RadioButton";
import { infoIcon, rightarrowwhite } from "../../../images";
import FooterV2 from "../../../components/FooterV2/FooterV2";
import BlinkingDots from "../../../Animations/BlinkingDots/BlinkingDots";
import { Link, useNavigate } from "react-router-dom";
import FormFiveModal from "../../../components/FormFiveModal/FormFiveModal";

import config from "../../../config/config";

import Joi from "joi";
import {
  privacypolicyURL,
  registrationBusinessURL,
  registrationFormURL,
} from "../../../components/helpers/constant-words";
import helper from "../../../helpers/helper";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";
const defineArr = [
  "Personal Account : Ideal for Individuals who want to discover people and products for their projects",
  "Business Account:  Ideal for Individuals/ Business/  Firm Owners who want to reach out to a wider audience, and be found matchmade by AI",
  "Personal + Business Account : Create two separate accounts for yourself and business starting with a personal account first.",
];

const AccountCategory = () => {
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [formError, setFormError] = useState({});
  // const [loading, setLoading] = useState(false);

  const joiOptions = config.joiOptions;

  const defineList = defineArr.map((data, i) => (
    <li className="list_item" key={`define-${Math.random(i)}`}>
      {data}
    </li>
  ));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      account_type: Joi.string().required().messages({
        "any.required": `Please choose an option to proceed`,
      }),
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
      helper.scroll(helper.getFirstError(errors));
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

    if (
      values?.account_type === "personal" ||
      values?.account_type === "both"
    ) {
      // if (personalAccounts >= 1) {
      //   toast(
      //     <ToastMsg
      //       message={`Only 1 personal account is allowed.`}
      //       danger={true}
      //     />,
      //     config.error_toast_config
      //   );
      //   return;
      // }
      // navigate(registrationFormURL);

      // Commented Out The Above Logic Because We Added an External form For Business On Boarding

      if (values?.account_type === "personal") {
        if (personalAccounts >= 1) {
          toast(
            <ToastMsg
              message={`Only 1 personal account is allowed.`}
              danger={true}
            />,
            config.error_toast_config
          );
          return;
        }
        navigate(registrationFormURL);
      } else {
        window.open("https://forms.gle/K7fVy9WcNcggkvnV6", "_blank");
      }
    } else {
      // if (businessAccounts >= 4) {
      //   toast(
      //     <ToastMsg
      //       message={`Only 4 business accounts are allowed.`}
      //       danger={true}
      //     />,
      //     config.error_toast_config
      //   );
      //   return;
      // }
      // navigate(registrationBusinessURL);

      // navigate("https://forms.gle/K7fVy9WcNcggkvnV6");

      // Commented Out The Above Logic Because We Added an External form For Business On Boarding

      window.open("https://forms.gle/K7fVy9WcNcggkvnV6", "_blank");
    }
  };

  return (
    <>
      <BlinkingDots />
      <main className="ac_main">
        <section className="ac_sec1">
          <div className="my_container">
            <form onSubmit={handleSubmit}>
              <div className="text_container">
                <p className="head_text">Get Early Access</p>
                {/* <h1 className="heading">About Yourself</h1> */}
                <h2 className="sub_heading">
                  What would you like to sign up for?
                </h2>
                <p className="choose_text">
                  Choose one
                  <span className="entity" onClick={() => setModalShow(true)}>
                    {/* &#9432;  */}
                    {/* <div className="icon info_icon_v2"> */}
                    <img
                      src={infoIcon}
                      alt="Info"
                      className="info_icon_v2_Acc_category"
                    />
                    {/* </div> */}
                  </span>
                </p>
                <div id="account_type_error">
                  {formError.account_type && (
                    <p className="error top_error">{formError.account_type}</p>
                  )}
                </div>
              </div>

              <div className="cateogories_wrapper">
                <div className="cateogory_box">
                  <ul className="radio_container">
                    <RadioButton
                      label="Personal Account"
                      labelId="personal-account"
                      name="account_type"
                      value="personal"
                      checked={values.account_type === "personal"}
                      onChange={handleChange}
                    />
                  </ul>
                  <p className="notice_message">
                    I want to Search for people & products via Archinza Design
                    Assistant
                  </p>
                </div>
                <div className="cateogory_box">
                  <ul className="radio_container">
                    <RadioButton
                      label="Business Account"
                      labelId="business-account"
                      name="account_type"
                      value="brand"
                      checked={values.account_type === "brand"}
                      onChange={handleChange}
                    />
                  </ul>
                  <p className="notice_message">
                    I want to Reach new clients, and be suggested by the
                    Archinza Design Assistant
                  </p>
                </div>
                <div className="cateogory_box">
                  <ul className="radio_container">
                    <RadioButton
                      label="Personal + Business Account"
                      labelId="personal-business-account"
                      name="account_type"
                      value="both"
                      checked={values.account_type === "both"}
                      onChange={handleChange}
                    />
                  </ul>
                  <p className="notice_message">
                    Start with personal onboarding!
                  </p>
                </div>
              </div>

              <div className="notice">
                By continuing, you agree to the terms of{" "}
                <Link
                  to={privacypolicyURL}
                  className="orange_text"
                  target="_blank"
                  rel="noreferrer"
                >
                  Archinza Policy
                </Link>
                .
              </div>
              <div className="btn_wrapper">
                <button className="form_btn">
                  Proceed
                  <img
                    src={rightarrowwhite}
                    alt="icon"
                    className="icon"
                    loading="lazy"
                  />
                </button>
              </div>
            </form>
          </div>
        </section>
        <section className="account_modal">
          <FormFiveModal
            list={defineList}
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        </section>
        <FooterV2 whatsappBotIcon={false} />
      </main>
    </>
  );
};

export default AccountCategory;
