const path = require("path");

const extractTextFromImage =
    require("../services/ocr/ocrServices");

const extractPhoneNumbers =
    require("../services/parser/phoneParser");

const generateCSV =
    require("../services/csv/csvServices");

const Upload =
    require("../models/Upload");


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

        // Track duplicate names
        const nameCount = {};

        // LOOP THROUGH ALL FILES
        for (const file of files) {

            const imagePath = path.join(
                __dirname,
                "../uploads",
                file.filename
            );

            // OCR
            const text =
                await extractTextFromImage(
                    imagePath
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
                if (!nameCount[prefix]) {

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