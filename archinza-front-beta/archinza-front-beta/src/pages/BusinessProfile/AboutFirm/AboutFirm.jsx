import React, { useEffect, useState } from "react";
import "./aboutfirm.scss";
import {
  behanceiconb,
  bookmarkIcon,
  editicon,
  fbiconb,
  instaWhite,
  linkediniconb,
  websiteiconb,
} from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import FullWidthTextField from "../../../components/TextField/FullWidthTextField";
import BEPCheckboxesWithOthers from "../../../components/BusinessEditComponents/BEPCheckboxesWithOthers/BEPCheckboxesWithOthers";
import { useAuth } from "../../../context/Auth/AuthState";
import http from "../../../helpers/http";
import { useGlobalDataContext } from "../../../context/GlobalData/GlobalDataState";

const selectedData = [
  "3D Visualization/Rendering",
  "Accessibility Consulting",
  "Accessibility Design",
  "Accessibility",
];

const servicesDropdownArr = [
  { value: "Service 01" },
  { value: "Service 02" },
  { value: "Service 03" },
  { value: "Service 04" },
  { value: "Service 05" },
];

const employeeCountArr = ["Upto 10", "10-20", "20-50", "50-100", "100+"];

const estYearArr = ["2023", "2024", "2025", "2026", "2027", "2028", "2029"];

const AboutFirm = () => {
  const [disable, setDisable] = useState(null);
  const [values, setValues] = useState({
    services: [],
    employees_range: [],
    establishment_year: "",
    website_link: "",
    instagram_handle: "",
    linkedin_link: "",
    address_google_location: "",
    gst_number: "",
  });
  const [servicesData, setServicesData] = useState([]);
  // const [selectedData, setSelectedData] = useState([]);
  const auth = useAuth();
  const GlobalDataContext = useGlobalDataContext();

  const disableHandler = (i) => {
    if (i === disable) {
      setDisable(null);
    } else {
      setDisable(i);
    }
  };

  const employeeCountList = employeeCountArr.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={option}
    />
  ));

  const estYearList = estYearArr.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={option}
    />
  ));

  useEffect(() => {
    if (GlobalDataContext?.options?.services) {
      setServicesData(
        GlobalDataContext?.options?.services?.map((option) => ({
          label: option,
          value: option,
        }))
      );
    }
  }, [GlobalDataContext?.options]);
  useEffect(() => {
    if (auth?.user) {
      const newValues = {
        ...values,
        services: auth?.user?.services || [],
        employees_range: auth?.user?.employees_range || "",
        establishment_year: auth?.user?.establishment_year || "",
        website_link: auth?.user?.website_link || "",
        instagram_handle: auth?.user?.instagram_handle || "",
        linkedin_link: auth?.user?.linkedin_link || "",
        address_google_location: auth?.user?.address_google_location || "",
        gst_number: auth?.user?.gst_number || "",
      };
      setValues(newValues);
    }
  }, [auth]);

  return (
    <>
      <div className="firm_container">
        <div className="title_edit">
          <h2 className="section_title">About The Firm</h2>
        </div>

        <div
          className={`brand_subsec first_box  ${
            disable === 0 ? "" : disable !== null && "disable"
          }`}
        >
          <div className="title_pin">
            <h4 className="title">Bio</h4>
            <img
              src={editicon}
              alt=""
              className="edit_icon"
              onClick={() => disableHandler(0)}
            />
          </div>
          <div className="desc_box">
            <p className="desc">
              DESIGN FIRM/CONSULTANCY
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim ven`iam, quis nostrud exercitation ullamco
            </p>
          </div>
          {disable === 0 && (
            <div className="save_cancel_cta">
              <button className="save_cta" onClick={() => setDisable(null)}>
                Save
              </button>
              <button className="cancel_cta" onClick={() => setDisable(null)}>
                Cancel
              </button>
            </div>
          )}
        </div>
        <div
          className={`brand_subsec ${
            disable === 1 ? "" : disable !== null && "disable"
          }`}
        >
          <div className="title_pin">
            <h4 className="title">What Services Do You Provide?</h4>
            <img
              src={editicon}
              alt=""
              className="edit_icon"
              onClick={() => disableHandler(1)}
            />
          </div>
          <BEPCheckboxesWithOthers
            allOptionData={servicesData}
            selectedData={values.services}
            editDisable={disable}
          />
          {/* <ul className="checkboxes">{servicesList}</ul>
          <div className="field_wrapper service_dropdown">
            <SelectDropdown
              lightTheme
              label="Select Services*"
              labelId="selectservices"
              data={servicesDropdownArr}
            />
          </div> */}
          {disable === 1 && (
            <div className="save_cancel_cta no_space">
              <button className="save_cta" onClick={() => setDisable(null)}>
                Save
              </button>
              <button className="cancel_cta" onClick={() => setDisable(null)}>
                Cancel
              </button>
            </div>
          )}
        </div>
        <div
          className={`brand_subsec with_checkboxes ${
            disable === 2 ? "" : disable !== null && "disable"
          }`}
        >
          <div className="title_pin">
            <h4 className="title">Number Of Employees</h4>
            <img
              src={editicon}
              alt=""
              className="edit_icon"
              onClick={() => disableHandler(2)}
            />
          </div>
          <ul className="checkboxes">{employeeCountList}</ul>
        </div>
        <div
          className={`brand_subsec with_checkboxes ${
            disable === 3 ? "" : disable !== null && "disable"
          }`}
        >
          <div className="title_pin">
            <h4 className="title">Year Of Establishment</h4>
            <img
              src={editicon}
              alt=""
              className="edit_icon"
              onClick={() => disableHandler(3)}
            />
          </div>
          <ul className="checkboxes">{estYearList}</ul>
        </div>
        <div
          className={`brand_subsec ${
            disable === 4 ? "" : disable !== null && "disable"
          }`}
        >
          <div className="title_pin">
            <h4 className="title">Firm Connect Data</h4>
            <img
              src={editicon}
              alt=""
              className="edit_icon"
              onClick={() => disableHandler(4)}
            />
          </div>
          <ul className="social_list">
            <li>
              <div className="field_wrapper social_wrapper">
                <img
                  width={30}
                  height={30}
                  src={websiteiconb}
                  alt="website"
                  className="field_icon"
                  loading="lazy"
                />
                <FullWidthTextField
                  classProp="business_edit_input"
                  lightTheme
                  label="Enter valid link"
                />
                <p className="error"></p>
              </div>
            </li>
            <li>
              <div className="field_wrapper social_wrapper">
                <img
                  width={30}
                  height={30}
                  src={linkediniconb}
                  alt="website"
                  className="field_icon"
                  loading="lazy"
                />
                <FullWidthTextField
                  classProp="business_edit_input"
                  lightTheme
                  label="Enter valid link"
                />
                <p className="error"></p>
              </div>
            </li>
            <li>
              <div className="field_wrapper social_wrapper">
                <img
                  width={30}
                  height={30}
                  src={fbiconb}
                  alt="website"
                  className="field_icon"
                  loading="lazy"
                />
                <FullWidthTextField
                  classProp="business_edit_input"
                  lightTheme
                  label="Enter valid link"
                />
                <p className="error"></p>
              </div>
            </li>
            <li>
              <div className="field_wrapper social_wrapper">
                <img
                  width={30}
                  height={30}
                  src={behanceiconb}
                  alt="website"
                  className="field_icon"
                  loading="lazy"
                />
                <FullWidthTextField
                  classProp="business_edit_input"
                  lightTheme
                  label="Enter valid link"
                />
                <p className="error"></p>
              </div>
            </li>
            <li>
              <div className="field_wrapper social_wrapper">
                <img
                  width={30}
                  height={30}
                  src={instaWhite}
                  alt="website"
                  className="field_icon"
                  loading="lazy"
                />
                <FullWidthTextField
                  classProp="business_edit_input"
                  lightTheme
                  label="Enter valid link"
                />
                <p className="error"></p>
              </div>
            </li>
            <li>
              <div className="field_wrapper social_wrapper">
                <FullWidthTextField
                  classProp="business_edit_input"
                  lightTheme
                  label="Others"
                />
                <p className="error"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/* <div className="logout_text">
        <div className="cta_wrapper flex_end">
          <button type="submit" className="common_cta without_shadow save_next">
            <div className="text">Save & Next</div>
          </button>
        </div>
        <div className="notice">
          <Link className="anchor">click here</Link> to save & exit
        </div>
        <div className="notice">
          Need help setting up your store? Get help!&nbsp;
          <Link className="anchor blue_anchor">Get help!</Link>
        </div>
      </div> */}
    </>
  );
};

export default AboutFirm;
