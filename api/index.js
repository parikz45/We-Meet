const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const Message = require("./Models/Message");
const verifyToken = require("./middleware/verifyToken");

// Load routes
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const messageRoute = require('./routes/messages');
const conversationRoute = require('./routes/conversations');
const notificationRoute = require('./routes/notifications');

// Load environment variables
dotenv.config();

console.log("ENV CHECK:", {
  EMAIL: process.env.EMAIL,
  EMAIL_PASS: process.env.EMAIL_PASS ? "LOADED" : "MISSING",
});

// Allowed Origins 
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://we-meet-ebon.vercel.app",
  "https://we-meet-1-h00i.onrender.com",
  "https://we-meet-1-h00i.onrender.com"
];

// Trust the Render/Vercel proxy so client IPs (used by rate limiting) are correct.
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);


// Static File Serving
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/api/messages/audio", express.static(path.join(__dirname, "public/audios")));

// Routes (auth is public; everything else requires a valid token)
app.use("/api/auth", authRoute);
app.use("/api/users", verifyToken, userRoute);
app.use("/api/posts", verifyToken, postRoute);
app.use("/api/messages", verifyToken, messageRoute);
app.use("/api/conversations", verifyToken, conversationRoute);
app.use("/api/notifications", verifyToken, notificationRoute);

// Multer Config (images)
// Strip path separators from the client-supplied filename to avoid traversal.
const safeName = (name) =>
  Date.now() + "-" + path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, safeName(file.originalname));
  }
});
const imageFilter = (req, file, cb) => {
  if (/^image\/(jpe?g|png|gif|webp)$/.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};
const upload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Multer Config (audio)
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/audios"));
  },
  filename: (req, file, cb) => {
    cb(null, safeName(file.originalname));
  }
});
const audioFilter = (req, file, cb) => {
  if (/^audio\//.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only audio files are allowed"));
};
const Upload = multer({
  storage: audioStorage,
  fileFilter: audioFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Upload Routes
app.post("/api/upload", verifyToken, upload.single("file"), (req, res) => {
  try {
    console.log("File uploaded:", req.file);
    return res.status(200).json({ filename: req.file.filename });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json("Upload failed");
  }
});

app.post("/api/messages/audio", verifyToken, Upload.single("audio"), async (req, res) => {
  if (!req.file || !req.body.conversationId) {
    return res.status(400).json("Missing file or metadata");
  }

  try {
    const newMsg = new Message({
      sender: req.user.id,
      conversationId: req.body.conversationId,
      audio: req.file.filename,
    });
    const saved = await newMsg.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Central error handler (multer rejections, etc.) — always respond with JSON.
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 400).json(err.message || "Something went wrong");
});

// MongoDB Connect
mongoose.connect(process.env.Mongo_Url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
const server = http.createServer(app);
const PORT = process.env.PORT || 8800;

if (!PORT) {
    console.error("Error: The PORT environment variable is not set.");
    process.exit(1);
}

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
