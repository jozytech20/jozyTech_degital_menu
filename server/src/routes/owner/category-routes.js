import express from "express"
import { createCategory } from "../../controller/owner/category-controller";
import { authorize, protect } from "../../middlewares/auth-middleware";


const router = express.Router()


router.post("/categories",protect, authorize("owner"), createCategory)


export default router;