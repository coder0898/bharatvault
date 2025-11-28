// routes/update.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { db } from "../firebase.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();
const __dirname = path.resolve();
const uploadFolder = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.put("/:id", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const docRef = db.collection("files").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists)
      return res.status(404).json({ error: "File not found" });

    const oldData = docSnap.data();
    if (oldData.userId !== req.user.uid)
      return res.status(403).json({ error: "Not allowed" });

    // delete old file
    const oldFilePath = path.join(__dirname, oldData.path);
    if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

    // new file data
    const updatedData = {
      name: req.file.originalname,
      fileName: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
      type: req.file.mimetype,
      updatedAt: new Date().toISOString(),
      shared: false,
      url: null,
    };

    await docRef.update(updatedData);

    return res.json({
      file: {
        id: req.params.id,
        userId: req.user.uid,
        ...updatedData,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
