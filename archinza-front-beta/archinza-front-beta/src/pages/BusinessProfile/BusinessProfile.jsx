import React, { useEffect, useRef, useState } from "react";
import "./businessprofile.scss";
import FooterV2 from "../../components/FooterV2/FooterV2";
import BusinessBanner from "../../components/BusinessProfileBanner/BusinessBanner";
import { rightarrowblack, greentick } from "../../images";
import { useWindowSize } from "react-use";
import { useBusinessContext } from "../../context/BusinessAccount/BusinessAccountState";
import { useAuth } from "../../context/Auth/AuthState";
import BEditProfile01 from "./BusinessProfileComponents/BEditProfile01";
import { useLocation } from "react-router-dom";
import config from "../../config/config";
import http from "../../helpers/http";
import Joi from "joi";
import { useGlobalDataContext } from "../../context/GlobalData/GlobalDataState";

const BusinessProfile = () => {
  const [activeTab] = useState(0);
  const [ctaStatus, setCtaStatus] = useState(0);
  const [eventStatus, setEventStatus] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [tempBusinessName, setTempBusinessName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [error, setError] = useState("");
  const [boxPositionFromLeft, setBoxPositionFromLeft] = useState(0);
  const [businessType, setBusinessType] = useState(0);
  const [businessTypeName, setBusinessTypeName] = useState("");
  const contentContainerRef = useRef(null);
  const { width } = useWindowSize();
  const brandNameBoxRef = useRef();
  const auth = useAuth();
  const base_url = config.api_url;
  const BusinessContext = useBusinessContext();
  const GlobalContext = useGlobalDataContext();
  const location = useLocation();

  const navigationState = location.state || {};

  const containerPositionHandler = () => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleCtaChange = () => {
    const newValue = (ctaStatus + 1 + 2) % 2;
    setCtaStatus(newValue);
  };

  const getBusinessTypeID = (business_type) => {
    switch (business_type) {
      case "Design Firm/Consultancy":
        setBusinessType(0);
        break;
      case "Services Design Firm/Consultancy":
        setBusinessType(1);
        break;
      case "Design, Supply & Execute Business":
        setBusinessType(2);
        break;
      case "Product/Material - Seller/Installer/Contractor/Execution Team":
        setBusinessType(3);
        break;
      case "E Commerce/Business for Design & Decor":
        setBusinessType(4);
        break;
      case "Curator/Stylist/Gallery":
        setBusinessType(5);
        break;
      case "Event & Publishing House":
        setBusinessType(6);
        break;
      case "PR/Marketing/Content/Photography":
        setBusinessType(7);
        break;
      case "National/International Brand":
        setBusinessType(8);
        break;
      case "Education & Courses":
        setBusinessType(9);
        break;

      default:
        break;
    }
  };

  const handleDiscard = () => {
    setShowEdit(false);
    setEventStatus("discard");
  };

  // const handleSubmit = async () => {
  //   const schema = Joi.object({
  //     business_name: Joi.string().label("Business Name"),
  //   });

  //   const { error } = schema.validate(
  //     { business_name: tempBusinessName },
  //     config.joiOptions
  //   );
  //   if (error) {
  //     const errors = {};
  //     error.details.forEach((detail) => {
  //       errors[detail.path[0]] = detail.message;
  //     });
  //     setError(errors.business_name);
  //     setEventStatus("error");
  //     return;
  //   }

  //   const data = await http.post(
  //     `${base_url}/business/business-details/${auth?.user?._id}`,
  //     {
  //       business_name: tempBusinessName,
  //     }
  //   );
  //   await BusinessContext.update({
  //     ...BusinessContext.data,
  //     business_name: tempBusinessName,
  //   });
  //   setBusinessName(tempBusinessName);
  //   setShowEdit(false);
  //   setEventStatus("save");
  //   auth.user["name"] = tempBusinessName;
  // };

  const trackChanges = (data) => {
    if (data == "edit") {
      setShowEdit(true);
      setEventStatus("");
    }
  };

  const handleBusinessNameUpdate = async (newBusinessName) => {
    const schema = Joi.object({
      business_name: Joi.string().label("Business Name"),
    });

    const { error } = schema.validate(
      { business_name: newBusinessName },
      config.joiOptions
    );
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      setError(errors.business_name);
      setEventStatus("error");
      return;
    }

    const { data } = await http.post(
      base_url + `/business/business-details/${auth?.user?._id}`,
      { business_name: newBusinessName }
    );

    if (data) {
      setBrandName(newBusinessName);
      await BusinessContext.update({
        ...BusinessContext.data,
        business_name: newBusinessName,
      });
      auth.user["name"] = newBusinessName;
    }
  };

  const handleBrandNameChange = (newName) => {
    setTempBusinessName(newName);
  };

  const fetchData = async (id) => {
    const response = await http.get(
      base_url + `/business/business-details/${id}`
    );

    if (response?.data) {
      const data = response.data;
      getBusinessTypeID(data?.business_type);
      setBusinessTypeName(data?.business_type);
      setBusinessName(data?.business_name || "");
      BusinessContext.update(data);
    }
  };

  useEffect(() => {
    if (navigationState?.correspondingUserData) {
      BusinessContext.update(navigationState.correspondingUserData);
      fetchData(navigationState.correspondingUserData._id);
    } else {
      if (auth.user) {
        console.log(auth.user._id);
        fetchData(auth.user._id);
      }
    }
  }, [location, auth]);

  // useEffect(() => {
  //   if (auth?.user) {
  //     fetchData(auth?.user?._id);
  //   }
  // }, [auth?.user]);

  useEffect(() => {
    containerPositionHandler();
  }, [activeTab]);

  useEffect(() => {
    if (BusinessContext.data) {
      const mediaFields = [
        "company_profile_media",
        "product_catalogues_media",
        "completed_products_media",
        "project_renders_media",
        "sites_inprogress_media",
        "other_media",
      ];

      const allFieldsFilled = mediaFields.every(
        (field) => BusinessContext.data[field]?.length > 0
      );

      setCtaStatus(allFieldsFilled ? 0 : 1);
    }
  }, [BusinessContext]);

  useEffect(() => {
    setBoxPositionFromLeft(brandNameBoxRef.current.offsetLeft);
  }, []);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <section className="bizp_bg"></section>
      <BusinessBanner
        boxRef={brandNameBoxRef}
        brandName={businessName}
        eventChanges={eventStatus}
        trackChanges={trackChanges}
        onBrandNameChange={handleBrandNameChange}
        businessContext={BusinessContext?.data}
        globalContext={GlobalContext}
        onBusinessNameUpdate={handleBusinessNameUpdate}
      />
      <section className="bizp_sec1" ref={contentContainerRef}>
        <div className="my_container">
          <div
            className="cta_wrapper top_ctas"
            style={{ paddingLeft: width > 992 ? boxPositionFromLeft : 0 }}
          >
            {/* <div className="cta_flex">
              <div
                className="common_cta without_shadow"
                style={{ display: showEdit ? "block" : "none" }}
                // onClick={handleSubmit}
              >
                <div className="text">
                  {width > 600 ? "Save Changes" : "Save"}
                </div>
              </div>
              <div
                className="common_cta without_shadow black_border_cta"
                style={{ display: showEdit ? "block" : "none" }}
                onClick={handleDiscard}
              >
                <div className="text">
                  {width > 600 ? "Discard Changes" : "Discard"}
                </div>
              </div>
            </div> */}
            <div
              className={`common_cta without_shadow ${
                ctaStatus === 0 ? "disabled_cta" : "online_cta black_border_cta"
              }`}
              // onClick={handleCtaChange}
            >
              {ctaStatus === 0 && (
                <img
                  width={40}
                  height={40}
                  src={greentick}
                  alt="icon"
                  className="tick_icon"
                  loading="lazy"
                />
              )}
              <div className="text">
                {ctaStatus === 0 && "Get Verified Now"}
                {ctaStatus === 1 && "Preview Page"}
              </div>
              <img
                width={50}
                height={20}
                src={rightarrowblack}
                alt="icon"
                className="icon"
                loading="lazy"
              />
            </div>
          </div>
          <div className="different_profile_wrappers">
            <BEditProfile01 navigationData={navigationState} />
          </div>
        </div>
      </section>
      <FooterV2 lightTheme />
    </>
  );
};

export default BusinessProfile;
