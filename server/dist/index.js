"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            "https://simple-chat-client-theta.vercel.app/",
            "http://localhost:5173",
        ],
    },
});
app.use((0, cors_1.default)({
    origin: [
        "https://simple-chat-client-theta.vercel.app/",
        "http://localhost:5173",
    ],
}));
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.json("Running");
});
io.on("connection", (socket) => {
    console.log(`connect ${socket.id}`);
    socket.on("userMessage", (message, username) => {
        const time = new Date();
        io.emit("globalMessage", message, username, time);
    });
    socket.on("typing", (username, isTyping) => {
        io.emit("globalTyping", username, isTyping);
    });
    socket.on("disconnect", () => {
        console.log(`disconnect ${socket.id}`);
    });
});
server.listen(8080, () => {
    console.log("Server running at https://simple-chat-server-five.vercel.app");
});
