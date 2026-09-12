import cloudinary from "../../config/cloudinary.js";

export const deleteCloudinaryImage = async (publicId) => {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Failed to delete Cloudinary image:", error);
    }
};