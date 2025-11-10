import React, { useState } from "react";
import "./companyProfile.scss";
import {
  downloadFileIcon,
  downloadFileIconV2,
  downloadIcon,
  editIconBlue,
  infoIconEditProfile,
  lockIcon,
  pdfIcon,
  pdfImagePreview,
} from "../../../../images";
import { Link } from "react-router-dom";
import { BeditProfileData } from "../../../../components/Data/bEditData";
import CompanyProfilePopup from "../../BusinessProfileComponents/BusinessViewPopups/CompanyProfilePopup/CompanyProfilePopup";
import config from "../../../../config/config";
import { BViewProfileData } from "../../../../components/Data/bViewData";
import helper from "../../../../helpers/helper";
import { useWindowSize } from "react-use";
import FormFiveModal from "../../../../components/FormFiveModal/FormFiveModal";

const companyProfileTitles = [
  {
    key: "company_profile_media",
    title: "Firm/Company Profile",
    fileUploadTitle: "Firm/Company Profiles",
    image_prefix: "profile",
  },
  {
    key: "product_catalogues_media",
    title: "Product Catalogue(s)",
    fileUploadTitle: "Product Catalogues",
    image_prefix: "catalogue",
  },
];
const CompanyProfile = ({
  isActive,
  isSubtabActive,
  companyProfileData,
  editIcon,
  updateCompanyProfileData,
}) => {
  const [isCompanyProfilePopup, setIsCompanyProfilePopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const { width } = useWindowSize();
  // const [thumbnail, setThumbnail] = useState(true);
  const handleShowCompanyProfilePopup = (category) => {
    const selectedCategoryData =
      companyProfileData?.[category.key]?.filter(
        (it) => it?.visibility === true
      ) || [];
    setSelectedCategory({
      category,
      data: selectedCategoryData,
      image_prefix: category?.image_prefix,
    });
    setIsCompanyProfilePopup(true);
  };
  const handleHideCompanyProfilePopup = () => {
    setIsCompanyProfilePopup(false);
    setSelectedCategory(null);
  };
  const objectUrl = config.aws_object_url + "business/";
  const datainfoBedit = (
    <li className="list_item">
      These links form a permanent part of your business intelligence used for
      AI matchmaking. To replace or delete them, please contact us at{" "}
      <a href="mailto:reach@archinza.com" className="text-decoration-underline">
        reach@archinza.com
      </a>
    </li>
  );
  return (
    <>
      <CompanyProfilePopup
        show={isCompanyProfilePopup}
        onHide={() => setIsCompanyProfilePopup(false)}
        handleClose={handleHideCompanyProfilePopup}
        isActive={1}
        isSubtabActive={1}
        // CompanyProfilePopupData={selectedCategory}
        editIcon={false}
        categoryData={selectedCategory}
        updateCompanyProfileData={updateCompanyProfileData}
      />
      {/* {companyProfileData[isActive]?.subTab?.map(
        (data, index) =>
          data?.companyProfile && (
            <div
              className={`comp_prof_container ${
                isSubtabActive === index ? "active" : ""
              }`}
              key={`company-${index}`}
            >
              <div className="my_container">
                {data?.companyProfile.map((prof, i) => (
                  <div className="comp_prof_wrapper" key={`list-${i}`}>
                    <div className="cta_container">
                      <h2 className="title">{prof?.title}</h2>
                      <div className="cta_wrapper">
                        {editIcon && (
                          <img
                            src={editIconBlue}
                            alt="edit icon"
                            className="edit_icon"
                          />
                        )}
                        <Link
                          to={() => false}
                          className="bedit_common_cta"
                          onClick={handleShowCompanyProfilePopup}
                        >
                          {prof?.ctaText}
                        </Link>
                      </div>
                    </div>

                    <div className="row pofile_row">
                      {prof?.profileList?.map((item, i) => (
                        <div
                          className="col-lg-4 col-md-4 col-sm-4 pofile_col"
                          key={`pdf-${i}`}
                        >
                          <a
                            href={item?.pdfLink}
                            target="_blank"
                            rel="noreferrer"
                            download={item?.title}
                          >
                            <div className="profile_box">
                              <div className="img_wrapper">
                                <img
                                  src={downloadFileIcon}
                                  alt="pdf icon"
                                  className="pdf_icon"
                                />
                                <img
                                  src={downloadIcon}
                                  alt="download_icon icon"
                                  className="download_icon"
                                />
                              </div>
                              <h3 className="pdf_title">{item?.title}</h3>
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
      )} */}

      {companyProfileTitles.map((data, index) => {
        const documents = companyProfileData[data.key]?.filter(
          (it) => it?.visibility === true
        );
        return (
          <div
            className={`comp_prof_container active`}
            key={`company-${index}`}
          >
            {documents?.length > 0 && (
              <div className="my_container">
                <div className="comp_prof_wrapper" key={`list-${index}`}>
                  <div className="cta_container">
                    <h2 className="title">
                      {data.title}
                      <img
                        src={infoIconEditProfile}
                        alt="info"
                        className="inf_icon_prf"
                        onClick={() => setModalShow(true)}
                      />
                    </h2>
                    <div className="cta_wrapper p-0">
                      <Link
                        to={() => false}
                        className="bedit_common_cta"
                        onClick={() => handleShowCompanyProfilePopup(data)}
                      >
                        View More
                      </Link>
                    </div>
                  </div>

                  <div className="row pofile_row profile_row_b_edit_main">
                    {documents?.map((item, i) => (
                      <div
                        className="col-lg-4 col-md-4 col-sm-4 pofile_col"
                        key={`pdf-${i}`}
                      >
                        <a
                          href={`${objectUrl}${item?.url}`}
                          target="_blank"
                          rel="noreferrer"
                          download={item?.name}
                        >
                          <div
                            className={`profile_box position-relative ${
                              item?.thumbnail && "prf_bx_img_prev "
                            }`}
                          >
                            <div className="img_wrapper">
                              <img
                                src={lockIcon}
                                alt="lock pdf"
                                className="lockIcon_pdf_com"
                              />
                              {item?.thumbnail ? (
                                <img
                                  src={`${objectUrl}${item.thumbnail}`}
                                  // src={pdfImagePreview}
                                  alt="pdf icon"
                                  className="pdf_img_prev_edit"
                                />
                              ) : (
                                <img
                                  src={downloadFileIcon}
                                  alt="pdf icon"
                                  className={`pdf_icon`}
                                />
                              )}

                              {!item?.thumbnail && (
                                <img
                                  src={downloadFileIconV2}
                                  alt="download_icon icon"
                                  className={`download_icon`}
                                />
                              )}
                            </div>
                            <h3
                              className={`pdf_title ${
                                item?.thumbnail && "pdf_title_previmg"
                              }`}
                            >
                              {/* Loremipsum Set Dolor Content Dummy Text.PDF */}
                              {`${helper.getBusinessNamePrefix(
                                `${data.image_prefix}_${String(
                                  Number(i) + 1
                                ).padStart(2, "0")}_` +
                                  companyProfileData?.business_name,
                                item.url,
                                width >= 1200 ? 28 : 25
                              )}`}
                              {item?.thumbnail && (
                                <img
                                  src={downloadFileIconV2}
                                  alt="download_icon icon"
                                  className={`download_icon ${
                                    item?.thumbnail && "pdf_dw_icon_prev"
                                  }`}
                                />
                              )}
                            </h3>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <FormFiveModal
        list={datainfoBedit}
        show={modalShow}
        onHide={() => setModalShow(false)}
        infoIconLightTheme={true}
        className="company-profile-modal-pdf-info"
        backdropClassName="company-profile-pdf-info-backdrop"
      />
    </>
  );
};

export default CompanyProfile;
