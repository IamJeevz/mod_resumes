const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const parseResume = require("../services/parseResume");
const optimizeResume = require("../services/aiService");
const createDocx = require("../services/generateDocx");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post(
    "/optimize",
    upload.single("resume"),
    async (req, res) => {

        try {

            const filePath = req.file.path;
            const originalName = req.file.originalname;

            const jd = req.body.jd;

const contactInfo = {

    fullName: req.body.fullName,

    phone: req.body.phone,

    email: req.body.email,

    linkedin: req.body.linkedin,

    address: req.body.address,

    achievements: req.body.achievements
};

            const resumeText = await parseResume(
                filePath,
                originalName
            );

            const optimizedData =
                await optimizeResume(
                    resumeText,
                    jd
                );

            if (!fs.existsSync("generated")) {
                fs.mkdirSync("generated");
            }

            const outputPath =
                `generated/resume_${Date.now()}.docx`;

       await createDocx(
    optimizedData,
    outputPath,
    contactInfo
);
            res.download(outputPath);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

module.exports = router;