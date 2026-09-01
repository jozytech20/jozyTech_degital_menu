import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true, // sends RateLimit-* headers so clients can see their remaining attempts
  legacyHeaders: false, // disables the older X-RateLimit-* headers (redundant with standardHeaders)
});
