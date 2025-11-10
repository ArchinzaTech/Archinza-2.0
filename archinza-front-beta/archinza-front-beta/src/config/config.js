import { toast } from "react-toastify";

let config = {
  api_url: process.env.REACT_APP_API_URL,
  image_url: process.env.REACT_APP_IMAGE_URL,

  jwt_auth_key: "jwt_secret_storage_archinza",
  jwt_remember_me: "jwt_remember_me",
  jwt_voter_auth_key: "jwt_voter_storage",
  app_mode: process.env.REACT_APP_APP_MODE,
  gcp_bucket: process.env.REACT_APP_GCP_BUCKET,
  gcp_object_url: process.env.REACT_APP_GCP_URL,
  aws_object_url: process.env.REACT_APP_AWS_URL,
  aws_bucket: process.env.REACT_APP_AWS_BUCKET,
  google_autocomplete: process.env.REACT_APP_GOOGLE_AUTOCOMPLETE_API,
  google_place_details: process.env.REACT_APP_GOOGLE_PLACE_DETAILS_API,
  google_places_api_key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
  google_geocode_api_key: process.env.REACT_APP_GOOGLE_GEOCODE_API,
  scrap_content_api: process.env.REACT_APP_SCRAPE_CONTENT_API_URL,
  razorpay_key_id: process.env.REACT_APP_RZP_KEY,
  allowed_extensions: ["image/jpeg", "image/png", "image/svg+xml", "image/svg"],
  joiOptions: {
    abortEarly: false,
    allowUnknown: true,
    errors: {
      wrap: {
        label: "",
      },
    },
  },
  user_types: [
    {
      code: "BO",
      name: "Business/Firm Owner",
      color: "#ed008c",
    },
    {
      code: "ST",
      name: "Student",
      color: "#FF4A68",
    },
    {
      code: "DE",
      name: "Design Enthusiast",
      color: "#014FE0",
    },
    {
      code: "TM",
      name: "Working Professional",
      color: "#12CC50",
    },
    {
      code: "FL",
      name: "Freelancer/Artist",
      color: "#ed008c",
    },
  ],
  error_toast_config: {
    className: "error_toast",
    position: toast.POSITION.TOP_CENTER,
    hideProgressBar: true,
    closeButton: false,
    autoClose: 1500,
  },
  success_toast_config: {
    className: "success_toast",
    position: toast.POSITION.TOP_CENTER,
    hideProgressBar: true,
    closeButton: false,
    autoClose: 1500,
  },
};

export default config;
