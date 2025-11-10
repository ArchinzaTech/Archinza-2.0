const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const logger = require("morgan");
const logger = require("./logger");
const infoLogger = require("./logger/info_logger");

const Agendash = require("agendash");

const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const RedisStore = require("connect-redis").default;
const redisClient = require("./helpers/redis");
const path = require("path");
const { sendResponse, sendError, validator } = require("./helpers/api");
const auth = require("./middlewares/auth");
const botAuth = require("./middlewares/botAuth");
const aiAuth = require("./middlewares/aiAuth");
const errorHandler = require("./middlewares/errorHandler");
const apiLogger = require("./middlewares/apiLogger");
const razorpayLogger = require("./middlewares/razorpayLogger");
const aiApiLogger = require("./middlewares/aiApiLogger");
const db = require("./helpers/db");
const smtp = require("./helpers/smtp");
const cron = require("node-cron");

const config = require("./config/config");
const agenda = require("./jobs/agenda");
const notifyAgenda = require("./jobs/notificationsAgenda");
const businessNotifyAgenda = require("./jobs/businessNotificationsAgenda");
const { updateStats } = require("./helpers/api");
const internalApiLogger = require("./middlewares/internalApiLogger");

const app = express();
// app.use(logger("dev"));

//Constants
const PORT = 3020;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://192.168.0.103:3000",
      "http://192.168.29.159:3000/",
      "http://192.168.29.159:3000",
      "http://172.25.208.1:3000",
      "http://174.138.123.146:9083",

      "http://174.138.123.146:9028", //frontend
      "http://174.138.123.146:9040", //admin
      "https://beta.archinza.com",
      "https://archinza.com",
      "https://www.archinza.com",
      "https://admin.archinza.com",
      "https://www.admin.archinza.com",
    ],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
    credentials: true,
  })
);

app.use(
  "/razorpay/webhook",
  express.raw({ type: "application/json" }),
  razorpayLogger,
  require("./routes/razorpay/webhook")
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// ================================ SMTP ================================================

if (config.app_mode === "production") {
  smtp.verify(function (error, success) {
    if (error) {
      logger.error(error.message);
    } else {
      infoLogger.info("SMTP Connected");
    }
  });
}

// =============================DATABASE CONNECTION======================================

db.on("open", () => {
  infoLogger.info("Database connected");
});

// =============================SESSION=================================================

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    store: new RedisStore({ client: redisClient }),
    secret: config.session_secretkey,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// =============================FRONTEND ROUTES======================================
app.use("/agenda-dash", Agendash(agenda));
app.use("/agenda-notify", Agendash(notifyAgenda));
app.use("/business-agenda-notify", Agendash(businessNotifyAgenda));

app.use("/general", require("./routes/general"));
app.use("/forms", require("./routes/forms"));

app.use("/personal", require("./routes/personal"));
app.use("/pro-access", require("./routes/proAccess"));
app.use("/options", require("./routes/option"));

app.use("/business", [internalApiLogger], require("./routes/business"));
app.use("/services", require("./routes/services"));
app.use("/stats", require("./routes/stats"));
app.use("/business-plans", require("./routes/businessSubscription"));
app.use("/auth", require("./routes/auth"));

app.use("/google-api", require("./routes/googleApi"));

// app.use("/press", require("./routes/press"));

// =============================ADMIN ROUTES======================================

app.use("/admin/auth", require("./routes/admin/auth"));

// Auth middleware for admin
app.use("/admin", auth);

app.use("/admin/users", require("./routes/admin/users"));
app.use("/admin/roles", require("./routes/admin/roles"));
app.use("/admin/feedbacks", require("./routes/admin/feedbacks"));
app.use(
  "/admin/business-users",
  require("./routes/admin/content/business-users")
);
app.use("/admin/content/options", require("./routes/admin/content/options"));
app.use(
  "/admin/content/business-options",
  require("./routes/admin/content/business-options")
);
app.use(
  "/admin/content/business-types",
  require("./routes/admin/content/business-types")
);
app.use(
  "/admin/content/business-work-questions",
  require("./routes/admin/content/businessWorkQuestions")
);
app.use(
  "/admin/content/business-verifications",
  require("./routes/admin/content/business-verifications")
);
app.use("/admin/logs", require("./routes/admin/logs/logs"));

app.use(
  "/admin/mailchimp/audience",
  require("./routes/admin/mailchimp/audience")
);
app.use("/admin/mailchimp/tags", require("./routes/admin/mailchimp/tags"));
app.use(
  "/admin/mailchimp/members",
  require("./routes/admin/mailchimp/members")
);

// app.use("/admin/finalists", require("./routes/admin/finalists"));

// app.use("/admin/publishers", require("./routes/admin/publishers"));
// app.use("/admin/press", require("./routes/admin/press"));

// app.use("/admin/leads", require("./routes/admin/leads"));
// =============================AI ROUTES======================================
app.use("/ai/auth", [cors(), aiApiLogger], require("./routes/ai/auth"));
app.use("/ai", [cors(), aiAuth]);

// Auth middleware for admin
app.use("/ai/content", aiApiLogger, require("./routes/ai/content"));

// =============================BOT ROUTES======================================
app.use("/bot/auth", [cors(), apiLogger], require("./routes/bot/auth"));

// Auth middleware for admin
app.use("/bot", [cors(), apiLogger, botAuth]);
app.use("/bot/user", require("./routes/bot/user"));
app.use("/bot/pro-access", apiLogger, require("./routes/bot/proAccess"));
app.use("/bot/general", require("./routes/bot/general"));

//error handler middleware
app.use(errorHandler);

cron.schedule("0 0 * * *", () => {
  logger.info("Running scheduled stats update...");
  updateStats();
});

//server
app.listen(PORT, () => {
  infoLogger.info(`Server started on port ${PORT}`);
});
