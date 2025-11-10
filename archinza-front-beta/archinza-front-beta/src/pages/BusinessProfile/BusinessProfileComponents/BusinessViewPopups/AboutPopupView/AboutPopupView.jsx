import React, { useEffect, useState } from "react";
import "./aboutPopupView.scss";
import Modal from "react-bootstrap/Modal";
import { locationOrange, modalClose } from "../../../../../images";

const AboutPopupView = (props) => {
  const [animationClass, setAnimationClass] = useState("opening");
  const { data } = props;
  // When modal opens, add "opening" class
  useEffect(() => {
    if (props.show) {
      setAnimationClass("opening");
    }
  }, [props.show]);

  // When modal is closing, delay actual close to complete animation
  const handleClose = () => {
    setAnimationClass("closing");
    setTimeout(() => {
      props.handleClose();
    }, 100); // Match animation duration
  };
  // Determine which addresses to display
  const displayedAddresses = data?.addresses || []; // Show all on mobile when "See All" is clicked

  return (
    <>
      <Modal
        {...props}
        centered
        // className="Where_We_excel_popup"
        className={`aboutView_popup ${animationClass} abt_view_popup--common`}
        backdropClassName="custom-backdrop"
        onHide={handleClose}
        // onExit={() => setIsClosing(true)}
      >
        <Modal.Header>
          <button className="custom-cancel-btn" onClick={handleClose}>
            <img
              src={modalClose}
              alt="close-icon"
              className="ctm_img_aboutView_popup"
            />
          </button>
        </Modal.Header>
        <Modal.Body>
          {data?.bio && (
            <>
              <h2 className="aboutView_popup_heading">About</h2>
              <h6 className="description_aboutView_cmn">{data?.bio}</h6>
            </>
          )}
          <h2
            className="aboutView_popup_heading"
            style={{
              paddingTop: "1em",
            }}
          >
            Where We Excel
          </h2>
          <ul className="common_ul_popups common_ul_popups--abt">
            {data?.project_scope?.data?.length > 0 && (
              <li className="common_li_popup">
                <div className="wraper_abt_wxcel--popup">Project Scope : </div>
                <span className="bold_common_li_popup">
                  {data.project_scope.data.join(", ")}
                </span>
              </li>
            )}

            {data?.project_location?.data && (
              <li className="common_li_popup">
                <div className="wraper_abt_wxcel--popup">Can do Projects :</div>
                <span className="bold_common_li_popup">
                  {data.project_location.data}
                </span>
              </li>
            )}

            {data?.renovation_work && (
              <li className="common_li_popup">
                <div className="wraper_abt_wxcel--popup">Renovation Work :</div>
                <span className="bold_common_li_popup">
                  {data.renovation_work}
                </span>
              </li>
            )}

            {/* {data?.avg_project_budget?.budgets?.length > 0 && (
              <li className="common_li_popup">
                <div className="wraper_abt_wxcel--popup">
                  Approx Budget of Projects :
                </div>
                <span className="bold_common_li_popup">
                  {data.avg_project_budget.budgets.join(", ")}
                </span>
              </li>
            )}

            {data?.project_mimimal_fee?.fee && (
              <li className="common_li_popup">
                <div className="wraper_abt_wxcel--popup">
                  Current Min. Project Fee :
                </div>
                <span className="bold_common_li_popup">
                  {data.project_mimimal_fee.fee}
                </span>
              </li>
            )} */}

            {data?.project_sizes?.sizes?.length > 0 && (
              <li className="common_li_popup">
                <div className="wraper_abt_wxcel--popup">
                  Min. Project Size :
                </div>
                <span className="bold_common_li_popup">
                  {data.project_sizes.sizes
                    .map((size) => `${size} ${data?.project_sizes?.unit}`)
                    .join(", ")}
                </span>
              </li>
            )}

            {data?.project_typology?.data?.length > 0 && (
              <li className="common_li_popup common_multi_line_list">
                <div className="wraper_abt_wxcel--popup">
                  Project Typology :
                </div>
                <div className="pills_common_li_popup">
                  {data.project_typology.data.map((it, idx) => (
                    <div key={idx} className="pill_span_li">
                      {it}
                    </div>
                  ))}
                </div>
              </li>
            )}

            {data?.design_style?.data?.length > 0 && (
              <li className="common_li_popup common_multi_line_list extra_mb">
                <div className="wraper_abt_wxcel--popup">Design Style :</div>
                <div className="pills_common_li_popup">
                  {data.design_style.data.map((it, idx) => (
                    <div key={idx} className="pill_span_li">
                      {it}
                    </div>
                  ))}
                </div>
              </li>
            )}
          </ul>
          {data?.services && (
            <>
              <div
                className="md_heading_common_popup"
                style={{
                  marginTop: "0.3em",
                  marginBottom: "1em",
                }}
              >
                Our Products/Services
              </div>
              <ul className="common_ul_popups">
                <li className="common_li_popup common_multi_line_list px-0 mx-0">
                  <div className="pills_common_li_popup">
                    {data?.services?.map((it) => (
                      <div className="pill_span_li">{it}</div>
                    ))}
                  </div>
                </li>
              </ul>
            </>
          )}
          <div className="row location_popup_row g-4">
            {/* this need to be uncomment */}
            <h2
              className="aboutView_popup_heading"
              style={{
                marginTop: "1em",
              }}
            >
              Locations
            </h2>
            <div
              className="wrapper_abt_popup_view"
              style={{
                marginTop: "-1em",
              }}
            >
              {displayedAddresses?.map((address) => (
                <div className="col-12 location-col-popup">
                  <div className="location_popup_icon_detail_wrapper">
                    <img
                      src={locationOrange}
                      alt="Location"
                      className="location_icon_popup"
                    />
                    <div className="loctaion_wrapper_popup">
                      <div className="location_name_popup">
                        {address?.type} :
                      </div>
                      <div className="location_popup">{address.address}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AboutPopupView;
