const extractPhoneNumbers = (text) => {

    // Clean OCR text
    const cleanedText = text
        .replace(/\n/g, " ")
        .replace(/[^0-9+]/g, " ");

    // Match Indian numbers with optional spaces
    const regex =
        /(?:\+91\s*)?[6-9]\d(?:\s*\d){9}/g;

    const matches =
        cleanedText.match(regex) || [];

    // Normalize numbers
    const normalizedNumbers =
        matches.map((num) =>
            num.replace(/\s/g, "")
        );

    // Remove duplicates
    const uniqueNumbers =
        [...new Set(normalizedNumbers)];

    return uniqueNumbers.map((num) => ({
        number: num,
    }));
};

module.exports = extractPhoneNumbers;