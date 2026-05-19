const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        uploadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Upload",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        country: {
            type: String,
        },

        valid: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Contact", contactSchema);