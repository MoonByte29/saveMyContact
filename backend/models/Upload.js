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

        imageUrls: {
            type: [String],
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
                country: String,
                valid: Boolean,
            },
        ],

        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Upload", uploadSchema);