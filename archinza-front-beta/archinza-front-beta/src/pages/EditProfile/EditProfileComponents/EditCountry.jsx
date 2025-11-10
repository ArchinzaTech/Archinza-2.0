import React, { useEffect, useState } from "react";
import { editiconorange } from "../../../images";
import AutoCompleteField from "../../../components/AutoCompleteField/AutoCompleteField";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import { useAuth } from "../../../context/Auth/AuthState";
import config from "../../../config/config";
import Joi from "joi";
import http from "../../../helpers/http";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";

const EditCountry = ({ lightTheme }) => {
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [values, setValues] = useState({
    country: "",
    city: "",
    pincode: "",
  });
  const [formError, setFormError] = useState({});

  const auth = useAuth();
  const joiOptions = config.joiOptions;
  const base_url = config.api_url;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers for pincode
    if (name === "pincode") {
      const numericValue = value.replace(/\D/g, "");
      setValues((prevState) => ({
        ...prevState,
        [name]: numericValue,
      }));
    } else {
      setValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (value, fieldName) => {
    setValues((prevState) => {
      const newState = {
        ...prevState,
        [fieldName]: value,
      };

      // Reset city and pincode when country changes
      if (fieldName === "country" && value !== "India") {
        newState.city = "";
        newState.pincode = "";
      }

      return newState;
    });

    // Clear form errors when changing values
    setFormError((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const validate = async (data) => {
    let schemaObj = {
      country: Joi.string().trim().required().label("Country"),
    };

    // Add validation for city and pincode if country is India
    if (data.country === "India") {
      schemaObj.city = Joi.string().trim().required().label("City").messages({
        "string.empty": "City is required",
      });
      schemaObj.pincode = Joi.string()
        .length(6)
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

    return errors ? errors : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = await validate(values);
    setFormError(errors || {});
    if (errors && Object.keys(errors).length) {
      return;
    }

    // Ensure city and pincode are empty if country is not India
    const submitValues = {
      ...values,
      city: values.country !== "India" ? "" : values.city,
      pincode: values.country !== "India" ? "" : values.pincode,
    };

    if (values.city && values.pincode) {
      const response = await http.get(
        base_url +
          `/personal/check-pincode/${values.pincode}?city=${values.city}`
      );

      if (!response?.data) {
        setFormError({ pincode: "Invalid pincode for the selected city" });
        return;
      }
    }
    const data = await http.put(
      base_url + "/personal/edit-profile/" + auth?.user?._id,
      submitValues
    );

    if (data) {
      const updatedUserData = await http.get(
        base_url + "/personal/edit-profile/" + auth?.user?._id
      );
      if (updatedUserData) {
        auth.refresh({ ...updatedUserData?.data?.data, auth_type: "personal" });
        localStorage.setItem(config.jwt_auth_key, updatedUserData?.data?.token);
        toast(
          <ToastMsg message="Changes saved successfully" />,
          config.success_toast_config
        );
        setValues({});
        setIsEditClicked(false);
      }
    }
  };

  const fetchCountries = async () => {
    const { data } = await http.get(base_url + "/general/countries");
    if (data) {
      setCountries(data);
    }
  };

  const fetchCities = async () => {
    const country_id = 101; // India
    const { data } = await http.get(
      base_url + "/general/cities-by-country/" + country_id
    );
    if (data) {
      setCities(data);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchCities();
  }, []);

  // Set initial values when component mounts
  useEffect(() => {
    if (auth?.user) {
      setValues({
        country: auth.user.country || "",
        city: auth.user.city || "",
        pincode: auth.user.pincode || "",
      });
    }
  }, [auth?.user]);

  return (
    <>
      {!isEditClicked ? (
        <div className="field_wrapper">
          <div
            className="field_wrapper_1"
            onClick={() => setIsEditClicked(true)}
          >
            <TextFieldWithIcon
              label="Country*"
              value={auth?.user?.country || ""}
              icon={editiconorange}
              readOnly
              lightTheme={lightTheme}
            />
          </div>
          {auth?.user?.country === "India" && (
            <>
              <div className="field_wrapper_1 mt-3">
                <TextFieldWithIcon
                  label="City*"
                  value={auth?.user?.city || ""}
                  readOnly
                  lightTheme={lightTheme}
                />
              </div>
              <div className="field_wrapper_1 mt-3">
                <TextFieldWithIcon
                  label="Pincode*"
                  value={auth?.user?.pincode || ""}
                  readOnly
                  lightTheme={lightTheme}
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="field_wrapper">
            <div className="field_wrapper_1">
              <AutoCompleteField
                key="country"
                textLabel="Country*"
                data={countries}
                onChange={(e, option) => {
                  handleSelectChange(option.value, "country");
                }}
                defaultValue={{
                  value: auth?.user?.country,
                  label: auth?.user?.country,
                }}
                lightTheme={lightTheme}
              />
              {formError.country && (
                <p className="error">{formError.country}</p>
              )}
            </div>

            {values.country === "India" && (
              <>
                <div className="field_wrapper_1 mt-3">
                  <AutoCompleteField
                    key="city"
                    textLabel="City*"
                    data={cities}
                    // getOptionLabel={(option) => option.name}
                    onChange={(e, value) => {
                      handleSelectChange(value.name, "city");
                    }}
                    defaultValue={{
                      value: auth?.user?.city,
                      label: auth?.user?.city,
                    }}
                    lightTheme={lightTheme}
                  />
                  {formError.city && <p className="error">{formError.city}</p>}
                </div>

                <div className="field_wrapper_1 mt-3">
                  <FullWidthTextField
                    type="tel"
                    label="Pincode*"
                    name="pincode"
                    value={values.pincode}
                    onChange={handleChange}
                    inputProps={{ maxLength: 6 }}
                    lightTheme={lightTheme}
                  />
                  {formError.pincode && (
                    <p className="error">{formError.pincode}</p>
                  )}
                </div>
              </>
            )}
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

export default EditCountry;
