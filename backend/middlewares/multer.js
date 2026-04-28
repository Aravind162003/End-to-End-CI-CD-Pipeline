import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = file.fieldname === "trailer" ? "movie-trailer" : "movie-poster";
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

// File filter for images and video
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif/;
  const allowedVideoTypes = /mp4|mov|avi|mkv/;

  const ext = path.extname(file.originalname).toLowerCase().slice(1); // remove dot
  const mimetype = file.mimetype;

  if (
    (file.fieldname === "poster" && allowedImageTypes.test(ext) && allowedImageTypes.test(mimetype)) ||
    (file.fieldname === "trailer" && allowedVideoTypes.test(ext) && allowedVideoTypes.test(mimetype))
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only images (jpg, jpeg, png, gif) for poster and videos (mp4, mov, avi, mkv) for trailer are allowed."),
      false
    );
  }
};

// Multer instance for multiple file fields
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max for both files
  fileFilter,
});

export const movieUpload = upload.fields([
  { name: "poster", maxCount: 1 },
  { name: "trailer", maxCount: 1 },
]);

export default movieUpload;
