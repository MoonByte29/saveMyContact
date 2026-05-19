const Tesseract = require("tesseract.js");

async function test() {
    try {
        const url = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
        console.log("Fetching URL...");
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        console.log("Starting OCR on Buffer...");
        const result = await Tesseract.recognize(buffer, "eng");
        console.log("Text:", result.data.text.substring(0, 100));
    } catch (err) {
        console.error("Error:", err);
    }
}
test();
