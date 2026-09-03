import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth/auth-routes.js"
import venueRoutes from "./routes/admin/venue-routes.js"
import userRoutes from "./routes/user/user-routes.js"
import categoryRoutes from "./routes/owner/category-routes.js";
import menuItemRoutes from "./routes/owner/menu-item-routes.js"
import publicRoutes from "./routes/public/public-routes.js";
import imageRoutes from "./routes/uploadImage/uploadMenuItemImage.js";


const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        /\.?localhost:5173$/.test(origin) ||
        origin === process.env.CLIENT_URL
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter)
app.use("/api/admin", venueRoutes)
app.use("/api/admin", userRoutes)
app.use("/api/owner", categoryRoutes)
app.use("/api/owner", menuItemRoutes)
app.use("/api/owner", imageRoutes)
app.use("/api/public", publicRoutes)

app.get("/api/health", (req, res)=>{
  res.status(200).json({
    success : true,
    message : "success"
  })
})


// app.get(
//   "/api/test/admin-only",
//   protect,
//   authorize("superAdmin"),
//   (req, res) => {
//     res.json({ success: true, message: "You are a super admin" });
//   },
// );


export default app;