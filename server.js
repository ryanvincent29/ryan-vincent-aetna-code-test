const config = require('config');
const app = require('./src');
const launchTimestamp = Date.now();
const { randomUUID } = require('crypto');
const serverGuid = randomUUID();
const server = app.listen(config.get("app.port"), () => {
  console.info(`App launched at ${launchTimestamp} with GUID: ${serverGuid} on port ${config.get("app.port")}`)
});

process.on('SIGTERM', () => {
  console.info("SIGTERM Received. Closing server.");
  server.close(() => {
    console.info(`App launched at ${launchTimestamp} with GUID: ${serverGuid} has been closed`)
  })
});
