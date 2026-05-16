const express = require("express");

const router = express.Router();

const {
    protect,
} = require("../middleware/authMiddleware");

const {
    getHistory,
} = require("../controllers/historyController");


// GET HISTORY
router.get(
    "/",
    protect,
    getHistory
);

module.exports = router;