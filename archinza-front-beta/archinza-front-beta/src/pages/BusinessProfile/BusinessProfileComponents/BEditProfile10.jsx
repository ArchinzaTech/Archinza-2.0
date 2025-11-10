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
import { businessProfileData } from "../../../db/businessProfileData";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import Joi from "joi";
import dayjs from "dayjs";
import { useGlobalDataContext } from "../../../context/GlobalData/GlobalDataState";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import config from "../../../config/config";
import http from "../../../helpers/http";
import style from "../../FormFiveLightTheme/Form/formfivelighttheme.module.scss";
import SelectDropdown from "../../../components/SelectDropdown/SelectDropdown";
import { message } from "antd";

const BEditProfile10 = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [upload, setUpload] = useState(false);
  const [error] = useState(false);
  const GlobalDataContext = useGlobalDataContext();
  const BusinessContext = useBusinessContext();
  const base_url = config.api_url;

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

  const [uploadSection, setUploadSection] = useState("");

  const [catalougeShow, setCatalougeShow] = useState(
    Array(businessProfileData[1].data.companyProfilesData.length).fill(false)
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
      labelId={"employee_count_bedit10" + option}
      name="employees_range_bedit10"
      checked={sections[2].tempSelectedOption === option}
      onChange={() => handleRadioChange(option, 2)}
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
      payload = { j_completed_projects_media: filteredMedia };
    } else if (sectionId === 15) {
      payload = { j_project_renders_media: filteredMedia };
    } else if (sectionId === 16) {
      payload = { j_work_in_progress_site_media: filteredMedia };
    } else if (sectionId === 17) {
      payload = { j_other_media: filteredMedia };
    } else if (sectionId === 18) {
      const updatedTempWorkSpaceData = sections[18].tempWorkSpaceData?.filter(
        (tempMedia) => tempMedia._id !== mediaToDelete._id
      );
      const updatedWorkSpaceData = sections[18].workSpaceData.filter(
        (workMedia) => workMedia._id !== mediaToDelete._id
      );
      payload = { j_workspace_category_media: updatedTempWorkSpaceData };
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
      BusinessContext?.data?.j_workspace_category_media?.filter(
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
      payload = { j_completed_projects_media: updatedMedia };
    } else if (sectionId === 15) {
      payload = { j_project_renders_media: updatedMedia };
    } else if (sectionId === 16) {
      payload = { j_work_in_progress_site_media: updatedMedia };
    } else if (sectionId === 17) {
      payload = { j_other_media: updatedMedia };
    } else if (sectionId === 18) {
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
      payload = { j_workspace_category_media: tempWorkSpaceData };
    }

    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: {
        ...prevSections[sectionId],
        [mediaType]: updatedMedia,
        tempWorkSpaceData:
          sectionId === 18
            ? payload.j_workspace_category_media
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
    setModalData(businessProfileData[1].data.modalDataArr[i].description);
    setModalShow(true);
  };

  const validation = (sectionId, formData) => {
    const schemaValidation = {
      0: Joi.object({
        courses: Joi.array()
          .min(1)
          .required()
          .messages({ "array.min": "Select atleast One Course" }),
      }),
      2: Joi.object({
        j_employees_range: Joi.string()
          .required()
          .messages({ "string.empty": "Employee Range is required" }),
      }),
      3: Joi.object({
        j_establishment_year: Joi.string()
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

  const handleRadioChange = (option, sectionId) => {
    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: {
        ...prevSections[sectionId],
        tempSelectedOption: option,
      },
    }));
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
          errors: { j_establishment_year: "Invalid Date" },
        },
      }));
      return false;
    }
    if (date?.$d == "Invalid Date") {
      setSections((prevSections) => ({
        ...prevSections,
        3: {
          ...prevSections[3],
          errors: { j_establishment_year: "Invalid Date" },
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
            j_establishment_year: "Date must be within the last 50 years",
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
          j_documents_media: data,
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
          j_completed_projects_media: data,
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
          j_project_renders_media: data,
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
          j_work_in_progress_site_media: data,
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
          j_other_media: data,
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
          j_workspace_category_media: data,
        });
        break;

      default:
        break;
    }
  };

  const handleSubmit = async (sectionId) => {
    let formData = {};
    let schema;
    switch (sectionId) {
      case 0:
        formData["courses"] = sections[0].selectedOptions;
        schema = validation(0, formData);
        if (!schema) {
          return;
        }
        break;
      case 2:
        formData["j_employees_range"] = sections[2].tempSelectedOption;
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
          formData["j_establishment_year"] = validDate?.toString();
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
        formData["j_firm_connect_data"] = {
          website_link: formData["website_link"],
          linkedin_link: formData["linkedin_link"],
          instagram_handle: formData["instagram_handle"],
          behance_link: formData["behance_link"],
          other: formData["other"],
          gst_number: formData["gst_number"],
        };
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
      const globalData = GlobalDataContext?.business_type_j;

      const updatedSections = { ...sections };
      updatedSections[0].servicesData =
        globalData.courses?.map((option) => ({
          label: option,
          value: option,
        })) || [];

      updatedSections[2].employeesRangeList = globalData.emoployee_count || [];
      updatedSections[18].workSpaceDataCategories =
        GlobalDataContext?.workspace_data_categories || [];

      setSections(updatedSections);
    }
  }, [GlobalDataContext]);

  useEffect(() => {
    if (BusinessContext?.data) {
      const updatedSections = { ...sections };

      const {
        courses,
        j_employees_range,
        j_establishment_year,
        j_documents_media,
        j_firm_connect_data,
        j_completed_projects_media,
        j_project_renders_media,
        j_work_in_progress_site_media,
        j_other_media,
        j_workspace_category_media,
      } = BusinessContext.data;

      const parsedEstablishmentYear = j_establishment_year
        ? dayjs(`${j_establishment_year}-01-01`)
        : null;

      updatedSections[0].selectedOptions = courses || [];
      updatedSections[0].tempSelectedOptions = courses || [];

      updatedSections[2].selectedOption = j_employees_range || "";
      updatedSections[2].tempSelectedOption = j_employees_range || "";

      updatedSections[3].selectedOption = parsedEstablishmentYear;
      updatedSections[3].tempSelectedOption = parsedEstablishmentYear;

      updatedSections[4].websiteLink = j_firm_connect_data.website_link || "";
      updatedSections[4].linkedinLink = j_firm_connect_data.linkedin_link || "";
      updatedSections[4].instagramLink =
        j_firm_connect_data.instagram_handle || "";
      updatedSections[4].behanceLink = j_firm_connect_data.behance_link || "";
      updatedSections[4].other = j_firm_connect_data.other || "";
      updatedSections[4].gstNumber = j_firm_connect_data.gst_number || "";
      updatedSections[4].tempValues = {
        websiteLink: j_firm_connect_data.website_link || "",
        linkedinLink: j_firm_connect_data.linkedin_link || "",
        instagramLink: j_firm_connect_data.instagram_handle || "",
        behanceLink: j_firm_connect_data.behance_link || "",
        other: j_firm_connect_data.other || "",
        gstNumber: j_firm_connect_data.gst_number || "",
      };
      updatedSections[13].documentsMedia = j_documents_media || [];
      updatedSections[14].completedProjectsMedia =
        j_completed_projects_media?.map((media) => ({
          ...media,
          visibility: media.visibility || false,
        })) || [];
      updatedSections[15].projectRendersMedia =
        j_project_renders_media?.map((media) => ({
          ...media,
          visibility: media.visibility || false,
        })) || [];
      updatedSections[16].workInProgressMedia =
        j_work_in_progress_site_media?.map((media) => ({
          ...media,
          visibility: media.visibility || false,
        })) || [];
      updatedSections[17].otherMedia =
        j_other_media?.map((media) => ({
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
        j_workspace_category_media?.filter(
          (it) => it.category === selectedCategory
        ) || [];
      updatedSections[18].tempWorkSpaceData = j_workspace_category_media || [];
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
      <div className="col-lg-6 p-0 border_rightt">
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
                <h4 className="title">What courses do you provide?</h4>
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
                <p className="error">{sections[0].errors.courses}</p>
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
            {/* <div
              className={`brand_subsec ${
                activeQuestion === 1 ? "" : activeQuestion !== null && "disable"
              }`}
            >
              <div className="title_pin">
                <h4 className="title">
                  What support services does the business/firm provide in
                  addition to Design & Build?
                </h4>
                <img
                  src={editicon}
                  alt=""
                  className="edit_icon"
                  onClick={() => activeQuestionHandler(1)}
                />
              </div>
              <BEAutocompleteOthers
                allOptionData={businessProfileData[1].data.supportDropdownArr}
                selectedData={businessProfileData[0].data.selectedSupportData}
                editFocus={activeQuestion === 1}
              />
              {activeQuestion === 1 && (
                <div className="save_cancel_cta no_space">
                  <button
                    className="save_cta"
                    onClick={() => setActiveQuestion(null)}
                  >
                    Save
                  </button>
                  <button
                    className="cancel_cta"
                    onClick={() => setActiveQuestion(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div> */}
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
                <p className="error">{sections[2].errors.j_employees_range}</p>
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
                      {sections[3].errors.j_establishment_year}
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
                    Maximum File Size Is 100MB. PDF, JPEG, PNG, PPT, DOC Allowed
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
                      Maximum File Size Is 100MB. PDF, JPEG, PNG, PPT, DOC
                      Allowed
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
          dataarr={businessProfileData[1].data.galleryData}
          show={galleryShow}
          onHide={() => setGalleryShow(false)}
        />
      </div>
    </div>
  );
};

export default BEditProfile10;
