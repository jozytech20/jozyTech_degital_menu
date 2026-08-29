import express from "express"
import { createVenue, fetchVenues, updateVenue } from "../../controller/admin/venue-controller.js";
import { authorize, protect } from "../../middlewares/auth-middleware.js";


const router = express.Router()

router.post("/venues" ,protect , authorize("superAdmin") ,createVenue)
router.get("/venues" ,protect , authorize("superAdmin") ,fetchVenues)
router.patch("/venues/:id" ,protect , authorize("superAdmin") ,updateVenue)


export default router;