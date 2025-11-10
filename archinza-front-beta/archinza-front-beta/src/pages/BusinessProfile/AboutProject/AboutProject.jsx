import React from "react";
import "./aboutproject.scss";
import { bookmarkIcon, editicon } from "../../../images";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import SelectDropdown from "../../../components/SelectDropdown/SelectDropdown";

const servicesArr = [
  "Anything",
  "500 - 2000 Sft",
  "Above 2000 Sft",
  "Above 5000 Sft",
  "Above 10000 Sft",
];

const servicesDropdownArr = [
  "Service 01",
  "Service 02",
  "Service 03",
  "Service 04",
  "Service 05",
];

const currencyArr = ["USD", "INR", "POUND"];

const employeeCountArr = ["Anywhere", "In My Country", "In My City"];

const estYearArr = ["Adaptive Reuse", "Commercial", "Conservation"];
const designrArr = ["Art Deco", "Bespoke", "Bohemian"];
const budgetArr = [
  "Anything",
  "1000 - 2500 Rs/Sft",
  "2500 - 5000 Rs/Sft",
  "Above 5000 Rs/Sft",
];
const preferenceArr = [
  "Fresh Construction",
  "Complete Renovation",
  "Partial Renovation",
];
const minBudgetArr = [
  "0 - 1,00,000",
  "1,00,000 - 5,00,000",
  "5,00,000 - 10,00,000",
  "Above 10,00,000",
];

const AboutProject = () => {
  const servicesList = servicesArr.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={"servicesList" + option}
    />
  ));

  const employeeCountList = employeeCountArr.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={"employeeCountList" + option}
    />
  ));

  const budgetList = budgetArr.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={"budgetList" + option}
    />
  ));

  const estYearList = estYearArr.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={"estYearList" + option}
    />
  ));

  const designList = designrArr.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={"designList" + option}
    />
  ));

  const preferenceList = preferenceArr.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={"designList" + option}
    />
  ));

  const minBudgetList = minBudgetArr.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={"designList" + option}
    />
  ));

  return (
    <>
      <div className="project_container">
        <div className="title_edit">
          <h2 className="section_title">About Your Projects</h2>
          {/* <div className="edit_save">
            <img src={editicon} alt="" className="edit_icon" />
            <img src={bookmarkIcon} alt="" className="book_icon" />
          </div> */}
        </div>
        <div className="brand_subsec with_checkboxes">
          <h4 className="title">Minimum Project Size</h4>
          <ul className="checkboxes">{servicesList}</ul>
        </div>
        <div className="brand_subsec with_checkboxes">
          <h4 className="title">Project Location Preference</h4>
          <ul className="checkboxes">{employeeCountList}</ul>
        </div>
        <div className="brand_subsec">
          <h4 className="title">Project Typology</h4>
          <ul className="checkboxes">{estYearList}</ul>
          <div className="field_wrapper service_dropdown">
            <SelectDropdown
              lightTheme
              label="Select Typology*"
              labelId="selecttypology"
              data={servicesDropdownArr}
            />
          </div>
        </div>
        <div className="brand_subsec">
          <h4 className="title">Design Style</h4>
          <ul className="checkboxes">{designList}</ul>
          <div className="field_wrapper service_dropdown">
            <SelectDropdown
              lightTheme
              label="Select Design Style*"
              labelId="selectdesign"
              data={servicesDropdownArr}
            />
          </div>
        </div>
        <div className="brand_subsec with_checkboxes">
          <h4 className="title">Average Budget Of Your Projects</h4>
          <ul className="checkboxes">{budgetList}</ul>
        </div>
        <div className="brand_subsec">
          <h4 className="title">Preference Of Project Scope</h4>
          <ul className="checkboxes">{preferenceList}</ul>
          <div className="field_wrapper service_dropdown">
            <SelectDropdown
              lightTheme
              label="Select Project Scope"
              labelId="selectprojectscope"
              data={servicesDropdownArr}
            />
          </div>
        </div>
        <div className="brand_subsec with_checkboxes">
          <div className="title_currency">
            <h4 className="title">Current Minimum Project Fee</h4>
            <div className="field_wrapper currency_dropdown">
              <SelectDropdown
                label="Currency"
                labelId="Currency"
                lightTheme
                data={currencyArr}
              />
            </div>
          </div>
          <ul className="checkboxes">{minBudgetList}</ul>
        </div>
      </div>
      {/* <div className="logout_text">
        <div className="cta_wrapper">
          <div type="submit" className="back_cta">
            <div className="text">Back</div>
          </div>
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

export default AboutProject;
