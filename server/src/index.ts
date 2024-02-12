import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("message", (message) => {
    socket.emit("globalMessage", message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (_, res) => {
  res.json("Server in running fine ✅");
});

server.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
