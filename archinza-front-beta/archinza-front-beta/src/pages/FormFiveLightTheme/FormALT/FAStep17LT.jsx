import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";
import config from "../../../config/config";
import http from "../../../helpers/http";
import Joi from "joi";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import helper from "../../../helpers/helper";
import {
  businessProfileEditURL2,
  congratulationsLightURL,
} from "../../../components/helpers/constant-words";
import { useNavigate } from "react-router-dom";
import AutoCompleteField from "../../../components/AutoCompleteField/AutoCompleteField";
import { values } from "lodash";
import { styled } from "@mui/material/styles";
import { Checkbox, FormControlLabel } from "@mui/material";
import CustomCheckBoxInput from "../../../components/CustomCheckBoxInput/CustomCheckBoxInput";
import WaitScreen from "../../WaitScreen/WaitScreen";
import ConfirmationPopup from "../Confirmation/ConfirmationPopup";
import targetAttributesFile from "../../../config/target_attributes.json";
import blankPdfFile from "../../../config/blank.pdf";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const FAStep17LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const businessTypesOptions = [
    {
      index: "1",
      options: [
        "Project/Business",
        "Product/Material Showcase",
        "Jobs/Internship/Hiring",
        "Media/PR/Events",
      ],
    },
    {
      index: "2",
      options: [
        "Project/Business",
        "Product/Material Showcase",
        "Jobs/Internship/Hiring",
        "Media/PR/Events",
      ],
    },
    {
      index: "3",
      options: ["Product/Material Showcase", "Media / PR / Events"],
    },
    {
      index: "4",
      options: ["Product/Material Showcase", "Media / PR / Events"],
    },
    {
      index: "5",
      options: [
        "Project/Business",
        "Jobs/Internship/Hiring",
        "Media/PR/Events",
      ],
    },
    {
      index: "6",
      options: [
        "Project/Business",
        "Product/Material Showcase",
        "Jobs/Internship/Hiring",
        "Media/PR/Events",
      ],
    },
  ];
  const base_url = config.api_url;
  const [formError, setFormError] = useState({});
  const [hasSubmittedMedia, setHasSubmittedMedia] = useState(false);
  const BusinessAccountContext = useBusinessContext();
  const navigate = useNavigate();
  const [displayedOptions, setDisplayedOptions] = useState([]);

  const [formData, setFormData] = useState({
    enquiry_preferences: {
      projects_business: {
        contact_person: "Both",
        contact_methods: ["Email Id", "WhatsApp"],
      },
      product_material: {
        contact_person: "Both",
        contact_methods: ["Email Id", "WhatsApp"],
      },
      jobs_internships: {
        contact_person: "Both",
        contact_methods: ["Email Id", "WhatsApp"],
      },
      media_pr: {
        contact_person: "Both",
        contact_methods: ["Email Id", "WhatsApp"],
      },
    },
  });

  const validate = async (data) => {
    const enquiryPreferencesSchema = {};

    if (shouldRenderOption("Project/ Business")) {
      enquiryPreferencesSchema.projects_business = Joi.object({
        contact_person: Joi.string().required().messages({
          "string.empty": "Select a contact person option",
          "any.required": "Select a contact person option",
        }),
        contact_methods: Joi.array().min(1).required().messages({
          "array.min": "Select at least one contact method",
          "any.required": "Select at least one contact method",
        }),
      }).required();
    }

    if (shouldRenderOption("Product / Material Showcase")) {
      enquiryPreferencesSchema.product_material = Joi.object({
        contact_person: Joi.string().required().messages({
          "string.empty": "Select a contact person option",
          "any.required": "Select a contact person option",
        }),
        contact_methods: Joi.array().min(1).required().messages({
          "array.min": "Select at least one contact method",
          "any.required": "Select at least one contact method",
        }),
      }).required();
    }

    if (shouldRenderOption("Jobs/ Internship / Hiring")) {
      enquiryPreferencesSchema.jobs_internships = Joi.object({
        contact_person: Joi.string().required().messages({
          "string.empty": "Select a contact person option",
          "any.required": "Select a contact person option",
        }),
        contact_methods: Joi.array().min(1).required().messages({
          "array.min": "Select at least one contact method",
          "any.required": "Select at least one contact method",
        }),
      }).required();
    }

    if (shouldRenderOption("Media / PR /Events")) {
      enquiryPreferencesSchema.media_pr = Joi.object({
        contact_person: Joi.string().required().messages({
          "string.empty": "Select a contact person option",
          "any.required": "Select a contact person option",
        }),
        contact_methods: Joi.array().min(1).required().messages({
          "array.min": "Select at least one contact method",
          "any.required": "Select at least one contact method",
        }),
      }).required();
    }

    const schema = Joi.object({
      enquiry_preferences: Joi.object(enquiryPreferencesSchema).required(),
    }).options({ allowUnknown: true });
    const { error } = schema.validate(data, config.joiOptions);

    const errors = {};
    if (error) {
      error.details.forEach((field) => {
        // Extract the specific path for nested errors
        if (field.path.length > 2) {
          const category = field.path[1]; // projects_business, product_material, etc.
          const field_type = field.path[2]; // contact_person or contact_methods
          errors[`${category}_${field_type}`] = field.message;
        } else {
          errors[field.path[0]] = field.message;
        }
      });
    }

    return errors;
  };

  const fetchFileFromUrl = async (url, onProgress) => {
    if (url.startsWith("https")) {
      url = url.substring(url.lastIndexOf("/") + 1);
    }

    try {
      const { data } = await http.get(
        `${base_url}/business/get-file?fileName=${url}`,
        {
          timeout: 300000, // 5 minutes timeout
          onDownloadProgress: onProgress,
        }
      );

      const arrayBuffer = new Uint8Array(data?.data).buffer;
      const blob = new Blob([arrayBuffer], {
        type: "application/octet-stream",
      });
      return new File([blob], url, { type: blob.type });
    } catch (error) {
      console.error(`Failed to fetch file ${url}:`, error);
      throw error;
    }
  };

  const redirectToPrevStep = async () => {
    console.log(BusinessAccountContext?.data?.is_services_manually);
    if (BusinessAccountContext?.data?.is_services_manually === true) {
      previousStep();
    } else {
      // const questionsData = await http.get(
      //   `${config.api_url}/business/business-questions`
      // );
      // const business_types = BusinessAccountContext.data.business_types.map(
      //   (it) => it._id
      // );
      // let stepNumber = helper.redirectBusinessUserBack(
      //   questionsData?.data,
      //   business_types,
      //   currentStep
      // );
      goToStep(16);
    }
  };

  const handleSubmit = async () => {
    let errors = await validate(formData);
    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }
    setIsConfirmationPopup(true);
  };

  const callApi = async () => {
    let saveStatus = "completed";
    if (BusinessAccountContext?.data?.status > currentStep) {
      saveStatus = BusinessAccountContext.data.status;
    }

    let data = await http.post(
      base_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        ...formData,
        status: saveStatus,
      }
    );
    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        ...formData,
        status: saveStatus,
      });
      // if (!hasSubmittedMedia) {
      // }
    }
    // setIsAboutModal(true);
    navigate(businessProfileEditURL2);
    window.scrollTo(0, 0);
  };

  const handleConfirmationAgree = () => {
    setIsConfirmationPopup(false); // Hide confirmation popup
    callApi();
    // setIsAboutModal(true);
  };

  const handleSelectChange = (value, category) => {
    setFormData((prev) => ({
      ...prev,
      enquiry_preferences: {
        ...prev.enquiry_preferences,
        [category]: {
          ...prev.enquiry_preferences[category],
          contact_person: value || "Both",
        },
      },
    }));
  };

  const handleCheckboxChange = (category, value, isChecked) => {
    setFormData((prev) => {
      const currentMethods = [
        ...prev.enquiry_preferences[category].contact_methods,
      ];

      if (isChecked) {
        // Add value if not present
        if (!currentMethods.includes(value)) {
          currentMethods.push(value);
        }
      } else {
        // Remove value if present
        const index = currentMethods.indexOf(value);
        if (index !== -1) {
          currentMethods.splice(index, 1);
        }
      }

      return {
        ...prev,
        enquiry_preferences: {
          ...prev.enquiry_preferences,
          [category]: {
            ...prev.enquiry_preferences[category],
            contact_methods: currentMethods,
          },
        },
      };
    });
  };

  const countries = [
    {
      label: "Owner/s",
      value: "Owner/s",
    },
    {
      label: "Business Contact Person",
      value: "Business Contact Person",
    },
    {
      label: "Both",
      value: "Both",
    },
  ];

  const contactMethodOptions = [
    { label: "Email Id", value: "Email Id" },
    { label: "WhatsApp", value: "WhatsApp" },
    { label: "Phone Call", value: "Phone Call" },
  ];

  useEffect(() => {
    // Load existing data if available
    if (BusinessAccountContext?.data?.enquiry_preferences) {
      console.log(BusinessAccountContext.data.enquiry_preferences);
      setFormData((prev) => ({
        ...prev,
        enquiry_preferences: {
          projects_business: {
            contact_person:
              BusinessAccountContext.data.enquiry_preferences.projects_business
                ?.contact_person || "Both",
            contact_methods: BusinessAccountContext.data.enquiry_preferences
              .projects_business?.contact_methods?.length
              ? BusinessAccountContext.data.enquiry_preferences
                  .projects_business?.contact_methods
              : ["Email Id", "WhatsApp"],
          },
          product_material: {
            contact_person:
              BusinessAccountContext.data.enquiry_preferences.product_material
                ?.contact_person || "Both",
            contact_methods: BusinessAccountContext.data.enquiry_preferences
              .product_material?.contact_methods?.length
              ? BusinessAccountContext.data.enquiry_preferences.product_material
                  ?.contact_methods
              : ["Email Id", "WhatsApp"],
          },
          jobs_internships: {
            contact_person:
              BusinessAccountContext.data.enquiry_preferences.jobs_internships
                ?.contact_person || "Both",
            contact_methods: BusinessAccountContext.data.enquiry_preferences
              .jobs_internships?.contact_methods?.length
              ? BusinessAccountContext.data.enquiry_preferences.jobs_internships
                  ?.contact_methods
              : ["Email Id", "WhatsApp"],
          },
          media_pr: {
            contact_person:
              BusinessAccountContext.data.enquiry_preferences.media_pr
                ?.contact_person || "Both",
            contact_methods: BusinessAccountContext.data.enquiry_preferences
              .media_pr?.contact_methods?.length
              ? BusinessAccountContext.data.enquiry_preferences.media_pr
                  ?.contact_methods
              : ["Email Id", "WhatsApp"],
          },
        },
      }));
    }

    // Determine displayed options based on business types
    const businessTypes = BusinessAccountContext.data?.business_types || [];
    const prefixes = businessTypes.map((bt) => bt.prefix);
    if (prefixes.length > 0) {
      const relevantOptions = businessTypesOptions.filter((opt) =>
        prefixes.includes(opt.index)
      );

      if (relevantOptions.length > 0) {
        const bestOption = relevantOptions.reduce((prev, current) =>
          prev.options.length > current.options.length ? prev : current
        );
        setDisplayedOptions(bestOption.options);
      }
    }
  }, [currentStep, BusinessAccountContext?.data]);

  useEffect(() => {
    if (isActive) {
      progressStatus((18 / 18) * 100);
    }
  }, [isActive]);

  // popup state will remove
  const [isAboutModal, setIsAboutModal] = useState(false);
  const [isConfirmationPopup, setIsConfirmationPopup] = useState(false);
  const handleShow = () => setIsConfirmationPopup(true);
  const handleHideConfirmationPopup = () => setIsConfirmationPopup(false);
  const handleHide = () => setIsAboutModal(false);
  useEffect(() => {
    if (isAboutModal) {
      const timer = setTimeout(() => {
        setIsAboutModal(false);
        navigate(businessProfileEditURL2);
      }, 5000);

      return () => clearTimeout(timer); // Cleanup on unmount or if modal closes early
    }
  }, [isAboutModal]);

  const shouldRenderOption = (optionName) => {
    const normalizedOptionName = optionName.replace(/\s/g, "").toLowerCase();
    return displayedOptions.some(
      (opt) => opt.replace(/\s/g, "").toLowerCase() === normalizedOptionName
    );
  };

  return (
    <>
      <LightThemeBackground />
      {/* demo popup */}
      <WaitScreen
        show={isAboutModal}
        onHide={() => setIsAboutModal(false)}
        handleClose={handleHide}
      />
      {/* demo popup end */}
      <div className={style.text_container}>
        <p className={style.page_title}>
          One last question, we're almost done!
        </p>
        <h1 className={style.title}>
          How would you like to receive your enquiries for the following?*
        </h1>
        <h2
          className={`${style.description} ${style.desc_renovation} ${style.aditional_spacing}`}
        >
          This is so that clients know how to touch base for their queries.
        </h2>
        <form
          action=""
          className="form_recive_queries d-flex justify-content-center"
        >
          <div className={`row ${style.spacing_rl_row_recive_queries}`}>
            {shouldRenderOption("Project/Business") && (
              <div
                className={`col-lg-6  ${style.rstep01_col}
            ${style.col_padding_recive_queries01}`}
              >
                <div
                  className={`${style.field_wrapper} ${style.form_recive_queries_single_wrapper}`}
                >
                  <div className={style.heading_recive_queries}>
                    Projects/Business
                  </div>
                  <AutoCompleteField
                    lightTheme
                    key="projects_contact_person"
                    textLabel="Person to contact"
                    data={countries}
                    value={
                      countries.find(
                        (option) =>
                          option.value ===
                          formData.enquiry_preferences.projects_business
                            .contact_person
                      ) || { value: "Both" }
                    }
                    onChange={(e, option) =>
                      handleSelectChange(
                        option.value || "Both",
                        "projects_business"
                      )
                    }
                    disablePortal
                  />
                  <div id="projects_business_contact_person_error">
                    {formError.projects_business_contact_person && (
                      <p className={style.error}>
                        {formError.projects_business_contact_person}
                      </p>
                    )}
                  </div>

                  {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                  <div className={style.custom_check_box_warper_recive_queries}>
                    {contactMethodOptions.map((method, index) => (
                      <CustomCheckBoxInput
                        key={index}
                        label={method.label}
                        checked={formData?.enquiry_preferences?.projects_business?.contact_methods?.includes?.(
                          method.value
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "projects_business",
                            method.value,
                            e.target.checked
                          )
                        }
                      />
                    ))}
                  </div>
                  <div id="projects_business_contact_methods_error">
                    {formError.projects_business_contact_methods && (
                      <p className={style.error}>
                        {formError.projects_business_contact_methods}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {shouldRenderOption("Product / Material Showcase") && (
              <div
                className={`col-lg-6  ${style.rstep01_col} ${style.col_padding_recive_queries02}`}
              >
                <div className={style.field_wrapper}>
                  <div className={style.heading_recive_queries}>
                    Product/Material Showcase
                  </div>
                  <AutoCompleteField
                    lightTheme
                    key="product_material_contact_person"
                    textLabel="Person to contact"
                    data={countries}
                    value={
                      countries.find(
                        (option) =>
                          option.value ===
                          formData.enquiry_preferences.product_material
                            .contact_person
                      ) || { value: "Both" }
                    }
                    onChange={(e, option) =>
                      handleSelectChange(
                        option.value || "Both",
                        "product_material"
                      )
                    }
                    disablePortal
                  />
                  <div id="product_material_contact_person_error">
                    {formError.product_material_contact_person && (
                      <p className={style.error}>
                        {formError.product_material_contact_person}
                      </p>
                    )}
                  </div>

                  {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                  <div className={style.custom_check_box_warper_recive_queries}>
                    {contactMethodOptions.map((method, index) => (
                      <CustomCheckBoxInput
                        key={index}
                        label={method.label}
                        checked={formData?.enquiry_preferences?.product_material?.contact_methods?.includes?.(
                          method.value
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "product_material",
                            method.value,
                            e.target.checked
                          )
                        }
                      />
                    ))}
                  </div>
                  <div id="product_material_contact_methods_error">
                    {formError.product_material_contact_methods && (
                      <p className={style.error}>
                        {formError.product_material_contact_methods}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {shouldRenderOption("Jobs/ Internship / Hiring") && (
              <div
                className={`col-lg-6  ${style.rstep01_col} ${style.col_padding_recive_queries03}`}
              >
                <div className={style.field_wrapper}>
                  <div className={style.heading_recive_queries}>
                    Jobs/Internship/Hiring
                  </div>
                  <AutoCompleteField
                    lightTheme
                    key="jobs_internships_contact_person"
                    textLabel="Person to contact"
                    data={countries}
                    value={
                      countries.find(
                        (option) =>
                          option.value ===
                          formData.enquiry_preferences.jobs_internships
                            .contact_person
                      ) || { value: "Both" }
                    }
                    onChange={(e, option) =>
                      handleSelectChange(
                        option.value || "Both",
                        "jobs_internships"
                      )
                    }
                    disablePortal
                  />
                  <div id="jobs_internships_contact_person_error">
                    {formError.jobs_internships_contact_person && (
                      <p className={style.error}>
                        {formError.jobs_internships_contact_person}
                      </p>
                    )}
                  </div>

                  {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                  <div className={style.custom_check_box_warper_recive_queries}>
                    {contactMethodOptions.map((method, index) => (
                      <CustomCheckBoxInput
                        key={index}
                        label={method.label}
                        checked={formData?.enquiry_preferences?.jobs_internships?.contact_methods?.includes?.(
                          method.value
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "jobs_internships",
                            method.value,
                            e.target.checked
                          )
                        }
                      />
                    ))}
                  </div>
                  <div id="jobs_internships_contact_methods_error">
                    {formError.jobs_internships_contact_methods && (
                      <p className={style.error}>
                        {formError.jobs_internships_contact_methods}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {shouldRenderOption("Media / PR /Events") && (
              <div
                className={`col-lg-6  ${style.rstep01_col} ${style.col_padding_recive_queries04}`}
              >
                <div className={style.field_wrapper}>
                  <div className={style.heading_recive_queries}>
                    Media/PR/Events
                  </div>
                  <AutoCompleteField
                    lightTheme
                    key="media_pr_contact_person"
                    textLabel="Person to contact"
                    data={countries}
                    value={
                      countries.find(
                        (option) =>
                          option.value ===
                          formData.enquiry_preferences.media_pr.contact_person
                      ) || { value: "Both" }
                    }
                    onChange={(e, option) =>
                      handleSelectChange(option.value || "Both", "media_pr")
                    }
                    disablePortal
                  />
                  <div id="media_pr_contact_person_error">
                    {formError.media_pr_contact_person && (
                      <p className={style.error}>
                        {formError.media_pr_contact_person}
                      </p>
                    )}
                  </div>

                  {/* <p className={style.error}>
                        Error messsage here error messsage
                      </p> */}
                  <div className={style.custom_check_box_warper_recive_queries}>
                    {contactMethodOptions.map((method, index) => (
                      <CustomCheckBoxInput
                        key={index}
                        label={method.label}
                        checked={formData?.enquiry_preferences?.media_pr?.contact_methods?.includes?.(
                          method.value
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "media_pr",
                            method.value,
                            e.target.checked
                          )
                        }
                      />
                    ))}
                  </div>
                  <div id="media_pr_contact_methods_error">
                    {formError.media_pr_contact_methods && (
                      <p className={style.error}>
                        {formError.media_pr_contact_methods}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
        {/* </div> */}
        {/* <div id="price_rating_error">
          <p className={`${style.top_error_with_space} ${style.error}`}>
            {formError.price_rating}
          </p>
        </div> */}
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div className={style.next_button} onClick={handleSubmit}>
            <div className={style.text}>Next</div>
            <img
              src={rightarrowwhite}
              alt="icon"
              className={style.icon}
              loading="lazy"
            />
          </div>
          <div
            className={style.back_button}
            onClick={() => {
              redirectToPrevStep();
              window.scrollTo(0, 0);
            }}
          >
            Back
          </div>
        </div>
        <LogoutText />
      </div>
      <ConfirmationPopup
        show={isConfirmationPopup}
        onHide={() => setIsConfirmationPopup(false)}
        handleClose={() => setIsConfirmationPopup(false)}
        handleSubmit={handleConfirmationAgree}
      />
    </>
  );
};

export default FAStep17LT;
