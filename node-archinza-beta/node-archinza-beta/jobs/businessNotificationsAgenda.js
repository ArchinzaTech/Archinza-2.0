const Agenda = require("agenda");
const con = require("../helpers/db");

const sendBusinessVerificatonJob = require("./sendBusinessVerificatonJob.js");
const sendBusinessVerifiedJob = require("./sendBusinessVerifiedJob.js");
const sendBusinessStatusNotifications = require("./sendBusinessStatusNotifications.js");

const businessNotificationAgenda = new Agenda({
  mongo: con,
  db: { collection: "businessNotificationJobs" },
});

businessNotificationAgenda.define(
  "send-business-verify",
  sendBusinessVerificatonJob
);
businessNotificationAgenda.define(
  "send-business-verified",
  sendBusinessVerifiedJob
);
businessNotificationAgenda.define(
  "send-business-reminder",
  sendBusinessVerificatonJob
);
businessNotificationAgenda.define(
  "send-business-offline-notification",
  sendBusinessStatusNotifications
);

businessNotificationAgenda.start();
module.exports = businessNotificationAgenda;
