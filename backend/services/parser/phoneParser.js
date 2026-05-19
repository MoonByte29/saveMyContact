const extractPhoneNumbers = (text) => {

    console.log("========= OCR TEXT =========");
    console.log(text);

    // Normalize OCR text
    const cleanedText = text
        .replace(/\n/g, " ")
        .replace(/\s+/g, "")
        .replace(/-/g, "")
        .replace(/\(/g, "")
        .replace(/\)/g, "");

    console.log("====== CLEANED TEXT ======");
    console.log(cleanedText);

    // Match Indian mobile numbers
    const regex =
        /(?:\+91)?[6-9]\d{9}/g;

    const matches =
        cleanedText.match(regex) || [];

    console.log("====== MATCHES ======");
    console.log(matches);

    // Remove duplicates
    const uniqueNumbers =
        [...new Set(matches)];

    return uniqueNumbers.map((num) => ({
        number: num,
    }));
};

module.exports = extractPhoneNumbers;