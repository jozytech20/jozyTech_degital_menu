import express from "express";
import { authorize, protect } from "../../middlewares/auth-middleware.js";
import { createMenuItem, deleteMenuItem, fetchMenuItems, updateMenuItem } from "../../controller/owner/menu-item-controller.js";

const router = express.Router();

router.post("/menuItems", protect, authorize("owner"), createMenuItem);
router.get("/menuItems", protect, authorize("owner"), fetchMenuItems);
router.patch("/menuItems/:id", protect, authorize("owner"), updateMenuItem);
router.delete("/menuItems/:id", protect, authorize("owner"), deleteMenuItem);

export default router;