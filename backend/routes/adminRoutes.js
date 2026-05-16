const express = require("express");

const router =
    express.Router();

const {
    protect,
    admin,
} = require(
    "../middleware/authMiddleware"
);

const {

    createUser,

    getUsers,

    deleteUser,

    getStats,

    getAllUploads,

} = require(
    "../controllers/adminController"
);


// CREATE USER
router.post(
    "/users",
    protect,
    admin,
    createUser
);


// GET USERS
router.get(
    "/users",
    protect,
    admin,
    getUsers
);


// DELETE USER
router.delete(
    "/users/:id",
    protect,
    admin,
    deleteUser
);


// GET STATS
router.get(
    "/stats",
    protect,
    admin,
    getStats
);


// GET ALL UPLOADS
router.get(
    "/uploads",
    protect,
    admin,
    getAllUploads
);

module.exports = router;