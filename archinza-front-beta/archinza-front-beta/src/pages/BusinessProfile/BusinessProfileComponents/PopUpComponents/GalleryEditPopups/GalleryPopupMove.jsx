import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
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
  moveIconWhitBlue,
  moveIocn,
  pinIocn,
} from "../../../../../images";
import Modal from "react-bootstrap/Modal";
import "./galleryPopupComn.scss";
import DeleteConfirmPopup from "../DeleteConfirmPopup/DeleteConfirmPopup";
import GalleryPopupRecentlyDeleted from "./GalleryPopupRecentlyDeleted";
import MoveImagePopup from "../MoveImagePopup/MoveImagePopup";
import { useWindowSize } from "react-use";
import BottomSheetOptions from "./BottomSheetOptions";
import GallerypopupDeleteVariant from "./GallerypopupDeleteVariant";
import config from "../../../../../config/config";

const GalleryPopupMove = forwardRef((props, ref) => {
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
    // "https://images.pexels.com/photos/31214765/pexels-photo-31214765/free-photo-of-dramatic-cliffs-along-the-coast-of-wakayama-japan.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    // "https://images.pexels.com/photos/951076/pexels-photo-951076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    // "https://images.pexels.com/photos/951076/pexels-photo-951076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    // "https://images.pexels.com/photos/15568759/pexels-photo-15568759/free-photo-of-bird-among-spring-blossoms-on-tree.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    // "https://images.pexels.com/photos/31314773/pexels-photo-31314773/free-photo-of-homemade-baking-in-a-traditional-mexican-kitchen.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    // "https://images.pexels.com/photos/31314773/pexels-photo-31314773/free-photo-of-homemade-baking-in-a-traditional-mexican-kitchen.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    // "https://images.pexels.com/photos/20257362/pexels-photo-20257362/free-photo-of-back-view-of-a-deer-with-antlers-in-a-forest.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    // "https://images.pexels.com/photos/31087915/pexels-photo-31087915/free-photo-of-lush-green-terraced-rice-fields-in-mountainous-landscape.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    // gallery1,
    // "https://images.pexels.com/photos/31214765/pexels-photo-31214765/free-photo-of-dramatic-cliffs-along-the-coast-of-wakayama-japan.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    // gallery3,
    // gallery4,
    // gallery1,
    // gallery7,
    // "https://images.pexels.com/photos/31214765/pexels-photo-31214765/free-photo-of-dramatic-cliffs-along-the-coast-of-wakayama-japan.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    // "https://images.pexels.com/photos/31214765/pexels-photo-31214765/free-photo-of-dramatic-cliffs-along-the-coast-of-wakayama-japan.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  ];
  const { width } = useWindowSize();
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [columns, setColumns] = useState(4); // Default: 4 columns
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);

  const aws_object_url = config.aws_object_url;

  const [showMovePopup, setShowMovePopup] = useState(false);
  const [showGallerypopupDeleteVariant, setShowGallerypopupDeleteVariant] =
    useState(false);

  const [showGallerypopupRecentlyDeleted, setShowGallerypopupRecentlyDeleted] =
    useState(false);

  const handleCheckboxToggle = (key, item) => {
    const isCurrentlyChecked = checkedItems[key] || false;

    setCheckedItems((prev) => ({
      ...prev,
      [key]: !isCurrentlyChecked,
    }));

    setSelectedImages((prev) => {
      if (isCurrentlyChecked) {
        return prev.filter((selected) => selected.id !== item.id);
      }
      return [...prev.filter((selected) => selected.id !== item.id), item];
    });
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

  const handleMoveImages = (selectedFolder, selectedImages) => {
    props.onMoveImages(selectedFolder, selectedImages);
  };

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
      });

      columnHeights[shortestColumnIndex] += 1;
    });

    return arranged;
  };

  const arrangedImages = createMasonryLayout();
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const handleShowDeletePopupOpen = () => setShowDeletePopup(true);

  const handleShowDeletePopupClose = () => setShowDeletePopup(false);
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
  useImperativeHandle(ref, () => ({
    handleShowDeletePopupClose,
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
          handelOpenDelete={handleGallerypopupDeleteVariantOpen}
          handelOpenRecentlyDeleted={handleRecentlyDeletedPopupOpen}
        />
      )}
      <MoveImagePopup
        show={showDeletePopup}
        handleClose={handleShowDeletePopupClose}
        selectedCount={selectedCount}
        categoryData={props?.categoryData}
        onMoveImages={handleMoveImages}
        selectedImages={selectedImages}
      />
      {/* <GallerypopupDeleteVariant
        show={showGallerypopupDeleteVariant}
        handleCloseDelete={handleGallerypopupDeleteVariantClose}
      /> */}

      <GalleryPopupRecentlyDeleted
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
            Move {props?.categoryData?.category?.title}
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
              <div className="delete_wrapper">
                <img
                  src={moveIconWhitBlue}
                  alt="delete"
                  className="delete_icon"
                />
                Move {selectedCount} Images
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
});

export default GalleryPopupMove;
