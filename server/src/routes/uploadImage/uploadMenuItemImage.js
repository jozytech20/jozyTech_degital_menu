import express from "express"
import { authorize, protect } from "../../middlewares/auth-middleware.js";
import { uploadMenuItemImage } from "../../controller/uploadImage/uploadMenuItemImage.js";
import { handleUpload } from "../../middlewares/uploadImage-middleware.js";

const router = express.Router();

router.post("/upload-image",protect ,authorize ("owner"),
  handleUpload,
  uploadMenuItemImage,
);


export default router;