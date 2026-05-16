const User = require("../models/User");

const Upload =
    require("../models/Upload");

const bcrypt =
    require("bcryptjs");


// CREATE USER
exports.createUser = async (
    req,
    res
) => {

    try {

        const {
            username,
            password,
            role,
        } = req.body;

        const existingUser =
            await User.findOne({
                username,
            });

        if (existingUser) {

            return res.status(400).json({
                message:
                    "User already exists",
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const user =
            await User.create({

                username,

                password:
                    hashedPassword,

                role,
            });

        res.status(201).json({

            message:
                "User created successfully",

            user,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};


// GET USERS
exports.getUsers = async (
    req,
    res
) => {

    try {

        const users =
            await User.find()
                .select("-password");

        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};


// DELETE USER
exports.deleteUser = async (
    req,
    res
) => {

    try {

        await User.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message:
                "User deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};


// GET STATS
exports.getStats = async (
    req,
    res
) => {

    try {

        const totalUsers =
            await User.countDocuments();

        const adminUsers =
            await User.countDocuments({
                role: "admin",
            });

        const regularUsers =
            await User.countDocuments({
                role: "user",
            });

        const totalUploads =
            await Upload.countDocuments();

        res.status(200).json({

            totalUsers,

            adminUsers,

            regularUsers,

            totalUploads,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};


// GET ALL UPLOADS
exports.getAllUploads = async (
    req,
    res
) => {

    try {

        const uploads =
            await Upload.find()
                .populate(
                    "userId",
                    "username"
                )
                .sort({
                    createdAt: -1,
                });

        res.status(200).json(
            uploads
        );

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};