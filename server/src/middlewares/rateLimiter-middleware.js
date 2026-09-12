import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true, // sends RateLimit-* headers so clients can see their remaining attempts
  legacyHeaders: false, // disables the older X-RateLimit-* headers (redundant with standardHeaders)
});

export const publicMenuLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  message: {
    success: false,
    message: "Too many requests. Please try again shortly.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});