import React from "react";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import AutoCompleteField from "../../../components/AutoCompleteField/AutoCompleteField";

const BEAutocomplete = ({ editFocus, allOptionData, selectedData }) => {
  const selectedList = selectedData.map((option) => (
    <CheckboxButton
      className="business_edit_checkbox"
      lightTheme
      label={option}
      labelId={option}
      isChecked={editFocus && true}
    />
  ));

  return (
    <>
      {!editFocus ? (
        <>
          <ul className="checkboxes" style={{ pointerEvents: "none" }}>
            {selectedList}
          </ul>
        </>
      ) : (
        <>
          <div className="autocomplete_others_wrap">
            <AutoCompleteField
              lightTheme
              textLabel="Select Services*"
              data={allOptionData}
            />
          </div>
          <ul className="checkboxes">{selectedList}</ul>
        </>
      )}
    </>
  );
};

export default BEAutocomplete;
