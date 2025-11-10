import React, { useEffect, useRef, useState } from "react";
import "./BEdit.scss";
import {
  Aura,
  bEdit_background,
  bookmark_black,
  cancelCircleBlack,
  CopyLinkCircleOrange,
  deleteIconCircleOrange,
  draftRedIcon,
  editConnectIcon,
  editicon,
  editIconBlue,
  employeesBlack,
  employeesOrange,
  enhanceProfileicon,
  enhanceProfileIconStar,
  establishedOrange,
  eyeIcon,
  faceBookCircleOrange,
  gallery1,
  gallery10,
  gallery3,
  gallery4,
  gallery5,
  gallery9,
  getVerifiedWhite,
  heartBlack,
  heartOutline,
  linkedInLinkCircleOrange,
  locationOrange,
  mutedVerifIcon,
  prmoteIcon,
  prmoteIconDiable,
  shareBlackInside,
  suitCase_black,
  upgradeIcon,
  verifiedBlueIcon,
  whatsappCircleOrange,
  XCircleOrange,
} from "../../../images";
import { Link, NavLink, useNavigate } from "react-router-dom";
import OverView from "../BEditComponent/OverView/OverView";
import FooterV2 from "../../../components/FooterV2/FooterV2";
import VerticalAccordion from "../BEditComponent/VerticalAccordion/VerticalAccordion";
import {
  BeditProfileData,
  ratingData,
} from "../../../components/Data/bEditData";
import CompanyProfile from "../BEditComponent/CompanyProfile/CompanyProfile";
import { Rating, Switch } from "@mui/material";
import Reviews from "../BEditComponent/Reviews/Reviews";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, FreeMode } from "swiper/modules";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import { useGlobalDataContext } from "../../../context/GlobalData/GlobalDataState";
import VerticalAccordion2 from "../BEditComponent/VerticalAccordion/VerticalAccordion2";
import CompanyProfile2 from "../BEditComponent/CompanyProfile/CompanyProfile2";
import OverView2 from "../BEditComponent/OverView/Overview2";
import { Progress, Button, Popover } from "antd";
import TestPopup from "./BusinessViewPopups/TestPopup";
import {
  businessConnectEditUrl,
  businessProfileViewURL2,
  chooseYourPlan,
  planDetails,
} from "../../../components/helpers/constant-words";
import {
  WhatsAppOutlined,
  LinkedinOutlined,
  LinkOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import http from "../../../helpers/http";
import config from "../../../config/config";
import ExcelPopup from "./PopUpComponents/ExcelPopup/ExcelPopup";
import ProfileComplitionBar from "../ProfileComplitionBar/ProfileComplitionBar";
import ToggleSwitch from "../BEditComponent/ToggleSwitch/ToggleSwitch";
import { toast } from "react-toastify";
import ToastMsg from "../../../components/ToastMsg/ToastMsg";
import GeneralInformation from "./PopUpComponents/GeneralInformation/GeneralInformation";
import FileUpload from "./PopUpComponents/FileUpload/FileUpload";
import PromotePopup from "./PopUpComponents/PromotePopup/PromotePopup";
import CompleteActions from "./PopUpComponents/CompleteActions/CompleteActions";
import NonMandatoryActions from "./PopUpComponents/NonMandatoryActions/NonMandatoryActions";
import NonMandatoryActionsV2 from "./PopUpComponents/NonMandatoryActionsV2/NonMandatoryActionsV2";
import ChatHistory from "../BEditComponent/MinibotComp/Minibot";
import MiniBot from "../BEditComponent/MinibotComp/Minibot";
import SocialMediaLinksPopup from "./PopUpComponents/SocialMediaLinksPopup/SocialMediaLinksPopup";
import { useWindowSize } from "react-use";
import EditLocationPopup from "./PopUpComponents/EditLocationPopup/EditLocationPopup";
import EditFirmNamePopup from "./PopUpComponents/EditFirmNamePopup/EditFirmNamePopup";
import helper from "../../../helpers/helper";
import BCEdit from "./BCEdit/BCEdit";
import AddImageComponent from "../BEditComponent/AddImageComponent/AddImageComponent";
import GallerypopupDeleteVariant from "./PopUpComponents/GalleryEditPopups/GallerypopupDeleteVariant";
import BusinessConnectEdit from "./BusinessConnectEditPage/BusinessConnectEdit";
import OflineProfileMsg from "../BEditComponent/OflineProfileMsg/OflineProfileMsg";
import PendingVerification from "./PopUpComponents/PendingVerification/PendingVerification";
import MsonarySlider from "../BEditComponent/MsonarySlider/MsonarySlider";
import GalleryEditPopupDefault from "./PopUpComponents/GalleryEditPopups/GalleryEditPopupDefault";
import { Events, Link as ScrollLink } from "react-scroll";
import Checkout from "./../../Checkout/Checkout";
import SliderGalleryMobilePopup from "./PopUpComponents/GalleryEditPopups/SliderGalleryMobilePoup";
import LoadingStateComp from "../BEditComponent/LoadingStateComp/LoadingStateComp";
import CongratulationsLT from "../../CongratulationsLight/CongratulationsLT";
import PaymentSuccessfull from "../../PaymentSuccessfull/PaymentSuccessfull";

const locationDropdown = [
  "Gandhidham, Gujarat, India",
  "Gandhidham, Maharashtra, India",
  "Gandhidham, Gujarat, India",
];

const BEdit2 = () => {
  const { width } = useWindowSize();
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const swiperRef = useRef(null);
  const [isTrialExpiredState, setIsTrialExpiredState] = useState(false);
  // Reference to track section elements
  const sectionRefs = useRef([]);
  // Reference to track if scrolling is caused by clicking
  const isClickScrolling = useRef(false);
  const [isActive, setIsActive] = useState(0);
  const [isSubtabActive, setIsSubtabActive] = useState(0);
  const [isPendingVerificationPopup, setIsPendingVerificationPopup] =
    useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSliderPopup, setShowSliderPopup] = useState(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showExcelPopup, setShowExcelPopup] = useState(false);
  const [showEditLocationPopup, setEditLocationPopup] = useState(false);
  const [showGeneralInfoPopup, setShowGeneralInfoPopup] = useState(false);
  const [showEditFirmNamePopup, setShowEditFirmNamePopup] = useState(false);
  const [showFileUploadPopup, setShowFileUploadPopup] = useState(false);
  const [showEnhancePopup, setShowEnhancePopup] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [showEnhanceButton, setShowEnhanceButton] = useState(false);
  const [isCompleteActionsModal, setIsCompleteActionsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [workflowQuestions, setWorkFlowQuestions] = useState();
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [replaceImagePopup, setReplaceImagePopup] = useState(false);
  const [currentReplacingPosition, setCurrentReplacingPosition] =
    useState(null);
  const [currentReplacingImage, setCurrentReplacingImage] = useState(null);
  const stickyTabsRef = useRef(null);
  const headerRef = useRef(null); // Ref for header section
  const [headerHeight, setHeaderHeight] = useState(0); // State for header height
  const [stickyTabsHeight, setStickyTabsHeight] = useState(0);
  const [isNonMandatoryActionsModal, setIsNonMandatoryActionsModal] =
    useState(false);
  const handleShowPendingVerificationPopup = () =>
    setIsPendingVerificationPopup(true);
  const handleHidePendingVerificationPopup = () =>
    setIsPendingVerificationPopup(false);
  const handleShowCompleteActions = () => setIsCompleteActionsModal(true);
  const handleShowNonMandatoryActions = () =>
    setIsNonMandatoryActionsModal(true);
  const handleHideCompleteActions = () => setIsCompleteActionsModal(false);

  const handleOptionsPopupOpen = () => setShowOptionsPopup(true);
  const handleOptionsPopupClose = () => setShowOptionsPopup(false);
  const handleEditLocationPopupPopupOpen = () => setEditLocationPopup(true);
  const handleEditLocationPopupPopupClose = () => setEditLocationPopup(false);
  const [verificationStatus, setVerificationStatus] =
    useState("Get Verified Now!");
  const { data, update, fetchData } = useBusinessContext();
  const GlobalContextData = useGlobalDataContext();
  const [isPromotePopupModal, setIsPromotePopupModal] = useState(false);
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(null);
  const [isScrapingContent, setIsScrapingContent] = useState(false);
  const [scrapingError, setScrapingError] = useState(false);

  const fieldsToCheck = [
    // "city",
    // "country",
    // "pincode",
    // "addresses",
    "bio",
    // "google_location",
    // "keywords",
    // "project_renders_media",
    // "completed_products_media",
    // "sites_inprogress_media",
  ];
  const nonMandatoryQuestions = [
    // "workspace_media",
    // "establishment_year",
    "team_range",
    "project_location",
    "project_typology",
    "design_style",
    "project_sizes",
    "avg_project_budget",
    "project_mimimal_fee",
  ];

  const containerRef = useRef(null);

  const hasActiveSubscription = () => {
    return (
      data?.subscription?.isActive === true &&
      data?.subscription?.razorpaySubscriptionId &&
      (data?.subscription?.paymentStatus === "activated" ||
        data?.subscription?.paymentStatus === "pending_activation")
    );
  };

  const handleHideNonMandatoryActions = async () => {
    setIsNonMandatoryActionsModal(false);

    // const updatedData = await fetchData(data?._id);
    // if (updatedData) {
    //   await update(updatedData);
    // }
  };

  const shouldShowUpgradeButton = () => {
    return data?.isVerified && !hasActiveSubscription() && !isDataLoading;
  };

  const handleImageReplace = (position, currentImage) => {
    setCurrentReplacingPosition(position);
    setCurrentReplacingImage(currentImage);
    setReplaceImagePopup(true);
  };

  const handleImageReplacement = async (newImage) => {
    try {
      // Call API to update the image position
      const response = await http.post(
        `${config.api_url}/business/media/update-position`,
        {
          imageId: newImage.originalData._id,
          position: currentReplacingPosition,
          userId: data._id,
        }
      );

      if (response?.data) {
        // Update local state or refetch data
        // You might want to update the businessData context here

        const latestData = await fetchData(data?._id);
        await update(latestData);
        toast(
          <ToastMsg message="Image replaced successfully" />,
          config.success_toast_config
        );
        handleReplaceImagePopupClose();
        // Optionally refetch business data
        // await refetchBusinessData();
      } else {
        toast(
          <ToastMsg message="Failed to replace image" danger={true} />,
          config.error_toast_config
        );
      }
    } catch (error) {
      console.error("Error replacing image:", error);
      toast(
        <ToastMsg message="Error replacing image" danger={true} />,
        config.error_toast_config
      );
    }
  };

  const handleReplaceImagePopupClose = () => {
    setReplaceImagePopup(false);
    setCurrentReplacingPosition(null);
    setCurrentReplacingImage(null);
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (!data || !data._id) {
          setIsDataLoading(true);
          return;
        }
        setIsDataLoading(false);
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Error initializing data:", error);
        setIsDataLoading(false);
        setIsInitialLoad(false);
      }
    };
    initializeData();
  }, [data?._id]);

  // Calculate header and sticky tabs height dynamically
  useEffect(() => {
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      const height = rect.height; // This gives fractional pixels
      setHeaderHeight(height);
    }
    if (stickyTabsRef.current) {
      const rect = stickyTabsRef.current.getBoundingClientRect();
      const height = rect.height;
      setStickyTabsHeight(height);
    }
  }, [width, data?.business_name, data?.brand_logo]);

  // Check if trial has expired
  useEffect(() => {
    if (
      data?.subscription?.plan?.durationInMonths &&
      data?.subscription?.startDate
    ) {
      const trialExpired = isTrialExpired(
        data.subscription.startDate,
        data.subscription.plan.durationInMonths,
        data.subscription.endDate
      );
      setIsTrialExpiredState(trialExpired);

      if (trialExpired && isOnline) {
        setIsOnline(false);
      }
    }
  }, [
    data?.subscription?.plan?.durationInMonths,
    data?.subscription?.startDate,
    data?.subscription?.endDate,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsHovered(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const slider = containerRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // scroll speed multiplier
      slider.scrollLeft = scrollLeft - walk;
    };

    // Add event listeners
    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current.swiper;

      // toggle touch interaction
      swiper.allowTouchMove = isOnline;

      // toggle autoplay
      if (isOnline) {
        swiper.autoplay.start();
      } else {
        swiper.autoplay.stop();
      }
    }
  }, [isOnline]);

  // Debounce function to limit rapid state updates
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Handle tab click with scroll and prevent observer interference
  const handleTabSelect = (index) => {
    setIsSubtabActive(index);
    if (width <= 992) {
      const section = document.getElementById(`section-bedit-${index}`);
      if (section) {
        isClickScrolling.current = true; // Mark as click-initiated scroll
        section.scrollIntoView({ behavior: "smooth" });
        // Reset isClickScrolling after scroll animation completes
        setTimeout(() => {
          isClickScrolling.current = false;
        }, 1000); // Match scroll animation duration
      }
    }
  };

  const calculateProfileCompletion = () => {
    const basePercentage = 75;
    const totalFields = fieldsToCheck.length;
    const maxAdditionalPercentage = 25;
    const percentagePerField = maxAdditionalPercentage / totalFields;

    const { nonEmptyCount, emptyFields } = fieldsToCheck.reduce(
      (acc, field) => {
        const value = data[field];
        if (field === "google_location") {
          // Check if google_location has both latitude and longitude as non-empty strings
          if (
            value &&
            value !== "" &&
            typeof value === "object" &&
            typeof value?.latitude === "string" &&
            value.latitude.trim() &&
            typeof value?.longitude === "string" &&
            value.longitude.trim()
          ) {
            acc.nonEmptyCount += 1;
          } else {
            acc.emptyFields.push(field);
          }
        } else if (value) {
          if (Array.isArray(value) && value.length > 0) acc.nonEmptyCount += 1;
          else if (typeof value === "string" && value.trim() !== "")
            acc.nonEmptyCount += 1;
          else if (typeof value === "object" && Object.keys(value).length > 0)
            acc.nonEmptyCount += 1;
          else acc.emptyFields.push(field);
        } else {
          acc.emptyFields.push(field);
        }
        return acc;
      },
      { nonEmptyCount: 0, emptyFields: [] }
    );

    const percentage = Math.round(
      basePercentage + nonEmptyCount * percentagePerField
    );

    const pendingNonMandatory = nonMandatoryQuestions.filter((field) => {
      const value = data[field];

      if (!value) return true;

      switch (field) {
        case "project_location":
        case "team_range":
          return !value.data || value.data.trim() === "";
        case "project_typology":
          return (
            !value.data || !Array.isArray(value.data) || value.data.length === 0
          );
        case "design_style":
          return (
            !value.data || !Array.isArray(value.data) || value.data.length === 0
          );
        case "avg_project_budget":
          return (
            !value.budgets ||
            !Array.isArray(value.budgets) ||
            value.budgets.length === 0
          );
        case "project_sizes":
          return (
            !value.sizes ||
            !Array.isArray(value.sizes) ||
            value.sizes.length === 0
          );
        case "project_mimimal_fee":
          return !value.fee || value.fee.trim() === "";
        // case "services":
        //   return !value || (Array.isArray(value) && value.length === 0);
        default:
          return true;
      }
    });

    return { percentage, emptyFields, pendingNonMandatory };
  };

  // Utility function to check if free trial has expired
  const isTrialExpired = (startDate, durationInMonths, endDate) => {
    if (!startDate || !durationInMonths) return false;

    const start = new Date(startDate);
    const currentDate = new Date();

    // Expiration date = start date + duration months
    const expirationDate = new Date(start);
    expirationDate.setMonth(expirationDate.getMonth() + durationInMonths);

    // If endDate is explicitly set, ensure subscription doesn’t go past it
    if (endDate) {
      const end = new Date(endDate);
      if (end < expirationDate) {
        return currentDate > end;
      }
    }

    return currentDate > expirationDate;
  };

  const { percentage, emptyFields, pendingNonMandatory } =
    calculateProfileCompletion();
  const handlePopupOpen = () => setShowPopup(true);
  const handlePopupClose = () => setShowPopup(false);
  const handleSliderPopupOpen = () => setShowSliderPopup(true);
  const handleSliderPopupClose = () => setShowSliderPopup(false);
  const handleEnhancePopupOpen = () => setShowEnhancePopup(true);
  const handleEnhancePopupClose = () => setShowEnhancePopup(false);
  const handleExcelPopupOpen = () => setShowExcelPopup(true);
  const handleExcelPopupClose = () => setShowExcelPopup(false);
  const handleGeneralInfoPopupOpen = () => setShowGeneralInfoPopup(true);
  const handleGeneralInfoPopupClose = () => setShowGeneralInfoPopup(false);
  const handleEditFirmNamePopupOpen = () => setShowEditFirmNamePopup(true);
  const handleEditFirmNamePopupClose = () => setShowEditFirmNamePopup(false);
  const handleFileUploadPopupOpen = () => setShowFileUploadPopup(true);
  const handleFileUploadPopupClose = () => {
    console.log("handleclose triggered");
    setShowFileUploadPopup(false);
  };

  const handlePaymentSuccess = async (response) => {
    console.log("Payment successful:", response);
    const updatedData = await fetchData(data?._id);
    if (updatedData) {
      console.log("Updating context with:", updatedData);
      update(updatedData);
      setIsDataLoading(false);
    }

    toast(
      <ToastMsg message="Payment successful!" />,
      config.success_toast_config
    );
  };

  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
    toast(
      <ToastMsg message="Payment failed. Please try again." />,
      config.error_toast_config
    );
  };

  const truncateText = (arr, maxLength = 35) => {
    if (!arr || arr.length === 0) return "";
    const joinedText = arr.join(", ");
    return joinedText.length > maxLength
      ? `${joinedText.slice(0, maxLength)}...`
      : joinedText;
  };

  // const handleTabSelect = (index) => {
  //   console.log(index);
  //   setIsSubtabActive(index);
  // };

  const sendVerificationRequest = async () => {
    if (verificationStatus === "Pending Verification") {
      handleShowPendingVerificationPopup();
      return;
    }
    if (emptyFields.length === 0) {
      const response = await http.post(
        `${config.api_url}/business/get-verified`,
        {
          user: data._id,
          status: "pending",
        }
      );
      if (response?.data) {
        update({
          ...data,
          verificationData: {
            ...data.verificationData,
            status: "pending",
          },
        });
      }
      toast(
        <ToastMsg message={`Verification Request Sent!`} />,
        config.success_toast_config
      );
      setVerificationStatus("Pending Verification");
    }
  };

  const updatePageStatus = async (status) => {
    await http.put(`${config.api_url}/business/change-visibility/${data._id}`, {
      pageStatus: status,
    });
  };

  const handleSaveBusinessDetails = async (businessData) => {
    const formData = new FormData();
    businessData.logoFile && formData.append("file", businessData.logoFile);
    businessData.businessName &&
      formData.append("business_name", businessData.businessName);
    const response = await http.post(
      `${config.api_url}/business/business-details/${data._id}`,
      formData
    );

    if (response?.data) {
      await update({
        ...data,
        business_name: businessData.businessName,
        ...(response?.data?.brand_logo && {
          brand_logo: response.data.brand_logo,
        }),
      });
      toast(
        <ToastMsg message={`Changes saved successfully`} />,
        config.success_toast_config
      );
      // setShowEditFirmNamePopup(false);
    }
  };

  const handleStatusToggle = async () => {
    if (isTrialExpiredState) {
      toast(
        <ToastMsg message="Free trial expired. Please upgrade to turn your profile online." />,
        config.error_toast_config
      );
      return;
    }
    // Use the current state value to determine the new state
    const currentIsOnline = isOnline;
    const newIsOnline = !currentIsOnline;
    const newStatus = newIsOnline ? "online" : "offline";

    setIsOnline(newIsOnline);

    try {
      await updatePageStatus(newStatus);
      toast(
        <ToastMsg message={`Status changed to ${newStatus?.toUpperCase()}`} />,
        config.success_toast_config
      );
    } catch (error) {
      setIsOnline(currentIsOnline);
      console.error("Failed to update status:", error);
    }
  };

  const shouldRenderField = (fieldKey) => {
    if (!workflowQuestions || !data?.business_types) {
      return false;
    }

    const question = workflowQuestions.find((q) => q.question === fieldKey);
    if (!question) {
      return false;
    }

    const userBusinessTypeIds = data.business_types.map((bt) => bt._id);
    const questionBusinessTypeIds = question.business_types.map((bt) => bt._id);

    return userBusinessTypeIds.some((id) =>
      questionBusinessTypeIds.includes(id)
    );
  };

  const updateCompanyProfileData = (newData) => {
    update(newData);
  };

  useEffect(() => {
    if (percentage === 100) {
      setShowCompletionMessage(true);
      const timer = setTimeout(() => {
        setShowCompletionMessage(false);
        setShowEnhanceButton(true);
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowCompletionMessage(false);
      setShowEnhanceButton(false);
      setIsLoading(false);
    }
  }, [percentage]);

  // useEffect(() => {
  //   if (data?.isVerified) {
  //     setVerificationStatus("Promote Business Page");
  //   }
  // }, [data?.isVerified]);

  useEffect(() => {
    if (data?.pageStatus) {
      setIsOnline(data.pageStatus === "online");
    }
  }, [data?.pageStatus]);

  useEffect(() => {
    if (!data?.verificationData) {
      setVerificationStatus("Get Verified Now!");
    }
    if (data?.verificationData?.status === "pending") {
      setVerificationStatus("Pending Verification");
    }
  }, [data?.verificationData]);

  const shareUrl = window.location.host + `/business/profile/${data?.username}`;
  // const shareUrl = window.location.host + `/${data?.username}`;
  const shareTitle = data?.business_name || "Check out this business profile!";

  useEffect(() => {
    const fetchWorkflowQuestions = async () => {
      const questionsData = await http.get(
        `${config.api_url}/business/business-questions`
      );
      setWorkFlowQuestions(questionsData.data);
    };
    const fetchPlans = async () => {
      const plansData = await http.get(`${config.api_url}/business-plans`);
      setPlans(plansData?.data || []);
    };

    fetchWorkflowQuestions();
    fetchPlans();
  }, []);

  // Move scrollingTextData logic here or into a utility function
  const scrollingTextData = [
    shouldRenderField("location_preference") &&
      data?.project_location?.data &&
      `Can do Projects : <span>${data?.project_location?.data || ""}</span>`,
    shouldRenderField("renovation_work") &&
      data?.renovation_work &&
      `Renovation Work : <span>${data?.renovation_work || ""}</span>`,
    shouldRenderField("average_budget") &&
      data?.avg_project_budget?.budgets &&
      data?.avg_project_budget?.budgets?.length > 0 &&
      `Approx Budget of Projects : ${truncateText(
        data?.avg_project_budget?.budgets?.map(
          (budget) => `<span>${budget}</span> `
        )
      )}`,
    shouldRenderField("current_minimal_fee") &&
      data?.project_mimimal_fee?.fee &&
      data?.project_mimimal_fee?.fee !== "" &&
      `Current Min. Project Fee : <span>${
        data?.project_mimimal_fee?.fee || ""
      }</span>`,
    shouldRenderField("minimum_project_size") &&
      data?.project_sizes?.sizes &&
      data?.project_sizes?.sizes?.length > 0 &&
      `Min. Project Size : ${truncateText(
        data?.project_sizes?.sizes?.map(
          (size) => `<span>${size} ${data?.project_sizes?.unit}</span> `
        )
      )}`,
    shouldRenderField("project_typology") &&
      data?.project_typology?.data?.length &&
      `Project Typology : <span>${truncateText(
        data?.project_typology?.data || ""
      )}</span>`,
    shouldRenderField("service_design_style") &&
      data?.design_style?.data?.length &&
      `Design Style : <span>${truncateText(
        data?.design_style?.data || ""
      )}</span>`,
  ].filter(Boolean);

  const [active, setActive] = useState("section-bedit-01");

  useEffect(() => {
    Events.scrollEvent.register("end", () => {
      const anyActive = document.querySelector(".mobile_sticky_tabs .active");
      if (!anyActive) {
        setActive("section-bedit-01");
      }
    });

    return () => {
      Events.scrollEvent.remove("end");
    };
  }, []);

  return (
    <>
      {/* <PaymentSuccessfull/> */}
      <GalleryEditPopupDefault
        show={showPopup}
        onHide={() => handlePopupClose(false)}
        handleClose={handlePopupClose}
        // categoryData={selectedCategory}
      />
      <SliderGalleryMobilePopup
        show={replaceImagePopup}
        handleClose={handleReplaceImagePopupClose}
        data={data}
        position={currentReplacingPosition}
        currentImage={currentReplacingImage}
        onImageReplace={handleImageReplacement}
      />
      <PendingVerification
        show={isPendingVerificationPopup}
        onHide={() => setIsPendingVerificationPopup(false)}
        handleClose={handleHidePendingVerificationPopup}
        data={data}
        onSuccess
      />
      {/* <LoadingStateComp /> */}
      {width <= 768 && (
        <SocialMediaLinksPopup
          show={showOptionsPopup}
          handleClose={handleOptionsPopupClose}
          shareUrl={shareUrl}
          shareTitle={shareTitle}
        />
      )}
      <main className="bedit_main">
        <section className="bedit_bg">
          <img
            src={bEdit_background}
            alt="background"
            className="bg_image_bedit"
          />
        </section>

        {width <= 992 && (
          <MsonarySlider
            isSliderEdit={true}
            onClick={() => handleSliderPopupOpen()}
            onImageReplace={handleImageReplace}
            data={data}
          />
        )}

        <section
          className="bedit_sec0 bedit_sec1 bdt_1_sect"
          ref={headerRef}
          style={{
            zIndex: "1",
          }}
        >
          <div className="heading_container wrap_fm_strip">
            <div className="my_container d-flex">
              <div className="head_container flex-grow-1">
                <h1
                  className="title firm_name_title position-relative"
                  // onClick={handleShowPendingVerificationPopup}
                >
                  <div
                    className="FirmName_image_wrapper firm_nm_strip"
                    style={{
                      backgroundColor: data?.brand_logo && "transparent",
                    }}
                  >
                    {data?.brand_logo ? (
                      <img
                        src={`${config.aws_object_url}business/${data?.brand_logo}`}
                        alt="Firm-image"
                        className="firm_image_edit"
                      />
                    ) : (
                      helper.generateInitials(data?.business_name)
                    )}
                  </div>

                  {data?.business_name?.toUpperCase()}
                  {data?.isVerified && (
                    <img
                      src={verifiedBlueIcon}
                      alt="verified icon"
                      className="verified_icon_top_header"
                    />
                  )}
                </h1>

                <div className="social_icon_container">
                  <>
                    <Link
                      to={() => false}
                      className="social_icon_wrapper"
                      onClick={handleEditFirmNamePopupOpen}
                    >
                      <img
                        src={editicon}
                        alt="Edit icon"
                        className="heart_icon"
                      />
                    </Link>

                    <Link
                      to={() => false}
                      className="social_icon_wrapper position-relative"
                      ref={menuRef}
                      onClick={
                        width <= 768
                          ? handleOptionsPopupOpen
                          : () => setIsHovered(!isHovered)
                      }
                    >
                      <img
                        src={shareBlackInside}
                        alt="share icon"
                        className="share_icon"
                      />

                      <div
                        className={`hover-menu hover-menu-share ${
                          isHovered ? "show" : "hide"
                        }`}
                      >
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            shareTitle + " " + shareUrl
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="share_top_header_menu_item"
                          onClick={() => {
                            window.open(
                              `https://api.whatsapp.com/send?text=${encodeURIComponent(
                                shareTitle + " " + shareUrl
                              )}`
                            );
                          }}
                        >
                          <img
                            src={whatsappCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />
                          WhatsApp
                        </a>

                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                            shareUrl
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            window.open(
                              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                shareUrl
                              )}`
                            );
                          }}
                          className="share_top_header_menu_item"
                        >
                          <img
                            src={linkedInLinkCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />{" "}
                          LinkedIn
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            shareTitle
                          )}&url=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            window.open(
                              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                shareTitle
                              )}&url=${encodeURIComponent(shareUrl)}`
                            );
                          }}
                          className="share_top_header_menu_item"
                        >
                          <img
                            src={XCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />{" "}
                          X
                        </a>

                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            shareUrl
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            window.open(
                              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                shareUrl
                              )}`
                            );
                          }}
                          className="share_top_header_menu_item"
                        >
                          <img
                            src={faceBookCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />{" "}
                          Facebook
                        </a>
                        <div
                          onClick={() => {
                            if (navigator.clipboard && window.isSecureContext) {
                              navigator.clipboard
                                .writeText(shareUrl)
                                .then(() => {
                                  toast(
                                    <ToastMsg message="Link copied to clipboard" />,
                                    config.success_toast_config
                                  );
                                });
                            } else {
                              const textArea =
                                document.createElement("textarea");
                              textArea.value = shareUrl;
                              textArea.style.position = "fixed";
                              textArea.style.left = "-999999px";
                              document.body.appendChild(textArea);
                              textArea.focus();
                              textArea.select();
                              document.execCommand("copy");
                              textArea.remove();

                              toast(
                                <ToastMsg message="Link copied to clipboard" />,
                                config.success_toast_config
                              );
                            }
                          }}
                          className="share_top_header_menu_item border-0"
                        >
                          <img
                            src={CopyLinkCircleOrange}
                            alt=""
                            className="menu_icon_popup share_top_header_menu_icon"
                          />{" "}
                          Copy Link
                        </div>
                      </div>
                    </Link>
                  </>
                </div>
              </div>
            </div>
          </div>
        </section>

        {width <= 992 && (
          <div
            className="mobile_sticky_tabs my_container"
            ref={stickyTabsRef}
            style={{ top: `${headerHeight}px` }}
          >
            <ScrollLink
              to={"section-bedit-01"}
              spy={true}
              smooth={true}
              duration={300}
              activeClass={"active"}
              onSetActive={() => setActive("section-bedit-01")}
              className={active === "section-bedit-01" ? "active" : ""}
              offset={
                width <= 992 && width > 800
                  ? -160
                  : width <= 800 && width > 767
                  ? -160
                  : width <= 767 && width > 576
                  ? -120
                  : width <= 576
                  ? -120
                  : -120
              }
            >
              About
            </ScrollLink>
            <ScrollLink
              to={"section-bedit-22"}
              spy={true}
              smooth={true}
              duration={300}
              activeClass={"active"}
              onSetActive={() => setActive("section-bedit-22")}
              className={active === "section-bedit-22" ? "active" : ""}
              offset={
                width <= 992 && width > 800
                  ? -145
                  : width <= 800 && width > 767
                  ? -145
                  : width <= 767 && width > 576
                  ? -120
                  : width <= 576
                  ? -120
                  : -120
              }
            >
              Gallery
            </ScrollLink>
            <ScrollLink
              to={"section-bedit-03"}
              spy={true}
              smooth={true}
              duration={300}
              activeClass={"active"}
              onSetActive={() => setActive("section-bedit-03")}
              className={active === "section-bedit-03" ? "active" : ""}
              offset={
                width <= 992 && width > 800
                  ? -155
                  : width <= 800 && width > 767
                  ? -155
                  : width <= 767 && width > 576
                  ? -130
                  : width <= 576
                  ? -127
                  : -127
              }
            >
              PDFs
            </ScrollLink>
            <ScrollLink
              to={"section-bedit-04"}
              spy={true}
              smooth={true}
              duration={300}
              activeClass={"active"}
              onSetActive={() => setActive("section-bedit-04")}
              className={active === "section-bedit-04" ? "active" : ""}
              offset={
                width <= 992 && width > 800
                  ? -135
                  : width <= 800 && width > 767
                  ? -130
                  : width <= 767 && width > 576
                  ? -110
                  : width <= 576
                  ? -120
                  : -120
              }
            >
              Contact
            </ScrollLink>
          </div>
        )}

        {/* For mobile */}
        {(isOnline === false || isTrialExpiredState) && width <= 992 && (
          <div className="my_container mb_OflineProfileMsg">
            <OflineProfileMsg
              isTrialExpired={isTrialExpiredState}
              isVerified={data?.isVerified}
              emptyFields={emptyFields}
              verificationStatus={
                data?.verificationData?.status ||
                (verificationStatus === "Pending Verification"
                  ? "pending"
                  : null)
              }
              pageStatus={data?.pageStatus}
            />
          </div>
        )}

        {isDataLoading ? (
          <></>
        ) : (
          <section className="bEdit_grid_wrapper bs_edit_main_pg">
            <div className="my_container">
              <div className="row">
                <div className="col-lg-5 col_left_bEdit_section">
                  <section className="bedit_sect01 bedit_sec1">
                    <div className="my_container p-0">
                      {!data?.isVerified && !isLoading && (
                        <>
                          <ProfileComplitionBar percentage={percentage} />
                          <div className="pending_actions_status_pf">
                            {percentage === 100 ? (
                              <div className="pending_actions_status_pf_text pending_actions_status_pf_text_sucess">
                                Congratulations! Your profile is complete!
                                Verify now to start reaching a wider audience.
                              </div>
                            ) : (
                              <div
                                className="pending_actions_status_pf_text"
                                onClick={handleShowCompleteActions}
                              >
                                {emptyFields.length} pending actions for your
                                profile completion
                              </div>
                            )}
                          </div>
                        </>
                      )}
                      {data?.isVerified &&
                        pendingNonMandatory.length > 0 &&
                        !isLoading && (
                          <div
                            className="enhance_profile_cta_container_pf"
                            onClick={handleShowNonMandatoryActions}
                          >
                            <div className="enhance_profile_cta_pf">
                              <img
                                src={enhanceProfileIconStar}
                                alt="Enhance Profile"
                                className="enhance_profile_icon_pf"
                              />
                              <p className={`enhance_profile_pf_text`}>
                                Enhance Your Profile Now! For Better Client
                                Matchmaking
                              </p>
                            </div>
                          </div>
                        )}
                      {data?.isVerified && (
                        <div className="online_status_pf__promote_conatiner">
                          <div className="status_pf_wrapper">
                            <span className="status_pf_wrapper_text">
                              Status : {isOnline ? "Online" : "Offline"}
                            </span>
                            <ToggleSwitch
                              isChecked={isOnline}
                              onChange={handleStatusToggle}
                              disabled={isTrialExpiredState} // Add disabled prop
                            />
                          </div>
                          <div
                            className="promote_buiness_pf"
                            onClick={() => setIsPromotePopupModal(true)}
                          >
                            <div className="video_button">
                              <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                controls={false}
                                src={Aura}
                                className="cta_scr_video"
                              />
                              <div className="overlay">
                                <img
                                  src={prmoteIcon}
                                  alt="Promote Business Page"
                                  className="promote_icon"
                                />
                                <span>Promote Business Page</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {width >= 767 && (
                        <div className="status_container">
                          <div className="profile_wrapper_compliteion">
                            {data?.isVerified && (
                              <>
                                {shouldShowUpgradeButton() ? (
                                  <div>
                                    <Link
                                      to={chooseYourPlan}
                                      className="edit_connect_details_completion_pf_btn border-0 upgrade_pl_cta"
                                    >
                                      <img
                                        src={upgradeIcon}
                                        alt="Connect"
                                        className="connect_icon_pf"
                                      />
                                      <p
                                        className={`edit_connect_details_completion_pf_text`}
                                      >
                                        Upgrade Your Plan
                                      </p>
                                    </Link>
                                  </div>
                                ) : null}
                                <Link
                                  to={`/business/profile/${data?.username}`}
                                  // target="_blank"
                                >
                                  <div className="edit_connect_details_completion_pf_btn">
                                    <img
                                      src={eyeIcon}
                                      alt="Connect"
                                      className="connect_icon_pf"
                                    />
                                    <p
                                      className={`edit_connect_details_completion_pf_text`}
                                    >
                                      Preview Business Page
                                    </p>
                                  </div>
                                </Link>
                              </>
                            )}
                            {/* get verified now muted */}
                            {!data?.isVerified && (
                              <div
                                className={`verify_completion_pf_btn ${
                                  emptyFields.length === 0
                                    ? "active_verify_completion_pf_btn"
                                    : ""
                                }`}
                                onClick={sendVerificationRequest}
                              >
                                <img
                                  src={
                                    emptyFields.length === 0
                                      ? getVerifiedWhite
                                      : mutedVerifIcon
                                  }
                                  alt="verified"
                                  className="verified_icon_pf"
                                />
                                <p className="verify_completion_pf_text">
                                  {verificationStatus}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div id="section-bedit-3" name="section-bedit-01">
                        <OverView2
                          isActive={0}
                          isSubtabActive={0}
                          overviewData={data}
                          globalData={GlobalContextData}
                          isOnline={true}
                          scrollingTextData={scrollingTextData}
                          handleExcelPopupOpen={handleExcelPopupOpen}
                          workflowQuestions={workflowQuestions}
                          handleGeneralInfoPopupOpen={
                            handleGeneralInfoPopupOpen
                          }
                          containerRef={containerRef}
                          imageAssets={{
                            locationOrange,
                            editIconBlue,
                            bookmark_black,
                            suitCase_black,
                            employeesBlack,
                          }}
                        />
                      </div>
                    </div>
                  </section>
                </div>

                <div className="col-lg-7 right_section_col_bEdit">
                  <section className="bedit_sec2">
                    <div className="my_container">
                      <div className="main_tab_wrapper">
                        {BeditProfileData[isActive]?.subTab?.map((item, i) => (
                          <p
                            className={`main_tab_name ${
                              isSubtabActive === i ? "active" : ""
                            }`}
                            onClick={() => {
                              handleTabSelect(i);
                              document
                                .getElementById(`section-bedit-${i}`)
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                });
                            }}
                            key={`sub-tab-${i}`}
                          >
                            {item.tabName}
                          </p>
                        ))}
                      </div>

                      {/* For desktop */}
                      {(isOnline === false || isTrialExpiredState) &&
                        width > 992 && (
                          <OflineProfileMsg
                            isTrialExpired={isTrialExpiredState}
                            isVerified={data?.isVerified}
                            emptyFields={emptyFields}
                            verificationStatus={
                              data?.verificationData?.status ||
                              (verificationStatus === "Pending Verification"
                                ? "pending"
                                : null)
                            }
                            pageStatus={data?.pageStatus}
                          />
                        )}
                    </div>
                    {/* Sections Rendering: Conditional based on width */}
                    {isSubtabActive === 4 ? (
                      <BCEdit
                        isActive={isActive}
                        isSubtabActive={isSubtabActive}
                        data={data}
                      />
                    ) : (
                      <>
                        {width > 992 ? (
                          // Large screens
                          <>
                            {isSubtabActive === 0 && (
                              <VerticalAccordion2
                                isActive={isActive}
                                isSubtabActive={isSubtabActive}
                                galleryData={data}
                                setOverlayActive={true}
                                contentLoaded={!isDataLoading}
                                isInitialLoad={isInitialLoad}
                                // scrapingError={scrapingError}
                              />
                            )}
                            {isSubtabActive === 1 && (
                              <CompanyProfile2
                                setOverlayActive={true}
                                isActive={isActive}
                                isSubtabActive={isSubtabActive}
                                companyProfileData={data}
                                updateCompanyProfileData={
                                  updateCompanyProfileData
                                }
                              />
                            )}
                            {isSubtabActive === 2 && (
                              <div className="connect_edit_bs_wrapper">
                                <BusinessConnectEdit isEditable={true} />
                              </div>
                            )}
                          </>
                        ) : (
                          // Small screens
                          <>
                            <div
                              id="section-bedit-0"
                              ref={(el) => (sectionRefs.current[0] = el)}
                              name="section-bedit-22"
                            >
                              <VerticalAccordion2
                                isActive={isActive}
                                isSubtabActive={isSubtabActive}
                                galleryData={data}
                                setOverlayActive={true}
                                contentLoaded={!isDataLoading}
                                isInitialLoad={isInitialLoad}
                                // isScrapingContent={isScrapingContent}
                                // scrapingError={scrapingError}
                              />
                            </div>
                            {/* <AddImageComponent /> */}
                            <div
                              id="section-bedit-1"
                              ref={(el) => (sectionRefs.current[1] = el)}
                              name="section-bedit-03"
                            >
                              <CompanyProfile2
                                setOverlayActive={true}
                                isActive={isActive}
                                isSubtabActive={isSubtabActive}
                                companyProfileData={data}
                                updateCompanyProfileData={
                                  updateCompanyProfileData
                                }
                              />
                            </div>
                            <div
                              className="connect_edit_bs_wrapper"
                              id="section-bedit-2"
                              ref={(el) => (sectionRefs.current[2] = el)}
                              name="section-bedit-04"
                            >
                              <BusinessConnectEdit isEditable={true} />
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* <section className="bEdit_section_3">
          <Reviews
            isActive={isActive}
            isSubtabActive={isSubtabActive}
            reviewData={ratingData}
          />
        </section> */}
        <FooterV2 lightTheme />
      </main>
      {/* <TestPopup
        show={showPopup}
        handleClose={handlePopupClose}
        data={{ emptyFields }}
      /> */}
      <CompleteActions
        show={isCompleteActionsModal}
        onHide={() => setIsCompleteActionsModal(false)}
        handleClose={handleHideCompleteActions}
        data={data}
        emptyFields={emptyFields}
      />
      <NonMandatoryActionsV2
        show={isNonMandatoryActionsModal}
        onHide={() => setIsNonMandatoryActionsModal(false)}
        handleClose={handleHideNonMandatoryActions}
        data={data}
        globalData={GlobalContextData}
        emptyFields={pendingNonMandatory}
      />
      <TestPopup
        show={showEnhancePopup}
        handleClose={handleEnhancePopupClose}
        data={{
          emptyFields: pendingNonMandatory,
          title: "Pending Non-Mandatory Fields",
        }}
      />
      <EditLocationPopup
        show={showEditLocationPopup}
        handleClose={handleEditLocationPopupPopupClose}
      />
      <ExcelPopup
        show={showExcelPopup}
        handleClose={handleExcelPopupClose}
        globalData={GlobalContextData}
        data={data}
        workflowQuestions={workflowQuestions}
      />
      <EditFirmNamePopup
        show={showEditFirmNamePopup}
        handleClose={handleEditFirmNamePopupClose}
        OpenEditFirmNamePopup={handleEditFirmNamePopupOpen}
        data={{
          business_name: data?.business_name,
          brand_logo: data?.brand_logo,
        }}
        onSaveChanges={handleSaveBusinessDetails}
      />
      <GeneralInformation
        show={showGeneralInfoPopup}
        handleClose={handleGeneralInfoPopupClose}
        data={data}
        globalData={GlobalContextData}
      />
      {/* <FileUpload
        show={showFileUploadPopup}
        handleClose={handleFileUploadPopupClose}
      /> */}
      <PromotePopup
        show={isPromotePopupModal}
        onHide={() => setIsPromotePopupModal(false)}
        handleClose={() => setIsPromotePopupModal(false)}
      />
      {width < 767 && (
        <div className="bedit_stip_mobile_prv_upg">
          {shouldShowUpgradeButton() ? (
            <div
              className="upg_plan"
              onClick={(e) => {
                e.preventDefault();
                navigate(chooseYourPlan);
                // if (!isCreatingSubscription && plans[1]) {
                //   createSubscription();
                // }
              }}
            >
              <img
                src={upgradeIcon}
                alt="upgrade plan"
                className="upg_plan_icon"
              />
              <div className="txt_upg">Upgrade Your Plan</div>
            </div>
          ) : null}
          {data?.isVerified && (
            <Link
              to={`/business/profile/${data?.username}`}
              className="prv_view"
              // target="_blank"
            >
              <img src={eyeIcon} alt="View" className="prv_view_icon" />
              <div className="txt_prv">Preview Business Page</div>
            </Link>
          )}
          {!data?.isVerified && (
            // <div
            //   className={`verify_completion_pf_btn ${
            //     emptyFields.length === 0
            //       ? "active_verify_completion_pf_btn"
            //       : ""
            //   }`}
            //   onClick={sendVerificationRequest}
            // >
            //   <img
            //     src={
            //       emptyFields.length === 0 ? getVerifiedWhite : mutedVerifIcon
            //     }
            //     alt="verified"
            //     className="verified_icon_pf"
            //   />
            //   <p className="verify_completion_pf_text">{verificationStatus}</p>
            // </div>

            <div className="upg_plan" onClick={sendVerificationRequest}>
              <img
                src={
                  emptyFields.length === 0 ? getVerifiedWhite : mutedVerifIcon
                }
                alt="upgrade plan"
                className="upg_plan_icon"
              />
              <div className="txt_upg">{verificationStatus}</div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BEdit2;
