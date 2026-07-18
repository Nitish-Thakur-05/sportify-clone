import express from "express";
import registerRoute from "./routes/register.routes.js";
import cookieParser from "cookie-parser";
import loginRoute from "./routes/login.route.js";
import musicRoute from "./routes/music.route.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// routes
app.use("/api/auth", registerRoute);
app.use("/api/auth", loginRoute);
app.use("/api/music", musicRoute);

export default app;
