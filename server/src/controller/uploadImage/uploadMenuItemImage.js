import { uploadBufferToCloudinary } from "../../helper/cloudinary.js";



export const uploadMenuItemImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image provided" });
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      "jozytech/menu-items",
    );

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: { url: result.secure_url },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};
