export const getResumeSkillExtractionPrompt = (resumeText: string) => `
You are an expert technical recruiter and skill analyzer.

Extract all technical skills from the resume text below.

Rules:
- Extract only hard technical skills.
- Ignore soft skills.
- Normalize skill names to standard industry terms.
- Avoid duplicates.
- Output only a JSON array of strings.
- Do not include explanations.

Resume Text:
${resumeText}

Return strictly:
["Skill1", "Skill2", "Skill3"]
`;
