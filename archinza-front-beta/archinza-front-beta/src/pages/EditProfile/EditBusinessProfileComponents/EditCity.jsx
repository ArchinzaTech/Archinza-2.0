import React, { useEffect, useState } from "react";
import { editiconorange } from "../../../images";
import AutoCompleteField from "../../../components/AutoCompleteField/AutoCompleteField";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import { useAuth } from "../../../context/Auth/AuthState";
import config from "../../../config/config";
import Joi from "joi";
import http from "../../../helpers/http";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";

const EditCity = () => {
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [cities, setCities] = useState([]);
  const [values, setValues] = useState({
    city: "",
  });
  const [formError, setFormError] = useState({});

  const auth = useAuth();
  const joiOptions = config.joiOptions;
  const base_url = config.api_url;

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
      city: Joi.string().trim().required().label("City"),
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
    fetchCities();
  }, []);

  return (
    <>
      {!isEditClicked ? (
        <div className="field_wrapper">
          <div
            className="field_wrapper_1"
            onClick={() => setIsEditClicked(true)}
          >
            <TextFieldWithIcon
              label="City*"
              value={auth?.user?.city || ""}
              icon={editiconorange}
              readOnly
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="field_wrapper">
            <div className="field_wrapper_1">
              <AutoCompleteField
                key="city"
                textLabel="City*"
                data={cities}
                getOptionLabel={(option) => option.name}
                onChange={(e, value) => {
                  handleSelectChange(value.name, "city");
                }}
              />
              {formError.city && <p className="error">{formError.city}</p>}
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

export default EditCity;
