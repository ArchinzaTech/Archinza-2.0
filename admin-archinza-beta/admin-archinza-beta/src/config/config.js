let config = {
  api_url: process.env.REACT_APP_API_URL,
  jwt_store_key: "archinza_jwt_secret_storage",
  sizeLimit: 5,
  allowed_extensions: ["image/jpeg", "image/png", "image/svg+xml", "image/svg"],
  gcp_bucket: process.env.REACT_APP_GCP_BUCKET,
  gcp_object_url: process.env.REACT_APP_GCP_URL,
  aws_object_url: process.env.REACT_APP_AWS_URL,
  joiOptions: {
    abortEarly: false,
    allowUnknown: true,
    errors: {
      wrap: {
        label: "",
      },
    },
  },
};

export default config;
