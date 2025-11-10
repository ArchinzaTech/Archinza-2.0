import React, { useEffect, useState } from "react";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import SelectDropdown from "../../../components/SelectDropdown/SelectDropdown";
import AutoCompleteOthers from "../../../components/AutoCompleteOthers/AutoCompleteOthers";
import _ from "lodash";

const BEAutocompleteOthers = ({
  editFocus,
  allOptionData,
  selectedData,
  updateSectionData,
  sectionId,
}) => {
  const [servicesData, setServicesData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [autoKey, setAutoKey] = useState(1);

  const handleCheckboxChange = (index, value) => {
    enableDisableOption(value, false);
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions.splice(index, 1);
    setSelectedOptions(updatedSelectedOptions);
    if (updateSectionData) {
      updateSectionData(sectionId, {
        selectedOptions: updatedSelectedOptions,
      });
    }
  };

  const enableDisableOption = (value, isDisabled = true) => {
    const selectedIndex = _.findIndex(servicesData, { value: value });

    const updatedOptions = [...servicesData];

    if (updatedOptions[selectedIndex]) {
      updatedOptions[selectedIndex] = {
        ...updatedOptions[selectedIndex],
        disabled: isDisabled,
      };
      setServicesData((prev) => {
        return updatedOptions;
      });
    }

    if (isDisabled) {
      const selectedIndexInSelectedData = _.findIndex(
        selectedData,
        (item) => item === value
      );
      if (selectedIndexInSelectedData !== -1) {
        const updatedSelectedData = [...selectedData];
        updatedSelectedData.splice(selectedIndexInSelectedData, 1);
        console.log(updatedSelectedData);

        setSelectedOptions(updatedSelectedData);
      }
    } else {
      setSelectedOptions([...selectedData, value]);
    }
  };

  const handleOptionChange = (value, name) => {
    enableDisableOption(value, true);

    setSelectedOptions((prev) => {
      return [...prev, value];
    });
    if (updateSectionData) {
      updateSectionData(sectionId, {
        selectedOptions: [...selectedData, value],
      });
    }
  };

  const selectedList = selectedOptions.map((option, i) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={option}
      isChecked={editFocus && true}
      onChange={() => handleCheckboxChange(i, option)}
    />
  ));

  useEffect(() => {
    // console.log(selectedData);

    if (selectedData) {
      if (selectedData.length > 0) {
        setSelectedOptions(selectedData);
      }
    }
    if (allOptionData.length > 0) {
      const updatedOptions = allOptionData.map((option) => {
        const isSelected =
          _.findIndex(selectedData, (item) => item === option.value) !== -1;
        return { ...option, disabled: isSelected };
      });
      setServicesData(updatedOptions);
    }
  }, [allOptionData, selectedData]);
  return (
    <>
      {!editFocus ? (
        <>
          <ul className="checkboxes" style={{ pointerEvents: "none" }}>
            {selectedList.length ? (
              selectedList
            ) : (
              <li className="selectedValuePill">No Options Selected</li>
            )}
          </ul>
        </>
      ) : (
        <>
          <div className="autocomplete_others_wrap">
            <AutoCompleteOthers
              key={`autokey${autoKey}`}
              lightTheme
              textLabel="Select Services*"
              data={servicesData}
              classProp="bedit_profile_autcomplete"
              onChange={(e, value) => {
                handleOptionChange(value.value);
                setAutoKey((prev) => {
                  return prev + 1;
                });
              }}
            />
          </div>
          <ul className="checkboxes">{selectedList}</ul>
        </>
      )}
    </>
  );
};

export default BEAutocompleteOthers;
