import { admin } from "../firebase.js";

// Middleware to verify Firebase ID token
async function verifyToken(req, res, next) {
  try {
    // Extract token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token using Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach decoded token to request
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default verifyToken;
