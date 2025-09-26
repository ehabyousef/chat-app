import dotenv from "dotenv";
import { connectDB } from "./DB/connection.js";
import app from "./index.js";
import { createServer } from "http";
import { initSocket } from "./utils/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Initialize Socket.IO with the HTTP server
initSocket(httpServer);

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`app server started at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`failed to start server at port ${PORT}`);
    console.error(err);
    process.exit(1);
  });
