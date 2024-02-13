import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

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
  console.log("Server running at http://localhost:8080");
});
