// routes/list.js
import express from "express";
import { db } from "../firebase.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const snapshot = await db
      .collection("files")
      .where("userId", "==", req.user.uid)
      .get();

    const files = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json({ files });
  } catch (err) {
    console.error("List error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
