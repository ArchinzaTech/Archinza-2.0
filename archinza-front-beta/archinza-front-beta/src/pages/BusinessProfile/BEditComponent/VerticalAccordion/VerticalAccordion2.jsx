import React, { useEffect, useState } from "react";
import "./verticalAccordion.scss";
import { BeditProfileData } from "../../../../components/Data/bEditData";
import { editIconBlue, images } from "../../../../images";
import { Link } from "react-router-dom";
import config from "../../../../config/config";
import LoadingStateComp from "../LoadingStateComp/LoadingStateComp";
import GalleryEditPopupDefault from "../../BusinessProfileComponents/PopUpComponents/GalleryEditPopups/GalleryEditPopupDefault";
import GalleryEditPopupDefaultV2 from "../../BusinessProfileComponents/PopUpComponents/GalleryEditPopups/GalleryEditPopupDefaultV2";
import AddImageComponent from "../AddImageComponent/AddImageComponent";
import LongPressGalleryPopup from "../../BusinessProfileComponents/PopUpComponents/GalleryEditPopups/LongPressGalleryPopup";
import { useWindowSize } from "react-use";

const galleryTitles = [
  { key: "project_renders_media", title: "Project Photos & Renders" },
  { key: "completed_products_media", title: "Products | Materials" },
  { key: "sites_inprogress_media", title: "Sites In Progress" },
];
const VerticalAccordion2 = ({
  isActive,
  isSubtabActive,
  galleryData,
  setOverlayActive,
  contentLoaded,
  isInitialLoad,
  // isScrapingContent,
  // scrapingError,
}) => {
  const [selectedIndex, setSelectedIndex] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const imageUrl = config.aws_object_url + "business/";
  const handleItemHover = (galIndex, imgIndex) => {
    setSelectedIndex((prev) => ({
      ...prev,
      [galIndex]: imgIndex, // Maintain separate hover states per gallery_wrapper
    }));
  };
  const { width } = useWindowSize();

  const getProperImageUrl = (url) => {
    if (url?.startsWith("http://") || url?.startsWith("https://")) {
      return url;
    }
    return `${imageUrl}${url}`;
  };

  useEffect(() => {
    const defaultSelection = {};
    galleryTitles.forEach((title, index) => {
      if (
        galleryData &&
        galleryData[title.key] &&
        galleryData[title.key].length > 0
      ) {
        defaultSelection[title.key] = 0; // First image active by default
      }
    });

    setSelectedIndex(defaultSelection);
  }, [galleryData]);

  useEffect(() => {
    galleryTitles.forEach((title) => {
      if (
        galleryData &&
        galleryData[title.key] &&
        galleryData[title.key].length > 0 &&
        (selectedIndex[title.key] === undefined ||
          selectedIndex[title.key] >= galleryData[title.key].length)
      ) {
        setSelectedIndex((prev) => ({
          ...prev,
          [title.key]: 0,
        }));
      }
    });
  }, [galleryData]);

  const [showPopup, setShowPopup] = useState(false);
  const [showPopupLongPress, setShowPopupLongPress] = useState(false);
  const handlePopupOpen = (category) => {
    setSelectedCategory({ category, data: galleryData });
    setShowPopup(true);
  };
  const handlePopupClose = () => setShowPopup(false);
  const handlePopupOpenLongPress = (category) => {
    setSelectedCategory({ category, data: galleryData });
    setShowPopupLongPress(true);
  };
  const handlePopupCloseLongPress = () => setShowPopupLongPress(false);
  return (
    <>
      {/* <GalleryEditPopupDefaultV2
        show={showPopup}
        onHide={() => handlePopupClose(false)}
        handleClose={handlePopupClose}
        categoryData={selectedCategory}
      /> */}
      <GalleryEditPopupDefault
        show={showPopup}
        onHide={() => handlePopupClose(false)}
        handleClose={handlePopupClose}
        categoryData={selectedCategory}
      />
      <LongPressGalleryPopup
        show={showPopupLongPress}
        onHide={() => handlePopupClose(false)}
        handleClose={handlePopupCloseLongPress}
        categoryData={selectedCategory}
      />
      <div className="my_container">
        <div className={`gallery_container active`}>
          {galleryTitles.map((category, categoryIndex) => {
            const categoryImages = galleryData?.[category.key] || [];
            const pinnedImages =
              categoryImages?.filter((it) => it.pinned === true) || [];
            const hasScrapedContent =
              galleryData?.last_updated_scraped_content != null;
            return (
              <div className="gallery_wrapper" key={categoryIndex}>
                <div className="cta_container">
                  <h2 className="title">{category.title}</h2>
                  {((hasScrapedContent && categoryImages.length === 0) ||
                    categoryImages.length > 0) && (
                    <div
                      className="cta_wrapper p-0"
                      onClick={() => handlePopupOpen(category)}
                    >
                      <img
                        src={editIconBlue}
                        alt="edit icon"
                        className="edit_icon"
                      />
                      <Link to={() => false} className="bedit_common_cta">
                        Edit | View
                      </Link>
                    </div>
                  )}
                </div>
                {/* commenting this because we have to disable scraping  */}
                {/* Case 1: Still scraping content (show loading with first message) */}
                {/* {contentLoaded && !hasScrapedContent && (
                  <LoadingStateComp message="Your Visuals Are On The Way, Pixel By Pixel. Almost There…" />
                )} */}

                {/* Case 2: Scraping failed or taking too long */}
                {/* {hasScrapedContent && categoryImages.length === 0 && (
                  <LoadingStateComp
                    message={`This is taking longer than expected. ${
                      width < 767 ? "\n" : ""
                    } You can try again shortly.`}
                    isError={true}
                  />
                )} */}

                {/* Case 3: Scraping complete but no images */}
                {/* {hasScrapedContent && categoryImages.length === 0 && (
                  <AddImageComponent
                    title={category.title}
                    category={category}
                  />
                )} */}
                { categoryImages.length === 0 && (
                  <AddImageComponent
                    title={category.title}
                    category={category}
                  />
                )}

                {/* Case 4: Has images */}
                {categoryImages.length > 0 && (
                  <div className={`vaccodion_container`}>
                    {!setOverlayActive && (
                      <div className="overlay_vertical_acoordian"></div>
                    )}
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
                        .map((image, imgIndex) => {
                          const isSelected =
                            selectedIndex[category.key] === imgIndex;
                          return (
                            <li
                              key={`${image.url}-${imgIndex}`}
                              className={`vaccordion_list ${
                                isSelected ? "selected" : ""
                              }`}
                              onMouseOver={() =>
                                handleItemHover(category.key, imgIndex)
                              }
                            >
                              <img
                                src={getProperImageUrl(image.url)}
                                alt={image.name || `Image ${imgIndex + 1}`}
                                className="bg_img"
                              />
                            </li>
                          );
                        })}{" "}
                    </ul>
                  </div>
                )}
              </div>
            );
            // if (hasScrapedContent && categoryImages.length === 0) {
            //   return (
            //     <div className="gallery_wrapper" key={categoryIndex}>
            //       <div className="cta_container">
            //         <h2 className="title">{category.title}</h2>
            //         <div
            //           className="cta_wrapper p-0"
            //           onClick={() => handlePopupOpen(category)}
            //         >
            //           <img
            //             src={editIconBlue}
            //             alt="edit icon"
            //             className="edit_icon"
            //           />
            //           <Link to={() => false} className="bedit_common_cta">
            //             Edit | View
            //           </Link>
            //         </div>
            //       </div>
            //       {/* Render Empty State */}
            //       <AddImageComponent
            //         title={category.title}
            //         category={category}
            //       />
            //       {/* <div className="empty_state">No images available</div> */}
            //     </div>
            //   );
            // }

            // if (
            //   (hasScrapedContent || categoryImages.length > 0) &&
            //   categoryImages.length > 0
            // ) {
            //   return (
            //     <div className="gallery_wrapper" key={categoryIndex}>
            //       <div className="cta_container">
            //         <h2
            //           className="title"
            //           onClick={() => handlePopupOpenLongPress(category)}
            //         >
            //           {category.title}
            //         </h2>
            //         <div
            //           className="cta_wrapper p-0"
            //           onClick={() => handlePopupOpen(category)}
            //         >
            //           <img
            //             src={editIconBlue}
            //             alt="edit icon"
            //             className="edit_icon"
            //           />
            //           <Link to={() => false} className="bedit_common_cta">
            //             Edit | View
            //           </Link>
            //         </div>
            //       </div>
            //       <div className={`vaccodion_container`}>
            //         {!setOverlayActive && (
            //           <div className="overlay_vertical_acoordian"></div>
            //         )}
            //         <ul className="vaccordion_list_wrapper">
            //           {(pinnedImages.length > 0
            //             ? [
            //                 ...pinnedImages,
            //                 ...categoryImages.filter((img) => !img.pinned),
            //               ]
            //             : categoryImages
            //           )
            //             .slice(0, 5)
            //             .map((image, imgIndex) => {
            //               const isSelected =
            //                 selectedIndex[category.key] === imgIndex;
            //               return (
            //                 <li
            //                   key={`${image.url}-${imgIndex}`}
            //                   className={`vaccordion_list ${
            //                     isSelected ? "selected" : ""
            //                   }`}
            //                   onMouseOver={() =>
            //                     handleItemHover(category.key, imgIndex)
            //                   }
            //                 >
            //                   <img
            //                     src={getProperImageUrl(image.url)}
            //                     alt={image.name || `Image ${imgIndex + 1}`}
            //                     className="bg_img"
            //                   />
            //                 </li>
            //               );
            //             })}
            //         </ul>
            //       </div>
            //     </div>
            //   );
            // }

            // if (
            //   // !hasScrapedContent &&
            //   categoryImages.length === 0 //&&
            //   // contentLoaded
            // ) {
            //   return (
            //     <div className="gallery_wrapper" key={categoryIndex}>
            //       <div className="cta_container">
            //         <h2 className="title">{category.title}</h2>
            //         <div
            //           className="cta_wrapper p-0"
            //           onClick={() => handlePopupOpen(category)}
            //         >
            //           <img
            //             src={editIconBlue}
            //             alt="edit icon"
            //             className="edit_icon"
            //           />
            //           <Link to={() => false} className="bedit_common_cta">
            //             Edit | View
            //           </Link>
            //         </div>
            //       </div>
            //       {/* Render Loading State */}
            //       {/* <LoadingStateComp /> */}
            //       <AddImageComponent
            //         title={category.title}
            //         category={category}
            //       />
            //     </div>
            //   );
            // }

            // return null;
          })}
        </div>
      </div>
    </>
  );
};

export default VerticalAccordion2;
