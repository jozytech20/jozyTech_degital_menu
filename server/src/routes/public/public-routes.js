import express from "express"
import { getPublicMenu, searchPublicMenu } from "../../controller/public/public-controller.js";
import { resolveVenue } from "../../middlewares/venue-middleware.js";
import { publicMenuLimiter } from "../../middlewares/rateLimiter-middleware.js";

const router = express.Router();

router.get("/menu", publicMenuLimiter, resolveVenue, getPublicMenu);
router.get("/menu/search", publicMenuLimiter, resolveVenue, searchPublicMenu);


export default router;