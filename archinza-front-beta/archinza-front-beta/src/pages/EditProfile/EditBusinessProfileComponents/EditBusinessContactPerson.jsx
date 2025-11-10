import React, { useState } from "react";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import { editiconorange } from "../../../images";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import Joi from "joi";
import http from "../../../helpers/http";
import { useAuth } from "../../../context/Auth/AuthState";
import config from "../../../config/config";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";

const EditBusinessContactPerson = ({ lightTheme }) => {
  // =============== VARIABLE & STATES  ===========================

  const [isEditClicked, setIsEditClicked] = useState(false);
  const [values, setValues] = useState({
    name: "",
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
      name: Joi.string().trim().required().label("Name"),
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
      base_url + "/personal/edit-profile/" + auth?.user?._id,
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
      <div
        className="field_wrapper padding_right disabled_field"
        onClick={() => {
          setIsEditClicked((prevCheck) => !prevCheck);
        }}
      >
        <TextFieldWithIcon
          icon={editiconorange}
          label="Edit Business Contact Person"
          disabled={isEditClicked}
          value={auth?.user?.name || ""}
          lightTheme={lightTheme}
          // value={"hello"}
          // InputProps={{
          //   readOnly: true,
          // }}
        />
      </div>
      {isEditClicked && (
        <>
          <form onSubmit={handleSubmit}>
            <div className="field_wrapper padding_right">
              <FullWidthTextField
                label="Your New Business Contact Person Name?*"
                name="name"
                value={values.name}
                onChange={handleChange}
                lightTheme={lightTheme}
              />
              {formError.name && <p className="error">{formError.name}</p>}
            </div>
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
    </>
  );
};

export default EditBusinessContactPerson;
