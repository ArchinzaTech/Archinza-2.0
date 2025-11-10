import axios from "axios";
// import { toast } from "react-toastify";

import ToastMsg from "../components/ToastMsg/ToastMsg";
import { toast } from "react-toastify";
import config from "../config/config";
axios.defaults.withCredentials = true;
const http = {
  get: async (url, params = {}) => {
    try {
      const response = await axios.get(url, { params });

      const { data } = response;

      if (data.status === 200) {
        return data;
      }

      if (data.status >= 400 || data.status <= 499) {
        // toast.error(data.message);

        toast(<ToastMsg message={data.message} />, config.error_toast_config);

        return null;
      }
    } catch (error) {
      // notification["error"]({
      //   message: "Internal Server Error",
      // });

      // toast.error("Internal Server Error");
      toast(
        <ToastMsg message="Internal Server Error" />,
        config.error_toast_config
      );

      console.log("error", error);
      //   return false;
    }
  },

  customGet: async (url, headers) => {
    try {
      const response = await axios.get(url, headers);

      const { data } = response;

      if (data.status === 200) {
        return data;
      }

      if (data.status >= 400 || data.status <= 499) {
        // toast.error(data.message);

        toast(<ToastMsg message={data.message} />, config.error_toast_config);

        return null;
      }
    } catch (error) {
      // notification["error"]({
      //   message: "Internal Server Error",
      // });

      // toast.error("Internal Server Error");
      toast(
        <ToastMsg message="Internal Server Error" />,
        config.error_toast_config
      );

      console.log("error", error.response);
      //   return false;
    }
  },
  post: async (url, request, headers) => {
    try {
      const response = await axios.post(url, request, headers);

      const { data } = response;
      if (data.status === 200) {
        return data;
      }

      if (data.status >= 400 || data.status <= 499) {
        // toast.error(data.message);

        toast(
          <ToastMsg danger message={data.message} />,
          config.error_toast_config
        );

        return null;
      }
    } catch (error) {
      // toast.error("Internal Server Error");
      toast(
        <ToastMsg message="Internal Server Error" />,
        config.error_toast_config
      );
      console.log("error", error.response);
    }
  },
  shaharPost: async (url, request, headers) => {
    try {
      const response = await axios.post(url, request, headers);

      const { data } = response;
      if (data.status) {
        return data;
      }

      if (data.status >= 400 || data.status <= 499) {
        // toast.error(data.message);

        toast(
          <ToastMsg danger message={data.message} />,
          config.error_toast_config
        );

        return null;
      }
    } catch (error) {
      // toast.error("Internal Server Error");
      toast(
        <ToastMsg message="Internal Server Error" />,
        config.error_toast_config
      );
      console.log("error", error.response);
    }
  },

  customPost: async (url, request) => {
    try {
      const response = await axios.post(url, request);

      const { data } = response;
      // console.log(data);
      if (data.status === 200) {
        return data;
      }

      if (data.status >= 400 || data.status <= 499) {
        // toast.error(data.message);

        return data;
      }
    } catch (error) {
      toast.error("Internal Server Error");

      console.log("error", error.response);
      //   return false;
    }
  },

  put: async (url, request) => {
    try {
      const response = await axios.put(url, request);

      const { data } = response;

      if (data.status === 200) {
        return data;
      }

      if (data.status >= 400 || data.status <= 499) {
        toast(<ToastMsg message={data.message} />, config.error_toast_config);

        return null;
      }
    } catch (error) {
      toast(
        <ToastMsg message="Internal Server Error" />,
        config.error_toast_config
      );

      console.log("error", error.response);
      //   return false;
    }
  },
  delete: async (url) => {
    try {
      const response = await axios.delete(url);

      const { data } = response;

      if (data.status === 200) {
        return data;
      }

      if (data.status >= 400 || data.status <= 499) {
        toast.error(data.message);

        return null;
      }
    } catch (error) {
      toast.error("Internal Server Error");

      console.log("error", error.response);
      //   return false;
    }
  },
};
export default http;
