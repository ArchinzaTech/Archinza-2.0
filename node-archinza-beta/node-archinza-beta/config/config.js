require("dotenv").config(); // this is important!
module.exports = {
  database: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },

  mail: {
    mailer: process.env.SMTP_MAILER,
    sender: process.env.SMTP_SENDER,
    sender_name: process.env.SMTP_SENDER_NAME,
    reciever: process.env.SMTP_RECIEVER,
    reciever_cc: process.env.SMTP_RECIEVER_CC,

    host: process.env.SMTP_HOST,
    username: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
    port: process.env.SMTP_PORT,
    ssl: process.env.SMTP_ENCRYPT,
    sendgrid_api_key: process.env.SENDGRID_API_KEY,
  },
  mailchimp: {
    api_key: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER,
  },
  redis_host: process.env.REDIS_HOST,
  redis_access_token: process.env.REDIS_ACCESS_TOKEN,
  redis_port: process.env.REDIS_PORT,
  secretkey: process.env.JWT_SECRET,
  session_secretkey: process.env.SESSION_SECRET,
  recaptcha_site_key: process.env.RECAPTCHA_SITE_KEY,
  recaptcha_secret_key: process.env.RECAPTCHA_SECRET_KEY,
  base_url: process.env.BASE_URL,
  react_app_url: process.env.REACT_APP_URL,
  app_mode: process.env.APP_MODE,
  jwt_expire_time: process.env.JWT_EXPIRE_TIME,
  textlocal_api_key: process.env.TEXTLOCAL_API_KEY,
  textlocal_sender: process.env.TEXTLOCAL_SENDER,
  fx_rates_api_key: process.env.FX_RATES_API_KEY,
  gcp_bucket_name: process.env.GCP_BUCKET_NAME,
  aws_bucket_name: process.env.AWS_BUCKET_NAME,
  aws_region: process.env.AWS_REGION,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  scrap_content_api: process.env.SCRAP_CONTENT_API_URL,
  google_places_api_key: process.env.GOOGLE_PLACES_API_KEY,
  google_geocode_api: process.env.GOOGLE_GEOCODE_API,
  google_autocomplete: process.env.GOOGLE_AUTOCOMPLETE_API,
  google_place_details: process.env.GOOGLE_PLACE_DETAILS_API,
  cloudWatch: {
    logGroupName:
      process.env.APP_MODE === "production"
        ? process.env.CLOUDWATCH_LOG_GROUP_NAME_PROD
        : process.env.CLOUDWATCH_LOG_GROUP_NAME_DEV,
    logStreamName: process.env.CLOUDWATCH_LOG_STREAM_NAME,
    awsConfig: {
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  },
  razorpay: {
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  },
  messages: {
    delete_confirm: "",
  },
  msg_91_auth_key: process.env.MSG_91_AUTH_KEY,
  msg_91_template_id: process.env.MSG_91_TEMPLATE_ID,
};
