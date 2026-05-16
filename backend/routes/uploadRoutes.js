const express = require("express");

const router = express.Router();

const upload =
    require("../middleware/uploadMiddleware");

const {
    protect,
} = require("../middleware/authMiddleware");

const {
    uploadImages,
} = require("../controllers/uploadController");



// UPLOAD + OCR + CSV
router.post(
    "/",
    protect,
    upload.array("images", 20),
    uploadImages
);

module.exports = router;