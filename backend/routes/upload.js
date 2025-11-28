import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { db } from "../firebase.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();
const __dirname = path.resolve();
const uploadFolder = path.join(__dirname, "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    let originalName = file.originalname;

    // Remove any _ filename_=... parts (caused by some browser encodings)
    const match = originalName.match(/_ filename_=.*''(.*)/);
    if (match) originalName = match[1];

    // Replace spaces with underscores (optional)
    originalName = originalName.replace(/\s/g, " ");

    // Remove any unsafe characters from filename
    originalName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, "");

    // Prepend timestamp to avoid collisions
    const finalName = `${Date.now()}-${originalName}`;

    cb(null, finalName);
  },
});

const upload = multer({ storage });

// Upload route
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const fileData = {
    userId: req.user.uid,
    name: req.file.originalname, // Original name from the upload
    fileName: req.file.filename, // Sanitized stored filename
    path: `/uploads/${req.file.filename}`,
    size: req.file.size,
    type: req.file.mimetype,
    date: new Date().toISOString(),
    shared: false,
    url: null,
  };

  try {
    const docRef = await db.collection("files").add(fileData);

    return res.status(201).json({
      file: {
        id: docRef.id,
        ...fileData,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
