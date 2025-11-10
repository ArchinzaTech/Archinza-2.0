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
import config from "../../../../config/config";
import CompanyProfileEditPopup from "../../BusinessProfileComponents/PopUpComponents/CompanyProfileEditPopup/CompanyProfileEditPopup";
import helper from "../../../../helpers/helper";
import { useWindowSize } from "react-use";
import AddImageComponent from "../AddImageComponent/AddImageComponent";
import AddPdfComponent from "../AddPdfComponent/AddPdfComponent";
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

const CompanyProfile2 = ({
  isActive,
  isSubtabActive,
  companyProfileData,
  updateCompanyProfileData,
  setOverlayActive,
}) => {
  const { width } = useWindowSize();
  const objectUrl = config.aws_object_url + "business/";
  const [isCompanyProfilePopup, setIsCompanyProfilePopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [isPreviweImage, setIsPreviewImage] = useState(true);
  const [modalShow, setModalShow] = useState(false);

  const datainfoBedit = (
    <li className="list_item">
      These links form a permanent part of your business intelligence used for
      AI matchmaking. To replace or delete them, please contact us at{" "}
      <a href="mailto:reach@archinza.com" className="text-decoration-underline">
        reach@archinza.com
      </a>
    </li>
  );

  const handleHideCompanyProfilePopup = () => {
    setIsCompanyProfilePopup(false);
  };
  const handleShowCompanyProfilePopup = (documents, category) => {
    setSelectedCategory({
      category,
      data: documents,
      userId: companyProfileData._id,
    });
    setIsCompanyProfilePopup(true);
  };

  return (
    <>
      <CompanyProfileEditPopup
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

      {companyProfileTitles.map((data, index) => {
        const documents = companyProfileData[data.key];
        return (
          <div
            className={`comp_prof_container active`}
            key={`company-${index}`}
          >
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
                  <div
                    className="cta_wrapper p-0"
                    onClick={() =>
                      handleShowCompanyProfilePopup(documents, data)
                    }
                  >
                    <img
                      src={editIconBlue}
                      alt="edit icon"
                      className="edit_icon"
                    />
                    <Link to={() => false} className="bedit_common_cta">
                      Edit | View
                    </Link>
                  </div>
                </div>
                <div className="row pofile_row profile_row_b_edit_main">
                  {!documents || documents?.length === 0 ? (
                    // <AddImageComponent
                    //   title={"Add Files"}
                    //   mainTitle={"Add Files"}
                    //   category={data}
                    //   onUpdateData={updateCompanyProfileData}
                    // />
                    <AddPdfComponent
                      title={"Add Files"}
                      mainTitle={"Add Files"}
                      category={data}
                      onUpdateData={updateCompanyProfileData}
                    />
                  ) : (
                    documents?.map((item, i) => (
                      <div
                        className={`col-lg-4 col-md-4 col-sm-4 pofile_col`}
                        key={`pdf-${i}`}
                        style={{
                          opacity: !setOverlayActive ? "0.4" : "1",
                        }}
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
                            style={{ height: "100%" }}
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
                    ))
                  )}
                </div>
              </div>
            </div>
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

export default CompanyProfile2;
