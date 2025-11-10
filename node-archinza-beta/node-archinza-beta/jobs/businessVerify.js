const config = require("../config/config");
const { sendmail } = require("../helpers/mailer");

module.exports = async (job) => {
  const data = job.attrs.data;

  if (config.mail.mailer == "on") {
    const mail = await sendmail({
      to: config.mail.reciever,
      from: {
        name: config.mail.sender_name,
        address: config.mail.sender,
      },
      cc: config.mail.reciever_cc,
      bcc: config.mail.reciever_bcc,
      subject: "User Verification Request",
      template: "business_verify",
      templateVars: data,
      // attachments:attachments
    });

    console.log("mail details", mail);
  }
};
