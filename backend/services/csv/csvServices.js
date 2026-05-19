const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");

const generateCSV = async (contacts, filename) => {

    const csvPath = path.join(
        __dirname,
        "../../csv",
        `${filename}.csv`
    );

    // Ensure csv directory exists
    const csvDir = path.dirname(csvPath);
    if (!fs.existsSync(csvDir)) {
        fs.mkdirSync(csvDir, { recursive: true });
    }

    const fields = [
        { label: "Name", value: "name" },
        { label: "Phone", value: "phone" },
        { label: "Country", value: "country" },
        { label: "Valid", value: "valid" },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(contacts);

    fs.writeFileSync(csvPath, csv);

    return csvPath;
};

module.exports = generateCSV;