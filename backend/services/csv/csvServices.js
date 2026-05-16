const createCsvWriter =
    require("csv-writer").createObjectCsvWriter;

const path = require("path");

const generateCSV = async (
    contacts,
    filename
) => {

    const csvPath = path.join(
        __dirname,
        "../../csv",
        `${filename}.csv`
    );

    const csvWriter = createCsvWriter({

        path: csvPath,

        header: [
            { id: "name", title: "Name" },
            { id: "phone", title: "Phone" },
        ],
    });

    await csvWriter.writeRecords(
        contacts
    );

    return csvPath;
};

module.exports = generateCSV;