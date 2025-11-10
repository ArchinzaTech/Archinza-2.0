import React, { useState } from "react";
import { editiconorange } from "../../../images";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import { useAuth } from "../../../context/Auth/AuthState";
import config from "../../../config/config";
import Joi from "joi";
import http from "../../../helpers/http";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";

const EditPincode = () => {
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [values, setValues] = useState({
    pincode: "",
  });
  const [formError, setFormError] = useState({});

  const auth = useAuth();
  const joiOptions = config.joiOptions;
  const base_url = config.api_url;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers
    const numericValue = value.replace(/\D/g, "");
    setValues((prevState) => ({
      ...prevState,
      [name]: numericValue,
    }));
  };

  const validate = async (data) => {
    let schemaObj = {
      pincode: Joi.string().length(6).required().label("Pincode"),
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

  return (
    <>
      {!isEditClicked ? (
        <div className="field_wrapper">
          <div
            className="field_wrapper_1"
            onClick={() => setIsEditClicked(true)}
          >
            <TextFieldWithIcon
              label="Pincode*"
              value={auth?.user?.pincode || ""}
              icon={editiconorange}
              readOnly
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="field_wrapper">
            <div className="field_wrapper_1">
              <FullWidthTextField
                type="tel"
                label="Pincode*"
                name="pincode"
                value={values.pincode}
                onChange={handleChange}
                inputProps={{ maxLength: 6 }}
              />
              {formError.pincode && (
                <p className="error">{formError.pincode}</p>
              )}
            </div>
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
      )}
    </>
  );
};

export default EditPincode;
