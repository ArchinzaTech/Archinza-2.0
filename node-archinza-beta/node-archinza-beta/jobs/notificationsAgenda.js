const Agenda = require("agenda");
const con = require("../helpers/db");

const sendReminderJob = require("./sendReminder.js");
const personalWelcomeJob = require("./personalWelcomeJob.js");
const nonProWelcomeJob = require("./nonProWelcomeJob.js");
const nonProChangeRoleJob = require("./nonProChangeRoleJob.js");

const notificationAgenda = new Agenda({
  mongo: con,
  db: { collection: "notificationJobs" },
});

notificationAgenda.define("send-pro-reminder", sendReminderJob);
notificationAgenda.define("send-pro-welcome", personalWelcomeJob);
notificationAgenda.define("send-non-pro-welcome", nonProWelcomeJob);
notificationAgenda.define("send-non-pro-rolechange", nonProChangeRoleJob);

notificationAgenda.start();
module.exports = notificationAgenda;
