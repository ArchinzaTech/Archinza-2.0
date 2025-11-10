import React, { useEffect, useState } from "react";
import "./excelPopup.scss";
import Modal from "react-bootstrap/Modal";
import { blackClose, modalCloseIcon } from "../../../../../images";
import AutoCompleteOthers from "../../../../../components/AutoCompleteOthers/AutoCompleteOthers";
import _ from "lodash";
import CheckboxButton from "../../../../../components/CheckboxButton/CheckboxButton";
import style from "../../../../FormFiveLightTheme/Form/formfivelighttheme.module.scss";
import AutoCompleteField from "../../../../../components/AutoCompleteField/AutoCompleteField";
import config from "../../../../../config/config";
import http from "../../../../../helpers/http";
import { toast } from "react-toastify";
import ToastMsg from "../../../../../components/ToastMsg/ToastMsg";
import { useBusinessContext } from "../../../../../context/BusinessAccount/BusinessAccountState";
import { Popper } from "@mui/material";

const ExcelPopup = ({
  show,
  handleClose,
  globalData,
  data,
  workflowQuestions,
}) => {
  const [selectedOptions, setSelectedOptions] = useState({
    project_typology: [],
    design_styles: [],
    avg_project_budget: [],
    project_mimimal_fee: "",
    project_sizes: [],
  });
  const [autoKey, setAutoKey] = useState(1);
  const [formData, setFormData] = useState({
    project_locations: "",
    renovation_work: "",
    avg_project_currency: "",
    project_size_unit: "",
    project_minimal_fee_currency: "",
    project_mimimal_fee: "",
  });
  const [originalMinimalFee, setOriginalMinimalFee] = useState({
    fee: "",
    currency: "",
  });
  const [servicesData, setServicesData] = useState({});
  const [initialData, setInitialData] = useState(null);
  const baseUrl = config.api_url;
  const BusinessContext = useBusinessContext();

  useEffect(() => {
    const initial = {
      project_locations: data?.project_location?.data || "",
      renovation_work: data?.renovation_work || "",
      project_typology: data?.project_typology?.data || [],
      design_styles: data?.design_style?.data || [],
      avg_project_budget: data?.avg_project_budget?.budgets || [],
      avg_project_currency: data?.avg_project_budget?.currency || "INR",
      project_mimimal_fee: data?.project_mimimal_fee?.fee || "",
      project_minimal_fee_currency:
        data?.project_mimimal_fee?.currency || "INR",
      project_sizes: data?.project_sizes?.sizes || [],
      project_size_unit: data?.project_sizes?.unit || "sq.ft.",
    };

    // Check if any fields have all options selected

    const hasAllProjectTypology = hasAllOptions(
      initial.project_typology,
      globalData,
      "project_typology"
    );
    const hasAllDesignStyles = hasAllOptions(
      initial.design_styles,
      globalData,
      "design_styles"
    );

    // If all options are selected, replace with just "All"

    if (hasAllProjectTypology) {
      initial.project_typology = ["All"];
    }

    if (hasAllDesignStyles) {
      initial.design_styles = ["All"];
    }

    setInitialData(initial);

    setOriginalMinimalFee({
      fee: data?.project_mimimal_fee?.fee || "",
      currency: data?.project_mimimal_fee?.currency || "INR",
    });

    setFormData({
      project_locations: initial.project_locations,
      renovation_work: initial.renovation_work,
      avg_project_currency: initial.avg_project_currency,
      project_size_unit: initial.project_size_unit,
      project_minimal_fee_currency: initial.project_minimal_fee_currency,
      project_mimimal_fee: initial.project_mimimal_fee,
    });

    setSelectedOptions({
      project_typology: [],
      design_styles: [],
      avg_project_budget: [],
      project_sizes: [],
      project_mimimal_fee: "",
    });

    // Add "All" option to each array and sort them (CHANGE #2)
    // Ensure globalData fields exist with "All" option
    if (globalData) {
      // Add "All" to project_scope_preferences if not exists

      // Add "All" to project_typologies if not exists
      if (
        globalData.project_typologies &&
        !globalData.project_typologies.some(
          (item) => item.toLowerCase() === "all"
        )
      ) {
        globalData.project_typologies = [
          ...globalData.project_typologies,
          "All",
        ];
      }

      // Add "All" to design_styles if not exists
      if (
        globalData.design_styles &&
        !globalData.design_styles.some((item) => item.toLowerCase() === "all")
      ) {
        globalData.design_styles = [...globalData.design_styles, "All"];
      }
    }

    const projectTypologyOptions =
      globalData?.project_typologies?.map((it) => ({
        label: it,
        value: it,
      })) || [];

    const designStylesOptions =
      globalData?.design_styles?.map((it) => ({
        label: it,
        value: it,
      })) || [];

    setServicesData({
      project_typology: sortOptionsWithAllAtEnd(projectTypologyOptions),
      design_styles: sortOptionsWithAllAtEnd(designStylesOptions),
      budgets:
        globalData?.average_budget?.map((it) => ({
          label: it.budget,
          value: it.budget,
          currency: it.currency,
        })) || [],
      sizes:
        globalData?.project_sizes?.map((it) => ({
          label: `${it.size} ${it.unit}`,
          value: it.size,
          unit: it.unit,
        })) || [],
      minimal_fee:
        globalData?.minimum_project_fee?.map((it) => ({
          label: it,
          value: it,
          unit: it,
        })) || [],
    });
  }, [data, show, globalData]);

  useEffect(() => {
    const fetchCurrencyValues = async () => {
      if (
        formData.project_minimal_fee_currency &&
        formData.project_minimal_fee_currency !== "INR"
      ) {
        try {
          const response = await http.get(`${baseUrl}/business/get-currency`);
          if (response?.data) {
            const updatedMinimalFee = response.data.map((fee) => ({
              label: fee,
              value: fee,
            }));

            setServicesData((prev) => ({
              ...prev,
              minimal_fee: updatedMinimalFee,
            }));
          }
        } catch (error) {
          console.error("Error fetching currency values:", error);
        }
      } else {
        // Use default values from globalData
        const defaultMinimalFee =
          globalData?.minimum_project_fee?.map((fee) => ({
            label: fee,
            value: fee,
          })) || [];

        setServicesData((prev) => ({
          ...prev,
          minimal_fee: defaultMinimalFee,
        }));
      }
    };

    if (formData.project_minimal_fee_currency) {
      fetchCurrencyValues();
    }
  }, [formData.project_minimal_fee_currency, baseUrl, globalData]);

  useEffect(() => {
    if (initialData && servicesData && Object.keys(servicesData).length > 0) {
      const updatedServicesData = { ...servicesData };
      let needsUpdate = false;

      const disableInitialOptions = (fieldName, dataField) => {
        const items = initialData[fieldName] || [];
        if (items.length === 0) return false;

        const updatedOptions = [...updatedServicesData[dataField]];
        let fieldUpdated = false;

        items.forEach((item) => {
          const index = _.findIndex(updatedOptions, { value: item });
          if (index !== -1 && !updatedOptions[index].disabled) {
            updatedOptions[index] = {
              ...updatedOptions[index],
              disabled: true,
            };
            fieldUpdated = true;
          }
        });

        if (fieldUpdated) {
          updatedServicesData[dataField] = updatedOptions;
          return true;
        }
        return false;
      };

      // Process each field and track if any updates were needed
      needsUpdate =
        disableInitialOptions("project_typology", "project_typology") ||
        needsUpdate;
      needsUpdate =
        disableInitialOptions("design_styles", "design_styles") || needsUpdate;

      // Handle budget options
      if (
        initialData.avg_project_budget &&
        initialData.avg_project_budget.length > 0
      ) {
        const updatedBudgets = [...updatedServicesData.budgets];
        let budgetsUpdated = false;

        initialData.avg_project_budget.forEach((budget) => {
          const index = _.findIndex(updatedBudgets, { value: budget });
          if (index !== -1 && !updatedBudgets[index].disabled) {
            updatedBudgets[index] = {
              ...updatedBudgets[index],
              disabled: true,
            };
            budgetsUpdated = true;
          }
        });

        if (budgetsUpdated) {
          updatedServicesData.budgets = updatedBudgets;
          needsUpdate = true;
        }
      }

      // Handle sizes options
      if (initialData.project_sizes && initialData.project_sizes.length > 0) {
        const updatedSizes = [...updatedServicesData.sizes];
        let sizesUpdated = false;

        initialData.project_sizes.forEach((size) => {
          const index = _.findIndex(updatedSizes, { value: size });
          if (index !== -1 && !updatedSizes[index].disabled) {
            updatedSizes[index] = {
              ...updatedSizes[index],
              disabled: true,
            };
            sizesUpdated = true;
          }
        });

        if (sizesUpdated) {
          updatedServicesData.sizes = updatedSizes;
          needsUpdate = true;
        }
      }

      if (initialData.project_mimimal_fee) {
        const updatedSizes = [...updatedServicesData.minimal_fee];
        let sizesUpdated = false;

        initialData.project_sizes.forEach((size) => {
          const index = _.findIndex(updatedSizes, { value: size });
          if (index !== -1 && !updatedSizes[index].disabled) {
            updatedSizes[index] = {
              ...updatedSizes[index],
              disabled: true,
            };
            sizesUpdated = true;
          }
        });

        if (sizesUpdated) {
          updatedServicesData.sizes = updatedSizes;
          needsUpdate = true;
        }
      }

      // Only update state if something actually changed
      if (needsUpdate) {
        setServicesData((prevData) => {
          return JSON.stringify(prevData) !==
            JSON.stringify(updatedServicesData)
            ? updatedServicesData
            : prevData;
        });
      }
    }
    // Add this ref to prevent the infinite loop
  }, [initialData]); // Only depend on initialData, not servicesData

  const sortOptionsWithAllAtEnd = (options) => {
    if (!options || !Array.isArray(options)) return [];

    return [...options].sort((a, b) => {
      if (a.value.toLowerCase() === "all") return 1;
      if (b.value.toLowerCase() === "all") return -1;
      return a.value.localeCompare(b.value);
    });
  };

  // Add this function to check if "All" is selected
  const isAllSelected = (selectedItems, field, globalData) => {
    if (!selectedItems || !selectedItems.length) return false;
    const allOption = selectedItems.find(
      (item) => item.toLowerCase() === "all"
    );
    return Boolean(allOption);
  };

  // Add this function to check if data has all options (for initialData)
  const hasAllOptions = (data, globalData, fieldName) => {
    if (!data || !globalData) return false;

    const dataField = {
      project_typology: "project_typologies",
      design_styles: "design_styles",
    }[fieldName];

    if (!dataField || !globalData[dataField]) return false;

    // If "all" is explicitly included
    if (data.some((item) => item.toLowerCase() === "all")) return true;

    // Or if all options are included (excluding "all")
    const globalOptions = globalData[dataField].filter(
      (opt) => opt.toLowerCase() !== "all"
    );
    return (
      globalOptions.length > 0 &&
      globalOptions.every((opt) =>
        data.some((item) => item.toLowerCase() === opt.toLowerCase())
      )
    );
  };

  const handleOptionChange = (value, field) => {
    // If "All" is selected
    if (value.toLowerCase() === "all") {
      // Clear all previous selections
      setSelectedOptions((prev) => ({
        ...prev,
        [field]: ["All"],
      }));

      // Disable only the "All" option
      const updatedOptions = [...servicesData[field]].map((option) => ({
        ...option,
        disabled: option.value.toLowerCase() === "all",
      }));

      setServicesData((prev) => ({
        ...prev,
        [field]: updatedOptions,
      }));

      return;
    }

    // For any other option, handle both explicit "All" and implicit "all" (when all options are selected)
    const currentSelections = [...selectedOptions[field]];

    // Check for explicit "All" in selectedOptions
    const allOptionIndex = currentSelections.findIndex(
      (option) => option.toLowerCase() === "all"
    );

    // Check for implicit "all" in initialData (all options are selected)
    const hasAllInInitial = hasAllOptions(
      initialData[field],
      globalData,
      field
    );

    // If "All" was previously selected or all options were implicitly selected
    if (allOptionIndex !== -1 || hasAllInInitial) {
      // If explicit "All" was selected, remove it
      if (allOptionIndex !== -1) {
        currentSelections.splice(allOptionIndex, 1);
      }

      // If all options were implicitly selected in initialData, clear initialData for this field
      if (hasAllInInitial) {
        setInitialData((prev) => ({
          ...prev,
          [field]: [], // Clear the initialData for this field
        }));
      }

      // Enable the "All" option in dropdown
      const updatedOptions = [...servicesData[field]].map((option) => ({
        ...option,
        disabled:
          (option.value.toLowerCase() !== "all" && option.value === value) ||
          (option.value.toLowerCase() !== "all" &&
            !hasAllInInitial && // Don't keep disabled if we just cleared initialData
            initialData[field] &&
            initialData[field].includes(option.value)),
      }));

      setServicesData((prev) => ({
        ...prev,
        [field]: updatedOptions,
      }));
    }

    // Normal case - adding a regular option
    enableDisableOption(value, true, field);
    setSelectedOptions((prev) => ({
      ...prev,
      [field]: [...currentSelections, value],
    }));
  };

  const handleCheckboxChange = (index, value, field) => {
    if (value.toLowerCase() === "all") {
      // Re-enable all options if "All" is deselected
      const updatedOptions = [...servicesData[field]].map((option) => ({
        ...option,
        disabled:
          initialData[field] && initialData[field].includes(option.value),
      }));

      setServicesData((prev) => ({
        ...prev,
        [field]: updatedOptions,
      }));
    } else {
      enableDisableOption(value, false, field);
    }

    const updatedOptions = [...selectedOptions[field]];
    updatedOptions.splice(index, 1);
    setSelectedOptions((prev) => ({
      ...prev,
      [field]: updatedOptions,
    }));
  };

  // Replace the enableDisableOption function with this updated version
  const enableDisableOption = (value, isDisabled, field) => {
    const fieldMapping = {
      project_typology: "project_typology",
      design_styles: "design_styles",
      avg_project_budget: "budgets",
      project_sizes: "sizes",
    };

    const dataField = fieldMapping[field] || field;

    if (!servicesData[dataField] || !Array.isArray(servicesData[dataField])) {
      console.error(
        `servicesData[${dataField}] is not an array or doesn't exist`
      );
      return;
    }

    // Find the item to update
    const selectedIndex = _.findIndex(servicesData[dataField], { value });
    if (selectedIndex === -1) {
      console.error(`Option with value ${value} not found in ${dataField}`);
      return;
    }

    // For sizes and budgets, only apply changes if the current unit/currency matches
    if (
      dataField === "sizes" &&
      servicesData[dataField][selectedIndex].unit !== formData.project_size_unit
    ) {
      return;
    }

    if (
      dataField === "budgets" &&
      servicesData[dataField][selectedIndex].currency !==
        formData.avg_project_currency
    ) {
      return;
    }

    const updatedOptions = [...servicesData[dataField]];
    updatedOptions[selectedIndex] = {
      ...updatedOptions[selectedIndex],
      disabled: isDisabled,
    };

    setServicesData((prev) => ({
      ...prev,
      [dataField]: updatedOptions,
    }));
  };

  const resetDisabledState = (dataField) => {
    if (!servicesData[dataField]) return;

    const updatedOptions = servicesData[dataField].map((option) => {
      // Only enable options that were disabled by user selection, not those from initialData
      const isInInitialData =
        dataField === "budgets"
          ? initialData.avg_project_budget.includes(option.value)
          : initialData.project_sizes.includes(option.value);

      // Keep initial data options disabled, but enable user-selected ones
      return {
        ...option,
        disabled: isInInitialData,
      };
    });

    setServicesData((prev) => ({
      ...prev,
      [dataField]: updatedOptions,
    }));
  };

  const handleSelectChange = (value, field) => {
    if (field === "project_size_unit" && value !== formData.project_size_unit) {
      setSelectedOptions((prev) => ({
        ...prev,
        project_sizes: [],
      }));

      resetDisabledState("sizes");
    }

    if (
      field === "avg_project_currency" &&
      value !== formData.avg_project_currency
    ) {
      setSelectedOptions((prev) => ({
        ...prev,
        avg_project_budget: [],
      }));

      resetDisabledState("budgets");
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getDataFieldName = (field) => {
    const dataFieldMap = {
      project_typology: "project_typologies",
      design_styles: "design_styles",
    };
    return dataFieldMap[field] || field;
  };

  const handleRemove = (value, field) => {
    // If removing "All" option
    if (value.toLowerCase() === "all") {
      // Re-enable all options
      const updatedOptions = [...servicesData[field]].map((option) => ({
        ...option,
        disabled: false,
      }));

      setServicesData((prev) => ({
        ...prev,
        [field]: updatedOptions,
      }));
    }

    // Check if we're removing from an implicit "All" (all options selected)
    const hasAllOptionsBeforeRemoval = hasAllOptions(
      initialData[field],
      globalData,
      field
    );

    // Remove the specific value from initialData
    const updatedData = initialData[field].filter((item) => item !== value);

    setInitialData((prev) => ({
      ...prev,
      [field]: updatedData,
    }));

    // If we were removing from an implicit "All" state and this is the first removal,
    // we need to repopulate with all other options except the one being removed and "All"
    if (hasAllOptionsBeforeRemoval && value.toLowerCase() !== "all") {
      // Get all options except "All" and the one being removed
      const allFieldOptions =
        globalData[getDataFieldName(field)]?.filter(
          (opt) => opt.toLowerCase() !== "all" && opt !== value
        ) || [];

      // Update initialData with all options except the removed one
      setInitialData((prev) => ({
        ...prev,
        [field]: allFieldOptions,
      }));

      // Update servicesData to reflect these changes
      const updatedOptions = [...servicesData[field]].map((option) => ({
        ...option,
        disabled:
          option.value.toLowerCase() === "all" ||
          (option.value !== value && allFieldOptions.includes(option.value)),
      }));

      setServicesData((prev) => ({
        ...prev,
        [field]: updatedOptions,
      }));
    } else if (value.toLowerCase() !== "all") {
      // Normal case - just enable the removed option
      enableDisableOption(value, false, field);
    }
  };

  const handleSubmit = async () => {
    try {
      // Helper function to handle "All" option in arrays
      const processFieldWithAllOption = (fieldName, dataField) => {
        const selectedAll = [
          ...initialData[fieldName],
          ...selectedOptions[fieldName],
        ].some((item) => item.toLowerCase() === "all");

        if (selectedAll) {
          // Return all options from globalData except "All" itself
          return (
            globalData[dataField]?.filter(
              (item) => item.toLowerCase() !== "all"
            ) || []
          );
        }

        // Return normal combined selections
        return [
          ...initialData[fieldName],
          ...selectedOptions[fieldName],
        ].filter((item) => item.toLowerCase() !== "all");
      };

      const payload = {
        project_location: { data: formData.project_locations },
        renovation_work: formData.renovation_work,
        project_typology: {
          data: processFieldWithAllOption(
            "project_typology",
            "project_typologies"
          ),
        },
        design_style: {
          data: processFieldWithAllOption("design_styles", "design_styles"),
        },
        avg_project_budget: {
          budgets: [
            ...(initialData?.avg_project_currency ===
            formData.avg_project_currency
              ? [
                  ...initialData.avg_project_budget,
                  ...selectedOptions.avg_project_budget,
                ]
              : [...selectedOptions.avg_project_budget]),
          ],
          currency: formData.avg_project_currency,
        },
        project_sizes: {
          sizes: [
            ...(initialData?.project_size_unit === formData.project_size_unit
              ? [...initialData.project_sizes, ...selectedOptions.project_sizes]
              : [...selectedOptions.project_sizes]),
          ],
          unit: formData.project_size_unit,
        },
        project_mimimal_fee: {
          fee: formData.project_mimimal_fee,
          currency: formData.project_minimal_fee_currency,
        },
      };

      const response = await http.post(
        `${baseUrl}/business/business-details/${BusinessContext?.data?._id}`,
        payload
      );

      if (response?.data) {
        BusinessContext.update({
          ...BusinessContext.data,
          ...payload,
        });
        toast(
          <ToastMsg message={`Changes Saved Successfully`} />,
          config.success_toast_config
        );
        handleClose();
      }
      // TODO: Implement API call
      // await api.saveData(payload);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleModalClose = () => {
    // Revert to initial data
    setFormData({
      project_locations: initialData?.project_locations || "",
      renovation_work: initialData?.renovation_work || "",
      avg_project_currency: initialData?.avg_project_currency || "",
      project_size_unit: initialData?.project_size_unit || "",
    });
    setSelectedOptions({
      project_typology: [],
      design_styles: [],
      avg_project_budget: [],
      project_sizes: [],
    });
    handleClose();
  };

  // Filter budgets based on selected currency
  const filteredBudgets = servicesData?.budgets?.filter(
    (budget) => budget.currency === formData.avg_project_currency
  );

  // Filter sizes based on selected unit
  const filteredSizes = servicesData?.sizes?.filter(
    (size) => size.unit === formData.project_size_unit
  );

  // Add these two render functions before the return statement

  const renderBudgetSection = () => {
    const selectedList = selectedOptions.avg_project_budget.map((option, i) => (
      <CheckboxButton
        lightTheme
        isChecked={true}
        label={option}
        labelId={option}
        onChange={() => handleCheckboxChange(i, option, "avg_project_budget")}
        key={`budget-${i}`}
      />
    ));

    return (
      <div className="excel_select_search_wrapper">
        <div className={`${style.steps} ${style.fastep04}`}>
          <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
            <div className={`${style.field_wrapper} field_wrapper`}>
              <ul className="checkboxes chips_b_edit_autoComplete">
                {formData.avg_project_currency ===
                  initialData?.avg_project_currency &&
                  initialData?.avg_project_budget?.map((value, index) => (
                    <li
                      className="black_border_chips_custom"
                      key={`budget-chip-${index}`}
                      onClick={() => handleRemove(value, "avg_project_budget")}
                    >
                      {value}
                      <img
                        src={blackClose}
                        alt="close"
                        className="close_icon"
                      />
                    </li>
                  ))}
                {selectedList}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectSizesSection = () => {
    const selectedList = selectedOptions.project_sizes.map((option, i) => (
      <CheckboxButton
        lightTheme
        isChecked={true}
        label={`${option} ${formData.project_size_unit}`}
        labelId={option}
        onChange={() => handleCheckboxChange(i, option, "project_sizes")}
        key={`size-${i}`}
      />
    ));

    return (
      <div className="excel_select_search_wrapper">
        <div className={`${style.steps} ${style.fastep04}`}>
          <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
            <div className={`${style.field_wrapper} field_wrapper`}>
              <ul className="checkboxes chips_b_edit_autoComplete">
                {formData.project_size_unit ===
                  initialData?.project_size_unit &&
                  initialData?.project_sizes?.map((value, index) => (
                    <li
                      className="black_border_chips_custom"
                      key={`size-chip-${index}`}
                      onClick={() => handleRemove(value, "project_sizes")}
                    >
                      {value} {data.project_sizes.unit}
                      <img
                        src={blackClose}
                        alt="close"
                        className="close_icon"
                      />
                    </li>
                  ))}
                {selectedList}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Updated Project Typology section render function
  const renderProjectTypologySection = () => {
    const selectedList = selectedOptions.project_typology.map((option, i) => (
      <CheckboxButton
        lightTheme
        isChecked={true}
        label={option}
        labelId={option}
        onChange={() => handleCheckboxChange(i, option, "project_typology")}
        key={`typology-${i}`}
      />
    ));

    // Don't show other options if "All" is selected in either initialData or selectedOptions
    const hasAllInInitial = initialData?.project_typology?.some(
      (item) => item.toLowerCase() === "all"
    );
    const hasAllInSelected = selectedOptions.project_typology?.some(
      (item) => item.toLowerCase() === "all"
    );

    return (
      <div className="excel_select_search_wrapper">
        <div className={`${style.steps} ${style.fastep04}`}>
          <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
            <div className={`${style.field_wrapper} field_wrapper`}>
              <div className="search_select_wrapper">
                <AutoCompleteOthers
                  key={`autokey${autoKey}-project_typology`}
                  lightTheme
                  textLabel="Project Typology"
                  data={servicesData["project_typology"]}
                  onChange={(e, value) => {
                    handleOptionChange(value.value, "project_typology");
                    setAutoKey((prev) => prev + 1);
                  }}
                />
              </div>
              <ul className="checkboxes chips_b_edit_autoComplete">
                {initialData?.project_typology?.map((value, index) => (
                  <li
                    className="black_border_chips_custom"
                    key={`typology-chip-${index}`}
                    onClick={() => handleRemove(value, "project_typology")}
                  >
                    {value}
                    <img src={blackClose} alt="close" className="close_icon" />
                  </li>
                ))}
                {selectedList}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Updated Design Styles section render function
  const renderDesignStylesSection = () => {
    const selectedList = selectedOptions.design_styles.map((option, i) => (
      <CheckboxButton
        lightTheme
        isChecked={true}
        label={option}
        labelId={option}
        onChange={() => handleCheckboxChange(i, option, "design_styles")}
        key={`style-${i}`}
      />
    ));

    // Don't show other options if "All" is selected in either initialData or selectedOptions
    const hasAllInInitial = initialData?.design_styles?.some(
      (item) => item.toLowerCase() === "all"
    );
    const hasAllInSelected = selectedOptions.design_styles?.some(
      (item) => item.toLowerCase() === "all"
    );

    return (
      <div className="excel_select_search_wrapper">
        <div className={`${style.steps} ${style.fastep04}`}>
          <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
            <div className={`${style.field_wrapper} field_wrapper`}>
              <div className="search_select_wrapper">
                <AutoCompleteOthers
                  key={`autokey${autoKey}-design_styles`}
                  lightTheme
                  textLabel="Design Styles"
                  data={servicesData["design_styles"]}
                  onChange={(e, value) => {
                    handleOptionChange(value.value, "design_styles");
                    setAutoKey((prev) => prev + 1);
                  }}
                />
              </div>
              <ul className="checkboxes chips_b_edit_autoComplete">
                {initialData?.design_styles?.map((value, index) => (
                  <li
                    className="black_border_chips_custom"
                    key={`style-chip-${index}`}
                    onClick={() => handleRemove(value, "design_styles")}
                  >
                    {value}
                    <img src={blackClose} alt="close" className="close_icon" />
                  </li>
                ))}
                {selectedList}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const shouldRenderField = (fieldKey) => {
    if (!workflowQuestions || !data?.business_types) {
      return false;
    }

    const question = workflowQuestions.find((q) => q.question === fieldKey);
    if (!question) {
      return false;
    }

    const userBusinessTypeIds = data.business_types.map((bt) => bt._id);
    const questionBusinessTypeIds = question.business_types.map((bt) => bt._id);

    return userBusinessTypeIds.some((id) =>
      questionBusinessTypeIds.includes(id)
    );
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      centered
      className="excel_popup where_we_excel--modal"
      backdropClassName="custom-backdrop"
    >
      <Modal.Header>
        <button className="custom-cancel-btn" onClick={handleModalClose}>
          <img
            src={modalCloseIcon}
            alt="close-icon"
            className="ctm_img_bussine_edit_about"
          />
        </button>
      </Modal.Header>
      <Modal.Body>
        <h2 className="about_modal_bussines_heading">Where We Excel</h2>
        <div className="excel_select_container">
          {/* Can do Projects */}
          {shouldRenderField("location_preference") && (
            <div className="excel_select_wrapper">
              <AutoCompleteField
                lightTheme
                key="project_locations"
                textLabel="Can do Projects"
                data={
                  globalData?.project_locations?.map((it) => ({
                    label: it,
                    value: it,
                  })) || []
                }
                value={
                  globalData?.project_locations
                    ?.map((it) => ({
                      label: it,
                      value: it,
                    }))
                    .find(
                      (option) => option.value === formData.project_locations
                    ) || null
                }
                onChange={(e, option) =>
                  handleSelectChange(option?.value || "", "project_locations")
                }
              />
            </div>
          )}
          {/* Renovation Work */}
          {shouldRenderField("renovation_work") && (
            <div className="excel_select_wrapper">
              <AutoCompleteField
                lightTheme
                key="renovation_work"
                textLabel="Renovation Work"
                data={[
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                ]}
                value={
                  formData.renovation_work
                    ? [
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                      ].find(
                        (option) => option.value === formData.renovation_work
                      ) || null
                    : null
                }
                onChange={(e, option) =>
                  handleSelectChange(option?.value || "", "renovation_work")
                }
              />
            </div>
          )}

          {shouldRenderField("project_typology") &&
            renderProjectTypologySection()}
          {shouldRenderField("service_design_style") &&
            renderDesignStylesSection()}

          {shouldRenderField("minimum_project_size") && (
            <div className="excel_select2field_wrapper">
              <div className="excel_select_wrapper mb-0">
                <AutoCompleteOthers
                  lightTheme
                  key={`autokey${autoKey}-project_sizes`}
                  textLabel="Minimum Project Size"
                  data={filteredSizes}
                  onChange={(e, value) => {
                    handleOptionChange(value.value, "project_sizes");
                    setAutoKey((prev) => prev + 1);
                  }}
                  allowAddOption={false}
                />
              </div>
              <div className="excel_select_wrapper mb-0">
                <AutoCompleteField
                  lightTheme
                  key="project_size_unit"
                  textLabel="Unit"
                  data={
                    _.uniqBy(globalData?.project_sizes, "unit")?.map(
                      (item) => ({
                        label: item.unit,
                        value: item.unit,
                      })
                    ) || []
                  }
                  value={
                    _.uniqBy(globalData?.project_sizes, "unit")
                      ?.map((item) => ({
                        label: item.unit,
                        value: item.unit,
                      }))
                      .find(
                        (option) => option.value === formData.project_size_unit
                      ) || null
                  }
                  onChange={(e, option) =>
                    handleSelectChange(option?.value || "", "project_size_unit")
                  }
                  className="modal_autocomplete--excel-popup"
                  PopperComponent={(props) => (
                    <Popper
                      {...props}
                      container={document.querySelector(
                        ".modal_autocomplete--excel-popup"
                      )}
                    />
                  )}
                />
              </div>
            </div>
          )}
          {shouldRenderField("minimum_project_size") &&
            renderProjectSizesSection()}
          {/* Approx Budget of Projects */}
          {shouldRenderField("average_budget") && (
            <div className="excel_select2field_wrapper">
              <div className="excel_select_wrapper mb-0">
                <AutoCompleteOthers
                  lightTheme
                  key={`autokey${autoKey}-avg_project_budget`}
                  textLabel="Approx Budget of Projects"
                  data={filteredBudgets}
                  onChange={(e, value) => {
                    handleOptionChange(value.value, "avg_project_budget");
                    setAutoKey((prev) => prev + 1);
                  }}
                  allowAddOption={false}
                />
              </div>
              <div className="excel_select_wrapper mb-0">
                <AutoCompleteField
                  lightTheme
                  key="avg_project_currency"
                  textLabel="Currency"
                  data={
                    _.uniqBy(globalData?.average_budget, "currency")?.map(
                      (item) => ({
                        label: item.currency,
                        value: item.currency,
                      })
                    ) || []
                  }
                  value={
                    _.uniqBy(globalData?.average_budget, "currency")
                      ?.map((item) => ({
                        label: item.currency,
                        value: item.currency,
                      }))
                      .find(
                        (option) =>
                          option.value === formData.avg_project_currency
                      ) || null
                  }
                  onChange={(e, option) =>
                    handleSelectChange(
                      option?.value || "",
                      "avg_project_currency"
                    )
                  }
                  className="modal_autocomplete--excel-popup"
                  PopperComponent={(props) => (
                    <Popper
                      {...props}
                      container={document.querySelector(
                        ".modal_autocomplete--excel-popup"
                      )}
                    />
                  )}
                />
              </div>
            </div>
          )}
          {shouldRenderField("average_budget") && renderBudgetSection()}
          {/* Current Minimum Project Sizes */}

          {shouldRenderField("current_minimal_fee") && (
            <div className="excel_select2field_wrapper">
              <div className="excel_select_wrapper mb-0">
                <AutoCompleteField
                  lightTheme
                  key={`minimal_fee`}
                  textLabel="Current Minimum Project Fee"
                  data={servicesData.minimal_fee || []}
                  value={
                    formData.project_mimimal_fee
                      ? {
                          label: formData.project_mimimal_fee,
                          value: formData.project_mimimal_fee,
                        }
                      : null
                  }
                  onChange={(e, option) => {
                    if (option) {
                      setFormData((prev) => ({
                        ...prev,
                        project_mimimal_fee: option.value,
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        project_mimimal_fee: "",
                      }));
                    }
                  }}
                />
              </div>
              <div className="excel_select_wrapper mb-0">
                <AutoCompleteField
                  lightTheme
                  key="project_minimal_fee_currency"
                  textLabel="Currency"
                  data={[
                    { label: "INR", value: "INR" },
                    { label: "USD", value: "USD" },
                  ]}
                  value={
                    formData.project_minimal_fee_currency
                      ? {
                          label: formData.project_minimal_fee_currency,
                          value: formData.project_minimal_fee_currency,
                        }
                      : null
                  }
                  onChange={(e, option) => {
                    if (option) {
                      if (option.value === originalMinimalFee.currency) {
                        setFormData((prev) => ({
                          ...prev,
                          project_minimal_fee_currency: option.value,
                          project_mimimal_fee: originalMinimalFee.fee,
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          project_minimal_fee_currency: option.value,
                          project_mimimal_fee: "",
                        }));
                      }
                    }
                  }}
                  className="modal_autocomplete--excel-popup"
                  PopperComponent={(props) => (
                    <Popper
                      {...props}
                      container={document.querySelector(
                        ".modal_autocomplete--excel-popup"
                      )}
                    />
                  )}
                />
              </div>
            </div>
          )}
          {/* {renderProjectSizesSection()} */}
        </div>

        <button
          type="submit"
          className="popup_common_btn"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default ExcelPopup;
