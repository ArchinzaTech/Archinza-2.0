import React, { useEffect, useState } from "react";
import "./moveImagePopup.scss";
import Modal from "react-bootstrap/Modal";
import {
  chakMarkWhite,
  FolderBlackIcon,
  modalCloseIcon,
} from "../../../../../images";

const MoveImagePopup = (props) => {
  const FolderData = [
    {
      id: 1,
      folderName: "Project Photos & Renders",
      key: "project_renders_media",
    },
    {
      id: 2,
      folderName: "Products | Materials",
      key: "completed_products_media",
    },
    {
      id: 3,
      folderName: "Sites In Progress",
      key: "sites_inprogress_media",
    },
  ];

  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isMoveClicked, setIsMoveClicked] = useState(false);

  const handleRadioToggle = (id) => {
    setSelectedFolderId((prevId) => (prevId === id ? null : id));
    setIsMoveClicked(false);
  };

  const handleMoveImages = () => {
    setIsMoveClicked(true); // Mark button as clicked
    if (selectedFolderId !== null) {
      const selectedFolder = FolderData.find(
        (folder) => folder.id === selectedFolderId
      );
      console.log(selectedFolder);
      props.onMoveImages(selectedFolder, props?.selectedImages);
      // props.handleClose();
    }
  };

  useEffect(() => {
    const availableFolders = FolderData.filter(
      (data) => data.key !== props?.categoryData?.category?.key
    );
    if (availableFolders.length > 0) {
      setSelectedFolderId(availableFolders[0].id);
      setIsMoveClicked(false);
    }
  }, [props?.categoryData?.category?.key]);

  return (
    <>
      <Modal
        {...props}
        centered
        className="file_upload_popup Modal_move_img"
        backdrop="static"
        backdropClassName="nested-backdrop"
        enforceFocus={false} // ✅ Important when nesting modals
        keyboard={false}
      >
        <Modal.Header>
          <button
            className="custom-cancel-btn"
            onClick={() => {
              const availableFolders = FolderData.filter(
                (data) => data.key !== props?.categoryData?.category?.key
              );
              if (availableFolders.length > 0) {
                setSelectedFolderId(availableFolders[0].id);
              } else {
                setSelectedFolderId(null);
              }
              setIsMoveClicked(false);
              props.handleClose();
            }}
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
            Are You Sure You Want To Move {props.selectedImages?.length || 0}{" "}
            {props.selectedImages?.length === 1 ? "Image" : "Images"}
          </h2>

          <div className="muted_title_move">
            Current Location : {props?.categoryData?.category?.title}
          </div>

          <div className="folder_loation_selceton_conatiner">
            {FolderData.filter(
              (data) => data.key !== props?.categoryData?.category?.key
            ).map((data) => {
              const isChecked = selectedFolderId === data.id;

              return (
                <div className="folder_loation_selceton_wrapper" key={data.id}>
                  <div className="folder_loaction_image">
                    <img
                      src={FolderBlackIcon}
                      alt="Folder"
                      className="folder_icon_move"
                    />
                    {data.folderName}
                  </div>

                  <div
                    onClick={() => handleRadioToggle(data.id)}
                    className={`${
                      isChecked
                        ? "checked check_box_ctm_popup_wraper check_box_move_checked"
                        : "check_box_ctm_popup_wraper check_box_move"
                    }`}
                  >
                    <input
                      type="radio"
                      name="folderSelection"
                      checked={isChecked}
                      readOnly
                      className="hiden_ip_ctm_popup"
                    />

                    {isChecked && (
                      <img
                        src={chakMarkWhite}
                        alt="Checkmark"
                        className="chek_mark_ctm_popup"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="delete_confirmation_actions_btn_group">
            <button
              className="cmn_styling_delete_confm_btn move_submit_btn"
              onClick={handleMoveImages}
            >
              Move Images
            </button>
          </div>
          {selectedFolderId === null && isMoveClicked && (
            <div className="move_instruction">
              Select a location to move the images
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MoveImagePopup;
