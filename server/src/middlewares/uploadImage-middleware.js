import multer from "multer";

const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
//   if (!allowedTypes.includes(file.mimetype)) {
//     return cb(new Error("Only JPEG, PNG, and WEBP images are allowed"), false);
//   }
//   cb(null, true);
// };

const fileFilter = (req, file, cb) => {
  console.log("File:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
  });

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only JPEG, PNG, and WEBP images are allowed`,
      ),
      false,
    );
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};