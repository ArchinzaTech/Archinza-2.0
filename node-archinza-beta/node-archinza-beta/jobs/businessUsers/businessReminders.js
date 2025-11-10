const businessReminderSchedule = [
  {
    delay: "in 24 hours",
    label: "send-business-reminder",
    template: "first24hrs",
    subject: "Your profile is waiting to go live…",
  },
  {
    delay: "in 2 weeks",
    label: "send-business-reminder",
    template: "week2",
    subject:
      "Your next client is searching for you, but they can’t find you yet.",
  },
  {
    delay: "in 4 weeks",
    label: "send-business-reminder",
    template: "week4",
    subject: "Your work deserves to be seen. Let’s make it visible.",
  },
];

module.exports = businessReminderSchedule;
