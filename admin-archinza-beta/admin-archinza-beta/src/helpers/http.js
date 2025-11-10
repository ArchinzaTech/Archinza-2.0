import axios from "axios";
// import { toast } from "react-toastify";
import { notification } from "antd";
import config from "../config/config";
const token = localStorage.getItem(config.jwt_store_key);

axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

const http = {
  get: async (url) => {
    try {
      const response = await axios.get(url);

      const { data } = response;

      if (data.status === 200) {
        return data;
      }

      if (data.status >= 400 || data.status <= 499) {
        notification["error"]({
          message: data.message,
        });

        return null;
      }
    } catch (error) {
      notification["error"]({
        message: "Internal Server Error",
      });
      console.log("error", error.response);
      //   return false;
    }
  },
  post: async (url, request,options={}) => {
    try {
      const response = await axios.post(url, request,options);

      const { data } = response;
      // console.log(data);
      if (data.status === 200) {
        return data;
      }

      if (data.status >= 400 || data.status <= 499) {
        notification["error"]({
          message: data.message,
        });

        return null;
      }
    } catch (error) {
      notification["error"]({
        message: "Internal Server Error",
      });
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
        notification["error"]({
          message: data.message,
        });

        return null;
      }
    } catch (error) {
      notification["error"]({
        message: "Internal Server Error",
      });
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
        notification["error"]({
          message: data.message,
        });

        return null;
      }
    } catch (error) {
      notification["error"]({
        message: "Internal Server Error",
      });
      console.log("error", error.response);
      //   return false;
    }
  },
};
export default http;
