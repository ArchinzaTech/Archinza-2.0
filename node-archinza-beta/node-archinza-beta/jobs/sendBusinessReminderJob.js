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
      subject: data.subject,
      template: data.templateVars.template,
      subPath: "businessReminderMails",
      templateVars: data.templateVars,
    });

    console.log("mail details", mail);
  }
};
