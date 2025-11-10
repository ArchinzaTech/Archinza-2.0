import axios from "axios";

import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { isExpired, decodeToken } from "react-jwt";
import config from "../config/config";
import moment from "moment";
import _find from "lodash/find";
const helper = {
  isEmailUnique: async (email, modelName) => {
    try {
      const { data: res } = await axios.post(
        `${config.api_url}/general/email-validation`,
        {
          email,
          modelName,
        }
      );

      if (res.status !== 200) {
        return false;
      }
      return true;
    } catch (error) {
      toast.error("Internal Server Error");
      console.log("error", error.response);
      //   return false;
    }
  },
  isPhoneUnique: async (country_code, phone, modelName) => {
    try {
      const { data: res } = await axios.post(
        `${config.api_url}/general/phone-validation`,
        {
          country_code,
          phone,
          modelName,
        }
      );

      if (res.status !== 200) {
        return false;
      }
      return true;
    } catch (error) {
      toast.error("Internal Server Error");
      console.log("error", error);
      //   return false;
    }
  },

  getUser: () => {
    if (config.app_mode == "production") {
      const token = localStorage.getItem(config.jwt_auth_key);

      if (token) {
        return jwtDecode(token);
      }
    } else {
      const token = localStorage.getItem(config.jwt_auth_key);

      console.log({ token });
      if (token) {
        const isMyTokenExpired = isExpired(token);
        console.log({ isMyTokenExpired });
        if (!isMyTokenExpired) {
          return jwtDecode(token);
        }
      }
    }
  },

  getUserType: (code) => {
    const userTypes = config.user_types;
    let userType = _find(userTypes, { code: code });
    return userType;
  },

  redirectBusinessUser: (questions, business_types, currentStep) => {
    const steps = {
      3: "social_media_links",
      4: "company_profile",
      5: "establishment_year",
      6: "team_members",
      7: "location_preference",
      8: "renovation_work",
      9: "project_typology",
      10: "service_design_style",
      11: "minimum_project_size",
      12: "average_budget",
      13: "current_minimal_fee",
      14: "product_positionings",
      17: "addon_services",
      18: "enquiry_preferences",
      // 18: "price_rating",
    };
    const currentStepNumber = Number(currentStep);
    for (
      let stepNumber = currentStepNumber + 1;
      stepNumber <= 18;
      stepNumber++
    ) {
      const stepName = steps[stepNumber];
      for (const question of questions) {
        if (question.question === stepName) {
          const hasMatchingBusinessType = question.business_types.some((bt) =>
            business_types.includes(bt._id)
          );
          if (hasMatchingBusinessType) {
            return Number(stepNumber);
          }
        }
      }
    }
    return null;
  },

  redirectBusinessUserBack: (questions, business_types, currentStep) => {
    console.log(currentStep);

    const steps = {
      3: "social_media_links",
      4: "company_profile",
      5: "establishment_year",
      6: "team_members",
      7: "location_preference",
      8: "renovation_work",
      9: "project_typology",
      10: "service_design_style",
      11: "minimum_project_size",
      12: "average_budget",
      13: "current_minimal_fee",
      14: "product_positionings",
      17: "addon_services",
      18: "enquiry_preferences",
      // 18: "price_rating",
    };
    const currentStepNumber = Number(currentStep);

    for (
      let stepNumber = currentStepNumber - 1;
      stepNumber >= 3;
      stepNumber--
    ) {
      const stepName = steps[stepNumber];

      for (const question of questions) {
        if (question.question === stepName) {
          const hasMatchingBusinessType = question.business_types.some((bt) =>
            business_types.includes(bt._id)
          );

          if (hasMatchingBusinessType) {
            return Number(stepNumber);
          }
        }
      }
    }

    return Number(2);
  },

  checkBusinessUserNextStep: (step) => {
    const steps = {
      4: "project_scope",
      5: "minimum_project_size",
      6: "location_preference",
      7: "project_typology",
      8: "service_design_style",
      9: "average_budget",
      10: "current_minimal_fee",
      11: "price_rating",
    };

    return steps[step];
  },

  // getVoter: () => {
  //   const token = localStorage.getItem(config.jwt_voter_auth_key);

  //   if (token) {
  //     const isMyTokenExpired = isExpired(token);

  //     if (!isMyTokenExpired) {
  //       return jwtDecode(token);
  //     }
  //   }
  // },

  checkWordLen: (text, length) => {
    var len = text.split(/[\s]+/);
    console.log("word length", len.length);
    if (len.length > length) {
      return false;
    }
    return true;
  },

  dateFormatter: (date, format = "YYYY-MM-DD HH:mm:ss") => {
    return moment(date).format(format);
  },

  validateSize: (field, file, size, errors) => {
    if (file) {
      if (file.file.size > size * 1024 * 1024) {
        errors[field] = `File needs to be under ${size}MB`;
      }
      return false;
    }
    return false;
  },

  validateExt: (field, file, extensions, errors) => {
    if (file) {
      if (!extensions.includes(file.file.type)) {
        errors[field] = "File does not have a valid file extension.";
      }
      return false;
    }
    return false;
  },

  scroll: (id) => {
    var element = document.getElementById(id);
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  },

  getFirstError: (errors, suffix = "_error") => {
    console.log(`${Object.keys(errors)[0]}${suffix}`);

    return `${Object.keys(errors)[0]}${suffix}`;
  },

  capitalizeWords: (sentence) => {
    return sentence.replace(/\b\w/g, (char) => char.toUpperCase());
  },

  formatSocialLink: (type, url) => {
    if (!url) return "";

    switch (type) {
      case "website":
        // Remove http://, https://, trailing /, and keep www if present
        return url
          .replace(/^https?:\/\//, "") // Remove http:// or https://
          .replace(/\/$/, "") // Remove trailing /
          .trim();

      case "linkedin":
        const linkedinMatch = url.match(
          /linkedin\.com\/(groups|company)\/([^/]+)\/?/
        );
        if (linkedinMatch) {
          return `linkedin.com/${linkedinMatch[1]}/${linkedinMatch[2]}`;
        }

        return url
          .replace(/^https?:\/\//, "")
          .replace(/^www\./, "")
          .replace(/\/$/, "");

      case "instagram":
        // Extract the username (e.g., qubahomes from instagram.com/qubahomes/)
        const instagramMatch = url.match(/instagram\.com\/([^/]+)\/?/);
        return instagramMatch
          ? instagramMatch[1]
          : url.replace(/^https?:\/\//, "").replace(/\/$/, "");

      default:
        return url;
    }
  },

  truncateFileName: (filename, maxLength) => {
    if (!filename) return "";

    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex === -1) return filename;

    const extension = filename.substring(lastDotIndex);
    const nameWithoutExtension = filename.substring(0, lastDotIndex);

    if (nameWithoutExtension.length + extension.length <= maxLength) {
      return filename;
    }
    console.log(
      nameWithoutExtension.substring(0, maxLength - 3 - extension.length) +
        "..." +
        extension
    );
    return (
      nameWithoutExtension.substring(0, maxLength - 3 - extension.length) +
      "..." +
      extension
    );
  },

  // generateInitials: (businessName, maxInitials = 2) => {
  //   if (!businessName || typeof businessName !== "string") {
  //     return "";
  //   }

  //   const words = businessName.trim().split(/\s+/);

  //   if (words.length === 1) {
  //     const word = words[0];
  //     if (word.length >= 2) {
  //       return word.substring(0, 1).toUpperCase();
  //     }
  //     return word.toUpperCase();
  //   }

  //   let initials = "";
  //   for (let i = 0; i < Math.min(words.length, maxInitials); i++) {
  //     if (words[i].length > 0) {
  //       initials += words[i][0].toUpperCase();
  //     }
  //   }

  //   return initials;
  // },
  generateInitials: (businessName) => {
    if (!businessName || typeof businessName !== "string") {
      return "";
    }

    const words = businessName.trim().split(/\s+/);

    // Always take first character of the first word
    return words[0][0].toUpperCase();
  },

  getBusinessNamePrefix: (name, img, maxLength) => {
    if (!name) return "NA";
    const lastDotIndex = img.lastIndexOf(".");
    const extension = img.substring(lastDotIndex);

    let prefix = name.toLowerCase().trim().split(/\s+/).slice(0, 2).join("_");
    if (maxLength && prefix.length > maxLength) {
      prefix = prefix.substring(0, maxLength - 3) + "...";
    }

    return prefix + extension;
  },

  truncateName: (name, maxLength) => {
    if (!name) return "NA";

    // let prefix = name.toLowerCase().trim().split(/\s+/).slice(0, 2).join("_");
    // if (maxLength && prefix.length > maxLength) {
    //   prefix = prefix.substring(0, maxLength - 3) + "...";
    // }

    return `${name.slice(0, maxLength - 3)}...`;
  },

  //   ISTDate: (date, format = "YYYY-MM-DD HH:mm:ss") => {
  //     return moment(date).utc().utcOffset("+05:30").format(format);
  //   },
};
export default helper;
