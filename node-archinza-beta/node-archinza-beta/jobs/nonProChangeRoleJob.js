const config = require("../config/config");
const { sendmail } = require("../helpers/mailer");

module.exports = async (job) => {
  const data = job.attrs.data;

  if (config.mail.mailer == "on") {
    const mail = await sendmail({
      to: data.email,
      from: {
        name: config.mail.sender_name,
        address: config.mail.sender,
      },
      cc: config.mail.reciever_cc,
      bcc: config.mail.reciever_bcc,
      subject:
        "Welcome to your new role! Let’s finish setting up Archinza Pro🚀",
      template: "changeRole",
      subPath: "nonProUsers",
      templateVars: data.templateVars,
      // attachments:attachments
    });

    console.log("mail details", mail);
  }
};
