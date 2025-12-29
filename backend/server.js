// server.js
import express from "express";
import cors from "cors";
import path from "path";

// Routes
import uploadRoute from "./routes/upload.js";
import updateRoute from "./routes/update.js";
import deleteRoute from "./routes/delete.js";
import shareRoute from "./routes/share.js";
import shareAccessRoute from "./routes/shareAccess.js";
import listRoute from "./routes/list.js";
import loggerRoutes from "./routes/logger.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads directory publicly
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/files/upload", uploadRoute);
app.use("/files/update", updateRoute);
app.use("/files/delete", deleteRoute);
app.use("/files/share", shareRoute);
app.use("/files/shared", shareAccessRoute); // public download
app.use("/files/list", listRoute);
app.use("/api", loggerRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("File Management Backend Running");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
