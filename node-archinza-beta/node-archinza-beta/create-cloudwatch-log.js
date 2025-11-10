require("dotenv").config();
const {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
} = require("@aws-sdk/client-cloudwatch-logs");
const config = require("./config/config");

const client = new CloudWatchLogsClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const LOG_GROUP = config.cloudWatch.logGroupName; // e.g. "archinza-logs"
const LOG_STREAM = process.env.CLOUDWATCH_LOG_STREAM_NAME; // e.g. "archinza-development"

async function createLogGroup() {
  try {
    await client.send(new CreateLogGroupCommand({ logGroupName: LOG_GROUP }));
    console.log(`✅ Log group created: ${LOG_GROUP}`);
  } catch (err) {
    if (err.name === "ResourceAlreadyExistsException") {
      console.log(`ℹ️ Log group already exists: ${LOG_GROUP}`);
    } else {
      throw err;
    }
  }
}

async function createLogStream() {
  try {
    await client.send(
      new CreateLogStreamCommand({
        logGroupName: LOG_GROUP,
        logStreamName: LOG_STREAM,
      })
    );
    console.log(`✅ Log stream created: ${LOG_STREAM}`);
  } catch (err) {
    if (err.name === "ResourceAlreadyExistsException") {
      console.log(`ℹ️ Log stream already exists: ${LOG_STREAM}`);
    } else {
      throw err;
    }
  }
}

(async () => {
  try {
    await createLogGroup();
    await createLogStream();
    console.log("🎉 CloudWatch log setup completed successfully!");
  } catch (error) {
    console.error("❌ Failed to create CloudWatch resources:", error);
    process.exit(1);
  }
})();
