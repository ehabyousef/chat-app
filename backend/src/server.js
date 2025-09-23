import dotenv from "dotenv";
import { connectDB } from "./DB/connection.js";
import app from "./index.js";
import { createServer } from "http";
import { initSocket } from "./utils/socket.js";

dotenv.config();

const PORT = process.env.PORT;

const httpServer = createServer(app);
initSocket(httpServer);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`app server started at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`failed to start server at port ${PORT}`);
    process.exit(1);
  });
