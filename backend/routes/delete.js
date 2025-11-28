// routes/delete.js
import express from "express";
import fs from "fs";
import path from "path";
import { db } from "../firebase.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();
const __dirname = path.resolve();

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const docRef = db.collection("files").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists)
      return res.status(404).json({ error: "File not found" });

    const fileData = docSnap.data();
    if (fileData.userId !== req.user.uid)
      return res.status(403).json({ error: "Not allowed" });

    const filePath = path.join(__dirname, fileData.path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await docRef.delete();

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
