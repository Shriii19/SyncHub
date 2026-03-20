const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/Message");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.CLIENT_URL || "*";

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
  },
});

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("SyncHub API Running...");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("User joined room:", roomId);
  });

  socket.on("sendMessage", async (data) => {
    try {
      if (!data?.roomId || !data?.content?.trim()) {
        return;
      }

      const newMessage = await Message.create({
        sender: data.senderId || null,
        room: data.roomId,
        content: data.content.trim(),
      });

      io.to(data.roomId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error saving message:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
