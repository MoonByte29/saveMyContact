const multer = require("multer");
const path = require("path");


// Storage configuration
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    },
});


// File filter
const fileFilter = (req, file, cb) => {

    const allowedTypes =
        /jpeg|jpg|png|bmp|tiff/;

    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(
        file.mimetype
    );

    if (extname && mimetype) {
        return cb(null, true);
    }

    cb(new Error("Only image files are allowed"));
};


// Upload middleware
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter,
});

module.exports = upload;