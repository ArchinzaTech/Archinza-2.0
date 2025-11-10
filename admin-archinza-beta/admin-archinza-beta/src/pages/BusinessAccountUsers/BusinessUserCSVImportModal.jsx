import React, { useEffect, useState } from "react";
import { Modal, Button, Upload, message, Spin, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import http from "../../helpers/http";
import config from "../../config/config";

const BusinessUserCSVImportModal = ({ open, onClose, admin }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [customOptions, setCustomOptions] = useState({
    options: {},
    services: [],
  });
  const [loading, setLoading] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const baseUrl = config.api_url;

  const fetchBusinessTypes = async () => {
    try {
      const data = await http.get(baseUrl + "admin/content/business-types");
      if (data?.data) {
        setBusinessTypes(data.data);
      }
    } catch (error) {
      message.error("Could not fetch business types for validation.");
      console.error("Error fetching business types:", error);
    }
  };

  const fetchInitialData = async () => {
    const [countriesResponse, citiesResponse] = await Promise.all([
      http.get(`${baseUrl}general/countries`),
      http.get(`${baseUrl}general/cities-by-country/101`),
    ]);

    if (countriesResponse?.data) {
      setCountries(
        countriesResponse.data.map((item) => ({
          key: item.id,
          label: item.name,
          value: item.id,
        }))
      );
    }

    if (citiesResponse?.data) {
      setCities(
        citiesResponse.data.map((item) => ({
          key: item.id,
          label: item.name,
          value: item.id,
        }))
      );
    }
  };

  const findCountryByName = (countryName, countriesData) => {
    if (!countryName || !countriesData.length) return null;

    const normalizedInput = countryName.toLowerCase().trim();
    return countriesData.find(
      (country) => country.label.toLowerCase() === normalizedInput
    );
  };

  const findServiceByValue = (serviceValue, servicesData) => {
    if (!serviceValue || !servicesData.length) return null;

    const normalizedInput = serviceValue.toLowerCase().trim();
    return servicesData.find(
      (service) => service.value.toLowerCase() === normalizedInput
    );
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const parseProjectSizes = (projectSizesString) => {
    if (!projectSizesString) return { sizes: [], unit: "" };

    const parts = projectSizesString.split(";").map((part) => part.trim());
    if (parts.length !== 2) return { sizes: [], unit: "" };

    const sizesStr = parts[0];
    const unit = parts[1];

    const sizes = sizesStr
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);

    return { sizes, unit };
  };

  const parseAvgProjectBudget = (budgetString) => {
    if (!budgetString) return { budgets: [], currency: "" };

    const parts = budgetString.split(";").map((part) => part.trim());
    if (parts.length !== 2) return { budgets: [], currency: "" };

    const budgetsStr = parts[0];
    const currency = parts[1];

    const budgets = budgetsStr
      .split(",")
      .map((budget) => budget.trim())
      .filter(Boolean);

    return { budgets, currency };
  };

  const validateWebsiteLink = (url) => {
    if (!url) return null;

    const trimmedUrl = url.trim();

    // If it already has protocol, validate as is
    if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
      return isValidURL(trimmedUrl) ? trimmedUrl : null;
    }

    // Try adding https://
    const withHttps = `https://${trimmedUrl}`;
    if (isValidURL(withHttps)) {
      return withHttps;
    }

    return null;
  };

  const validateInstagramLink = (input) => {
    if (!input) return null;

    const trimmedInput = input.trim();

    // If it's already a full URL and valid
    if (trimmedInput.includes("instagram.com")) {
      return isValidURL(trimmedInput) ? trimmedInput : null;
    }

    // Extract username (remove @ if present)
    let username = trimmedInput.startsWith("@")
      ? trimmedInput.substring(1)
      : trimmedInput;
    username = username.trim();

    // Basic username validation (alphanumeric, dots, underscores)
    if (!/^[a-zA-Z0-9._]+$/.test(username) || username.length === 0) {
      return null;
    }

    return `https://www.instagram.com/${username}`;
  };

  const validateLinkedinLink = (input) => {
    if (!input) return null;

    const trimmedInput = input.trim();

    // If it's already a full URL and valid
    if (trimmedInput.includes("linkedin.com")) {
      return isValidURL(trimmedInput) ? trimmedInput : null;
    }

    // Check if it contains @ (not allowed for LinkedIn)
    if (trimmedInput.includes("@")) {
      return null;
    }

    // Basic handle validation (alphanumeric and hyphens)
    if (!/^[a-zA-Z0-9-]+$/.test(trimmedInput) || trimmedInput.length === 0) {
      return null;
    }

    return `https://www.linkedin.com/in/${trimmedInput}`;
  };

  const fetchBusinessOptions = async () => {
    const [options, services] = await Promise.all([
      http.get(`${baseUrl}business/options`),
      http.get(`${baseUrl}services`),
    ]);

    if (options?.data && services?.data) {
      setCustomOptions({ options: options?.data, services: services.data });
    }
  };

  const headerToFieldMap = {
    "business name": "business_name",
    "business types": "business_types",
    country: "country",
    city: "city",
    pincode: "pincode",
    email: "email",
    username: "username",
    "phone number": "phone_number",
    "whatsapp number": "whatsapp_number",
    owners: "owners",
    services: "services",
    "featured services": "featured_services",
    "company profile media": "company_profile_media",
    "product catalogue media": "product_catalogues_media",
    "products/materials": "completed_products_media",
    "projects photos and renders": "project_renders_media",
    "sites in progress": "sites_inprogress_media",
    "workplace media": "workplace_media",
    "employees range": "team_range",
    "establishment year": "establishment_year",
    "minimum project fee": "project_mimimal_fee",
    "minimum project sizes": "project_sizes",
    "project locations": "project_location",
    "project typologies": "project_typology",
    "approximate project budget": "avg_project_budget",
    "design styles": "design_style",
    "website link": "website_link",
    "instagram link": "instagram_handle",
    "linkedin link": "linkedin_link",
    // "support emails": "email_ids",
    // "additional addresses": "addresses",
    "enquiry preferences": "enquiry_preferences",
  };

  const expectedHeaders = [
    "business name",
    "business types",
    "country",
    "email",
    "username",
  ];

  const handleFileChange = (info) => {
    if (info.file.status !== "uploading") {
      setFile(info.file);
      parseCSV(info.file);
    }
  };

  const parseCSV = (file) => {
    setLoading(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {
          type: "array",
          raw: false,
          codepage: 65001, // UTF-8 encoding
        });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON array format (array of arrays)
        const rawData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          raw: true,
        });

        console.log("Raw XLSX data:", rawData);

        if (rawData.length === 0) {
          message.error("CSV file is empty.");
          setLoading(false);
          return;
        }

        // Extract and normalize headers
        const rawHeaders = rawData[0];
        const normalizedHeaders = rawHeaders.map((header) =>
          String(header || "")
            .replace(/^\uFEFF/, "") // Remove BOM
            .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width characters
            .toLowerCase()
            .trim()
        );

        console.log("Raw headers:", rawHeaders);
        console.log("Normalized headers:", normalizedHeaders);
        console.log("Expected headers:", expectedHeaders);

        // Check for missing headers
        const missingHeaders = expectedHeaders.filter(
          (h) => !normalizedHeaders.includes(h)
        );

        if (missingHeaders.length > 0) {
          console.log("Missing headers:", missingHeaders);
          console.log("Available headers:", normalizedHeaders);

          const displayHeaders = missingHeaders.map(
            (h) =>
              Object.keys(headerToFieldMap).find(
                (key) => headerToFieldMap[key] === h
              ) || h
          );
          message.error(
            `The following headers are missing from the CSV file: ${displayHeaders.join(
              ", "
            )}`
          );
          setParsedData([]);
          setFile(null);
          setLoading(false);
          return;
        }

        // Process data rows
        const dataRows = rawData.slice(1); // Skip header row
        const transformedData = dataRows
          .filter((row) => row.some((cell) => cell && String(cell).trim())) // Skip empty rows
          .map((row, index) => {
            const newRow = { _key: `row-${index}` };
            const errors = [];

            // Map each column to the corresponding field
            normalizedHeaders.forEach((header, columnIndex) => {
              const fieldName = headerToFieldMap[header];
              if (fieldName) {
                const cellValue = row[columnIndex];
                newRow[fieldName] = cellValue ? String(cellValue).trim() : "";
              }
            });

            // --- Custom parsing and validation for 'owners' field ---
            if (newRow.owners && typeof newRow.owners === "string") {
              const ownersArray = newRow.owners
                .split("|")
                .map((s) => s.trim())
                .filter(Boolean);

              const parsedOwners = [];
              const ownerErrors = [];

              ownersArray.forEach((ownerData, ownerIndex) => {
                const ownerObj = {};
                const rawOwner = {};

                ownerData
                  .split(";")
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .forEach((part) => {
                    const firstColonIndex = part.indexOf(":");
                    if (firstColonIndex > -1) {
                      const key = part
                        .substring(0, firstColonIndex)
                        .trim()
                        .toLowerCase();
                      const value = part.substring(firstColonIndex + 1).trim();
                      rawOwner[key] = value;
                    }
                  });

                // --- Owner Validation ---
                if (!rawOwner.name) {
                  ownerErrors.push(
                    `Owner #${ownerIndex + 1}: Owner Name is required.`
                  );
                } else {
                  ownerObj.name = rawOwner.name;
                }

                if (!rawOwner.email) {
                  ownerErrors.push(
                    `Owner #${ownerIndex + 1}: Email is required.`
                  );
                } else if (!/\S+@\S+\.\S+/.test(rawOwner.email)) {
                  ownerErrors.push(
                    `Owner #${ownerIndex + 1}: Email format is invalid.`
                  );
                } else {
                  ownerObj.email = rawOwner.email;
                }

                if (rawOwner.phone) {
                  const phoneStr = String(rawOwner.phone).replace(/\s/g, "");
                  ownerObj.country_code = phoneStr.substring(0, 2);
                  ownerObj.phone = phoneStr.substring(2);
                  // if (/^\d{12}$/.test(phoneStr)) {
                  // } else {
                  //   ownerErrors.push(
                  //     `Owner #${
                  //       ownerIndex + 1
                  //     }: Phone must be 12 digits including country code (e.g., 919876543210).`
                  //   );
                  //   ownerObj.phone = rawOwner.phone; // Keep raw value for display
                  // }
                }

                if (rawOwner.whatsapp) {
                  const whatsappStr = String(rawOwner.whatsapp).replace(
                    /\s/g,
                    ""
                  );
                  ownerObj.whatsapp_country_code = whatsappStr.substring(0, 2);
                  ownerObj.whatsapp_no = whatsappStr.substring(2);
                  // if (/^\d{12}$/.test(whatsappStr)) {
                  // } else {
                  //   ownerErrors.push(
                  //     `Owner #${
                  //       ownerIndex + 1
                  //     }: WhatsApp must be 12 digits including country code (e.g., 919876543210).`
                  //   );
                  //   ownerObj.whatsapp_no = rawOwner.whatsapp; // Keep raw value for display
                  // }
                }

                parsedOwners.push(ownerObj);
              });

              if (ownerErrors.length > 0) {
                errors.push(...ownerErrors);
              }

              newRow.owners = parsedOwners; // Replace string with array of objects
            } else if (newRow.owners) {
              // Handle cases where 'owners' might not be a string but exists
              errors.push(
                "Owners field has an invalid format. It should be a text string."
              );
            }

            // --- Custom parsing and validation for 'enquiry_preferences' field ---
            if (
              newRow.enquiry_preferences &&
              typeof newRow.enquiry_preferences === "string"
            ) {
              const enquiryPrefsString = newRow.enquiry_preferences.trim();
              const parsedEnquiryPrefs = {};
              const enquiryErrors = [];

              // Valid values for validation (case-insensitive comparison)
              const validContactPersons = [
                "Owner/s",
                "Business Contact Person",
                "Both",
              ];
              const validContactMethods = [
                "Email Id",
                "WhatsApp",
                "Phone Call",
              ];

              // Schema key mapping from display names to database field names
              const categoryMapping = {
                "projects business": "projects_business",
                "product material": "product_material",
                "jobs internships": "jobs_internships",
                "media pr": "media_pr",
              };

              // Split by "|" to get each category section
              const categorySections = enquiryPrefsString
                .split("|")
                .map((s) => s.trim())
                .filter(Boolean);

              categorySections.forEach((section, sectionIndex) => {
                const categoryObj = {};
                let categoryName = "";

                // Split by ":" to separate category name from its content
                const colonIndex = section.indexOf(":");
                if (colonIndex === -1) {
                  enquiryErrors.push(
                    `Section ${
                      sectionIndex + 1
                    }: Invalid format - missing colon separator for category`
                  );
                  return;
                }

                categoryName = section
                  .substring(0, colonIndex)
                  .trim()
                  .toLowerCase();
                const categoryContent = section
                  .substring(colonIndex + 1)
                  .trim();

                // Validate category name
                if (!categoryMapping[categoryName]) {
                  enquiryErrors.push(
                    `Section ${
                      sectionIndex + 1
                    }: Invalid category "${categoryName}". Valid categories are: ${Object.keys(
                      categoryMapping
                    ).join(", ")}`
                  );
                  return;
                }

                // Split by ";" to get key-value pairs within the category content
                const pairs = categoryContent
                  .split(";")
                  .map((p) => p.trim())
                  .filter(Boolean);

                pairs.forEach((pair) => {
                  const equalIndex = pair.indexOf("=");
                  if (equalIndex === -1) {
                    enquiryErrors.push(
                      `Section ${
                        sectionIndex + 1
                      }: Invalid format - missing equals separator in "${pair}"`
                    );
                    return;
                  }

                  const key = pair
                    .substring(0, equalIndex)
                    .trim()
                    .toLowerCase();
                  const value = pair.substring(equalIndex + 1).trim();

                  if (key === "contact person") {
                    // Validate contact person value (case-insensitive)
                    const matchedPerson = validContactPersons.find(
                      (vp) => vp.toLowerCase() === value.toLowerCase()
                    );

                    if (matchedPerson) {
                      categoryObj.contact_person = matchedPerson; // Store with original case
                    } else {
                      enquiryErrors.push(
                        `Section ${
                          sectionIndex + 1
                        }: Invalid Contact Person "${value}". Valid values are: ${validContactPersons.join(
                          ", "
                        )}`
                      );
                    }
                  } else if (key === "contact methods") {
                    // Parse comma-separated contact methods
                    const methods = value
                      .split(",")
                      .map((m) => m.trim())
                      .filter(Boolean);
                    const validatedMethods = [];

                    methods.forEach((method) => {
                      const matchedMethod = validContactMethods.find(
                        (vm) => vm.toLowerCase() === method.toLowerCase()
                      );

                      if (matchedMethod) {
                        validatedMethods.push(matchedMethod); // Store with original case
                      } else {
                        enquiryErrors.push(
                          `Section ${
                            sectionIndex + 1
                          }: Invalid Contact Method "${method}". Valid values are: ${validContactMethods.join(
                            ", "
                          )}`
                        );
                      }
                    });

                    if (validatedMethods.length > 0) {
                      categoryObj.contact_methods = validatedMethods;
                    }
                  } else {
                    enquiryErrors.push(
                      `Section ${
                        sectionIndex + 1
                      }: Invalid field "${key}". Valid fields are: Contact Person, Contact Methods`
                    );
                  }
                });

                // Add the parsed category to the result if we have valid data
                if (categoryName && categoryMapping[categoryName]) {
                  parsedEnquiryPrefs[categoryMapping[categoryName]] =
                    categoryObj;
                }
              });

              // Validate that we have all required fields for each category
              Object.entries(parsedEnquiryPrefs).forEach(
                ([dbKey, categoryData]) => {
                  const displayName = Object.keys(categoryMapping).find(
                    (k) => categoryMapping[k] === dbKey
                  );

                  if (!categoryData.contact_person) {
                    enquiryErrors.push(
                      `${displayName}: Contact Person is required`
                    );
                  }

                  if (
                    !categoryData.contact_methods ||
                    categoryData.contact_methods.length === 0
                  ) {
                    enquiryErrors.push(
                      `${displayName}: At least one Contact Method is required`
                    );
                  }
                }
              );

              if (enquiryErrors.length > 0) {
                errors.push(...enquiryErrors);
              }

              if (Object.keys(parsedEnquiryPrefs).length > 0) {
                newRow.enquiry_preferences = parsedEnquiryPrefs; // Replace string with parsed object
              } else {
                newRow.enquiry_preferences = undefined; // Set to undefined if no valid data
              }
            } else if (newRow.enquiry_preferences) {
              errors.push(
                "Enquiry Preferences field has an invalid format. It should be a text string."
              );
            }

            // --- Country Validation ---
            let matchedCountry = null;
            if (newRow.country) {
              matchedCountry = findCountryByName(newRow.country, countries);
              if (matchedCountry) {
                newRow.country = matchedCountry.label; // Use the correct case from database
              } else {
                errors.push(`Invalid country "${newRow.country}".`);
              }
            } else {
              errors.push("Country is required.");
            }

            // --- City Validation ---
            if (matchedCountry) {
              const isIndia = matchedCountry.label.toLowerCase() === "india";

              if (isIndia) {
                // City is required for India
                if (!newRow.city) {
                  errors.push("City is required for India.");
                }
                // else {
                //   const matchedCity = findCityByName(newRow.city, cities);
                //   if (matchedCity) {
                //     newRow.city = matchedCity.label; // Use the correct case from database
                //   } else {
                //     errors.push(`Invalid city "${newRow.city}" for India.`);
                //   }
                // }
                if (!newRow.pincode) {
                  errors.push("Pincode is required for India.");
                } else if (!/^\d{6}$/.test(newRow.pincode)) {
                  errors.push("Pincode must be 6 digits for India.");
                }
              } else {
                // City is optional for other countries, but validate if provided
                // if (newRow.city) {
                //   const matchedCity = findCityByName(newRow.city, cities);
                //   if (matchedCity) {
                //     newRow.city = matchedCity.label; // Use the correct case from database
                //   } else {
                //     // For non-India countries, we might not have city data, so just keep the original value
                //     // or you can choose to show an error if you want strict validation
                //     // errors.push(`Invalid city "${newRow.city}". Did you try "${newRow.city}"?`);
                //   }
                // }
              }
            }

            let validatedServices = [];
            if (newRow.services && typeof newRow.services === "string") {
              const serviceValues = newRow.services
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

              const servicesData = customOptions?.services || [];

              serviceValues.forEach((serviceValue) => {
                const matchedService = findServiceByValue(
                  serviceValue,
                  servicesData
                );
                if (matchedService) {
                  validatedServices.push(matchedService.value);
                } else {
                  errors.push(`Invalid service "${serviceValue}".`);
                }
              });

              if (validatedServices.length > 0) {
                newRow.services = validatedServices.join(", ");
              }
            }

            // --- Featured Services Validation ---
            if (
              newRow.featured_services &&
              typeof newRow.featured_services === "string"
            ) {
              const featuredServiceValues = newRow.featured_services
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

              if (featuredServiceValues.length < 1) {
                errors.push("At least 1 featured service is required.");
              } else if (featuredServiceValues.length > 5) {
                errors.push("Maximum 5 featured services are allowed.");
              } else {
                const validFeaturedServices = [];
                featuredServiceValues.forEach((featuredService) => {
                  // Check if the featured service exists in the validated services
                  const serviceExists = validatedServices.some(
                    (validService) =>
                      validService.toLowerCase() ===
                      featuredService.toLowerCase()
                  );

                  if (serviceExists) {
                    // Use the correct case from validated services
                    const matchedValidService = validatedServices.find(
                      (validService) =>
                        validService.toLowerCase() ===
                        featuredService.toLowerCase()
                    );
                    validFeaturedServices.push(matchedValidService);
                  } else {
                    errors.push(
                      `Featured service "${featuredService}" must be from the services list.`
                    );
                  }
                });

                if (validFeaturedServices.length > 0) {
                  newRow.featured_services = validFeaturedServices.join(", ");
                }
              }
            }

            // --- Media URLs Validation ---
            const mediaFields = [
              "company_profile_media",
              "product_catalogues_media",
              "completed_products_media",
              "project_renders_media",
              "sites_inprogress_media",
              "workplace_media",
            ];

            mediaFields.forEach((fieldName) => {
              if (newRow[fieldName] && typeof newRow[fieldName] === "string") {
                const urls = newRow[fieldName]
                  .split(",")
                  .map((url) => url.trim())
                  .filter(Boolean);

                const validUrls = [];
                const invalidUrls = [];

                urls.forEach((url) => {
                  if (isValidURL(url)) {
                    validUrls.push(url);
                  } else {
                    invalidUrls.push(url);
                  }
                });

                if (invalidUrls.length > 0) {
                  const displayFieldName = fieldName
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase());
                  errors.push(
                    `Invalid URLs in ${displayFieldName}: ${invalidUrls.join(
                      ", "
                    )}`
                  );
                }

                if (validUrls.length > 0) {
                  newRow[fieldName] = validUrls.join(", ");
                }
              }
            });

            // --- Employees Range (Team Range) Validation ---
            if (newRow.team_range && typeof newRow.team_range === "string") {
              const teamRangeOptions =
                customOptions?.options?.team_member_ranges || [];
              const inputRange = String(newRow.team_range).trim();

              const matchedRange = teamRangeOptions.find(
                (range) =>
                  `"${range.toLowerCase()}"` === inputRange.toLowerCase()
              );

              if (matchedRange) {
                newRow.team_range = matchedRange;
              } else {
                errors.push(`Invalid employees range "${inputRange}".`);
              }
            }

            // --- Establishment Year Validation ---
            if (
              newRow.establishment_year &&
              typeof newRow.establishment_year === "string"
            ) {
              const yearStr = newRow.establishment_year.trim();
              const year = parseInt(yearStr);
              const currentYear = new Date().getFullYear();
              const minAllowedYear = currentYear - 100;

              if (isNaN(year) || !/^\d{4}$/.test(yearStr)) {
                errors.push("Establishment year must be a valid 4-digit year.");
              } else if (year < minAllowedYear) {
                errors.push(
                  `Establishment year cannot be less than ${minAllowedYear} (100 years ago).`
                );
              } else if (year > currentYear) {
                errors.push(`Establishment year cannot be in the future.`);
              } else {
                newRow.establishment_year = yearStr;
              }
            }

            if (
              newRow.project_sizes &&
              typeof newRow.project_sizes === "string"
            ) {
              const projectSizeOptions =
                customOptions?.options?.project_sizes || [];
              const parsedSizes = parseProjectSizes(newRow.project_sizes);

              if (parsedSizes.sizes.length === 0 || !parsedSizes.unit) {
                errors.push(
                  "Project sizes must be in format: 'size1,size2,size3;unit' (e.g., '1000,2000,3000;sq.ft.')"
                );
              } else {
                const validUnits = ["sq.ft.", "sq.m."];
                if (!validUnits.includes(parsedSizes.unit)) {
                  errors.push(
                    `Invalid unit "${parsedSizes.unit}". Valid units are: sq.ft., sq.m.`
                  );
                } else {
                  // Filter project size options by the specified unit
                  const optionsForUnit = projectSizeOptions.filter(
                    (option) => option.unit === parsedSizes.unit
                  );

                  const validSizes = [];
                  const invalidSizes = [];

                  parsedSizes.sizes.forEach((sizeInput) => {
                    const matchedOption = optionsForUnit.find(
                      (option) =>
                        option.size.toLowerCase().replace(/\s/g, "") ===
                        sizeInput.toLowerCase().replace(/\s/g, "")
                    );

                    if (matchedOption) {
                      validSizes.push(matchedOption.size);
                    } else {
                      invalidSizes.push(sizeInput);
                    }
                  });

                  if (invalidSizes.length > 0) {
                    errors.push(
                      `Invalid project sizes for unit ${
                        parsedSizes.unit
                      }: ${invalidSizes.join(", ")}`
                    );
                  }

                  if (validSizes.length > 0) {
                    newRow.project_sizes = `${validSizes.join(",")};${
                      parsedSizes.unit
                    }`;
                  }
                }
              }
            }

            // --- Project Locations Validation ---
            if (
              newRow.project_location &&
              typeof newRow.project_location === "string"
            ) {
              const projectLocationOptions =
                customOptions?.options?.project_locations || [];
              const inputLocations = newRow.project_location
                .split(",")
                .map((loc) => loc.trim())
                .filter(Boolean);

              const validLocations = [];
              const invalidLocations = [];

              inputLocations.forEach((locationInput) => {
                const matchedLocation = projectLocationOptions.find(
                  (option) =>
                    option.toLowerCase() === locationInput.toLowerCase()
                );

                if (matchedLocation) {
                  // Special validation for "In/Near my City" - only allowed for India
                  if (matchedLocation.toLowerCase() === "in/near my city") {
                    const isIndiaCountry =
                      matchedCountry &&
                      matchedCountry.label.toLowerCase() === "india";
                    if (!isIndiaCountry) {
                      errors.push(
                        `"In/Near my City" option is only available for India.`
                      );
                    } else {
                      validLocations.push(matchedLocation);
                    }
                  } else {
                    validLocations.push(matchedLocation);
                  }
                } else {
                  invalidLocations.push(locationInput);
                }
              });

              if (invalidLocations.length > 0) {
                errors.push(
                  `Invalid project locations: ${invalidLocations.join(", ")}.`
                );
              }

              if (validLocations.length > 0) {
                newRow.project_location = validLocations.join(", ");
              }
            }

            // --- Project Typology Validation ---
            if (
              newRow.project_typology &&
              typeof newRow.project_typology === "string"
            ) {
              const projectTypologyOptions =
                customOptions?.options?.project_typologies || [];
              const inputTypologies = newRow.project_typology
                .split(",")
                .map((typ) => typ.trim())
                .filter(Boolean);

              const validTypologies = [];
              const invalidTypologies = [];

              inputTypologies.forEach((typologyInput) => {
                if (typologyInput.toLowerCase() === "all") {
                  // Add all options except "All"
                  const allOptionsExceptAll = projectTypologyOptions.filter(
                    (option) => option.toLowerCase() !== "all"
                  );
                  validTypologies.push(...allOptionsExceptAll);
                } else {
                  const matchedTypology = projectTypologyOptions.find(
                    (option) =>
                      option.toLowerCase() === typologyInput.toLowerCase()
                  );

                  if (matchedTypology) {
                    validTypologies.push(matchedTypology);
                  } else {
                    invalidTypologies.push(typologyInput);
                  }
                }
              });

              if (invalidTypologies.length > 0) {
                errors.push(
                  `Invalid project typologies: ${invalidTypologies.join(
                    ", "
                  )}. Did you try "${invalidTypologies.join('", "')}"?`
                );
              }

              if (validTypologies.length > 0) {
                // Remove duplicates and join
                const uniqueTypologies = [...new Set(validTypologies)];
                newRow.project_typology = uniqueTypologies.join(", ");
              }
            }

            // --- Avg Project Budget Validation ---
            if (
              newRow.avg_project_budget &&
              typeof newRow.avg_project_budget === "string"
            ) {
              const avgBudgetOptions =
                customOptions?.options?.average_budget || [];
              const parsedBudget = parseAvgProjectBudget(
                newRow.avg_project_budget
              );

              if (parsedBudget.budgets.length === 0 || !parsedBudget.currency) {
                errors.push(
                  "Avg project budget must be in format: 'budget1,budget2,budget3;currency' (e.g., '1000,2000,3000;Rs/sq.ft.')"
                );
              } else {
                const validCurrencies = ["Rs/sq.ft.", "USD/sq.m."];
                if (!validCurrencies.includes(parsedBudget.currency)) {
                  errors.push(
                    `Invalid currency "${parsedBudget.currency}". Valid currencies are: Rs/sq.ft., USD/sq.m.`
                  );
                } else {
                  // Filter budget options by the specified currency
                  const optionsForCurrency = avgBudgetOptions.filter(
                    (option) => option.currency === parsedBudget.currency
                  );

                  const validBudgets = [];
                  const invalidBudgets = [];

                  parsedBudget.budgets.forEach((budgetInput) => {
                    const matchedOption = optionsForCurrency.find(
                      (option) =>
                        option.budget.toLowerCase().replace(/\s/g, "") ===
                        budgetInput.toLowerCase().replace(/\s/g, "")
                    );

                    if (matchedOption) {
                      validBudgets.push(matchedOption.budget);
                    } else {
                      invalidBudgets.push(budgetInput);
                    }
                  });

                  if (invalidBudgets.length > 0) {
                    errors.push(
                      `Invalid project budgets for currency ${
                        parsedBudget.currency
                      }: ${invalidBudgets.join(", ")}`
                    );
                  }

                  if (validBudgets.length > 0) {
                    newRow.avg_project_budget = `${validBudgets.join(",")};${
                      parsedBudget.currency
                    }`;
                  }
                }
              }
            }

            // --- Design Style Validation ---
            if (
              newRow.design_style &&
              typeof newRow.design_style === "string"
            ) {
              const designStyleOptions =
                customOptions?.options?.design_styles || [];
              const inputStyles = newRow.design_style
                .split(",")
                .map((style) => style.trim())
                .filter(Boolean);

              const validStyles = [];
              const invalidStyles = [];

              inputStyles.forEach((styleInput) => {
                if (styleInput.toLowerCase() === "all") {
                  // Add all options except "All"
                  const allOptionsExceptAll = designStyleOptions.filter(
                    (option) => option.toLowerCase() !== "all"
                  );
                  validStyles.push(...allOptionsExceptAll);
                } else {
                  const matchedStyle = designStyleOptions.find(
                    (option) =>
                      option.toLowerCase() === styleInput.toLowerCase()
                  );

                  if (matchedStyle) {
                    validStyles.push(matchedStyle);
                  } else {
                    invalidStyles.push(styleInput);
                  }
                }
              });

              if (invalidStyles.length > 0) {
                errors.push(
                  `Invalid design styles: ${invalidStyles.join(
                    ", "
                  )}. Did you try "${invalidStyles.join('", "')}"?`
                );
              }

              if (validStyles.length > 0) {
                // Remove duplicates and join
                const uniqueStyles = [...new Set(validStyles)];
                newRow.design_style = uniqueStyles.join(", ");
              }
            }

            // --- Website, Instagram, LinkedIn Links Validation ---
            let hasAtLeastOneLink = false;

            // Website Link Validation
            if (newRow.website_link) {
              const validatedWebsite = validateWebsiteLink(newRow.website_link);
              if (validatedWebsite) {
                newRow.website_link = validatedWebsite;
                hasAtLeastOneLink = true;
              } else {
                errors.push(
                  `Invalid website link format: "${newRow.website_link}"`
                );
              }
            }

            // Instagram Link Validation
            if (newRow.instagram_handle) {
              const validatedInstagram = validateInstagramLink(
                newRow.instagram_handle
              );
              if (validatedInstagram) {
                newRow.instagram_handle = validatedInstagram;
                hasAtLeastOneLink = true;
              } else {
                errors.push(
                  `Invalid Instagram handle/link format: "${newRow.instagram_handle}"`
                );
              }
            }

            // LinkedIn Link Validation
            if (newRow.linkedin_link) {
              const validatedLinkedin = validateLinkedinLink(
                newRow.linkedin_link
              );
              if (validatedLinkedin) {
                newRow.linkedin_link = validatedLinkedin;
                hasAtLeastOneLink = true;
              } else {
                errors.push(
                  `Invalid LinkedIn handle/link format: "${newRow.linkedin_link}". Note: @ symbol is not allowed for LinkedIn handles.`
                );
              }
            }

            // Check if at least one link is provided
            if (
              !hasAtLeastOneLink &&
              !newRow.website_link &&
              !newRow.instagram_handle &&
              !newRow.linkedin_link
            ) {
              errors.push(
                "At least one link is required (Website, Instagram, or LinkedIn)."
              );
            }

            // --- Validations ---
            if (!newRow.business_name) {
              errors.push("Business Name is required.");
            }
            if (!newRow.username) {
              errors.push("Username is required.");
            }
            if (!newRow.email) {
              errors.push("Email is required.");
            } else if (!/\S+@\S+\.\S+/.test(newRow.email)) {
              errors.push("Email is not in a valid format.");
            }

            // Validate business type prefixes
            if (newRow.business_types && businessTypes.length > 0) {
              const providedPrefixes = String(newRow.business_types)
                .split(",")
                .map((p) => p.trim())
                .filter(Boolean);
              const validPrefixes = businessTypes.map((bt) =>
                String(bt.prefix)
              );
              const invalidPrefixes = providedPrefixes.filter(
                (p) => !validPrefixes.includes(p)
              );

              if (invalidPrefixes.length > 0) {
                errors.push(
                  `Invalid business type prefixes: ${invalidPrefixes.join(
                    ", "
                  )}.`
                );
              }
            }

            if (errors.length > 0) {
              newRow._errors = errors;
            }

            return newRow;
          });

        console.log("Transformed data:", transformedData);
        setParsedData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("XLSX parsing error:", error);
        message.error("Error parsing CSV file. Please check the file format.");
        setLoading(false);
      }
    };

    reader.onerror = () => {
      message.error("Error reading file.");
      setLoading(false);
    };

    // Read as array buffer for XLSX
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (parsedData.length === 0) {
      message.error("No data to import.");
      return;
    }
    setLoading(true);

    // Transform data for backend submission
    const usersToImport = parsedData.map((row) => {
      const transformedRow = { ...row };

      // Remove internal properties used for UI rendering and validation
      delete transformedRow._key;
      delete transformedRow._errors;

      if (transformedRow.country && countries.length > 0) {
        const countryMatch = countries.find(
          (c) => c.label === transformedRow.country
        );
        if (countryMatch) {
          transformedRow.country = countryMatch.value; // Use ID for backend
        }
      }

      // Handle city: convert label to ID if needed for backend
      if (transformedRow.city && cities.length > 0) {
        const cityMatch = cities.find((c) => c.label === transformedRow.city);
        if (cityMatch) {
          transformedRow.city = cityMatch.value; // Use ID for backend
        }
      }
      // Handle business_types: convert prefixes to full names
      if (
        transformedRow.business_types &&
        typeof transformedRow.business_types === "string" &&
        businessTypes.length > 0
      ) {
        const providedPrefixes = transformedRow.business_types
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean);
        transformedRow.business_types = providedPrefixes
          .map((prefix) => {
            const foundType = businessTypes.find(
              (bt) => String(bt.prefix) === prefix
            );
            return foundType ? foundType._id : null;
          })
          .filter(Boolean);
      }

      // Convert other comma-separated strings to arrays for relevant fields
      const arrayFields = [
        "featured_services",
        "services",
        "project_scope",
        "project_typology",
        "design_style",
      ];

      arrayFields.forEach((field) => {
        if (
          transformedRow[field] &&
          typeof transformedRow[field] === "string"
        ) {
          transformedRow[field] = transformedRow[field]
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      });

      return transformedRow;
    });

    try {
      console.log("Data ready for backend:", usersToImport);
      // TODO: Replace with actual API call
      // await http.post(`${config.api_url}admin/business-users/import-csv`, {
      //   users: usersToImport,
      // });
      message.success(
        "Data transformed and ready for import. See browser console for output."
      );
      onClose();
    } catch (error) {
      message.error(
        "Failed to import users. Please check the console for details."
      );
      console.error(error);
    } finally {
      setLoading(false);
      setParsedData([]);
      setFile(null);
    }
  };

  const hasErrors = parsedData.some(
    (row) => row._errors && row._errors.length > 0
  );

  const columns =
    parsedData.length > 0
      ? Object.keys(parsedData[0])
          .filter((key) => !key.startsWith("_"))
          .map((key) => {
            const col = {
              title: key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()),
              dataIndex: key,
              key: key,
              width: 150,
              ellipsis: true,
            };

            const mediaAndServiceKeys = [
              "services",
              "featured_services",
              "company_profile_media",
              "product_catalogues_media",
              "completed_products_media",
              "project_renders_media",
              "sites_inprogress_media",
              "workplace_media",
              "project_typology",
              "design_style",
              "website_link",
              "instagram_handle",
              "linkedin_link",
            ];

            if (mediaAndServiceKeys.includes(key)) {
              col.width = 200; // Set a fixed width
              col.ellipsis = false; // Disable ellipsis to allow wrapping
              col.render = (text) => (
                <div style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                  {text}
                </div>
              );
            }

            if (key === "owners") {
              col.width = 250;
              col.render = (owners) => {
                if (Array.isArray(owners)) {
                  return (
                    <div style={{ whiteSpace: "pre-wrap" }}>
                      {owners.map((owner, index) => (
                        <div
                          key={index}
                          style={{
                            marginBottom:
                              index < owners.length - 1 ? "8px" : "0",
                            paddingBottom:
                              index < owners.length - 1 ? "8px" : "0",
                            borderBottom:
                              index < owners.length - 1
                                ? "1px solid #f0f0f0"
                                : "none",
                          }}
                        >
                          <div>
                            Name: <strong>{owner.name}</strong>
                          </div>
                          <div>Email: {owner.email}</div>
                          {owner.phone && (
                            <div>
                              Phone Number: +{owner.country_code || ""}{" "}
                              {owner.phone}
                            </div>
                          )}
                          {owner.whatsapp_no && (
                            <div>
                              Whatsapp Number: +
                              {owner.whatsapp_country_code || ""}{" "}
                              {owner.whatsapp_no}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }
                return String(owners); // Fallback for non-array data
              };
            }

            if (key === "enquiry_preferences") {
              col.width = 300;
              col.render = (prefs) => {
                if (!prefs || typeof prefs !== "object") {
                  return String(prefs || "");
                }

                return (
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {Object.entries(prefs).map(([category, data], index) => {
                      const displayCategory =
                        Object.keys(headerToFieldMap).find(
                          (k) => headerToFieldMap[k] === category
                        ) ||
                        category
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase());

                      return (
                        <div
                          key={index}
                          style={{
                            marginBottom:
                              index < Object.keys(prefs).length - 1
                                ? "8px"
                                : "0",
                            paddingBottom:
                              index < Object.keys(prefs).length - 1
                                ? "8px"
                                : "0",
                            borderBottom:
                              index < Object.keys(prefs).length - 1
                                ? "1px solid #f0f0f0"
                                : "none",
                          }}
                        >
                          <div>
                            <strong>{displayCategory}</strong>
                          </div>
                          <div>
                            Contact Person: {data.contact_person || "N/A"}
                          </div>
                          <div>
                            Contact Methods:{" "}
                            {(data.contact_methods || []).join(", ") || "N/A"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              };
            }

            return col;
          })
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
    fetchBusinessTypes();
    fetchBusinessOptions();
    fetchInitialData();
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
            beforeUpload={() => false} // Prevent auto upload
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

      <style jsx>{`
        .ant-table-row-level-0.ant-table-row:hover > td {
          background-color: #fff2f0 !important;
        }
      `}</style>
    </Modal>
  );
};

export default BusinessUserCSVImportModal;
