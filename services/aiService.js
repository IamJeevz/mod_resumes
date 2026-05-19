const axios = require("axios");

function extractKeywords(text) {

    const stopWords = [
        "and", "the", "with", "for",
        "that", "this", "have",
        "from", "using", "within",
        "will", "your", "their"
    ];

    const matches =
        text.match(
            /\b[A-Za-z][A-Za-z+#./-]{2,}\b/g
        ) || [];

    return [
        ...new Set(
            matches
                .map(word =>
                    word.toLowerCase()
                )
                .filter(
                    word =>
                        !stopWords.includes(word)
                )
        )
    ];
}

async function optimizeResume(
    resumeText,
    jdText
) {

    const jdKeywords =
        extractKeywords(jdText);

    const resumeKeywords =
        extractKeywords(resumeText);

    const missingKeywords =
        jdKeywords.filter(
            keyword =>
                !resumeKeywords.includes(keyword)
        );

    console.log(
        "Missing Keywords:",
        missingKeywords
    );

    const prompt = `
You are a world-class ATS Resume Optimization AI.

OBJECTIVE:
Create a highly ATS-optimized resume aligned to the provided Job Description.

VERY IMPORTANT RULES:
- Include ALL relevant keywords from the Job Description naturally
- DO NOT keyword stuff unnaturally
- DO NOT invent fake companies or fake experience
- You MAY rewrite existing experience professionally
- Improve ATS matching aggressively
- Use strong action verbs
- Improve recruiter readability
- Match the JD wording closely
- Optimize for ATS systems

MISSING ATS KEYWORDS:
${missingKeywords.join(", ")}

JOB DESCRIPTION:
${jdText}

CURRENT RESUME:
${resumeText.substring(0, 15000)}

IMPORTANT OPTIMIZATION REQUIREMENTS:

1. Add missing ATS keywords naturally
2. Add exact testing terminology from JD
3. Improve skills section heavily
4. Rewrite experience bullets to align with JD
5. Add Agile terminology
6. Add CI/CD wording where relevant
7. Add documentation & traceability wording
8. Add testing methodologies from JD
9. Ensure ATS readability
10. Avoid tables or complex formatting

RETURN ONLY VALID JSON.

FORMAT:
{
  "name":"",
  "title":"",
  "summary":"",
  "skills":[],
  "experience":[
    {
      "company":"",
      "role":"",
      "duration":"",
      "points":[]
    }
  ],
  "projects":[
    {
      "name":"",
      "description":""
    }
  ],
  "education":""
}
`;

    try {

        const response =
            await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                },
                {
                    headers: {
                        "Content-Type":
                            "application/json",

                        "X-goog-api-key":
                            process.env.GEMINI_API_KEY
                    }
                }
            );

        const text =
            response.data.candidates[0]
                .content.parts[0].text;

        console.log(text);

        const cleaned =
            text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

        try {

            return JSON.parse(cleaned);

        } catch {

            console.log(
                "Invalid JSON returned"
            );

            return {
                name: "Generated Resume",
                title: "Software Test Engineer",
                summary: cleaned,
                skills: [],
                experience: [],
                projects: [],
                education: ""
            };
        }

    } catch (error) {

        console.log(
            error.response?.data ||
            error.message
        );

        throw new Error(
            "Gemini optimization failed"
        );
    }
}

module.exports = optimizeResume;