import React, { useEffect, useState } from "react";
import { editIconBlue } from "../../../../images";
import { Link } from "react-router-dom";
import GalleryPopupView from "../../BusinessProfileComponents/BusinessViewPopups/GalleryPopupView/GalleryPopupView";
import config from "../../../../config/config";
import GalleryPopupDemo from "../../BusinessProfileComponents/BusinessViewPopups/GalleryPopupDemo/GalleryPopupDemo";

const galleryTitles = [
  { key: "project_renders_media", title: "Project Photos & Renders" },
  { key: "completed_products_media", title: "Products | Materials" },
  { key: "sites_inprogress_media", title: "Sites In Progress" },
  // { key: "eliminate_media", title: "Eliminate Media" },
  // { key: "other_media", title: "Other Media" },
];
const VerticalAccodianView = ({
  isActive,
  isSubtabActive,
  galleryData,
  editIcon,
}) => {
  const [selectedIndex, setSelectedIndex] = useState({});
  const imageUrl = config.aws_object_url + "business/";

  const handleItemHover = (galIndex, imgIndex) => {
    setSelectedIndex((prev) => ({
      ...prev,
      [galIndex]: imgIndex, // Maintain separate hover states per gallery_wrapper
    }));
  };

  // 🟢 Set first vaccordion_list active initially for each gallery_wrapper
  // useEffect(() => {
  //   const defaultSelection = {};
  //   galleryData[isActive]?.subTab?.forEach((data, index) => {
  //     if (data?.gallery) {
  //       data.gallery.forEach((_, galIndex) => {
  //         defaultSelection[`${index}-${galIndex}`] = 0; // First image active by default
  //       });
  //     }
  //   });
  //   setSelectedIndex(defaultSelection);
  // }, [isActive]);
  useEffect(() => {
    const defaultSelection = {};
    galleryTitles.forEach((title, index) => {
      if (
        galleryData &&
        galleryData[title.key] &&
        galleryData[title.key].length > 0
      ) {
        defaultSelection[title.key] = 0;
      }
    });

    setSelectedIndex(defaultSelection);
  }, [galleryData]);

  const [isGalleryPopupView, setIsGalleryPopupView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleShow = (category) => {
    const selectedCategoryData = galleryData?.[category.key] || [];
    setSelectedCategory({
      key: category.key,
      title: category.title,
      data: selectedCategoryData,
    });
    // setIsGalleryPopupView(true);
    setIsGalleryPopupDemo(true);
  };
  const handleHide = () => {
    setIsGalleryPopupView(false);
    setSelectedCategory(null);
  };

  const [isGalleryPopupDemo, setIsGalleryPopupDemo] = useState(false);
  const handleShowGalleryDemo = (category) => {
    const selectedCategoryData = galleryData?.[category.key] || [];
    setSelectedCategory({
      key: category.key,
      title: category.title,
      data: selectedCategoryData,
    });
    setIsGalleryPopupDemo(true);
  };
  const handleHideGalleryDemo = () => {
    setIsGalleryPopupDemo(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <GalleryPopupView
        show={isGalleryPopupView}
        onHide={() => setIsGalleryPopupView(false)}
        handleClose={handleHide}
        categoryData={selectedCategory}
      />
      <GalleryPopupDemo
        show={isGalleryPopupDemo}
        onHide={() => setIsGalleryPopupDemo(false)}
        handleClose={handleHideGalleryDemo}
        categoryData={selectedCategory}
      />
      <div className="my_container">
        {/* {galleryData[isActive]?.subTab?.map(
          (data, index) =>
            data?.gallery && (
              <div
                className={`gallery_container ${
                  isSubtabActive === index ? "active" : ""
                }`}
                key={index}
              >
                {data?.gallery?.map((galdata, galIndex) => {
                  const galleryKey = `${index}-${galIndex}`;
                  return (
                    <div className="gallery_wrapper" key={galIndex}>
                      <div className="cta_container">
                        <h2 className="title">{galdata?.title}</h2>
                        <div className="cta_wrapper">
                          {editIcon && (
                            <img
                              src={editIconBlue}
                              alt="edit icon"
                              className="edit_icon"
                            />
                          )}
                          <Link
                            to={() => false}
                            className="bedit_common_cta"
                            onClick={handleShow}
                          >
                            {galdata?.ctaText}
                          </Link>
                        </div>
                      </div>
                      <div className={`vaccodion_container`}>
                        <ul className="vaccordion_list_wrapper">
                          {galdata?.galleryImages?.map((gallery, imgIndex) => {
                            const isSelected =
                              // selectedIndex[galIndex] === imgIndex;
                              selectedIndex[galleryKey] === imgIndex;
                            return (
                              <li
                                key={index}
                                className={`vaccordion_list ${
                                  isSelected ? "selected" : ""
                                }`}
                                onMouseOver={() =>
                                  handleItemHover(galleryKey, imgIndex)
                                }
                                // onMouseOut={()=>setSelectedIndex({})}
                              >
                                <img
                                  src={gallery.img}
                                  alt={gallery.alt}
                                  className="bg_img"
                                />
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
        )} */}
        <div className={`gallery_container active`}>
          {galleryTitles.map((category, categoryIndex) => {
            const categoryImages = galleryData?.[category.key] || [];
            const pinnedImages =
              categoryImages?.filter((it) => it.pinned === true) || [];
            // if (categoryImages.length === 0) {
            //   return null; // Don't render this category if no images
            // }

            return (
              <div className="gallery_wrapper" key={categoryIndex}>
                {categoryImages.length > 0 && (
                  <>
                    <div className="cta_container">
                      <h2 className="title" onClick={handleShowGalleryDemo}>
                        {category.title}
                      </h2>
                      <div className="cta_wrapper p-0">
                        {editIcon && (
                          <img
                            src={editIconBlue}
                            alt="edit icon"
                            className="edit_icon"
                          />
                        )}
                        {categoryImages?.length > 1 && (
                          <Link
                            to={() => false}
                            className="bedit_common_cta"
                            onClick={() => handleShow(category)}
                          >
                            View More
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className={`vaccodion_container`}>
                      <ul className="vaccordion_list_wrapper">
                        {(pinnedImages.length > 0
                          ? [
                              ...pinnedImages,
                              ...categoryImages.filter(
                                (img) => !img.pinned && !img.visibility
                              ),
                            ]
                          : categoryImages?.filter((img) => img.visibility)
                        )
                          .slice(0, 5)
                          ?.map((image, imgIndex) => {
                            const isSelected =
                              // selectedIndex[galIndex] === imgIndex;
                              selectedIndex[category.key] === imgIndex;
                            return (
                              <li
                                key={imgIndex}
                                className={`vaccordion_list ${
                                  isSelected ? "selected" : ""
                                }`}
                                onMouseOver={() =>
                                  handleItemHover(category.key, imgIndex)
                                }
                                // onMouseOut={()=>setSelectedIndex({})}
                              >
                                <img
                                  src={`${imageUrl}${image.url}`}
                                  // src={images.businessGallery00.image}
                                  alt={image.name}
                                  className="bg_img"
                                />
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default VerticalAccodianView;
