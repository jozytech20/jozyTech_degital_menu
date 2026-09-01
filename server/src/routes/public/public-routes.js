import express from "express"
import { getPublicMenu, searchPublicMenu } from "../../controller/public/public-controller.js";
import { resolveVenue } from "../../middlewares/venue-middleware.js";

const router = express.Router();

router.get("/menu", resolveVenue, getPublicMenu);
router.get("/menu/search", resolveVenue, searchPublicMenu);


export default router;