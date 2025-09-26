import { Server } from "socket.io";

// used to store online users
const userSocketMap = {}; // {userId: socketId}

// Will store the Socket.IO server instance
let io;

// Function to get the receiver's socket ID by userId
function getReciverSocketId(userId) {
  return userSocketMap[userId];
}

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;
    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket?.id}`);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
};

export { initSocket, getReciverSocketId, io };
