import React, { useContext, useState } from "react";
import "./profilecard.scss";
import {
  dashboardCall,
  dashboardEdit,
  dashboardEmail,
  dashboardLocation,
  contactBg,
} from "../../images";
import { Link, useNavigate } from "react-router-dom";
import {
  changeRoleURL,
  editProfile,
  registrationFormURL,
} from "../helpers/constant-words";
import { useAuth } from "../../context/Auth/AuthState";
import RoleChangeCongrats from "../RoleChangeCongrats/RoleChangeCongrats";
import { DeContext } from "../../App";

const ProfileCard = ({
  name,
  ctaTextColor,
  userType,
  contactNo,
  emailId,
  address,
  isUserDE,
}) => {
  const auth = useAuth();
  const [modalShow, setModalShow] = useState(false);
  const handlemodalShowOpen = () => setModalShow(true);
  const handlemodalShowClose = () => setModalShow(false);

  const { deChangRole, setDeChangRole } = useContext(DeContext);
  const navigate = useNavigate();

  return (
    <>
      <RoleChangeCongrats
        show={modalShow}
        onHide={() => {
          window.history.replaceState({}, "");
          setModalShow(false);
        }}
        showConfetti={false}
        isItConfirmationPopup={isUserDE}
        modelCloseEvent={handlemodalShowClose}
      />
      <div className="profile_card">
        <img
          width={1063}
          height={288}
          src={contactBg}
          alt="background"
          className="profile-bg"
        />
        <div className="row profile-row">
          <div className="col-sm-6 col-md-6 detail_col">
            <p className="greeting">Hey there,</p>
            <h1 className="name">{name}</h1>
            <button className="dashboard_btn" style={{ color: ctaTextColor }}>
              {userType}
              {/* <Link to={changeRoleURL} className="edit_link">
              <img src={editicon} alt="Edit" className="edit_img" />
            </Link> */}
            </button>
            <Link
              to={isUserDE ? "" : changeRoleURL}
              className="change_link"
              // onClick={isUserDE ? handlemodalShowOpen : () => {}}
              onClick={(e) => {
                if (isUserDE) {
                  e.preventDefault();
                  setDeChangRole(true);
                  // console.log(dummy);
                  // handlemodalShowOpen();
                  navigate(registrationFormURL);
                }
              }}
            >
              Change your Role
            </Link>
            {/* {auth?.user?.user_type != "BO" && auth?.user?.user_type != "FL" && (
          )} */}
          </div>
          <div className="col-sm-6 col-md-6 detail_col">
            <div className="detail_wrapper">
              <div className="details">
                <img src={dashboardCall} alt="" className="contact_img" />
                <div className="contact">{contactNo}</div>
              </div>
              <div className="details">
                <img src={dashboardEmail} alt="" className="contact_img" />
                <div className="contact">{emailId}</div>
              </div>
              <div className="details">
                <img src={dashboardLocation} alt="" className="contact_img" />
                <p className="contact">{address}</p>
              </div>
              <Link to={editProfile} className="edit_wrapper">
                <img src={dashboardEdit} alt="Edit" className="edit_img" />
                <p className="edit">Edit</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
