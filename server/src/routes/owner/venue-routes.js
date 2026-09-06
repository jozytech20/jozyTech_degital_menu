import express from "express";
import { getMyVenue, updateMyVenue } from "../../controller/owner/venue-controller";
import { authorize, protect } from "../../middlewares/auth-middleware";

const router = express.Router();

router.get("/venue", protect, authorize("owner"), getMyVenue);
router.patch("/venue", protect, authorize("owner"), updateMyVenue);

export default router;