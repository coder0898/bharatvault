// routes/share.js
import express from "express";
import { db } from "../firebase.js";
import verifyToken from "../middleware/auth.js";
import crypto from "crypto";

const router = express.Router();

router.post("/:id/share", verifyToken, async (req, res) => {
  try {
    const docRef = db.collection("files").doc(req.params.id);
    const snap = await docRef.get();

    if (!snap.exists) return res.status(404).json({ error: "File not found" });

    const fileData = snap.data();
    if (fileData.userId !== req.user.uid)
      return res.status(403).json({ error: "Not allowed" });

    const shareLink = crypto.randomBytes(16).toString("hex");
    const url = `/files/shared/${shareLink}`;

    await docRef.update({
      shareLink,
      shared: true,
      url,
      updatedAt: new Date().toISOString(),
    });

    return res.json({
      file: {
        id: snap.id,
        ...fileData,
        shared: true,
        shareLink,
        url,
      },
      shareLink,
    });
  } catch (err) {
    console.error("Share error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
