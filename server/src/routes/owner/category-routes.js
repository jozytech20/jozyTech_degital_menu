import express from "express"
import { createCategory, deleteCategory, fetchCategory, updateCategory } from "../../controller/owner/category-controller.js";
import { authorize, protect } from "../../middlewares/auth-middleware.js";


const router = express.Router()


router.post("/categories",protect, authorize("owner"), createCategory);
router.get("/categories",protect, authorize("owner"), fetchCategory);
router.patch("/categories/:id",protect, authorize("owner"), updateCategory);
router.delete("/categories/:id",protect, authorize("owner"), deleteCategory);


export default router;