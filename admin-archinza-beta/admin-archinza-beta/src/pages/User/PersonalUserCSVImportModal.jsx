import React, { useEffect, useState } from "react";
import { Modal, Button, Upload, message, Spin, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import http from "../../helpers/http";
import config from "../../config/config";
import helper from "../../helpers/helper";

const PersonalUserCSVImportModal = ({ open, onClose, admin }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customOptions, setCustomOptions] = useState(null);
  const baseUrl = config.api_url;

  const userTypes = {
    DE: "DE",
    BO: "BO",
    WP: "TM", // WP will be converted to TM
    ST: "ST",
    FL: "FL",
  };

  const headerToFieldMap = {
    name: "name",
    email: "email",
    "user type": "user_type",
    "phone number": "phone",
    "whatsapp number": "whatsapp_no",
    "country code": "country_code",
    "whatsapp country code": "whatsapp_country_code",
    country: "country",
    city: "city",
    pincode: "pincode",
    // Pro user questions
    "what is your field of study?": "st_study_field",
    "please tell us the year you will graduate": "st_graduate_year",
    "tell us about your largest concern/unmet needs": "st_unmet_needs",
    //"all unmet needs": "all_unmet_needs_flag", // Removed generic flag
    "all st unmet needs": "all_st_unmet_needs_flag",
    "all bo unmet needs": "all_bo_unmet_needs_flag",
    "all fl unmet needs": "all_fl_unmet_needs_flag",
    "all tm unmet needs": "all_tm_unmet_needs_flag",
    "how long your business/firm has been established": "bo_buss_establishment",
    "what is your largest concern or unmet need at your work/business/firm ?":
      "bo_unmet_needs",
    "how long your business/firm has been established (fl)": "fl_establishment",
    "what is your largest concern or unmet need at your work/business/firm ? (fl)":
      "fl_unmet_needs",
    "what is your current/past job profile/s?": "tm_job_profile",
    "please tell us how many years of experience do you have": "tm_experience",
    "tell us about your largest concern/unmet needs (tm)": "tm_unmet_needs",
  };

  const expectedHeaders = ["name", "email", "phone number", "user type"];

  const handleFileChange = (info) => {
    if (info.file.status !== "uploading") {
      setFile(info.file);
      parseCSV(info.file);
    }
  };

  const fetchCustomOptions = async () => {
    const { data } = await http.get(`${baseUrl}admin/content/options`);
    setCustomOptions(data);
    console.log(data);
  };

  const normalizeValueToCustomOption = (fieldName, inputValue) => {
    if (!customOptions || !inputValue) return inputValue;

    const fieldOptions = customOptions[fieldName];
    if (!fieldOptions || !Array.isArray(fieldOptions)) return inputValue;

    // Normalize function (same as in validation)
    const normalizeString = (str) => {
      return str
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/\s*\/\s*/g, "/")
        .replace(/\s*-\s*/g, "-")
        .replace(/\s*\(\s*/g, "(")
        .replace(/\s*\)\s*/g, ")")
        .replace(/\s*&\s*/g, "&")
        .trim();
    };

    const normalizedInput = normalizeString(inputValue);
    const matchedOption = fieldOptions.find((option) => {
      const normalizedOption = normalizeString(option);
      return normalizedOption === normalizedInput;
    });

    return matchedOption || inputValue; // Return exact match or original if not found
  };

  const validateCustomFieldOptions = (fieldName, value, errors) => {
    if (!customOptions || !value) return;

    const fieldOptions = customOptions[fieldName];
    if (!fieldOptions || !Array.isArray(fieldOptions)) return;

    // Convert value to array if it's a string (split by comma)
    const valuesArray = Array.isArray(value)
      ? value
      : value.includes(",")
      ? value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item)
      : [value.trim()].filter((item) => item);

    const normalizeString = (str) => {
      return str
        .toLowerCase()
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .replace(/\s*\/\s*/g, "/") // Remove spaces around forward slashes
        .replace(/\s*-\s*/g, "-") // Remove spaces around hyphens
        .replace(/\s*\(\s*/g, "(") // Remove spaces around opening parentheses
        .replace(/\s*\)\s*/g, ")") // Remove spaces around closing parentheses
        .replace(/\s*&\s*/g, "&") // Remove spaces around ampersands
        .trim();
    };

    // Check if all values exist in the options
    const invalidOptions = valuesArray.filter((val) => {
      const normalizedVal = normalizeString(val);
      return !fieldOptions.some((option) => {
        const normalizedOption = normalizeString(option);
        return normalizedOption === normalizedVal;
      });
    });

    if (invalidOptions.length > 0) {
      const fieldDisplayName =
        Object.keys(headerToFieldMap).find(
          (key) => headerToFieldMap[key] === fieldName
        ) || fieldName;

      errors.push(
        `Invalid option(s) for "${helper.convertToTitleCase(
          fieldDisplayName
        )}": ${invalidOptions.join(
          ", "
        )}. Valid options are: ${fieldOptions.join(", ")}`
      );
    }
  };

  const parseCSV = async (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {
          type: "array",
          raw: false, // Changed to false to prevent scientific notation
          codepage: 65001,
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          raw: false, // Changed to false to prevent scientific notation
        });

        if (rawData.length === 0) {
          message.error("CSV file is empty.");
          setLoading(false);
          return;
        }

        const rawHeaders = rawData[0];
        const normalizedHeaders = rawHeaders.map((header) =>
          String(header || "")
            .replace(/^\uFEFF/, "") // Remove BOM
            .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width characters
            .toLowerCase()
            .trim()
        );

        console.log("Raw headers from CSV:", rawHeaders);
        console.log("Normalized headers:", normalizedHeaders);
        console.log(
          "Header to field mapping:",
          normalizedHeaders.map((h) => ({
            header: h,
            field: headerToFieldMap[h],
          }))
        );

        const missingHeaders = expectedHeaders.filter(
          (h) => !normalizedHeaders.includes(h)
        );

        if (missingHeaders.length > 0) {
          message.error(
            `The following headers are missing: ${missingHeaders.join(", ")}`
          );
          setParsedData([]);
          setFile(null);
          setLoading(false);
          return;
        }

        const dataRows = rawData.slice(1);
        const usedEmails = new Set();
        const usedPhones = new Set();

        const transformedData = dataRows
          .filter((row) => row.some((cell) => String(cell).trim()))
          .map((row, index) => {
            const newRow = { _key: `row-${index}` };
            const errors = [];

            normalizedHeaders.forEach((header, columnIndex) => {
              const fieldName = headerToFieldMap[header];
              if (fieldName) {
                newRow[fieldName] = row[columnIndex]
                  ? String(row[columnIndex]).trim()
                  : "";
              }
            });

            // Validation
            if (!newRow.name) {
              errors.push("Name is required.");
            }

            if (!newRow.email) {
              errors.push("Email is required.");
            } else if (!/\S+@\S+\.\S+/.test(newRow.email)) {
              errors.push("Email is not in a valid format.");
            } else if (usedEmails.has(newRow.email.toLowerCase())) {
              errors.push("Email must be unique (duplicate found).");
            } else {
              usedEmails.add(newRow.email.toLowerCase());
            }

            if (!newRow.phone) {
              errors.push("Phone Number is required.");
            } else {
              // Remove spaces and convert to string to handle scientific notation
              const phoneStr = String(newRow.phone).replace(/\s/g, "");

              if (usedPhones.has(phoneStr)) {
                errors.push("Phone number must be unique (duplicate found).");
              } else {
                usedPhones.add(phoneStr);
              }
            }

            // Handle WhatsApp number
            if (newRow.whatsapp_no) {
              const whatsappStr = String(newRow.whatsapp_no).replace(/\s/g, "");
            }

            if (!newRow.user_type) {
              errors.push("User Type is required.");
            } else if (!userTypes[newRow.user_type]) {
              errors.push(
                `Invalid User Type. Must be one of: ${Object.keys(
                  userTypes
                ).join(", ")}`
              );
            }

            // Handle pro user questions and status
            if (newRow.user_type && newRow.user_type !== "DE") {
              const proEntry = {};
              let filledCount = 0;
              let totalFields = 0;

              const allUnmetNeedsFlag =
                newRow.all_unmet_needs_flag &&
                newRow.all_unmet_needs_flag.toString().toLowerCase() === "true";

              // Handle arrays and validation for all fields
              const handleFieldWithValidation = (field, isArray = false) => {
                if (newRow[field]) {
                  let processedValue;

                  if (isArray) {
                    processedValue = newRow[field].includes(",")
                      ? newRow[field]
                          .split(",")
                          .map((item) => item.trim())
                          .filter((item) => item)
                      : [newRow[field].trim()].filter((item) => item);

                    processedValue = processedValue.map((value) =>
                      normalizeValueToCustomOption(field, value)
                    );

                    proEntry[field] = processedValue;
                    validateCustomFieldOptions(field, processedValue, errors);
                    return processedValue.length > 0 ? 1 : 0;
                  } else {
                    processedValue = newRow[field].trim();
                    processedValue = normalizeValueToCustomOption(
                      field,
                      processedValue
                    );
                    proEntry[field] = processedValue;
                    validateCustomFieldOptions(field, processedValue, errors);
                    return processedValue ? 1 : 0;
                  }
                }

                if (isArray) {
                  proEntry[field] = [];
                }
                return 0;
              };

              const handleUnmetNeedsWithFlag = (
                unmetNeedsField,
                allUnmetNeedsArrayField,
                allUnmetNeedsFlag
              ) => {
                if (allUnmetNeedsFlag) {
                  // Set unmet_needs to "All of the Above"
                  proEntry[unmetNeedsField] = "All of the Above";

                  // Set the all_* field with all available options
                  const fieldOptions = customOptions?.[unmetNeedsField];
                  if (fieldOptions && Array.isArray(fieldOptions)) {
                    proEntry[allUnmetNeedsArrayField] = [...fieldOptions];
                  } else {
                    proEntry[allUnmetNeedsArrayField] = [];
                  }

                  return 1; // Field is filled
                } else {
                  // Handle as single string field
                  const filled = handleFieldWithValidation(
                    unmetNeedsField,
                    false
                  );
                  // Set empty array for all_* field when not "All of the Above"
                  proEntry[allUnmetNeedsArrayField] = [];
                  return filled;
                }
              };

              if (newRow.user_type === "ST") {
                totalFields = 3;
                filledCount += handleFieldWithValidation(
                  "st_study_field",
                  true
                );
                filledCount += handleFieldWithValidation("st_graduate_year");
                const allStUnmetNeedsFlag =
                  newRow.all_st_unmet_needs_flag &&
                  newRow.all_st_unmet_needs_flag.toString().toLowerCase() ===
                    "true";
                filledCount += handleUnmetNeedsWithFlag(
                  "st_unmet_needs",
                  "all_st_unmet_needs",
                  allStUnmetNeedsFlag
                );
              } else if (newRow.user_type === "BO") {
                totalFields = 2;
                const allBoUnmetNeedsFlag =
                  newRow.all_bo_unmet_needs_flag &&
                  newRow.all_bo_unmet_needs_flag.toString().toLowerCase() ===
                    "true";
                filledCount += handleFieldWithValidation(
                  "bo_buss_establishment"
                );
                filledCount += handleUnmetNeedsWithFlag(
                  "bo_unmet_needs",
                  "all_bo_unmet_needs",
                  allBoUnmetNeedsFlag
                );
              } else if (newRow.user_type === "FL") {
                totalFields = 2;
                const allFlUnmetNeedsFlag =
                  newRow.all_fl_unmet_needs_flag &&
                  newRow.all_fl_unmet_needs_flag.toString().toLowerCase() ===
                    "true";
                filledCount += handleFieldWithValidation("fl_establishment");
                filledCount += handleUnmetNeedsWithFlag(
                  "fl_unmet_needs",
                  "all_fl_unmet_needs",
                  allFlUnmetNeedsFlag
                );
              } else if (newRow.user_type === "WP") {
                totalFields = 3;
                filledCount += handleFieldWithValidation(
                  "tm_job_profile",
                  true
                );
                filledCount += handleFieldWithValidation("tm_experience");
                const allTmUnmetNeedsFlag =
                  newRow.all_tm_unmet_needs_flag &&
                  newRow.all_tm_unmet_needs_flag.toString().toLowerCase() ===
                    "true";
                filledCount += handleUnmetNeedsWithFlag(
                  "tm_unmet_needs",
                  "all_tm_unmet_needs",
                  allTmUnmetNeedsFlag
                );
              }

              // Determine status
              if (filledCount === totalFields) {
                proEntry.status = "completed";
              } else if (filledCount > 0) {
                proEntry.status = Math.min(filledCount, 3);
              } else {
                proEntry.status = "registered";
              }

              newRow.proEntry = proEntry;

              // Remove pro fields from main object
              [
                "st_study_field",
                "st_graduate_year",
                "st_unmet_needs",
                "bo_buss_establishment",
                "bo_unmet_needs",
                "fl_establishment",
                "fl_unmet_needs",
                "tm_job_profile",
                "tm_experience",
                "tm_unmet_needs",
                //"all_unmet_needs_flag", // Remove the single flag
                "all_st_unmet_needs_flag",
                "all_bo_unmet_needs_flag",
                "all_fl_unmet_needs_flag",
                "all_tm_unmet_needs_flag",
              ].forEach((field) => {
                delete newRow[field];
              });
            }

            if (errors.length > 0) {
              newRow._errors = errors;
            }
            return newRow;
          });
        // Server-side duplicate check
        const emails = transformedData.map((r) => r.email).filter(Boolean);
        const phones = transformedData
          .map((r) => ({ phone: r.phone, country_code: r.country_code }))
          .filter((p) => p.phone);

        if (emails.length > 0 || phones.length > 0) {
          try {
            const { data } = await http.post(
              `${baseUrl}admin/content/options/check-duplicates`,
              { emails, phones }
            );
            console.log(data);
            const duplicateEmailSet = new Set(
              data.duplicateEmails?.map((e) => e.item.toLowerCase()) || []
            );
            const duplicatePhoneSet = new Set(
              data.duplicatePhones?.map(
                (p) => `${p.item.country_code}${p.item.phone}`
              ) || []
            );

            if (duplicateEmailSet.size > 0 || duplicatePhoneSet.size > 0) {
              transformedData.forEach((row) => {
                if (
                  row.email &&
                  duplicateEmailSet.has(row.email.toLowerCase())
                ) {
                  if (!row._errors) row._errors = [];
                  row._errors.push("Email already exists in the system.");
                }
                const phoneIdentifier = `${row.country_code || ""}${row.phone}`;
                if (row.phone && duplicatePhoneSet.has(phoneIdentifier)) {
                  if (!row._errors) row._errors = [];
                  row._errors.push(
                    "Phone number already exists in the system."
                  );
                }
              });
            }
          } catch (error) {
            message.error("Could not verify duplicates. Please try again.");
            setLoading(false);
            return;
          }
        }

        setParsedData(transformedData);
        setLoading(false);
      } catch (error) {
        message.error("Error parsing CSV file.");
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (parsedData.length === 0) {
      message.error("No data to import.");
      return;
    }
    setLoading(true);

    const usersToImport = parsedData.map((row) => {
      const { _key, _errors, ...rest } = row;
      return {
        ...rest,
        user_type: userTypes[rest.user_type], // Convert WP to TM
      };
    });
    try {
      const response = await http.post(`${baseUrl}admin/users/bulk-upload`, {
        users: usersToImport,
      });
      if (response?.data) {
        message.success("Users imported successfully.");
        onClose();
        http.post(`${config.api_url}admin/logs`, {
          user: admin?.id,
          action_type: "BULK_CREATE",
          module: "Personal",
          subModule: "Registered Users",
          details: helper.captureBasicUserDetailsPersonal(usersToImport),
          status: "SUCCESS",
        });
      } else {
        http.post(`${config.api_url}admin/logs`, {
          user: admin?.id,
          action_type: "BULK_CREATE",
          module: "Personal",
          subModule: "Registered Users",
          details: helper.captureBasicUserDetailsPersonal(usersToImport),
          status: "FAILURE",
        });
      }
    } catch (error) {
      message.error("Failed to import users.");
    } finally {
      setLoading(false);
      setParsedData([]);
      setFile(null);
    }
  };

  const hasErrors = parsedData.some(
    (row) => row._errors && row._errors.length > 0
  );

  const allProEntryFields = [
    "st_study_field",
    "st_graduate_year",
    "st_unmet_needs",
    "all_st_unmet_needs", // Array field
    "bo_buss_establishment",
    "bo_unmet_needs",
    "all_bo_unmet_needs", // Array field
    "fl_establishment",
    "fl_unmet_needs",
    "all_fl_unmet_needs", // Array field
    "tm_job_profile",
    "tm_experience",
    "tm_unmet_needs",
    "all_tm_unmet_needs", // Array field
    "status",
  ];

  // Reverse headerToFieldMap to map fields back to original headers
  const fieldToHeaderMap = Object.fromEntries(
    Object.entries(headerToFieldMap).map(([header, field]) => [field, header])
  );

  const getOrderedColumns = () => {
    const baseColumns = [
      "name",
      "email",
      "user_type",
      "phone",
      "whatsapp_no",
      "country",
      "city",
      "pincode",
    ];

    // Define the logical order for pro fields
    const proColumns = [
      // ST fields
      "st_study_field",
      "st_graduate_year",
      "st_unmet_needs",
      "all_st_unmet_needs",

      // TM fields
      "tm_job_profile",
      "tm_experience",
      "tm_unmet_needs",
      "all_tm_unmet_needs",

      // BO fields
      "bo_buss_establishment",
      "bo_unmet_needs",
      "all_bo_unmet_needs",

      // FL fields
      "fl_establishment",
      "fl_unmet_needs",
      "all_fl_unmet_needs",

      "status",
    ];

    return [...baseColumns, ...proColumns];
  };

  const columns =
    parsedData.length > 0
      ? getOrderedColumns()
          .filter(
            (key) =>
              key !== "country_code" &&
              key !== "whatsapp_country_code" &&
              key !== "proEntry"
          )
          .map((key) => {
            const column = {
              title: fieldToHeaderMap[key]
                ? fieldToHeaderMap[key].replace(/\b\w/g, (l) => l.toUpperCase())
                : key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()),
              dataIndex: key,
              key: key,
              width: allProEntryFields.includes(key) ? 250 : 150,
              ellipsis: true,
            };

            // Handle phone rendering
            if (key === "phone") {
              column.render = (text, record) =>
                `${record.country_code || ""}${text}`;
            }

            if (key === "whatsapp_no") {
              column.render = (text, record) =>
                `${record.whatsapp_country_code || ""}${text}`;
            }

            // Handle pro entry fields
            if (allProEntryFields.includes(key)) {
              column.dataIndex = ["proEntry", key];
              column.render = (text) => {
                if (Array.isArray(text)) {
                  return text.join(", ");
                }
                return text || "";
              };

              // Only show for relevant user types
              // Inside the columns map, for allProEntryFields.includes(key)
              column.render = (text, record) => {
                const userType = record.user_type;
                const shouldShow =
                  ((key.startsWith("st_") || key === "all_st_unmet_needs") &&
                    userType === "ST") ||
                  ((key.startsWith("tm_") || key === "all_tm_unmet_needs") &&
                    userType === "WP") ||
                  ((key.startsWith("bo_") || key === "all_bo_unmet_needs") &&
                    userType === "BO") ||
                  ((key.startsWith("fl_") || key === "all_fl_unmet_needs") &&
                    userType === "FL") ||
                  key === "status";

                if (!shouldShow) return "";

                if (Array.isArray(text)) {
                  return text.join(", ");
                }
                return text || "";
              };
            }

            return column;
          })
          .filter((col) => col) // Remove any null columns
      : [];

  if (hasErrors) {
    columns.push({
      title: "Errors",
      key: "errors",
      dataIndex: "_errors",
      width: 200,
      render: (errors) => (
        <div style={{ color: "red" }}>
          {errors?.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      ),
    });
  }

  useEffect(() => {
    fetchCustomOptions();
  }, []);

  return (
    <Modal
      title="Import Users from CSV"
      open={open}
      onCancel={onClose}
      width={1200}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          disabled={!file || parsedData.length === 0 || hasErrors}
        >
          Import Users ({parsedData.length} records)
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <div style={{ marginBottom: 16 }}>
          <Upload
            name="file"
            beforeUpload={() => false}
            onChange={handleFileChange}
            maxCount={1}
            accept=".csv,.xlsx,.xls"
            showUploadList={{ showRemoveIcon: true }}
          >
            <Button icon={<UploadOutlined />}>Select CSV/Excel File</Button>
          </Upload>
          <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
            Supported formats: CSV, Excel (.xlsx, .xls)
          </div>
        </div>

        {parsedData.length > 0 && (
          <>
            <div style={{ marginBottom: 16 }}>
              <strong>Data Preview:</strong> {parsedData.length} records found
              {hasErrors && (
                <div style={{ color: "red", marginLeft: 16, marginTop: 8 }}>
                  <strong>⚠️ Validation Errors Found:</strong>
                  <div style={{ margin: "4px 0" }}>
                    {(() => {
                      const errorsByType = {};
                      parsedData.forEach((row, index) => {
                        if (row._errors) {
                          row._errors.forEach((error) => {
                            if (!errorsByType[error]) {
                              errorsByType[error] = [];
                            }
                            errorsByType[error].push(index + 1); // +1 for human-readable row numbers
                          });
                        }
                      });

                      return Object.entries(errorsByType).map(
                        ([error, rows]) => (
                          <div
                            key={error}
                            style={{ fontSize: "12px", marginBottom: "2px" }}
                          >
                            • {error} - Rows: {rows.slice(0, 5).join(", ")}
                            {rows.length > 5 ? ` +${rows.length - 5} more` : ""}
                          </div>
                        )
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
            <Table
              dataSource={parsedData}
              columns={columns}
              rowKey="_key"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} records`,
              }}
              scroll={{ x: "max-content", y: 400 }}
              rowClassName={(record) =>
                record._errors ? "ant-table-row-level-0" : ""
              }
              size="small"
            />
          </>
        )}
      </Spin>
      {/* <style jsx>{`
        .ant-table-row-level-0.ant-table-row:hover > td {
          background-color: #fff2f0 !important;
        }
      `}</style> */}
    </Modal>
  );
};

export default PersonalUserCSVImportModal;
