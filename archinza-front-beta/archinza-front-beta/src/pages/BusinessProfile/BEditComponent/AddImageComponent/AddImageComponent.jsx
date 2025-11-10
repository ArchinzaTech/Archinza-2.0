import React, { useState, useMemo } from "react";
import "./addImageComponent.scss";
import { addIcon } from "../../../../images";
import FileUpload from "../../BusinessProfileComponents/PopUpComponents/FileUpload/FileUpload";
import { useBusinessContext } from "../../../../context/BusinessAccount/BusinessAccountState";

const AddImageComponent = (props) => {
  const { mainTitle = "Add Images" } = props;
  const [showFileUploadPopup, setShowFileUploadPopup] = useState(false);
  const BusinessContext = useBusinessContext();
  const handleFileUploadPopupOpen = () => {
    setShowFileUploadPopup(true);
  };
  const handleFileUploadPopupClose = () => {
    setShowFileUploadPopup(false);
  };
  const handleCloseAndUpdate = async () => {
    const updatedData = await BusinessContext.fetchData(
      BusinessContext?.data?._id
    );
    BusinessContext.update(updatedData);
    handleFileUploadPopupClose();
  };
  return (
    <>
      <FileUpload
        show={showFileUploadPopup}
        handleClose={handleFileUploadPopupClose}
        handleCloseAndUpdate={handleCloseAndUpdate}
        headingSugested={`${props.title}`}
        // data={data}
        category={props?.category?.key}
        onUpdateData={props.onUpdateData}
      />
      <div className="container_add_img_comp">
        <div
          className="addImage_comp_wrapper"
          onClick={handleFileUploadPopupOpen}
        >
          <img src={addIcon} alt="" className="addImage_comp_icon" />
          <div className="addImage_comp_heading">{mainTitle}</div>
        </div>
        <div className="addImage_comp_wrapper sm_addImage_comp_wrapper"></div>
        <div className="addImage_comp_wrapper sm_addImage_comp_wrapper"></div>
        <div className="addImage_comp_wrapper sm_addImage_comp_wrapper"></div>
        <div className="addImage_comp_wrapper sm_addImage_comp_wrapper"></div>
      </div>
    </>
  );
};

export default AddImageComponent;
