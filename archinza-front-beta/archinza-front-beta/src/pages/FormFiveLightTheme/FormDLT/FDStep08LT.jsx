import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import {
  blackDeleteicon,
  errorFailed,
  errorSuccess,
  formBehance,
  formLinkedin,
  formfb,
  forminsta,
  plusicon,
  rightarrowblack,
  websiteicon,
} from "../../../images";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import http from "../../../helpers/http";
import config from "../../../config/config";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";

const addressTypeData = [
  "Office",
  "Studio",
  "Retail Store",
  "Showroom",
  "Experience Centre",
  "Factory",
  "Warehouse",
];

const FDStep08LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  const [gstValid, setGstValid] = useState(null);
  const [formError, setFormError] = useState({});
  const [emailError, setEmailError] = useState({});
  const [addressesError, setAddressesError] = useState({});
  const [formData, setFormData] = useState({
    website_link: "",
    instagram_handle: "",
    behance_link: "",
    linkedin_link: "",
    gst_number: "",
    other: "",
  });

  const [emailData, setEmailData] = useState([{ purpose: "", email: "" }]);
  const [addresses, setAddresses] = useState([
    {
      address: "",
      address_types: [],
    },
  ]);
  const [addressTypes, setAddressTypes] = useState([]);
  const base_url = config.api_url;
  const joiOptions = config.joiOptions;
  const BusinessAccountContext = useBusinessContext();

  const validationSchema = (data) => {
    const schemaObj = {
      website_link: Joi.string()
        .label("Website")
        .allow("")
        .custom((value, helpers) => {
          const urlRegex =
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
          if (!urlRegex.test(value)) {
            return helpers.message("Invalid website URL");
          }
          return value;
        }),
      instagram_handle: Joi.string().label("Instagram").allow(""),
      behance_link: Joi.string()
        .label("Behance")
        .allow("")
        .custom((value, helpers) => {
          const urlRegex =
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
          if (!urlRegex.test(value)) {
            return helpers.message("Invalid Behance Profile URL");
          }
          return value;
        }),
      linkedin_link: Joi.string()
        .label("Linkedin")
        .allow("")
        .custom((value, helpers) => {
          const urlRegex =
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
          if (!urlRegex.test(value)) {
            return helpers.message("Invalid Linkedin Profile URL");
          }
          return value;
        }),
      other: Joi.string().label("Other").allow(""),
      gst_number: Joi.string()
        .min(15)
        .label("GST Number")
        .allow("")
        .custom((value, helpers) => {
          const regex =
            /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/i;
          if (!regex.test(value)) {
            return helpers.message("Invalid GST number");
          }
          return value;
        }),
    };

    const schema = Joi.object(schemaObj)
      .options({ allowUnknown: true, abortEarly: false })
      .custom((value, helpers) => {
        const requiredFields = [
          "website_link",
          "instagram_handle",
          "behance_link",
          "linkedin_link",
          "other",
        ];
        const hasValue = requiredFields.some((field) => !!value[field]);
        if (!hasValue) {
          return helpers.message("Add atleast one of the following");
        }
        return value;
      });
    const { error } = schema.validate(data, config.joiOptions);

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return errors;
    }

    return {}; // Return an empty object on successful validation
  };

  const validateEmailSchema = (data) => {
    const schemaObj = {
      purpose: Joi.string().required().label("Purpose"),
      email: Joi.string().email({ tlds: false }).required().label("Email"),
    };
    const schema = Joi.object(schemaObj).options({ allowUnknown: true });
    const { error } = schema.validate(data, config.joiOptions);

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return errors;
    }

    return {};
  };

  const validateEmails = async () => {
    const aggregatedErrors = {};
    emailData.forEach((email, index) => {
      const error = validateEmailSchema(email);

      if (Object.keys(error).length > 0) {
        aggregatedErrors[index] = error;
      }
    });

    setEmailError(aggregatedErrors);
    return aggregatedErrors;
  };

  const validateAddressSchema = (data) => {
    const schemaObj = {
      address: Joi.string().label("Address").allow(""),
      address_types: Joi.array().label("Type"),
    };
    const schema = Joi.object(schemaObj)
      .options({ allowUnknown: true })
      .custom((value, helpers) => {
        const { address, address_types } = value;
        if (address && address_types.length === 0) {
          return helpers.message("AddressType is Required");
        }
        if (address_types.length > 0 && !address) {
          return helpers.message("Address is Required");
        }
        return value;
      });
    const { error } = schema.validate(data, config.joiOptions);

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return errors;
    }

    return {};
  };

  const validateAddresses = async () => {
    const aggregatedErrors = {};
    addresses.forEach((address, index) => {
      const error = validateAddressSchema(address);

      if (Object.keys(error).length > 0) {
        if (Object.values(error)[0].includes("AddressType")) {
          error["address_type"] = Object.values(error)[0];
          delete error.undefined;
        } else {
          error["address"] = Object.values(error)[0];
          delete error.undefined;
        }
        aggregatedErrors[`${index}_address`] = error;
      }
    });

    setAddressesError(aggregatedErrors);
    return aggregatedErrors;
  };

  const gstValidationRule = (value) => {
    const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/i;
    if (!gstRegex.test(value)) {
      return "Invalid GST number format";
    }
    if (value.length < 15) {
      return "GST number must be at least 15 characters";
    }
    return null;
  };

  const handleInputChange = (e) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validationSchema(formData);

    if (formData.gst_number.length) {
      formData.gst_number = formData?.gst_number?.toUpperCase();
    }
    let emailErrors = await validateEmails();
    let addressErrors = await validateAddresses();

    // if (Object.keys(emailErrors).length) {
    //   helper.scroll(helper.getFirstError(emailErrors));
    //   return;
    // }
    if (errors.undefined) {
      errors["atleast_one"] = errors.undefined;
      delete errors.undefined;
      setFormError(errors);
      // helper.scroll(helper.getFirstError(errors));
      // return;
    }

    if (Object.keys(errors).length) {
      setFormError(errors);
      // helper.scroll(helper.getFirstError(errors));
      // return;
    }

    if (Object.keys(emailErrors).length) {
      helper.scroll(helper.getFirstError(emailErrors));
      return;
    }
    if (Object.keys(addressErrors).length) {
      console.log(addressErrors);

      helper.scroll(helper.getFirstError(addressErrors));
      return;
    } else {
      if (Object.keys(errors).length) {
        helper.scroll(helper.getFirstError(errors));
        return;
      }
    }

    setFormError("");
    //check if formData has instagram_handle
    if (formData.instagram_handle) {
      const urlPattern = new RegExp(
        "^(https?://)?(www\\.)?instagram\\.com/.*$",
        "i"
      );
      if (!urlPattern.test(formData.instagram_handle)) {
        formData.instagram_handle = `https://www.instagram.com/${formData.instagram_handle}`;
      }
    }

    const status = currentStep + 1;
    let saveStatus = status;
    if (BusinessAccountContext?.data?.status > currentStep) {
      saveStatus = BusinessAccountContext.data.status;
    }
    let data = await http.post(
      base_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        d_firm_connect_data: {
          ...formData,
          support_email_ids: emailData,
          address_google_location: addresses,
        },
        status: saveStatus,
      }
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        d_firm_connect_data: {
          ...formData,
          support_email_ids: emailData,
          address_google_location: addresses,
        },
        status: saveStatus,
      });
      nextStep();
      window.scrollTo(0, 0);
    }
  };

  const handleAddEmailSection = () => {
    setEmailData([...emailData, { purpose: "", email: "" }]);
  };

  const handleEmailInputChange = (index, field, value) => {
    const newEmailData = [...emailData];
    newEmailData[index][field] = value;
    setEmailData(newEmailData);
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, { address: "", address_types: [] }]);
  };

  const handleAddressChange = (index, value) => {
    const newAddresses = [...addresses];
    newAddresses[index].address = value;
    setAddresses(newAddresses);
  };

  const handleCheckboxChange = (type, index) => {
    const newAddresses = [...addresses]; // Copy the array
    const updatedAddress = newAddresses[index];
    const addressTypeIndex = updatedAddress.address_types.indexOf(type);
    if (addressTypeIndex === -1) {
      updatedAddress.address_types.push(type);
    } else {
      updatedAddress.address_types.splice(addressTypeIndex, 1);
    }
    newAddresses[index] = updatedAddress;
    setAddresses(newAddresses); // Update the state with the modified array
  };

  const handleDeleteEmails = (index) => {
    if (emailData.length > 1) {
      setEmailData((prevEmails) => {
        prevEmails.splice(index, 1);
        return [...prevEmails];
      });
      setEmailError((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[index];

        const reIndexedErrors = {};
        Object.keys(newErrors).forEach((key) => {
          const newKey = key > index ? key - 1 : key;
          reIndexedErrors[newKey] = newErrors[key];
        });

        return reIndexedErrors;
      });
    }
  };

  const handleDeleteAddress = (index) => {
    if (addresses.length > 1) {
      setAddresses((prevAddress) => {
        prevAddress.splice(index, 1);
        return [...prevAddress];
      });
      setAddressesError((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[`${index}_address`];

        const reIndexedErrors = {};
        Object.keys(newErrors).forEach((key) => {
          const [keyIndex] = key.split("_");
          const intKeyIndex = parseInt(keyIndex, 10);

          if (intKeyIndex > index) {
            reIndexedErrors[`${intKeyIndex - 1}_address`] = newErrors[key];
          } else if (intKeyIndex < index) {
            reIndexedErrors[key] = newErrors[key];
          }
        });

        return reIndexedErrors;
      });
    }
  };

  const fetchData = async () => {
    const { data } = await http.get(
      `${config.api_url}/business/business-type-options/${BusinessAccountContext?.data?.business_type}`
    );

    if (data) {
      const updatedOption = data?.address_types?.map((option) => {
        return option.value;
      });

      setAddressTypes(updatedOption);
    }
  };

  useEffect(() => {
    const {
      website_link,
      instagram_handle,
      linkedin_link,
      gst_number,
      behance_link,
      other,
      support_email_ids,
      address_google_location,
    } = BusinessAccountContext?.data?.d_firm_connect_data;

    setFormData({
      website_link: website_link,
      instagram_handle: instagram_handle,
      linkedin_link: linkedin_link,
      gst_number: gst_number,
      behance_link: behance_link,
      other: other,
    });
    setEmailData(
      support_email_ids?.length
        ? support_email_ids
        : [{ purpose: "", email: "" }]
    );
    setAddresses(
      address_google_location?.length
        ? address_google_location
        : [
            {
              address: "",
              address_types: [],
            },
          ]
    );
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((10 / 11) * 100);
    }
  }, [isActive]);

  useEffect(() => {
    if (formData.gst_number) {
      const gstError = gstValidationRule(formData.gst_number);
      if (gstError) {
        setGstValid(false);
      } else {
        setGstValid(true);
      }
    } else {
      setGstValid(null);
    }
  }, [formData.gst_number]);

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className={style.firm_connect}>
        {/* EMAILIDS STARTS HERE */}
        {/* EMAILIDS STARTS HERE */}
        {/* EMAILIDS STARTS HERE */}
        <div className={style.emailid_box}>
          <div className={style.text_container}>
            <div className={style.page_title}>Firm Connect Data</div>
            <h1 className={style.title}>Please provide your email IDs</h1>
          </div>
          <div
            className={`${style.steps} ${style.reduceSpace} ${style.email_field}`}
          >
            <div className="row">
              {emailData.map((row, index) => (
                <div className="row" id={`email_${index}_error`}>
                  <div className="col-md-6">
                    <div className={style.field_wrapper}>
                      <FullWidthTextField
                        lightTheme
                        label="Purpose of Mail ID"
                        name="purpose_of_mail_id"
                        value={row.purpose}
                        onChange={(e) =>
                          handleEmailInputChange(
                            index,
                            "purpose",
                            e.target.value
                          )
                        }
                      />
                      <div className={style.input_below_notice}>
                        Eg. - Media, Admin, Sales, etc.
                      </div>
                      <div id={`${index}_error`}>
                        {Object.keys(emailError).length > 0 &&
                          emailError[index] && (
                            <p className={style.error}>
                              {emailError[index].purpose}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={style.field_wrapper}>
                      <FullWidthTextField
                        lightTheme
                        label="Email ID"
                        name="email_ID"
                        value={row.email}
                        onChange={(e) =>
                          handleEmailInputChange(index, "email", e.target.value)
                        }
                      />
                      <div className={style.input_below_notice}>
                        Eg. - media@abc.net, admin@abc.net
                      </div>
                      <div id={`${index}_error`}>
                        {Object.keys(emailError).length > 0 &&
                          emailError[index] && (
                            <p className={style.error}>
                              {emailError[index].email}
                            </p>
                          )}
                      </div>

                      {/* {formError.additional_emails &&
                        formError.additional_emails[index] &&
                        formError.additional_emails[index].email && (
                          <p className={style.error}>
                            {formError.additional_emails[index].email.message}
                          </p>
                        )} */}
                    </div>
                  </div>
                  {index > 0 && (
                    <div className={style.add_delete_icon}>
                      <img
                        src={blackDeleteicon}
                        alt="icon"
                        className={style.deleteicon}
                        loading="lazy"
                        style={{ visibility: "visible", cursor: "pointer" }}
                        onClick={() => handleDeleteEmails(index)}
                      />
                    </div>
                  )}
                </div>
              ))}
              {/* Add more */}
              <div
                className={style.add_category}
                onClick={handleAddEmailSection}
              >
                <div className={style.dashed_line}></div>
                <div className={style.add_flex}>
                  <img src={plusicon} alt="icon" className={style.icon} />
                  <div className={style.title}>Add more email IDs</div>
                </div>
                <div className={style.dashed_line}></div>
              </div>
            </div>
          </div>
        </div>

        {/* SOCIALS STARTS HERE */}
        {/* SOCIALS STARTS HERE */}
        {/* SOCIALS STARTS HERE */}
        <div className={style.social_box}>
          <div className={style.text_container}>
            <h1 className={style.title}>
              Be found by clients,{" "}
              <span className={style.coloured_text}>led by AI!</span>
            </h1>
            <p className={style.description}>One mandatory</p>
            <div id="atleast_one_error">
              {formError.atleast_one && (
                <p className={style.error}>{formError.atleast_one}</p>
              )}
            </div>
          </div>
          <div className={`${style.steps} ${style.reduceSpace}`}>
            <div className={`row ${style.social_row}`}>
              <div className="col-md-6">
                <div className={style.field_wrapper}>
                  <TextFieldWithIcon
                    lightTheme
                    label="Website"
                    icon={websiteicon}
                    name="website_link"
                    value={formData.website_link}
                    onChange={handleInputChange}
                  />
                  <div id="website_link_error">
                    {formError.website_link && (
                      <p className={style.error}>{formError.website_link}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={style.field_wrapper}>
                  <TextFieldWithIcon
                    lightTheme
                    label="Instagram"
                    icon={forminsta}
                    name="instagram_handle"
                    value={formData.instagram_handle}
                    onChange={handleInputChange}
                  />
                  <div id="instagram_handle_error">
                    {formError.instagram_handle && (
                      <p className={style.error}>
                        {formError.instagram_handle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={style.field_wrapper}>
                  <TextFieldWithIcon
                    lightTheme
                    label="Behance"
                    icon={formBehance}
                    name="behance_link"
                    value={formData.behance_link}
                    onChange={handleInputChange}
                  />
                  <div id="behance_link_error">
                    {formError.behance_link && (
                      <p className={style.error}>{formError.behance_link}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={style.field_wrapper}>
                  <TextFieldWithIcon
                    lightTheme
                    label="Linkedin"
                    icon={formLinkedin}
                    name="linkedin_link"
                    value={formData.linkedin_link}
                    onChange={handleInputChange}
                  />
                  <div id="linkedin_link_error">
                    {formError.linkedin_link && (
                      <p className={style.error}>{formError.linkedin_link}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={style.field_wrapper}>
                  <FullWidthTextField
                    lightTheme
                    label="Other"
                    name="other"
                    key="other"
                    value={formData.other}
                    onChange={handleInputChange}
                  />
                  {/* <div id="other_error">
                    {formError.other && (
                      <p className={style.error}>{formError.other}</p>
                    )}
                  </div> */}
                </div>
              </div>
              {/* <div className="col-md-6">
            <div className={style.field_wrapper}>
              <FullWidthTextField
                lightTheme
                label="Address/ google location"
                name="address_google_location"
                value={formData.address_google_location}
                onChange={handleInputChange}
              />
              <div id="address_google_location_error">
                {formError.address_google_location && (
                  <p className={style.error}>
                    {formError.address_google_location}
                  </p>
                )}
              </div>
            </div>
          </div> 
          <div className="col-md-6">
            <div className={style.field_wrapper}>
              <div className={style.input_wrapper}>
                <FullWidthTextField
                  lightTheme
                  type="text"
                  label="GST number"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleInputChange}
                />
                {gstValid && !formError.gst_number && (
                  <img
                    className={style.val_icon}
                    src={errorSuccess}
                    alt="success"
                  />
                )}
                {gstValid === false && (
                  <img
                    className={style.val_icon}
                    src={errorFailed}
                    alt="failed"
                  />
                )}
              </div>
              <div id="gst_number_error">
                <p className={style.error}>{formError.gst_number}</p>
              </div>
            </div>
          </div>*/}
            </div>
          </div>
        </div>

        {/* ADDRESS STARTS HERE */}
        {/* ADDRESS STARTS HERE */}
        {/* ADDRESS STARTS HERE */}
        <div className={style.address_box}>
          <div className={style.text_container}>
            <h1 className={style.title}>Address or Google Location</h1>
            <p className={style.description}>Optional</p>
          </div>
          {addresses.map((address, index) => (
            <div>
              <div className={style.address_type_checkboxes}>
                <div className={style.title}>Address Type</div>
                <ul className={`${style.new_list}`}>
                  {addressTypes.map((option, i) => (
                    <React.Fragment key={`${option}-${index}`}>
                      <CheckboxButton
                        className="business_edit_checkbox"
                        lightTheme
                        label={option}
                        labelId={`${option}-${index}`}
                        checked={address.address_types.includes(option)}
                        onChange={() => handleCheckboxChange(option, index)}
                      />
                    </React.Fragment>
                  ))}
                </ul>
                <div id={`${index}_address_error`}>
                  {Object.keys(addressesError).length > 0 &&
                    addressesError[`${index}_address`] && (
                      <p className={style.error}>
                        {addressesError[`${index}_address`].address_type}
                      </p>
                    )}
                </div>
              </div>
              <div className={`${style.steps} ${style.reduceSpace}`}>
                <div className="row">
                  <div className="col-md-3"></div>
                  <div className="col-md-6">
                    <div className={style.field_wrapper}>
                      <FullWidthTextField
                        lightTheme
                        label="Address Link"
                        name="address_link"
                        value={address.address}
                        onChange={(e) =>
                          handleAddressChange(index, e.target.value)
                        }
                      />
                      <div id={`${index}_address_error`}>
                        {Object.keys(addressesError).length > 0 &&
                          addressesError[`${index}_address`] && (
                            <p className={style.error}>
                              {addressesError[`${index}_address`].address}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {index > 0 && (
                <div className={style.add_delete_icon}>
                  <img
                    src={blackDeleteicon}
                    alt="icon"
                    className={style.deleteicon}
                    loading="lazy"
                    style={{ visibility: "visible", cursor: "pointer" }}
                    onClick={() => handleDeleteAddress(index)}
                  />
                </div>
              )}
            </div>
          ))}
          <div className={`${style.steps} ${style.reduceSpace}`}>
            <div className="row">
              <div className="col-md-3"></div>
              <div className={style.add_category}>
                <div className={style.dashed_line}></div>
                <div className={style.add_flex} onClick={handleAddAddress}>
                  <img src={plusicon} alt="icon" className={style.icon} />
                  <div className={style.title}>Add more addresses</div>
                </div>
                <div className={style.dashed_line}></div>
              </div>
            </div>
          </div>
        </div>

        {/* GST STARTS HERE */}
        {/* GST STARTS HERE */}
        {/* GST STARTS HERE */}
        <div className={style.gst_box}>
          <div className={style.text_container}>
            <h1 className={style.title}>GST Number</h1>
            <p className={style.description}>Optional</p>
          </div>
          <div className={`${style.steps} ${style.reduceSpace}`}>
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className={style.field_wrapper}>
                  <div className={style.input_wrapper}>
                    <FullWidthTextField
                      lightTheme
                      type="text"
                      label="GST number"
                      name="gst_number"
                      value={formData.gst_number}
                      onChange={handleInputChange}
                    />
                    <img
                      className={style.val_icon}
                      src={gstValid ? errorSuccess : errorFailed}
                      alt={gstValid ? "success" : "failure"}
                      style={{
                        display: formData.gst_number ? "block" : "none",
                      }}
                    />
                  </div>
                  <div id="gst_number_error">
                    {formError.gst_number && !gstValid && (
                      <p className={style.error_text}>{formError.gst_number}</p>
                    )}
                    {gstValid && (
                      <p className={`${style.success_text}`}>
                        Verified GST number
                      </p>
                    )}
                  </div>

                  {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>
          </div>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div className={style.next_button} onClick={handleSubmit}>
            <div className={style.text}>Next</div>
            <img
              src={rightarrowblack}
              alt="icon"
              className={style.icon}
              loading="lazy"
            />
          </div>
          <div
            className={style.back_button}
            onClick={() => {
              previousStep(8);
              window.scrollTo(0, 0);
            }}
          >
            Back
          </div>
        </div>
        <LogoutText />
      </div>
    </>
  );
};

export default FDStep08LT;
