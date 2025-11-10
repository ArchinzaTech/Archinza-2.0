import React, { useEffect, useState } from "react";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteOthers from "../../../components/AutoCompleteOthers/AutoCompleteOthers";
import _ from "lodash";

const BEAutocompleteTypology = ({
  editFocus,
  allOptionData,
  selectedData,
  updateSectionData,
  sectionId,
}) => {
  const [typologyData, setTypologyData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitData, setSubmitData] = useState([]);
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

  const handleOptionChange = (value) => {
    setSelectedOptions((prev) => {
      let newSelectedOptions;
      let newSubmitData;

      if (value === "ALL") {
        newSelectedOptions = ["ALL"];
        newSubmitData = ["ALL"];
      } else if (prev.includes("ALL")) {
        newSelectedOptions = [value];
        newSubmitData = [value];
      } else {
        newSelectedOptions = [...prev, value];
        newSubmitData = [...submitData, value];

        const allOptionsExceptAll = typologyData
          .filter((option) => option.value !== "ALL")
          .map((option) => option.value);

        if (
          newSelectedOptions.length === allOptionsExceptAll.length &&
          allOptionsExceptAll.every((option) =>
            newSelectedOptions.includes(option)
          )
        ) {
          newSelectedOptions = ["ALL"];
          newSubmitData = ["ALL"];
        }
      }

      setSubmitData(newSubmitData);
      enableDisableOption(newSelectedOptions);

      if (updateSectionData) {
        updateSectionData(sectionId, {
          selectedOptions: newSubmitData,
        });
      }

      return newSelectedOptions;
    });
  };

  const enableDisableOption = (values) => {
    const allOptionsExceptAll = typologyData
      .filter((option) => option.value !== "ALL")
      .map((option) => option.value);
    const allSelected = allOptionsExceptAll.every((option) =>
      values.includes(option)
    );
    const updatedOptions = typologyData.map((option) => {
      if (values.includes("ALL")) {
        return {
          ...option,
          disabled: option.value === "ALL",
        };
      } else if (allSelected) {
        return {
          ...option,
          disabled: option.value === "ALL",
        };
      } else {
        return {
          ...option,
          disabled: values.includes(option.value),
        };
      }
    });

    setTypologyData(updatedOptions);
  };

  const selectedList = selectedOptions.map((option, i) => (
    <CheckboxButton
      key={i}
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={option}
      isChecked={editFocus && true}
      onChange={() => handleCheckboxChange(i, option)}
    />
  ));

  useEffect(() => {
    if (selectedData) {
      if (selectedData.length > 0) {
        setSelectedOptions(selectedData);
        setSubmitData(selectedData);
      }
    }
    if (allOptionData.length > 0) {
      const updatedOptions = allOptionData.map((option) => {
        const isSelected =
          _.findIndex(selectedData, (item) => item === option.value) !== -1;
        return { ...option, disabled: isSelected };
      });
      setTypologyData(updatedOptions);
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
              textLabel="Select Project Typology*"
              data={typologyData}
              classProp="bedit_profile_autcomplete"
              onChange={(e, value) => {
                handleOptionChange(value.value);
                setAutoKey((prev) => prev + 1);
              }}
            />
          </div>
          <ul className="checkboxes">{selectedList}</ul>
        </>
      )}
    </>
  );
};

export default BEAutocompleteTypology;
