import fs from "fs";
import path from "path";

const logsFolder = path.join(process.cwd(), "logs");

// Ensure logs directory exists
if (!fs.existsSync(logsFolder)) {
  fs.mkdirSync(logsFolder, { recursive: true });
}

/**
 * Log user actions directly
 * @param {Object} param0
 * @param {string} param0.userId
 * @param {string} param0.action
 * @param {Object} [param0.details]
 */
export const logActionDirect = ({ userId, action, details = {} }) => {
  const date = new Date().toISOString().split("T")[0];
  const logFile = path.join(logsFolder, `${date}.log`);

  const logEntry = `[${new Date().toISOString()}] User: ${userId} - Action: ${action} - Details: ${JSON.stringify(
    details
  )}\n`;

  fs.appendFileSync(logFile, logEntry);
};
