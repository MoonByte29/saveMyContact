const path = require("path");

const extractTextFromImage =
    require("../services/ocr/ocrServices");

const extractPhoneNumbers =
    require("../services/parser/phoneParser");

const generateCSV =
    require("../services/csv/csvServices");

const Upload =
    require("../models/Upload");
const fs = require("fs");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

// PROCESS UPLOADS
exports.uploadImages = async (req, res) => {

    try {

        const files = req.files;

        if (!files || files.length === 0) {

            return res.status(400).json({
                message: "Please upload at least one image",
            });
        }

        const prefix =
            req.body.prefix || "Contact";

        let contacts = [];

        // Search for existing contacts with this prefix to continue numbering
        const previousUploads = await Upload.find(
            { userId: req.user.id },
            { "contacts.name": 1, _id: 0 }
        ).lean();

        let maxNumber = -1;
        previousUploads.forEach((u) => {
            if (!u.contacts) return;
            u.contacts.forEach((c) => {
                if (c.name === prefix) {
                    if (maxNumber < 0) maxNumber = 0;
                } else if (c.name.startsWith(prefix + " ")) {
                    const numPart = c.name.substring(prefix.length + 1);
                    const num = parseInt(numPart, 10);
                    if (!isNaN(num) && num > maxNumber) {
                        maxNumber = num;
                    }
                }
            });
        });

        // Track duplicate names
        const nameCount = {};
        if (maxNumber >= 0) {
            nameCount[prefix] = maxNumber;
        }

        const imageUrls = [];

        // LOOP THROUGH ALL FILES
        for (const file of files) {

            const imagePath = file.path; // Cloudinary URL
            imageUrls.push(imagePath);

            // Fetch image buffer for OCR
            const response = await fetch(imagePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch image for OCR: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const imageBuffer = Buffer.from(arrayBuffer);

            // OCR
            const text =
                await extractTextFromImage(
                    imageBuffer
                );

            console.log("OCR TEXT:");
            console.log(text);

            // Extract phone numbers
            const numbers =
                extractPhoneNumbers(text);

            console.log("NUMBERS:");
            console.log(numbers);

            // Generate contacts
            numbers.forEach((num) => {

                let contactName = prefix;

                // First occurrence
                if (nameCount[prefix] === undefined) {

                    nameCount[prefix] = 0;

                } else {

                    // Duplicate occurrence
                    nameCount[prefix]++;

                    contactName =
                        `${prefix} ${nameCount[prefix]}`;
                }

                contacts.push({
                    name: contactName,
                    phone: num.number,
                });
            });
        }

        // Remove duplicate phone numbers
        const uniqueContacts =
            Array.from(
                new Map(
                    contacts.map((item) => [
                        item.phone,
                        item,
                    ])
                ).values()
            );

        // Generate CSV
        const csvFilename =
            `contacts-${Date.now()}`;

        const csvPath =
            await generateCSV(
                uniqueContacts,
                csvFilename
            );

        // Save to database
        await Upload.create({

            userId: req.user.id,

            filename: csvFilename,

            originalName:
                files[0].originalname,

            imageUrls,

            totalNumbers:
                uniqueContacts.length,

            csvPath,

            contacts: uniqueContacts,
        });

        // Response
        res.status(200).json({

            message:
                "Phone numbers extracted successfully",

            total:
                uniqueContacts.length,

            contacts:
                uniqueContacts,

            csvFile:
                `${csvFilename}.csv`,
        });

    } catch (error) {

        console.log("UPLOAD ERROR:");
        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
};
// GET ALL UPLOADS FOR USER
exports.getUploads = async (req, res) => {
    try {
        const uploads = await Upload.find({ userId: req.user.id })
            .select("-contacts")
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            uploads,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// DOWNLOAD CSV
exports.downloadCSV = async (req, res) => {
    try {
        const upload = await Upload.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!upload) {
            return res.status(404).json({
                success: false,
                message: "Upload not found",
            });
        }

        const filePath = upload.csvPath;

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "CSV file not found",
            });
        }

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${upload.filename}.csv"`
        );

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE UPLOAD
exports.deleteUpload = async (req, res) => {
    try {
        const upload = await Upload.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!upload) {
            return res.status(404).json({
                success: false,
                message: "Upload not found",
            });
        }

        // Delete CSV file if exists
        if (upload.csvPath && fs.existsSync(upload.csvPath)) {
            fs.unlinkSync(upload.csvPath);
        }

        // Delete from Cloudinary
        if (upload.imageUrls && upload.imageUrls.length > 0) {
            for (const url of upload.imageUrls) {
                try {
                    const parts = url.split("/");
                    const filename = parts.pop();
                    const folder = parts.pop();
                    const public_id = `${folder}/${filename.split('.')[0]}`;
                    await cloudinary.uploader.destroy(public_id);
                } catch (err) {
                    console.error("Cloudinary cleanup error:", err);
                }
            }
        }

        await Upload.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Upload and files deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getUploadsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const uploads = await Upload.find({ userId })
            .select("-contacts")
            .sort({ createdAt: -1 })
            .populate("userId", "username email")
            .lean();

        const user = await User.findById(userId).select("username email");

        res.json({
            uploads,
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE all uploads for a user (admin only)
exports.deleteUploadsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

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

        res.json({ message: "All uploads and files deleted for user" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};