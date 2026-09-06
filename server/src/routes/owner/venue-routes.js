import express from "express";
import { getMyVenue, updateMyVenue } from "../../controller/owner/venue-controller.js";
import { authorize, protect } from "../../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/venue", protect, authorize("owner"), getMyVenue);
router.patch("/venue", protect, authorize("owner"), updateMyVenue);

export default router;