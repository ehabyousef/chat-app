import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { errorHandler, notFound } from "./middleware/errorhandler.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { userRouter } from "./modules/users/users.route.js";
import { messageRouter } from "./modules/messages/message.route.js";
const app = express();

const __dirname = path.resolve();

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
// Increase JSON/urlencoded limits (still useful for non-file routes)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(express.static(path.join(__dirname, "../images")));
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use(notFound);
app.use(errorHandler);
export default app;
