import express from "express"
import { loginUser } from "../../controller/auth/auth-controller.js";
import { loginLimiter } from "../../middlewares/rateLimiter-middleware.js";

const router = express.Router();

router.post("/login",loginLimiter, loginUser)



export default router;