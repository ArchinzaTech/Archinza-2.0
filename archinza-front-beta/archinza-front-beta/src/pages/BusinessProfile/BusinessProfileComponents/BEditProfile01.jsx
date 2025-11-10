import React, { useState, useEffect, useRef } from "react";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import BEAutocompleteOthers from "../DataTypesComponents/BEAutocompleteOthers";
import {
  addmoreIcon,
  behanceiconb,
  blackDeleteicon,
  closeIcon,
  editicon,
  errorFailed,
  errorSuccess,
  fbiconb,
  greentick,
  images,
  instaWhite,
  linkediniconb,
  rightarrowwhite,
  websiteiconb,
  whitetick,
} from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";
import YearPicker from "../../../components/YearPicker/YearPicker";
import BusinessProfileModal from "../../../components/BusinessProfile/BusinessProfileModal";
import { useWindowSize } from "react-use";
import BusinessUploadModal from "../../../components/BusinessUploadModal/BusinessUploadModal";
import BusinessViewGallery from "../../../components/BusinessViewGallery/BusinessViewGallery";
import AutoCompleteField from "../../../components/AutoCompleteField/AutoCompleteField";
import { useAuth } from "../../../context/Auth/AuthState";
import http from "../../../helpers/http";
import { useGlobalDataContext } from "../../../context/GlobalData/GlobalDataState";
import { businessProfileData } from "../../../db/businessProfileData";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import config from "../../../config/config";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import dayjs from "dayjs";
import SelectDropdown from "../../../components/SelectDropdown/SelectDropdown";
import style from "../../FormFiveLightTheme/Form/formfivelighttheme.module.scss";
import Joi from "joi";
import { message } from "antd";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import BusinessNameModal from "../../../components/BusinessNameModal/BusinessNameModal";
import BEAutocompleteTypology from "../DataTypesComponents/BEAutocompleteOthersNew";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";

const currencyArr = ["INR", "USD"];
const unitArr = ["sq.ft.", "sq.m."];
const aws_object_url = config.aws_object_url;

const completedGalleryArr = [
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
];

const projectRendersArr = [
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
];

const wipSiteArr = [
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
];

const mediaUploadsArr = [
  images.projectGallery01.image,
  images.projectGallery01.image,
];

const modalDataArr = [
  {
    description: [
      "Product Catalogues/Brochures",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    ],
  },
  {
    description: [
      "Completed Project Photos/Videos",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    ],
  },
  {
    description: [
      "Project Renders",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    ],
  },
  {
    description: [
      "Work In Progress - Site Photos/Videos",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    ],
  },
  {
    description: [
      "Other Media",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    ],
  },
  {
    description: [
      "Take Us Through Your Work Space",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    ],
  },
];

const companyProfilesData = [
  "arch_while_furthermore.tar",
  "speedily_amongst.abw,blizzard.wav",
  "calculating_whose.jpe,normal_psst.txt",
];

const galleryData = [
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
];

const BEditProfile01 = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [newToggle, setNewToggle] = useState(true);
  const [upload, setUpload] = useState(false);
  const [validQuestionFields, setValidQuestionFields] = useState([]);
  //loading state
  const [isUpdatingMedia, setIsUpdatingMedia] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [editingEmailIndex, setEditingEmailIndex] = useState(null);

  const [error] = useState(false);
  const [sections, setSections] = useState({
    0: {
      selectedOptions: [],
      tempSelectedOptions: [],
      servicesData: [],
      errors: {},
    },
    1: {
      selectedOptions: [],
      tempSelectedOptions: [],
      businessesList: [],
      errors: {},
    },
    2: {
      selectedValue: "",
      tempSelectedValue: "",
      errors: {},
    },
    3: {
      emailTypes: [],
      selectedValues: [],
      tempSelectedValues: [],
      errors: {},
    },
    4: {
      websiteLink: "",
      linkedinLink: "",
      behanceLink: "",
      instagramLink: "",
      other: "",
      gstNumber: "",
      tempValues: {
        websiteLink: "",
        linkedinLink: "",
        behanceLink: "",
        instagramLink: "",
        other: "",
        gstNumber: "",
      },
      errors: {},
    },
    5: {
      selectedOptions: [],
      tempSelectedOptions: [],
      globalData: [],
      tempGlobalData: [],
      allSelected: false,
      allOptions: [],
      tempSelectedUnit: "",
      selectedUnit: "",
      visibility: null,
      errors: {},
    },
    6: {
      selectedOption: "",
      tempSelectedOption: "",
      locationList: [],
      visibility: null,
      errors: {},
    },
    7: {
      selectedOptions: [],
      tempSelectedOptions: [],
      typologyList: [],
      visibility: null,
      errors: {},
    },
    8: {
      selectedOptions: [],
      tempSelectedOptions: [],
      designStyleList: [],
      visibility: null,
      errors: {},
    },
    9: {
      selectedOption: "",
      selectedCurrency: "",
      tempSelectedOption: "",
      tempSelectedCurrency: "",
      projectBudgetsList: [],
      visibility: null,
      errors: {},
    },
    10: {
      selectedOptions: [],
      tempSelectedOptions: [],
      globalData: [],
      allSelected: false,
      allOptions: [],
      visibility: null,
      errors: {},
    },
    11: {
      selectedOption: "",
      selectedCurrency: "",
      tempSelectedOption: "",
      tempSelectedCurrency: "",
      projectFeeList: [],
      visibility: null,
      errors: {},
    },
    12: {
      mediaUploads: [],
      errors: {},
    },
    13: {
      mediaUploads: [],
      errors: {},
    },
    14: {
      mediaUploads: [],
      errors: {},
    },
    15: {
      mediaUploads: [],
      errors: {},
    },
    16: {
      mediaUploads: [],
      errors: {},
    },
    17: {
      mediaUploads: [],
      errors: {},
    },
    18: {
      addressTypes: [],
      selectedValues: [],
      tempSelectedValues: [],
      errors: {},
    },
  });
  // const activeSectionData = servicesSectionData[activeQuestion];
  const [uploadSection, setUploadSection] = useState("");

  const GlobalDataContext = useGlobalDataContext();
  const BusinessContext = useBusinessContext();
  const base_url = config.api_url;

  const [catalougeShow, setCatalougeShow] = useState(
    Array(companyProfilesData.length).fill(false)
  );
  // const [completedProjectImageStates, setCompletedProjectImageStates] =
  //   useState(Array(completedGalleryArr.length).fill(false));
  // const [projectRendersStates, setProjectRendersStates] = useState(
  //   Array(projectRendersArr.length).fill(false)
  // );
  // const [wipSiteStates, setWipSiteStates] = useState(
  //   Array(wipSiteArr.length).fill(false)
  // );
  // const [mediaUploadsStates, setmediaUploadsStates] = useState(
  //   Array(mediaUploadsArr.length).fill(false)
  // );
  // const [workspaceMediaStates, setWorkspaceMediaStates] = useState(
  //   Array(mediaUploadsArr.length).fill(false)
  // );
  const [projectImageHeight, setProjectImageHeight] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [uploadFile, setUploadFile] = useState(false);
  const [galleryShow, setGalleryShow] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const projectImageRef = useRef(null);
  const { width, height } = useWindowSize();

  const activeQuestionHandler = (i) => {
    if (i === activeQuestion) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(i);
    }
  };

  const selectedProjectSizeList = sections[5]?.tempSelectedOptions?.map(
    (option) => <li className="selectedValuePill">{option}</li>
  );

  const selectedProjectScopeList = sections[10]?.tempSelectedOptions?.map(
    (option) => <li className="selectedValuePill">{option}</li>
  );

  const selectedBusinessList = sections[1]?.tempSelectedOptions?.map(
    (optionId) => {
      const option = sections[1].businessesList.find(
        (businessType) => businessType._id === optionId
      );

      return (
        <li key={optionId} className="selectedValuePill">
          {option ? option.name : optionId}
        </li>
      );
    }
  );

  const projectSizeList = sections[5].tempGlobalData.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={"project_size_bedit1" + option}
      checked={sections[5].tempSelectedOptions.includes(option)}
      onChange={(e) => onChangeHandlerProjectSize(option, e, 5)}
    />
  ));

  const projectScopeList = sections[10].globalData.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={"project_scope_bedit1" + option}
      checked={sections[10]?.selectedOptions?.includes(option)}
      onChange={(e) => onChangeHandlerProjectScope(option, e, 10)}
    />
  ));

  const businessList = sections[1].businessesList.map((option) => (
    <CheckboxButton
      isChecked={sections[1].tempSelectedOptions.includes(option._id)}
      className="business_edit_checkbox"
      lightTheme
      label={option.name}
      labelId={`business_type_${option._id}`}
      onChange={() => onHandleBusinessTypeChange(option)}
    />
  ));

  const locationList = sections[6].locationList.map((option) => (
    <RadioButton
      className="business_edit_radio"
      lightTheme
      label={option}
      labelId={"location_bedit1" + option}
      name="project_location_bedit1"
      checked={sections[6].tempSelectedOption === option}
      onChange={() => handleRadioChange(option, 6)}
    />
  ));

  const budgetList = sections[9].projectBudgetsList
    // .filter((f) => f.currency === sections[9].tempSelectedCurrency)
    // .map((it) => it.type)
    .map((option) => (
      <RadioButton
        className="business_edit_radio"
        lightTheme
        label={option}
        labelId={"budgetList_bedit1" + option}
        name="budget_list_bedit1"
        checked={sections[9].tempSelectedOption === option}
        onChange={() => handleBudgetRadioChange(option, 9)}
      />
    ));

  const minFeeList = sections[11].projectFeeList
    // .filter((f) => f.currency === sections[11].tempSelectedCurrency)
    // .map((it) => it.fee)
    .map((option) => (
      <RadioButton
        className="business_edit_radio"
        lightTheme
        label={option}
        labelId={"min_fee_bedit1" + option}
        name="min_fee_bedit1"
        checked={sections[11].tempSelectedOption === option}
        onChange={() => handleBudgetRadioChange(option, 11)}
      />
    ));

  const catalougeVisibility = (i) => {
    const newCatalougeState = [...catalougeShow];
    newCatalougeState[i] = !newCatalougeState[i];
    setCatalougeShow(newCatalougeState);
  };

  const projectsVisibility = (i, sectionId) => {
    const updatedSections = { ...sections };
    const newVisibility =
      !updatedSections[sectionId].mediaUploads[i].visibility;

    updatedSections[sectionId].mediaUploads[i].visibility = newVisibility;
    setSections(updatedSections);

    const mediaId = updatedSections[sectionId].mediaUploads[i]._id;
    setIsUpdatingMedia(true);

    handleMediaVisibility(mediaId, newVisibility, sectionId);
  };

  const handleImageClick = (img, i) => {
    window.open(`${aws_object_url}business/${img.url}`, "_blank");
    // if (img.mimetype === "application/pdf") {
    // } else if (img.mimetype.includes("video")) {
    //   window.open(`${base_url}/public/uploads/business/${img.url}`, "_blank");
    // } else {
    //   window.open(`${base_url}/public/uploads/business/${img.url}`, "_blank");
    // }
  };

  const handleWorkspaceCategoryChange = async (option) => {
    const filteredCategoryData =
      BusinessContext?.data?.a_workspace_category_media?.filter(
        (it) => it.category === option
      );

    updateSectionData(18, {
      selectedCategory: option,
      workSpaceData: filteredCategoryData,
    });
  };

  const handleMediaVisibility = async (mediaId, visibility, sectionId) => {
    const { data } = await http.put(
      `${base_url}/business/business-edit/media/${mediaId}`,
      { visibility: visibility }
    );
    if (data) {
      setSections((prevSections) => {
        const updatedMediaUploads = prevSections[sectionId].mediaUploads.map(
          (media) =>
            media._id === mediaId ? { ...media, visibility: visibility } : media
        );

        return {
          ...prevSections,
          [sectionId]: {
            ...prevSections[sectionId],
            mediaUploads: updatedMediaUploads,
          },
        };
      });
      setIsUpdatingMedia(false);
      message.success(`Media Visibility Updated`);
      console.log("Details Updated");
    }
  };

  const handleModalData = (i) => {
    setModalData(modalDataArr[i].description);
    setModalShow(true);
  };

  const handleSectionChange = (sectionId, index, field, value) => {
    setSections((prevSections) => {
      const updatedTempSelectedValues = [
        ...prevSections[sectionId].tempSelectedValues,
      ];

      if (!updatedTempSelectedValues[index]) {
        updatedTempSelectedValues[index] = {};
      }

      updatedTempSelectedValues[index] = {
        ...updatedTempSelectedValues[index],
        [field]: value,
      };

      return {
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          tempSelectedValues: updatedTempSelectedValues,
        },
      };
    });
  };

  // EmailIDs section
  // Function to handle editing an email
  const handleEditEmail = (index) => {
    setEditingEmailIndex(index);
  };

  // Function to update email input
  const handleEmailInputChange = (e, index) => {
    setSections((prevSections) => {
      const updatedTempSelectedValues = [...prevSections[3].tempSelectedValues];
      updatedTempSelectedValues[index] = {
        ...updatedTempSelectedValues[index],
        [e.target.name]: e.target.value,
      };
      console.log(updatedTempSelectedValues);
      return {
        ...prevSections,
        3: {
          ...prevSections[3],
          tempSelectedValues: updatedTempSelectedValues,
        },
      };
    });
  };

  // Function to save email edit
  const handleSaveEmail = (index) => {
    // Validate email here if needed
    setSections((prevSections) => {
      const updatedSelectedValues = [...prevSections[3].selectedValues];
      updatedSelectedValues[index] = prevSections[3].tempSelectedValues[index];

      return {
        ...prevSections,
        3: {
          ...prevSections[3],
          selectedValues: updatedSelectedValues,
          tempSelectedValues: updatedSelectedValues,
        },
      };

      setEditingEmailIndex(null);
    });
  };

  // Function to cancel email edit
  const handleCancelEmailEdit = () => {
    setSections((prevSections) => ({
      ...prevSections,
      3: {
        ...prevSections[3],
        tempSelectedValues: prevSections[3].selectedValues,
      },
    }));
    setEditingEmailIndex(null);
  };

  const validation = (sectionId, formData) => {
    const schemaValidation = {
      0: Joi.object({
        services: Joi.array()
          .min(1)
          .required()
          .messages({ "array.min": "Select atleast One Service" }),
      }),
      1: Joi.object({
        business_types: Joi.array()
          .min(1)
          .required()
          .messages({ "array.min": "Select atleast One Business Type" }),
      }),
      2: Joi.object({
        bio: Joi.string()
          .label("Bio")
          .required()
          .messages({ "string.empty": "Bio cannot be empty" }),
      }),
      3: Joi.object({
        email_ids: Joi.array().label("Email Ids").required(),
        // .messages({ "string.empty": "Bio cannot be empty" }),
      }),
      4: Joi.object({
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
              /^(?:http(s)?:\/\/)?behance.net\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*$/;
            if (!urlRegex.test(value)) {
              return helpers.message("Invalid Behance URL format");
            }
            return value;
          }),
        linkedin_link: Joi.string()
          .label("Linkedin")
          .allow("")
          .custom((value, helpers) => {
            const urlRegex =
              /^(?:http(s)?:\/\/)?linkedin\.com\/in\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*$/;
            if (!urlRegex.test(value)) {
              return helpers.message("Invalid LinkedIn URL format");
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
      }).custom((value, helpers) => {
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
      }),
      5: Joi.object({
        project_sizes: Joi.array()
          .min(1)
          .required()
          .messages({ "array.min": "Select atleast one Project Size" }),
      }),
      6: Joi.object({
        project_location: Joi.string()
          .required()
          .messages({ "string.empty": "Project Location is required" }),
      }),
      7: Joi.object({
        project_typology: Joi.array()
          .min(1)
          .required()
          .messages({ "array.min": "Select atleast one Project Typology" }),
      }),
      8: Joi.object({
        design_style: Joi.array()
          .min(1)
          .required()
          .messages({ "array.min": "Select atleast one Design Style" }),
      }),
      9: Joi.object({
        avg_project_budget: Joi.object({
          budget: Joi.string().trim().required().messages({
            "string.empty": "Please select a Budget",
            "string.undefined": "Please select a Budget",
          }),
          currency: Joi.string().required(),
        }).label("Project Budget"),
      }),

      10: Joi.object({
        project_scope: Joi.array()
          .min(1)
          .required()
          .messages({
            "array.min": "Select atleast one Project Scope",
          })
          .label("Project Scope"),
      }),

      11: Joi.object({
        project_mimimal_fee: Joi.object({
          fee: Joi.string().trim().required().messages({
            "string.empty": "Please select a Minimum Project Fee",
            "string.undefined": "Please select a Minimum Project Fee",
          }),
          currency: Joi.string().required(),
        }).label("Project Minimal Fee"),
      }),
    };

    const schema = schemaValidation[sectionId];
    const { error } = schema.validate(formData, { abortEarly: false });

    // let errorMessage = "";
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });

      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          errors: { ...prevSections[sectionId].errors, ...errors },
        },
      }));
      return false;
    } else {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: { ...prevSections[sectionId], errors: {} },
      }));
      return true;
    }
  };

  const handleUpdateMedia = (data, section) => {
    switch (section) {
      case "product_catalogues_media":
        setSections((prevSections) => ({
          ...prevSections,
          12: {
            ...prevSections[12],
            mediaUploads: [...sections[12].mediaUploads, ...data],
          },
        }));
        BusinessContext.update({
          ...BusinessContext.data,
          product_catalogues_media: [...sections[12].mediaUploads, ...data],
        });

        break;
      case "company_profile_media":
        setSections((prevSections) => ({
          ...prevSections,
          13: {
            ...prevSections[13],
            mediaUploads: [...sections[13].mediaUploads, ...data],
          },
        }));
        BusinessContext.update({
          ...BusinessContext.data,
          company_profile_media: [...sections[13].mediaUploads, ...data],
        });

        break;
      case "completed_products_media":
        setSections((prevSections) => ({
          ...prevSections,
          14: {
            ...prevSections[14],
            mediaUploads: [...sections[14].mediaUploads, ...data],
          },
        }));
        BusinessContext.update({
          ...BusinessContext.data,
          completed_products_media: [...sections[14].mediaUploads, ...data],
        });
        break;
      case "project_renders_media":
        setSections((prevSections) => ({
          ...prevSections,
          15: {
            ...prevSections[15],
            mediaUploads: [...sections[15].mediaUploads, ...data],
          },
        }));
        BusinessContext.update({
          ...BusinessContext.data,
          project_renders_media: [...sections[15].mediaUploads, ...data],
        });
        break;
      case "sites_inprogress_media":
        setSections((prevSections) => ({
          ...prevSections,
          16: {
            ...prevSections[16],
            mediaUploads: [...sections[16].mediaUploads, ...data],
          },
        }));
        BusinessContext.update({
          ...BusinessContext.data,
          sites_inprogress_media: [...sections[16].mediaUploads, ...data],
        });
        break;
      case "other_media":
        setSections((prevSections) => ({
          ...prevSections,
          17: {
            ...prevSections[17],
            mediaUploads: [...sections[17].mediaUploads, ...data],
          },
        }));
        BusinessContext.update({
          ...BusinessContext.data,
          other_media: [...sections[17].mediaUploads, ...data],
        });
        break;
      case "workspace":
        setSections((prevSections) => ({
          ...prevSections,
          18: {
            ...prevSections[18],
            workSpaceData: data,
            tempWorkSpaceData: data,
          },
        }));

        BusinessContext.update({
          ...BusinessContext.data,
          a_workspace_category_media: data,
        });
        break;

      default:
        break;
    }
  };

  const handleDeleteClick = (data, section, sectionId) => {
    setMediaToDelete({ data, section, sectionId });
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (mediaToDelete) {
      handleDeleteMedia(
        mediaToDelete.data,
        mediaToDelete.section,
        mediaToDelete.sectionId
      );
      setConfirmDelete(false);
      setMediaToDelete(null);
    }
  };

  const handleDeleteMedia = async (data, section, sectionId) => {
    await http.put(
      base_url +
        `/business/business-details/${BusinessContext?.data?._id}/documents`,
      { section: section, documentId: data._id }
    );

    const filteredFiles = sections[sectionId].mediaUploads.filter(
      (file) => file._id !== data._id
    );
    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: {
        ...prevSections[sectionId],
        mediaUploads: filteredFiles,
      },
    }));

    toast(
      <ToastMsg message={`File deleted successfully`} />,
      config.success_toast_config
    );
    BusinessContext.update({
      ...BusinessContext.data,
      [section]: filteredFiles,
    });
  };

  const handleCurrencyChange = async (sectionId, e) => {
    //if selectedValue is not "INR"
    //fetch USD data
    let sectionType = sectionId == 9 ? "projectBudgetsList" : "projectFeeList";
    let querySection =
      sectionId == 9 ? "average_budget" : "minimum_project_fee";
    if (e.target.value !== "INR") {
      const data = await http.get(
        config.api_url +
          `/business/get-currency?base=INR&target=${e.target.value}&section=${querySection}`
      );

      if (data) {
        setSections((prevSections) => ({
          ...prevSections,
          [sectionId]: {
            ...prevSections[sectionId],
            tempSelectedCurrency: e.target.value,
            tempSelectedOption:
              sections[sectionId].selectedCurrency == e.target.value
                ? sections[sectionId].selectedOption
                : "",
            [sectionType]: data.data,
          },
        }));
      }
      return;
    }

    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: {
        ...prevSections[sectionId],
        tempSelectedCurrency: e.target.value,
        tempSelectedOption:
          sections[sectionId].selectedCurrency == e.target.value
            ? sections[sectionId].selectedOption
            : "",
        [sectionType]: GlobalDataContext[querySection],
      },
    }));
  };

  const handleUnitChange = (sectionId, e) => {
    const newUnit = e.target.value;
    const unitSizes = sections[sectionId].globalData
      .filter((it) => it.unit === newUnit)
      .map((size) => size.size);

    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: {
        ...prevSections[sectionId],
        tempGlobalData: unitSizes,
        tempSelectedUnit: newUnit,
        tempSelectedOptions:
          sections[sectionId].selectedUnit == newUnit
            ? sections[sectionId].selectedOptions
            : [],
      },
    }));
  };

  const onChangeHandlerProjectSize = (option, e, sectionId) => {
    const isSelected = e.target.checked;
    const updatedOptions = [...sections[sectionId].tempSelectedOptions];

    if (option === "ALL") {
      if (isSelected) {
        updatedOptions.length = 0;
        updatedOptions.push("ALL");
        setSections((prevSections) => ({
          ...prevSections,
          [sectionId]: {
            ...prevSections[sectionId],
            allSelected: true,
            allOptions: [...sections[sectionId].globalData.slice(1)],
          },
        }));
        // setAllOptions([...projectSizes.slice(1)]);
      } else {
        updatedOptions.length = 0;
        setSections((prevSections) => ({
          ...prevSections,
          [sectionId]: {
            ...prevSections[sectionId],
            allSelected: false,
          },
        }));
      }
    } else {
      if (updatedOptions.includes("ALL")) {
        updatedOptions.splice(updatedOptions.indexOf("ALL"), 1);
      }
      if (isSelected) {
        updatedOptions.push(option);
      } else {
        updatedOptions.splice(updatedOptions.indexOf(option), 1);
      }
      const allOtherSelected = sections[sectionId].globalData
        .slice(1)
        .every((item) => updatedOptions.includes(item));

      if (allOtherSelected && !sections[sectionId].allSelected) {
        updatedOptions.length = 0;
        updatedOptions.push("ALL");
        setSections((prevSections) => ({
          ...prevSections,
          [sectionId]: {
            ...prevSections[sectionId],
            allSelected: true,
            allOptions: [...sections[sectionId].globalData.slice(1)],
          },
        }));
        // setAllSelected(true);
        // setAllOptions([...projectSizes.slice(1)]);
      } else {
        setSections((prevSections) => ({
          ...prevSections,
          [sectionId]: {
            ...prevSections[sectionId],
            allSelected: false,
          },
        }));
      }
    }
    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: {
        ...prevSections[sectionId],
        tempSelectedOptions: updatedOptions,
      },
    }));
  };

  const onChangeHandlerProjectScope = (option, e, sectionId) => {
    const isSelected = e.target.checked;
    const updatedOptions = [...sections[sectionId].selectedOptions];

    // Normalize the option for comparison
    const normalizedOption = option.toLowerCase(); // Convert to lower case for comparison
    const allOption = "all"; // Define the all option in lower case

    // Find the original casing of the "ALL" option in globalData
    const allOptionInGlobalData = sections[sectionId].globalData.find(
      (item) => item.toLowerCase() === allOption
    );

    if (normalizedOption === allOption) {
      if (isSelected) {
        // If "ALL" is selected, clear other selections and add the original "ALL" option
        updatedOptions.length = 0; // Clear the array
        updatedOptions.push(allOptionInGlobalData); // Add the found "ALL" option with original casing
        setSections((prevSections) => ({
          ...prevSections,
          [sectionId]: {
            ...prevSections[sectionId],
            allSelected: true,
            allOptions: [...sections[sectionId].globalData.slice(1)],
          },
        }));
      } else {
        // If "ALL" is deselected, remove "ALL" and update the selection
        updatedOptions.length = 0; // Clear the array
        setSections((prevSections) => ({
          ...prevSections,
          [sectionId]: {
            ...prevSections[sectionId],
            allSelected: false,
          },
        }));
      }
    } else {
      // Handle other options
      if (updatedOptions.includes(allOptionInGlobalData)) {
        updatedOptions.splice(updatedOptions.indexOf(allOptionInGlobalData), 1); // Remove "ALL" if it was selected
      }

      if (isSelected) {
        updatedOptions.push(option); // Add the selected option
      } else {
        updatedOptions.splice(updatedOptions.indexOf(option), 1); // Remove the deselected option
      }

      const allOtherSelected = sections[sectionId].globalData
        .slice(1) // Assuming you want to skip the first element
        .every((item) => updatedOptions.includes(item));

      if (allOtherSelected && !sections[sectionId].allSelected) {
        updatedOptions.length = 0; // Clear the array
        updatedOptions.push(allOptionInGlobalData); // Add the found "ALL" option with original casing
        setSections((prevSections) => ({
          ...prevSections,
          [sectionId]: {
            ...prevSections[sectionId],
            allSelected: true,
            allOptions: [...sections[sectionId].globalData.slice(1)],
          },
        }));
      } else {
        setSections((prevSections) => ({
          ...prevSections,
          [sectionId]: {
            ...prevSections[sectionId],
            allSelected: false,
          },
        }));
      }
    }

    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: {
        ...prevSections[sectionId],
        selectedOptions: updatedOptions,
      },
    }));
  };

  const onHandleBusinessTypeChange = (option) => {
    setSections((prevSections) => {
      const isCurrentlySelected = prevSections[1].tempSelectedOptions.includes(
        option._id
      );

      let updatedTempSelectedOptions;
      if (isCurrentlySelected) {
        // Remove the business type ID if currently selected
        updatedTempSelectedOptions = prevSections[1].tempSelectedOptions.filter(
          (id) => id !== option._id
        );
      } else {
        // Add the business type ID if not selected
        updatedTempSelectedOptions = [
          ...prevSections[1].tempSelectedOptions,
          option._id,
        ];
      }

      return {
        ...prevSections,
        1: {
          ...prevSections[1],
          tempSelectedOptions: updatedTempSelectedOptions,
        },
      };
    });
  };

  const handleRadioChange = (option, sectionId) => {
    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: {
        ...prevSections[sectionId],
        tempSelectedOption: option,
      },
    }));
  };

  const handleBudgetRadioChange = (option, sectionId) => {
    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: {
        ...prevSections[sectionId],
        tempSelectedOption: option,
      },
    }));
  };

  const handleInputChange = (e) => {
    setSections((prevSections) => ({
      ...prevSections,
      4: {
        ...prevSections[4],
        tempValues: {
          ...prevSections[4].tempValues,
          [e.target.name]: e.target.value,
        },
      },
    }));
  };

  const handleBioInputChange = (e) => {
    setSections((prevSections) => ({
      ...prevSections,
      2: {
        ...prevSections[2],
        tempSelectedValue: e.target.value,
      },
    }));
  };

  const handleInputFirmConnectDataChange = (e, sectionId) => {
    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: {
        ...prevSections[sectionId],
        tempSelectedValues: {
          ...prevSections[sectionId].tempSelectedValues,
          [e.target.name]: e.target.value,
        },
      },
    }));
  };

  const gstValidationRule = (value) => {
    const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/i;
    if (!gstRegex.test(value)) {
      return "Invalid GST number format";
    }
    if (value.length < 15) {
      return "GST number must be at least 15 characters";
    }
    return "";
  };

  const validateSelectedDate = (date) => {
    if (!date) {
      setSections((prevSections) => ({
        ...prevSections,
        3: {
          ...prevSections[3],
          errors: { a_establishment_year: "Invalid Date" },
        },
      }));
      return false;
    }
    if (date?.$d == "Invalid Date") {
      setSections((prevSections) => ({
        ...prevSections,
        3: {
          ...prevSections[3],
          errors: { a_establishment_year: "Invalid Date" },
        },
      }));
      return false;
    }

    const currentYear = new Date().getFullYear();

    if (date?.$y > new Date().getFullYear() || date?.$y < currentYear - 50) {
      setSections((prevSections) => ({
        ...prevSections,
        3: {
          ...prevSections[3],
          errors: {
            a_establishment_year: "Date must be within the last 50 years",
          },
        },
      }));
      return false;
    }
    setSections((prevSections) => ({
      ...prevSections,
      3: {
        ...prevSections[3],
        errors: {},
        selectedOption: date,
      },
    }));
    return date?.$y;
  };

  const filterProjectSizesOptions = (sectionId) => {
    if (sections[sectionId].allSelected) {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          selectedOptions: ["ALL"],
        },
      }));

      return sections[sectionId].allOptions;
    } else {
      return sections[sectionId].selectedOptions;
    }
  };

  const handleSubmit = async (sectionId) => {
    let formData = {};
    let schema;
    switch (sectionId) {
      case 0:
        formData["services"] = sections[0].selectedOptions;
        schema = validation(0, formData);
        if (!schema) {
          return;
        }
        break;
      case 1:
        const selectedBusinessOptions = sections[1].businessesList.filter(
          (type) => sections[1].tempSelectedOptions.includes(type._id)
        );
        formData["business_types"] = sections[1].tempSelectedOptions;
        const currentBusinessTypes = BusinessContext.data.business_types || [];
        const areBusinessTypesEqual =
          currentBusinessTypes.length === selectedBusinessOptions.length &&
          currentBusinessTypes.every((currentType) =>
            selectedBusinessOptions.some(
              (selectedType) => selectedType._id === currentType._id
            )
          );

        if (areBusinessTypesEqual) {
          formData["services"] = [];
        }

        schema = validation(1, formData);
        if (!schema) {
          return;
        }

        const data = await http.post(
          base_url + `/business/business-details/${BusinessContext?.data?._id}`,
          { ...formData }
        );

        // When updating BusinessContext, if business types are the same, set services to empty
        BusinessContext.update({
          ...BusinessContext.data,
          ...(areBusinessTypesEqual ? { services: [] } : {}),
          business_types: selectedBusinessOptions,
        });

        setActiveQuestion(null);
        return;
      case 2:
        formData["bio"] = sections[2].tempSelectedValue;
        schema = validation(2, formData);
        if (!schema) {
          return;
        }
        setSections((prevSections) => ({
          ...prevSections,
          2: {
            ...prevSections[2],
            selectedValue: prevSections[2].tempSelectedValue,
          },
        }));
        break;
      case 3:
        formData["email_ids"] = sections[3].tempSelectedValues;
        schema = validation(3, formData);

        if (!schema) {
          return;
        }
        setSections((prev) => ({
          ...prev,
          3: {
            ...prev[3],
            selectedValues: prev[3].tempSelectedValues,
            tempSelectedValues: prev[3].tempSelectedValues,
            errors: {},
          },
        }));
        // let validDate = true;
        // if (sections[3].selectedOption !== "") {
        //   validDate = validateSelectedDate(sections[3].tempSelectedOption);
        // }
        // if (!validDate) {
        //   return;
        // } else {
        //   formData["a_establishment_year"] = validDate?.toString();
        //   schema = validation(3, formData);
        //   if (!schema) {
        //     return;
        //   }
        //   setSections((prevSections) => ({
        //     ...prevSections,
        //     3: {
        //       ...prevSections[3],
        //       selectedOption: prevSections[3].selectedOption,
        //     },
        //   }));
        // }
        break;
      case 4:
        formData["website_link"] = sections[sectionId].tempValues.websiteLink;
        formData["linkedin_link"] = sections[sectionId].tempValues.linkedinLink;
        formData["instagram_handle"] =
          sections[sectionId].tempValues.instagramLink;
        formData["behance_link"] = sections[sectionId].tempValues.behanceLink;
        formData["other"] = sections[sectionId].tempValues.other;
        formData["gst_number"] =
          sections[sectionId]?.tempValues?.gstNumber.toUpperCase();

        schema = validation(sectionId, formData);

        if (!schema) {
          return;
        }

        setSections((prevSections) => ({
          ...prevSections,
          [sectionId]: {
            ...prevSections[sectionId],
            ...prevSections[sectionId].tempValues,
            tempValues: {
              websiteLink: "",
              linkedinLink: "",
              behanceLink: "",
              instagramLink: "",
              other: "",
              gstNumber: "",
            },
          },
        }));

        if (formData.instagram_handle) {
          const urlPattern = new RegExp(
            "^(https?://)?(www\\.)?instagram\\.com/.*$",
            "i"
          );
          if (!urlPattern.test(formData.instagram_handle)) {
            formData.instagram_handle = `https://www.instagram.com/${formData.instagram_handle}`;
          }
        }
        formData["a_firm_connect_data"] = {
          website_link: formData["website_link"],
          linkedin_link: formData["linkedin_link"],
          instagram_handle: formData["instagram_handle"],
          behance_link: formData["behance_link"],
          other: formData["other"],
          gst_number: formData["gst_number"],
        };
        break;
      case 5:
        const sizes = sections[5].tempSelectedOptions;

        formData["project_sizes"] = {
          sizes: sections[5].tempSelectedOptions,
          unit: sections[5].tempSelectedUnit,
        };

        schema = validation(5, { project_sizes: sizes });
        if (!schema) {
          return;
        }
        break;
      case 6:
        formData["project_location"] = sections[6].tempSelectedOption;
        schema = validation(6, formData);
        if (!schema) {
          return;
        }

        formData["project_location"] = {
          data: sections[6].tempSelectedOption,
        };
        setSections((prevSections) => ({
          ...prevSections,
          6: {
            ...prevSections[6],
            selectedOption: prevSections[6].tempSelectedOption,
          },
        }));
        break;
      case 7:
        let selectedTypologyData = sections[7].selectedOptions;

        if (
          selectedTypologyData.some((option) => option.toUpperCase() === "ALL")
        ) {
          const allOptionsExceptAll = sections[7].typologyList.filter(
            (option) => option.value.toUpperCase() !== "ALL"
          );
          selectedTypologyData = allOptionsExceptAll.map((it) => it.value);
        }

        formData["project_typology"] = selectedTypologyData;
        schema = validation(7, formData);
        if (!schema) {
          return;
        }
        formData["project_typology"] = { data: selectedTypologyData };
        break;
      case 8:
        let selectedDesignData = sections[8].selectedOptions;
        if (
          selectedDesignData.some((option) => option.toUpperCase() === "ALL")
        ) {
          const allOptionsExceptAll = sections[8].designStyleList.filter(
            (option) => option.value.toUpperCase() !== "ALL"
          );
          selectedDesignData = allOptionsExceptAll.map((it) => it.value);
        }

        formData["design_style"] = selectedDesignData;
        schema = validation(8, formData);
        if (!schema) {
          return;
        }
        formData["design_style"] = { data: selectedDesignData };
        break;
      case 9:
        formData["avg_project_budget"] = {
          budget: sections[9].tempSelectedOption,
          currency: sections[9].tempSelectedCurrency,
        };
        schema = validation(9, formData);
        if (!schema) {
          return;
        }
        setSections((prevSections) => ({
          ...prevSections,
          9: {
            ...prevSections[9],
            selectedOption: prevSections[9].tempSelectedOption,
            selectedCurrency: prevSections[9].tempSelectedCurrency,
          },
        }));
        break;

      case 10:
        let selectedProjectScopeData = sections[10].selectedOptions;
        if (
          selectedProjectScopeData.some(
            (option) => option.toUpperCase() === "ALL"
          )
        ) {
          const allOptionsExceptAll = sections[10].globalData.filter(
            (option) => option.toUpperCase() !== "ALL"
          );
          selectedProjectScopeData = allOptionsExceptAll.map((it) => it);
        }

        formData["project_scope"] = selectedProjectScopeData;
        schema = validation(10, formData);
        if (!schema) {
          return;
        }
        formData["project_scope"] = { data: selectedProjectScopeData };
        break;

      case 11:
        formData["project_mimimal_fee"] = {
          fee: sections[11].tempSelectedOption,
          currency: sections[11].tempSelectedCurrency,
        };
        schema = validation(11, formData);
        if (!schema) {
          return;
        }
        setSections((prevSections) => ({
          ...prevSections,
          11: {
            ...prevSections[11],
            selectedOption: prevSections[11].tempSelectedOption,
            selectedCurrency: prevSections[11].tempSelectedCurrency,
          },
        }));
        break;
      default:
        break;
    }

    // const options = filterProjectSizesOptions();

    // formData = {
    //   services: sections[0].selectedOptions,
    //   additional_services: sections[1].selectedOptions,
    //   employees_range: sections[2].selectedOption,
    //   establishment_year: validDate,
    //   // project_sizes: options,
    //   project_location: sections[6].tempSelectedOption,
    // };

    const data = await http.post(
      base_url + `/business/business-details/${BusinessContext?.data?._id}`,
      { ...formData }
    );

    BusinessContext.update({
      ...BusinessContext.data,
      ...formData,
    });
    setActiveQuestion(null);
  };

  const handleCancel = async (sectionId) => {
    // const sectionsToBeIgnored = [2];
    // if (sectionsToBeIgnored.includes(sectionId)) {
    //   activeQuestionHandler(sectionId);
    //   return;
    // }
    if (sectionId == 2) {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          errors: {},
          tempSelectedValue: prevSections[sectionId].selectedValue,
        },
      }));
      activeQuestionHandler(sectionId);
      return;
    }
    if (sectionId == 3) {
      setSections((prevSections) => ({
        ...prevSections,
        3: {
          ...prevSections[3],
          tempSelectedValues: prevSections[3].selectedValues,
          errors: {},
        },
      }));
      activeQuestionHandler(sectionId);
      return;
    }
    if (sectionId == 6) {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          tempSelectedOption: prevSections[sectionId].selectedOption,
        },
      }));
      activeQuestionHandler(sectionId);
      return;
    }

    if (sectionId == 9 || sectionId == 11) {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          tempSelectedOption: prevSections[sectionId].selectedOption,
          tempSelectedCurrency: prevSections[sectionId].selectedCurrency,
          errors: {},
        },
      }));
      activeQuestionHandler(sectionId);
      return;
    }

    if (sectionId == 4) {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          tempValues: {
            websiteLink: prevSections[sectionId].websiteLink,
            linkedinLink: prevSections[sectionId].linkedinLink,
            behanceLink: prevSections[sectionId].behanceLink,
            instagramLink: prevSections[sectionId].instagramLink,
            other: prevSections[sectionId].other,
            gstNumber: prevSections[sectionId].gstNumber,
          },
          errors: {
            website_link: "",
            linkedin_link: "",
            behance_link: "",
            instagram_handle: "",
            other: "",
            gst_number: "",
            gst_img_error: "",
          },
        },
      }));
      activeQuestionHandler(sectionId);
      return;
    }

    if (sectionId == 1) {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          businessesList: [...prevSections[sectionId].businessesList],
          tempSelectedOptions: [...prevSections[sectionId].selectedOptions],
        },
      }));

      // Trigger the active question for editing
      activeQuestionHandler(sectionId);
      return;
    }

    let deselectOptions;
    if (
      sections[sectionId].selectedOptions.length >
      sections[sectionId].tempSelectedOptions.length
    ) {
      deselectOptions = sections[sectionId].selectedOptions.filter((it) =>
        sections[sectionId].tempSelectedOptions.includes(it)
      );
    } else {
      deselectOptions = sections[sectionId].tempSelectedOptions;
    }

    if (sectionId == 5 || sectionId == 10) {
      if (
        sections[sectionId].tempSelectedOptions.length ==
        sections[sectionId].globalData.slice(1).length
      ) {
        updateSectionData(sectionId, {
          selectedOptions: ["ALL"],
          errors: {},
        });
      } else {
        updateSectionData(sectionId, {
          selectedOptions: deselectOptions,
          errors: {},
        });
      }
      activeQuestionHandler(sectionId);
      return;
    }
    updateSectionData(sectionId, {
      selectedOptions: deselectOptions,
      errors: {},
    });
    setActiveQuestion(null);
  };

  const handleEditButton = async (sectionId) => {
    // const sectionsToBeIgnored = [2];
    // if (sectionsToBeIgnored.includes(sectionId)) {
    //   activeQuestionHandler(sectionId);
    //   return;
    // }

    if (sectionId == 2) {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          errors: {},
          tempSelectedValue: prevSections[sectionId].selectedValue,
        },
      }));
      activeQuestionHandler(sectionId);
      return;
    }

    if (sectionId == 3) {
      setSections((prevSections) => ({
        ...prevSections,
        3: {
          ...prevSections[3],
          tempSelectedValues: prevSections[3].selectedValues,
          errors: {},
        },
      }));
      activeQuestionHandler(sectionId);
      return;
    }

    if (sectionId == 18) {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          errors: {},
          tempSelectedOption: prevSections[sectionId].selectedOption,
        },
      }));
      activeQuestionHandler(sectionId);
      return;
    }

    if (sectionId == 5) {
      const unitSizes = sections[5].globalData
        .filter((it) => it.unit === sections[5].selectedUnit)
        .map((size) => size.size);
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          errors: {},
          tempGlobalData: unitSizes,
          tempSelectedUnit: sections[5].selectedUnit,
          tempSelectedOptions: sections[5].selectedOptions,
        },
      }));
      activeQuestionHandler(sectionId);
      return;
    }

    if (sectionId == 6) {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          tempSelectedOption: prevSections[sectionId].selectedOption,
        },
      }));
      activeQuestionHandler(sectionId);
      return;
    }

    if (sectionId == 9 || sectionId == 11) {
      const querySection =
        sectionId == 9 ? "average_budget" : "minimum_project_fee";
      let sectionType =
        sectionId == 9 ? "projectBudgetsList" : "projectFeeList";

      let budgetData = GlobalDataContext[querySection];

      if (sections[sectionId].selectedCurrency !== "INR") {
        const { data } = await http.get(
          config.api_url +
            `/business/get-currency?base=INR&target=${sections[sectionId].selectedCurrency}&section=${querySection}`
        );

        if (data) {
          budgetData = data;
        }
      }

      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          tempSelectedOption: prevSections[sectionId].selectedOption,
          tempSelectedCurrency: prevSections[sectionId].selectedCurrency,
          [sectionType]: budgetData,
          errors: {},
        },
      }));
      activeQuestionHandler(sectionId);
      return;
    }

    if (sectionId == 4) {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          tempValues: {
            websiteLink: prevSections[sectionId].websiteLink,
            linkedinLink: prevSections[sectionId].linkedinLink,
            behanceLink: prevSections[sectionId].behanceLink,
            instagramLink: prevSections[sectionId].instagramLink,
            other: prevSections[sectionId].other,
            gstNumber: prevSections[sectionId].gstNumber,
          },
          errors: {
            website_link: "",
            linkedin_link: "",
            behance_link: "",
            instagram_handle: "",
            other: "",
            gst_number: "",
            gst_img_error: prevSections[sectionId].errors?.gst_img_error || "",
          },
        },
      }));
      activeQuestionHandler(sectionId);
      return;
    }

    if (sectionId == 1) {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          businessesList: [...prevSections[sectionId].businessesList],
          tempSelectedOptions: [...prevSections[sectionId].selectedOptions],
        },
      }));

      // Trigger the active question for editing
      activeQuestionHandler(sectionId);
      return;
    }
    let deselectOptions;
    if (
      sections[sectionId].selectedOptions.length >
      sections[sectionId].tempSelectedOptions.length
    ) {
      deselectOptions = sections[sectionId].selectedOptions.filter((it) =>
        sections[sectionId].tempSelectedOptions.includes(it)
      );
    } else {
      deselectOptions = sections[sectionId].tempSelectedOptions;
    }

    if (sectionId == 10) {
      if (
        sections[sectionId].tempSelectedOptions.length ==
        sections[sectionId].globalData.slice(1).length
      ) {
        updateSectionData(sectionId, {
          selectedOptions: ["ALL"],
          errors: {},
        });
      } else {
        updateSectionData(sectionId, {
          selectedOptions: deselectOptions,
          errors: {},
        });
      }
      activeQuestionHandler(sectionId);
      return;
    }
    updateSectionData(sectionId, {
      selectedOptions: deselectOptions,
      errors: {},
    });
    activeQuestionHandler(sectionId);
  };

  //fetch valid questions according to the business types
  const fetchValidQuestions = async (business_types) => {
    const { data } = await http.get(
      `${base_url}/business/business-questions?business_types=${business_types}`
    );
    if (data) {
      const validQuestionsList = data.map((it) => it.question);

      setValidQuestionFields(validQuestionsList);
    }
  };

  //toggle visibility
  const toggleFieldVisibility = async (sectionId, section) => {
    //call API

    if (!activeQuestion) {
      const { data } = await http.put(
        `${base_url}/business/${BusinessContext.data._id}/sections-visibility`,
        { section, visibility: !sections[sectionId].visibility }
      );

      if (data) {
        setSections((prevSections) => ({
          ...prevSections,
          [sectionId]: {
            ...prevSections[sectionId],
            visibility: !sections[sectionId].visibility,
          },
        }));
      }
    }
  };

  const updateSectionData = (sectionId, newData) => {
    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: { ...prevSections[sectionId], ...newData },
    }));
  };

  useEffect(() => {
    if (GlobalDataContext && BusinessContext?.data) {
      const globalData = GlobalDataContext;

      const updatedSections = { ...sections };

      if (BusinessContext?.data) {
        const businessTypeIds = BusinessContext?.data?.business_types?.map(
          (type) => type._id
        );

        const filteredServicesData = globalData?.services
          ?.filter((service) =>
            businessTypeIds?.includes(service.business_type)
          )
          ?.flatMap((service) => service.services);
        updatedSections[0].servicesData = filteredServicesData;
        // console.log(filteredServicesData);
      }

      updatedSections[1].businessesList = globalData.business_types || [];
      updatedSections[3].emailTypes = globalData.email_types || [];
      updatedSections[18].addressTypes = globalData.address_types || [];
      updatedSections[5].globalData = globalData?.project_sizes || [];
      updatedSections[5].tempGlobalData = globalData?.project_sizes || [];

      updatedSections[6].locationList = globalData.project_locations;

      updatedSections[7].typologyList =
        globalData.project_typologies?.map((option) => ({
          label: option,
          value: option,
        })) || [];

      updatedSections[8].designStyleList =
        globalData.design_styles?.map((option) => ({
          label: option,
          value: option,
        })) || [];

      updatedSections[9].projectBudgetsList = globalData?.average_budget || [];

      updatedSections[10].globalData =
        globalData?.project_scope_preferences || [];
      // updatedSections[10].globalData = [
      //   "ALL",
      //   ...(globalData.preferences || []),
      // ];
      updatedSections[11].projectFeeList = globalData.minimum_project_fee || [];
      updatedSections[18].addressTypes = globalData.address_types || [];

      // updatedSections[18].workSpaceDataCategories =
      //   GlobalDataContext?.workspace_data_categories || [];
      setSections(updatedSections);
    }
  }, [GlobalDataContext, BusinessContext?.data]);

  useEffect(() => {
    if (BusinessContext?.data) {
      const updatedSections = { ...sections };
      const {
        services,
        project_sizes,
        project_location,
        project_typology,
        design_style,
        avg_project_budget,
        project_scope,
        project_mimimal_fee,
        website_link,
        linkedin_link,
        instagram_handle,
        company_profile_media,
        product_catalogues_media,
        business_types,
        bio,
        completed_products_media,
        project_renders_media,
        sites_inprogress_media,
        other_media,
        email_ids,
        addresses,
        a_completed_projects_media,
        a_project_renders_media,
        a_work_in_progress_site_media,
        a_other_media,
        a_workspace_category_media,
      } = BusinessContext.data;

      fetchValidQuestions(business_types?.map((it) => it._id).join(","));
      updatedSections[0].selectedOptions = services || [];
      updatedSections[0].tempSelectedOptions = services || [];

      updatedSections[1].selectedOptions =
        business_types?.map((type) => type._id) || [];
      updatedSections[1].tempSelectedOptions =
        business_types?.map((type) => type._id) || [];

      updatedSections[2].selectedValue = bio || "";
      updatedSections[2].tempSelectedValue = bio || "";

      updatedSections[3].selectedValues = email_ids || [];
      updatedSections[3].tempSelectedValues = email_ids || [];

      updatedSections[5].selectedOptions = project_sizes?.sizes || [];
      updatedSections[5].tempSelectedOptions = project_sizes?.sizes || [];
      updatedSections[5].selectedUnit = project_sizes?.unit || "";
      updatedSections[5].tempSelectedUnit = project_sizes?.unit || "";
      updatedSections[5].visibility = project_sizes?.isPrivate || false;
      // if (sections[5]?.globalData) {
      //   if (sections[5]?.globalData?.length) {
      //     updatedSections[5].allSelected =
      //       sections[5].globalData.slice(1).length === project_sizes.length;
      //   }
      // }

      updatedSections[6].selectedOption = project_location?.data || "";
      updatedSections[6].tempSelectedOption = project_location?.data || "";
      updatedSections[6].visibility = project_location?.isPrivate || false;

      //project typology
      const allOptions = GlobalDataContext?.project_typologies?.filter(
        (opt) => opt.toLowerCase() !== "all"
      );
      const allOption = GlobalDataContext?.project_typologies?.find(
        (opt) => opt.toLowerCase() === "all"
      );

      updatedSections[7].selectedOptions =
        updatedSections[7].tempSelectedOptions =
          allOptions?.length === project_typology?.data?.length
            ? [allOption]
            : project_typology?.data || [];
      updatedSections[7].visibility = project_typology?.isPrivate || false;

      //design styles
      const allOptionsDesignStyles = GlobalDataContext?.design_styles?.filter(
        (opt) => opt.toLowerCase() !== "all"
      );
      const allOptionDesignStyle = GlobalDataContext?.design_styles?.find(
        (opt) => opt.toLowerCase() === "all"
      );
      updatedSections[8].selectedOptions =
        updatedSections[8].tempSelectedOptions =
          allOptionsDesignStyles?.length === design_style?.data?.length
            ? [allOptionDesignStyle]
            : design_style?.data || [];
      updatedSections[8].visibility = design_style?.isPrivate || false;

      if (avg_project_budget) {
        updatedSections[9].selectedOption = avg_project_budget.budget || "";
        updatedSections[9].tempSelectedOption = avg_project_budget.budget || "";
        updatedSections[9].selectedCurrency = avg_project_budget.currency || "";
        updatedSections[9].tempSelectedCurrency =
          avg_project_budget.currency || "";
        updatedSections[9].visibility = avg_project_budget.isPrivate || false;
      }

      //project scope preferences
      const allProjectScopeOptions =
        GlobalDataContext?.project_scope_preferences?.filter(
          (opt) => opt.toLowerCase() !== "all"
        );
      const allProjectScopeOption =
        GlobalDataContext?.project_scope_preferences?.find(
          (opt) => opt.toLowerCase() === "all"
        );

      updatedSections[10].selectedOptions =
        allProjectScopeOptions?.length === project_scope?.data?.length
          ? [allProjectScopeOption]
          : project_scope?.data;

      updatedSections[10].tempSelectedOptions =
        allProjectScopeOptions?.length === project_scope?.data?.length
          ? [allProjectScopeOption]
          : project_scope?.data;

      updatedSections[10].visibility = project_scope?.isPrivate || false;

      //project minimal fee preferences
      // if (sections[10].globalData?.length) {
      //   updatedSections[10].allSelected =
      //     sections[10].globalData.slice(1).length === project_scope.length;
      // }
      if (project_mimimal_fee) {
        updatedSections[11].selectedOption = project_mimimal_fee.fee || "";
        updatedSections[11].tempSelectedOption = project_mimimal_fee.fee || "";
        updatedSections[11].selectedCurrency =
          project_mimimal_fee.currency || "";
        updatedSections[11].tempSelectedCurrency =
          project_mimimal_fee.currency || "";
        updatedSections[11].visibility =
          project_mimimal_fee?.isPrivate || false;
      }

      updatedSections[4].websiteLink = website_link || "";
      updatedSections[4].linkedinLink = linkedin_link || "";
      updatedSections[4].instagramLink = instagram_handle || "";
      updatedSections[4].tempValues = {
        websiteLink: website_link || "",
        linkedinLink: linkedin_link || "",
        instagramLink: instagram_handle || "",
      };
      updatedSections[12].mediaUploads = product_catalogues_media || [];
      updatedSections[13].mediaUploads = company_profile_media || [];

      updatedSections[14].mediaUploads =
        completed_products_media?.map((media) => ({
          ...media,
          visibility: media.visibility || false,
        })) || [];
      updatedSections[15].mediaUploads =
        project_renders_media?.map((media) => ({
          ...media,
          visibility: media.visibility || false,
        })) || [];
      updatedSections[16].mediaUploads =
        sites_inprogress_media?.map((media) => ({
          ...media,
          visibility: media.visibility || false,
        })) || [];
      updatedSections[17].mediaUploads =
        other_media?.map((media) => ({
          ...media,
          visibility: media.visibility || false,
        })) || [];
      updatedSections[18].selectedValues = addresses || [];
      updatedSections[18].tempSelectedValues = addresses || [];
    }
  }, [BusinessContext?.data]);

  // useEffect(() => {
  //   if (sections[14].mediaUploads) {
  //     const initialToggleStates = sections[14].mediaUploads.map(
  //       (media) => media.visibility
  //     );

  //     setCompletedProjectImageStates(initialToggleStates);
  //   }
  // }, [sections[14].mediaUploads]);

  useEffect(() => {
    if (sections[4].tempValues.gstNumber) {
      const gstError = gstValidationRule(sections[4].tempValues.gstNumber);
      if (gstError) {
        setSections((prevSections) => ({
          ...prevSections,
          4: { ...prevSections[4], errors: { gst_img_error: gstError } },
        }));
      } else {
        setSections((prevSections) => ({
          ...prevSections,
          4: { ...prevSections[4], errors: { gst_img_error: "" } },
        }));
      }
    }
  }, [sections[4].tempValues.gstNumber]);

  useEffect(() => {
    if (projectImageRef.current) {
      setProjectImageHeight(projectImageRef.current.clientHeight);
    }
  }, [projectImageRef, width, height]);

  return (
    <div className="row g-0">
      {/* FIRM CONTAINER START HERE */}
      {/* FIRM CONTAINER START HERE */}
      {/* FIRM CONTAINER START HERE */}
      <div className="col-lg-6 p-0 border_right">
        <div className="business_details_wrapper section1">
          <div className="firm_project_container">
            <div className="title_edit">
              <h2 className="section_title">Business Profile</h2>
            </div>
            {/* FIRST QUESTION */}
            <div
              className={`brand_subsec first_box  ${
                activeQuestion === 1 ? "" : activeQuestion !== null && "disable"
              }`}
            >
              <div className="title_pin">
                <h4 className="title">Define your business</h4>
                <img
                  src={editicon}
                  alt=""
                  className="edit_icon"
                  onClick={() => handleEditButton(1)}
                />
              </div>
              <div className="radio">
                {activeQuestion !== 1 ? (
                  <ul className="checkboxes" style={{ pointerEvents: "none" }}>
                    {selectedBusinessList}
                  </ul>
                ) : (
                  <ul className="checkboxes">{businessList}</ul>
                )}
              </div>
              <p className="error">{sections[5].errors.project_sizes}</p>
              {activeQuestion === 1 && (
                <div className="save_cancel_cta no_space">
                  <button className="save_cta" onClick={() => handleSubmit(1)}>
                    Save
                  </button>
                  <button
                    className="cancel_cta"
                    onClick={() => handleCancel(1)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="business_details_wrapper section1">
          <div className="firm_project_container">
            <div className="title_edit">
              <h2 className="section_title">About The Firm</h2>
            </div>

            <div
              className={`brand_subsec first_box  ${
                activeQuestion === 2 ? "" : activeQuestion !== null && "disable"
              }`}
            >
              <div className="title_pin">
                <h4 className="title">Bio</h4>
                <img
                  src={editicon}
                  alt=""
                  className="edit_icon"
                  onClick={() => handleEditButton(2)}
                />
              </div>
              <div className="desc_box">
                {activeQuestion === 2 ? (
                  <FullWidthTextField
                    lightTheme
                    disabled={activeQuestion !== 2}
                    classProp="business_edit_input"
                    label="Bio"
                    name="bio"
                    value={sections[2].tempSelectedValue}
                    onChange={handleBioInputChange}
                  />
                ) : (
                  <p className="desc">
                    {sections[2].tempSelectedValue || "No Bio Available"}
                    {/* DESIGN FIRM/CONSULTANCY
                    <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim ven`iam, quis nostrud exercitation
                    ullamco */}
                  </p>
                )}
              </div>
              {activeQuestion === 2 && (
                <div className="save_cancel_cta">
                  <button className="save_cta" onClick={() => handleSubmit(2)}>
                    Save
                  </button>
                  <button
                    className="cancel_cta"
                    onClick={() => handleCancel(2)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* FIRST QUESTION */}
            <div
              className={`brand_subsec first_box ${
                activeQuestion === 0 ? "" : activeQuestion !== null && "disable"
              }`}
            >
              <div className="title_pin">
                <h4 className="title">What Services Do You Provide?</h4>
                <img
                  src={editicon}
                  alt=""
                  className="edit_icon"
                  onClick={() => handleEditButton(0)}
                />
              </div>
              <BEAutocompleteOthers
                key={`section-0`}
                editFocus={activeQuestion === 0}
                allOptionData={sections[0].servicesData}
                selectedData={sections[0].selectedOptions}
                updateSectionData={updateSectionData}
                sectionId={0}
                onSave={() => ""}
              />
              {Object.keys(sections[0].errors).length > 0 && (
                <p className="error">{sections[0].errors.services}</p>
              )}
              {activeQuestion === 0 && (
                <div className="save_cancel_cta">
                  <button className="save_cta" onClick={() => handleSubmit(0)}>
                    Save
                  </button>
                  <button
                    className="cancel_cta"
                    onClick={() => handleCancel(0)}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* <button
                className="save_cta"
                onClick={() => setConfirmDelete(true)}
              >
                Modal test
              </button> */}
            </div>
            {/* SECOND QUESTION */}

            {/* FIFTH QUESTION */}
          </div>
        </div>
      </div>

      {/* ABOUT PROJECTS START HERE */}
      {/* ABOUT PROJECTS START HERE */}
      {/* ABOUT PROJECTS START HERE */}
      <div className="col-lg-6 p-0">
        <div className="business_details_wrapper section2">
          <div className="firm_project_container">
            <div className="title_edit">
              <h2 className="section_title">About Your Projects</h2>
            </div>
            {/* SIX QUESTION */}
            {validQuestionFields.includes("minimum_project_size") ? (
              <div
                className={`brand_subsec first_box with_checkboxes ${
                  activeQuestion === 5
                    ? ""
                    : activeQuestion !== null && "disable"
                }`}
              >
                <div className="title_pin">
                  <div className="title_hide_wrap">
                    <h4 className="title">Minimum Project Size</h4>
                    <div className="switch_btn image_toggle_btn">
                      <div
                        className="toggle_container"
                        onClick={() =>
                          toggleFieldVisibility(5, "project_sizes")
                        }
                      >
                        <div className="toggle_text">Hide</div>
                        <div className="toggle_switch">
                          <div
                            className={`toggle_circle ${
                              sections[5].visibility ? "left" : "right"
                            }`}
                          />
                        </div>
                        <div className="toggle_text">Show</div>
                      </div>
                    </div>
                  </div>
                  <img
                    src={editicon}
                    alt=""
                    className="edit_icon"
                    onClick={() => handleEditButton(5)}
                  />
                </div>
                <div className="radio">
                  {activeQuestion !== 5 ? (
                    <ul
                      className="checkboxes"
                      style={{ pointerEvents: "none" }}
                    >
                      {selectedProjectSizeList}
                    </ul>
                  ) : (
                    <div>
                      <div
                        className={`field_wrapper ${style.currency_dropdown}`}
                      >
                        <div className="edit_dropdown_wrap">
                          <SelectDropdown
                            classProp="bedit_profile_select"
                            label="Unit"
                            labelId="unit"
                            lightTheme
                            data={unitArr}
                            value={sections[5].tempSelectedUnit}
                            onChange={(e) => handleUnitChange(5, e)}
                          />
                        </div>
                      </div>
                      <ul className="checkboxes">{projectSizeList}</ul>
                    </div>
                  )}
                </div>
                {Object.keys(sections[5].errors).length > 0 && (
                  <p className="error">{sections[5].errors.project_sizes}</p>
                )}
                {activeQuestion === 5 && (
                  <div className="save_cancel_cta no_space">
                    <button
                      className="save_cta"
                      onClick={() => handleSubmit(5)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel_cta"
                      onClick={() => handleCancel(5)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}

            {/* SEVEN QUESTION */}
            {validQuestionFields.includes("location_preference") ? (
              <div
                className={`brand_subsec with_checkboxes ${
                  activeQuestion === 6
                    ? ""
                    : activeQuestion !== null && "disable"
                }`}
              >
                <div className="title_pin">
                  <div className="title_hide_wrap">
                    <h4 className="title">Project Location Preference:</h4>
                    <div className="switch_btn image_toggle_btn">
                      <div
                        className="toggle_container"
                        onClick={() =>
                          toggleFieldVisibility(6, "project_location")
                        }
                      >
                        <div className="toggle_text">Hide</div>
                        <div className="toggle_switch">
                          <div
                            className={`toggle_circle ${
                              sections[6].visibility ? "left" : "right"
                            }`}
                          />
                        </div>
                        <div className="toggle_text">Show</div>
                      </div>
                    </div>
                  </div>
                  <img
                    src={editicon}
                    alt=""
                    className="edit_icon"
                    onClick={() => handleEditButton(6)}
                  />
                </div>
                <div className="radio">
                  {activeQuestion !== 6 ? (
                    <ul
                      className="checkboxes"
                      style={{ pointerEvents: "none" }}
                    >
                      <li className="selectedValuePill">
                        {sections[6].selectedOption || "No Option Selected"}
                      </li>
                    </ul>
                  ) : (
                    <ul className="checkboxes">{locationList}</ul>
                  )}
                </div>
                {Object.keys(sections[6].errors).length > 0 && (
                  <p className="error">{sections[6].errors.project_location}</p>
                )}
                {activeQuestion === 6 && (
                  <div className="save_cancel_cta no_space">
                    <button
                      className="save_cta"
                      onClick={() => handleSubmit(6)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel_cta"
                      onClick={() => handleCancel(6)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
            {/* EIGHT QUESTION */}
            {validQuestionFields.includes("project_typology") ? (
              <div
                className={`brand_subsec ${
                  activeQuestion === 7
                    ? ""
                    : activeQuestion !== null && "disable"
                }`}
              >
                <div className="title_pin">
                  <div className="title_hide_wrap">
                    <h4 className="title">Project Typology</h4>
                    <div className="switch_btn image_toggle_btn">
                      <div
                        className="toggle_container"
                        onClick={() =>
                          toggleFieldVisibility(7, "project_typology")
                        }
                      >
                        <div className="toggle_text">Hide</div>
                        <div className="toggle_switch">
                          <div
                            className={`toggle_circle ${
                              sections[7].visibility ? "left" : "right"
                            }`}
                          />
                        </div>
                        <div className="toggle_text">Show</div>
                      </div>
                    </div>
                  </div>
                  <img
                    src={editicon}
                    alt=""
                    className="edit_icon"
                    onClick={() => handleEditButton(7)}
                  />
                </div>
                <BEAutocompleteTypology
                  editFocus={activeQuestion === 7}
                  allOptionData={sections[7].typologyList}
                  selectedData={sections[7].selectedOptions}
                  updateSectionData={updateSectionData}
                  sectionId={7}
                  onSave={() => ""}
                />
                {Object.keys(sections[7].errors).length > 0 && (
                  <p className="error">{sections[7].errors.project_typology}</p>
                )}
                {activeQuestion === 7 && (
                  <div className="save_cancel_cta">
                    <button
                      className="save_cta"
                      onClick={() => handleSubmit(7)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel_cta"
                      onClick={() => handleCancel(7)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
            {/* NINTH QUESTION */}
            {validQuestionFields.includes("service_design_style") ? (
              <div
                className={`brand_subsec ${
                  activeQuestion === 8
                    ? ""
                    : activeQuestion !== null && "disable"
                }`}
              >
                <div className="title_pin">
                  <div className="title_hide_wrap">
                    <h4 className="title">Your Design Style</h4>
                    <div className="switch_btn image_toggle_btn">
                      <div
                        className="toggle_container"
                        onClick={() => toggleFieldVisibility(8, "design_style")}
                      >
                        <div className="toggle_text">Hide</div>
                        <div className="toggle_switch">
                          <div
                            className={`toggle_circle ${
                              sections[8].visibility ? "left" : "right"
                            }`}
                          />
                        </div>
                        <div className="toggle_text">Show</div>
                      </div>
                    </div>
                  </div>
                  <img
                    src={editicon}
                    alt=""
                    className="edit_icon"
                    onClick={() => handleEditButton(8)}
                  />
                </div>
                <BEAutocompleteTypology
                  allOptionData={sections[8].designStyleList}
                  selectedData={sections[8].selectedOptions}
                  editFocus={activeQuestion === 8}
                  updateSectionData={updateSectionData}
                  sectionId={8}
                  onSave={() => ""}
                />
                {Object.keys(sections[8].errors).length > 0 && (
                  <p className="error">{sections[8].errors.design_style}</p>
                )}
                {activeQuestion === 8 && (
                  <div className="save_cancel_cta">
                    <button
                      className="save_cta"
                      onClick={() => handleSubmit(8)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel_cta"
                      onClick={() => handleCancel(8)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
            {/* TENTH QUESTION */}
            {validQuestionFields.includes("average_budget") ? (
              <div
                className={`brand_subsec ${
                  activeQuestion === 9
                    ? ""
                    : activeQuestion !== null && "disable"
                }`}
              >
                <div className="title_pin">
                  <div className="title_hide_wrap">
                    <h4 className="title">Average Budget of your Projects</h4>
                    <div className="switch_btn image_toggle_btn">
                      <div
                        className="toggle_container"
                        onClick={() =>
                          toggleFieldVisibility(9, "avg_project_budget")
                        }
                      >
                        <div className="toggle_text">Hide</div>
                        <div className="toggle_switch">
                          <div
                            className={`toggle_circle ${
                              sections[9].visibility ? "left" : "right"
                            }`}
                          />
                        </div>
                        <div className="toggle_text">Show</div>
                      </div>
                    </div>
                  </div>
                  <img
                    src={editicon}
                    alt=""
                    className="edit_icon"
                    onClick={() => handleEditButton(9)}
                  />
                </div>
                <div className="radio">
                  {activeQuestion !== 9 ? (
                    <ul className="radio" style={{ pointerEvents: "none" }}>
                      <li className="selectedValuePill">
                        {sections[9].tempSelectedOption || "No Budget Selected"}
                      </li>
                    </ul>
                  ) : (
                    <div>
                      <div
                        className={`field_wrapper ${style.currency_dropdown}`}
                      >
                        <div className="edit_dropdown_wrap">
                          <SelectDropdown
                            classProp="bedit_profile_select"
                            label="Currency"
                            labelId="Currency"
                            lightTheme
                            data={currencyArr}
                            value={sections[9].tempSelectedCurrency}
                            onChange={(e) => handleCurrencyChange(9, e)}
                          />
                        </div>
                      </div>
                      <ul className="radio">{budgetList}</ul>
                    </div>
                  )}
                </div>
                {Object.keys(sections[9].errors).length > 0 && (
                  <p className="error">
                    {sections[9].errors.avg_project_budget}
                  </p>
                )}
                {activeQuestion === 9 && (
                  <div className="save_cancel_cta">
                    <button
                      className="save_cta"
                      onClick={() => handleSubmit(9)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel_cta"
                      onClick={() => handleCancel(9)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
            {/* ELEVEN QUESTION */}

            {validQuestionFields.includes("project_scope") ? (
              <div
                className={`brand_subsec ${
                  activeQuestion === 10
                    ? ""
                    : activeQuestion !== null && "disable"
                }`}
              >
                <div className="title_pin">
                  <div className="title_hide_wrap">
                    <h4 className="title">Preference of project scope</h4>
                    <div className="switch_btn image_toggle_btn">
                      <div
                        className="toggle_container"
                        onClick={() =>
                          toggleFieldVisibility(10, "project_scope")
                        }
                      >
                        <div className="toggle_text">Hide</div>
                        <div className="toggle_switch">
                          <div
                            className={`toggle_circle ${
                              sections[10].visibility ? "left" : "right"
                            }`}
                          />
                        </div>
                        <div className="toggle_text">Show</div>
                      </div>
                    </div>
                  </div>
                  <img
                    src={editicon}
                    alt=""
                    className="edit_icon"
                    onClick={() => handleEditButton(10)}
                  />
                </div>
                <div className="radio">
                  {activeQuestion !== 10 ? (
                    <ul
                      className="checkboxes"
                      style={{ pointerEvents: "none" }}
                    >
                      {selectedProjectScopeList}
                    </ul>
                  ) : (
                    <ul className="checkboxes">{projectScopeList}</ul>
                  )}
                </div>
                {Object.keys(sections[10].errors).length > 0 && (
                  <p className="error">{sections[10].errors.project_scope}</p>
                )}
                {activeQuestion === 10 && (
                  <div className="save_cancel_cta">
                    <button
                      className="save_cta"
                      onClick={() => handleSubmit(10)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel_cta"
                      onClick={() => handleCancel(10)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
            {/* TWELVE QUESTION */}
            {validQuestionFields.includes("current_minimal_fee") ? (
              <div
                className={`brand_subsec ${
                  activeQuestion === 11
                    ? ""
                    : activeQuestion !== null && "disable"
                }`}
              >
                <div className="title_pin">
                  <div className="title_hide_wrap">
                    <h4 className="title">Current Minimum Project Fee</h4>
                    <div className="switch_btn image_toggle_btn">
                      <div
                        className="toggle_container"
                        onClick={() =>
                          toggleFieldVisibility(11, "project_mimimal_fee")
                        }
                      >
                        <div className="toggle_text">Hide</div>
                        <div className="toggle_switch">
                          <div
                            className={`toggle_circle ${
                              sections[11].visibility ? "left" : "right"
                            }`}
                          />
                        </div>
                        <div className="toggle_text">Show</div>
                      </div>
                    </div>
                  </div>
                  <img
                    src={editicon}
                    alt=""
                    className="edit_icon"
                    onClick={() => handleEditButton(11)}
                  />
                </div>
                <div className="radio">
                  {activeQuestion !== 11 ? (
                    <ul className="radio" style={{ pointerEvents: "none" }}>
                      <li className="selectedValuePill">
                        {sections[11].tempSelectedOption || "No Fee Selected"}
                      </li>
                    </ul>
                  ) : (
                    <div>
                      <div
                        className={`field_wrapper ${style.currency_dropdown}`}
                      >
                        <div className="edit_dropdown_wrap">
                          <SelectDropdown
                            classProp="bedit_profile_select"
                            label="Currency"
                            labelId="Currency"
                            lightTheme
                            data={currencyArr}
                            value={sections[11].tempSelectedCurrency}
                            onChange={(e) => handleCurrencyChange(11, e)}
                          />
                        </div>
                      </div>
                      <ul className="radio">{minFeeList}</ul>
                    </div>
                  )}
                </div>
                {Object.keys(sections[11].errors).length > 0 && (
                  <p className="error">
                    {sections[11].errors.project_mimimal_fee}
                  </p>
                )}
                {activeQuestion === 11 && (
                  <div className="save_cancel_cta">
                    <button
                      className="save_cta"
                      onClick={() => handleSubmit(11)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel_cta"
                      onClick={() => handleCancel(11)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {/* SOCIAL DATA START HERE */}
      {/* SOCIAL DATA START HERE */}
      {/* SOCIAL DATA START HERE */}
      <div className="col-lg-12 p-0">
        <div className="firm_project_container">
          <div className="title_edit">
            <h2 className="section_title">Firm Connect Data</h2>
          </div>
          <div className="row">
            <div className="col-lg-6 p-0 border_right">
              <div className="business_details_wrapper section1">
                <div
                  className={`brand_subsec ${
                    activeQuestion === 3
                      ? ""
                      : activeQuestion !== null && "disable"
                  }`}
                >
                  <div className="title_pin">
                    <h4 className="title">Company's Email IDs</h4>
                    <img
                      src={editicon}
                      alt=""
                      className="edit_icon"
                      onClick={() => handleEditButton(3)}
                    />
                  </div>
                  {activeQuestion === 3 ? (
                    <div className="email_id_flex">
                      {sections[3].tempSelectedValues.length > 0 ? (
                        sections[3].tempSelectedValues.map((email, index) => (
                          <div className="field_wrapper">
                            <div className="email_drop">
                              <SelectDropdown
                                classProp="bedit_profile_select"
                                label="Department"
                                labelId="Department"
                                lightTheme
                                data={sections[3].emailTypes}
                                value={email?.type || ""}
                                onChange={(e) =>
                                  handleSectionChange(
                                    3,
                                    index,
                                    "type",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="email_input">
                              <FullWidthTextField
                                classProp="business_edit_input"
                                lightTheme
                                label="Email Id"
                                name="email"
                                value={email?.email}
                                disabled={activeQuestion !== 3}
                                onChange={(e) =>
                                  handleEmailInputChange(e, index)
                                }
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="field_wrapper">
                          <div className="email_drop">
                            <FullWidthTextField
                              classProp="business_edit_input"
                              lightTheme
                              label="Department"
                              name="email_department"
                              value=""
                              disabled={activeQuestion !== 3}
                            />
                          </div>
                          <div className="email_input">
                            <FullWidthTextField
                              classProp="business_edit_input"
                              lightTheme
                              label="Email Id"
                              name="Email Id"
                              value=""
                              disabled={activeQuestion !== 3}
                            />
                          </div>
                        </div>
                      )}
                      {/* <div className="field_wrapper">
                        <div className="email_drop">
                          <SelectDropdown
                            classProp="bedit_profile_select"
                            label="Department"
                            labelId="Department"
                            lightTheme
                            data={sections[3].emailTypes}
                            value={sections[3].tempSelectedCurrency}
                            onChange={(e) =>
                              handleSectionChange(3, "type", e.target.value)
                            }
                          />
                        </div>
                        <div className="email_input">
                          <FullWidthTextField
                            classProp={width < 1600 && "business_edit_input"}
                            lightTheme
                            label="Email Id"
                            name="Email Id"
                            value={sections[3].tempSelectedValues.email}
                          />
                        </div>
                      </div> */}
                    </div>
                  ) : (
                    <div>
                      <div className="email_id_flex">
                        {sections[3].tempSelectedValues.length > 0 ? (
                          sections[3].tempSelectedValues.map((email) => (
                            <div className="field_wrapper">
                              <div className="email_drop">
                                <FullWidthTextField
                                  classProp="business_edit_input"
                                  lightTheme
                                  label="Department"
                                  name="email_department"
                                  value={email?.type}
                                  disabled={activeQuestion !== 3}
                                />
                              </div>
                              <div className="email_input">
                                <FullWidthTextField
                                  classProp="business_edit_input"
                                  lightTheme
                                  label="Email Id"
                                  name="Email Id"
                                  value={email?.email}
                                  disabled={activeQuestion !== 3}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="field_wrapper">
                            <div className="email_drop">
                              <FullWidthTextField
                                classProp="business_edit_input"
                                lightTheme
                                label="Department"
                                name="email_department"
                                value=""
                                disabled={activeQuestion !== 3}
                              />
                            </div>
                            <div className="email_input">
                              <FullWidthTextField
                                classProp="business_edit_input"
                                lightTheme
                                label="Email Id"
                                name="Email Id"
                                value=""
                                disabled={activeQuestion !== 3}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeQuestion === 3 && (
                    <div className="save_cancel_cta no_space">
                      <button
                        className="save_cta"
                        onClick={() => handleSubmit(3)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel_cta"
                        onClick={() => handleCancel(3)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div
                  className={`brand_subsec ${
                    activeQuestion === 18
                      ? ""
                      : activeQuestion !== null && "disable"
                  }`}
                >
                  <div className="title_pin">
                    <h4 className="title">Address Or Google Location</h4>
                    <img
                      src={editicon}
                      alt=""
                      className="edit_icon"
                      onClick={() => handleEditButton(18)}
                    />
                  </div>
                  {activeQuestion === 18 ? (
                    <div className="email_id_flex">
                      {sections[18].tempSelectedValues.length > 0 ? (
                        sections[18].tempSelectedValues.map(
                          (address, index) => (
                            <div className="field_wrapper">
                              <div className="email_drop">
                                <SelectDropdown
                                  classProp="bedit_profile_select"
                                  label="Address Type"
                                  labelId="Address Type"
                                  lightTheme
                                  data={sections[18].addressTypes}
                                  value={address?.type || ""}
                                  onChange={(e) =>
                                    handleSectionChange(
                                      18,
                                      index,
                                      "type",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="email_input">
                                <FullWidthTextField
                                  classProp={
                                    width < 1600 && "business_edit_input"
                                  }
                                  lightTheme
                                  label="Address"
                                  name="address"
                                  value={address?.address}
                                  onChange={(e) =>
                                    handleSectionChange(
                                      18,
                                      "address",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className="field_wrapper">
                          <div className="email_drop">
                            <FullWidthTextField
                              classProp="business_edit_input"
                              lightTheme
                              label="Address"
                              name="address_type"
                              value=""
                              disabled={activeQuestion !== 18}
                            />
                          </div>
                          <div className="email_input">
                            <FullWidthTextField
                              classProp="business_edit_input"
                              lightTheme
                              label="Address "
                              name="Address"
                              value=""
                              disabled={activeQuestion !== 18}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="email_id_flex">
                      <div className="field_wrapper">
                        <div className="email_drop">
                          <FullWidthTextField
                            classProp="business_edit_input"
                            lightTheme
                            label="Address type"
                            name="addressType"
                            value=""
                          />
                        </div>
                        <div className="email_input">
                          <FullWidthTextField
                            classProp="business_edit_input"
                            lightTheme
                            label="Address"
                            name="Address"
                            value=""
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {activeQuestion === 18 && (
                    <div className="save_cancel_cta no_space">
                      <button
                        className="save_cta"
                        // onClick={() => handleSubmit(18)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel_cta"
                        // onClick={() => handleCancel(18)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 p-0">
              <div className="business_details_wrapper section2">
                <div
                  className={`brand_subsec ${
                    activeQuestion === 4
                      ? ""
                      : activeQuestion !== null && "disable"
                  }`}
                >
                  <div className="title_pin">
                    <h4 className="title">Be Found By Clients, Led By AI!</h4>
                    <img
                      src={editicon}
                      alt=""
                      className="edit_icon"
                      onClick={() => handleEditButton(4)}
                    />
                  </div>
                  <p className="error">{sections[4].errors.undefined}</p>
                  <ul className="social_list">
                    <li>
                      <div className="field_wrapper social_wrapper">
                        <img
                          width={30}
                          height={30}
                          src={websiteiconb}
                          alt="website"
                          className="field_icon"
                          loading="lazy"
                        />
                        <div className="firm_connect_input">
                          <FullWidthTextField
                            lightTheme
                            disabled={activeQuestion !== 4}
                            classProp="business_edit_input firm_connect_input"
                            label="Website URL"
                            name="websiteLink"
                            value={sections[4].tempValues.websiteLink}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      {Object.keys(sections[4].errors).length > 0 && (
                        <p className="error">
                          {sections[4].errors.website_link}
                        </p>
                      )}
                    </li>
                    <li>
                      <div className="field_wrapper social_wrapper">
                        <img
                          width={30}
                          height={30}
                          src={linkediniconb}
                          alt="website"
                          className="field_icon"
                          loading="lazy"
                        />
                        <div className="firm_connect_input">
                          <FullWidthTextField
                            classProp="business_edit_input firm_connect_input"
                            lightTheme
                            disabled={activeQuestion !== 4}
                            label="Linkedin Profile Link"
                            name="linkedinLink"
                            value={sections[4].tempValues.linkedinLink}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      {Object.keys(sections[4].errors).length > 0 && (
                        <p className="error">
                          {sections[4].errors.linkedin_link}
                        </p>
                      )}
                    </li>
                    <li>
                      <div className="field_wrapper social_wrapper">
                        <img
                          width={30}
                          height={30}
                          src={instaWhite}
                          alt="website"
                          className="field_icon"
                          loading="lazy"
                        />

                        <div className="firm_connect_input">
                          <FullWidthTextField
                            classProp="business_edit_input firm_connect_input"
                            lightTheme
                            disabled={activeQuestion !== 4}
                            label="Instagram Username"
                            name="instagramLink"
                            value={sections[4].tempValues.instagramLink}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      {Object.keys(sections[4].errors).length > 0 && (
                        <p className="error">
                          {sections[4].errors.instagram_handle}
                        </p>
                      )}
                    </li>
                  </ul>
                  {activeQuestion === 4 && (
                    <div className="save_cancel_cta no_space">
                      <button
                        className="save_cta"
                        onClick={() => handleSubmit(4)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel_cta"
                        onClick={() => handleCancel(4)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ADD MEDIA START HERE */}
        {/* ADD MEDIA START HERE */}
        {/* ADD MEDIA START HERE */}
        <div className="col-lg-12 p-0">
          <div className="media_container">
            <div className="title_edit">
              <h2 className="section_title">Add Media</h2>
            </div>
            <div className="brand_subsec first_box">
              <div className="row">
                <div className="col-lg-6 p-0 border_right">
                  <div className="profile_brochure_wrapper section1">
                    <h4 className="title cp_heading">Company Profile*</h4>
                    <p className="notice_msg">
                      Maximum File Size Is 30 MB. PDF, JPEG, PNG, PPT Allowed
                    </p>
                    {sections[13].mediaUploads.map((data, i) => (
                      <div className="file_flex" key={`company-profile-${i}`}>
                        <div className="name_status_switch">
                          <div className="filename">
                            <a
                              href={`${aws_object_url}business/${data?.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {data?.name}
                            </a>
                          </div>
                          <div
                            onClick={() =>
                              handleDeleteClick(
                                data,
                                "company_profile_media",
                                13
                              )
                            }
                          >
                            <img
                              width={24}
                              height={27}
                              src={blackDeleteicon}
                              alt="delete"
                              className="delete_icon"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="upload_file_wrapper">
                      <div className="input_wrapper">
                        {/* <input
                        className="input_box"
                        type="file"
                        id="companyProfileUpload"
                        hidden
                        name="company_logo"
                      /> */}
                        <label
                          // htmlFor="companyProfileUpload"
                          className="upload_label"
                          onClick={() => {
                            setUploadSection("company_profile_media");
                            setUploadFile(true);
                          }}
                        >
                          <div className="img_wrapper">
                            <img
                              width={26}
                              height={26}
                              src={addmoreIcon}
                              alt="upload"
                              className="upload_icon"
                              loading="lazy"
                            />
                          </div>
                          <div className="text">Add More</div>
                        </label>
                      </div>
                      <div
                        className="notice"
                        style={{
                          display: error || upload === true ? "block" : "none",
                        }}
                      >
                        {upload === true ? "File name" : "Error message here"}
                      </div>
                      <div className="notice">
                        Maximum File Size Is 30 MB. PDF, JPEG, PNG, PPT Allowed{" "}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 p-0">
                  <div className="profile_brochure_wrapper section2">
                    <div className="title_pin_wrap">
                      <div className="title_pin_flex">
                        <h4 className="title cat_heading">
                          Product Catalogues/Brochures
                        </h4>
                        <div
                          className="entity"
                          onClick={() => handleModalData(0)}
                        >
                          &#9432;
                        </div>
                      </div>
                    </div>
                    <p className="notice_msg">
                      Maximum File Size Is 30 MB. PDF, JPEG, PNG, PPT Allowed
                    </p>
                    <div className="file_flex file_hide">
                      {sections[12].mediaUploads.map((data, i) => (
                        <div className="name_status_switch">
                          <div className="name_flex" key={`brochure-${i}`}>
                            <div className="filename">
                              <a
                                href={`${aws_object_url}business/${data?.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {data?.name}
                              </a>
                            </div>
                            <div
                              onClick={() =>
                                handleDeleteClick(
                                  data,
                                  "product_catalogues_media",
                                  12
                                )
                              }
                            >
                              <img
                                width={24}
                                height={27}
                                src={blackDeleteicon}
                                alt="delete"
                                className="delete_icon"
                                loading="lazy"
                              />
                            </div>
                          </div>
                          {/* <div className="switch_btn catalouge_switch">
                          <div
                            className="toggle_container"
                            onClick={() => catalougeVisibility(i)}
                          >
                            <div className="toggle_text">Hide</div>
                            <div className="toggle_switch">
                              <div
                                className={`toggle_circle ${
                                  catalougeShow[i] ? "left" : "right"
                                }`}
                              />
                            </div>
                            <div className="toggle_text">Show</div>
                          </div>
                        </div> */}
                        </div>
                      ))}
                    </div>
                    <div className="upload_file_wrapper">
                      <div className="input_wrapper">
                        {/* <input
                        className="input_box"
                        type="file"
                        id="catalougeUpload"
                        hidden
                        name="company_logo"
                      /> */}
                        <label
                          htmlFor="catalougeUpload"
                          className="upload_label"
                          onClick={() => {
                            setUploadSection("product_catalogues_media");
                            setUploadFile(true);
                          }}
                        >
                          <div className="img_wrapper">
                            <img
                              width={26}
                              height={26}
                              src={addmoreIcon}
                              alt="upload"
                              className="upload_icon"
                              loading="lazy"
                            />
                          </div>
                          <div className="text">Add More</div>
                        </label>
                      </div>
                      <div
                        className="notice"
                        style={{
                          display: error || upload === true ? "block" : "none",
                        }}
                      >
                        {upload === true ? "File name" : "Error message here"}
                      </div>
                      <div className="notice">
                        Maximum File Size Is 30 MB. PDF, JPEG, PNG, PPT Allowed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="brand_subsec">
              <div className="title_flex">
                <h4 className="title projects_heading">Projects</h4>
                <p className="notice_msg">
                  Maximum File Size Is 30 MB. JPEG, PNG, JPG, SVG, WEBP, HEIC
                  Allowed
                </p>
              </div>
              <div className="title_pin_wrap">
                <div className="title_pin_flex">
                  <h5 className="image_title cat_heading">
                    Products/Materials
                  </h5>
                  <div className="entity" onClick={() => handleModalData(1)}>
                    &#9432;
                  </div>
                </div>
                {/* <div className="gallery_cta" onClick={() => setGalleryShow(true)}>
                View Gallery
              </div> */}
              </div>
              <ul className="pr_images_container">
                {sections[14].mediaUploads.map((img, i) => (
                  <li className="list_item image_height" key={i}>
                    <div
                      className="project_img_wrapper"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        ref={projectImageRef}
                        width={32}
                        height={32}
                        src={`${aws_object_url}business/${img.url}`}
                        alt="completed project"
                        className="uploaded_img"
                        loading="lazy"
                        onClick={() => handleImageClick(img, i)}
                      />
                      <div className="switch_btn image_toggle_btn">
                        <div
                          className="toggle_container"
                          onClick={() => projectsVisibility(i, 14)}
                        >
                          <div className="toggle_text">Hide</div>
                          <div className="toggle_switch">
                            <div
                              className={`toggle_circle ${
                                sections[14].mediaUploads[i].visibility
                                  ? "right"
                                  : "left"
                              }`}
                            />
                          </div>
                          <div className="toggle_text">Show</div>
                        </div>
                      </div>
                      <img
                        width={32}
                        height={32}
                        src={closeIcon}
                        alt="close"
                        className="close_icon"
                        loading="lazy"
                        onClick={() =>
                          handleDeleteClick(img, "completed_products_media", 14)
                        }
                      />
                    </div>
                  </li>
                ))}
                <li className="project_image_uploader list_item">
                  <div className="input_wrapper">
                    <div
                      className="upload_label"
                      style={{ height: projectImageHeight }}
                      onClick={() => {
                        setUploadSection("completed_products_media");
                        setUploadFile(true);
                      }}
                    >
                      <div className="img_wrapper">
                        <img
                          width={35}
                          height={35}
                          src={addmoreIcon}
                          alt="upload"
                          className="upload_icon"
                          loading="lazy"
                        />
                      </div>
                      <div className="text">Add More</div>
                    </div>
                  </div>
                  {/* <div className="input_wrapper">
                  <input
                    className="input_box"
                    type="file"
                    id="projectImageUpload"
                    hidden
                    name="company_logo"
                  />
                  <label
                    style={{ height: projectImageHeight }}
                    htmlFor="projectImageUpload"
                    className="upload_label"
                    onClick={() => setUpload(true)}
                  >
                    <div className="img_wrapper">
                      <img
                        width={35}
                        height={35}
                        src={addmoreIcon}
                        alt="upload"
                        className="upload_icon"
                        loading="lazy"
                      />
                    </div>
                    <div className="text">Add More</div>
                  </label>
                </div> */}
                </li>
              </ul>
            </div>
            <div className="brand_subsec">
              <div className="title_pin_wrap">
                <div className="title_pin_flex">
                  <h5 className="image_title cat_heading">
                    Projects Photos and Renders
                  </h5>
                  <div className="entity" onClick={() => handleModalData(2)}>
                    &#9432;
                  </div>
                </div>
                {/* <div className="gallery_cta" onClick={() => setGalleryShow(true)}>
                View Gallery
              </div> */}
              </div>
              <ul className="pr_images_container">
                {sections[15].mediaUploads.map((img, i) => (
                  <li className="list_item" key={i}>
                    <div
                      className="project_img_wrapper"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        ref={projectImageRef}
                        width={32}
                        height={32}
                        src={`${aws_object_url}business/${img.url}`}
                        alt="completed project"
                        className="uploaded_img"
                        loading="lazy"
                        onClick={() => handleImageClick(img, i)}
                      />
                      <div className="switch_btn image_toggle_btn">
                        <div
                          className="toggle_container"
                          onClick={() => projectsVisibility(i, 15)}
                        >
                          <div className="toggle_text">Hide</div>
                          <div className="toggle_switch">
                            <div
                              className={`toggle_circle ${
                                sections[15].mediaUploads[i].visibility
                                  ? "right"
                                  : "left"
                              }`}
                            />
                          </div>
                          <div className="toggle_text">Show</div>
                        </div>
                      </div>
                      <img
                        width={32}
                        height={32}
                        src={closeIcon}
                        alt="close"
                        className="close_icon"
                        loading="lazy"
                        onClick={() =>
                          handleDeleteClick(img, "project_renders_media", 15)
                        }
                      />
                    </div>
                  </li>
                ))}
                <li className="project_image_uploader list_item">
                  <div className="input_wrapper">
                    <div
                      className="upload_label"
                      style={{ height: projectImageHeight }}
                      onClick={() => {
                        setUploadSection("project_renders_media");
                        setUploadFile(true);
                      }}
                    >
                      <div className="img_wrapper">
                        <img
                          width={35}
                          height={35}
                          src={addmoreIcon}
                          alt="upload"
                          className="upload_icon"
                          loading="lazy"
                        />
                      </div>
                      <div className="text">Add More</div>
                    </div>
                  </div>
                  {/* <div className="input_wrapper">
                  <input
                    className="input_box"
                    type="file"
                    id="projectImageUpload"
                    hidden
                    name="company_logo"
                  />
                  <label
                    style={{ height: projectImageHeight }}
                    htmlFor="projectImageUpload"
                    className="upload_label"
                    onClick={() => setUpload(true)}
                  >
                    <div className="img_wrapper">
                      <img
                        width={35}
                        height={35}
                        src={addmoreIcon}
                        alt="upload"
                        className="upload_icon"
                        loading="lazy"
                      />
                    </div>
                    <div className="text">Add More</div>
                  </label>
                </div> */}
                </li>
              </ul>
            </div>
            <div className="brand_subsec">
              <div className="title_pin_wrap">
                <div className="title_pin_flex">
                  <h5 className="image_title cat_heading">Sites in Progress</h5>
                  <div className="entity" onClick={() => handleModalData(3)}>
                    &#9432;
                  </div>
                </div>
                {/* <div className="gallery_cta" onClick={() => setGalleryShow(true)}>
                View Gallery
              </div> */}
              </div>
              <ul className="pr_images_container">
                {sections[16].mediaUploads.map((img, i) => (
                  <li className="list_item" key={i}>
                    <div
                      className="project_img_wrapper"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        ref={projectImageRef}
                        width={32}
                        height={32}
                        src={`${aws_object_url}business/${img.url}`}
                        alt="completed project"
                        className="uploaded_img"
                        loading="lazy"
                        onClick={() => handleImageClick(img, i)}
                      />
                      <div className="switch_btn image_toggle_btn">
                        <div
                          className="toggle_container"
                          onClick={() => projectsVisibility(i, 16)}
                        >
                          <div className="toggle_text">Hide</div>
                          <div className="toggle_switch">
                            <div
                              className={`toggle_circle ${
                                sections[16].mediaUploads[i].visibility
                                  ? "right"
                                  : "left"
                              }`}
                            />
                          </div>
                          <div className="toggle_text">Show</div>
                        </div>
                      </div>
                      <img
                        width={32}
                        height={32}
                        src={closeIcon}
                        alt="close"
                        className="close_icon"
                        loading="lazy"
                        onClick={() =>
                          handleDeleteClick(img, "sites_inprogress_media", 16)
                        }
                      />
                    </div>
                  </li>
                ))}
                <li className="project_image_uploader list_item">
                  <div className="input_wrapper">
                    <div
                      className="upload_label"
                      style={{ height: projectImageHeight }}
                      onClick={() => {
                        setUploadSection("sites_inprogress_media");
                        setUploadFile(true);
                      }}
                    >
                      <div className="img_wrapper">
                        <img
                          width={35}
                          height={35}
                          src={addmoreIcon}
                          alt="upload"
                          className="upload_icon"
                          loading="lazy"
                        />
                      </div>
                      <div className="text">Add More</div>
                    </div>
                  </div>
                  {/* <div className="input_wrapper">
                  <input
                    className="input_box"
                    type="file"
                    id="projectImageUpload"
                    hidden
                    name="company_logo"
                  />
                  <label
                    style={{ height: projectImageHeight }}
                    htmlFor="projectImageUpload"
                    className="upload_label"
                    onClick={() => setUpload(true)}
                  >
                    <div className="img_wrapper">
                      <img
                        width={35}
                        height={35}
                        src={addmoreIcon}
                        alt="upload"
                        className="upload_icon"
                        loading="lazy"
                      />
                    </div>
                    <div className="text">Add More</div>
                  </label>
                </div> */}
                </li>
              </ul>
            </div>
            <div className="brand_subsec">
              <div className="title_pin_wrap">
                <div className="title_pin_flex">
                  <h5 className="image_title cat_heading">Other Media</h5>
                  <div className="entity" onClick={() => handleModalData(4)}>
                    &#9432;
                  </div>
                </div>
                {/* <div className="gallery_cta" onClick={() => setGalleryShow(true)}>
                View Gallery
              </div> */}
              </div>
              <ul className="pr_images_container">
                {sections[17].mediaUploads.map((img, i) => (
                  <li className="list_item" key={i}>
                    <div
                      className="project_img_wrapper"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        ref={projectImageRef}
                        width={32}
                        height={32}
                        src={`${aws_object_url}business/${img.url}`}
                        alt="completed project"
                        className="uploaded_img"
                        loading="lazy"
                        onClick={() => handleImageClick(img, i)}
                      />
                      <div className="switch_btn image_toggle_btn">
                        <div
                          className="toggle_container"
                          onClick={() => projectsVisibility(i, 17)}
                        >
                          <div className="toggle_text">Hide</div>
                          <div className="toggle_switch">
                            <div
                              className={`toggle_circle ${
                                sections[17].mediaUploads[i].visibility
                                  ? "right"
                                  : "left"
                              }`}
                            />
                          </div>
                          <div className="toggle_text">Show</div>
                        </div>
                      </div>
                      <img
                        width={32}
                        height={32}
                        src={closeIcon}
                        alt="close"
                        className="close_icon"
                        loading="lazy"
                        onClick={() =>
                          handleDeleteClick(img, "other_media", 17)
                        }
                      />
                    </div>
                  </li>
                ))}
                <li className="project_image_uploader list_item">
                  <div className="input_wrapper">
                    <div
                      className="upload_label"
                      style={{ height: projectImageHeight }}
                      onClick={() => {
                        setUploadSection("other_media");
                        setUploadFile(true);
                      }}
                    >
                      <div className="img_wrapper">
                        <img
                          width={35}
                          height={35}
                          src={addmoreIcon}
                          alt="upload"
                          className="upload_icon"
                          loading="lazy"
                        />
                      </div>
                      <div className="text">Add More</div>
                    </div>
                  </div>
                  {/* <div className="input_wrapper">
                  <input
                    className="input_box"
                    type="file"
                    id="projectImageUpload"
                    hidden
                    name="company_logo"
                  />
                  <label
                    style={{ height: projectImageHeight }}
                    htmlFor="projectImageUpload"
                    className="upload_label"
                    onClick={() => setUpload(true)}
                  >
                    <div className="img_wrapper">
                      <img
                        width={35}
                        height={35}
                        src={addmoreIcon}
                        alt="upload"
                        className="upload_icon"
                        loading="lazy"
                      />
                    </div>
                    <div className="text">Add More</div>
                  </label>
                </div> */}
                </li>
              </ul>
            </div>
            <div className="cta_wrapper final_cta_wrapper">
              <button className="solid_cta" onClick={handleSubmit}>
                <img
                  width={40}
                  height={40}
                  src={whitetick}
                  alt="icon"
                  className="tick_icon"
                  loading="lazy"
                />
                <div className="text">Get Verified Now</div>
                <img
                  width={50}
                  height={20}
                  src={rightarrowwhite}
                  alt="icon"
                  className="icon"
                  loading="lazy"
                />
              </button>
              <div className="notice_msg">
                Need help setting up your store?{" "}
                <a href="" className="anchor">
                  Get help!
                </a>
              </div>
            </div>
          </div>
        </div>
        <BusinessProfileModal
          dataarr={modalData}
          className="white_theme"
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
        <BusinessUploadModal
          dataarr={modalData}
          className="white_theme"
          show={uploadFile}
          onHide={() => setUploadFile(false)}
          businessContext={BusinessContext?.data}
          handleUpdateMedia={handleUpdateMedia}
          sectionType={uploadSection}
          // workspaceCategory={sections[18].selectedCategory}
        />
        <BusinessViewGallery
          dataarr={galleryData}
          show={galleryShow}
          onHide={() => setGalleryShow(false)}
        />
        <DeleteConfirmationModal
          show={confirmDelete}
          onHide={() => setConfirmDelete(false)}
          onConfirmDelete={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

export default BEditProfile01;
