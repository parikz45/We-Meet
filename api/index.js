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

// Load routes
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const messageRoute = require('./routes/messages');
const conversationRoute = require('./routes/conversations');
const notificationRoute = require('./routes/notifications');

// Load environment variables
dotenv.config();

// Allowed Origins 
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://we-meet-ebon.vercel.app",
  "https://we-meet-mecf4.sevalla.app"
];

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

// Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/notifications", notificationRoute);

// Multer Config (images)
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: imageStorage });

// Multer Config (audio)
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/audios"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});
const Upload = multer({ storage: audioStorage });

// Upload Routes
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    console.log("File uploaded:", req.file);
    return res.status(200).json({ filename: req.file.filename });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json("Upload failed");
  }
});

app.post("/api/messages/audio", Upload.single("audio"), async (req, res) => {
  if (!req.file || !req.body.sender || !req.body.conversationId) {
    return res.status(400).json("Missing file or metadata");
  }

  try {
    const newMsg = new Message({
      sender: req.body.sender,
      conversationId: req.body.conversationId,
      audio: req.file.filename,
    });
    const saved = await newMsg.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
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
