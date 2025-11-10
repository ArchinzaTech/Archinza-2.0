import React, { useEffect, useState } from "react";
import "./GalleryPopup.scss";
import Modal from "react-bootstrap/Modal";
import {
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
  modalCloseIcon,
} from "../../../../../images";
import config from "../../../../../config/config";

const GalleryPopupView = (props) => {
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
    // "https://images.pexels.com/photos/31087915/pexels-photo-31087915/free-photo-of-lush-green-terraced-rice-fields-in-mountainous-landscape.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  ];

  const [columns, setColumns] = useState(4); // Default: 4 columns
  const { categoryData } = props;
  const imageUrl = config.aws_object_url + "business/";

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth > 1200) setColumns(4);
      else if (window.innerWidth > 768) setColumns(3);
      else if (window.innerWidth > 340) setColumns(2);
      else setColumns(1);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Masonry logic: Arranging images row-wise instead of column-wise
  const createMasonryLayout = () => {
    let arranged = Array.from({ length: columns }, () => []);
    categoryData?.data?.forEach((img, i) => {
      arranged[i % columns].push(`${imageUrl}${img.url}`);
    });
    return arranged;
  };

  const arrangedImages = createMasonryLayout();
  return (
    <>
      <Modal
        {...props}
        centered
        className="Gallery_popup_modal"
        backdropClassName="custom-backdrop"
        fullscreen={true}
      >
        {/* <Modal.Header closeButton></Modal.Header> */}
        <Modal.Header>
          <button className="custom-cancel-btn" onClick={props.handleClose}>
            <img
              src={modalCloseIcon}
              alt="close-icon"
              className="ctm_img_bussine_edit_about"
            />
          </button>
        </Modal.Header>
        <Modal.Body>
          <h2 className="Gallery_popup_heading">{categoryData?.title || ""}</h2>
          <div className="masonry-gallery">
            {arrangedImages.map((column, colIndex) => (
              <div className="masonry-column" key={colIndex}>
                {column.map((src, index) => (
                  <div className="masonry-item" key={index}>
                    <img src={src} alt={`Gallery ${index}`} loading="lazy" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GalleryPopupView;
