import React, { useEffect, useRef, useState } from "react";
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

const GalleryPinPopup = (props) => {
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
  const [selectedImages, setSelectedImages] = useState([]);
  const [showGallerypopupDeleteVariant, setShowGallerypopupDeleteVariant] =
    useState(false);
  const [showGallerypopupRecentlyDeleted, setShowGallerypopupRecentlyDeleted] =
    useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const aws_object_url = config.aws_object_url;

  const handleCheckboxToggle = (key, item) => {
    const isCurrentlyChecked = checkedItems[key] || false;
    const currentSelectedCount =
      Object.values(checkedItems).filter(Boolean).length;

    // Prevent checking hidden images or more than 5 images
    if (!isCurrentlyChecked) {
      if (!item.visibility) {
        toast(
          <ToastMsg
            message="Please unhide the image to pin it"
            danger={true}
          />,
          config.error_toast_config
        );
        return; // Silently ignore if image is hidden
      }
      if (currentSelectedCount >= 5) {
        toast(
          <ToastMsg
            message="You can pin a maximum of 5 images"
            danger={true}
          />,
          config.error_toast_config
        );
        return; // Show toast and ignore if max 5 images reached
      }
    }

    const updatedItem = {
      ...item,
      isPinned: !isCurrentlyChecked,
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

  const handlePinImages = () => {
    const selectedCount = Object.values(checkedItems).filter(Boolean).length;

    // Check if exactly 5 images are selected
    if (selectedCount !== 5) {
      toast(
        <ToastMsg
          message="Please select exactly 5 images to pin"
          danger={true}
        />,
        config.error_toast_config
      );
      return;
    }

    const filteredImages =
      props?.categoryData?.data?.[props?.categoryData?.category?.key] || [];

    // Get IDs of currently pinned images (checked)
    const pinnedImageIds = selectedImages
      .filter((img) => img.isPinned)
      .map((img) => img.id);

    // Get IDs of images that were originally pinned but are now unchecked
    const originallyPinnedImages = filteredImages
      .filter((img) => img.pinned)
      .map((img) => img._id);

    const unpinnedImageIds = originallyPinnedImages.filter(
      (id) => !pinnedImageIds.includes(id)
    );

    // Include newly unpinned images (those that were pinned but are now unchecked)
    props.onPinImages({
      pinnedImages: pinnedImageIds,
      unpinnedImages: unpinnedImageIds,
    });

    // Close the modal after pinning
    props.handleCloseDelete();
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
    const filteredImages =
      props?.categoryData?.data?.[props?.categoryData?.category?.key];

    filteredImages?.forEach((img, globalIndex) => {
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      );

      // Use globalIndex for unique key
      const itemKey = `image-${globalIndex}`;

      arranged[shortestColumnIndex].push({
        src: `${aws_object_url}business/${img?.url}`,
        id: img._id,
        section: props?.categoryData?.category?.key,
        key: itemKey,
        pinned: img.pinned,
        visibility: img.visibility,
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
  const handleGallerypopupMoveOpen = () => setShowMovePopup(true);
  const handleGallerypopupMoveClose = () => setShowMovePopup(false);

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

  // Initial state setup for pre-selected pinned images
  useEffect(() => {
    const filteredImages =
      props?.categoryData?.data?.[props?.categoryData?.category?.key] || [];

    const initialCheckedItems = {};
    const initialSelectedImages = [];

    filteredImages.forEach((img, index) => {
      const itemKey = `image-${index}`;
      if (img.pinned) {
        initialCheckedItems[itemKey] = true;
        initialSelectedImages.push({
          id: img._id,
          src: `${aws_object_url}business/${img?.url}`,
          isPinned: true,
        });
      }
    });

    setCheckedItems(initialCheckedItems);
    setSelectedImages(initialSelectedImages);
  }, [props.categoryData]);

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
        <Modal.Header>
          <button
            className="custom-cancel-btn"
            onClick={() => {
              const filteredImages =
                props?.categoryData?.data?.[
                  props?.categoryData?.category?.key
                ] || [];

              // Reset to only pre-selected (pinned) images
              const initialCheckedItems = {};
              const initialSelectedImages = [];

              filteredImages.forEach((img, index) => {
                const itemKey = `image-${index}`;
                if (img.pinned) {
                  initialCheckedItems[itemKey] = true;
                  initialSelectedImages.push({
                    id: img._id,
                    src: `${aws_object_url}business/${img?.url}`,
                    isPinned: true,
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
            Pin {props?.categoryData?.category?.title}
          </h2>

          <h3 className="popup_muted_title">
            {selectedCount} images selected{" "}
            {selectedCount !== 5 && "(Please select exactly 5 images)"}
          </h3>
          <div className="masonry-gallery-two">
            {arrangedImages.map((column, colIndex) => (
              <div className="masonry-column" key={colIndex}>
                {column.map((item, index) => {
                  const itemKey = item.key; // Use the key from the item
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
                        className={item.visibility ? "" : "opacity-40"}
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

          {selectedCount === 5 && (
            <div
              className={`delete_gallery_image ${
                selectedCount !== 5 ? "disabled-btn" : ""
              }`}
              onClick={handlePinImages}
            >
              <div className="delete_wrapper">
                <img src={pinBlue} alt="pin" className="delete_icon" />
                Pin {selectedCount} Images
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GalleryPinPopup;
