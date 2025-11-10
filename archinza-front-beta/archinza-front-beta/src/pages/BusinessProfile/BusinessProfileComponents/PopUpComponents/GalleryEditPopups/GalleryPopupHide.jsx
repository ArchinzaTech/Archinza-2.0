import React, { useEffect, useRef, useState } from "react";
import {
  addIconGallery,
  chakMarkWhite,
  checkMarkOrange,
  closeIcon,
  deleteIconBlue,
  deleteIconCircleOrange,
  eyeClose,
  eyeCloseBlue,
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
  pinBlue,
  pinIocn,
} from "../../../../../images";
import Modal from "react-bootstrap/Modal";
import "./galleryPopupComn.scss";
import DeleteConfirmPopup from "../DeleteConfirmPopup/DeleteConfirmPopup";
import GalleryPopupRecentlyDeleted from "./GalleryPopupRecentlyDeleted";
import BottomSheetOptions from "./BottomSheetOptions";
import { useWindowSize } from "react-use";
import GalleryPopupMove from "./GalleryPopupMove";
import config from "../../../../../config/config";
import { toast } from "react-toastify";
import ToastMsg from "../../../../../components/ToastMsg/ToastMsg";

const GalleryPopupHide = (props) => {
  const images = [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    gallery7,
    gallery8,
    gallery9,
    gallery10,
    gallery11,
    gallery12,
  ];
  const { width } = useWindowSize();
  const [columns, setColumns] = useState(4); // Default: 4 columns
  const [showMovePopup, setShowMovePopup] = useState(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showGallerypopupDeleteVariant, setShowGallerypopupDeleteVariant] =
    useState(false);
  const [showGallerypopupRecentlyDeleted, setShowGallerypopupRecentlyDeleted] =
    useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const aws_object_url = config.aws_object_url;

  const handleCheckboxToggle = (key, item) => {
    const isCurrentlyChecked = checkedItems[key] || false;

    if (!isCurrentlyChecked) {
      if (item.pinned) {
        toast(
          <ToastMsg
            message="Unpin the image to proceed with hiding"
            danger={true}
          />,
          config.error_toast_config
        );
        return; // Silently ignore if image is hidden
      }
    }
    const updatedItem = {
      ...item,
      isHidden: !isCurrentlyChecked,
    };

    setCheckedItems((prev) => ({
      ...prev,
      [key]: !isCurrentlyChecked,
    }));

    setSelectedImages((prev) => {
      if (isCurrentlyChecked) {
        return prev.filter((selected) => selected.id !== item.id);
      }
      return [
        ...prev.filter((selected) => selected.id !== item.id),
        updatedItem,
      ];
    });
  };

  const handleHideImages = () => {
    const filteredImages =
      props?.categoryData?.data?.[props?.categoryData?.category?.key] || [];

    const hiddenImageIds = selectedImages
      .filter((img) => img.isHidden)
      .map((img) => img.id);

    const originallyHiddenImages = filteredImages
      .filter((img) => !img.visibility)
      .map((img) => img._id);

    const visibleImageIds = originallyHiddenImages.filter(
      (id) => !hiddenImageIds.includes(id)
    );

    props.onHideImages({
      hiddenImages: hiddenImageIds,
      visibleImages: visibleImageIds,
    });
  };

  useEffect(() => {
    const filteredImages =
      props?.categoryData?.data?.[props?.categoryData?.category?.key] || [];

    const initialCheckedItems = {};
    const initialSelectedImages = [];

    filteredImages.forEach((img, index) => {
      const itemKey = `image-${index}`;
      if (!img.visibility) {
        initialCheckedItems[itemKey] = true;
        initialSelectedImages.push({
          id: img._id,
          src: `${aws_object_url}business/${img?.url}`,
          isHidden: true,
        });
      }
    });

    setCheckedItems(initialCheckedItems);
    setSelectedImages(initialSelectedImages);
  }, [props.categoryData]);

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
    const filteredImages =
      props?.categoryData?.data?.[props?.categoryData?.category?.key];

    filteredImages?.forEach((img, globalIndex) => {
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      );

      const itemKey = `image-${globalIndex}`;

      arranged[shortestColumnIndex].push({
        src: `${aws_object_url}business/${img?.url}`,
        id: img._id,
        section: props?.categoryData?.category?.key,
        key: itemKey,
        visibility: img.visibility,
        pinned: img.pinned,
      });

      columnHeights[shortestColumnIndex] += 1;
    });

    return arranged;
  };

  const arrangedImages = createMasonryLayout();
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);

  const handleRecentlyDeletedPopupOpen = () =>
    setShowGallerypopupRecentlyDeleted(true);
  const handleRecentlyDeletedPopupClose = () =>
    setShowGallerypopupRecentlyDeleted(false);

  const handleGallerypopupDeleteVariantOpen = () =>
    setShowGallerypopupDeleteVariant(true);
  const handleGallerypopupDeleteVariantClose = () =>
    setShowGallerypopupDeleteVariant(false);
  const handleGallerypopupMoveOpen = () => setShowMovePopup(true);
  const handleGallerypopupMoveClose = () => setShowMovePopup(false);

  const handleOptionsPopupOpen = () => setShowOptionsPopup(true);
  const handleOptionsPopupClose = () => setShowOptionsPopup(false);
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
          handelOpenDelete={handleGallerypopupDeleteVariantOpen}
          handelOpenMove={handleGallerypopupMoveOpen}
          handelOpenRecentlyDeleted={handleRecentlyDeletedPopupOpen}
        />
      )}

      <GalleryPopupMove
        show={showMovePopup}
        handleCloseDelete={handleGallerypopupMoveClose}
      />
      <GalleryPopupRecentlyDeleted
        show={showGallerypopupRecentlyDeleted}
        handleCloseDelete={handleRecentlyDeletedPopupClose}
        selectedCount={selectedCount}
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
              const filteredImages =
                props?.categoryData?.data?.[
                  props?.categoryData?.category?.key
                ] || [];

              const initialCheckedItems = {};
              const initialSelectedImages = [];

              filteredImages.forEach((img, index) => {
                const itemKey = `image-${index}`;
                if (!img.visibility) {
                  initialCheckedItems[itemKey] = true;
                  initialSelectedImages.push({
                    id: img._id,
                    src: `${aws_object_url}business/${img?.url}`,
                    isHidden: true,
                  });
                }
              });

              setCheckedItems(initialCheckedItems);
              setSelectedImages(initialSelectedImages);
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
            Hide/Unhide {props?.categoryData?.category?.title}
            {/* <div
              className="menu-wrapper"
              ref={menuRef}
              onClick={() => setIsHovered(!isHovered)}
            >
              <div className="three-dot-icon">
                <img
                  src={menuDotsIcon}
                  alt="menu"
                  className="menu_gallery_popup_edit_icon"
                  onClick={handleOptionsPopupOpen}
                />
              </div>
              <div className={`hover-menu ${isHovered ? "show" : "hide"}`}>
                <div className="menu-item">
                  <img
                    src={deleteIconCircleOrange}
                    alt=""
                    className="menu_icon_popup"
                  />{" "}
                  Delete Images
                </div>

                <div className="menu-item">
                  <img src={eyeClose} alt="" className="menu_icon_popup" /> Hide
                  Images
                </div>
                <div className="menu-item">
                  <img src={pinIocn} alt="" className="menu_icon_popup" /> Pin
                  Images
                </div>

                <div className="menu-item">
                  <img src={moveIocn} alt="" className="menu_icon_popup" /> Move
                  Images
                </div>
                <div
                  className="menu-item border-0"
                  onClick={handleRecentlyDeletedPopupOpen}
                >
                  Recently Deleted
                </div>
              </div>
            </div> */}
          </h2>

          <h3 className="popup_muted_title">{selectedCount} images selected</h3>
          <div className="masonry-gallery-two">
            {arrangedImages.map((column, colIndex) => (
              <div className="masonry-column" key={colIndex}>
                {column.map((item, index) => {
                  const itemKey = item.key;
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
                        className={`check_box_ctm_popup_wraper ${
                          isChecked ? "checked" : ""
                        }`}
                      >
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
            <div className="delete_gallery_image" onClick={handleHideImages}>
              <div className="delete_wrapper">
                <img src={eyeCloseBlue} alt="delete" className="delete_icon" />
                Hide {selectedCount} Images
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GalleryPopupHide;
