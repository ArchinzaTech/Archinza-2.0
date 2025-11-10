import React, { useState, useEffect } from "react";
import "./ownerdetailspopup.scss";
import "../AboutPopUp/aboutPopUp.scss";
import Modal from "react-bootstrap/Modal";
import { blackDeleteicon, modalClose } from "../../../../../images";
import style from "../../../../../../src/pages/FormFiveLightTheme/Form/formfivelighttheme.module.scss";
import CheckboxButton from "../../../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteOthers from "../../../../../components/AutoCompleteOthers/AutoCompleteOthers";
import Joi from "joi";
import { TextField } from "@mui/material";
import FullWidthTextField from "../../../../../components/TextField/FullWidthTextField";
import CountryCodeDropdown from "../../../../../components/CountryCodeDropdown/CountryCodeDropdown";
// import style from "../../../../FormFiveLightTheme/Form/formfivelighttheme.module.scss";

const OwnerDetailsPopup = ({
  show,
  onHide,
  onSaveBusinessHours,
  businessHours,
}) => {
  const handleCancel = () => {
    // resetToOriginalValues();
    onHide();
  };
  return (
    <Modal
      show={show}
      centered
      className="Complete_actions_popup OwnerDetailsPopUp"
      backdropClassName="custom-backdrop"
    >
      <Modal.Header>
        <button
          className="Complete_actions_popup_cancel_btn"
          onClick={handleCancel}
        >
          <img
            src={modalClose}
            alt="close-icon"
            className="Complete_actions_popup_cancel_btn_img"
          />
        </button>
      </Modal.Header>
      <Modal.Body>
        <h2 className="Complete_actions_popup_m_heading">Owner Details</h2>

        <div
          className={`owner_details ${style.owner_row}`}
          // style={{ border: owner.id === 1 && "0" }}
          // id={`${owner.id}_error`}
          // key={owner.id}
        >
          <div className={`owner_detail_name ${style.rstep01_col}`}>
            <div className={style.field_wrapper}>
              <FullWidthTextField
                lightTheme
                label="Name of the Owner/Founder*"
                value={""}
                name="name"
                // onChange={(e) =>
                //   handleOwnerChange(owner.id, "name", e.target.value)
                // }
              />
              {/* {ownerErrors[owner.id]?.name && (
                <p className={style.error}>{ownerErrors[owner.id].name}</p>
              )} */}
              <p className={style.error}>Error</p>
            </div>
          </div>
          <div className={`owner_detail_email ${style.rstep01_col}`}>
            <div className={style.field_wrapper}>
              <FullWidthTextField
                lightTheme
                label="Owner/Founder's Email ID*"
                // value={owner.email}
                name="email"
                // onChange={(e) =>
                //   handleOwnerChange(owner.id, "email", e.target.value)
                // }
              />
              {/* {ownerErrors[owner.id]?.email && (
                  <p className={style.error}>{ownerErrors[owner.id].email}</p>
                )} */}
              <p className={style.error}>Error</p>
            </div>
          </div>
          <div className={`owner_detail_number ${style.rstep01_col}`}>
            {/* <div className={style.field_wrapper}> */}
            {/* <div className=""> */}
            <div className="">
              <CountryCodeDropdown
                lightTheme
                textLabel="Code*"
                // data={codes}
                // onChange={(e, value) =>
                //   handleOwnerCountryCodeChange(
                //     "country_code",
                //     value,
                //     owner.id
                //   )
                // }
                // value={countryCodeStates[owner.id]?.phone || null}
              />
            </div>
            <div className="">
              <FullWidthTextField
                lightTheme
                label="Phone No*"
                // value={owner.phone}
                // onChange={(e) =>
                //   handleOwnerChange(
                //     owner.id,
                //     "phone",
                //     e.target.value.replace(/[^0-9]/g, "")
                //   )
                // }
              />
            </div>
            {/* </div> */}
            {/* {ownerErrors[owner.id]?.phone && (
                <p className={style.error}>{ownerErrors[owner.id].phone}</p>
              )} */}
            {/* </div> */}

            <p className={style.error}>Error</p>
          </div>
          <div className={`owner_detail_whatsapp ${style.rstep01_col}`}>
            {/* <div className={style.field_wrapper}> */}
            {/* <div className=""> */}
            <div className="">
              <CountryCodeDropdown
                lightTheme
                textLabel="Code*"
                // data={codes}
                // onChange={(e, value) =>
                //   handleOwnerCountryCodeChange(
                //     "whatsapp_country_code",
                //     value,
                //     owner.id
                //   )
                // }
                // value={countryCodeStates[owner.id]?.whatsapp || null}
              />
            </div>
            <div className="">
              <FullWidthTextField
                lightTheme
                label="Whatsapp Number*"
                // value={owner.whatsapp_no}
                name="whatsapp_no"
                // onChange={(e) =>
                //   handleOwnerChange(
                //     owner.id,
                //     "whatsapp_no",
                //     e.target.value.replace(/[^0-9]/g, "")
                //   )
                // }
              />
            </div>
            {/* </div> */}
            {/* {ownerErrors[owner.id]?.whatsapp_no && (
                <p className={style.error}>
                  {ownerErrors[owner.id].whatsapp_no}
                </p>
              )} */}
            {/* </div> */}
            <div className={`trash_icon ${style.add_delete_icon}`}>
              <img
                src={blackDeleteicon}
                alt="icon"
                className={style.deleteicon}
                // onClick={() => handleDeleteOwner(owner.id)}
              />
            </div>
            <div className={`full_width ${style.checkbox_wrapper}`}>
              <label
                className={style.checkbox_label}
                // htmlFor={`sameas_${owner.id}`}
              >
                <input
                  type="checkbox"
                  className={style.check_box}
                  // id={`sameas_${owner.id}`}
                  // checked={owner.same_as_phone}
                  // onChange={(e) =>
                  //   handleWAChangeOwner(e.target.checked, owner.id)
                  // }
                />
                Same as phone number
              </label>
            </div>
            <p className={style.error}>Error</p>
          </div>
        </div>


        <button
          type="button"
          className="confirmation_common_btn"
          // onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default OwnerDetailsPopup;
