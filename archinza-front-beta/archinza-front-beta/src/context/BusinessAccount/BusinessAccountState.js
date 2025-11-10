import React, { useContext, useReducer, useState } from "react";

import BusinessAccountContext from "./BusinessAccountContext";
import config from "../../config/config";
import http from "../../helpers/http";

const actionTypes = {
  INIT_DATA: "INIT_DATA",
  UPDATE_ALL: "UPDATE_ALL",
  TOGGLE_EDIT_MODE: "TOGGLE_EDIT_MODE",
  UPDATE_SECTION: "UPDATE_SECTION",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
  SET_ACTIVE_SUBTAB: "SET_ACTIVE_SUBTAB",
};

const initialState = {
  data: {},

  editMode: {
    profile: false,
    highlights: false,
    overview: false,
    gallery: false,
    companyProfile: false,
    reviews: false,
  },

  ui: {
    activeMainTab: 0,
    activeSubTab: 0,
  },
};

const businessReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.INIT_DATA:
    case actionTypes.UPDATE_ALL:
      return {
        ...state,
        data: action.payload,
      };

    case actionTypes.TOGGLE_EDIT_MODE:
      return {
        ...state,
        editMode: {
          ...state.editMode,
          [action.payload.section]: !state.editMode[action.payload.section],
        },
      };

    case actionTypes.UPDATE_SECTION:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.section]: {
            ...state.data[action.payload.section],
            ...action.payload.data,
          },
        },
      };

    case actionTypes.SET_ACTIVE_TAB:
      return {
        ...state,
        ui: {
          ...state.ui,
          activeMainTab: action.payload,
          activeSubTab: 0,
        },
      };

    case actionTypes.SET_ACTIVE_SUBTAB:
      return {
        ...state,
        ui: {
          ...state.ui,
          activeSubTab: action.payload,
        },
      };

    default:
      return state;
  }
};

const BusinessAccountState = (props) => {
  const [state, dispatch] = useReducer(businessReducer, initialState);
  const [entry, setEntry] = useState({});
  const update = (data) => {
    dispatch({
      type: actionTypes.UPDATE_ALL,
      payload: data,
    });
  };

  const fetchData = async (id) => {
    try {
      const { data } = await http.get(
        config.api_url + `/business/business-details/${id}`
      );
      if (data) {
        dispatch({
          type: actionTypes.UPDATE_ALL,
          payload: data,
        });
        return data;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  // Toggle edit mode for a specific section
  const toggleEditMode = (section) => {
    dispatch({
      type: actionTypes.TOGGLE_EDIT_MODE,
      payload: { section },
    });
  };

  // Update a specific section of the data
  const updateSection = (section, data) => {
    dispatch({
      type: actionTypes.UPDATE_SECTION,
      payload: { section, data },
    });
  };

  // Set active main tab
  const setActiveTab = (index) => {
    dispatch({
      type: actionTypes.SET_ACTIVE_TAB,
      payload: index,
    });
  };

  // Set active sub tab
  const setActiveSubTab = (index) => {
    dispatch({
      type: actionTypes.SET_ACTIVE_SUBTAB,
      payload: index,
    });
  };

  // Save all changes to backend
  const saveAllChanges = async () => {
    try {
      // API call to save data
      // const response = await api.saveBusinessData(state.data);
      // if (response.success) {
      //   // Show success notification
      // }
      console.log("Saving data:", state.data);
      return true;
    } catch (error) {
      console.error("Error saving data:", error);
      return false;
    }
  };

  // Value object to be provided to context consumers
  const contextValue = {
    data: state.data,
    update,
    state,
    dispatch,
    toggleEditMode,
    updateSection,
    setActiveTab,
    setActiveSubTab,
    saveAllChanges,
    fetchData,
    // Expose edit mode states directly for convenience
    editMode: state.editMode,
    activeTab: state.ui.activeMainTab,
    activeSubTab: state.ui.activeSubTab,
  };
  // const update = (data) => {
  //   setEntry(data);
  // };
  return (
    <BusinessAccountContext.Provider value={contextValue}>
      {props.children}
    </BusinessAccountContext.Provider>
  );
};

export const useBusinessContext = () => {
  return useContext(BusinessAccountContext);
};

export default BusinessAccountState;
