import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth/auth-routes.js"
import { protect, authorize } from "./middlewares/auth-middleware.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL, // your frontend's origin, from .env
    credentials: true, // required so the browser sends/receives the httpOnly cookie
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter)
app.get("/api/test/protected", protect, (req, res) => {
  res.json({ success: true, message: "You are authenticated", user: req.user });
});

app.get(
  "/api/test/admin-only",
  protect,
  authorize("superAdmin"),
  (req, res) => {
    res.json({ success: true, message: "You are a super admin" });
  },
);


export default app;