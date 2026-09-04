import express from "express"
import { getMe, loginUser } from "../../controller/auth/auth-controller.js";
import { loginLimiter } from "../../middlewares/rateLimiter-middleware.js";
import { protect } from "../../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/login", loginLimiter, loginUser)
router.get("/me", protect, getMe);
router.post("/logout", protect, (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
    res.json({ success: true, message: "Logged out" });
});



export default router;