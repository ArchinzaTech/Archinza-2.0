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
  images,
  instaWhite,
  linkediniconb,
  websiteiconb,
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

const otherMediaArr = [
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

const workSpaceData = [
  { option: "ALL" },
  { option: "Adaptive Reuse" },
  { option: "Commercial" },
  { option: "Conservation" },
  { option: "Cultural" },
  { option: "Educational" },
  { option: "Environmental" },
  { option: "Healthcare" },
  { option: "Historical Restoration" },
  { option: "Hospitality" },
  { option: "Industrial" },
  { option: "Institutional" },
  { option: "Interior" },
  { option: "Landscape" },
  { option: "Mixed-Use" },
  { option: "Public Spaces" },
  { option: "Recreational" },
  { option: "Renovation" },
  { option: "Residential" },
  { option: "Retail" },
  { option: "Socially Responsive Design" },
  { option: "Sustainable" },
  { option: "Technology-Centric" },
  { option: "Urban Planning" },
  { option: "Workspace" },
  { option: "Exhibition Spaces" },
  { option: "Historical" },
  { option: "Vintage" },
];

const BEditProfile04 = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [upload, setUpload] = useState(false);
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
      addOnOptionsData: [],
      errors: {},
    },
    2: {
      selectedOption: "",
      tempSelectedOption: "",
      employeesRangeList: [],
      errors: {},
    },
    3: {
      selectedOption: "",
      tempSelectedOption: null,
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
      allSelected: false,
      allOptions: [],
      errors: {},
    },
    6: {
      selectedOption: "",
      tempSelectedOption: "",
      locationList: [],
      errors: {},
    },
    7: {
      selectedOptions: [],
      tempSelectedOptions: [],
      typologyList: [],
      errors: {},
    },
    8: {
      selectedOptions: [],
      tempSelectedOptions: [],
      designStyleList: [],
      errors: {},
    },
    9: {
      selectedOption: "",
      selectedCurrency: "",
      tempSelectedOption: "",
      tempSelectedCurrency: "",
      projectBudgetsList: [],
      errors: {},
    },
    10: {
      selectedOptions: [],
      tempSelectedOptions: [],
      globalData: [],
      allSelected: false,
      allOptions: [],
      errors: {},
    },
    13: {
      documentsMedia: [],
      errors: {},
    },
    14: {
      completedProjectsMedia: [],
      errors: {},
    },
    15: {
      projectRendersMedia: [],
      errors: {},
    },
    16: {
      workInProgressMedia: [],
      errors: {},
    },
    17: {
      otherMedia: [],
      errors: {},
    },
    18: {
      workSpaceDataCategories: [],
      workSpaceData: [],
      tempWorkSpaceData: [],
      selectedCategory: "",
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
  const [projectImageHeight, setProjectImageHeight] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [uploadFile, setUploadFile] = useState(false);
  const [galleryShow, setGalleryShow] = useState(false);
  const projectImageRef = useRef(null);
  const { width, height } = useWindowSize();

  const activeQuestionHandler = (i) => {
    if (i === activeQuestion) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(i);
    }
  };

  const employeeCountList = sections[2].employeesRangeList.map((option) => (
    <RadioButton
      className="business_edit_radio"
      lightTheme
      label={option}
      labelId={"employee_count_bedit4" + option}
      name="employees_range_bedit4"
      checked={sections[2].tempSelectedOption === option}
      onChange={() => handleRadioChange(option, 2)}
    />
  ));

  const selectedProjectSizeList = sections[5].tempSelectedOptions.map(
    (option) => <li className="selectedValuePill">{option}</li>
  );

  const selectedProjectScopeList = sections[10].tempSelectedOptions.map(
    (option) => <li className="selectedValuePill">{option}</li>
  );

  const projectSizeList = sections[5].globalData.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={"project_size_bedit4" + option}
      checked={sections[5].selectedOptions.includes(option)}
      onChange={(e) => onChangeHandler(option, e, 5)}
    />
  ));

  const projectScopeList = sections[10].globalData.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={"project_scope_bedit4" + option}
      checked={sections[10].selectedOptions.includes(option)}
      onChange={(e) => onChangeHandler(option, e, 10)}
    />
  ));

  const locationList = sections[6].locationList.map((option) => (
    <RadioButton
      className="business_edit_radio"
      lightTheme
      label={option}
      labelId={"location_bedit4" + option}
      name="project_location_bedit4"
      checked={sections[6].tempSelectedOption === option}
      onChange={() => handleRadioChange(option, 6)}
    />
  ));

  const budgetList = sections[9].projectBudgetsList
    .filter((f) => f.currency === sections[9].tempSelectedCurrency)
    .map((it) => it.type)
    .map((option) => (
      <RadioButton
        className="business_edit_radio"
        lightTheme
        label={option}
        labelId={"budgetList_bedit4" + option}
        name="budget_list_bedit4"
        checked={sections[9].tempSelectedOption === option}
        onChange={() => handleBudgetRadioChange(option, 9)}
      />
    ));

  const catalougeVisibility = (i) => {
    const newCatalougeState = [...catalougeShow];
    newCatalougeState[i] = !newCatalougeState[i];
    setCatalougeShow(newCatalougeState);
  };

  const completedProjectsVisibility = (i) => {
    const updatedSections = { ...sections };
    const newVisibility =
      !updatedSections[14].completedProjectsMedia[i].visibility;

    updatedSections[14].completedProjectsMedia[i].visibility = newVisibility;
    setSections(updatedSections);

    const mediaId = updatedSections[14].completedProjectsMedia[i]._id;
    // setIsUpdatingMedia(true);

    updateMedia(mediaId, newVisibility, 14, "completedProjects");
  };

  const projectRendersVisibility = (i) => {
    const updatedSections = { ...sections };
    const newVisibility =
      !updatedSections[15].projectRendersMedia[i].visibility;

    updatedSections[15].projectRendersMedia[i].visibility = newVisibility;
    setSections(updatedSections);

    const mediaId = updatedSections[15].projectRendersMedia[i]._id;
    // setIsUpdatingMedia(true);

    updateMedia(mediaId, newVisibility, 15, "projectRendersMedia");
  };

  const wipSitesVisibility = (i) => {
    const updatedSections = { ...sections };
    const newVisibility =
      !updatedSections[16].workInProgressMedia[i].visibility;

    updatedSections[16].workInProgressMedia[i].visibility = newVisibility;
    setSections(updatedSections);

    const mediaId = updatedSections[16].workInProgressMedia[i]._id;
    // setIsUpdatingMedia(true);

    updateMedia(mediaId, newVisibility, 16, "workInProgressMedia");
  };

  const otherMediaVisibility = (i) => {
    const updatedSections = { ...sections };
    const newVisibility = !updatedSections[17].otherMedia[i].visibility;

    updatedSections[17].otherMedia[i].visibility = newVisibility;
    setSections(updatedSections);

    const mediaId = updatedSections[17].otherMedia[i]._id;
    // setIsUpdatingMedia(true);

    updateMedia(mediaId, newVisibility, 17, "otherMedia");
  };
  const workspaceMediaVisibility = (i) => {
    const updatedSections = { ...sections };
    const newVisibility = !updatedSections[18].workSpaceData[i].visibility;

    updatedSections[18].workSpaceData[i].visibility = newVisibility;
    setSections(updatedSections);

    const mediaId = updatedSections[18].workSpaceData[i]._id;
    // setIsUpdatingMedia(true);

    updateMedia(mediaId, newVisibility, 18, "workSpaceData");
  };

  const handleDeleteProjectsMedia = async (
    data,
    index,
    sectionId,
    mediaType
  ) => {
    let mediaData;
    if (sectionId === 14) {
      mediaData = sections[14].completedProjectsMedia;
    } else if (sectionId === 15) {
      mediaData = sections[15].projectRendersMedia;
    } else if (sectionId === 16) {
      mediaData = sections[16].workInProgressMedia;
    } else if (sectionId === 17) {
      mediaData = sections[17].otherMedia;
    } else if (sectionId === 18) {
      mediaData = sections[18].workSpaceData;
    }
    const mediaToDelete = mediaData[index];

    const filteredMedia = mediaData.filter((media, i) => i !== index);

    let payload;
    if (sectionId === 14) {
      payload = { d_completed_projects_media: filteredMedia };
    } else if (sectionId === 15) {
      payload = { d_project_renders_media: filteredMedia };
    } else if (sectionId === 16) {
      payload = { d_work_in_progress_site_media: filteredMedia };
    } else if (sectionId === 17) {
      payload = { d_other_media: filteredMedia };
    } else if (sectionId === 18) {
      const updatedTempWorkSpaceData = sections[18].tempWorkSpaceData.filter(
        (tempMedia) => tempMedia._id !== mediaToDelete._id
      );
      const updatedWorkSpaceData = sections[18].workSpaceData.filter(
        (workMedia) => workMedia._id !== mediaToDelete._id
      );
      payload = { d_workspace_category_media: updatedTempWorkSpaceData };
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          [mediaType]: filteredMedia,
          tempWorkSpaceData: updatedTempWorkSpaceData,
        },
      }));
    } else {
      setSections((prevSections) => ({
        ...prevSections,
        [sectionId]: {
          ...prevSections[sectionId],
          [mediaType]: filteredMedia,
        },
      }));
    }

    const response = await http.post(
      `${base_url}/business/business-details/${BusinessContext?.data?._id}`,
      payload
    );

    if (response.data) {
      BusinessContext.update({
        ...BusinessContext.data,
        ...payload,
      });

      console.log("Media deleted successfully");
    }
  };
  const handleImageClick = (img, i) => {
    window.open(`${base_url}/public/uploads/business/${img.url}`, "_blank");
    // if (img.mimetype === "application/pdf") {
    // } else if (img.mimetype.includes("video")) {
    //   window.open(`${base_url}/public/uploads/business/${img.url}`, "_blank");
    // } else {
    //   window.open(`${base_url}/public/uploads/business/${img.url}`, "_blank");
    // }
  };
  const handleWorkspaceCategoryChange = async (option) => {
    const filteredCategoryData =
      BusinessContext?.data?.d_workspace_category_media?.filter(
        (it) => it.category === option
      );

    updateSectionData(18, {
      selectedCategory: option,
      workSpaceData: filteredCategoryData,
    });
  };
  const updateMedia = async (mediaId, visibility, sectionId, mediaType) => {
    let mediaData;
    if (sectionId === 14) {
      mediaData = sections[14].completedProjectsMedia;
    } else if (sectionId === 15) {
      mediaData = sections[15].projectRendersMedia;
    } else if (sectionId === 16) {
      mediaData = sections[16].workInProgressMedia;
    } else if (sectionId === 17) {
      mediaData = sections[17].otherMedia;
    } else if (sectionId === 18) {
      mediaData = sections[18].workSpaceData;
    }
    const updatedMedia = mediaData.map((media) => {
      if (media._id === mediaId) {
        return { ...media, visibility };
      }
      return media;
    });

    let payload;
    if (sectionId === 14) {
      payload = { d_completed_projects_media: updatedMedia };
    } else if (sectionId === 15) {
      payload = { d_project_renders_media: updatedMedia };
    } else if (sectionId === 16) {
      payload = { d_work_in_progress_site_media: updatedMedia };
    } else if (sectionId === 17) {
      payload = { d_other_media: updatedMedia };
    } else if (sectionId === 18) {
      console.log(sections[18].tempWorkSpaceData);

      const tempWorkSpaceData = sections[18].tempWorkSpaceData.map(
        (tempMedia) => {
          const correspondingMedia = updatedMedia.find(
            (media) => media._id === tempMedia._id
          );
          if (correspondingMedia) {
            return { ...tempMedia, visibility: correspondingMedia.visibility };
          }
          return tempMedia;
        }
      );
      payload = { d_workspace_category_media: tempWorkSpaceData };
    }

    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: {
        ...prevSections[sectionId],
        [mediaType]: updatedMedia,
        tempWorkSpaceData:
          sectionId === 18
            ? payload.d_workspace_category_media
            : prevSections[sectionId].tempWorkSpaceData,
      },
    }));
    const { data } = await http.post(
      `${base_url}/business/business-details/${BusinessContext?.data?._id}`,
      payload
    );
    if (data) {
      // setIsUpdatingMedia(false);
      message.success(`Media Visibility Updated`);
      console.log("Details Updated");
    }
    // console.log(response);

    // if (response.status === 200) {
    //   console.log("Media updated successfully");
    // } else {
    //   console.error("Error updating media");
    // }
  };

  const handleModalData = (i) => {
    setModalData(modalDataArr[i].description);
    setModalShow(true);
  };

  const validation = (sectionId, formData) => {
    const schemaValidation = {
      0: Joi.object({
        d_product_categories: Joi.array()
          .min(1)
          .required()
          .messages({ "array.min": "Select atleast One Service" }),
      }),
      1: Joi.object({
        d_additional_services: Joi.array()
          .min(1)
          .required()
          .messages({ "array.min": "Select atleast One Service" }),
      }),
      2: Joi.object({
        d_employees_range: Joi.string()
          .required()
          .messages({ "string.empty": "Employee Range is required" }),
      }),
      3: Joi.object({
        d_establishment_year: Joi.string()
          .required()
          .messages({ "string.empty": "Establishment Year is required" }),
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
        d_project_sizes: Joi.array()
          .min(1)
          .required()
          .messages({ "array.min": "Select atleast one Project Size" }),
      }),
      6: Joi.object({
        d_project_location: Joi.string()
          .required()
          .messages({ "string.empty": "Project Location is required" }),
      }),
      7: Joi.object({
        d_project_typology: Joi.array()
          .min(1)
          .required()
          .messages({ "array.min": "Select atleast one Project Typology" }),
      }),
      8: Joi.object({
        d_design_style: Joi.array()
          .min(1)
          .required()
          .messages({ "array.min": "Select atleast one Project Style" }),
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
        d_project_scope: Joi.array()
          .min(1)
          .required()
          .messages({
            "array.min": "Select atleast one Project Scope",
          })
          .label("Project Scope"),
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

  const handleDateChange = (option) => {
    setSections((prevSections) => ({
      ...prevSections,
      3: {
        ...prevSections[3],
        // selectedOption: option,
        tempSelectedOption: option,
      },
    }));
  };

  const handleUpdateMedia = (data, section) => {
    switch (section) {
      case "Company Profile":
        setSections((prevSections) => ({
          ...prevSections,
          13: {
            ...prevSections[13],
            documentsMedia: data,
          },
        }));
        BusinessContext.update({
          ...BusinessContext.data,
          d_documents_media: data,
        });

        break;
      case "Completed Project Photos/Videos":
        setSections((prevSections) => ({
          ...prevSections,
          14: {
            ...prevSections[14],
            completedProjectsMedia: data,
          },
        }));
        BusinessContext.update({
          ...BusinessContext.data,
          d_completed_projects_media: data,
        });
        break;
      case "Project Renders":
        setSections((prevSections) => ({
          ...prevSections,
          15: {
            ...prevSections[15],
            projectRendersMedia: data,
          },
        }));
        BusinessContext.update({
          ...BusinessContext.data,
          d_project_renders_media: data,
        });
        break;
      case "Work In Progress":
        setSections((prevSections) => ({
          ...prevSections,
          16: {
            ...prevSections[16],
            workInProgressMedia: data,
          },
        }));
        BusinessContext.update({
          ...BusinessContext.data,
          d_work_in_progress_site_media: data,
        });
        break;
      case "other":
        setSections((prevSections) => ({
          ...prevSections,
          17: {
            ...prevSections[18],
            otherMedia: data,
          },
        }));
        BusinessContext.update({
          ...BusinessContext.data,
          d_other_media: data,
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
          d_workspace_category_media: data,
        });
        break;

      default:
        break;
    }
  };

  const handleDeleteMedia = async (data) => {
    await http.delete(
      base_url +
        `/business/business-details/${BusinessContext?.data?._id}/documents/${data?._id}`
    );

    const filteredFiles = sections[13].documentsMedia.filter(
      (file) => file._id !== data._id
    );
    setSections((prevSections) => ({
      ...prevSections,
      13: {
        ...prevSections[13],
        documentsMedia: filteredFiles,
      },
    }));
  };

  const onChangeHandler = (option, e, sectionId) => {
    const isSelected = e.target.checked;
    const updatedOptions = [...sections[sectionId].selectedOptions];

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
        selectedOptions: updatedOptions,
      },
    }));
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
          errors: { d_establishment_year: "Invalid Date" },
        },
      }));
      return false;
    }
    if (date?.$d == "Invalid Date") {
      setSections((prevSections) => ({
        ...prevSections,
        3: {
          ...prevSections[3],
          errors: { d_establishment_year: "Invalid Date" },
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
            d_establishment_year: "Date must be within the last 50 years",
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
      console.log("ALL SELECTED");

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
        formData["d_product_categories"] = sections[0].selectedOptions;
        schema = validation(0, formData);
        if (!schema) {
          return;
        }
        break;
      case 1:
        formData["d_additional_services"] = sections[1].selectedOptions;
        schema = validation(1, formData);
        if (!schema) {
          return;
        }
        break;
      case 2:
        formData["d_employees_range"] = sections[2].tempSelectedOption;
        schema = validation(2, formData);
        if (!schema) {
          return;
        }
        setSections((prevSections) => ({
          ...prevSections,
          2: {
            ...prevSections[2],
            selectedOption: prevSections[2].tempSelectedOption,
          },
        }));
        break;
      case 3:
        let validDate = true;
        if (sections[3].selectedOption !== "") {
          validDate = validateSelectedDate(sections[3].tempSelectedOption);
        }
        if (!validDate) {
          return;
        } else {
          formData["d_establishment_year"] = validDate?.toString();
          schema = validation(3, formData);
          if (!schema) {
            return;
          }
          setSections((prevSections) => ({
            ...prevSections,
            3: {
              ...prevSections[3],
              selectedOption: prevSections[3].selectedOption,
            },
          }));
        }
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
        console.log(sections[4].errors.gst_img_error);

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
        formData["d_firm_connect_data"] = {
          website_link: formData["website_link"],
          linkedin_link: formData["linkedin_link"],
          instagram_handle: formData["instagram_handle"],
          behance_link: formData["behance_link"],
          other: formData["other"],
          gst_number: formData["gst_number"],
        };
        break;
      case 5:
        const project_sizes = filterProjectSizesOptions(5);
        formData["d_project_sizes"] = project_sizes;
        console.log(sections[5].selectedOptions);

        schema = validation(5, formData);
        if (!schema) {
          return;
        }
        break;
      case 6:
        formData["d_project_location"] = sections[6].tempSelectedOption;
        schema = validation(6, formData);
        if (!schema) {
          return;
        }
        setSections((prevSections) => ({
          ...prevSections,
          6: {
            ...prevSections[6],
            selectedOption: prevSections[6].tempSelectedOption,
          },
        }));
        break;
      case 7:
        formData["d_project_typology"] = sections[7].selectedOptions;
        schema = validation(7, formData);
        if (!schema) {
          return;
        }
        break;
      case 8:
        formData["d_design_style"] = sections[8].selectedOptions;
        schema = validation(8, formData);
        if (!schema) {
          return;
        }
        break;
      case 9:
        formData["d_avg_project_budget"] = {
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
        const options = filterProjectSizesOptions(10);
        formData["d_project_scope"] = options;
        schema = validation(10, formData);
        if (!schema) {
          return;
        }
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
    const sectionsToBeIgnored = [2];
    if (sectionsToBeIgnored.includes(sectionId)) {
      activeQuestionHandler(sectionId);
      return;
    }

    if (sectionId == 3) {
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
    const sectionsToBeIgnored = [2];
    if (sectionsToBeIgnored.includes(sectionId)) {
      activeQuestionHandler(sectionId);
      return;
    }

    if (sectionId == 3) {
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
    activeQuestionHandler(sectionId);
  };

  const updateSectionData = (sectionId, newData) => {
    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: { ...prevSections[sectionId], ...newData },
    }));
  };

  useEffect(() => {
    if (GlobalDataContext) {
      const globalData = GlobalDataContext?.business_type_d;

      const updatedSections = { ...sections };
      updatedSections[0].servicesData =
        globalData.product_categories?.map((option) => {
          const capitalizedOption = option
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return {
            label: capitalizedOption,
            value: capitalizedOption,
          };
        }) || [];

      updatedSections[1].addOnOptionsData =
        globalData.addon_services?.map((option) => {
          const capitalizedOption = option
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          return {
            label: capitalizedOption,
            value: capitalizedOption,
          };
        }) || [];

      updatedSections[2].employeesRangeList = globalData.emoployee_count || [];

      updatedSections[6].locationList = globalData.locations || [];

      updatedSections[7].typologyList =
        globalData.typologies?.map((option) => ({
          label: option,
          value: option,
        })) || [];

      updatedSections[8].designStyleList =
        globalData.design_styles?.map((option) => ({
          label: option,
          value: option,
        })) || [];
      updatedSections[18].workSpaceDataCategories =
        GlobalDataContext?.workspace_data_categories || [];

      setSections(updatedSections);
    }
  }, [GlobalDataContext]);

  useEffect(() => {
    if (BusinessContext?.data) {
      const updatedSections = { ...sections };

      const {
        d_product_categories,
        d_additional_services,
        d_employees_range,
        d_establishment_year,
        d_project_location,
        d_project_typology,
        d_design_style,
        d_documents_media,
        d_firm_connect_data,
        d_completed_projects_media,
        d_project_renders_media,
        d_work_in_progress_site_media,
        d_other_media,
        d_workspace_category_media,
      } = BusinessContext.data;

      const parsedEstablishmentYear = d_establishment_year
        ? dayjs(`${d_establishment_year}-01-01`)
        : null;

      updatedSections[0].selectedOptions = d_product_categories || [];
      updatedSections[0].tempSelectedOptions = d_product_categories || [];

      updatedSections[1].selectedOptions = d_additional_services || [];
      updatedSections[1].tempSelectedOptions = d_additional_services || [];

      updatedSections[2].selectedOption = d_employees_range || "";
      updatedSections[2].tempSelectedOption = d_employees_range || "";

      updatedSections[3].selectedOption = parsedEstablishmentYear;
      updatedSections[3].tempSelectedOption = parsedEstablishmentYear;

      updatedSections[6].selectedOption = d_project_location || "";
      updatedSections[6].tempSelectedOption = d_project_location || "";

      updatedSections[7].selectedOptions = d_project_typology || [];
      updatedSections[7].tempSelectedOptions = d_project_typology || [];

      updatedSections[8].selectedOptions = d_design_style || [];
      updatedSections[8].tempSelectedOptions = d_design_style || [];

      updatedSections[4].websiteLink = d_firm_connect_data.website_link || "";
      updatedSections[4].linkedinLink = d_firm_connect_data.linkedin_link || "";
      updatedSections[4].instagramLink =
        d_firm_connect_data.instagram_handle || "";
      updatedSections[4].behanceLink = d_firm_connect_data.behance_link || "";
      updatedSections[4].other = d_firm_connect_data.other || "";
      updatedSections[4].gstNumber = d_firm_connect_data.gst_number || "";
      updatedSections[4].tempValues = {
        websiteLink: d_firm_connect_data.website_link || "",
        linkedinLink: d_firm_connect_data.linkedin_link || "",
        instagramLink: d_firm_connect_data.instagram_handle || "",
        behanceLink: d_firm_connect_data.behance_link || "",
        other: d_firm_connect_data.other || "",
        gstNumber: d_firm_connect_data.gst_number || "",
      };
      updatedSections[13].documentsMedia = d_documents_media || [];
      updatedSections[14].completedProjectsMedia =
        d_completed_projects_media?.map((media) => ({
          ...media,
          visibility: media.visibility || false,
        })) || [];
      updatedSections[15].projectRendersMedia =
        d_project_renders_media?.map((media) => ({
          ...media,
          visibility: media.visibility || false,
        })) || [];
      updatedSections[16].workInProgressMedia =
        d_work_in_progress_site_media?.map((media) => ({
          ...media,
          visibility: media.visibility || false,
        })) || [];
      updatedSections[17].otherMedia =
        d_other_media?.map((media) => ({
          ...media,
          visibility: media.visibility || false,
        })) || [];
      const selectedCategory = sections[18].selectedCategory
        ? sections[18].selectedCategory
        : GlobalDataContext?.workspace_data_categories?.[
            Math.floor(
              Math.random() * GlobalDataContext.workspace_data_categories.length
            )
          ];
      updatedSections[18].workSpaceData =
        d_workspace_category_media?.filter(
          (it) => it.category === selectedCategory
        ) || [];
      updatedSections[18].tempWorkSpaceData = d_workspace_category_media || [];
      setSections(updatedSections);
    }
  }, [BusinessContext?.data]);

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
              <h2 className="section_title">About The Firm</h2>
            </div>
            {/* FIRST QUESTION */}
            <div
              className={`brand_subsec first_box ${
                activeQuestion === 0 ? "" : activeQuestion !== null && "disable"
              }`}
            >
              <div className="title_pin">
                <h4 className="title">
                  What is your product/material/s category?
                </h4>
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
                <p className="error">
                  {sections[0].errors.d_product_categories}
                </p>
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
            </div>
            {/* SECOND QUESTION */}
            <div
              className={`brand_subsec ${
                activeQuestion === 1 ? "" : activeQuestion !== null && "disable"
              }`}
            >
              <div className="title_pin">
                <h4 className="title">
                  What services does the business provide in addition to retail/
                  execution/ manufacturing?{" "}
                </h4>
                <img
                  src={editicon}
                  alt=""
                  className="edit_icon"
                  onClick={() => handleEditButton(1)}
                />
              </div>
              <BEAutocompleteOthers
                editFocus={activeQuestion === 1}
                allOptionData={sections[1].addOnOptionsData}
                selectedData={sections[1].selectedOptions}
                updateSectionData={updateSectionData}
                sectionId={1}
                onSave={() => ""}
              />
              {Object.keys(sections[1].errors).length > 0 && (
                <p className="error">
                  {sections[1].errors.d_additional_services}
                </p>
              )}
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
            {/* THIRD QUESTION */}
            <div
              className={`brand_subsec with_checkboxes ${
                activeQuestion === 2 ? "" : activeQuestion !== null && "disable"
              }`}
            >
              <div className="title_pin">
                <h4 className="title">Number of Employees</h4>
                <img
                  src={editicon}
                  alt=""
                  className="edit_icon"
                  onClick={() => handleEditButton(2)}
                />
              </div>
              <div>
                {activeQuestion === 2 ? (
                  <ul className="radio">{employeeCountList}</ul>
                ) : (
                  <ul className="radio" style={{ pointerEvents: "none" }}>
                    <li className="selectedValuePill">
                      {sections[2].selectedOption ||
                        "No Employee Range Selected"}
                    </li>
                  </ul>
                )}
              </div>
              {Object.keys(sections[2].errors).length > 0 && (
                <p className="error">{sections[2].errors.d_employees_range}</p>
              )}
              {activeQuestion === 2 && (
                <div className="save_cancel_cta no_space">
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
            {/* FOURTH QUESTION */}
            <div
              className={`brand_subsec with_checkboxes ${
                activeQuestion === 3 ? "" : activeQuestion !== null && "disable"
              }`}
            >
              <div className="title_pin">
                <h4 className="title">Year of establishment</h4>
                <img
                  src={editicon}
                  alt=""
                  className="edit_icon"
                  onClick={() => handleEditButton(3)}
                />
              </div>
              <div className="radio">
                {activeQuestion !== 3 ? (
                  <ul className="radio" style={{ pointerEvents: "none" }}>
                    <li className="selectedValuePill">
                      {sections[3].selectedOption?.$y || "No Date Selected"}
                    </li>
                  </ul>
                ) : (
                  // <div style={{ pointerEvents: "none" }}>
                  //   <RadioButton
                  //     className="business_edit_radio"
                  //     lightTheme
                  //     labelId={sections[3].selectedOption?.$y}
                  //     label={sections[3].selectedOption?.$y}
                  //   />
                  // </div>
                  <div className="year_picker_wrapper">
                    <YearPicker
                      classProp="business_edit_year"
                      lightTheme
                      onChange={(newdate) => handleDateChange(newdate)}
                      value={sections[3].tempSelectedOption}
                    />
                    <p className="error">
                      {sections[3].errors.d_establishment_year}
                    </p>
                  </div>
                )}
              </div>

              {activeQuestion === 3 && (
                <div className="save_cancel_cta no_space">
                  <button className="save_cta" onClick={() => handleSubmit(3)}>
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
            {/* FIFTH QUESTION */}
            <div
              className={`brand_subsec ${
                activeQuestion === 4 ? "" : activeQuestion !== null && "disable"
              }`}
            >
              <div className="title_pin">
                <h4 className="title">Firm Connect Data</h4>
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
                    <FullWidthTextField
                      lightTheme
                      disabled={activeQuestion !== 4}
                      classProp="business_edit_input"
                      label="Website URL"
                      name="websiteLink"
                      value={sections[4].tempValues.websiteLink}
                      onChange={handleInputChange}
                    />
                  </div>
                  {Object.keys(sections[4].errors).length > 0 && (
                    <p className="error">{sections[4].errors.website_link}</p>
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
                    <FullWidthTextField
                      classProp="business_edit_input"
                      lightTheme
                      disabled={activeQuestion !== 4}
                      label="Linkedin Profile Link"
                      name="linkedinLink"
                      value={sections[4].tempValues.linkedinLink}
                      onChange={handleInputChange}
                    />
                  </div>
                  {Object.keys(sections[4].errors).length > 0 && (
                    <p className="error">{sections[4].errors.linkedin_link}</p>
                  )}
                </li>
                <li>
                  <div className="field_wrapper social_wrapper">
                    <img
                      width={30}
                      height={30}
                      src={behanceiconb}
                      alt="website"
                      className="field_icon"
                      loading="lazy"
                    />
                    <FullWidthTextField
                      classProp="business_edit_input"
                      lightTheme
                      disabled={activeQuestion !== 4}
                      label="Behance Profile Link"
                      name="behanceLink"
                      value={sections[4].tempValues.behanceLink}
                      onChange={handleInputChange}
                    />
                  </div>
                  {Object.keys(sections[4].errors).length > 0 && (
                    <p className="error">{sections[4].errors.behance_link}</p>
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
                    <FullWidthTextField
                      classProp="business_edit_input"
                      lightTheme
                      disabled={activeQuestion !== 4}
                      label="Instagram Username"
                      name="instagramLink"
                      value={sections[4].tempValues.instagramLink}
                      onChange={handleInputChange}
                    />
                  </div>
                  {Object.keys(sections[4].errors).length > 0 && (
                    <p className="error">
                      {sections[4].errors.instagram_handle}
                    </p>
                  )}
                </li>
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
                    <FullWidthTextField
                      classProp="business_edit_input"
                      lightTheme
                      disabled={activeQuestion !== 4}
                      label="Other"
                      name="other"
                      value={sections[4].tempValues.other}
                      onChange={handleInputChange}
                    />
                  </div>
                  {Object.keys(sections[4].errors).length > 0 && (
                    <p className="error">{sections[4].errors.other}</p>
                  )}
                </li>

                {/* GST Number */}
                <li>
                  <div className="field_wrapper social_wrapper">
                    <FullWidthTextField
                      classProp="business_edit_input"
                      lightTheme
                      disabled={activeQuestion !== 4}
                      label="GST Number"
                      name="gstNumber"
                      value={sections[4].tempValues.gstNumber}
                      onChange={handleInputChange}
                    />
                    <img
                      className={style.val_icon}
                      src={
                        sections[4].errors.gst_img_error == "" ||
                        !sections[4].errors.gst_img_error
                          ? errorSuccess
                          : errorFailed
                      }
                      alt={
                        sections[4].errors.gst_img_error == "" ||
                        !sections[4].errors.gst_img_error
                          ? "success"
                          : "failure"
                      }
                      style={{
                        display: sections[4].tempValues.gstNumber
                          ? "block"
                          : "none",
                      }}
                    />
                  </div>
                  {Object.keys(sections[4].errors).length > 0 && (
                    <p className="error">{sections[4].errors.gst_number}</p>
                  )}
                </li>
              </ul>
              {activeQuestion === 4 && (
                <div className="save_cancel_cta no_space">
                  <button className="save_cta" onClick={() => handleSubmit(4)}>
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
            <div
              className={`brand_subsec with_checkboxes ${
                activeQuestion === 6 ? "" : activeQuestion !== null && "disable"
              }`}
            >
              <div className="title_pin">
                <h4 className="title">Project Location Preference:</h4>
                <img
                  src={editicon}
                  alt=""
                  className="edit_icon"
                  onClick={() => handleEditButton(6)}
                />
              </div>
              <div className="radio">
                {activeQuestion !== 6 ? (
                  <ul className="checkboxes" style={{ pointerEvents: "none" }}>
                    <li className="selectedValuePill">
                      {sections[6].selectedOption || "No Option Selected"}
                    </li>
                  </ul>
                ) : (
                  <ul className="checkboxes">{locationList}</ul>
                )}
              </div>
              {Object.keys(sections[6].errors).length > 0 && (
                <p className="error">{sections[6].errors.d_project_location}</p>
              )}
              {activeQuestion === 6 && (
                <div className="save_cancel_cta no_space">
                  <button className="save_cta" onClick={() => handleSubmit(6)}>
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
            {/* EIGHT QUESTION */}
            <div
              className={`brand_subsec ${
                activeQuestion === 7 ? "" : activeQuestion !== null && "disable"
              }`}
            >
              <div className="title_pin">
                <h4 className="title">Project Typology</h4>
                <img
                  src={editicon}
                  alt=""
                  className="edit_icon"
                  onClick={() => handleEditButton(7)}
                />
              </div>
              <BEAutocompleteOthers
                editFocus={activeQuestion === 7}
                allOptionData={sections[7].typologyList}
                selectedData={sections[7].selectedOptions}
                updateSectionData={updateSectionData}
                sectionId={7}
                onSave={() => ""}
              />
              {Object.keys(sections[7].errors).length > 0 && (
                <p className="error">{sections[7].errors.d_project_typology}</p>
              )}
              {activeQuestion === 7 && (
                <div className="save_cancel_cta">
                  <button className="save_cta" onClick={() => handleSubmit(7)}>
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
            {/* NINTH QUESTION */}
            <div
              className={`brand_subsec ${
                activeQuestion === 8 ? "" : activeQuestion !== null && "disable"
              }`}
            >
              <div className="title_pin">
                <h4 className="title">Your Design Style</h4>
                <img
                  src={editicon}
                  alt=""
                  className="edit_icon"
                  onClick={() => handleEditButton(8)}
                />
              </div>
              <BEAutocompleteOthers
                allOptionData={sections[8].designStyleList}
                selectedData={sections[8].selectedOptions}
                editFocus={activeQuestion === 8}
                updateSectionData={updateSectionData}
                sectionId={8}
                onSave={() => ""}
              />
              {Object.keys(sections[8].errors).length > 0 && (
                <p className="error">{sections[8].errors.d_design_style}</p>
              )}
              {activeQuestion === 8 && (
                <div className="save_cancel_cta">
                  <button className="save_cta" onClick={() => handleSubmit(8)}>
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
            {/* TENTH QUESTION */}
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
              <div className="col-lg-6 p-0 border_rightt">
                <div className="profile_brochure_wrapper section1">
                  <h4 className="title cp_heading">Company Profile*</h4>
                  <p className="notice_msg">
                    Maximum File Size Is 5MB. PDF, PPT Allowed
                  </p>
                  {sections[13].documentsMedia.map((data, i) => (
                    <div className="file_flex" key={`company-profile-${i}`}>
                      <div className="name_status_switch">
                        <div className="filename">
                          <a
                            href={`${base_url}/public/uploads/business/${data?.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {data?.name}
                          </a>
                        </div>
                        <div onClick={() => handleDeleteMedia(data)}>
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
                          setUploadSection("Company Profile");
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
                      Maximum File Size Is 5MB. PDF, PPT Allowed
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="col-lg-6 p-0">
                <div className="profile_brochure_wrapper section2">
                  <div className="title_pin_wrap">
                    <h4 className="title cat_heading">
                      Product Catalogues/Brochures
                    </h4>
                    <div className="entity" onClick={() => handleModalData(0)}>
                      &#9432;
                    </div>
                  </div>
                  <p className="notice_msg">
                    Maximum File Size Is 100MB. PDF, JPEG, PNG, PPT, DOC Allowed
                  </p>
                  <div className="file_flex file_hide">
                    {companyProfilesData.map((data, i) => (
                      <div className="name_status_switch">
                        <div className="name_flex" key={`brochure-${i}`}>
                          <div className="filename">{data}</div>
                          <img
                            width={24}
                            height={27}
                            src={blackDeleteicon}
                            alt="delete"
                            className="delete_icon"
                            loading="lazy"
                          />
                        </div>
                        <div className="switch_btn catalouge_switch">
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
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="upload_file_wrapper">
                    <div className="input_wrapper">
                      <input
                        className="input_box"
                        type="file"
                        id="catalougeUpload"
                        hidden
                        name="company_logo"
                      />
                      <label
                        htmlFor="catalougeUpload"
                        className="upload_label"
                        onClick={() => setUpload(true)}
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
                      Maximum File Size Is 100MB. PDF, JPEG, PNG, PPT, DOC
                      Allowed
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className="brand_subsec">
            <div className="title_flex">
              <h4 className="title projects_heading">Projects</h4>
              <p className="notice_msg">
                Maximum File Size Is 25MB. JPEG, PNG, HEIC, MOV, MP4 Allowed
              </p>
            </div>
            <div className="title_pin_wrap">
              <div className="title_pin_flex">
                <h5 className="image_title cat_heading">
                  Completed Project Photos/Videos
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
              {sections[14].completedProjectsMedia.map((img, i) => (
                <li className="list_item" key={i} style={{ cursor: "pointer" }}>
                  <div className="project_img_wrapper">
                    {img.mimetype === "application/pdf" ? (
                      <div>
                        {/* <div>{img.name}</div> */}
                        <img
                          ref={projectImageRef}
                          width={32}
                          height={32}
                          src={`/pngwing.com.png`}
                          alt="completed project"
                          className="uploaded_img"
                          loading="lazy"
                          onClick={() => handleImageClick(img, i)}
                        />
                      </div>
                    ) : img.mimetype.includes("video") ? (
                      <div className="video-thumbnail">
                        <video
                          width={412}
                          height={413}
                          src={`${base_url}/public/uploads/business/${img.url}`}
                          alt="completed project"
                          className="uploaded_video"
                          loading="lazy"
                          onClick={() => handleImageClick(img, i)}
                        >
                          <source
                            src={`${base_url}/public/uploads/business/${img.url}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                        {/* <div className="play-button">
                          <img
                            src="play-button-icon.png"
                            alt="play button"
                            className="play-icon"
                          />
                        </div> */}
                      </div>
                    ) : (
                      <img
                        ref={projectImageRef}
                        width={32}
                        height={32}
                        src={`${base_url}/public/uploads/business/${img.url}`}
                        alt="completed project"
                        className="uploaded_img"
                        loading="lazy"
                        onClick={() => handleImageClick(img, i)}
                      />
                    )}
                    <div className="switch_btn image_toggle_btn">
                      <div
                        className="toggle_container"
                        onClick={() => completedProjectsVisibility(i)}
                      >
                        <div className="toggle_text">Hide</div>
                        <div className="toggle_switch">
                          <div
                            className={`toggle_circle ${
                              sections[14].completedProjectsMedia[i].visibility
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
                        handleDeleteProjectsMedia(
                          img,
                          i,
                          14,
                          "completedProjectsMedia"
                        )
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
                      setUploadSection("Completed Project Photos/Videos");
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
                <h5 className="image_title cat_heading">Project Renders</h5>
                <div className="entity" onClick={() => handleModalData(2)}>
                  &#9432;
                </div>
              </div>
              {/* <div className="gallery_cta" onClick={() => setGalleryShow(true)}>
                View Gallery
              </div> */}
            </div>
            <ul className="pr_images_container">
              {sections[15].projectRendersMedia.map((img, i) => (
                <li className="list_item" key={i} style={{ cursor: "pointer" }}>
                  <div className="project_img_wrapper">
                    {img.mimetype === "application/pdf" ? (
                      <div>
                        {/* <div>{img.name}</div> */}
                        <img
                          ref={projectImageRef}
                          width={32}
                          height={32}
                          src={`/pngwing.com.png`}
                          alt="completed project"
                          className="uploaded_img"
                          loading="lazy"
                          onClick={() => handleImageClick(img, i)}
                        />
                      </div>
                    ) : img.mimetype.includes("video") ? (
                      <div className="video-thumbnail">
                        <video
                          width={412}
                          height={413}
                          src={`${base_url}/public/uploads/business/${img.url}`}
                          alt="completed project"
                          className="uploaded_video"
                          loading="lazy"
                          onClick={() => handleImageClick(img, i)}
                        >
                          <source
                            src={`${base_url}/public/uploads/business/${img.url}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                        {/* <div className="play-button">
                          <img
                            src="play-button-icon.png"
                            alt="play button"
                            className="play-icon"
                          />
                        </div> */}
                      </div>
                    ) : (
                      <img
                        ref={projectImageRef}
                        width={32}
                        height={32}
                        src={`${base_url}/public/uploads/business/${img.url}`}
                        alt="completed project"
                        className="uploaded_img"
                        loading="lazy"
                        onClick={() => handleImageClick(img, i)}
                      />
                    )}
                    <div className="switch_btn image_toggle_btn">
                      <div
                        className="toggle_container"
                        onClick={() => projectRendersVisibility(i)}
                      >
                        <div className="toggle_text">Hide</div>
                        <div className="toggle_switch">
                          <div
                            className={`toggle_circle ${
                              sections[15].projectRendersMedia[i].visibility
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
                        handleDeleteProjectsMedia(
                          img,
                          i,
                          15,
                          "projectRendersMedia"
                        )
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
                      setUploadSection("Project Renders");
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
                  Work In Progress - Site Photos/Videos
                </h5>
                <div className="entity" onClick={() => handleModalData(3)}>
                  &#9432;
                </div>
              </div>
              {/* <div className="gallery_cta" onClick={() => setGalleryShow(true)}>
                View Gallery
              </div> */}
            </div>
            <ul className="pr_images_container">
              {sections[16].workInProgressMedia.map((img, i) => (
                <li className="list_item" key={i} style={{ cursor: "pointer" }}>
                  <div className="project_img_wrapper">
                    {img.mimetype === "application/pdf" ? (
                      <div>
                        {/* <div>{img.name}</div> */}
                        <img
                          ref={projectImageRef}
                          width={32}
                          height={32}
                          src={`/pngwing.com.png`}
                          alt="completed project"
                          className="uploaded_img"
                          loading="lazy"
                          onClick={() => handleImageClick(img, i)}
                        />
                      </div>
                    ) : img.mimetype.includes("video") ? (
                      <div className="video-thumbnail">
                        <video
                          width={412}
                          height={413}
                          src={`${base_url}/public/uploads/business/${img.url}`}
                          alt="completed project"
                          className="uploaded_video"
                          loading="lazy"
                          onClick={() => handleImageClick(img, i)}
                        >
                          <source
                            src={`${base_url}/public/uploads/business/${img.url}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                        {/* <div className="play-button">
                          <img
                            src="play-button-icon.png"
                            alt="play button"
                            className="play-icon"
                          />
                        </div> */}
                      </div>
                    ) : (
                      <img
                        ref={projectImageRef}
                        width={32}
                        height={32}
                        src={`${base_url}/public/uploads/business/${img.url}`}
                        alt="completed project"
                        className="uploaded_img"
                        loading="lazy"
                        onClick={() => handleImageClick(img, i)}
                      />
                    )}
                    <div className="switch_btn image_toggle_btn">
                      <div
                        className="toggle_container"
                        onClick={() => wipSitesVisibility(i)}
                      >
                        <div className="toggle_text">Hide</div>
                        <div className="toggle_switch">
                          <div
                            className={`toggle_circle ${
                              sections[16].workInProgressMedia[i].visibility
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
                        handleDeleteProjectsMedia(
                          img,
                          i,
                          16,
                          "workInProgressMedia"
                        )
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
                      setUploadSection("Work In Progress");
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
              {sections[17].otherMedia.map((img, i) => (
                <li className="list_item" key={i} style={{ cursor: "pointer" }}>
                  <div className="project_img_wrapper">
                    {img.mimetype === "application/pdf" ? (
                      <div>
                        {/* <div>{img.name}</div> */}
                        <img
                          ref={projectImageRef}
                          width={32}
                          height={32}
                          src={`/pngwing.com.png`}
                          alt="completed project"
                          className="uploaded_img"
                          loading="lazy"
                          onClick={() => handleImageClick(img, i)}
                        />
                      </div>
                    ) : img.mimetype.includes("video") ? (
                      <div className="video-thumbnail">
                        <video
                          width={412}
                          height={413}
                          src={`${base_url}/public/uploads/business/${img.url}`}
                          alt="completed project"
                          className="uploaded_video"
                          loading="lazy"
                          onClick={() => handleImageClick(img, i)}
                        >
                          <source
                            src={`${base_url}/public/uploads/business/${img.url}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                        {/* <div className="play-button">
                          <img
                            src="play-button-icon.png"
                            alt="play button"
                            className="play-icon"
                          />
                        </div> */}
                      </div>
                    ) : (
                      <img
                        ref={projectImageRef}
                        width={32}
                        height={32}
                        src={`${base_url}/public/uploads/business/${img.url}`}
                        alt="completed project"
                        className="uploaded_img"
                        loading="lazy"
                        onClick={() => handleImageClick(img, i)}
                      />
                    )}
                    <div className="switch_btn image_toggle_btn">
                      <div
                        className="toggle_container"
                        onClick={() => otherMediaVisibility(i)}
                      >
                        <div className="toggle_text">Hide</div>
                        <div className="toggle_switch">
                          <div
                            className={`toggle_circle ${
                              sections[17].otherMedia[i].visibility
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
                        handleDeleteProjectsMedia(img, i, 17, "otherMedia")
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
                      setUploadSection("other");
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
                <h5 className="cat_heading">Take Us Through Your Work Space</h5>
                {/* <h5 className="image_title cat_heading">Other Media</h5> */}
                <div className="entity" onClick={() => handleModalData(5)}>
                  &#9432;
                </div>
              </div>
              {/* <div className="gallery_cta" onClick={() => setGalleryShow(true)}>
                View Gallery
              </div> */}
            </div>
            <div className="dropdown_upload">
              <div className="cat_dropdown">
                <SelectDropdown
                  label="Select a Category"
                  labelId="Workspace Category"
                  lightTheme
                  data={sections[18].workSpaceDataCategories}
                  value={sections[18].selectedCategory}
                  onChange={(e) =>
                    handleWorkspaceCategoryChange(e.target.value)
                  }
                />
              </div>
            </div>
            {sections[18].selectedCategory && (
              <>
                <div className="title_pin_wrap">
                  <div className="title_pin_flex">
                    <h5 className="image_title cat_heading">
                      {sections[18].selectedCategory} Videos
                    </h5>
                  </div>
                </div>
                <ul className="pr_images_container">
                  {sections[18].workSpaceData?.map((img, i) => (
                    <li
                      className="list_item"
                      key={i}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="project_img_wrapper">
                        {img.mimetype === "application/pdf" ? (
                          <div>
                            {/* <div>{img.name}</div> */}
                            <img
                              ref={projectImageRef}
                              width={32}
                              height={32}
                              src={`/pngwing.com.png`}
                              alt="completed project"
                              className="uploaded_img"
                              loading="lazy"
                              onClick={() => handleImageClick(img, i)}
                            />
                          </div>
                        ) : img?.mimetype?.includes("video") ? (
                          <div className="video-thumbnail">
                            <video
                              width={412}
                              height={413}
                              src={`${base_url}/public/uploads/business/${img.url}`}
                              alt="completed project"
                              className="uploaded_video"
                              loading="lazy"
                              onClick={() => handleImageClick(img, i)}
                            >
                              <source
                                src={`${base_url}/public/uploads/business/${img.url}`}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                            {/* <div className="play-button">
                          <img
                            src="play-button-icon.png"
                            alt="play button"
                            className="play-icon"
                          />
                        </div> */}
                          </div>
                        ) : (
                          <img
                            ref={projectImageRef}
                            width={32}
                            height={32}
                            src={`${base_url}/public/uploads/business/${img.url}`}
                            alt="completed project"
                            className="uploaded_img"
                            loading="lazy"
                            onClick={() => handleImageClick(img, i)}
                          />
                        )}
                        <div className="switch_btn image_toggle_btn">
                          <div
                            className="toggle_container"
                            onClick={() => workspaceMediaVisibility(i)}
                          >
                            <div className="toggle_text">Hide</div>
                            <div className="toggle_switch">
                              <div
                                className={`toggle_circle ${
                                  sections[18].workSpaceData[i].visibility
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
                            handleDeleteProjectsMedia(
                              img,
                              i,
                              18,
                              "workSpaceData"
                            )
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
                          setUploadSection("workspace");
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
              </>
            )}
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
          workspaceCategory={sections[18].selectedCategory}
        />
        <BusinessViewGallery
          dataarr={galleryData}
          show={galleryShow}
          onHide={() => setGalleryShow(false)}
        />
      </div>
    </div>
  );
};

export default BEditProfile04;
