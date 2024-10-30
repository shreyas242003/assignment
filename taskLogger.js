const fs = require("fs");
const path = require("path");
const logFilePath = path.join(__dirname, "task_log.txt");

module.exports = async function taskLogger(userId) {
  const timestamp = new Date().toISOString();
  const logEntry = `Task completed for user: ${userId} at ${timestamp}\n`;

  // Append the log entry to the file
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) throw err;
  });

  console.log(logEntry); // Log to console for quick view
};
