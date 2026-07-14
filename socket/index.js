const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://we-meet-ebon.vercel.app",
];

const server = http.createServer();

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Authenticate every socket connection using the same access token as the REST API.
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Not authenticated"));

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) return next(new Error("Invalid token"));
        socket.user = payload; // { id, isAdmin }
        next();
    });
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    // Identity comes from the verified token, never from the client payload.
    const userId = socket.user.id;
    addUser(userId, socket.id);
    io.emit("getUsers", users);

    socket.on("sendMessage", (message) => {
        const receiver = getUser(message.receiverId);
        if (receiver) {
            io.to(receiver.socketId).emit("getMessage", {
                ...message,
                sender: userId, // trust the authenticated sender
            });
        }
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

const PORT = process.env.PORT || 8900;
server.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`);
});
