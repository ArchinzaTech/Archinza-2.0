const Agenda = require("agenda");
const con = require("../helpers/db");

const emailOtpJob = require("./emailOtp");
const mobileOtpJob = require("./mobileOtp");
const newDeviceJob = require("./newDeviceLogin");
const businessVeirfyJob = require("./businessVerify");

const agenda = new Agenda({ mongo: con });

agenda.define("email-otp", emailOtpJob);
agenda.define("mobile-otp", mobileOtpJob);
agenda.define("new-device-login", newDeviceJob);
agenda.define("business_verify", businessVeirfyJob);

agenda.start();
module.exports = agenda;
