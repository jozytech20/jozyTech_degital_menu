import express from "express"
import { createVenue } from "../../controller/admin/venue-controller.js";
import { authorize, protect } from "../../middlewares/auth-middleware.js";


const router = express.Router()

router.post("/venues" ,protect, authorize("superAdmin") ,createVenue)



export default router