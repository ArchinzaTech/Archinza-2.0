const config = require("../config/config");
const { sendmail } = require("../helpers/mailer");

const axios = require("axios");
module.exports = async (job) => {
  const data = job.attrs.data;
  const url = "https://control.msg91.com/api/v5/flow";
  let otp = data.otp || "";

  let params = {
    authkey: config.msg_91_auth_key,
    
  };

  let body = {
    template_id: config.msg_91_template_id,
    recipients: [
      {
        mobiles: `${data.country_code}${data.phone}`,
        var1: otp,
      },
    ],
  };
  try {
    const { data } = await axios.post(url, body,{ params });

    if (data.type == "success") {
      console.log("SMS succussfully sent.");
    } else {
      console.log("SMS not sent.");
    }
  } catch (error) {
    return error;
  }
};
