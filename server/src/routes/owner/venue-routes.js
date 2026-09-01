import express from "express";
import { getMyVenue } from "../../controller/owner/venue-controller";
import { authorize, protect } from "../../middlewares/auth-middleware";

const router = express.Router();

router.get("/venue", protect, authorize("owner"), getMyVenue);


export default router;