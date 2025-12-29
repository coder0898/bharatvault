import express from "express";
import fs from "fs";
import path from "path";
import { logActionDirect } from "../middleware/actionLogger.js";

const router = express.Router();
const logsFolder = path.join(process.cwd(), "logs");

/**
 * POST /api/log
 * Body: { userId, action, details }
 */
router.post("/log", (req, res) => {
  const { userId, action, details } = req.body;

  if (!userId || !action) {
    return res.status(400).json({ error: "userId and action are required" });
  }

  try {
    logActionDirect({ userId, action, details });
    res.json({ message: "Log saved" });
  } catch (err) {
    console.error("Logger error:", err);
    res.status(500).json({ error: "Failed to log action" });
  }
});

/**
 * GET /api/logs?date=YYYY-MM-DD
 */
router.get("/logs", (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];
    const logFile = path.join(logsFolder, `${date}.log`);

    if (!fs.existsSync(logFile)) return res.json([]);

    const lines = fs.readFileSync(logFile, "utf-8").trim().split("\n");

    const logs = lines
      .map((line, index) => {
        const match = line.match(
          /^\[(.+)\] User: (.+) - Action: (.+) - Details: (.+)$/
        );
        if (!match) return null;

        const [, timestamp, userId, action, details] = match;
        let parsedDetails = {};
        try {
          parsedDetails = JSON.parse(details);
        } catch {}

        return {
          id: index,
          timestamp,
          userId,
          action,
          ...parsedDetails,
        };
      })
      .filter(Boolean);

    res.json(logs);
  } catch (err) {
    console.error("Read logs error:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
