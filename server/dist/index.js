"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server(8080, {
    cors: {
        origin: "*",
    },
});
io.on("connection", (socket) => {
    console.log(`connect ${socket.id}`);
    socket.on("userMessage", (message, username) => {
        const time = new Date();
        console.log(message);
        io.emit("globalMessage", message, username, time);
    });
    socket.on("typing", (username, isTyping) => {
        io.emit("globalTyping", username, isTyping);
    });
    socket.on("disconnect", () => {
        console.log(`disconnect ${socket.id}`);
    });
});
io.listen(8080);
