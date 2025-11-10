import React, { useEffect, useState } from "react";
import "./businessbanner.scss";
import { editiconwhite, images, logoedit } from "../../images";
import FullWidthTextField from "../TextField/FullWidthTextField";
import http from "../../helpers/http";
import config from "../../config/config";
import BusinessNameModal from "../BusinessNameModal/BusinessNameModal";
import { toast } from "react-toastify";
import ToastMsg from "../../components/ToastMsg/ToastMsg";

const BusinessBanner = ({
  brandName,
  boxRef,
  eventChanges,
  trackChanges,
  onBrandNameChange,
  businessContext,
  globalContext,
  onBusinessNameUpdate,
}) => {
  const [profileStatus, setProfileStatus] = useState(0);
  const [newName, setNewName] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [logoImage, setLogoImage] = useState(images.brandlogo.image);
  const [banner, setBanner] = useState(images.businessprifilebg.image);
  const [logoFile, setLogoFile] = useState(null);
  const [businessNameEdit, setBusinessNameEdit] = useState(false);
  const [localBrandName, setLocalBrandName] = useState(brandName);

  const handleStatusChange = () => {
    const newValue = (profileStatus + 1 + 3) % 3;
    setProfileStatus(newValue);
  };
  const handleEditButton = () => {
    setNewName(true);
    trackChanges("edit");
    setBusinessNameEdit(true);
  };

  const handleLogoUpload = async () => {
    if (logoFile) {
      const formData = new FormData();
      formData.append("file", logoFile);

      const data = await http.post(
        `${config.api_url}/business/business-details/${businessContext._id}`,
        formData
      );

      if (data) {
        businessContext.brand_logo = data?.data?.brand_logo;
      }
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // setLogoImage(images.brandlogo.image);
      toast(
        <ToastMsg message="Invalid File Type" />,
        config.error_toast_config
      );
      // setError("Please select a valid image file.");
    }
  };

  const handleBusinessNameChange = (newBusinessName) => {
    onBusinessNameUpdate(newBusinessName);
    setBusinessNameEdit(false);
    setLocalBrandName(newBusinessName);
  };

  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
      };
      reader.readAsDataURL(logoFile);
      handleLogoUpload();
    }
  }, [logoFile]);

  useEffect(() => {
    if (businessContext?.brand_logo?.url) {
      setLogoImage(
        `${config.aws_object_url}/business/${businessContext.brand_logo.url}`
      );
      setLogoFile(null);
    }

    if (globalContext && businessContext) {
      const businessType = globalContext?.business_types?.find(
        (it) => businessContext?.business_type == it.category
      );

      if (businessType) {
        if (businessType?.banner) {
          setBanner(
            `${config.aws_object_url}/business/${businessType?.banner?.url}`
          );
        }
      }
    }
  }, [businessContext, globalContext]);

  useEffect(() => {
    if (businessContext) {
      const mediaFields = [
        "company_profile_media",
        "product_catalogues_media",
        "completed_products_media",
        "project_renders_media",
        "sites_inprogress_media",
        "other_media",
      ];

      const allFieldsFilled = mediaFields.every(
        (field) => businessContext[field]?.length > 0
      );

      setProfileStatus(allFieldsFilled ? 1 : 0);
    }
  }, [businessContext]);

  useEffect(() => {
    setLocalBrandName(brandName);
  }, [brandName]);

  return (
    <>
      <section className="business_banner">
        <img
          width={1920}
          height={400}
          src={banner}
          alt="business profile card"
          className="biz_bg_img"
        />
        <div className="blue_strip">
          <div className="my_container">
            <div className="strip_flex">
              <div className="logo_wrapper">
                <div className="logo_box">
                  <img
                    width={300}
                    height={300}
                    src={logoImage}
                    alt={images.brandlogo.alt}
                    className="brand_logo"
                    style={{ borderRadius: "50%" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    style={{ display: "none" }}
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload">
                    <img
                      width={60}
                      height={60}
                      src={logoedit}
                      alt="logo edit"
                      className="brand_logo_edit"
                    />
                  </label>
                  {/* <img
                    width={60}
                    height={60}
                    src={logoedit}
                    alt="logo edit"
                    className="brand_logo_edit"
                  /> */}
                </div>
              </div>
              <div ref={boxRef} className="edit_brand_wrapper">
                <div className="current_name_wrapper">
                  <h1
                    title={localBrandName.toUpperCase()}
                    className="brand_name"
                  >
                    {localBrandName}
                  </h1>
                  {/* {!newName && ( */}
                  <img
                    src={editiconwhite}
                    alt=""
                    className="edit_pin"
                    onClick={handleEditButton}
                  />
                  {/* )} */}
                </div>
                {/* {newName && (
                  <div className="field_wrapper">
                    <FullWidthTextField
                      lightTheme
                      label="Enter business name*"
                      name="business_name"
                      value={name}
                      onChange={handleInputChange}
                    />
                  </div>
                )} */}
                <p className="error">{error}</p>
              </div>
              <div className="profile_status">
                <p
                  className={`status_box ${profileStatus === 0 && "draft"} ${
                    profileStatus === 1 && "completed"
                  } ${profileStatus === 2 && "verified"}`}
                  // onClick={handleStatusChange}
                >
                  {profileStatus === 0 && "draft"}
                  {profileStatus === 1 && "pending verification"}
                  {profileStatus === 2 && "verified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BusinessNameModal
        show={businessNameEdit}
        onHide={() => setBusinessNameEdit(false)}
        currentName={localBrandName}
        onBusinessNameChange={handleBusinessNameChange}
      />
    </>
  );
};

export default BusinessBanner;
