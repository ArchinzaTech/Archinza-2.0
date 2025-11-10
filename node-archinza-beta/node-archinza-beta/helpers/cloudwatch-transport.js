const Transport = require('winston-transport');
const {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  PutLogEventsCommand,
} = require('@aws-sdk/client-cloudwatch-logs');

class CloudWatchTransport extends Transport {
  constructor(opts) {
    super(opts);

    this.logGroupName = opts.logGroupName;
    this.logStreamName = opts.logStreamName;
    this.awsConfig = opts.awsConfig;

    if (!this.logGroupName || !this.logStreamName) {
      throw new Error('logGroupName and logStreamName are required.');
    }

    this.cloudwatchlogs = new CloudWatchLogsClient(this.awsConfig);
    this.uploadRate = opts.uploadRate || 2000;
    this.logEvents = [];
    this.intervalId = null;

    this._ensureLogGroupAndStream();
  }

  async _ensureLogGroupAndStream() {
    try {
      await this.cloudwatchlogs.send(new CreateLogGroupCommand({ logGroupName: this.logGroupName }));
    } catch (err) {
      if (err.name !== 'ResourceAlreadyExistsException') {
        console.error('Error creating log group:', err);
      }
    }
    await this._createLogStream();
  }

  async _createLogStream() {
    try {
      await this.cloudwatchlogs.send(new CreateLogStreamCommand({
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
      }));
    } catch (err) {
      if (err.name !== 'ResourceAlreadyExistsException') {
        console.error('Error creating log stream:', err);
      }
    }
    this._startUploader();
  }

  _startUploader() {
    this.intervalId = setInterval(() => {
      this._uploadToCloudWatch();
    }, this.uploadRate);
  }

  log(info, callback) {
    this.logEvents.push({
      message: JSON.stringify(info),
      timestamp: new Date().getTime(),
    });

    if (callback) {
      callback();
    }
  }

  async _uploadToCloudWatch() {
    if (this.logEvents.length === 0) {
      return;
    }

    const logEvents = this.logEvents.splice(0);

    const params = {
      logEvents,
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
    };

    try {
      await this.cloudwatchlogs.send(new PutLogEventsCommand(params));
    } catch (err) {
      console.error('Error uploading logs to CloudWatch:', err);
    }
  }

  flush(callback) {
    this._uploadToCloudWatch();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (callback) {
      callback();
    }
  }
}

module.exports = CloudWatchTransport;