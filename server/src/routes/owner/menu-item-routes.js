import express from "express";
import { authorize, protect } from "../../middlewares/auth-middleware.js";
import { createMenuItem, deleteMenuItem, fetchMenuItems, updateMenuItem } from "../../controller/owner/menu-item-controller.js";

const router = express.Router();

router.post("/menu-items", protect, authorize("owner"), createMenuItem);
router.get("/menu-items", protect, authorize("owner"), fetchMenuItems);
router.patch("/menu-items/:id", protect, authorize("owner"), updateMenuItem);
router.delete("/menu-items/:id", protect, authorize("owner"), deleteMenuItem);

export default router;