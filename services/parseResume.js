const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function parseResume(
    filePath,
    originalName
) {

    const ext =
        originalName
            .split(".")
            .pop()
            .toLowerCase();

    // PDF
    if (ext === "pdf") {

        const dataBuffer =
            fs.readFileSync(filePath);

        const data =
            await pdfParse(dataBuffer);

        return data.text;
    }

    // DOCX
    if (ext === "docx") {

        const result =
            await mammoth.extractRawText({
                path: filePath
            });

        return result.value;
    }

    throw new Error(
        "Only PDF and DOCX supported"
    );
}

module.exports = parseResume;