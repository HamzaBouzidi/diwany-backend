import multer from 'multer';
import path from 'path';

// Configure Multer for file uploads
const storage = multer.diskStorage({
 destination: (req, file, cb) => {
  cb(null, 'uploads/'); // Directory where files will be stored
 },
 filename: (req, file, cb) => {
  cb(null, `${Date.now()}-${file.originalname}`);
 },
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
 const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
 if (allowedMimeTypes.includes(file.mimetype)) {
  cb(null, true);
 } else {
  cb(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.'));
 }
};

// Multer configuration
export const upload = multer({
 storage: storage,
 fileFilter: fileFilter,
 limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 5MB
});
