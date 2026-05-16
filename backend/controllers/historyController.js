const Upload = require("../models/Upload");


// GET HISTORY
exports.getHistory = async (req, res) => {

    try {

        const uploads = await Upload.find({
            userId: req.user.id,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json(uploads);

    } catch (error) {

        console.log("HISTORY ERROR:");
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};