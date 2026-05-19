const Tesseract = require("tesseract.js");

async function test() {
    try {
        const url = "https://res.cloudinary.com/demo/image/upload/sample.jpg"; // A sample image
        console.log("Starting OCR on URL:", url);
        const result = await Tesseract.recognize(url, "eng", { logger: m => console.log(m.status) });
        console.log("Text:", result.data.text);
    } catch (err) {
        console.error("Tesseract Error:", err);
    }
}
test();
