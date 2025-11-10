import React, { useState } from "react";
import "./addPdfComponent.scss";
import { addIcon } from "../../../../images";
import FileUpload from "../../BusinessProfileComponents/PopUpComponents/FileUpload/FileUpload";
import { useBusinessContext } from "../../../../context/BusinessAccount/BusinessAccountState";

const AddPdfComponent = (props) => {
  const { mainTitle = "Add Images" } = props;
  const BusinessContext = useBusinessContext();
  const [showFileUploadPopup, setShowFileUploadPopup] = useState(false);
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
      <div className="container_add_img_comp p-0">
        <div
          className="addImage_comp_wrapper"
          style={{
            flex: "0.4 0",
          }}
          onClick={handleFileUploadPopupOpen}
        >
          <img src={addIcon} alt="" className="addImage_comp_icon" />
          <div className="addImage_comp_heading">{mainTitle}</div>
        </div>
      </div>
    </>
  );
};

export default AddPdfComponent;
