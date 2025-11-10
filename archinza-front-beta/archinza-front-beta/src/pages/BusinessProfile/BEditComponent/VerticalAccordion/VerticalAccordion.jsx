import React, { useEffect, useState } from "react";
import "./verticalAccordion.scss";
import { BeditProfileData } from "../../../../components/Data/bEditData";
import { editIconBlue } from "../../../../images";
import { Link } from "react-router-dom";

const VerticalAccordion = ({
  isActive,
  isSubtabActive,
  galleryData,
  editIcon,
}) => {
  const [selectedIndex, setSelectedIndex] = useState({});
  const [overlay, setOverlay] = useState(true);
  const handleItemHover = (galIndex, imgIndex) => {
    setSelectedIndex((prev) => ({
      ...prev,
      [galIndex]: imgIndex, // Maintain separate hover states per gallery_wrapper
    }));
  };

  // 🟢 Set first vaccordion_list active initially for each gallery_wrapper
  useEffect(() => {
    const defaultSelection = {};
    galleryData[isActive]?.subTab?.forEach((data, index) => {
      if (data?.gallery) {
        data.gallery.forEach((_, galIndex) => {
          defaultSelection[`${index}-${galIndex}`] = 0; // First image active by default
        });
      }
    });
    setSelectedIndex(defaultSelection);
  }, [isActive]);

  return (
    <>
      <div className="my_container">
        {galleryData[isActive]?.subTab?.map(
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
                          <Link to={() => false} className="bedit_common_cta">
                            {galdata?.ctaText}
                          </Link>
                        </div>
                      </div>
                      <div className={`vaccodion_container`}>
                      {overlay && (
                    <div className="overlay_vertical_acoordian"></div>
                  )}
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
        )}
      </div>
    </>
  );
};

export default VerticalAccordion;
