const fs = require("fs");

const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel
} = require("docx");

async function createDocx(
    data,
    outputPath,
    contactInfo
) {

    const children = [];

    children.push(
        new Paragraph({
            text: data.name,
            heading: HeadingLevel.TITLE
        })
    );

    children.push(
        new Paragraph({
            text: data.title
        })
    );
	
	children.push(
    new Paragraph({
        text:
            `${contactInfo.phone} | ` +
            `${contactInfo.email} | ` +
            `${contactInfo.linkedin}`
    })
);

if (contactInfo.address) {

    children.push(
        new Paragraph({
            text: contactInfo.address
        })
    );
}

    children.push(
        new Paragraph({
            text: "Professional Summary",
            heading: HeadingLevel.HEADING_1
        })
    );

    children.push(
        new Paragraph({
            text: data.summary
        })
    );

    children.push(
        new Paragraph({
            text: "Skills",
            heading: HeadingLevel.HEADING_1
        })
    );

    children.push(
        new Paragraph({
            text: data.skills.join(", ")
        })
    );

    children.push(
        new Paragraph({
            text: "Experience",
            heading: HeadingLevel.HEADING_1
        })
    );

    data.experience.forEach(exp => {

        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `${exp.role} - ${exp.company}`,
                        bold: true
                    })
                ]
            })
        );

        children.push(
            new Paragraph({
                text: exp.duration
            })
        );

        exp.points.forEach(point => {

            children.push(
                new Paragraph({
                    text: `• ${point}`
                })
            );
        });
    });

    children.push(
        new Paragraph({
            text: "Projects",
            heading: HeadingLevel.HEADING_1
        })
    );

    data.projects.forEach(project => {

        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: project.name,
                        bold: true
                    })
                ]
            })
        );

        children.push(
            new Paragraph({
                text: project.description
            })
        );
    });

    children.push(
        new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_1
        })
    );

    children.push(
        new Paragraph({
            text: data.education
        })
    );
	
	if (
    contactInfo.achievements &&
    contactInfo.achievements.trim() !== ""
) {

    children.push(
        new Paragraph({
            text: "Achievements",
            heading: HeadingLevel.HEADING_1
        })
    );

    const achievementLines =
        contactInfo.achievements
            .split("\n");

    achievementLines.forEach(item => {

        if (item.trim()) {

            children.push(
                new Paragraph({
                    text: `• ${item.trim()}`
                })
            );
        }
    });
}

    const doc = new Document({
        sections: [
            {
                children
            }
        ]
    });

    const buffer =
        await Packer.toBuffer(doc);

    fs.writeFileSync(
        outputPath,
        buffer
    );
}

module.exports = createDocx;