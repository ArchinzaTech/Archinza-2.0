import React, { useState } from "react";
import "./overView.scss";
import {
  BeditOverviewData,
} from "../../../../components/Data/bEditData";
import RadioButton from "../../../../components/RadioButton/RadioButton";
import { editIconBlue, orangeRightTick } from "../../../../images";
import { Link } from "react-router-dom";
import AboutPopUp from "../../BusinessProfileComponents/PopUpComponents/AboutPopUp/AboutPopUp";

const OverView = ({ isActive, isSubtabActive, ctaText, editIcon }) => {
  const [isAboutModal, setIsAboutModal] = useState(false);
  const handleShow = () => setIsAboutModal(true);
  const handleHide = () => setIsAboutModal(false);

  return (
    <>
      <div className="profile_overview_container">
        <div className="my_container p-0">
          <div className="overview_container">
            {/* {BeditProfileData[isActive]?.subTab?.map( */}
            {BeditOverviewData.map(
              (data, index) =>
                data?.about && (
                  <div
                    className={`data_container ${
                      isSubtabActive === index ? "active" : ""
                    }`}
                    key={index}
                  >
                    {data?.about?.map((about, i) => (
                      <div className={`about_container`} key={`about-${i}`}>
                        <div className="text_container">
                          <div className="cta_container">
                            <h2 className="title">{about.title}</h2>
                            <div className="cta_wrapper" onClick={handleShow}>
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
                              >
                                {ctaText}
                              </Link>
                            </div>
                          </div>
                          {about?.desc?.map((item, i) => (
                            <p
                              className="desc"
                              dangerouslySetInnerHTML={{ __html: item }}
                              key={i}
                            ></p>
                          ))}
                        </div>
                      </div>
                    ))}
                    {data?.products?.map((product, i) => (
                      <div className="product_container" key={`product-${i}`}>
                        <h2 className="sub_title">{product.title}</h2>
                        <ul className="list_wrapper ul_wr_radio">
                          {product?.radioField?.map((radio, index) => (
                            <RadioButton
                              label={radio}
                              labelId={`radio-${index}`}
                              lightTheme
                              className={"test"}
                              key={`radio-${index}`}
                            ></RadioButton>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {data?.focus?.map((data, i) => (
                      <div className="focus_container" key={`focus-${i}`}>
                        <div className="cta_container">
                          <h2 className="title">{data.title}</h2>
                          <div className="cta_wrapper">
                            {editIcon && (
                              <img
                                src={editIconBlue}
                                alt="edit icon"
                                className="edit_icon"
                              />
                            )}
                            {ctaText === "Edit | View" ? (
                              <Link
                                to={() => false}
                                className="bedit_common_cta"
                              >
                                {ctaText}
                              </Link>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="focus_wrapper">
                          {data?.focusData?.map((item, index) => (
                            <div className="focus_box" key={index}>
                              <img
                                src={orangeRightTick}
                                alt="right tick"
                                className="focus_img"
                              />
                              <p className="focus_title">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
      <AboutPopUp
        show={isAboutModal}
        onHide={() => setIsAboutModal(false)}
        handleClose={handleHide}
      />
    </>
  );
};

export default OverView;
