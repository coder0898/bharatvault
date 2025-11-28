// routes/shareAccess.js
import express from "express";
import path from "path";
import fs from "fs";
import { db } from "../firebase.js";

const router = express.Router();

router.get("/:shareLink", async (req, res) => {
  try {
    const snapshot = await db
      .collection("files")
      .where("shareLink", "==", req.params.shareLink)
      .get();

    if (snapshot.empty)
      return res.status(404).json({ error: "Invalid or expired link" });

    const fileData = snapshot.docs[0].data();

    const __dirname = path.resolve();
    const filePath = path.join(__dirname, fileData.path);

    if (!fs.existsSync(filePath))
      return res.status(404).json({ error: "File not found" });

    return res.download(filePath, fileData.name);
  } catch (err) {
    console.error("Share access error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
