const config = require("../config/config");
const { sendmail } = require("../helpers/mailer");
const proUsersWelcomeMailSchedule = require("./proUsers/proUsersWelcomeMail");

module.exports = async (job) => {
  const data = job.attrs.data;
  let userType = proUsersWelcomeMailSchedule.find(
    (it) => it.userType === data.userType
  );

  if (config.mail.mailer == "on") {
    const mail = await sendmail({
      to: data.email,
      from: {
        name: config.mail.sender_name,
        address: config.mail.sender,
      },
      cc: config.mail.reciever_cc,
      bcc: config.mail.reciever_bcc,
      subject: userType.subject,
      template: userType.template,
      subPath: "proUsers",
      templateVars: data.templateVars,
      // attachments:attachments
    });

    console.log("mail details", mail);
  }
};
