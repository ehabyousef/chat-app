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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../images")));
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use(notFound);
app.use(errorHandler);
export default app;
