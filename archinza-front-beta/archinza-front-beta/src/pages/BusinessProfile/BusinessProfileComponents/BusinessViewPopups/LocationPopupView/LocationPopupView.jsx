import React, { useEffect, useState } from "react";
import "./locationPopupView.scss";
import Modal from "react-bootstrap/Modal";
import {
  dropdownBlueIcon,
  locationOrange,
  modalClose,
} from "../../../../../images";

const LocationPopupView = (props) => {
  const [animationClass, setAnimationClass] = useState("opening");
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { data } = props;
  const mobileDisplayLimit = 4;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  // When modal opens, add "opening" class
  useEffect(() => {
    if (props.show) {
      setAnimationClass("opening");
      setShowAll(false);
    }
  }, [props.show]);

  // When modal is closing, delay actual close to complete animation
  const handleClose = () => {
    setAnimationClass("closing");
    setTimeout(() => {
      props.handleClose();
    }, 100); // Match animation duration
  };

  const handleSeeAll = () => {
    setShowAll(true);
  };

  // Determine which addresses to display
  const displayedAddresses = isMobile
    ? showAll
      ? data?.addresses || [] // Show all on mobile when "See All" is clicked
      : (data?.addresses || []).slice(0, mobileDisplayLimit) // Show 4 on mobile initially
    : data?.addresses || [];

  const hasMoreAddresses =
    isMobile && (data?.addresses?.length || 0) > mobileDisplayLimit;
  return (
    <>
      <Modal
        {...props}
        centered
        // className="Where_We_excel_popup"
        className={`Location_view_popup ${animationClass}`}
        backdropClassName="custom-backdrop"
        onHide={handleClose}
        // onExit={() => setIsClosing(true)}
      >
        <Modal.Header>
          <button className="custom-cancel-btn" onClick={handleClose}>
            <img
              src={modalClose}
              alt="close-icon"
              className="ctm_img_Where_We_excel_popup"
            />
          </button>
        </Modal.Header>
        <Modal.Body>
          <h2 className="Where_We_excel_popup_heading location_popup_btm_space">
            Locations
          </h2>
          <div className="row location_popup_row g-4">
            {/* this need to be uncomment */}
            {displayedAddresses?.map((address) => (
              <div className="col-md-6 location-col-popup">
                <div className="location_popup_icon_detail_wrapper">
                  <img
                    src={locationOrange}
                    alt="Location"
                    className="location_icon_popup"
                  />
                  <div className="loctaion_wrapper_popup">
                    <div className="location_name_popup">{address?.type} :</div>
                    <div className="location_popup">{address.address}</div>
                  </div>
                </div>
              </div>
            ))}
            {/* <div className="col-md-6 location-col-popup">
              <div className="location_popup_icon_detail_wrapper">
                <img
                  src={locationOrange}
                  alt="Location"
                  className="location_icon_popup"
                />
                <div className="loctaion_wrapper_popup">
                  <div className="location_name_popup">STUDIO :</div>
                  <div className="location_popup">
                    Gandhidham, Gujarat, India
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 location-col-popup">
              <div className="location_popup_icon_detail_wrapper">
                <img
                  src={locationOrange}
                  alt="Location"
                  className="location_icon_popup"
                />
                <div className="loctaion_wrapper_popup">
                  <div className="location_name_popup">WAREHOUSE :</div>
                  <div className="location_popup">Surat, Gujarat, India</div>
                </div>
              </div>
            </div>
            <div className="col-md-6 location-col-popup">
              <div className="location_popup_icon_detail_wrapper">
                <img
                  src={locationOrange}
                  alt="Location"
                  className="location_icon_popup"
                />
                <div className="loctaion_wrapper_popup">
                  <div className="location_name_popup">WAREHOUSE :</div>
                  <div className="location_popup">Surat, Gujarat, India</div>
                </div>
              </div>
            </div>
            <div className="col-md-6 location-col-popup">
              <div className="location_popup_icon_detail_wrapper">
                <img
                  src={locationOrange}
                  alt="Location"
                  className="location_icon_popup"
                />
                <div className="loctaion_wrapper_popup">
                  <div className="location_name_popup">SHOWROOM 1 :</div>
                  <div className="location_popup">Jamnagar, Gujarat, India</div>
                </div>
              </div>
            </div> */}
          </div>
          {hasMoreAddresses && !showAll && (
            <div className="see_all_locations" onClick={handleSeeAll}>
              See All {data?.addresses?.length} locations{" "}
              <img
                src={dropdownBlueIcon}
                alt="drop down"
                className="dropIcon_location"
              />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LocationPopupView;
