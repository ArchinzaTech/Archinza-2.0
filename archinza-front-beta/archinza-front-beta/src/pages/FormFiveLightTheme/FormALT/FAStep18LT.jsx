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

const employeeCountArr = ["Low", "Medium", "High"];

const FAStep17LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const base_url = config.api_url;
  const [formError, setFormError] = useState({});
  const BusinessAccountContext = useBusinessContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    enquiry_preferences: {
      projects_business: {
        contact_person: "",
        contact_methods: [],
      },
      product_material: {
        contact_person: "",
        contact_methods: [],
      },
      jobs_internships: {
        contact_person: "",
        contact_methods: [],
      },
      media_pr: {
        contact_person: "",
        contact_methods: [],
      },
    },
  });

  const validate = async (data) => {
    let schemaObj = {
      enquiry_preferences: Joi.object({
        projects_business: Joi.object({
          contact_person: Joi.string().required().messages({
            "string.empty": "Select a contact person option",
            "any.required": "Select a contact person option",
          }),
          contact_methods: Joi.array().min(1).required().messages({
            "array.min": "Select at least one contact method",
            "any.required": "Select at least one contact method",
          }),
        }).required(),
        product_material: Joi.object({
          contact_person: Joi.string().required().messages({
            "string.empty": "Select a contact person option",
            "any.required": "Select a contact person option",
          }),
          contact_methods: Joi.array().min(1).required().messages({
            "array.min": "Select at least one contact method",
            "any.required": "Select at least one contact method",
          }),
        }).required(),
        jobs_internships: Joi.object({
          contact_person: Joi.string().required().messages({
            "string.empty": "Select a contact person option",
            "any.required": "Select a contact person option",
          }),
          contact_methods: Joi.array().min(1).required().messages({
            "array.min": "Select at least one contact method",
            "any.required": "Select at least one contact method",
          }),
        }).required(),
        media_pr: Joi.object({
          contact_person: Joi.string().required().messages({
            "string.empty": "Select a contact person option",
            "any.required": "Select a contact person option",
          }),
          contact_methods: Joi.array().min(1).required().messages({
            "array.min": "Select at least one contact method",
            "any.required": "Select at least one contact method",
          }),
        }).required(),
      }).required(),
    };
    const schema = Joi.object(schemaObj).options({ allowUnknown: true });
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

  const redirectToPrevStep = async () => {
    const questionsData = await http.get(
      `${config.api_url}/business/business-questions`
    );
    const business_types = BusinessAccountContext.data.business_types.map(
      (it) => it._id
    );
    let stepNumber = helper.redirectBusinessUserBack(
      questionsData?.data,
      business_types,
      BusinessAccountContext.data.status
    );
    goToStep(stepNumber);
  };

  const handleSubmit = async () => {
    console.log(formData);

    let errors = await validate(formData);

    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }

    // let saveStatus = "completed";
    // if (BusinessAccountContext?.data?.status > currentStep) {
    //   saveStatus = BusinessAccountContext.data.status;
    // }
    let data = await http.post(
      base_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        ...formData,
        // status: saveStatus,
      }
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        ...formData,
        // status: saveStatus,
      });
      // navigate(congratulationsLightURL);
      setIsAboutModal(true);
      window.scrollTo(0, 0);
    }
  };

  const handleSelectChange = (value, category) => {
    setFormData((prev) => ({
      ...prev,
      enquiry_preferences: {
        ...prev.enquiry_preferences,
        [category]: {
          ...prev.enquiry_preferences[category],
          contact_person: value,
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

  // const labelsData01 = [
  //   {
  //     id: 1,
  //     label: "Email Id",
  //     value: "Email Id",
  //   },
  //   {
  //     id: 2,
  //     label: "WhatsApp",
  //     value: "WhatsApp",
  //   },
  //   {
  //     id: 3,
  //     label: "Phone Call",
  //     value: "Phone Call",
  //   },
  // ];
  // const labelsData02 = [
  //   {
  //     id: 4,
  //     label: "Email Id",
  //     value: "Email Id",
  //   },
  //   {
  //     id: 5,
  //     label: "WhatsApp",
  //     value: "WhatsApp",
  //   },
  //   {
  //     id: 6,
  //     label: "Phone Call",
  //     value: "Phone Call",
  //   },
  // ];
  // const labelsData03 = [
  //   {
  //     id: 7,
  //     label: "Email Id",
  //     value: "Email Id",
  //   },
  //   {
  //     id: 8,
  //     label: "WhatsApp",
  //     value: "WhatsApp",
  //   },
  //   {
  //     id: 9,
  //     label: "Phone Call",
  //     value: "Phone Call",
  //   },
  // ];
  // const labelsData04 = [
  //   {
  //     id: 10,
  //     label: "Email Id",
  //     value: "Email Id",
  //   },
  //   {
  //     id: 11,
  //     label: "WhatsApp",
  //     value: "WhatsApp",
  //   },
  //   {
  //     id: 12,
  //     label: "Phone Call",
  //     value: "Phone Call",
  //   },
  // ];

  const contactMethodOptions = [
    { label: "Email Id", value: "Email Id" },
    { label: "WhatsApp", value: "WhatsApp" },
    { label: "Phone Call", value: "Phone Call" },
  ];

  // State to manage the checked status for each checkbox
  // const [checkedState, setCheckedState] = useState(
  //   labelsData01.reduce((acc, item) => {
  //     acc[item.id] = false;
  //     return acc;
  //   }, {}),
  //   labelsData02.reduce((acc, item) => {
  //     acc[item.id] = false;
  //     return acc;
  //   }, {}),
  //   labelsData03.reduce((acc, item) => {
  //     acc[item.id] = false;
  //     return acc;
  //   }, {}),
  //   labelsData04.reduce((acc, item) => {
  //     acc[item.id] = false;
  //     return acc;
  //   }, {})
  // );

  useEffect(() => {
    // Load existing data if available
    if (BusinessAccountContext?.data?.enquiry_preferences) {
      console.log(BusinessAccountContext?.data?.enquiry_preferences);
      setFormData((prev) => ({
        ...prev,
        enquiry_preferences: BusinessAccountContext.data.enquiry_preferences,
      }));
    }
  }, [currentStep, BusinessAccountContext?.data]);

  useEffect(() => {
    if (isActive) {
      progressStatus((15 / 15) * 100);
    }
  }, [isActive]);

  // popup state will remove
  const [isAboutModal, setIsAboutModal] = useState(false);
  // const handleShow = () => setIsAboutModal(true);
  const handleHide = () => setIsAboutModal(false);
  useEffect(() => {
    if (isAboutModal) {
      const timer = setTimeout(() => {
        setIsAboutModal(false);
        //  navigate(businessProfileEditURL2);  need to uncomment
      }, 5000);

      return () => clearTimeout(timer); // Cleanup on unmount or if modal closes early
    }
  }, [isAboutModal]);

  return (
    <>
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
          How would you like to receive your enquiries?
        </h1>
        <form
          action=""
          className="form_recive_queries d-flex justify-content-center"
        >
          <div className={`row ${style.spacing_rl_row_recive_queries}`}>
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
                  textLabel="Select One"
                  data={countries}
                  value={
                    countries.find(
                      (option) =>
                        option.value ===
                        formData.enquiry_preferences.projects_business
                          .contact_person
                    ) || null
                  }
                  onChange={(e, option) =>
                    handleSelectChange(option.value, "projects_business")
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
                      checked={formData.enquiry_preferences.projects_business.contact_methods.includes(
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
                  textLabel="Select One"
                  data={countries}
                  value={
                    countries.find(
                      (option) =>
                        option.value ===
                        formData.enquiry_preferences.product_material
                          .contact_person
                    ) || null
                  }
                  onChange={(e, option) =>
                    handleSelectChange(option.value, "product_material")
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
                      checked={formData.enquiry_preferences.product_material.contact_methods.includes(
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
            <div
              className={`col-lg-6  ${style.rstep01_col} ${style.col_padding_recive_queries03}`}
            >
              <div className={style.field_wrapper}>
                <div className={style.heading_recive_queries}>
                  Jobs/Internships
                </div>
                <AutoCompleteField
                  lightTheme
                  key="jobs_internships_contact_person"
                  textLabel="Select One"
                  data={countries}
                  value={
                    countries.find(
                      (option) =>
                        option.value ===
                        formData.enquiry_preferences.jobs_internships
                          .contact_person
                    ) || null
                  }
                  onChange={(e, option) =>
                    handleSelectChange(option.value, "jobs_internships")
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
                      checked={formData.enquiry_preferences.jobs_internships.contact_methods.includes(
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
            <div
              className={`col-lg-6  ${style.rstep01_col} ${style.col_padding_recive_queries04}`}
            >
              <div className={style.field_wrapper}>
                <div className={style.heading_recive_queries}>Media/PR</div>
                <AutoCompleteField
                  lightTheme
                  key="media_pr_contact_person"
                  textLabel="Select One"
                  data={countries}
                  value={
                    countries.find(
                      (option) =>
                        option.value ===
                        formData.enquiry_preferences.media_pr.contact_person
                    ) || null
                  }
                  onChange={(e, option) =>
                    handleSelectChange(option.value, "media_pr")
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
                      checked={formData.enquiry_preferences.media_pr.contact_methods.includes(
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
    </>
  );
};

export default FAStep17LT;
