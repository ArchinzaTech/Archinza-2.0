import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { blackDeleteicon, plusicon, rightarrowwhite } from "../../../images";
import { countries } from "../../../db/dataTypesData";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import CountryCodeDropdown from "../../../components/CountryCodeDropdown/CountryCodeDropdown";
import http from "../../../helpers/http";
import config from "../../../config/config";
import Joi from "joi";
import helper from "../../../helpers/helper";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";
import { parsePhoneNumber } from "libphonenumber-js";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const RStep02LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [ownerErrors, setOwnerErrors] = useState({});
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const BusinessAccountContext = useBusinessContext();
  const joiOptions = config.joiOptions;
  const base_url = config.api_url;

  const [countryCodeStates, setCountryCodeStates] = useState({});
  const [noOwnerError, setNoOwnerError] = useState("");
  const [owners, setOwners] = useState([
    {
      id: 1,
      name: "",
      email: "",
      phone: "",
      whatsapp_no: "",
      country_code: { name: "India", iso3: "IND", phone_code: "91" },
      whatsapp_country_code: { name: "India", iso3: "IND", phone_code: "91" },
      same_as_phone: false,
    },
  ]);

  const validatePhoneNumber = async (
    countryCode,
    phoneNumber,
    type = "phone"
  ) => {
    if (!phoneNumber) {
      return `Please enter a valid ${
        type === "whatsapp_no" ? "whatsapp" : "phone"
      } number`;
    }
    try {
      const fullNumber = parsePhoneNumber(`+${countryCode}${phoneNumber}`);
      if (!fullNumber.isValid()) {
        return `Please enter a valid ${
          type === "whatsapp_no" ? "whatsapp" : "phone"
        } number`;
      }
    } catch (err) {
      return `Please enter a valid ${
        type === "whatsapp_no" ? "whatsapp" : "phone"
      } number`;
    }
    return null;
  };

  const validate = async (data) => {
    const schema = Joi.object({
      name: Joi.string().trim().required().label("Name of the owner/founder"),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email id"),
      country_code: Joi.required().label("Code"),
      phone: Joi.string()
        .trim()
        .pattern(/^\d+$/)
        .required()
        .label("Phone no")
        .messages({
          "string.pattern.base":
            "Phone number can only contain numeric characters.",
        }),
      whatsapp_no: Joi.string()
        .trim()
        .pattern(/^\d+$/)
        .required()
        .label("Whatsapp number")
        .messages({
          "string.pattern.base":
            "Whatsapp number can only contain numeric characters.",
        }),
      whatsapp_country_code: Joi.required().label("Whatsapp Country Code"),
    }).options({ allowUnknown: true });

    const { error } = schema.validate(data, joiOptions);
    const errors = {};

    if (error) {
      error.details.forEach((field) => {
        errors[field.path[0]] = field.message;
      });
    }
    return errors;
  };

  const validateOwners = async (updatedOwners) => {
    const aggregatedErrors = {};
    let usedEmails = [];
    let usedContactNumbers = [];

    for (const owner of updatedOwners) {
      const errors = await validate(owner);

      // Check email uniqueness
      if (usedEmails.includes(owner.email)) {
        errors.email = "Email must be unique for each owner/founder";
      } else if (owner.email) {
        usedEmails.push(owner.email);
      }

      // Validate phone and WhatsApp numbers
      const phoneError = await validatePhoneNumber(
        owner.country_code?.phone_code,
        owner.phone,
        "phone"
      );
      if (phoneError) errors.phone = phoneError;

      const whatsappError = await validatePhoneNumber(
        owner.whatsapp_country_code?.phone_code,
        owner.whatsapp_no,
        "whatsapp_no"
      );
      if (whatsappError) errors.whatsapp_no = whatsappError;

      // Check contact number uniqueness
      const fullPhoneNumber = `${owner.country_code?.phone_code}${owner.phone}`;
      const fullWhatsAppNumber = `${owner.whatsapp_country_code?.phone_code}${owner.whatsapp_no}`;

      if (usedContactNumbers.includes(fullPhoneNumber)) {
        errors.phone = "Phone number must be unique across all contact numbers";
      }
      if (usedContactNumbers.includes(fullWhatsAppNumber)) {
        errors.whatsapp_no =
          "WhatsApp number must be unique across all contact numbers";
      }

      if (!usedContactNumbers.includes(fullPhoneNumber))
        usedContactNumbers.push(fullPhoneNumber);
      if (!usedContactNumbers.includes(fullWhatsAppNumber))
        usedContactNumbers.push(fullWhatsAppNumber);

      if (Object.keys(errors).length > 0) {
        aggregatedErrors[owner.id] = errors;
      }
    }

    setOwnerErrors(aggregatedErrors);
    return aggregatedErrors;
  };

  const handleAddOwners = () => {
    const newOwnerId = owners.length + 1;
    const newOwner = {
      id: newOwnerId,
      name: "",
      email: "",
      phone: "",
      whatsapp_no: "",
      country_code: { name: "India", iso3: "IND", phone_code: "91" },
      whatsapp_country_code: { name: "India", iso3: "IND", phone_code: "91" },
      same_as_phone: false,
    };
    setOwners((prevOwners) => [...prevOwners, newOwner]);
    setCountryCodeStates((prev) => ({
      ...prev,
      [newOwnerId]: {
        phone: newOwner.country_code,
        whatsapp: newOwner.whatsapp_country_code,
      },
    }));
  };

  const handleDeleteOwner = async (id) => {
    const updatedOwners = owners.filter((owner) => owner.id !== id);
    setOwners(updatedOwners);
    setOwnerErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });

    const selectedOwner = owners.find((it) => it.id === id);
    if (selectedOwner?._id) {
      await http.post(
        `${base_url}/business/business-details/${BusinessAccountContext?.data?._id}`,
        {
          owners: updatedOwners,
        }
      );
      toast(
        <ToastMsg message="Owner Deleted Successfully" />,
        config.success_toast_config
      );
    }
  };

  const handleWAChangeOwner = async (checked, ownerId) => {
    setOwners((prevOwners) =>
      prevOwners.map((owner) => {
        if (owner.id === ownerId) {
          const updatedOwner = {
            ...owner,
            same_as_phone: checked,
            whatsapp_no: checked ? owner.phone : "", // Clear whatsapp_no when unchecked
            whatsapp_country_code: checked
              ? owner.country_code
              : { name: "India", iso3: "IND", phone_code: "91" }, // Reset to default when unchecked
          };
          return updatedOwner;
        }
        return owner;
      })
    );

    setCountryCodeStates((prevCountryCodeStates) => {
      const newCountryCodeStates = { ...prevCountryCodeStates };
      if (checked) {
        newCountryCodeStates[ownerId] = {
          ...newCountryCodeStates[ownerId],
          whatsapp: prevCountryCodeStates[ownerId]?.phone,
        };
      } else {
        newCountryCodeStates[ownerId] = {
          ...newCountryCodeStates[ownerId],
          whatsapp: null,
        };
      }
      return { ...newCountryCodeStates };
    });

    // Revalidate after toggling "Same as phone number"
    const updatedOwners = owners.map((owner) =>
      owner.id === ownerId
        ? {
            ...owner,
            same_as_phone: checked,
            whatsapp_no: checked ? owner.phone : "",
            whatsapp_country_code: checked
              ? owner.country_code
              : { name: "India", iso3: "IND", phone_code: "91" },
          }
        : owner
    );
    await validateOwners(updatedOwners);
  };

  const handleOwnerCountryCodeChange = async (fieldName, value, ownerId) => {
    const updatedOwners = owners.map((owner) => {
      if (owner.id === ownerId) {
        const updatedOwner = { ...owner, [fieldName]: value };
        if (fieldName === "country_code" && updatedOwner.same_as_phone) {
          updatedOwner.whatsapp_country_code = value;
        }
        return updatedOwner;
      }
      return owner;
    });

    setOwners(updatedOwners);
    setCountryCodeStates((prev) => ({
      ...prev,
      [ownerId]: {
        ...prev[ownerId],
        [fieldName === "country_code" ? "phone" : "whatsapp"]: value,
      },
    }));

    await validateOwners(updatedOwners); // Revalidate after country code change
  };

  const handleOwnerChange = async (ownerId, field, value) => {
    const updatedOwners = owners.map((owner) => {
      if (owner.id === ownerId) {
        const updatedOwner = { ...owner, [field]: value };
        if (field === "phone" && owner.same_as_phone) {
          updatedOwner.whatsapp_no = value;
          updatedOwner.whatsapp_country_code = owner.country_code;
        }
        if (field === "whatsapp_no" || field === "whatsapp_country_code") {
          updatedOwner.same_as_phone = false;
        }
        return updatedOwner;
      }
      return owner;
    });

    setOwners(updatedOwners);

    // Dynamic validation for all fields
    const owner = updatedOwners.find((o) => o.id === ownerId);
    const errors = {};

    if (field === "name") {
      const nameError = Joi.string().trim().required().validate(value).error;
      errors.name = nameError ? "Name of the owner/founder is required" : null;
    } else if (field === "email") {
      const emailError = Joi.string()
        .email({ tlds: { allow: false } })
        .validate(value).error;
      errors.email = emailError ? "Please enter a valid email address" : null;
    } else if (field === "phone" || field === "whatsapp_no") {
      const countryCode =
        field === "phone"
          ? owner.country_code.phone_code
          : owner.whatsapp_country_code.phone_code;
      const error = await validatePhoneNumber(countryCode, value, field);
      errors[field] = error;
    }

    setOwnerErrors((prev) => ({
      ...prev,
      [ownerId]: { ...prev[ownerId], ...errors },
    }));
  };

  const fetchCodes = async () => {
    const { data } = await http.get(base_url + "/general/countries/codes");
    if (data) {
      setCodes(data);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (owners.length === 0) {
      setNoOwnerError("Please add at least one owner");
      return;
    }

    setNoOwnerError(""); // Clear error if owners exist

    const questionsData = await http.get(
      `${config.api_url}/business/business-questions`
    );
    const business_types = BusinessAccountContext.data.business_types.map(
      (it) => it._id
    );
    let stepNumber = helper.redirectBusinessUser(
      questionsData?.data,
      business_types,
      currentStep
    );
    let nextStepToGo = currentStep + 1;
    let saveStatus = Math.max(stepNumber, nextStepToGo);

    if (BusinessAccountContext?.data?.status > currentStep) {
      saveStatus = BusinessAccountContext.data.status;
    }
    console.log(saveStatus);
    const updatedOwners = owners.map((owner) => ({
      ...owner,
      country_code: owner.country_code,
      whatsapp_country_code: owner.whatsapp_country_code,
    }));

    const ownerErrors = await validateOwners(updatedOwners);
    if (Object.keys(ownerErrors).length) {
      helper.scroll(helper.getFirstError(ownerErrors));
      return;
    }

    const status = currentStep + 1;
    const payload = {
      owners: updatedOwners.map((owner) => ({
        ...owner,
        country_code: owner.country_code.phone_code,
        whatsapp_country_code: owner.whatsapp_country_code.phone_code,
      })),
      status,
    };

    const { data } = await http.post(
      `${base_url}/business/business-details/${BusinessAccountContext?.data?._id}`,
      payload
    );
    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        owners: payload.owners,
        status,
      });
      nextStep();
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  useEffect(() => {
    if (!loading) {
      const defaultOwners = BusinessAccountContext?.data?.owners?.length
        ? BusinessAccountContext.data.owners.map((owner, index) => ({
            ...owner,
            id: index + 1,
            country_code: codes.find(
              (code) => code.phone_code === owner.country_code
            ) || {
              name: "India",
              iso3: "IND",
              phone_code: "91",
            },
            whatsapp_country_code: codes.find(
              (code) => code.phone_code === owner.whatsapp_country_code
            ) || {
              name: "India",
              iso3: "IND",
              phone_code: "91",
            },
          }))
        : [
            {
              id: 1,
              name: "",
              email: "",
              phone: "",
              whatsapp_no: "",
              country_code: { name: "India", iso3: "IND", phone_code: "91" },
              whatsapp_country_code: {
                name: "India",
                iso3: "IND",
                phone_code: "91",
              },
              same_as_phone: false,
            },
          ];

      setOwners(defaultOwners);
      setCountryCodeStates(
        defaultOwners.reduce(
          (acc, owner) => ({
            ...acc,
            [owner.id]: {
              phone: owner.country_code,
              whatsapp: owner.whatsapp_country_code,
            },
          }),
          {}
        )
      );
    }
  }, [currentStep, loading, BusinessAccountContext, codes]);

  useEffect(() => {
    if (isActive) {
      progressStatus((currentStep / 18) * 100);
    }
  }, [isActive]);

  return (
    <>
      <LightThemeBackground />
      <div className={`${style.steps} ${style.rstep1}`}>
        <div className={style.personal_box}>
          <div className={style.personal_details}>
            <div className={style.text_container}>
              <p className={style.page_title}>
                Tell Us About Your Firm/Business
              </p>
              <h1 className={style.title}>Owner/ Founder of Business/Firm*</h1>
              {noOwnerError && <p className={style.error}>{noOwnerError}</p>}
              <h2
                className={`${style.description} ${style.desc_renovation} d-block`}
              >
                This information is collected only to verify your business and
                manage your account securely. Rest assured, your contact details
                will never be displayed on your Business Page without your
                explicit permission.{" "}
                <b>We value your trust and respect your privacy.</b>
              </h2>
              <p className={`${style.description} ${style.select_notice}`}>
                <span>One Founder is Mandatory. Add as many.</span>
                {/* <span className={style.entity} onClick={() => setModalShow(true)}>
            &#9432;
          </span> */}
              </p>
            </div>
            {owners.map((owner, index) => (
              <div
                className={`row ${style.owner_row}`}
                style={{ border: owner.id === 1 && "0" }}
                id={`${owner.id}_error`}
                key={owner.id}
              >
                <div className={`col-md-6 ${style.rstep01_col}`}>
                  <div className={style.field_wrapper}>
                    <FullWidthTextField
                      lightTheme
                      label="Name of the Owner/Founder*"
                      value={owner.name}
                      name="name"
                      onChange={(e) =>
                        handleOwnerChange(owner.id, "name", e.target.value)
                      }
                    />
                    {ownerErrors[owner.id]?.name && (
                      <p className={style.error}>
                        {ownerErrors[owner.id].name}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`col-md-6 ${style.rstep01_col}`}>
                  <div className={style.field_wrapper}>
                    <FullWidthTextField
                      lightTheme
                      label="Owner/Founder's Email ID*"
                      value={owner.email}
                      name="email"
                      onChange={(e) =>
                        handleOwnerChange(owner.id, "email", e.target.value)
                      }
                    />
                    {ownerErrors[owner.id]?.email && (
                      <p className={style.error}>
                        {ownerErrors[owner.id].email}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`col-md-6 ${style.rstep01_col}`}>
                  <div className={style.field_wrapper}>
                    <div className="row">
                      <div className="col-4 col-sm-4 col-md-4 ps-0">
                        <CountryCodeDropdown
                          lightTheme
                          textLabel="Code*"
                          data={codes}
                          onChange={(e, value) =>
                            handleOwnerCountryCodeChange(
                              "country_code",
                              value,
                              owner.id
                            )
                          }
                          value={countryCodeStates[owner.id]?.phone || null}
                        />
                      </div>
                      <div className="col-8 col-sm-8 col-md-8 pe-0">
                        <FullWidthTextField
                          lightTheme
                          label="Phone No*"
                          value={owner.phone}
                          onChange={(e) =>
                            handleOwnerChange(
                              owner.id,
                              "phone",
                              e.target.value.replace(/[^0-9]/g, "")
                            )
                          }
                        />
                      </div>
                    </div>
                    {ownerErrors[owner.id]?.phone && (
                      <p className={style.error}>
                        {ownerErrors[owner.id].phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`col-md-6 ${style.rstep01_col}`}>
                  <div className={style.field_wrapper}>
                    <div className="row">
                      <div className="col-4 col-sm-4 col-md-4 ps-0">
                        <CountryCodeDropdown
                          lightTheme
                          textLabel="Code*"
                          data={codes}
                          onChange={(e, value) =>
                            handleOwnerCountryCodeChange(
                              "whatsapp_country_code",
                              value,
                              owner.id
                            )
                          }
                          value={countryCodeStates[owner.id]?.whatsapp || null}
                        />
                      </div>
                      <div className="col-8 col-sm-8 col-md-8 pe-0">
                        <FullWidthTextField
                          lightTheme
                          label="Whatsapp Number*"
                          value={owner.whatsapp_no}
                          name="whatsapp_no"
                          onChange={(e) =>
                            handleOwnerChange(
                              owner.id,
                              "whatsapp_no",
                              e.target.value.replace(/[^0-9]/g, "")
                            )
                          }
                        />
                      </div>
                    </div>
                    {ownerErrors[owner.id]?.whatsapp_no && (
                      <p className={style.error}>
                        {ownerErrors[owner.id].whatsapp_no}
                      </p>
                    )}
                  </div>
                  <div className={style.checkbox_wrapper}>
                    <label
                      className={style.checkbox_label}
                      htmlFor={`sameas_${owner.id}`}
                    >
                      <input
                        type="checkbox"
                        className={style.check_box}
                        id={`sameas_${owner.id}`}
                        checked={owner.same_as_phone}
                        onChange={(e) =>
                          handleWAChangeOwner(e.target.checked, owner.id)
                        }
                      />
                      Same as phone number
                    </label>
                  </div>
                  <div className={style.add_delete_icon}>
                    <img
                      src={blackDeleteicon}
                      alt="icon"
                      className={style.deleteicon}
                      onClick={() => handleDeleteOwner(owner.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className={style.add_category}>
              <div className={style.dashed_line}></div>
              <div className={style.add_flex} onClick={handleAddOwners}>
                <img src={plusicon} alt="icon" className={style.icon} />
                <div className={style.title}>Add Owner/Founder</div>
              </div>
              <div className={style.dashed_line}></div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div className={style.next_button} onClick={handleSubmit}>
            <div className={style.text}>Next</div>
            <img src={rightarrowwhite} alt="icon" className={style.icon} />
          </div>
          <div
            className={style.back_button}
            onClick={() => {
              previousStep();
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

export default RStep02LT;
