import express from "express"
import { getMe, loginUser } from "../../controller/auth/auth-controller.js";
import { loginLimiter } from "../../middlewares/rateLimiter-middleware.js";
import { protect } from "../../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/login",loginLimiter, loginUser)
router.get("/me", protect , getMe);


export default router;