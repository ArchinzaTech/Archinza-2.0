const config = require("../config/config");
const { sendmail } = require("../helpers/mailer");
const proAccessEntries = require("../models/proAccessEntries");
const fs = require("fs");
const path = require("path");
module.exports = async (job) => {
  const data = job.attrs.data;
  const entry = await proAccessEntries.findOne({ user: data.entryId });
  if (!entry) {
    console.log(`Entry ${data.entryId} not found`);
    return;
  }
  if (entry.status === "completed") {
    console.log(
      `Skipping reminder for ${data.entryId}: completed or recently updated`
    );
    return;
  }

  const imagesDir = path.join(
    __dirname,
    "..",
    "email-templates",
    "proUsers",
    "Images"
  );

  const attachments = fs
    .readdirSync(imagesDir)
    .filter((file) => /\.(png|jpg|jpeg|gif|svg)$/i.test(file)) // only image files
    .map((file) => {
      return {
        filename: file,
        path: path.join(imagesDir, file),
        cid: path.parse(file).name, // use 'brief-icon' from 'brief-icon.svg'
      };
    });
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
      subPath: "proUsers",
      templateVars: data.templateVars,
      attachments: attachments,
    });

    console.log("mail details", mail);
  }
};
