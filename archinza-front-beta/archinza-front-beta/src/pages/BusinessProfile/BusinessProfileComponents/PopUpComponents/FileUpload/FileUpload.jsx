import React, { useState } from "react";
import "./fileUpload.scss";
import style from "../../../../FormFiveLightTheme/Form/formfivelighttheme.module.scss";
import Modal from "react-bootstrap/Modal";
import { modalCloseIcon, uploadIcon } from "../../../../../images";
import { useBusinessContext } from "../../../../../context/BusinessAccount/BusinessAccountState";
import BusinessProfileFileUpload from "../../../../../components/BusinessProfileFileUpload/BusinessProfileFileUpload";
import { toast } from "react-toastify";
import ToastMsg from "../../../../../components/ToastMsg/ToastMsg";
import config from "../../../../../config/config";

const galleryTitles = [
  { key: "project_renders_media", title: "Project Photos & Renders" },
  { key: "completed_products_media", title: "Products | Materials" },
  { key: "sites_inprogress_media", title: "Sites In Progress" },
];
const FileUpload = (props) => {
  const [upload, setUpload] = useState(false);
  const [media, setMedia] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [uploadedMediaByType, setUploadedMediaByType] = useState({});
  const BusinessContext = useBusinessContext();
  const TOTAL_STORAGE =
    BusinessContext?.data?.subscription?.plan?.features?.imagesLimit || 200;

  const handleFileUpload = async (
    uploadedFileData,
    stateType,
    documentMediaType
  ) => {
    const { state } = stateType;

    // const totalImages = galleryTitles.reduce((sum, { key }) => {
    //   return sum + (BusinessContext.data[key]?.length || 0);
    // }, 0);

    // if (
    //   state !== "removed" &&
    //   totalImages + uploadedFileData.length > TOTAL_STORAGE
    // ) {
    //   toast(
    //     <ToastMsg
    //       message={`Cannot upload images. Storage limit of ${TOTAL_STORAGE} reached. Please upgrade your plan.`}
    //       danger={true}
    //     />,
    //     config.error_toast_config
    //   );
    //   return;
    // }
    // Create a new array with the uploaded files
    let updatedMedia;

    if (state === "removed") {
      updatedMedia = [...uploadedFileData];
    } else {
      // Get current media from BusinessContext (or empty array if none)
      const currentContextMedia = BusinessContext.data[documentMediaType] || [];
      updatedMedia = [...currentContextMedia, ...uploadedFileData];
    }

    // Update local state for this modal
    setUploadedMediaByType((prev) => ({
      ...prev,
      [documentMediaType]: updatedMedia,
    }));
    // const updatedData = await BusinessContext.fetchData(
    //   BusinessContext?.data?._id
    // );

    // // // Update the global context immediately
    // // BusinessContext.update(updatedData);
    // if (props.onUpdateData) {
    //   props.onUpdateData(updatedData);
    // }
  };

  return (
    <>
      <Modal
        {...props}
        show={props.show}
        onHide={props.handleCloseAndUpdate}
        centered
        className="file_upload_popup"
        backdrop="static"
        backdropClassName="nested-backdrop"
        enforceFocus={false} // ✅ Important when nesting modals
        keyboard={false}
      >
        <Modal.Header>
          <button
            className="custom-cancel-btn"
            onClick={props.handleCloseAndUpdate}
          >
            <img
              src={modalCloseIcon}
              alt="close-icon"
              className="ctm_img_bussine_edit_about"
            />
          </button>
        </Modal.Header>
        <Modal.Body>
          <h2 className="about_modal_bussines_heading">
            {props.headingSugested
              ? props.headingSugested
              : "Add Workplace Images"}
          </h2>
          <div className="file_upload_file_container">
            <div className={`field_wrapper`}>
              <div className={style.customdUpload_wrapper}>
                <BusinessProfileFileUpload
                  businessContext={BusinessContext.data}
                  onFileUpload={(files, state) =>
                    handleFileUpload(files, state, props?.category)
                  }
                  documentMediaType={props?.category}
                  uploadIcon={uploadIcon}
                  showFileList={false}
                  fileSize={
                    BusinessContext?.data?.subscription?.plan?.features
                      ?.fileSizeLimitMB || 100
                  }
                />
                <p className={style.error}>{error}</p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FileUpload;
