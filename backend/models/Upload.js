const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        filename: {
            type: String,
        },

        originalName: {
            type: String,
        },

        totalNumbers: {
            type: Number,
            default: 0,
        },

        csvPath: {
            type: String,
        },

        contacts: [
            {
                name: String,
                phone: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Upload",
    uploadSchema
);