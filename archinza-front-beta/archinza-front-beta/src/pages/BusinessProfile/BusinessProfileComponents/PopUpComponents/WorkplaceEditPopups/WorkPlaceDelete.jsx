import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  addIconGallery,
  chakMarkWhite,
  checkMarkOrange,
  closeIcon,
  deleteIconBlue,
  deleteIconCircleOrange,
  eyeClose,
  gallery1,
  gallery10,
  gallery11,
  gallery12,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
  gallery9,
  menuDotsIcon,
  modalCloseIcon,
  moveIocn,
  pinIocn,
} from "../../../../../images";
import Modal from "react-bootstrap/Modal";
import "./workPlacePopup.scss";
import DeleteConfirmPopup from "../DeleteConfirmPopup/DeleteConfirmPopup";
//   import BottomSheetOptions from "./BottomSheetOptions";
import { useWindowSize } from "react-use";
import config from "../../../../../config/config";
import WorkPlaceRecentlyDeleted from "./WorkPlaceRecentlyDeleted";
import BottomSheetOptions from "../GalleryEditPopups/BottomSheetOptions";

const WorkPlaceDelete = forwardRef((props, ref) => {
  // const images = [
  //   gallery1,
  //   gallery2,
  //   gallery3,
  //   gallery4,
  //   gallery5,
  //   gallery6,
  //   gallery7,
  //   gallery8,
  //   gallery9,
  //   gallery10,
  //   gallery11,
  //   gallery12,
  // ];
  const { width } = useWindowSize();
  const [columns, setColumns] = useState(4); // Default: 4 columns
  const [showGallerypopupRecentlyDeleted, setShowGallerypopupRecentlyDeleted] =
    useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const aws_object_url = config.aws_object_url;

  const handleCheckboxToggle = (key, item) => {
    setSelectedImages((prev) => {
      if (checkedItems[key]) {
        return prev.filter((selected) => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const selectedCount = Object.values(checkedItems).filter(Boolean).length;

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth > 1200) setColumns(4);
      else if (window.innerWidth > 1024) setColumns(4);
      else if (window.innerWidth > 768) setColumns(4);
      else if (window.innerWidth > 340) setColumns(2);
      else setColumns(2);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Masonry logic: Arranging images row-wise instead of column-wise
  const createMasonryLayout = () => {
    let arranged = Array.from({ length: columns }, () => []);
    let columnHeights = Array(columns).fill(0);

    props?.categoryData?.forEach((img) => {
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      );
      arranged[shortestColumnIndex].push({
        src: `${aws_object_url}business/${img?.url}`,
        id: img._id,
        section: "workspace_media",
        name: img?.url,
      });
      columnHeights[shortestColumnIndex] += 1;
    });

    return arranged;
  };

  const handleDeleteImages = (data) => {
    props.onDeleteImages(data);
  };

  const arrangedImages = createMasonryLayout();
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const handleShowDeletePopupOpen = () => {
    setShowDeletePopup(true);
  };
  const handleShowDeletePopupClose = () => {
    // setSelectedImages([]);
    // setCheckedItems({});
    setShowDeletePopup(false);
  };
  const handleOptionsPopupOpen = () => setShowOptionsPopup(true);
  const handleOptionsPopupClose = () => setShowOptionsPopup(false);
  const handleRecentlyDeletedPopupOpen = () =>
    setShowGallerypopupRecentlyDeleted(true);
  const handleRecentlyDeletedPopupClose = () =>
    setShowGallerypopupRecentlyDeleted(false);
  useImperativeHandle(ref, () => ({
    handleShowDeletePopupClose,
    resetCheckedItems: () => {
      setSelectedImages([]);
      setCheckedItems({});
    },
  }));
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

  return (
    <>
      {width <= 768 && (
        <BottomSheetOptions
          show={showOptionsPopup}
          handleClose={handleOptionsPopupClose}
          handelOpenDelete={() => {}}
          handelOpenRecentlyDeleted={handleRecentlyDeletedPopupOpen}
          workplaceBottomSheet={true}
        />
      )}

      <DeleteConfirmPopup
        show={showDeletePopup}
        handleClose={handleShowDeletePopupClose}
        // headingSugested={"Add More Project Photos & Renders"}
        data={selectedImages}
        deleteImages={handleDeleteImages}
      />
      <WorkPlaceRecentlyDeleted
        show={showGallerypopupRecentlyDeleted}
        handleCloseDelete={handleRecentlyDeletedPopupClose}
      />
      <Modal
        {...props}
        centered
        className="Gallery_popup_modal gallery_popup_edit"
        backdropClassName="custom-backdrop-gallery-edit"
        fullscreen={true}
      >
        {/* <Modal.Header closeButton></Modal.Header> */}
        <Modal.Header>
          <button
            className="custom-cancel-btn"
            onClick={() => {
              setCheckedItems({});
              setSelectedImages([]);
              props.handleCloseDelete();
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
          <h2 className="Gallery_popup_heading d-flex align-items-center">
            Delete Workplace Images
            <div
              className="menu-wrapper"
              ref={menuRef}
              onClick={
                width <= 768
                  ? handleOptionsPopupOpen
                  : () => setIsHovered(!isHovered)
              }
            ></div>
          </h2>

          <h3 className="popup_muted_title">{selectedCount} images selected</h3>
          <div className="masonry-gallery-two">
            {arrangedImages.map((column, colIndex) => (
              <div className="masonry-column" key={colIndex}>
                {column.map((item, index) => {
                  const itemKey = `${colIndex}-${index}`;
                  const isChecked = checkedItems[itemKey];

                  return (
                    <div
                      className="masonry-item position-relative"
                      key={itemKey}
                    >
                      <img
                        src={item.src}
                        alt={`Gallery ${index}`}
                        loading="lazy"
                      />

                      <div
                        onClick={() => handleCheckboxToggle(itemKey, item)}
                        className={`${
                          isChecked
                            ? "checked check_box_ctm_popup_wraper"
                            : "check_box_ctm_popup_wraper"
                        }`}
                      >
                        {/* Hidden input just to keep HTML semantics */}
                        <input
                          type="checkbox"
                          checked={isChecked || false}
                          onChange={() => {}}
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
            ))}
          </div>

          {selectedCount > 0 && (
            <div
              className="delete_gallery_image"
              onClick={handleShowDeletePopupOpen}
            >
              <button className="delete_wrapper" disabled={selectedCount === 0}>
                <img
                  src={deleteIconBlue}
                  alt="delete"
                  className="delete_icon"
                />
                Delete {selectedCount} Images
              </button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
});

export default WorkPlaceDelete;
