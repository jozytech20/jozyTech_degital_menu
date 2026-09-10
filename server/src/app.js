import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth/auth-routes.js"
import venueRoutes from "./routes/admin/venue-routes.js"
import userRoutes from "./routes/user/user-routes.js"
import categoryRoutes from "./routes/owner/category-routes.js";
import menuItemRoutes from "./routes/owner/menu-item-routes.js"
import ownerVenueRoutes from "./routes/owner/venue-routes.js"
import publicRoutes from "./routes/public/public-routes.js";
import imageRoutes from "./routes/uploadImage/uploadMenuItemImage.js";


const app = express();

const strictCors = cors({
  origin: process.env.CLIENT_URL,
  credentials: true
});


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", strictCors, authRouter)
app.use("/api/admin", strictCors, venueRoutes)
app.use("/api/admin", strictCors, userRoutes)
app.use("/api/owner", strictCors, categoryRoutes)
app.use("/api/owner", strictCors, menuItemRoutes)
app.use("/api/owner", strictCors, ownerVenueRoutes)
app.use("/api/owner", strictCors, imageRoutes)

app.use("/api/public", cors(), publicRoutes)

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "success"
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