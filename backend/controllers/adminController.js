const User = require("../models/User");
const Upload = require("../models/Upload");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;


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
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Clean up uploads
        const uploads = await Upload.find({ userId }).select("csvPath imageUrls").lean();
        for (const upload of uploads) {
            if (upload.csvPath && fs.existsSync(upload.csvPath)) {
                fs.unlinkSync(upload.csvPath);
            }
            if (upload.imageUrls && upload.imageUrls.length > 0) {
                for (const url of upload.imageUrls) {
                    try {
                        const parts = url.split("/");
                        const filename = parts.pop();
                        const folder = parts.pop();
                        const public_id = `${folder}/${filename.split('.')[0]}`;
                        await cloudinary.uploader.destroy(public_id);
                    } catch (err) {}
                }
            }
        }
        await Upload.deleteMany({ userId });

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User and associated data deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
                .select("-contacts")
                .populate(
                    "userId",
                    "username"
                )
                .sort({
                    createdAt: -1,
                })
                .lean();

        res.status(200).json(
            uploads
        );

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};
// In your GET /admin/uploads endpoint
exports.getUploads = async (req, res) => {
    const { userId } = req.query;

    const query = userId ? { userId } : {};
    const uploads = await Upload.find(query).select("-contacts").populate('userId', 'username').lean();

    res.json({
        uploads,
        user: userId ? await User.findById(userId) : null
    });
};

// DELETE ALL UPLOADS
exports.deleteAllUploads = async (req, res) => {
    try {
        const uploads = await Upload.find().select("csvPath imageUrls").lean();
        
        for (const upload of uploads) {
            if (upload.csvPath && fs.existsSync(upload.csvPath)) {
                fs.unlinkSync(upload.csvPath);
            }
            if (upload.imageUrls && upload.imageUrls.length > 0) {
                for (const url of upload.imageUrls) {
                    try {
                        const parts = url.split("/");
                        const filename = parts.pop();
                        const folder = parts.pop();
                        const public_id = `${folder}/${filename.split('.')[0]}`;
                        await cloudinary.uploader.destroy(public_id);
                    } catch (err) {}
                }
            }
        }

        await Upload.deleteMany({});
        res.status(200).json({ message: "All uploads and files deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};