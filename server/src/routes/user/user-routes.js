import express from "express"
import { authorize, protect } from "../../middlewares/auth-middleware.js";
import { deleteUser, fetchUsers, updateUser } from "../../controller/user/user-controller.js";


const router = express.Router();

router.get("/users", protect, authorize("superAdmin") ,fetchUsers );
router.patch("/users/:id", protect, authorize("superAdmin"), updateUser);
router.delete("/users/:id", protect, authorize("superAdmin"), deleteUser);


export default router;