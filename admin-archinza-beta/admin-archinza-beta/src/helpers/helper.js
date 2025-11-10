import axios from "axios";

import { notification } from "antd";
import config from "../config/config";
import moment from "moment";
import { businessUsersUrl, personalUsersUrl } from "./constants";

const helper = {
  validateSlug: async (slug, modelName) => {
    try {
      const { data: res } = await axios.post(
        `${config.api_url}general/validation`,
        {
          slug,
          modelName,
        }
      );

      if (res.status !== 200) {
        return false;
      }
      return true;
    } catch (error) {
      notification["error"]({
        message: "Internal Server Error",
      });
      console.log("error", error.response);
      //   return false;
    }
  },

  ISTDate: (date, format = "YYYY-MM-DD HH:mm:ss") => {
    return moment(date).utc().utcOffset("+05:30").format(format);
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

  convertToTitleCase: (string) => {
    if (!string) return "";
    if (string === "cms") {
      return string.toUpperCase();
    }
    return string
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },

  resourceRouter: (role) => {
    const resources = role.permissions.map((p) => p.resource);

    const hasPersonal = resources.includes("personal_user");
    const hasBusiness = resources.includes("business_user");
    const hasWildcard = resources.includes("*");
    const hasGenericUser = resources.includes("user");

    if (hasWildcard || hasPersonal || hasGenericUser) {
      return { resources, route: personalUsersUrl };
    }

    const uniqueResources = new Set(resources);
    if (uniqueResources.size === 1 && uniqueResources.has("business_user")) {
      return { resources, route: businessUsersUrl };
    }

    if (uniqueResources.size === 1 && uniqueResources.has("personal_user")) {
      return { resources, route: personalUsersUrl };
    }
    return { resources, route: personalUsersUrl };
  },

  getAllowedSectionsAndMenu: (role) => {
    if (!role || !role.permissions)
      return { allowedSections: [], allowedResources: [] };

    const resources = role.permissions.map((p) => p.resource);
    const hasWildcard = resources.includes("*");

    // Map resources to sections
    const allowedSections = [];
    if (
      hasWildcard ||
      resources.includes("personal_user") ||
      resources.includes("user")
    ) {
      allowedSections.push("personal");
    }
    if (
      hasWildcard ||
      resources.includes("business_user") ||
      resources.includes("user")
    ) {
      allowedSections.push("business");
    }
    if (
      hasWildcard ||
      resources.includes("role") ||
      resources.includes("permission")
    ) {
      allowedSections.push("roles");
    }
    if (
      hasWildcard ||
      resources.includes("miscellaneous") ||
      resources.includes("permission")
    ) {
      allowedSections.push("miscellaneous");
    }

    return { allowedSections, allowedResources: resources };
  },

  maskPhone: (phone) => {
    if (!phone || phone.length < 4) return "*".repeat(phone.length || 0);
    return "*".repeat(phone.length - 4) + phone.slice(-4);
  },

  maskEmail: (email) => {
    if (!email || !email.includes("@")) return "****";
    const [name, domain] = email.split("@");
    const maskedName =
      name[0] + "*".repeat(Math.max(name.length - 2, 1)) + name.slice(-1);
    const maskedDomain =
      domain[0] + "*".repeat(Math.max(domain.length - 2, 1)) + domain.slice(-1);
    return `${maskedName}@${maskedDomain}`;
  },

  captureBasicUserDetailsPersonal: (users, extra) => {
    const data = users?.map((user) => ({
      name: user?.name,
      email: user?.email,
      user_type: user?.user_type,
      country_code: user?.country_code,
      phone: user?.phone,
      whatsapp_country_code: user?.whatsapp_country_code,
      whatsapp_no: user?.whatsapp_no,
      country: user?.country,
      city: user?.city || "NA",
      state: user?.state || "NA",
      ...user?.extra,
    }));
    return data;
  },

  captureBasicUserDetailsBusiness: (users, extra) => {
    const data = users?.map((user) => ({
      business_name: user?.business_name,
      username: user?.username,
      email: user?.email,
      country_code: user?.country_code,
      phone: user?.phone,
      whatsapp_country_code: user?.whatsapp_country_code,
      whatsapp_no: user?.whatsapp_no,
      country: user?.country,
      city: user?.city || "NA",
      state: user?.state || "NA",
      ...user?.extra,
    }));
    return data;
  },

  capitalizeWords: (value) => {
    if (typeof value === "string") {
      return value
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }
    return value;
  },
};
export default helper;
