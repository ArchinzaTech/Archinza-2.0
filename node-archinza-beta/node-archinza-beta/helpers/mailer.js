const Joi = require("joi");
const nodemailer = require("nodemailer");
const fs = require("fs");
const ejs = require("ejs");
const { htmlToText } = require("html-to-text");
const juice = require("juice");
const config = require("../config/config");
const transporter = require("./smtp");

async function sendmail({
  subPath,
  template: templateName,
  templateVars,
  ...restOfOptions
}) {
  let templatePath;
  if (subPath) {
    templatePath = `email-templates/${subPath}/${templateName}.html`;
  } else {
    templatePath = `email-templates/${templateName}.html`;
  }
  const options = {
    ...restOfOptions,
  };

  if (templateName && fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, "utf-8");
    const html = ejs.render(template, {
      ...templateVars,
      base_url: config.base_url,
    });
    const text = htmlToText(html);
    const htmlWithStylesInlined = juice(html);

    options.html = htmlWithStylesInlined;
    options.text = text;
  }

  // let transporter = nodemailer.createTransport({
  //   // service: "Outlook365",
  //   service: "gmail",
  //   host: config.mail.host,
  //   port: config.mail.port,
  //   secure: config.mail.ssl, // true for 465, false for other ports
  //   auth: {
  //     user: config.mail.username, // generated ethereal user
  //     pass: config.mail.password, // generated ethereal password
  //   },
  // });

  // send mail with defined transport object

  try {
    let info = await transporter.sendMail(options);
    return info;
  } catch (error) {
    return error;
  }
}

// const smtp = nodemailer.createTransport({
//   host: config.mail.host,
//   port: config.mail.port,
//   secure: config.mail.ssl, // true for 465, false for other ports
//   auth: {
//     user: config.mail.username, // generated ethereal user
//     pass: config.mail.password, // generated ethereal password
//   },
// });

//  function sendmail({ template: templateName, templateVars, ...restOfOptions }) => {
//   const templatePath = `lib/email/templates/${templateName}.html`;
//   const options = {
//     ...restOfOptions,
//   };

//   if (templateName && fs.existsSync(templatePath)) {
//     const template = fs.readFileSync(templatePath, "utf-8");
//     const html = ejs.render(template, templateVars);
//     const text = htmlToText(html);
//     const htmlWithStylesInlined = juice(html);

//     options.html = htmlWithStylesInlined;
//     options.text = text;
//   }

//   return smtp.sendMail(options);
// };

module.exports = { sendmail };
