const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");


// ADMIN PROTECTED ROUTE
router.get("/", protect, (req, res) => {
    res.json({
        message: "Admin Route Access Granted",
        admin: req.user,
    });
});

module.exports = router;