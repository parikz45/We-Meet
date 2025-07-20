// using dependencies
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const Message = require("./Models/Message");

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const messageRoute = require('./routes/messages');
const conversationRoute = require('./routes/conversations');
const notificationRoute = require('./routes/notifications');

dotenv.config();

//  Serve static files from public/images
app.use("/images", express.static(path.join(__dirname, "public/images")));


app.use(express.json());
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" })
);
app.use(morgan("common"));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://fascinating-cupcake-8a809a.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or whitelisted ones
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));




// 🔧 Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/notifications",notificationRoute);

// 🔧 Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/audios"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const Upload = multer({ storage: Storage });

// Upload Route
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    console.log("File uploaded:", req.file);
    return res.status(200).json({ filename: req.file.filename });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json("Upload failed");
  }
});

// upload audios
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
app.use("/api/messages/audio", express.static(path.join(__dirname, "public/audios")));



//  MongoDB Connect
mongoose.connect(process.env.Mongo_Url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Server Listening
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

