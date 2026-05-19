const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect, admin } = require("../middleware/authMiddleware");

const {
    uploadImages,
    getUploads,
    getUploadsByUser,      // <-- NEW
    downloadCSV,
    deleteUpload,
    deleteUploadsByUser,   // <-- NEW
} = require("../controllers/uploadController");

// UPLOAD + OCR + CSV
router.post("/", protect, upload.array("images", 20), uploadImages);

// GET ALL UPLOADS FOR LOGGED-IN USER
router.get("/", protect, getUploads);

// ADMIN: GET UPLOADS BY SPECIFIC USER ID
router.get("/user/:userId", protect, admin, getUploadsByUser);   // <-- NEW

// ADMIN: DELETE ALL UPLOADS FOR A USER
router.delete("/user/:userId", protect, admin, deleteUploadsByUser); // <-- NEW

// DOWNLOAD CSV
router.get("/download/:id", protect, downloadCSV);

// DELETE SINGLE UPLOAD
router.delete("/:id", protect, deleteUpload);

module.exports = router;